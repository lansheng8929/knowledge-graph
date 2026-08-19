// src/services/chat.ts
import type { ChatMessage, ChatSession } from "../types/chat"
import { chatDB } from "../utils/db"

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: string
}

export class ChatService {
  private baseURL = "/api/v1/agent"
  private userId: string = ""
  private username: string = ""

  setUser(userId: string, username: string) {
    this.userId = userId
    this.username = username
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-User-Context": JSON.stringify({
        uid: this.userId,
        username: this.username,
      }),
    }
  }

  async sendMessage(
    message: string,
    sessionId: string | null = null,
    onChunk: (chunk: string) => void,
    onDone: (fullResponse: string, newSessionId?: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ message, session_id: sessionId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      if (!response.body) {
        throw new Error("响应无 body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullResponse = ""
      let newSessionId = sessionId

      const handleFrame = (frame: string) => {
        let event = "message"
        let data = ""
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim()
          else if (line.startsWith("data:")) data = line.slice(5).trim()
        }
        if (!data) return
        let parsed: Record<string, unknown>
        try {
          parsed = JSON.parse(data)
        } catch {
          return
        }
        if (event === "delta" && typeof parsed.text === "string") {
          onChunk(parsed.text)
          fullResponse += parsed.text
        } else if (event === "done") {
          if (typeof parsed.session_id === "string") {
            newSessionId = parsed.session_id
          }
          onDone(fullResponse, newSessionId || undefined)
        } else if (event === "error") {
          onError(String(parsed.message ?? "未知错误"))
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const frames = buffer.split("\n\n")
        buffer = frames.pop() || ""
        for (const frame of frames) handleFrame(frame.trim())
      }
      if (buffer.trim()) handleFrame(buffer.trim())
    } catch (error) {
      onError(error instanceof Error ? error.message : "未知错误")
    }
  }

  async getSessions(): Promise<ChatSession[]> {
    const cached = await chatDB.getAllSessions(this.userId)
    if (cached.length > 0) {
      return cached
    }

    const sessions =
      (await this._get<ChatSession[]>(`${this.baseURL}/sessions`)) ?? []

    for (const session of sessions) {
      await chatDB.saveSession({
        ...session,
        userId: this.userId,
      })
    }

    return sessions
  }

  async getMessages(
    sessionId: string,
    beforeSeq?: number,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    const cached = await chatDB.getSession(sessionId)
    if (cached && cached.messages) {
      const filtered = beforeSeq
        ? cached.messages.filter((m: ChatMessage) => m.seq && m.seq < beforeSeq)
        : cached.messages
      return filtered.slice(-limit)
    }

    let url = `${this.baseURL}/sessions/${sessionId}/messages?limit=${limit}`
    if (beforeSeq) {
      url += `&before_seq=${beforeSeq}`
    }

    const messages = (await this._get<ChatMessage[]>(url)) ?? []
    if (cached) {
      await chatDB.updateSessionMessages(sessionId, messages)
    }
    return messages
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    await chatDB.deleteSession(sessionId)
  }

  async createSession(title: string = "新对话"): Promise<ChatSession> {
    const session: ChatSession = {
      id: `local_${Date.now()}`,
      userId: this.userId,
      title,
      messages: [],
      updatedAt: Date.now(),
      createdAt: Date.now(),
    }
    await chatDB.saveSession(session)
    return session
  }

  private async _get<T>(url: string): Promise<T | null> {
    const response = await fetch(url, { headers: this.getHeaders() })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const body = (await response.json()) as ApiEnvelope<T>
    if (!body.success) {
      throw new Error(body.error ?? "请求失败")
    }
    return body.data ?? null
  }
}

export const chatService = new ChatService()
