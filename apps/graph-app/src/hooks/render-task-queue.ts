/**
 * 渲染任务队列（生产者-消费者）。
 *
 * 语义：
 * - 生产者（可与消费并行）：enqueue() 提交任务；close() 声明不再有新任务
 * - 消费者（串行）：内部循环逐个执行 worker(task, isFinal)，
 *   当前任务完成才取下一个；队列清空且已 close 时队列完成（waitDone 返回）
 * - 取消：cancel() 立即丢弃剩余任务并停止消费；
 *   也可通过构造参数 shouldStop 谓词（如加载纪元变化）让循环自行退出
 * - isFinal：出队时若队列已空且已 close，则该任务是最后一个——
 *   交给 worker 决定是否做更充分的收尾（如最终稳定后再取景）
 */
export class RenderTaskQueue<T> {
  private readonly queue: T[] = []
  private closed = false
  private cancelled = false
  private running = false
  private done = false
  private wake: (() => void) | null = null
  private readonly doneWaiters: Array<() => void> = []

  constructor(
    /** 单个任务的执行体（消费方语义）：入图 / 模拟 / 取景等 */
    private readonly worker: (task: T, isFinal: boolean) => Promise<void>,
    /** 环境触发停止的谓词（如新加载开始、组件卸载）；返回 true 则循环退出 */
    private readonly shouldStop?: () => boolean,
  ) {}

  /** 生产者：入队一个任务（可随时并行调用）；消费循环未启动则自动启动 */
  enqueue(task: T): void {
    if (this.cancelled) return
    this.queue.push(task)
    this.wake?.()
    void this.consume()
  }

  /** 生产者：声明不再有新任务；剩余任务执行完后队列完成 */
  close(): void {
    this.closed = true
    this.wake?.()
  }

  /** 取消：丢弃剩余任务并立即停止消费（用于新加载/组件卸载） */
  cancel(): void {
    this.cancelled = true
    this.queue.length = 0
    this.wake?.()
    this.finish()
  }

  /** 等待队列完成（已 close 且任务全部执行完，或已取消/停止） */
  async waitDone(): Promise<void> {
    if (this.done) return
    await new Promise<void>((resolve) => this.doneWaiters.push(resolve))
  }

  /** 消费者主循环：串行取任务执行，直到停止条件成立 */
  private async consume(): Promise<void> {
    if (this.running) return
    this.running = true
    try {
      while (!this.cancelled && !this.shouldStop?.()) {
        // 等待任务入队、close 或停止信号
        while (
          this.queue.length === 0 &&
          !this.closed &&
          !this.cancelled &&
          !this.shouldStop?.()
        ) {
          await new Promise<void>((resolve) => {
            this.wake = resolve
          })
          this.wake = null
          // 唤醒后先看是否已被取消/停止，避免多执行一个任务
          if (this.cancelled || this.shouldStop?.()) return
        }
        if (this.queue.length === 0) return // 已 close 或停止 → 退出
        const task = this.queue.shift()!
        const isFinal = this.queue.length === 0 && this.closed
        await this.worker(task, isFinal)
      }
    } finally {
      this.running = false
      this.finish()
    }
  }

  private finish(): void {
    if (this.done) return
    this.done = true
    this.doneWaiters.splice(0).forEach((resolve) => resolve())
  }
}
