/** 用户信息类型（与 auth-service /api/v1/auth/userinfo 对齐）。 */

export interface UserInfo {
  username: string
  uid: string
  tenantId: string
  clearance: number
  roles: string[]
  teams: string[]
  orgPath: string
  managerUid: string
  subUids: string[]
}
