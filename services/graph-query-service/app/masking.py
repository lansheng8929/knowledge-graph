"""L4 字段级脱敏（T4.7）：密级只处理脱敏，可见性只处理可见。

规则（2026-08-06 统一）：`clearance >= 数据密级` → 不脱敏；否则敏感字段掩码。
未打标/公开(0) 一律不脱敏。示例：密级>=1 的 phone 节点，对 clearance 低于数据密级
的主体掩码（13812341234 → 138****1234）。字段级密级后续再叠加。
"""


def mask_sensitive(node_type: str, data: dict, subject: dict) -> dict:
    """对敏感字段掩码；返回（浅拷贝后的）data。密级只决定脱敏。"""
    try:
        clearance = int(subject.get("clearance", 0))
    except (TypeError, ValueError):
        clearance = 0

    cls = data.get("classification")
    try:
        cls = int(cls) if cls is not None else 0
    except (TypeError, ValueError):
        cls = 0

    # clearance >= 数据密级（含未打标/公开）→ 不脱敏
    if clearance >= cls:
        return data

    if node_type == "phone":
        label = data.get("label", "")
        if isinstance(label, str) and len(label) >= 7:
            data["label"] = label[:3] + "****" + label[-4:]

    return data
