import { useContext, useEffect } from "react"
import { PanelContext } from "./PanelProvider"
import type { PanelLayer } from "./types"

export interface UsePanelOptions {
  /** 面板唯一 ID */
  id: string
  /** 面板所属层级 */
  layer: PanelLayer
}

export function usePanel({ id, layer }: UsePanelOptions) {
  const { register, unregister, focus, focusStack } = useContext(PanelContext)

  useEffect(() => {
    register(id)
    return () => unregister(id)
  }, [id, register, unregister])

  const idx = focusStack.indexOf(id)
  const zIndex = idx >= 0 ? layer + idx : layer

  return {
    /** 当前计算出的 zIndex */
    zIndex,
    /** 调用此方法将该面板置顶 */
    onFocus: () => focus(id),
  }
}
