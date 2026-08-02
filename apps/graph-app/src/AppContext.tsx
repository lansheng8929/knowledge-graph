import { createContext, useContext, type ReactNode } from "react"
import type {
  GraphNode,
  GraphLink,
} from "@lansheng/knowledge-graph/client/type"
import type {
  SelectionRect,
  SelectionPolygonState,
  SelectionMode,
  useGraphSelection,
} from "./hooks/useGraphSelection"
import type { useGraphApp } from "./hooks/useGraphApp"
import type { useGraphHover } from "./hooks/useGraphHover"
import type { useRuleMenu } from "./hooks/useRuleMenu"

export type AppContextValue = ReturnType<typeof useGraphApp>["ctx"] &
  ReturnType<typeof useGraphHover>["ctx"] &
  ReturnType<typeof useRuleMenu>["ctx"] &
  ReturnType<typeof useGraphSelection>

const Ctx = createContext<AppContextValue | null>(null)

export function useAppCtx(): AppContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAppCtx must be used within AppProvider")
  return ctx
}

export function AppProvider({
  value,
  children,
}: {
  value: AppContextValue
  children: ReactNode
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
