import { chatService } from "../services/chat"
import type { ChatMessage, ChatSession } from "../types/chat"
import { chatDB } from "../utils/db"

const template = document.createElement("template")
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      --primary: 59, 130, 246;
      --primary-foreground: 255, 255, 255;
      --background: 15, 23, 42;
      --surface: 30, 41, 59;
      --foreground: 226, 232, 240;
      --muted-foreground: 148, 163, 184;
      --border: 51, 65, 85;
      --danger: 239, 68, 68;
      /* Design Engineering：UI 交互统一用强 ease-out 曲线 */
      --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    }

    * {
      box-sizing: border-box;
    }

    .chat-container {
      display: flex;
      width: 100%;
      height: 100%;
      background: rgb(var(--background));
      color: rgb(var(--foreground));
    }

    .chat-fab {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 1000;
      width: 56px;
      height: 56px;
      border: none;
      border-radius: 50%;
      background: rgb(var(--primary));
      color: rgb(var(--primary-foreground));
      font-size: 22px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgb(0 0 0 / 0.4);
      transition:
        transform 160ms var(--ease-out),
        box-shadow 160ms var(--ease-out),
        background 160ms var(--ease-out);
    }
    .chat-fab:active {
      transform: scale(0.95);
    }

    .chat-panel {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 1000;
      width: min(720px, calc(100vw - 48px));
      height: min(72vh, 620px);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgb(var(--border));
      box-shadow: 0 24px 60px rgb(0 0 0 / 0.5);
      opacity: 0;
      transform: scale(0.95) translateY(8px);
      transform-origin: bottom left; /* 锚定左下角按钮，从按钮处展开 */
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity 200ms var(--ease-out),
        transform 200ms var(--ease-out),
        visibility 0s linear 200ms; /* 关闭时延迟隐藏，等位移淡出结束 */
    }
    :host([open]) .chat-fab {
      display: none;
    }
    :host([open]) .chat-panel {
      opacity: 1;
      transform: none;
      visibility: visible;
      pointer-events: auto;
      transition:
        opacity 200ms var(--ease-out),
        transform 200ms var(--ease-out);
    }

    .chat-sidebar {
      width: 260px;
      border-right: 1px solid rgb(var(--border));
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgb(var(--surface));
      flex-shrink: 0;
    }

    .new-chat-btn {
      padding: 10px;
      border: 1px solid rgb(var(--border));
      border-radius: 6px;
      background: transparent;
      color: rgb(var(--foreground));
      cursor: pointer;
      font-size: 14px;
      /* 精确属性过渡（不用 transition: all）+ 按压缩放反馈 */
      transition:
        background 160ms var(--ease-out),
        color 160ms var(--ease-out),
        border-color 160ms var(--ease-out),
        transform 160ms var(--ease-out);
    }
    .new-chat-btn:active {
      transform: scale(0.97);
    }

    .session-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 160ms var(--ease-out);
      font-size: 14px;
    }

    .session-item.active {
      background: rgba(var(--primary), 0.15);
      border-left: 3px solid rgb(var(--primary));
    }

    .session-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .delete-btn {
      background: none;
      border: none;
      color: rgb(var(--muted-foreground));
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
      opacity: 0;
      transition:
        opacity 160ms var(--ease-out),
        transform 160ms var(--ease-out);
    }
    .delete-btn:active {
      transform: scale(0.92);
    }

    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgb(var(--background));
      min-width: 0;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-bottom: 1px solid rgb(var(--border));
      background: rgb(var(--surface));
      flex-shrink: 0;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 16px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-close {
      background: none;
      border: none;
      color: rgb(var(--muted-foreground));
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 4px 6px;
      border-radius: 6px;
      transition:
        color 160ms var(--ease-out),
        background 160ms var(--ease-out),
        transform 160ms var(--ease-out);
    }
    .chat-close:active {
      transform: scale(0.92);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .load-more {
      text-align: center;
      padding: 8px;
    }

    .load-more button {
      padding: 6px 12px;
      background: transparent;
      border: 1px solid rgb(var(--border));
      border-radius: 4px;
      color: rgb(var(--muted-foreground));
      cursor: pointer;
      font-size: 12px;
      transition:
        background 160ms var(--ease-out),
        transform 160ms var(--ease-out);
    }
    .load-more button:active:not(:disabled) {
      transform: scale(0.97);
    }
    .load-more button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .message {
      display: flex;
      gap: 12px;
      max-width: 80%;
    }
    /* 仅新消息进入有动画：列表导航/切换不重放，避免整屏闪烁 */
    .message.enter {
      animation: fadeIn 200ms var(--ease-out) both;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      background: rgb(var(--surface));
      border: 1px solid rgb(var(--border));
      flex-shrink: 0;
    }

    .message-content {
      padding: 10px 14px;
      border-radius: 8px;
      background: rgb(var(--surface));
      border: 1px solid rgb(var(--border));
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .message.user .message-content {
      background: rgb(var(--primary));
      color: rgb(var(--primary-foreground));
      border-color: rgb(var(--primary));
    }

    .message.assistant .message-content {
      background: rgb(var(--surface));
    }

    .message.streaming .message-content {
      border-color: rgb(var(--primary));
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .chat-input {
      padding: 16px 24px;
      border-top: 1px solid rgb(var(--border));
      background: rgb(var(--surface));
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }

    .chat-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid rgb(var(--border));
      border-radius: 6px;
      background: rgb(var(--background));
      color: rgb(var(--foreground));
      font-size: 14px;
      outline: none;
      transition: border-color 160ms var(--ease-out);
    }

    .chat-input input:focus {
      border-color: rgb(var(--primary));
    }

    .chat-input input:disabled {
      opacity: 0.6;
    }

    .chat-input button {
      padding: 10px 24px;
      background: rgb(var(--primary));
      color: rgb(var(--primary-foreground));
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition:
        opacity 160ms var(--ease-out),
        transform 160ms var(--ease-out);
    }
    .chat-input button:active:not(:disabled) {
      transform: scale(0.97);
    }
    .chat-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgb(var(--muted-foreground));
      font-size: 16px;
    }

    /* 触摸设备 hover 会误触发 → 只对精指针设备启用 hover 效果 */
    @media (hover: hover) and (pointer: fine) {
      .new-chat-btn:hover {
        background: rgb(var(--primary));
        color: rgb(var(--primary-foreground));
        border-color: rgb(var(--primary));
      }
      .session-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .session-item:hover .delete-btn {
        opacity: 1;
      }
      .delete-btn:hover {
        color: rgb(var(--danger));
      }
      .load-more button:hover:not(:disabled) {
        background: rgba(var(--border), 0.2);
      }
      .chat-input button:hover:not(:disabled) {
        opacity: 0.9;
      }
      .chat-close:hover {
        color: rgb(var(--foreground));
        background: rgba(var(--border), 0.3);
      }
    }

    /* 减弱动效：保留 opacity 淡入，去除位移与循环闪烁 */
    @media (prefers-reduced-motion: reduce) {
      .message.enter {
        animation: fadeInReduced 150ms ease-out both;
      }
      .message.streaming .message-content {
        animation: none;
      }
      .new-chat-btn:active,
      .delete-btn:active,
      .chat-close:active,
      .load-more button:active:not(:disabled),
      .chat-input button:active:not(:disabled) {
        transform: none;
      }
      .chat-panel {
        transform: none;
      }
    }
    @keyframes fadeInReduced {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
  <button class="chat-fab" aria-label="打开聊天">💬</button>
  <div class="chat-panel">
  <div class="chat-container">
    <div class="chat-sidebar">
      <button class="new-chat-btn">+ 新对话</button>
      <div class="session-list"></div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <h3>新对话</h3>
        <button class="chat-close" aria-label="收起聊天">✕</button>
      </div>
      <div class="chat-messages">
        <div class="empty-state">开始你的第一次对话吧</div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="输入消息..." />
        <button>发送</button>
      </div>
    </div>
  </div>
  </div>
`

interface ChatElements {
  fab: HTMLButtonElement
  closeBtn: HTMLButtonElement
  sessionList: HTMLElement
  newChatBtn: HTMLButtonElement
  chatHeader: HTMLElement
  chatMessages: HTMLElement
  input: HTMLInputElement
  sendBtn: HTMLButtonElement
  emptyState: HTMLElement
}

export class ChatComponent extends HTMLElement {
  private sessions: ChatSession[] = []
  private currentSession: ChatSession | null = null
  private messages: ChatMessage[] = []
  private isStreaming: boolean = false
  private streamingContent: string = ""
  private hasMoreHistory: boolean = true
  private loadingHistory: boolean = false
  private userId: string | null = null
  private username: string | null = null
  private _initialized = false

  private elements!: ChatElements
  private shadow!: ShadowRoot

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    this.shadow.appendChild(template.content.cloneNode(true))
  }

  connectedCallback(): void {
    if (!this.initialize()) {
      this.renderError("未登录：请先登录")
    }
  }

  private resolveUser(): { uid: string; username: string } {
    const uid = this.getAttribute("user-id")
    const username = this.getAttribute("username")
    return uid && username ? { uid, username } : { uid: "", username: "" }
  }

  private initialize(): boolean {
    const user = this.resolveUser()
    if (!user.uid || !user.username) return false

    this.userId = user.uid
    this.username = user.username
    chatService.setUser(this.userId, this.username)

    if (!this._initialized) {
      this._initialized = true
      this.initElements()
      this.bindEvents()
    }
    this.loadSessions()
    return true
  }

  private initElements(): void {
    this.elements = {
      fab: this.shadow.querySelector(".chat-fab") as HTMLButtonElement,
      closeBtn: this.shadow.querySelector(".chat-close") as HTMLButtonElement,
      sessionList: this.shadow.querySelector(".session-list") as HTMLElement,
      newChatBtn: this.shadow.querySelector(
        ".new-chat-btn",
      ) as HTMLButtonElement,
      chatHeader: this.shadow.querySelector(".chat-header h3") as HTMLElement,
      chatMessages: this.shadow.querySelector(".chat-messages") as HTMLElement,
      input: this.shadow.querySelector(".chat-input input") as HTMLInputElement,
      sendBtn: this.shadow.querySelector(
        ".chat-input button",
      ) as HTMLButtonElement,
      emptyState: this.shadow.querySelector(".empty-state") as HTMLElement,
    }
  }

  private bindEvents(): void {
    this.elements.fab.addEventListener("click", () => this.setOpen(true))
    this.elements.closeBtn.addEventListener("click", () => this.setOpen(false))
    this.elements.newChatBtn.addEventListener("click", () =>
      this.createNewSession(),
    )
    this.elements.sendBtn.addEventListener("click", () => this.handleSend())
    this.elements.input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.handleSend()
      }
    })
  }

  private setOpen(open: boolean): void {
    this.toggleAttribute("open", open)
    if (open) requestAnimationFrame(() => this.elements?.input?.focus())
  }

  private async loadSessions(): Promise<void> {
    try {
      const list = await chatService.getSessions()
      this.sessions = list
      this.renderSessions()

      if (list.length > 0) {
        this.selectSession(list[0])
      } else {
        this.createNewSession()
      }
    } catch (error) {
      console.error("加载会话失败:", error)
    }
  }

  private renderSessions(): void {
    const list = this.elements.sessionList
    list.innerHTML = ""

    this.sessions.forEach((session) => {
      const item = document.createElement("div")
      item.className = `session-item${this.currentSession?.id === session.id ? " active" : ""}`

      const title = document.createElement("span")
      title.className = "session-title"
      title.textContent = session.title || "新对话"

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "delete-btn"
      deleteBtn.textContent = "×"
      deleteBtn.addEventListener("click", (e: Event) => {
        e.stopPropagation()
        this.handleDeleteSession(session.id)
      })

      item.appendChild(title)
      item.appendChild(deleteBtn)

      item.addEventListener("click", () => this.selectSession(session))

      list.appendChild(item)
    })
  }

  private async selectSession(session: ChatSession): Promise<void> {
    this.currentSession = session
    this.messages = session.messages || []
    this.hasMoreHistory = true
    this.renderMessages()
    this.renderSessions()
    this.elements.chatHeader.textContent = session.title || "新对话"
    this.elements.emptyState.style.display = "none"
  }

  private async createNewSession(): Promise<void> {
    const session = await chatService.createSession()
    this.sessions = [session, ...this.sessions]
    this.selectSession(session)
    this.renderSessions()
  }

  private async handleDeleteSession(sessionId: string): Promise<void> {
    if (!confirm("确定要删除这个会话吗？")) return

    try {
      await chatService.deleteSession(sessionId)
      this.sessions = this.sessions.filter((s) => s.id !== sessionId)

      if (this.currentSession?.id === sessionId) {
        if (this.sessions.length > 0) {
          this.selectSession(this.sessions[0])
        } else {
          this.createNewSession()
        }
      } else {
        this.renderSessions()
      }
    } catch (error) {
      console.error("删除失败:", error)
    }
  }

  private renderMessages(animateLast = false): void {
    const container = this.elements.chatMessages
    container.innerHTML = ""

    if (this.messages.length === 0) {
      container.innerHTML =
        '<div class="empty-state">开始你的第一次对话吧</div>'
      return
    }

    // 添加 load-more
    if (this.hasMoreHistory) {
      const loadMore = document.createElement("div")
      loadMore.className = "load-more"
      const btn = document.createElement("button")
      btn.textContent = this.loadingHistory ? "加载中..." : "加载更早的消息"
      btn.disabled = this.loadingHistory
      btn.addEventListener("click", () => this.loadMoreHistory())
      loadMore.appendChild(btn)
      container.appendChild(loadMore)
    }

    this.messages.forEach((msg) => {
      const div = document.createElement("div")
      div.className = `message ${msg.role}`

      const avatar = document.createElement("div")
      avatar.className = "message-avatar"
      avatar.textContent = msg.role === "user" ? "👤" : "🤖"

      const content = document.createElement("div")
      content.className = "message-content"
      content.textContent = msg.content

      div.appendChild(avatar)
      div.appendChild(content)
      container.appendChild(div)
    })

    // 仅新消息进入有动画（列表导航/切换不重放）
    if (animateLast) {
      container.lastElementChild?.classList.add("enter")
    }

    // 滚动到底部
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 100)
  }

  private async loadMoreHistory(): Promise<void> {
    if (!this.currentSession || this.loadingHistory || !this.hasMoreHistory)
      return

    this.loadingHistory = true
    try {
      const firstMsg = this.messages[0]
      const beforeSeq = firstMsg?.seq
      const oldMessages = await chatService.getMessages(
        this.currentSession.id,
        beforeSeq,
        50,
      )

      if (oldMessages.length < 50) {
        this.hasMoreHistory = false
      }

      this.messages = [...oldMessages, ...this.messages]

      const updatedSession: ChatSession = {
        ...this.currentSession,
        messages: this.messages,
      }
      this.currentSession = updatedSession
      await chatDB.saveSession(updatedSession)

      this.renderMessages()
    } catch (error) {
      console.error("加载历史失败:", error)
    } finally {
      this.loadingHistory = false
    }
  }

  private async handleSend(): Promise<void> {
    if (!this.userId || !this.username) {
      this.renderError("用户信息缺失，无法发送")
      return
    }

    const input = this.elements.input
    const message = input.value.trim()

    if (!message || this.isStreaming || !this.currentSession) return

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }

    this.messages = [...this.messages, userMessage]
    this.elements.emptyState.style.display = "none"

    const updatedSession: ChatSession = {
      ...this.currentSession,
      messages: this.messages,
      updatedAt: Date.now(),
    }
    this.currentSession = updatedSession
    await chatDB.saveSession(updatedSession)

    this.renderMessages(true) // 用户消息进入动画
    input.value = ""
    input.disabled = true
    this.elements.sendBtn.disabled = true
    this.isStreaming = true
    this.streamingContent = ""

    // 添加流式消息占位
    const container = this.elements.chatMessages
    const streamingDiv = document.createElement("div")
    streamingDiv.className = "message assistant streaming enter"
    streamingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content"></div>
    `
    container.appendChild(streamingDiv)
    container.scrollTop = container.scrollHeight

    const onChunk = (chunk: string) => {
      this.streamingContent += chunk
      const contentDiv = streamingDiv.querySelector(".message-content")
      if (contentDiv) {
        contentDiv.textContent = this.streamingContent
      }
      container.scrollTop = container.scrollHeight
    }
    const onDone = async (fullResponse: string, newSessionId?: string) => {
      streamingDiv.className = "message assistant"

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: fullResponse,
        timestamp: Date.now(),
      }

      this.messages = [...this.messages, assistantMessage]
      this.isStreaming = false
      this.streamingContent = ""

      if (newSessionId && newSessionId !== this.currentSession?.id) {
        const current = this.currentSession
        if (current) {
          const oldId = current.id
          await chatDB.deleteSession(oldId)

          const newSession: ChatSession = {
            id: newSessionId,
            userId: current.userId,
            title: current.title,
            messages: this.messages,
            updatedAt: Date.now(),
            createdAt: current.createdAt,
          }

          await chatDB.saveSession(newSession)
          this.currentSession = newSession

          this.sessions = this.sessions.map((s) =>
            s.id === oldId ? newSession : s,
          )
        }
      } else if (this.currentSession) {
        const finalSession: ChatSession = {
          ...this.currentSession,
          messages: this.messages,
          updatedAt: Date.now(),
        }
        await chatDB.saveSession(finalSession)
        this.currentSession = finalSession

        this.sessions = this.sessions.map((s) =>
          s.id === this.currentSession?.id ? finalSession : s,
        )
      }

      this.renderMessages(true) // 助手回复进入动画
      this.renderSessions()
      input.disabled = false
      this.elements.sendBtn.disabled = false
      input.focus()
    }
    const onError = (error: string) => {
      console.error("发送失败:", error)
      streamingDiv.className = "message assistant"
      const contentDiv = streamingDiv.querySelector(".message-content")
      if (contentDiv) {
        contentDiv.textContent = "❌ 发送失败: " + error
      }
      this.isStreaming = false
      this.streamingContent = ""
      input.disabled = false
      this.elements.sendBtn.disabled = false
    }

    await chatService.sendMessage(
      message,
      this.currentSession.id.startsWith("local_")
        ? null
        : this.currentSession.id,
      onChunk,
      onDone,
      onError,
    )
  }

  private renderError(message: string): void {
    console.error("renderError", message)
  }
}

customElements.define("chat-component", ChatComponent)
