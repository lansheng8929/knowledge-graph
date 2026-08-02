"""validator 单元测试（无外部依赖）。"""

import json

import pytest

from app.models import RuleDefinition
from app.validator import (
    ConditionValidationError,
    parse_conditions,
    validate_conditions,
)


def _rule(**kw):
    defaults = dict(
        id="r1",
        name="测试规则",
        allowedTargetTypes=["person", "phone"],
        allowedRelationTypes=["OWNS", "CALLED"],
        allowedProperties=["label", "age"],
        allowedOperators=["eq", "contains"],
    )
    defaults.update(kw)
    return RuleDefinition(**defaults)


# ── parse ─────────────────────────────────────────────


def test_parse_valid():
    conds = parse_conditions('[{"relationType": "OWNS"}]')
    assert len(conds) == 1


def test_parse_invalid_json_raises():
    with pytest.raises(json.JSONDecodeError):
        parse_conditions("not-json")


def test_parse_none_empty():
    assert parse_conditions(None) == []


# ── validate：白名单命中 ─────────────────────────────


def _cond(target="person", rel="OWNS", prop="label", op="eq"):
    return [
        {
            "relationType": rel,
            "targetType": target,
            "direction": "out",
            "filters": [{"property": prop, "operator": op, "value": "张三"}],
        }
    ]


def test_validate_ok():
    result = validate_conditions(_cond(), _rule())
    assert result.valid
    assert len(result.normalized) == 1


def test_validate_target_not_allowed():
    result = validate_conditions(_cond(target="company"), _rule())
    assert not result.valid
    assert any("targetType" in e for e in result.errors)


def test_validate_relation_not_allowed():
    result = validate_conditions(_cond(rel="TRANSACTED"), _rule())
    assert not result.valid
    assert any("relationType" in e for e in result.errors)


def test_validate_property_not_allowed():
    result = validate_conditions(_cond(prop="gender"), _rule())
    assert not result.valid
    assert any("property" in e for e in result.errors)


def test_validate_operator_not_allowed():
    result = validate_conditions(_cond(op="gt"), _rule())
    assert not result.valid
    assert any("operator" in e for e in result.errors)


def test_validate_injection_rejected():
    cond = [
        {
            "relationType": "OWNS]-(x)-[r:OWNS",
            "targetType": "person",
            "direction": "out",
        }
    ]
    result = validate_conditions(cond, _rule())
    assert not result.valid


def test_validate_lenient_skips_bad_cond():
    good = _cond()
    bad = {"relationType": "OWNS", "targetType": "company"}
    result = validate_conditions([*good, *bad], _rule())
    # 合法条件保留，非法条件跳过并报错
    assert result.valid is False
    assert len(result.normalized) == 1


def test_validate_strict_raises():
    with pytest.raises(ConditionValidationError):
        validate_conditions(_cond(prop="gender"), _rule(), strict=True)
