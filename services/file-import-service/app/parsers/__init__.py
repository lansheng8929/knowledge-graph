"""解析器注册表：按扩展名分发到具体格式解析器。

统一输出「表格」：`{ "entities": [ {col: value}, ... ], "edges": [ ... ] }`。
Excel 按 sheet 名识别；单表格式（CSV）由调用方传入 `kind` 归属。
"""

from __future__ import annotations

import os
from typing import Dict, List

from ..models import ParseError

Table = Dict[str, List[Dict[str, object]]]


class Parser:
    """解析器接口：任何格式解析器输出统一表格（供 mapper 转 IR）。"""

    name: str = "base"
    extensions: tuple = ()

    def parse(
        self,
        raw: bytes,
        filename: str,
        kind: str = "",
        sheet_mapping: dict = None,
    ) -> Table:
        raise NotImplementedError


_REGISTRY: Dict[str, Parser] = {}


def register(parser: Parser) -> None:
    for ext in parser.extensions:
        _REGISTRY[ext] = parser


def get_parser(filename: str) -> Parser:
    ext = os.path.splitext(filename)[1].lower()
    parser = _REGISTRY.get(ext)
    if parser is None:
        raise ParseError(f"unsupported file type: {ext or '(no extension)'}")
    return parser


def supported_extensions() -> List[str]:
    return sorted(_REGISTRY.keys())


def norm_value(value: object) -> object:
    """单元格/字段值归一化：datetime→ISO，None→""。"""
    if value is None:
        return ""
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


# 引入具体解析器以触发注册（import app.parsers 即完成注册表装配）
from . import csv as _csv  # noqa: E402,F401
from . import excel as _excel  # noqa: E402,F401
