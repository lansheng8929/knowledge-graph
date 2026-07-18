import React, { useEffect, useMemo, useRef, useState } from "react"

/**
 * 可拖拽调整宽度的侧面板组件
 *
 * 纯 UI 组件，可用于左侧/右侧面板。支持拖拽调整宽度、展开/收起动画。
 *
 * @example
 * ```tsx
 * <ResizeLayout
 *   position="left"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   initWidth={300}
 *   minWidth={200}
 *   maxWidth={400}
 * >
 *   <PanelContent />
 * </ResizeLayout>
 * ```
 */
export function ResizeLayout({
  className,
  children,
  style: outerStyle,
  position = "left",
  initWidth = 300,
  minWidth = 200,
  maxWidth = 400,
  open = false,
  onOpenChange,
  disabled = false,
}: {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  position?: "left" | "right"
  initWidth?: number
  minWidth?: number
  maxWidth?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}) {
  const panelOffset = 20 // 收起时额外偏移量
  const [width, setWidth] = useState(initWidth)
  const [shouldRender, setShouldRender] = useState(open)

  const resizingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(initWidth)

  // 收起动画期间延迟卸载内容
  useEffect(() => {
    if (open) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // 拖拽调整宽度
  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return
    let dx = e.clientX - startXRef.current
    if (position === "right") dx = -dx
    const newWidth = Math.max(
      minWidth,
      Math.min(startWidthRef.current + dx, maxWidth),
    )
    setWidth(newWidth)
  }

  const handleResizerDown = (e: React.MouseEvent) => {
    e.preventDefault()
    resizingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = width
    document.addEventListener("mousemove", handleMouseMove)
    document.body.style.cursor = "ew-resize"
  }

  useEffect(() => {
    const handleMouseUp = () => {
      if (resizingRef.current) {
        resizingRef.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.body.style.cursor = ""
      }
    }
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = ""
    }
  }, [width])

  // 展开/收起位置计算
  const panelStyle = useMemo<React.CSSProperties>(() => {
    const offset = width + panelOffset
    if (open) {
      return { width, minWidth, transform: "translateX(0)" }
    }
    return {
      width,
      minWidth,
      transform:
        position === "left"
          ? `translateX(-${offset}px)`
          : `translateX(${offset}px)`,
    }
  }, [open, width, minWidth, position])

  const isLeft = position === "left"

  return (
    <div
      style={{
        ...panelStyle,
        ...outerStyle,
        position: "absolute",
        top: 0,
        height: "100%",
        [isLeft ? "left" : "right"]: 0,
        transition: "transform 300ms ease-in-out",
        display: "flex",
        flexDirection: isLeft ? "row" : "row-reverse",
      }}
      className={className}
    >
      {/* 内容区 */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          visibility: shouldRender ? "visible" : "hidden",
        }}
      >
        {children}
      </div>

      {/* 拖拽把手 */}
      <div
        onMouseDown={handleResizerDown}
        style={{
          width: 4,
          cursor: "ew-resize",
          background: open ? "rgba(0,0,0,0.08)" : "transparent",
          flexShrink: 0,
          transition: "background 0.2s",
          borderLeft: isLeft ? "1px solid rgba(0,0,0,0.1)" : "none",
          borderRight: isLeft ? "none" : "1px solid rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.15)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = open
            ? "rgba(0,0,0,0.08)"
            : "transparent"
        }}
      />

      {/* 展开/收起按钮 */}
      <button
        onClick={() => !disabled && onOpenChange?.(!open)}
        disabled={disabled}
        title={disabled ? "Disabled" : open ? "Collapse" : "Expand"}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          [isLeft ? "left" : "right"]: "100%",
          marginLeft: isLeft ? 4 : 0,
          marginRight: isLeft ? 0 : 4,
          width: 24,
          height: 48,
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.2)",
          background: "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
          zIndex: 20,
        }}
      >
        {/* 简单箭头 SVG */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          style={{
            transform: isLeft
              ? open
                ? "none"
                : "rotate(180deg)"
              : open
                ? "rotate(180deg)"
                : "none",
            transition: "transform 0.3s",
          }}
        >
          <path d="M8 2L4 6l4 4" stroke="#666" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
    </div>
  )
}
