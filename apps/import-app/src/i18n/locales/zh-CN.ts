/**
 * 简体中文语言包（默认 locale，key 基准）。
 * 命名空间分组 + 点路径取值，例如 t("import.status.running")。
 */
const zhCN = {
  import: {
    status: {
      pending: "排队中",
      queued: "排队中",
      running: "进行中",
      success: "成功",
      failed: "失败",
    },
    stage: {
      parsing: "解析",
      validating: "校验",
      writing: "写入",
      done: "完成",
    },
  },
  visibility: {
    public: "公开",
    internal: "内部",
    private: "仅本人",
  },
  classification: {
    0: "公开",
    1: "内部",
    2: "秘密",
    3: "机密",
  },
} as const

export default zhCN
