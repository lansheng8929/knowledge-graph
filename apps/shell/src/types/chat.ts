// src/types/chat.ts

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool"
  content: string
  timestamp: number
  seq?: number
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
  createdAt: number
}

export interface ChatRequest {
  message: string
  session_id?: string
}

export interface ChatResponse {
  session_id: string
  message: string
  done?: boolean
  seq?: number
}

export interface SessionListResponse {
  sessions: ChatSession[]
  total?: number
}

export interface MessageHistoryResponse {
  messages: ChatMessage[]
  has_more?: boolean
  next_seq?: number
}

export interface UserContext {
  uid: string
  username: string
}
