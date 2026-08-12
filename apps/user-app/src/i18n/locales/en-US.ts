/**
 * English locale。结构必须与 zh-CN 完全一致（Messages 类型强制 key 对齐）。
 */
import type { Messages } from "../types"

const enUS: Messages = {
  clearance: {
    0: "Public",
    1: "Internal",
    2: "Secret",
    3: "Top secret",
  },
}

export default enUS
