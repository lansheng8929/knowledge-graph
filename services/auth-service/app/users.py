"""种子/演示用户定义（供初始化脚本 app.seed_users 使用，服务本身不硬编码用户）。

生产：用户由 /api/v1/auth/users（admin）动态创建，或独立 seed 脚本插入。
密码不在此定义——由 seed 脚本 / bootstrap env 注入，避免默认口令进代码。
"""

from typing import Dict, List

# 种子用户（仅属性；密码由 seed 脚本提供）
# managerUid = 直属上级 uid（组织层级，org.compute_sub_uids 推导下级集合）
SEED_USERS: List[Dict] = [
    {
        "username": "admin",
        "uid": "u-admin",
        "tenantId": "default",
        "clearance": 3,
        "roles": ["admin", "analyst", "privileged"],
        "teams": ["ops"],
        "managerUid": "",
        "orgPath": "default/ops",
    },
    {
        "username": "analyst",
        "uid": "u-analyst",
        "tenantId": "default",
        "clearance": 1,
        "roles": ["analyst"],
        "teams": ["analysis"],
        "managerUid": "u-admin",
        "orgPath": "default/ops/analysts",
    },
    {
        "username": "viewer",
        "uid": "u-viewer",
        "tenantId": "default",
        "clearance": 0,
        "roles": ["viewer"],
        "teams": ["analysis"],
        "managerUid": "u-analyst",
        "orgPath": "default/ops/analysts/viewers",
    },
    {
        "username": "other-tenant",
        "uid": "u-other",
        "tenantId": "other-tenant",
        "clearance": 2,
        "roles": ["analyst"],
        "teams": [],
        "managerUid": "",
        "orgPath": "other-tenant",
    },
]
