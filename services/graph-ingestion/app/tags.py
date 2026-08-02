"""数据打标规范（T3.1.2）：节点/边强制标签。

标签（ABAC 资源属性）：
  - tenantId:       租户标识（多租户隔离）
  - classification: 密级，int，0=公开 1=内部 2=秘密 3=机密（比较用 >=）
  - owner:          属主（部门/账号）
  - visibility:     可见性，public | internal | secret

强制打标：ingest 时必须提供；缺标/非法 → TagValidationError（拒绝入库）。
"""

REQUIRED_TAGS = ("tenantId", "classification", "owner", "visibility")

# 存量数据 backfill 的默认标签（T3.1.3）
DEFAULT_TAGS = {
    "tenantId": "default",
    "classification": 0,
    "owner": "system",
    "visibility": "internal",
}

VALID_VISIBILITY = {"public", "internal", "secret"}
MIN_CLASSIFICATION = 0
MAX_CLASSIFICATION = 3


class TagValidationError(ValueError):
    """标签缺失或非法。"""


def validate_tags(tags: dict) -> dict:
    """校验并规范化标签；缺标/非法抛 TagValidationError。"""
    out: dict = {}
    for k in REQUIRED_TAGS:
        v = tags.get(k)
        if v is None or v == "":
            raise TagValidationError(f"missing required tag: {k}")
        out[k] = v

    cls = out["classification"]
    if not isinstance(cls, int) or isinstance(cls, bool):
        raise TagValidationError(
            f"classification must be int in [{MIN_CLASSIFICATION},{MAX_CLASSIFICATION}]"
        )
    if not (MIN_CLASSIFICATION <= cls <= MAX_CLASSIFICATION):
        raise TagValidationError(
            f"classification must be in [{MIN_CLASSIFICATION},{MAX_CLASSIFICATION}]"
        )

    if out["visibility"] not in VALID_VISIBILITY:
        raise TagValidationError(f"visibility must be one of {VALID_VISIBILITY}")

    return out


def merge_default_tags(data: dict) -> dict:
    """为缺失标签填充默认值（backfill / 兼容旧数据）。"""
    for k, v in DEFAULT_TAGS.items():
        if k not in data or data[k] in (None, ""):
            data[k] = v
    return data
