/**
 * English locale。结构必须与 zh-CN 完全一致（Messages 类型强制 key 对齐）。
 */
import type { Messages } from "../types"

const enUS: Messages = {
  node: {
    type: {
      person: "Person",
      phone: "Phone",
      address: "Address",
      account: "Account",
      company: "Company",
      ip: "IP Address",
      device: "Device",
      default: "Default",
    },
  },
  relation: {
    type: {
      OWNS: "Owns",
      RESIDES_AT: "Resides at",
      WORKS_AT: "Works at",
      HAS_ACCOUNT: "Has account",
      LOGIN_IP: "Login IP",
      USE_DEVICE: "Uses device",
      CALLED: "Called",
      CALL: "Call",
      TRANSACTED: "Transacted",
      TRANSFER: "Transfer",
    },
  },
  property: {
    label: "Name/ID",
    gender: "Gender",
    age: "Age",
    caseWeight: "Case weight",
  },
}

export default enUS
