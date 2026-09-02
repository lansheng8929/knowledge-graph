import { useCallback, useState } from "react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type { MyGraphView } from "../graph-types"
import { connectedComponents, degreeMap } from "./graph-metrics"
import { analysisStore } from "./mode-store"
import type { AnalysisMode } from "./mode-store"

/** 分析模式中文标签（组件用） */
export const ANALYSIS_MODE_LABELS: Record<AnalysisMode, string> = {
  none: "无",
  degree: "度中心性（节点大小）",
  component: "连通分量（分色）",
}

export type { AnalysisMode }

/**
 * 图内分析模式（docs/graph-analysis-plan.md P1）：
 * none=默认；degree=节点大小按度数；component=节点颜色按连通分量。
 *
 * 实现：计算结果写入模块级 analysisStore，再 view.refreshTheme() 触发 theme
 * 节点回调重新解析（回调读 store 生成完整样式）。不使用 styleManager instance
 * 覆盖——回调式主题下 instance 覆盖易缺字段/丢失基础样式。
 */
export function useAnalysisMode(
  modelRef: { current: GraphModel | null },
  viewRef: { current: MyGraphView | null },
) {
  const [mode, setMode] = useState<AnalysisMode>("none")

  const applyMode = useCallback(
    (m: AnalysisMode): void => {
      setMode(m)
      analysisStore.mode = m
      const model = modelRef.current
      if (model && m !== "none") {
        const { graphData } = model.getGraphModelData()
        const nodes = graphData.nodes as { id: string }[]
        const links = graphData.links as {
          id: string
          source: string | { id: string }
          target: string | { id: string }
        }[]
        if (m === "degree") {
          const deg = degreeMap(nodes, links)
          let maxD = 1
          for (const d of deg.values()) maxD = Math.max(maxD, d)
          analysisStore.degree = deg
          analysisStore.maxD = maxD
        } else if (m === "component") {
          analysisStore.component = connectedComponents(nodes, links)
        }
      } else if (m === "none") {
        analysisStore.degree = new Map()
        analysisStore.maxD = 1
        analysisStore.component = new Map()
      }
      // 重新解析 theme 回调（读 analysisStore 生成节点样式）
      viewRef.current?.refreshTheme()
    },
    [modelRef, viewRef],
  )

  return { mode, applyMode }
}
