import { useState, useEffect, useCallback } from "react"
import type { GraphNode } from "@lansheng/knowledge-graph/client/type"
import type { ExpansionService } from "../expansion-service"

export function useRuleMenu(
  containerRef: React.RefObject<HTMLDivElement | null>,
  expansionRef: React.RefObject<ExpansionService | null>,
) {
  const [ruleMenu, setRuleMenu] = useState<{
    node: GraphNode
    x: number
    y: number
  } | null>(null)
  const [expanding, setExpanding] = useState(false)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)

  // 点击画布空白关闭
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target === containerRef.current || target.tagName === "CANVAS") {
        setRuleMenu(null)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Escape 关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRuleMenu(null)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  const handleRuleExpand = useCallback(
    async (nodeId: string, _ruleIds: string[], conditions?: any[]) => {
      setRuleMenu(null)
      const svc = expansionRef.current
      if (!svc) return
      setExpanding(true)
      const onError = (err: any) => {
        const msg = err?.message ?? String(err)
        console.error("[ExpandError]", msg)
        setRuntimeError(msg)
        setTimeout(() => setRuntimeError(null), 5000)
      }
      try {
        if (conditions) {
          await svc.expand(nodeId, JSON.stringify(conditions)).catch(onError)
        }
      } finally {
        setExpanding(false)
      }
    },
    [],
  )

  return {
    handleRuleExpand,
    ctx: { ruleMenu, setRuleMenu, expanding, runtimeError },
  }
}
