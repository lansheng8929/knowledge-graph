"""组织/主体范围判定：本组织（orgPath 子树）与本人 + 下级（subUids）。"""

from __future__ import annotations

from typing import Any, Dict


def org_in_scope(subject: Dict[str, Any], row_org_path: str) -> bool:
    """row 的 orgPath 是否属于 subject 可看范围（本组织或下级组织）。"""
    s = subject.get("orgPath") or ""
    if not row_org_path:
        return True  # 无组织信息放行
    if not s:
        return False
    return row_org_path == s or row_org_path.startswith(s.rstrip("/") + "/")


def uid_in_scope(subject: Dict[str, Any], uid: str) -> bool:
    """uid 是否属于 本人 或 下级（含间接）。"""
    me = subject.get("uid")
    subs = set(subject.get("subUids", []))
    return bool(uid) and (uid == me or uid in subs)
