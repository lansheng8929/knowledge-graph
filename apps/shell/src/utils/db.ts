// src/utils/db.ts
export class ChatDB {
  private db: IDBDatabase | null = null
  private readonly DB_NAME = "ChatDB"
  private readonly STORE_NAME = "sessions"

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: "id" })
          store.createIndex("updatedAt", "updatedAt")
          store.createIndex("userId", "userId")
        }
      }
    })
  }

  async saveSession(session: any): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], "readwrite")
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.put(session)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSession(id: string): Promise<any> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], "readonly")
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllSessions(userId: string): Promise<any[]> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], "readonly")
      const store = transaction.objectStore(this.STORE_NAME)
      const index = store.index("userId")
      const request = index.getAll(userId)
      request.onsuccess = () =>
        resolve(request.result.sort((a, b) => b.updatedAt - a.updatedAt))
      request.onerror = () => reject(request.error)
    })
  }

  async deleteSession(id: string): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], "readwrite")
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async updateSessionMessages(id: string, messages: any[]): Promise<void> {
    const session = await this.getSession(id)
    if (session) {
      session.messages = messages
      session.updatedAt = Date.now()
      await this.saveSession(session)
    }
  }
}

export const chatDB = new ChatDB()
