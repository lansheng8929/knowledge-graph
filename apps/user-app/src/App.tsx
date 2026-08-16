import { useEffect, useState } from "react"
import { fetchUserInfo } from "./api"
import type { UserInfo } from "./types"
import { CLEARANCE_TEXT } from "@lansheng/web-constants"

export default function App() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserInfo()
      .then(setUser)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  return (
    <div className="kg-user">
      <header className="kg-user-head">
        <h1>个人中心</h1>
        <p>当前登录账号信息与权限属性</p>
      </header>
      <div className="kg-user-body">
        {error && (
          <div className="kg-user-error" role="alert">
            {error}
          </div>
        )}
        {!user && !error && <div className="kg-user-loading">加载中…</div>}
        {user && (
          <section className="kg-user-card">
            <div className="kg-user-id">
              <div className="kg-user-avatar">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="kg-user-name">{user.username}</div>
                <div className="kg-user-sub">
                  {user.uid} · {user.tenantId}
                </div>
              </div>
            </div>
            <div className="kg-user-grid">
              <Row label="用户名" value={user.username} />
              <Row label="用户 ID" value={user.uid} />
              <Row label="租户" value={user.tenantId} />
              <Row
                label="密级"
                value={CLEARANCE_TEXT[user.clearance] ?? String(user.clearance)}
              />
              <Row label="角色" value={user.roles.join(" / ") || "—"} />
              <Row label="团队" value={user.teams.join(" / ") || "—"} />
              <Row label="组织路径" value={user.orgPath || "—"} />
              <Row label="上级" value={user.managerUid || "—"} />
              <Row
                label="下级（含间接）"
                value={
                  user.subUids.length
                    ? `${user.subUids.length} 人：${user.subUids.join(", ")}`
                    : "无"
                }
              />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="kg-user-row">
      <span className="kg-user-label">{props.label}</span>
      <span className="kg-user-value">{props.value}</span>
    </div>
  )
}
