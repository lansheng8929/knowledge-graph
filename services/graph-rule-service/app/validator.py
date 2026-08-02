"""conditions JSON 值级白名单校验（T2.1.2）。

以 RuleDefinition 为白名单来源，校验前端自由传入的 conditions：
- 标识符（relationType/targetType/property）仅允许 [A-Za-z0-9_]，防 Cypher 注入；
- 取值必须落在规则定义的 allowed* 白名单内；
- lenient（默认）：非法条件/过滤器被跳过并记录 error；strict：抛 ConditionValidationError。
"""

import json
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from .models import RuleDefinition

_IDENTIFIER_RE = re.compile(r"^[A-Za-z0-9_]+$")
ALLOWED_DIRECTIONS = {"in", "out"}
DEFAULT_OPERATORS = {"eq", "neq", "contains", "starts", "gt", "gte", "lt", "lte"}


class ConditionValidationError(ValueError):
    """strict 模式下非法条件抛出。"""


@dataclass
class ValidationResult:
    normalized: List[Dict[str, Any]] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    @property
    def valid(self) -> bool:
        return not self.errors


def parse_conditions(raw: Optional[str]) -> List[Dict[str, Any]]:
    """解析 conditions JSON 字符串 -> list[dict]。非法 JSON 抛 JSONDecodeError。"""
    if not raw:
        return []
    conds = json.loads(raw)
    if not isinstance(conds, list):
        raise ValueError("conditions must be a list")
    return conds


def _ok(ident: Any) -> bool:
    return isinstance(ident, str) and bool(_IDENTIFIER_RE.match(ident))


def validate_conditions(
    conds: List[Dict[str, Any]],
    rule: RuleDefinition,
    strict: bool = False,
) -> ValidationResult:
    """按规则定义校验 conditions；返回规范化结果与错误列表。"""
    result = ValidationResult()

    allowed_targets = set(rule.allowedTargetTypes or [])
    allowed_rels = set(rule.allowedRelationTypes or [])
    allowed_props = set(rule.allowedProperties or [])
    allowed_ops = set(rule.allowedOperators or []) or DEFAULT_OPERATORS

    def _reject(msg: str) -> None:
        result.errors.append(msg)
        if strict:
            raise ConditionValidationError(msg)

    for ci, cond in enumerate(conds):
        if not isinstance(cond, dict):
            _reject(f"condition[{ci}] must be an object")
            continue

        rel_type = cond.get("relationType", "")
        target_type = cond.get("targetType", "")
        direction = cond.get("direction", "out")

        if not rel_type or not target_type:
            _reject(f"condition[{ci}] missing relationType/targetType")
            continue
        if not _ok(rel_type) or not _ok(target_type):
            _reject(f"condition[{ci}] invalid identifier")
            continue
        if allowed_targets and target_type not in allowed_targets:
            _reject(f"condition[{ci}] targetType {target_type!r} not allowed by rule")
            continue
        if allowed_rels and rel_type not in allowed_rels:
            _reject(f"condition[{ci}] relationType {rel_type!r} not allowed by rule")
            continue
        if direction not in ALLOWED_DIRECTIONS:
            _reject(f"condition[{ci}] unsupported direction")
            continue

        valid_filters: List[Dict[str, Any]] = []
        filters = cond.get("filters", []) or []
        for fi, f in enumerate(filters):
            if not isinstance(f, dict):
                _reject(f"condition[{ci}].filters[{fi}] must be an object")
                continue
            prop = f.get("property", "")
            op = f.get("operator", "")
            val = f.get("value", "")
            if not prop or not op:
                _reject(f"condition[{ci}].filters[{fi}] missing property/operator")
                continue
            if not _ok(prop):
                _reject(f"condition[{ci}].filters[{fi}] invalid property identifier")
                continue
            if allowed_props and prop not in allowed_props:
                _reject(
                    f"condition[{ci}].filters[{fi}] property {prop!r} not allowed by rule"
                )
                continue
            if op not in allowed_ops:
                _reject(f"condition[{ci}].filters[{fi}] operator {op!r} not allowed")
                continue
            valid_filters.append({"property": prop, "operator": op, "value": val})

        result.normalized.append(
            {
                "relationType": rel_type,
                "targetType": target_type,
                "direction": direction,
                "filters": valid_filters,
            }
        )

    return result
