"""filter_schema 种子数据（幂等；管理平台可增删改）。"""
from __future__ import annotations

from typing import Any, Dict, List

# (type_kind, type_name, attr_key, filter_type, label, unit, options, sort_order)
SEED_ROWS: List[Dict[str, Any]] = [
    # ── 实体 ──
    {"type_kind": "node", "type_name": "person", "attr_key": "gender", "filter_type": "select", "label": "性别", "unit": "", "options": ["男", "女"], "sort_order": 1},
    {"type_kind": "node", "type_name": "person", "attr_key": "age", "filter_type": "number_range", "label": "年龄", "unit": "岁", "options": [], "sort_order": 2},
    {"type_kind": "node", "type_name": "person", "attr_key": "weight", "filter_type": "number_range", "label": "体重", "unit": "kg", "options": [], "sort_order": 3},
    {"type_kind": "node", "type_name": "ip", "attr_key": "ipLocation", "filter_type": "region", "label": "IP归属地", "unit": "", "options": [], "sort_order": 1},
    {"type_kind": "node", "type_name": "ip", "attr_key": "isp", "filter_type": "select", "label": "运营商", "unit": "", "options": ["电信", "联通", "移动"], "sort_order": 2},
    {"type_kind": "node", "type_name": "phone", "attr_key": "number", "filter_type": "text", "label": "号码", "unit": "", "options": [], "sort_order": 1},
    # ── 边 ──
    {"type_kind": "edge", "type_name": "CALLED", "attr_key": "duration", "filter_type": "number_range", "label": "通话时长", "unit": "秒", "options": [], "sort_order": 1},
    {"type_kind": "edge", "type_name": "CALLED", "attr_key": "times", "filter_type": "number_range", "label": "次数", "unit": "", "options": [], "sort_order": 2},
    {"type_kind": "edge", "type_name": "TRANSFER", "attr_key": "amount", "filter_type": "number_range", "label": "金额", "unit": "元", "options": [], "sort_order": 1},
    {"type_kind": "edge", "type_name": "USE_DEVICE", "attr_key": "last_seen", "filter_type": "date_range", "label": "最后使用时间", "unit": "", "options": [], "sort_order": 1},
]
