# ABAC 策略（架构 §3.4.4 落地）
#
# 决策入口：data.kg.allow（OPA POST /v1/data/kg/allow）
# 输入 input：
#   subject:  { tenantId, clearance, uid, username, roles[], teams[], subUids[] }   —— 来自 JWT / IDP
#   resource: { tenantId, classification, owner, ownerUid, visibility, nodeType } —— 数据打标
#   action:   "init" | "search" | "expand" | "analyze" | "ingest"
#
# 统一逻辑（2026-08-06）：密级 classification 只驱动 L4 脱敏（不参与可见性）；
# 可见性 visibility 只决定能否看到：public 同租户全员 / internal 自己及下级 / private 仅自己；
# secret 为存量兼容档，按 internal 处理。

package kg

default allow := false

allow if {
    tenant_ok
    action_ok
    owner_or_visibility_ok
    node_type_ok
}

# ── 租户隔离 ─────────────────────────────────────────
tenant_ok if { input.subject.tenantId == input.resource.tenantId }

# ── 动作白名单 ───────────────────────────────────────
action_ok if { input.action in ["init", "search", "expand", "analyze", "ingest", "rule_validate"] }

# ── 可见性（只决定能否看到；密级不参与）─────────────
# public    同租户全员可见
# private   仅自己（owner/ownerUid 匹配 uid 或 username）
# internal  自己及下级（subUids）
# secret    存量兼容 → 按 internal
owner_or_visibility_ok if { input.resource.visibility == "public" }

owner_or_visibility_ok if {
    input.resource.visibility == "private"
    owner_self_ok
}

owner_or_visibility_ok if {
    input.resource.visibility == "internal"
    owner_self_or_subordinate_ok
}

owner_or_visibility_ok if {
    input.resource.visibility == "secret"
    owner_self_or_subordinate_ok
}

# 自己：owner == uid / username，或 ownerUid == uid
owner_self_ok if { input.resource.owner == input.subject.uid }
owner_self_ok if { input.resource.owner == object.get(input.subject, "username", "") }
owner_self_ok if { input.resource.ownerUid == input.subject.uid }

# 自己及下级：自己 或 ownerUid/owner ∈ subUids
owner_self_or_subordinate_ok if { owner_self_ok }
owner_self_or_subordinate_ok if { input.resource.ownerUid in object.get(input.subject, "subUids", []) }
owner_self_or_subordinate_ok if { input.resource.owner in object.get(input.subject, "subUids", []) }

# ── 节点类型限制（示例：普通角色不可见 device）────────
node_type_ok if {
    object.get(input.resource, "nodeType", "") != "device"
}

node_type_ok if {
    "privileged" in object.get(input.subject, "roles", [])
}
