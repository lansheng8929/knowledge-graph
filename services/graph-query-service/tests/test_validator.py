"""validator 单元测试（无外部依赖，纯逻辑）。"""

import json

import pytest

from app.validator import (
    ConditionValidationError,
    normalize_conditions,
    parse_conditions,
    validate_condition,
)

# ── parse_conditions ──────────────────────────────────


def test_parse_none_returns_empty():
    assert parse_conditions(None) == []
    assert parse_conditions("") == []


def test_parse_valid_json():
    conds = parse_conditions('[{"relationType": "OWNS"}]')
    assert len(conds) == 1
    assert conds[0]["relationType"] == "OWNS"


def test_parse_invalid_json_raises():
    with pytest.raises(json.JSONDecodeError):
        parse_conditions("not-json")


def test_parse_non_list_raises():
    with pytest.raises(ValueError):
        parse_conditions('{"a": 1}')


# ── validate_condition（lenient 默认）─────────────────


def _valid_cond():
    return {
        "relationType": "OWNS",
        "targetType": "person",
        "direction": "out",
        "filters": [{"property": "label", "operator": "eq", "value": "张三"}],
    }


def test_valid_cond_normalized():
    norm = validate_condition(_valid_cond())
    assert norm is not None
    assert norm["relationType"] == "OWNS"
    assert len(norm["filters"]) == 1


def test_missing_rel_or_target_skipped():
    assert validate_condition({"targetType": "person"}) is None
    assert validate_condition({"relationType": "OWNS"}) is None


def test_unknown_operator_skipped():
    cond = _valid_cond()
    cond["filters"] = [{"property": "label", "operator": "regex", "value": "x"}]
    assert validate_condition(cond) is None


def test_cypher_injection_identifier_rejected():
    cond = _valid_cond()
    cond["relationType"] = "OWNS]-(x)-[r:OWNS"
    assert validate_condition(cond) is None


def test_unsupported_direction_rejected():
    cond = _valid_cond()
    cond["direction"] = "sideways"
    assert validate_condition(cond) is None


def test_bad_property_identifier_rejected():
    cond = _valid_cond()
    cond["filters"] = [{"property": "label]; DETACH DELETE n", "operator": "eq", "value": "x"}]
    assert validate_condition(cond) is None


# ── strict 模式 ───────────────────────────────────────


def test_strict_missing_field_raises():
    with pytest.raises(ConditionValidationError):
        validate_condition({"targetType": "person"}, strict=True)


def test_normalize_lenient_filters_bad():
    good = _valid_cond()
    bad = {"relationType": "OWNS"}
    norm = normalize_conditions([good, bad])
    assert len(norm) == 1


def test_normalize_strict_raises():
    with pytest.raises(ConditionValidationError):
        normalize_conditions([_valid_cond(), {"relationType": "OWNS"}], strict=True)
