import { LitElement, css, html } from "lit"
import type { TemplateResult } from "lit"
import { chatService } from "../services/chat"
import type { ChatMessage, ChatSession, ToolCallEvent } from "../types/chat"
import { chatDB } from "../utils/db"
import { getSharedBaseSheet } from "../styles/global-sheets"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { renderMarkdown } from "../utils/markdown"

export class ChatComponent extends LitElement {
  static styles = [
    getSharedBaseSheet(),
    css`
      :host {
        display: block;
        font-family: system-ui, sans-serif;
        --glass-bg: rgb(var(--surface) / 0.42);
        --glass-surface: rgb(var(--surface) / 0.4);
        --glass-surface-strong: rgb(var(--surface) / 0.62);
        --glass-border: rgb(var(--border) / 0.55);
        --glass-hairline: rgb(255 255 255 / 0.08);
        --blur: blur(24px) saturate(180%);
      }
      * {
        box-sizing: border-box;
      }
      .chat-container {
        display: flex;
        width: 100%;
        height: 100%;
        color: rgb(var(--foreground));
      }
      .chat-fab {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 1000;
        width: 56px;
        height: 56px;
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          rgb(var(--primary)) 0%,
          rgb(var(--primary) / 0.82) 100%
        );
        color: rgb(var(--primary-foreground));
        font-size: 22px;
        cursor: pointer;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow:
          var(--shadow),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
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
        width: min(760px, calc(100vw - 48px));
        height: min(74vh, 640px);
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--glass-border);
        background: var(--glass-bg);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
        box-shadow:
          var(--shadow-lg),
          inset 0 1px 0 var(--glass-hairline);
        opacity: 0;
        transform: scale(0.95) translateY(8px);
        transform-origin: bottom left;
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 200ms var(--ease-out),
          transform 200ms var(--ease-out),
          visibility 0s linear 200ms;
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
        width: 48px;
        border-right: 1px solid transparent;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: var(--glass-surface-strong);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
        flex-shrink: 0;
        overflow: hidden;
        transition:
          width 240ms var(--ease-out),
          border-color 240ms var(--ease-out);
      }
      .chat-sidebar.open {
        width: var(--sidebar-width, 224px);
        border-right-color: var(--glass-border);
      }
      .chat-sidebar.resizing,
      .chat-sidebar.resizing.open {
        transition: none;
      }
      .chat-sidebar:not(.open) + .resize-handle {
        display: none;
      }
      .resize-handle {
        position: relative;
        width: 6px;
        flex-shrink: 0;
        cursor: col-resize;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }
      .resize-handle::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        transform: translateX(-50%);
        background: var(--glass-border);
        opacity: 0;
        transition: opacity 160ms var(--ease-out);
      }
      .resize-handle:hover::after,
      .resize-handle.dragging::after {
        opacity: 1;
        background: rgb(var(--primary) / 0.7);
      }
      .chat-sidebar:not(.open) .session-list {
        display: none;
      }
      .chat-sidebar:not(.open) .new-chat-label {
        display: none;
      }
      .chat-sidebar:not(.open) .new-chat-btn {
        padding: 8px 0;
        font-size: 18px;
      }
      .chat-sidebar:not(.open) .session-box-0 {
        flex-direction: column;
      }
      .chat-sidebar:not(.open) .sidebar-toggle {
        order: -1;
      }
      .session-box-0 {
        display: flex;
        align-items: stretch;
        gap: 8px;
      }
      .sidebar-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: rgb(var(--background) / 0.4);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: rgb(var(--foreground));
        cursor: pointer;
        font-size: 15px;
        line-height: 1;
        padding: 7px 9px;
        transition:
          background 160ms var(--ease-out),
          transform 160ms var(--ease-out);
      }
      .sidebar-toggle:active {
        transform: scale(0.92);
      }
      .header-menu {
        display: none;
        align-items: center;
        justify-content: center;
        background: rgb(var(--background) / 0.4);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: rgb(var(--foreground));
        cursor: pointer;
        font-size: 15px;
        line-height: 1;
        padding: 7px 9px;
        transition:
          background 160ms var(--ease-out),
          transform 160ms var(--ease-out);
      }
      .header-menu:active {
        transform: scale(0.92);
      }
      .sidebar-backdrop {
        display: none;
      }
      .new-chat-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        gap: 6px;
        padding: 10px;
        border: 1px solid rgb(var(--border));
        border-radius: 6px;
        background: transparent;
        color: rgb(var(--foreground));
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
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
        background: rgb(var(--primary) / 0.15);
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
        min-width: 0;
      }
      .chat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        border-bottom: 1px solid var(--glass-border);
        background: var(--glass-surface);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
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
        background: rgb(var(--surface) / 0.55);
        border: 1px solid var(--glass-border);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
        flex-shrink: 0;
      }
      .message-content {
        padding: 10px 14px;
        border-radius: 10px;
        background: rgb(var(--surface) / 0.5);
        border: 1px solid var(--glass-border);
        box-shadow: inset 0 1px 0 var(--glass-hairline);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
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
        background: rgb(var(--surface) / 0.6);
      }
      .message-content.markdown {
        white-space: normal;
      }
      .message-content.markdown > :first-child {
        margin-top: 0;
      }
      .message-content.markdown > :last-child {
        margin-bottom: 0;
      }
      .message-content.markdown p {
        margin: 0 0 8px;
      }
      .message-content.markdown h1,
      .message-content.markdown h2,
      .message-content.markdown h3,
      .message-content.markdown h4 {
        margin: 14px 0 8px;
        font-weight: 600;
        line-height: 1.3;
      }
      .message-content.markdown h1 {
        font-size: 1.25em;
      }
      .message-content.markdown h2 {
        font-size: 1.15em;
      }
      .message-content.markdown h3 {
        font-size: 1.05em;
      }
      .message-content.markdown ul,
      .message-content.markdown ol {
        margin: 0 0 8px;
        padding-left: 20px;
      }
      .message-content.markdown li {
        margin: 2px 0;
      }
      .message-content.markdown a {
        color: rgb(var(--primary));
        text-decoration: underline;
        word-break: break-word;
      }
      .message-content.markdown blockquote {
        margin: 0 0 8px;
        padding: 4px 12px;
        border-left: 3px solid rgb(var(--border));
        color: rgb(var(--muted-foreground));
      }
      .message-content.markdown code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.9em;
        background: rgb(var(--border) / 0.2);
        padding: 1px 5px;
        border-radius: 4px;
      }
      .message-content.markdown pre {
        margin: 0 0 8px;
        padding: 10px 12px;
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        background: rgb(var(--background) / 0.6);
        overflow-x: auto;
      }
      .message-content.markdown pre code {
        display: block;
        background: none;
        padding: 0;
        border-radius: 0;
        white-space: pre;
      }
      .message-content.markdown hr {
        margin: 12px 0;
        border: none;
        border-top: 1px solid var(--glass-border);
      }
      .message-content.markdown table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 0 8px;
        font-size: 0.95em;
      }
      .message-content.markdown th,
      .message-content.markdown td {
        border: 1px solid var(--glass-border);
        padding: 6px 10px;
        text-align: left;
      }
      .message-content.markdown th {
        background: rgb(var(--surface) / 0.6);
        font-weight: 600;
      }
      .message-content.markdown img {
        max-width: 100%;
        border-radius: 8px;
      }
      .message-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .message-actions {
        display: flex;
        gap: 4px;
        margin-top: 2px;
        opacity: 0;
        transition: opacity 160ms var(--ease-out);
      }
      .message.user .message-actions {
        justify-content: flex-end;
      }
      .message:hover .message-actions {
        opacity: 1;
      }
      .msg-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 6px;
        color: rgb(var(--muted-foreground));
        font-size: 11px;
        line-height: 1.6;
        cursor: pointer;
        transition:
          color 160ms var(--ease-out),
          background 160ms var(--ease-out);
      }
      .msg-action-btn.copied {
        color: rgb(var(--success));
      }
      .message.streaming .message-content {
        border-color: rgb(var(--primary));
        animation: pulse 1.5s ease-in-out infinite;
      }
      .tool-calls {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 8px;
      }
      .tool-call {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border-radius: 8px;
        background: rgb(var(--surface) / 0.55);
        border: 1px solid var(--glass-border);
        font-size: 12px;
        line-height: 1.4;
        min-width: 0;
      }
      .tool-call .tool-status {
        flex-shrink: 0;
      }
      .tool-call .tool-status.running {
        animation: toolPulse 1.2s ease-in-out infinite;
      }
      .tool-call .tool-status.ok {
        color: rgb(var(--success));
      }
      .tool-call .tool-status.err {
        color: rgb(var(--danger));
      }
      .tool-call .tool-name {
        font-weight: 600;
        color: rgb(var(--primary));
        flex-shrink: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .tool-call .tool-detail {
        color: rgb(var(--muted-foreground));
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @keyframes toolPulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
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
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }
      .chat-input {
        padding: 16px 24px;
        border-top: 1px solid var(--glass-border);
        background: var(--glass-surface);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }
      .chat-input input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        background: rgb(var(--background) / 0.4);
        backdrop-filter: var(--blur);
        -webkit-backdrop-filter: var(--blur);
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
      @media (hover: hover) and (pointer: fine) {
        .new-chat-btn:hover {
          background: rgb(var(--primary));
          color: rgb(var(--primary-foreground));
          border-color: rgb(var(--primary));
        }
        .session-item:hover {
          background: rgb(var(--hover) / 0.6);
        }
        .session-item:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: rgb(var(--danger));
        }
        .load-more button:hover:not(:disabled) {
          background: rgb(var(--border) / 0.2);
        }
        .chat-input button:hover:not(:disabled) {
          opacity: 0.9;
        }
        .msg-action-btn:hover {
          color: rgb(var(--foreground));
          background: rgb(var(--border) / 0.2);
        }
        .chat-close:hover {
          color: rgb(var(--foreground));
          background: rgb(var(--border) / 0.3);
        }
        .sidebar-toggle:hover,
        .header-menu:hover {
          background: rgb(var(--border) / 0.35);
        }
      }
      @media (hover: none) {
        .message-actions {
          opacity: 1;
        }
      }
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
        .chat-sidebar,
        .sidebar-backdrop {
          transition: none;
        }
      }
      @keyframes fadeInReduced {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (max-width: 640px) {
        .chat-fab {
          bottom: 20px;
          left: 20px;
          width: 52px;
          height: 52px;
        }
        .chat-panel {
          width: calc(100vw - 20px);
          height: calc(100vh - 20px);
          height: calc(100dvh - 20px);
          max-height: none;
          bottom: 10px;
          left: 10px;
          border-radius: 18px;
        }
        .sidebar-toggle {
          display: none;
        }
        .resize-handle {
          display: none;
        }
        .header-menu {
          display: inline-flex;
        }
        .sidebar-backdrop {
          display: block;
          position: absolute;
          inset: 0;
          z-index: 4;
          background: rgb(0 0 0 / 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 240ms var(--ease-out),
            visibility 0s linear 240ms;
        }
        .sidebar-backdrop.open {
          opacity: 1;
          visibility: visible;
          transition: opacity 240ms var(--ease-out);
        }
        .chat-sidebar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 5;
          width: min(280px, 82vw);
          padding: 16px;
          border-right-color: var(--glass-border);
          background: rgb(var(--surface) / 0.92);
          transform: translateX(-100%);
          transition: transform 240ms var(--ease-out);
        }
        .chat-sidebar.open {
          width: min(280px, 82vw);
          padding: 16px;
          transform: translateX(0);
          box-shadow: var(--shadow-lg);
        }
        .chat-header {
          padding: 12px 16px;
        }
        .chat-messages {
          padding: 16px;
        }
        .message {
          max-width: 88%;
        }
        .chat-input {
          padding: 12px 16px;
          gap: 10px;
        }
        .empty-state {
          font-size: 14px;
        }
      }
    `,
  ]

  static properties = {
    userId: { attribute: "user-id" },
    username: { attribute: "username" },
    open: { type: Boolean, reflect: true },
    sessions: { state: true },
    currentSession: { state: true },
    messages: { state: true },
    isStreaming: { state: true },
    streamingContent: { state: true },
    toolCalls: { state: true },
    copiedIndex: { state: true },
    hasMoreHistory: { state: true },
    loadingHistory: { state: true },
    sidebarOpen: { state: true },
    sidebarWidth: { state: true },
    resizing: { state: true },
  }

  declare userId: string | null
  declare username: string | null
  declare open: boolean
  declare sessions: ChatSession[]
  declare currentSession: ChatSession | null
  declare messages: ChatMessage[]
  declare isStreaming: boolean
  declare streamingContent: string
  declare toolCalls: ToolCallEvent[]
  declare copiedIndex: number | null
  declare hasMoreHistory: boolean
  declare loadingHistory: boolean
  declare sidebarOpen: boolean
  declare sidebarWidth: number
  declare resizing: boolean

  private highlightLast = false
  private copyTimer: number | null = null

  private static readonly SIDEBAR_MIN = 180
  private static readonly SIDEBAR_MAX = 300

  constructor() {
    super()
    this.userId = null
    this.username = null
    this.open = false
    this.sessions = []
    this.currentSession = null
    this.messages = []
    this.isStreaming = false
    this.streamingContent = ""
    this.toolCalls = []
    this.copiedIndex = null
    this.hasMoreHistory = true
    this.loadingHistory = false
    this.sidebarOpen = !window.matchMedia("(max-width: 640px)").matches
    this.sidebarWidth = 224
    this.resizing = false
  }

  connectedCallback(): void {
    super.connectedCallback()
    if (!this.userId || !this.username) {
      console.error("chat: 未登录，无法初始化")
      return
    }
    chatService.setUser(this.userId, this.username)
    this.loadSessions()
  }

  render() {
    return html`
      <button
        class="chat-fab"
        aria-label="打开聊天"
        @click=${() => this.setOpen(true)}
      >
        💬
      </button>
      <div class="chat-panel">
        <div class="chat-container">
          <div
            class="chat-sidebar ${this.sidebarOpen ? "open" : ""}${this.resizing
              ? " resizing"
              : ""}"
            style="--sidebar-width: ${this.sidebarWidth}px"
          >
            <div class="session-box-0">
              <button class="new-chat-btn" @click=${this.createNewSession}>
                <span class="new-chat-icon">+</span>
                <span class="new-chat-label">新对话</span>
              </button>
              <button
                class="sidebar-toggle"
                aria-label=${this.sidebarOpen ? "收起侧栏" : "展开侧栏"}
                @click=${this.toggleSidebar}
              >
                ${this.sidebarOpen ? "◀" : "▶"}
              </button>
            </div>

            <div class="session-list">
              ${this.sessions.map(
                (s) => html`
                  <div
                    class="session-item ${s.id === this.currentSession?.id
                      ? "active"
                      : ""}"
                    @click=${() => this.selectSession(s)}
                  >
                    <span class="session-title">${s.title || "新对话"}</span>
                    <button
                      class="delete-btn"
                      @click=${(e: Event) => this.handleDeleteSession(s.id, e)}
                    >
                      ×
                    </button>
                  </div>
                `,
              )}
            </div>
          </div>
          <div
            class="resize-handle ${this.resizing ? "dragging" : ""}"
            @pointerdown=${this.onResizeStart}
          ></div>
          <div
            class="sidebar-backdrop ${this.sidebarOpen ? "open" : ""}"
            @click=${this.closeSidebar}
          ></div>
          <div class="chat-main">
            <div class="chat-header">
              <button
                class="header-menu"
                aria-label="打开会话列表"
                @click=${this.toggleSidebar}
              >
                ☰
              </button>
              <h3>${this.currentSession?.title || "新对话"}</h3>
              <button
                class="chat-close"
                aria-label="收起聊天"
                @click=${() => this.setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div class="chat-messages">
              ${this.hasMoreHistory
                ? html`
                    <div class="load-more">
                      <button
                        @click=${this.loadMoreHistory}
                        ?disabled=${this.loadingHistory}
                      >
                        ${this.loadingHistory ? "加载中..." : "加载更早的消息"}
                      </button>
                    </div>
                  `
                : ""}
              ${this.messages.length === 0 && !this.isStreaming
                ? html`<div class="empty-state">开始你的第一次对话吧</div>`
                : ""}
              ${this.messages.map((m, i) =>
                this.renderMessage(
                  m,
                  i,
                  i === this.messages.length - 1 && this.highlightLast,
                ),
              )}
              ${this.isStreaming
                ? html`
                    <div class="message assistant streaming">
                      <div class="message-avatar">🤖</div>
                      <div class="message-content markdown">
                        ${this.toolCalls.length
                          ? html`
                              <div class="tool-calls">
                                ${this.toolCalls.map(
                                  (t) => html`
                                    <div class="tool-call">
                                      <span
                                        class="tool-status ${t.status === "done"
                                          ? "ok"
                                          : t.status === "error"
                                            ? "err"
                                            : "running"}"
                                      >
                                        ${t.status === "start"
                                          ? "⏳"
                                          : t.status === "done"
                                            ? "✓"
                                            : "✗"}
                                      </span>
                                      <span class="tool-name">${t.name}</span>
                                      <span class="tool-detail">
                                        ${t.status === "start"
                                          ? this.formatToolArgs(t.args)
                                          : t.summary}
                                      </span>
                                    </div>
                                  `,
                                )}
                              </div>
                            `
                          : ""}
                        ${unsafeHTML(renderMarkdown(this.streamingContent))}
                      </div>
                    </div>
                  `
                : ""}
            </div>
            <div class="chat-input">
              <input
                type="text"
                placeholder="输入消息..."
                ?disabled=${this.isStreaming}
                @keydown=${this.onInputKeydown}
              />
              <button @click=${this.handleSend} ?disabled=${this.isStreaming}>
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  private renderMessage(
    msg: ChatMessage,
    index: number,
    enter: boolean,
  ): TemplateResult {
    const isUser = msg.role === "user"
    const body = isUser ? msg.content : unsafeHTML(renderMarkdown(msg.content))
    return html`
      <div class="message ${msg.role}${enter ? " enter" : ""}">
        <div class="message-avatar">${isUser ? "👤" : "🤖"}</div>
        <div class="message-body">
          <div class="message-content${isUser ? "" : " markdown"}">${body}</div>
          <div class="message-actions">
            <button
              class="msg-action-btn${this.copiedIndex === index
                ? " copied"
                : ""}"
              @click=${() => this.handleCopyMessage(msg, index)}
            >
              ${this.copiedIndex === index ? "✓ 已复制" : "⧉ 复制"}
            </button>
          </div>
        </div>
      </div>
    `
  }

  private formatToolArgs(args?: Record<string, unknown>): string {
    if (!args) return ""
    return Object.entries(args)
      .map(([k, v]) =>
        typeof v === "object" ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`,
      )
      .join(", ")
  }

  private async handleCopyMessage(
    msg: ChatMessage,
    index: number,
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(msg.content)
      this.copiedIndex = index
      if (this.copyTimer) window.clearTimeout(this.copyTimer)
      this.copyTimer = window.setTimeout(() => {
        this.copiedIndex = null
        this.copyTimer = null
      }, 1500)
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  protected updated(): void {
    if (this.highlightLast) this.highlightLast = false
  }

  private setOpen(open: boolean): void {
    this.open = open
    if (open) {
      this.updateComplete.then(() => {
        this.renderRoot
          .querySelector<HTMLInputElement>(".chat-input input")
          ?.focus()
      })
    }
  }

  private toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  private closeSidebar(): void {
    this.sidebarOpen = false
  }

  private onResizeStart(e: PointerEvent): void {
    e.preventDefault()
    this.resizing = true
    const startX = e.clientX
    const startWidth = this.sidebarWidth
    const min = ChatComponent.SIDEBAR_MIN
    const max = ChatComponent.SIDEBAR_MAX
    const onMove = (ev: PointerEvent) => {
      this.sidebarWidth = Math.min(
        max,
        Math.max(min, startWidth + (ev.clientX - startX)),
      )
    }
    const onUp = () => {
      this.resizing = false
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  private onInputKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      this.handleSend()
    }
  }

  private scrollToBottom(): void {
    this.updateComplete.then(() => {
      const container =
        this.renderRoot.querySelector<HTMLElement>(".chat-messages")
      if (container) container.scrollTop = container.scrollHeight
    })
  }

  private async loadSessions(): Promise<void> {
    try {
      const list = await chatService.getSessions()
      this.sessions = list
      if (list.length > 0) await this.selectSession(list[0])
      else await this.createNewSession()
    } catch (error) {
      console.error("加载会话失败:", error)
    }
  }

  private async selectSession(session: ChatSession): Promise<void> {
    this.currentSession = session
    this.messages = session.messages || []
    this.hasMoreHistory = true
    this.scrollToBottom()
    if (window.matchMedia("(max-width: 640px)").matches) this.closeSidebar()
  }

  private async createNewSession(): Promise<void> {
    const session = await chatService.createSession()
    this.sessions = [session, ...this.sessions]
    await this.selectSession(session)
  }

  private async handleDeleteSession(
    sessionId: string,
    e?: Event,
  ): Promise<void> {
    e?.stopPropagation()
    if (!confirm("确定要删除这个会话吗？")) return
    try {
      await chatService.deleteSession(sessionId)
      this.sessions = this.sessions.filter((s) => s.id !== sessionId)
      if (this.currentSession?.id === sessionId) {
        if (this.sessions.length > 0) await this.selectSession(this.sessions[0])
        else await this.createNewSession()
      }
    } catch (error) {
      console.error("删除失败:", error)
    }
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
      if (oldMessages.length < 50) this.hasMoreHistory = false
      this.messages = [...oldMessages, ...this.messages]
      const updatedSession: ChatSession = {
        ...this.currentSession,
        messages: this.messages,
      }
      this.currentSession = updatedSession
      await chatDB.saveSession(updatedSession)
    } catch (error) {
      console.error("加载历史失败:", error)
    } finally {
      this.loadingHistory = false
    }
  }

  private async handleSend(): Promise<void> {
    if (!this.userId || !this.username) {
      console.error("用户信息缺失，无法发送")
      return
    }
    const input =
      this.renderRoot.querySelector<HTMLInputElement>(".chat-input input")
    const message = input?.value.trim() ?? ""
    if (!message || this.isStreaming || !this.currentSession) return

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }
    this.messages = [...this.messages, userMessage]
    this.highlightLast = true

    const updatedSession: ChatSession = {
      ...this.currentSession,
      messages: this.messages,
      updatedAt: Date.now(),
    }
    this.currentSession = updatedSession
    await chatDB.saveSession(updatedSession)
    if (input) input.value = ""

    this.isStreaming = true
    this.streamingContent = ""
    this.toolCalls = []
    this.scrollToBottom()

    const onTool = (tool: ToolCallEvent) => {
      const next = [...this.toolCalls]
      if (tool.status === "start") {
        next.push(tool)
      } else {
        const idx = next.findIndex(
          (t) => t.name === tool.name && t.status === "start",
        )
        if (idx >= 0) next[idx] = { ...next[idx], ...tool }
        else next.push(tool)
      }
      this.toolCalls = next
      this.scrollToBottom()
    }

    const onChunk = (chunk: string) => {
      this.streamingContent += chunk
      this.scrollToBottom()
    }
    const onDone = async (fullResponse: string, newSessionId?: string) => {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: fullResponse,
        timestamp: Date.now(),
      }
      this.messages = [...this.messages, assistantMessage]
      this.highlightLast = true
      this.isStreaming = false
      this.streamingContent = ""
      this.toolCalls = []

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
      this.scrollToBottom()
    }
    const onError = (error: string) => {
      console.error("发送失败:", error)
      this.messages = [
        ...this.messages,
        {
          role: "assistant",
          content: "❌ 发送失败: " + error,
          timestamp: Date.now(),
        },
      ]
      this.isStreaming = false
      this.streamingContent = ""
      this.toolCalls = []
      this.scrollToBottom()
    }

    chatService.sendMessage(
      message,
      this.currentSession.id.startsWith("local_")
        ? null
        : this.currentSession.id,
      onChunk,
      onDone,
      onError,
      onTool,
    )
  }
}

customElements.define("chat-component", ChatComponent)
