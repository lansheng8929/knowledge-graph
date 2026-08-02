/** 面板层级枚举 */
export enum PanelLayer {
  /** 鼠标悬浮提示（不拦截点击） */
  Tooltip = 1000,
  /** 交互面板（SnapshotPanel, RuleMenu） */
  Panel = 1100,
  /** 顶部工具栏 */
  Toolbar = 800,
  /** 全屏遮罩（Loading） */
  Overlay = 3000,
  /** 通知（Error, ExpandingLoader） */
  Notification = 9900,
}

/** 面板注册信息 */
export interface PanelRegistration {
  id: string
  layer: PanelLayer
}

/** PanelContext 值 */
export interface PanelContextValue {
  /** 注册面板 */
  register: (id: string) => void
  /** 注销面板 */
  unregister: (id: string) => void
  /** 将面板置顶 */
  focus: (id: string) => void
  /** 当前焦点栈（从旧到新） */
  focusStack: string[]
}
