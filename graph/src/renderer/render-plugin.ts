/**
 * RenderPlugin — 图渲染插件接口。
 *
 * 插件封装完整的渲染逻辑：节点、边、文字、覆盖层。
 * 同时实现 Picker 接口，统一管理拾取。
 *
 * 默认实现：DefaultRenderPlugin
 * 外部可完全替换。
 */
import type { Picker } from "./picker.js"
import type { GraphOverlay } from "./graph-overlay.js"
import type { RenderNode, RenderLink } from "./types.js"
import type { GraphViewStyle } from "../theme.js"
import type { DefaultGraphDataGenerics } from "../client/type.js"

/** 每帧渲染上下文 */
export interface RenderContext {
  nodes: RenderNode[]
  links: RenderLink[]
  /** canvas 像素宽（含 dpr） */
  width: number
  /** canvas 像素高（含 dpr） */
  height: number
  /** 相机位移 X */
  tx: number
  /** 相机位移 Y */
  ty: number
  /** 相机缩放 */
  scale: number
  /** 是否显示箭头 */
  showArrows: boolean
  /** 标签显示的最小缩放阈值 */
  labelMinScale: number
}

/** 插件初始化参数 */
export interface RenderPluginOptions {
  gl: WebGL2RenderingContext
  canvas: HTMLCanvasElement
  /** 初始画布宽高（CSS 像素） */
  width: number
  height: number
  /** 拾取模式 */
  pickerMode?: "gpu" | "cpu"
  /** 标签字号 */
  labelFontSize?: number
  /** Plus 徽标边框宽度 */
  plusBadgeBorderWidth?: number
  /** Plus 徽标边框颜色 */
  plusBadgeBorderColor?: [number, number, number, number]
  /** Plus 徽标点击回调 */
  onPlusClick?: (nodeId: string) => void
}

export interface RenderPlugin extends Picker {
  /** 插件名（调试用） */
  readonly name: string

  /** 渲染完整一帧 */
  render(ctx: RenderContext): void

  /** 获取覆盖层列表 */
  getOverlays(): GraphOverlay[]

  /** 返回插件的默认样式 */
  getDefaultStyle(): GraphViewStyle<DefaultGraphDataGenerics>

  /** 节点位置更新后刷新（如物理 tick 后） */
  afterPositionUpdate?(nodes: RenderNode[]): void
}
