# 策略测试（opa test ./policies）

package kg

subject_a = {"tenantId": "t1", "clearance": 2, "uid": "u1", "roles": ["analyst"], "teams": ["dept-a"]}

# ── 租户 ──────────────────────────────────────────────
test_tenant_mismatch_deny if {
    not allow with input as {
        "subject": {"tenantId": "a", "clearance": 3},
        "resource": {"tenantId": "b", "classification": 0, "visibility": "public"},
        "action": "search",
    }
}

test_tenant_match_allow if {
    allow with input as {
        "subject": {"tenantId": "a", "clearance": 3},
        "resource": {"tenantId": "a", "classification": 0, "visibility": "public"},
        "action": "search",
    }
}

# ── 密级 ──────────────────────────────────────────────
test_clearance_ok if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2},
        "resource": {"tenantId": "t1", "classification": 1, "visibility": "public"},
        "action": "expand",
    }
}

# 密级不参与可见性：public 数据即使密级高于 clearance 也可见（脱敏归 L4）
test_public_not_blocked_by_classification if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 1},
        "resource": {"tenantId": "t1", "classification": 2, "visibility": "public"},
        "action": "expand",
    }
}

# ── 动作白名单 ────────────────────────────────────────
test_action_not_allowed if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 3},
        "resource": {"tenantId": "t1", "classification": 0, "visibility": "public"},
        "action": "delete_all",
    }
}

# ── 属主 / 可见性 ─────────────────────────────────────
test_owner_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u1"},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "secret"},
        "action": "expand",
    }
}

# 下级可见：ownerUid ∈ 查看者 subUids → internal 可见
test_internal_owneruid_subordinate_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u-mgr", "subUids": ["u1"]},
        "resource": {"tenantId": "t1", "classification": 1, "ownerUid": "u1", "visibility": "internal"},
        "action": "expand",
    }
}

# 团队不再纳入属主范围（内部=自己及下级）
test_owner_team_not_in_scope_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u2", "teams": ["dept-a"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "dept-a", "visibility": "internal"},
        "action": "expand",
    }
}

test_owner_username_internal_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u1", "username": "alice", "teams": []},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "alice", "visibility": "internal"},
        "action": "expand",
    }
}

test_owner_username_private_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u1", "username": "alice", "teams": []},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "alice", "visibility": "private"},
        "action": "expand",
    }
}

test_no_owner_no_public_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 3, "uid": "u9", "teams": []},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u8", "visibility": "secret"},
        "action": "expand",
    }
}

# ── 可见性分层（private / internal / secret）─────────
test_private_owner_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u1", "teams": ["dept-a"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "private"},
        "action": "expand",
    }
}

test_private_team_member_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u2", "teams": ["dept-a"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "private"},
        "action": "expand",
    }
}

test_private_subordinate_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u-mgr", "subUids": ["u1"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "private"},
        "action": "expand",
    }
}

# 团队同组不再可见 internal（内部=自己及下级）
test_internal_team_member_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u2", "teams": ["dept-a"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "dept-a", "visibility": "internal"},
        "action": "expand",
    }
}

test_internal_superior_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 2, "uid": "u-mgr", "subUids": ["u1"]},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "internal"},
        "action": "expand",
    }
}

test_internal_outsider_deny if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 3, "uid": "u9", "teams": []},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u8", "visibility": "internal"},
        "action": "expand",
    }
}

# secret 存量兼容按 internal：属主本人低 clearance 也可见（密级不挡可见）
test_secret_low_clearance_owner_allow if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 1, "uid": "u1"},
        "resource": {"tenantId": "t1", "classification": 1, "owner": "u1", "visibility": "secret"},
        "action": "expand",
    }
}

# ── 节点类型 ──────────────────────────────────────────
test_device_denied_for_normal if {
    not allow with input as {
        "subject": {"tenantId": "t1", "clearance": 3, "uid": "u1", "roles": ["analyst"]},
        "resource": {"tenantId": "t1", "classification": 0, "visibility": "public", "nodeType": "device"},
        "action": "expand",
    }
}

test_device_ok_for_privileged if {
    allow with input as {
        "subject": {"tenantId": "t1", "clearance": 3, "uid": "u1", "roles": ["privileged"]},
        "resource": {"tenantId": "t1", "classification": 0, "visibility": "public", "nodeType": "device"},
        "action": "expand",
    }
}
