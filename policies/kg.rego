# ABAC 策略（架构 §3.4.4 落地）
#
# 决策入口：data.kg.allow（OPA POST /v1/data/kg/allow）
# 输入 input：
#   subject:  { tenantId, clearance, uid, roles[], teams[] }   —— 来自 JWT / IDP
#   resource: { tenantId, classification, owner, visibility, nodeType } —— 数据打标
#   action:   "init" | "search" | "expand" | "analyze" | "ingest"
#
# 四个维度全过才 allow：租户隔离、密级、动作白名单、属主/可见性、节点类型。

package kg

default allow := false

allow if {
    tenant_ok
    clearance_ok
    action_ok
    owner_or_visibility_ok
    node_type_ok
}

# ── 租户隔离 ─────────────────────────────────────────
tenant_ok if { input.subject.tenantId == input.resource.tenantId }

# ── 密级（主体 clearance >= 资源 classification）──────
clearance_ok if { input.subject.clearance >= input.resource.classification }

# ── 动作白名单 ───────────────────────────────────────
action_ok if { input.action in ["init", "search", "expand", "analyze", "ingest", "rule_validate"] }

# ── 属主 / 可见性（分层，2026-08-05 精细化）────────────
# public    同租户全员可见
# private   仅属主本人
# internal  属主范围：本人 / 属主所在团队 / 属主的下级
# secret    属主范围 + 额外要求密级 >= 2
owner_or_visibility_ok if { input.resource.visibility == "public" }

owner_or_visibility_ok if {
    input.resource.visibility == "private"
    input.resource.owner == input.subject.uid
}

owner_or_visibility_ok if {
    input.resource.visibility == "internal"
    owner_scope_ok
}

owner_or_visibility_ok if {
    input.resource.visibility == "secret"
    input.subject.clearance >= 2
    owner_scope_ok
}

# 属主范围：本人 / 属主所在团队 / 属主的下级
owner_scope_ok if { input.resource.owner == input.subject.uid }

owner_scope_ok if {
    input.resource.owner in object.get(input.subject, "teams", [])
}

owner_scope_ok if {
    input.resource.owner in object.get(input.subject, "subUids", [])
}

# ── 节点类型限制（示例：普通角色不可见 device）────────
node_type_ok if {
    object.get(input.resource, "nodeType", "") != "device"
}

node_type_ok if {
    "privileged" in object.get(input.subject, "roles", [])
}
