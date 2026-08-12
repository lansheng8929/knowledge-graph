/**
 * 简体中文语言包（默认 locale，key 基准）。
 * 命名空间分组 + 点路径取值，例如 t("relation.type.CALLED")。
 * 其余 locale 通过 `satisfies Messages` 保证 key 与之一致。
 */
const zhCN = {
  node: {
    type: {
      person: "人员",
      phone: "手机号",
      address: "地址",
      account: "账户",
      company: "公司",
      ip: "IP地址",
      device: "设备",
      default: "默认",
    },
  },
  relation: {
    type: {
      OWNS: "名下",
      RESIDES_AT: "居住",
      WORKS_AT: "工作",
      HAS_ACCOUNT: "开户",
      LOGIN_IP: "登录",
      USE_DEVICE: "使用",
      CALLED: "通话",
      CALL: "通话",
      TRANSACTED: "转账",
      TRANSFER: "转账",
    },
  },
  property: {
    label: "名称/标识",
    gender: "性别",
    age: "年龄",
    caseWeight: "案件权重",
  },
} as const

export default zhCN
