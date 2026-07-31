import { useRef, useEffect, useCallback, type MouseEvent } from "react"

const DEFAULT_PADDING = 10

/** 将坐标钳制在视口内，保留 padding 边距 */
function clampToViewport(
  x: number,
  y: number,
  el: HTMLElement,
  padding: number,
) {
  const rect = el.getBoundingClientRect()
  const maxX = window.innerWidth - rect.width - padding
  const maxY = window.innerHeight - rect.height - padding
  return {
    x: Math.max(padding, Math.min(x, maxX)),
    y: Math.max(padding, Math.min(y, maxY)),
  }
}

/**
 * useDrag — 基于原生 DOM 的拖拽 hook
 *
 * 拖拽过程中直接操作元素 transform，零 React 重渲染。
 * 支持鼠标和触摸事件。拖拽位置自动钳制在视口边界内。
 *
 * @param nodeRef - 被拖拽元素的 ref
 * @param defaultPosition - 初始位置（可选）
 * @param padding - 距视口边距（默认 10px）
 * @returns onGripMouseDown - 绑定到拖柄元素的 onMouseDown
 */
export function useDrag(
  nodeRef: React.RefObject<HTMLDivElement | null>,
  defaultPosition?: { x: number; y: number },
  padding: number = DEFAULT_PADDING,
) {
  const posRef = useRef({ x: 0, y: 0 })
  const paddingRef = useRef(padding)
  paddingRef.current = padding

  // 初始化位置（自动钳制）
  useEffect(() => {
    if (nodeRef.current && defaultPosition) {
      const clamped = clampToViewport(
        defaultPosition.x,
        defaultPosition.y,
        nodeRef.current,
        paddingRef.current,
      )
      nodeRef.current.style.transform = `translate(${clamped.x}px, ${clamped.y}px)`
      posRef.current = clamped
    }
  }, [nodeRef, defaultPosition?.x, defaultPosition?.y])

  const onGripMouseDown = useCallback(
    (e: MouseEvent) => {
      const el = nodeRef.current
      if (!el) return
      e.preventDefault()

      const startX = e.clientX
      const startY = e.clientY
      const origX = posRef.current.x
      const origY = posRef.current.y

      const onMove = (ev: Event) => {
        const me = ev as unknown as MouseEvent
        const dx = me.clientX - startX
        const dy = me.clientY - startY
        const clamped = clampToViewport(
          origX + dx,
          origY + dy,
          el,
          paddingRef.current,
        )
        el.style.transform = `translate(${clamped.x}px, ${clamped.y}px)`
      }

      const onUp = () => {
        const m = el.style.transform.match(
          /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/,
        )
        if (m) posRef.current = { x: Number(m[1]), y: Number(m[2]) }
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        document.removeEventListener("touchmove", onMove)
        document.removeEventListener("touchend", onUp)
      }

      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
      document.addEventListener("touchmove", onMove, { passive: true })
      document.addEventListener("touchend", onUp)
    },
    [nodeRef],
  )

  return { onGripMouseDown }
}
