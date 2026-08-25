import type { SimLink } from "@lansheng/knowledge-graph/physics"

/**
 * 图谱物理参数（单一来源）。
 * 初始布局与「树形→力导向」切换共用同一组基础参数，避免两处配置漂移。
 */
export const BASE_FORCE_CONFIG = {
  repulsion: -200,
  linkDistance: 70,
  linkStrength: 0.5,
  centerStrength: 0.1,
  // 模拟时间配置（库不内置默认，全部外部传入）
  velocityDecay: 0.4,
  alphaMin: 0.0002,
  stableVelocity: 0.01,
  stableTicks: 5,
}

/** 亲密度→吸引力影响系数：越大，亲密边拉得越紧 */
export const INTIMACY_INFLUENCE_DEFAULT = 1.2
export const INFLUENCE_MIN = 0
export const INFLUENCE_MAX = 3
export const INFLUENCE_STEP = 0.1

export interface IntimacyLink {
  intimacy?: number
}

/** 亲密度→边拉扯力函数（linkDistanceFn/linkStrengthFn 见 physics 引擎契约） */
export function buildIntimacyFns(influence: number) {
  return {
    linkDistanceFn: (link: SimLink) => {
      const i = link.intimacy
      if (i === undefined) return undefined
      // 影响系数越大，亲密边 rest distance 越小（下限 18px 防重叠）
      return Math.max(18, 100 * (1.5 - i * (0.7 * influence)))
    },
    linkStrengthFn: (link: SimLink) => {
      const i = link.intimacy
      if (i === undefined) return undefined
      return 0.5 * (0.3 + i * (0.9 * influence))
    },
  }
}
