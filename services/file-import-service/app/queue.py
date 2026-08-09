"""全局串行任务队列：一次只处理一个主任务，完成后再取下一个。

实现（docs/intimacy-pipeline-plan.md §4.2）：
- **MemoryTaskQueue**：进程内 queue.Queue + 单 worker 线程（dev / TASK_STORE=memory）。
- **PostgresTaskQueue**：基于 import_tasks 表 + Postgres **advisory lock** 实现全局串行；
  任意时刻只有一个 worker 能持有锁并处理主任务，处理完成才放锁取下一个
  （多进程部署也天然正确，无需自研分布式锁）。

统一接口：enqueue(task) / start(handler) / stop()
- handler(task_id) 由调用方提供：执行主任务的 pipeline 并更新任务状态。
"""

from __future__ import annotations

import logging
import queue as _queue
import threading
import time
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)

# Postgres advisory lock key（固定常量，全局唯一）
_ADVISORY_LOCK_KEY = 0x4B47_494D_5030  # "KGIMP0"

# 全局串行锁持有期间，其它 worker 的 pg_advisory_lock 会阻塞等待
_QUEUED_SQL = (
    "SELECT id FROM import_tasks "
    "WHERE status='queued' "
    "ORDER BY created_at ASC, seq ASC "
    "LIMIT 1 FOR UPDATE SKIP LOCKED"
)


class TaskQueue:
    """统一队列接口（Memory / Postgres 两种实现）。"""

    def __init__(
        self,
        handler: Callable[[str], None],
        poll_interval: float = 1.0,
    ) -> None:
        self._handler = handler
        self.poll_interval = poll_interval
        self._stop = threading.Event()
        self._thread: Optional[threading.Thread] = None

    # ── 子类实现 ──────────────────────────────────────
    def enqueue(self, task: Any) -> None:
        raise NotImplementedError

    def acquire(self) -> Optional[str]:
        """取下一个待处理主任务 id；没有则返回 None。"""
        raise NotImplementedError

    def release(self) -> None:
        """处理完释放资源（Postgres 放锁关连接；Memory 无操作）。"""
        raise NotImplementedError

    # ── 共享：单 worker 线程，串行执行 ────────────────
    def start(self) -> None:
        if self._thread is None:
            self._thread = threading.Thread(
                target=self._run, name="task-queue-worker", daemon=True
            )
            self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=5)
        self.release()

    def _run(self) -> None:
        while not self._stop.is_set():
            try:
                task_id = self.acquire()
            except Exception:  # noqa: BLE001
                # acquire 失败（如 DB 抖动）不能杀死 worker 线程：记录后重试
                logger.exception("queue acquire failed; will retry")
                self._stop.wait(self.poll_interval)
                continue
            if task_id is None:
                self._stop.wait(self.poll_interval)
                continue
            try:
                self._handler(task_id)
            except Exception:  # noqa: BLE001
                logger.exception("task handler failed for %s", task_id)
            finally:
                self.release()


class MemoryTaskQueue(TaskQueue):
    """进程内队列：enqueue 入队，单 worker 线程串行消费。"""

    def __init__(self, handler: Callable[[str], None], poll_interval: float = 1.0):
        super().__init__(handler, poll_interval)
        self._queue: _queue.Queue = _queue.Queue()

    def enqueue(self, task: Any) -> None:
        self._queue.put(task.id)

    def acquire(self) -> Optional[str]:
        try:
            return self._queue.get_nowait()
        except _queue.Empty:
            return None

    def release(self) -> None:
        pass


class PostgresTaskQueue(TaskQueue):
    """Postgres 队列：advisory lock 全局串行 + FOR UPDATE SKIP LOCKED 抢任务。"""

    def __init__(
        self,
        dsn: str,
        handler: Callable[[str], None],
        poll_interval: float = 1.0,
    ) -> None:
        super().__init__(handler, poll_interval)
        import psycopg  # 延迟导入：memory 模式不依赖 psycopg

        self._psycopg = psycopg
        self._dsn = dsn
        self._lease_conn: Optional[Any] = None

    def enqueue(self, task: Any) -> None:
        # 无操作：PostgresTaskStore.create 时 status='queued' 即已入队
        pass

    def acquire(self) -> Optional[str]:
        conn = self._psycopg.connect(self._dsn)
        try:
            # 全局串行：阻塞直到获得锁（持有期间其它 worker 在此等待）
            conn.execute(
                "SELECT pg_advisory_lock(%s)", (_ADVISORY_LOCK_KEY,)
            ).fetchone()
            row = conn.execute(_QUEUED_SQL).fetchone()
            if row is None:
                conn.execute(
                    "SELECT pg_advisory_unlock(%s)", (_ADVISORY_LOCK_KEY,)
                ).fetchone()
                conn.close()
                return None
            conn.execute(
                "UPDATE import_tasks SET status='running' WHERE id=%s", (row[0],)
            )
            # 关键：提交事务，释放 FOR UPDATE 行锁，让 status='running' 立即可见。
            # advisory lock 是会话级，commit 不会释放 → 仍由 _lease_conn 保持，
            # 直到 handler 完成、release() 关闭连接才真正放锁（全局串行不变）。
            # 若不 commit：行锁会阻塞 handler 内其它连接对同一行的 UPDATE → 自死锁。
            conn.commit()
            self._lease_conn = conn
            return row[0]
        except Exception:
            conn.close()
            raise

    def release(self) -> None:
        if self._lease_conn is not None:
            try:
                self._lease_conn.execute(
                    "SELECT pg_advisory_unlock(%s)", (_ADVISORY_LOCK_KEY,)
                ).fetchone()
            finally:
                self._lease_conn.close()
                self._lease_conn = None


def create_task_queue(kind: str, dsn: str, handler: Callable[[str], None]) -> TaskQueue:
    """按配置创建队列（postgres | memory）。"""
    if kind == "postgres":
        return PostgresTaskQueue(dsn, handler)
    return MemoryTaskQueue(handler)
