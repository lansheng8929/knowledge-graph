"""conditions JSON 白名单校验。

对应计划 T1.1.5（基础防护）+ T2.1.2（Phase 2 完整值级白名单，届时收紧 strict）。

当前策略（lenient，保持与旧行为一致）：
- 缺失关键字段 / 非法标识符 / 未知操作符的条件被「跳过」，不阻断请求；
- 标识符（relationType / targetType / property）仅允许 [A-Za-z0-9_]，杜绝 Cypher 注入；
- Phase 2 可切换 strict=True：非法条件直接抛 400。

白名单字段锚点来自前端 RuleMenu：
{ targetType, relationType, direction, filters: [{ property, operator, value }] }
"""

import json
import re
from typing import Any, Dict, List, Optional

_IDENTIFIER_RE = re.compile(r"^[A-Za-z0-9_]+$")

# 值级白名单（Phase 2 将把枚举收敛为 Rule Service 配置，此处先固化为代码常量）
ALLOWED_NODE_TYPES = {"person", "phone", "address", "account", "company", "ip", "device"}
ALLOWED_RELATION_TYPES = {
    "OWNS", "RESIDES_AT", "WORKS_AT", "HAS_ACCOUNT", "LOGIN_IP", "USE_DEVICE",
    "CALLED", "TRANSACTED",
}
ALLOWED_PROPERTIES = {"label", "gender", "age", "caseWeight"}
ALLOWED_OPERATORS = {"eq", "neq", "contains", "starts", "gt", "gte", "lt", "lte"}
ALLOWED_DIRECTIONS = {"in", "out"}


class ConditionValidationError(ValueError):
    """strict 模式下非法条件抛出。"""


def parse_conditions(raw: Optional[str]) -> List[Dict[str, Any]]:
    """解析 conditions JSON 字符串 -> list[dict]。

    返回空列表表示无有效内容；JSON 非法时抛 ValueError（由调用方转 400）。
    """
    if not raw:
        return []
    conds = json.loads(raw)  # 可能抛 json.JSONDecodeError（ValueError 子类）
    if not isinstance(conds, list):
        raise ValueError("conditions must be a list")
    return conds


def _is_valid_identifier(value: Any) -> bool:
    return isinstance(value, str) and bool(_IDENTIFIER_RE.match(value))


def validate_condition(cond: Dict[str, Any], strict: bool = False) -> Optional[Dict[str, Any]]:
    """单条件规范化 + 白名单校验。

    返回规范化后的条件 dict；不合法时：
      - lenient（默认）：返回 None（跳过该条件，保持旧行为）
      - strict：抛 ConditionValidationError（400）
    """
    rel_type = cond.get("relationType", "")
    target_type = cond.get("targetType", "")
    direction = cond.get("direction", "out")
    filters = cond.get("filters", [])

    if not rel_type or not target_type:
        return _reject("missing relationType/targetType", strict)
    if not _is_valid_identifier(rel_type) or not _is_valid_identifier(target_type):
        return _reject("invalid identifier in relationType/targetType", strict)
    if direction not in ALLOWED_DIRECTIONS:
        return _reject(f"unsupported direction: {direction!r}", strict)
    if not isinstance(filters, list):
        return _reject("filters must be a list", strict)

    valid_filters: List[Dict[str, Any]] = []
    for f in filters:
        if not isinstance(f, dict):
            continue
        prop = f.get("property", "")
        op = f.get("operator", "")
        val = f.get("value", "")
        if not prop or not op:
            continue
        if not _is_valid_identifier(prop):
            return _reject(f"invalid property identifier: {prop!r}", strict)
        if op not in ALLOWED_OPERATORS:
            return _reject(f"unsupported operator: {op!r}", strict)
        valid_filters.append({"property": prop, "operator": op, "value": val})

    return {
        "relationType": rel_type,
        "targetType": target_type,
        "direction": direction,
        "filters": valid_filters,
    }


def normalize_conditions(conds: List[Dict[str, Any]], strict: bool = False) -> List[Dict[str, Any]]:
    """批量规范化。strict=False 时过滤非法条件（保持旧行为）。"""
    result: List[Dict[str, Any]] = []
    for cond in conds:
        if not isinstance(cond, dict):
            if strict:
                raise ConditionValidationError("condition must be an object")
            continue
        normalized = validate_condition(cond, strict=strict)
        if normalized is not None:
            result.append(normalized)
    return result


def _reject(reason: str, strict: bool) -> None:
    if strict:
        raise ConditionValidationError(reason)
    return None
