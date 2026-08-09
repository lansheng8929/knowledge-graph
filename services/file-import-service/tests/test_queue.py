"""全局串行队列单元测试（MemoryTaskQueue：单 worker 串行消费）。"""

import threading
import time

from app.queue import MemoryTaskQueue


class _FakeTask:
    def __init__(self, tid):
        self.id = tid


def test_memory_queue_fifo_serial_execution():
    """入队顺序 = 执行顺序（串行，一次一个）。"""
    done = []
    lock = threading.Lock()
    queue = MemoryTaskQueue(handler=lambda tid: done.append(tid))
    queue.start()
    try:
        for i in range(5):
            queue.enqueue(_FakeTask(f"t{i}"))
        for _ in range(200):
            if len(done) >= 5:
                break
            time.sleep(0.02)
    finally:
        queue.stop()
    assert done == ["t0", "t1", "t2", "t3", "t4"]


def test_memory_queue_waits_when_empty():
    """空队列时 worker 阻塞等待，入队后继续消费。"""
    done = []
    queue = MemoryTaskQueue(handler=lambda tid: done.append(tid), poll_interval=0.01)
    queue.start()
    try:
        time.sleep(0.05)  # 空队列等待期，不应有任何消费
        assert done == []
        queue.enqueue(_FakeTask("later"))
        for _ in range(200):
            if done == ["later"]:
                break
            time.sleep(0.02)
        assert done == ["later"]
    finally:
        queue.stop()


def test_memory_queue_stop_noop_release():
    """stop 幂等且安全（release 无操作）。"""
    queue = MemoryTaskQueue(handler=lambda tid: None)
    queue.start()
    queue.stop()
    queue.stop()  # 二次 stop 不报错
