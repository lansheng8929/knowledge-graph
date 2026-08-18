/**
 * 节点类型 / 关系类型 → 中文显示标签（单一来源）。
 * 全应用共用；新类型在此登记，勿在各组件内复制。
 */
export const NODE_TYPE_LABELS: Record<string, string> = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认",
}

export const RELATION_LABELS: Record<string, string> = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账",
}
