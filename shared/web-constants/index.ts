/**
 * 平台共享前端常量（单一来源）。
 * 各子应用显示层共用，避免同一业务值域（密级等）在多个应用中重复定义导致漂移。
 */

/** 密级 0-3 → 中文文案 */
export const CLEARANCE_TEXT: Record<number, string> = {
  0: "公开",
  1: "内部",
  2: "秘密",
  3: "机密",
}

/** 密级可选档位（下拉选择用） */
export const CLEARANCE_OPTIONS = Object.entries(CLEARANCE_TEXT).map(
  ([value, label]) => ({ value: Number(value), label }),
)
