/**
 * 图内分析模式的模块级共享 store。
 *
 * 分析模式（度中心性/连通分量）作为 theme 回调的一部分实现：
 * useAnalysisMode 计算模式数据写入本 store，GraphView 的 theme node 回调
 * （useGraphApp 内）读取 store 生成最终节点样式。这样节点样式始终由回调
 * 完整解析（含 bgColor/radius），不存在 styleManager instance 覆盖导致的
 * 字段缺失/节点消失问题。
 */

export type AnalysisMode = "none" | "degree" | "component"

/** renderer 节点颜色（[r,g,b,a] 0~1）→ hex；读不到返回 undefined */
export function rgbToHex(color?: number[]): string | undefined {
  if (!color || color.length < 3) return undefined
  const to = (v: number): string =>
    Math.round(v * 255).toString(16).padStart(2, "0")
  return "#" + to(color[0]) + to(color[1]) + to(color[2])
}

export const COMPONENT_COLORS = [
  "#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4",
  "#42d4f4", "#f032e6", "#bfef45", "#fabed4", "#469990",
]

export interface AnalysisStore {
  mode: AnalysisMode
  /** 度中心性：nodeId → 度数；maxD=最大度数 */
  degree: Map<string, number>
  maxD: number
  /** 连通分量：nodeId → 分量编号 */
  component: Map<string, number>
}

/** 节点 weight 归一化用最大权重（画布内最大值；数据约定 0~1 时约为 1） */
export const weightScale = { max: 1 }

export const analysisStore: AnalysisStore = {
  mode: "none",
  degree: new Map(),
  maxD: 1,
  component: new Map(),
}

/** 模式对某节点的视觉覆盖（radius/bgColor），无模式返回空 */
export function analysisOverrides(
  nodeId: string,
): { radius?: number; bgColor?: string } {
  const s = analysisStore
  if (s.mode === "degree") {
    const d = s.degree.get(nodeId) ?? 0
    return { radius: 6 + (d / s.maxD) * 14 }
  }
  if (s.mode === "component") {
    const c = s.component.get(nodeId) ?? 0
    return { bgColor: COMPONENT_COLORS[c % COMPONENT_COLORS.length] }
  }
  return {}
}
