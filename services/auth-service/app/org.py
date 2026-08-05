"""组织层级工具（通用基础设施，T4.6+ 需求2）。

主体属性：managerUid（上级 uid）、orgPath（组织树路径，如 "default/ops/analysts"）。
下级集合 subUids 由 managerUid 链路推导（含间接下级），随主体上下文注入，
供 ABAC（上级可看下级数据）、审批流、任务分派、报表聚合等复用。
"""

from typing import Dict, List


def compute_sub_uids(users: List[Dict], uid: str) -> List[str]:
    """返回 uid 的所有下级（含间接）uid，按 uid 排序去重。

    users 为用户目录记录列表；每个记录的 managerUid 指向其直属上级 uid。
    """
    children: Dict[str, List[str]] = {}
    for u in users:
        m = u.get("managerUid") or ""
        if m:
            children.setdefault(m, []).append(u.get("uid") or "")
    subs: set = set()
    stack: List[str] = [uid]
    while stack:
        cur = stack.pop()
        for c in children.get(cur, []):
            if c not in subs:
                subs.add(c)
                stack.append(c)
    return sorted(subs)


def org_path(user: Dict, default: str = "") -> str:
    """取用户的 orgPath，缺省返回上级链路径或默认。"""
    return str(user.get("orgPath") or default or user.get("tenantId", "default"))
