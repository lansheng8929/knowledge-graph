import {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react"
import { usePanel, type UsePanelOptions } from "./usePanel"
import { useDrag } from "./useDrag"

interface PanelContainerProps extends UsePanelOptions {
  children: ReactNode
  style?: CSSProperties
  className?: string
  draggable?: boolean
  /** 面板位置（受控），非拖拽模式直接用于 CSS left/top */
  position?: { x: number; y: number }
  /** 允许通过右下角手柄缩放面板 */
  resizable?: boolean
  /** 可缩放时的初始尺寸 */
  defaultSize?: { w: number; h: number }
  onClick?: (e: MouseEvent) => void
  /** 关闭回调（有则显示关闭按钮） */
  onClose?: () => void
}

/** 毛玻璃基础样式：半透明渐变 + 模糊 + 细边框 + 内高光。
 * 放在调用方 style 之后以覆盖其实底背景，统一所有面板为毛玻璃质感。 */
const panelGlassStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgb(var(--surface) / 0.85), rgb(var(--background) / 0.75))",
  backdropFilter: "blur(16px) saturate(160%)",
  WebkitBackdropFilter: "blur(16px) saturate(160%)",
  border: "1px solid rgb(var(--border) / 0.5)",
  borderRadius: 12,
  boxShadow:
    "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 12px 40px rgb(0 0 0 / 0.22)",
  overflow: "hidden",
}

const gripStyle: CSSProperties = {
  cursor: "grab",
  padding: "4px",
  paddingBottom: "0px",
  userSelect: "none",
  touchAction: "none",
}

const resizeHandleStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: 20,
  height: 20,
  cursor: "nwse-resize",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
}

const ResizeHandle = ({
  onPointerDown,
}: {
  onPointerDown: (e: React.PointerEvent) => void
}) => (
  <div style={resizeHandleStyle} onPointerDown={onPointerDown}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#bbb">
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="6" r="1.5" />
      <circle cx="6" cy="10" r="1.5" />
    </svg>
  </div>
)

/**
 * PanelContainer — 自动管理 zIndex 和点击置顶的面板容器
 *
 * 非拖拽模式：position 受控，父组件传什么位置就渲染在哪。
 * 拖拽模式：position 为初始位置，拖拽由 useDrag 内部管理。
 * resizable 模式：右下角可拖拽缩放。
 * 关闭按钮：draggable 模式顶部 panel-grip 提供红色圆点关闭按钮（onClose 存在时）。
 */
export const PanelContainer = memo(function PanelContainer({
  id,
  layer,
  children,
  style,
  className,
  draggable,
  position,
  resizable,
  defaultSize,
  onClick,
  onClose,
}: PanelContainerProps) {
  const { zIndex, onFocus } = usePanel({ id, layer })
  const nodeRef = useRef<HTMLDivElement>(null)
  const { onGripMouseDown } = useDrag(nodeRef, position, 10)

  const [panelSize, setPanelSize] = useState(
    resizable && defaultSize ? defaultSize : null,
  )
  const minW = 200
  const minH = 150
  const PAD = 10

  const handleClick = useCallback(
    (e: MouseEvent) => {
      onFocus()
      onClick?.(e)
    },
    [onFocus, onClick],
  )

  const dragRef = useRef<{
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)

  const onResizeStart = useCallback(
    (e: React.PointerEvent) => {
      if (!panelSize) return
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
      e.preventDefault()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: panelSize.w,
        startH: panelSize.h,
      }
      const onMove = (ev: Event) => {
        const d = dragRef.current
        if (!d) return
        const me = ev as PointerEvent
        const maxW = window.innerWidth - PAD * 2
        const maxH = window.innerHeight - PAD * 2
        const clientX = Math.min(maxW, me.clientX)
        const clientY = Math.min(maxH, me.clientY)
        setPanelSize({
          w: Math.max(minW, Math.min(d.startW + clientX - d.startX, maxW)),
          h: Math.max(minH, Math.min(d.startH + clientY - d.startY, maxH)),
        })
      }
      const onUp = () => {
        dragRef.current = null
        el.releasePointerCapture(e.pointerId)
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerup", onUp)
      }
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerup", onUp)
    },
    [panelSize],
  )

  if (draggable) {
    return (
      <div
        ref={nodeRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          willChange: "transform",
          ...style,
          ...panelGlassStyle,
          width: panelSize?.w,
          height: panelSize?.h,
          zIndex,
        }}
        className={className}
        onClick={handleClick}
      >
        <div
          style={{
            ...gripStyle,
          }}
          className="panel-grip"
          onMouseDown={onGripMouseDown}
        >
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              style={{
                cursor: "pointer",
                width: 12,
                height: 12,
                borderRadius: "100%",
                background: "#EB2463",
                userSelect: "none",
                border: "none",
              }}
              title="关闭"
            ></button>
          )}
        </div>
        {children}
        {resizable && <ResizeHandle onPointerDown={onResizeStart} />}
      </div>
    )
  }

  // 非拖拽不添加nodeRef
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${position?.x ?? 100}px, ${position?.y ?? 100}px)`,
        ...style,
        ...panelGlassStyle,
        width: panelSize?.w,
        height: panelSize?.h,
        zIndex,
      }}
      className={className}
      onClick={handleClick}
    >
      {children}
      {resizable && <ResizeHandle onPointerDown={onResizeStart} />}
    </div>
  )
})
