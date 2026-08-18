import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import { linkEndpoints } from "../link-utils"

export interface TimeRange {
  min: number
  max: number
  hasTime: boolean
}

export interface AttrFilter {
  nodeTypes: Set<string>
  gender: string | null
  minWeight: number | null
  maxWeight: number | null
}

const EMPTY_FILTER: AttrFilter = {
  nodeTypes: new Set(),
  gender: null,
  minWeight: null,
  maxWeight: null,
}

/**
 * useGraphFilters — 时间线回放 + 属性过滤（P2）。
 *
 * 原理：不破坏 model，通过 stateManager.setHiddenNodes/hiddenLinks 驱动渲染引擎
 * 把被过滤的边/节点置为 hidden 态（半透明淡出），保留上下文、可随时撤销。
 * 时间过滤：只作用于带 time 属性的边（time > 当前时间戳 → hidden），节点保留；
 * 属性过滤：按 nodeType / gender / caseWeight 隐藏节点，并连带隐藏其关联边。
 */
export function useGraphFilters(modelRef: { current: GraphModel }) {
  const [version, setVersion] = useState(0)
  const [timeRange, setTimeRange] = useState<TimeRange>({
    min: 0,
    max: 0,
    hasTime: false,
  })
  const [timeValue, setTimeValue] = useState(0)
  const [timeActive, setTimeActive] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [attrFilter, setAttrFilter] = useState<AttrFilter>(EMPTY_FILTER)
  const rafRef = useRef(0)

  // 数据变化（init/expand/搜索新增/快照跳转）→ 重算时间范围与类型统计
  useEffect(() => {
    const model = modelRef.current
    if (!model) return
    return model.events.subscribe("dataChange", () => setVersion((v) => v + 1))
  }, [modelRef])

  const gd = useMemo(() => {
    const model = modelRef.current
    if (!model) return { nodes: [] as any[], links: [] as any[] }
    return model.getGraphModelData().graphData
  }, [modelRef, version])

  // 由边 time 推导时间范围
  useEffect(() => {
    let min = Infinity
    let max = -Infinity
    for (const l of gd.links) {
      const t = Date.parse((l.data as any)?.time)
      if (!Number.isNaN(t)) {
        min = Math.min(min, t)
        max = Math.max(max, t)
      }
    }
    if (Number.isFinite(min) && Number.isFinite(max) && min < max) {
      setTimeRange({ min, max, hasTime: true })
      setTimeValue((v) =>
        Number.isFinite(v) && v >= min && v <= max ? v : max,
      )
    } else {
      setTimeRange((r) => (r.hasTime ? { min: 0, max: 0, hasTime: false } : r))
    }
  }, [gd])

  // 节点类型统计（供过滤面板展示）
  const typeStats = useMemo(() => {
    const m = new Map<string, number>()
    for (const n of gd.nodes) {
      const t = (n.data as any)?.nodeType ?? "default"
      m.set(t, (m.get(t) ?? 0) + 1)
    }
    return m
  }, [gd])

  const applyHidden = useCallback(
    (ts: number | null, f: AttrFilter, range: TimeRange) => {
      const model = modelRef.current
      if (!model) return
      const data = model.getGraphModelData().graphData
      const hideLinks = new Set<string>()
      const hideNodes = new Set<string>()

      const timeOn = ts !== null && range.hasTime
      if (timeOn) {
        for (const l of data.links) {
          const t = Date.parse((l.data as any)?.time)
          if (!Number.isNaN(t) && t > ts!) hideLinks.add(l.id)
        }
      }

      const attrOn =
        f.nodeTypes.size > 0 ||
        f.gender !== null ||
        f.minWeight !== null ||
        f.maxWeight !== null
      if (attrOn) {
        for (const n of data.nodes) {
          const d = (n.data as any) ?? {}
          let ok = true
          if (f.nodeTypes.size > 0 && !f.nodeTypes.has(d.nodeType ?? "default"))
            ok = false
          // 性别/案值只对“有该属性”的节点生效，缺失属性的节点（如 phone 无 gender）不误杀
          if (
            ok &&
            f.gender !== null &&
            d.gender !== undefined &&
            d.gender !== f.gender
          )
            ok = false
          if (
            ok &&
            f.minWeight !== null &&
            d.caseWeight !== undefined &&
            (d.caseWeight ?? 0) < f.minWeight
          )
            ok = false
          if (
            ok &&
            f.maxWeight !== null &&
            d.caseWeight !== undefined &&
            (d.caseWeight ?? 0) > f.maxWeight
          )
            ok = false
          if (!ok) hideNodes.add(n.id)
        }
        if (hideNodes.size > 0) {
          for (const l of data.links) {
            const [s, t] = linkEndpoints(l)
            if (hideNodes.has(s) || hideNodes.has(t)) hideLinks.add(l.id)
          }
        }
      }

      model.stateManager.setHiddenNodes([...hideNodes], [...hideLinks])
    },
    [modelRef],
  )

  const onTimeChange = useCallback(
    (v: number) => {
      setTimeValue(v)
      if (timeActive) applyHidden(v, attrFilter, timeRange)
    },
    [timeActive, attrFilter, timeRange, applyHidden],
  )

  const toggleTime = useCallback(() => {
    setTimeActive((prev) => {
      const next = !prev
      applyHidden(next ? timeValue : null, attrFilter, timeRange)
      return next
    })
  }, [timeValue, attrFilter, timeRange, applyHidden])

  // 播放：从当前值匀速推进到 max
  useEffect(() => {
    if (!playing || !timeActive || !timeRange.hasTime) return
    const step = (timeRange.max - timeRange.min) / 240
    let cur = timeValue
    const raf = () => {
      cur = Math.min(timeRange.max, cur + step)
      setTimeValue(cur)
      applyHidden(cur, attrFilter, timeRange)
      if (cur >= timeRange.max) {
        setPlaying(false)
        return
      }
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, timeActive, timeRange, attrFilter, applyHidden, timeValue])

  const toggleNodeType = useCallback(
    (t: string, on: boolean) => {
      setAttrFilter((prev) => {
        const nextTypes = new Set(prev.nodeTypes)
        if (on) nextTypes.add(t)
        else nextTypes.delete(t)
        const next = { ...prev, nodeTypes: nextTypes }
        applyHidden(timeActive ? timeValue : null, next, timeRange)
        return next
      })
    },
    [timeActive, timeValue, timeRange, applyHidden],
  )

  const updateAttrFilter = useCallback(
    (patch: Partial<AttrFilter>) => {
      setAttrFilter((prev) => {
        const next: AttrFilter = { ...prev, ...patch }
        if (Array.isArray((patch as any).nodeTypes))
          next.nodeTypes = new Set((patch as any).nodeTypes as string[])
        applyHidden(timeActive ? timeValue : null, next, timeRange)
        return next
      })
    },
    [timeActive, timeValue, timeRange, applyHidden],
  )

  const resetFilters = useCallback(() => {
    setPlaying(false)
    setTimeActive(false)
    setTimeValue(timeRange.hasTime ? timeRange.max : 0)
    setAttrFilter(EMPTY_FILTER)
    const model = modelRef.current
    if (model) model.stateManager.setHiddenNodes([], [])
  }, [timeRange, modelRef])

  const hasActiveFilter =
    timeActive ||
    attrFilter.nodeTypes.size > 0 ||
    attrFilter.gender !== null ||
    attrFilter.minWeight !== null ||
    attrFilter.maxWeight !== null

  return {
    timeRange,
    timeValue,
    timeActive,
    playing,
    setPlaying,
    attrFilter,
    typeStats,
    onTimeChange,
    toggleTime,
    toggleNodeType,
    updateAttrFilter,
    resetFilters,
    hasActiveFilter,
  }
}
