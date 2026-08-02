import { createContext, useState, useCallback, type ReactNode } from "react"
import type { PanelContextValue } from "./types"

export const PanelContext = createContext<PanelContextValue>({
  register: () => {},
  unregister: () => {},
  focus: () => {},
  focusStack: [],
})

export function PanelProvider({ children }: { children: ReactNode }) {
  const [focusStack, setFocusStack] = useState<string[]>([])

  const register = useCallback((id: string) => {
    setFocusStack((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const unregister = useCallback((id: string) => {
    setFocusStack((prev) => prev.filter((i) => i !== id))
  }, [])

  const focus = useCallback((id: string) => {
    setFocusStack((prev) => {
      const filtered = prev.filter((i) => i !== id)
      return [...filtered, id]
    })
  }, [])

  return (
    <PanelContext.Provider value={{ register, unregister, focus, focusStack }}>
      {children}
    </PanelContext.Provider>
  )
}
