/**
 * 主题 JS 调色板 —— 供 WebGL 渲染器 / MiniMap 等 canvas 绘制使用。
 * 与 styles/tokens.css 中的 CSS 变量保持同源，保证 UI 与画布一致。
 */

export type Theme = "light" | "dark"

interface NodeColor {
  bg: string
  stroke: string
}

export interface ThemePalette {
  /** 画布背景色（WebGL clear color） */
  canvas: string
  /** 节点类型 → 颜色 */
  node: Record<string, NodeColor>
  /** 关系边颜色 */
  link: {
    default: string
    hovered: string
    highlighted: string
    selected: string
    hidden: string
  }
  /** 节点文字 / 通用文字色 */
  text: string
  /** 次要文字色 */
  muted: string
}

const LIGHT: ThemePalette = {
  canvas: "#f8f9fa",
  node: {
    default: { bg: "#357abd", stroke: "#ccc" },
    person: { bg: "#357abd", stroke: "#2a6090" },
    phone: { bg: "#27ae60", stroke: "#1e8449" },
    address: { bg: "#e67e22", stroke: "#ba5c12" },
    account: { bg: "#8e44ad", stroke: "#6c3483" },
    company: { bg: "#16a085", stroke: "#0e7c63" },
    ip: { bg: "#7f8c8d", stroke: "#596364" },
    device: { bg: "#2c3e50", stroke: "#1a252f" },
  },
  link: {
    default: "#9ca3af",
    hovered: "#00ccff",
    highlighted: "#ffff00",
    selected: "#357abd",
    hidden: "#9ca3af",
  },
  text: "#2c2c2c",
  muted: "#8899aa",
}

const DARK: ThemePalette = {
  canvas: "#181b1f",
  node: {
    default: { bg: "#4a90d9", stroke: "#2f5a85" },
    person: { bg: "#4a90d9", stroke: "#2f5a85" },
    phone: { bg: "#34d399", stroke: "#157a55" },
    address: { bg: "#fbbf24", stroke: "#9a6a10" },
    account: { bg: "#a78bfa", stroke: "#5b3f9e" },
    company: { bg: "#2dd4bf", stroke: "#0f766e" },
    ip: { bg: "#9ca3af", stroke: "#4b5563" },
    device: { bg: "#64748b", stroke: "#334155" },
  },
  link: {
    default: "#8a94a3",
    hovered: "#22d3ee",
    highlighted: "#fde047",
    selected: "#4a90d9",
    hidden: "#8a94a3",
  },
  text: "#e2e8f0",
  muted: "#94a3b8",
}

const palettes: Record<Theme, ThemePalette> = { light: LIGHT, dark: DARK }

/** 根据外部传入的主题获取调色板 */
export function getPalette(theme: Theme): ThemePalette {
  return palettes[theme]
}

/** hex → rgba 字符串，canvas 绘制用 */
export function hexToRgba(hex: string, alpha = 1): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
