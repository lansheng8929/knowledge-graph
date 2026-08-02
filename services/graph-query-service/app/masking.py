"""L4 字段级脱敏（T4.7）：敏感字段按主体属性掩码返回。

规则示例：phone 节点的 label（手机号）在主体 clearance<2 且非 privileged 角色时掩码
（如 13812341234 → 138****1234）。其它敏感字段（身份证等）可按需扩展。
"""


def mask_sensitive(node_type: str, data: dict, subject: dict) -> dict:
    """对敏感字段掩码；返回（浅拷贝后的）data。"""
    roles = subject.get("roles", []) or []
    try:
        clearance = int(subject.get("clearance", 0))
    except (TypeError, ValueError):
        clearance = 0

    if "privileged" in roles or clearance >= 2:
        return data

    if node_type == "phone":
        label = data.get("label", "")
        if isinstance(label, str) and len(label) >= 7:
            data["label"] = label[:3] + "****" + label[-4:]

    return data
