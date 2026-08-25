import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import {
  DefaultRenderPlugin,
  GraphModel,
  GraphView,
  type LinkState,
  type NodeState,
  type NodeStyle,
} from "@lansheng/knowledge-graph"
import type { ParsedEdge, ParsedEntity } from "./types"
import { nodeTypeLabel, propertyLabel, relationLabel } from "./graph-i18n"

const PREVIEW_BG = "#f7f7f7"
const NODE_PALETTE = [
  "#357abd",
  "#e0913c",
  "#7a5cb8",
  "#2e9e6b",
  "#c0556b",
  "#5b8db8",
  "#b8860b",
  "#6b8e23",
  "#8a6f4d",
  "#3f8fa3",
]
/** 节点下方标签颜色：白字在浅色底上不可见，统一深色。 */
const LABEL_COLOR = "#2c2c2c"

/** 预览图数据泛型：节点/关系类型是任意字符串（库默认泛型只认 'default'）。 */
type PreviewGenerics = {
  NO: Record<string, unknown>
  NT: string
  NS: NodeState
  LO: Record<string, unknown>
  LT: string
  LS: LinkState
  M: Record<string, unknown>
}

interface HoverNode {
  id: string
  data?: { nodeType?: string; label?: string; [k: string]: unknown }
}
interface HoverLink {
  source?: string
  target?: string
  data?: { linkType?: string; label?: string; time?: string; rank?: number; [k: string]: unknown }
}

function nodeStyle(bg: string): NodeStyle<any> {
  const common = {
    radius: 8,
    strokeWidth: 1,
    opacity: 1,
    fontSize: 14,
    textColor: LABEL_COLOR,
  }
  return {
    regular: { ...common, bgColor: bg, strokeColor: "#ffffff" },
    hovered: { ...common, bgColor: bg, strokeColor: "#00ccff", strokeWidth: 2 },
    highlighted: { ...common, bgColor: bg, strokeColor: "#fde047", strokeWidth: 2 },
    selected: { ...common, bgColor: bg, strokeColor: "#0066ff", strokeWidth: 2 },
    hidden: { ...common, bgColor: bg, strokeColor: "#ffffff", opacity: 0.15, strokeWidth: 2 },
    root: { ...common, bgColor: "#ffffff", strokeColor: "#e67e00", radius: 6, strokeWidth: 2 },
  }
}

function buildTheme(nodeTypes: Set<string>) {
  const node: Record<string, NodeStyle<any>> = { default: nodeStyle(NODE_PALETTE[0]) }
  let i = 1
  for (const t of nodeTypes) {
    if (!t || t === "default" || node[t]) continue
    node[t] = nodeStyle(NODE_PALETTE[i % NODE_PALETTE.length])
    i += 1
  }
  return {
    background: PREVIEW_BG,
    node,
    link: {
      default: { color: "#9ca3af", opacity: 0.7, strokeWidth: 1 },
    },
  }
}

/** 解析预览的图谱视图：复用 @lansheng/knowledge-graph 渲染，支持 fitView 与 hover 浮窗。 */
export default function GraphPreview(props: {
  entities: ParsedEntity[]
  edges: ParsedEdge[]
  /** 变化时触发一次 fitView（适应视图按钮） */
  fitKey?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<GraphView<PreviewGenerics> | null>(null)
  const [hoveredNode, setHoveredNode] = useState<HoverNode | null>(null)
  const [hoveredLink, setHoveredLink] = useState<HoverLink | null>(null)
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)

  // 挂载一次：创建模型 + 视图 + 订阅 hover 事件
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const model = new GraphModel<PreviewGenerics>({
      initData: { graphData: { nodes: [], links: [] } },
    })
    const view = new GraphView<PreviewGenerics>({
      container: el,
      graphModel: model,
      backgroundColor: PREVIEW_BG,
      arrowDisplay: true,
      // 缩放：只调步进（10%/格）；上下限/fit 钳制用库默认值（min 0.03 / max 10 / fitMin=min / fitMax 2）
      zoom: { step: 0.1 },
      // 模拟时间配置（库不内置默认，全部外部传入）
      forceConfig: {
        velocityDecay: 0.3,
        alphaMin: 0.0002,
        stableVelocity: 0.01,
        stableTicks: 5,
      },
      theme: buildTheme(new Set(props.entities.map((e) => e.nodeType))),
      renderPlugin: (gl, canvas) =>
        new DefaultRenderPlugin<PreviewGenerics>({
          gl,
          canvas,
          width: el.clientWidth,
          height: el.clientHeight,
          pickerMode: "gpu",
        }),
    })
    viewRef.current = view
    const unsubNode = view.model.events.subscribe(
      "nodeHover",
      (node) => setHoveredNode(node as HoverNode | null),
    )
    const unsubLink = view.model.events.subscribe(
      "linkHover",
      ({ link }) => setHoveredLink(link as HoverLink | null),
    )
    return () => {
      unsubNode()
      unsubLink()
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // fitView 按钮触发
  useEffect(() => {
    if (props.fitKey && props.fitKey > 0) viewRef.current?.fitView(36)
  }, [props.fitKey])

  // 数据变化：整体替换 → 同步排布并取景；边标签按关系类型翻译
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const ids = new Set(props.entities.map((e) => e.id))
    view.model.updateGraphData({
      graphData: {
        nodes: props.entities.map((e) => ({
          id: e.id,
          data: { ...e.props, nodeType: e.nodeType, label: e.label, icon: e.icon },
        })),
        // 端点不在返回实体集内的边（preview 分表截断/悬空边）跳过，
        // 否则力导向布局 find() 抛 node not found。
        links: props.edges
          .filter((ed) => ids.has(ed.source) && ids.has(ed.target))
          .map((ed) => {
            const t = relationLabel(ed.linkType)
            return {
              id: ed.id,
              source: ed.source,
              target: ed.target,
              data: {
                ...ed.props,
                linkType: ed.linkType,
                label: t !== ed.linkType ? t : ed.label || undefined,
                time: ed.time,
                rank: ed.rank,
              },
            }
          }),
      },
    })
    // 初始模拟结束后再取景一次（呈现聚拢后的布局）；仅本次数据生效一次，
    // 避免拖拽 reheat 后 onEnd 再次触发把视图拉回。
    const onSettled = (): void => {
      viewRef.current?.fitView(36)
      if (view.layout.onEnd === onSettled) view.layout.onEnd = undefined
    }
    view.layout.onEnd = onSettled
    view.layout.settle?.(200)
    view.fitView(36)
  }, [props.entities, props.edges])

  // 容器可见后再取景（节点已 settle，包围盒可用）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) viewRef.current?.fitView(36)
      },
      { threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const onMouseLeave = (): void => {
    setHoveredNode(null)
    setHoveredLink(null)
  }

  return (
    <div className="kg-graph-wrap" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="kg-graph-preview" ref={containerRef}>
        {props.entities.length === 0 && (
          <div className="kg-empty">暂无可预览的节点</div>
        )}
      </div>
      {(hoveredNode || hoveredLink) && mouse && (
        <div className="kg-tooltip" style={{ left: mouse.x + 14, top: mouse.y + 12 }}>
          {hoveredNode ? <NodeTip node={hoveredNode} /> : <LinkTip link={hoveredLink!} />}
        </div>
      )}
    </div>
  )
}

function NodeTip(props: { node: HoverNode }) {
  const n = props.node
  const d = n.data ?? {}
  const rows = Object.entries(d).filter(([k]) => !["nodeType", "label", "icon"].includes(k)).slice(0, 8)
  return (
    <>
      <div className="kg-tt-title">{String(d.label ?? n.id)}</div>
      <div className="kg-tt-dim">类型：{nodeTypeLabel(d.nodeType as string | undefined)}</div>
      {rows.length > 0 && (
        <div className="kg-tt-rows">
          {rows.map(([k, v]) => (
            <div key={k} className="kg-tt-row">
              <span className="kg-tt-dim">{propertyLabel(k)}</span>
              <span>{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function LinkTip(props: { link: HoverLink }) {
  const d = props.link.data ?? {}
  const rows = Object.entries(d).filter(([k]) => !["linkType", "label", "time", "rank"].includes(k)).slice(0, 8)
  return (
    <>
      <div className="kg-tt-title">{relationLabel(d.linkType as string | undefined) || String(d.label ?? "")}</div>
      <div className="kg-tt-dim">{String(props.link.source ?? "")} → {String(props.link.target ?? "")}</div>
      {(d.time || d.rank !== undefined) && (
        <div className="kg-tt-dim">
          {d.time ? `时间：${d.time}` : ""}
          {d.rank !== undefined ? ` 序号：${d.rank}` : ""}
        </div>
      )}
      {rows.length > 0 && (
        <div className="kg-tt-rows">
          {rows.map(([k, v]) => (
            <div key={k} className="kg-tt-row">
              <span className="kg-tt-dim">{propertyLabel(k)}</span>
              <span>{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
