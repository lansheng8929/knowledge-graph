"""tags 单元测试（无外部依赖）。"""

import pytest

from app.tags import (
    DEFAULT_TAGS,
    TagValidationError,
    merge_default_tags,
    validate_tags,
)


def _valid_tags():
    return {
        "tenantId": "t1",
        "classification": 1,
        "owner": "dept-a",
        "visibility": "internal",
    }


def test_valid_tags_ok():
    out = validate_tags(_valid_tags())
    assert out["tenantId"] == "t1"


def test_missing_tag_raises():
    tags = _valid_tags()
    del tags["owner"]
    with pytest.raises(TagValidationError):
        validate_tags(tags)


def test_classification_out_of_range_raises():
    tags = _valid_tags()
    tags["classification"] = 5
    with pytest.raises(TagValidationError):
        validate_tags(tags)
    tags["classification"] = -1
    with pytest.raises(TagValidationError):
        validate_tags(tags)


def test_classification_must_be_int():
    tags = _valid_tags()
    tags["classification"] = "high"
    with pytest.raises(TagValidationError):
        validate_tags(tags)


def test_invalid_visibility_raises():
    tags = _valid_tags()
    tags["visibility"] = "public_to_all"
    with pytest.raises(TagValidationError):
        validate_tags(tags)


def test_merge_default_tags():
    data = {"tenantId": "t1"}
    out = merge_default_tags(data)
    assert out["classification"] == DEFAULT_TAGS["classification"]
    assert out["visibility"] == "internal"
    assert out["owner"] == "system"
