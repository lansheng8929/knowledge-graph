"""统一中间表示（IR）：所有解析器 → 映射器输出的统一结构。

与 graph-ingestion `IngestNode / IngestLink` 对齐（仅差强制标签，由写入口补齐）。
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class ParsedEntity:
    id: str
    nodeType: str
    label: str = ""
    icon: str = ""
    props: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ParsedEdge:
    id: str
    source: str
    target: str
    linkType: str
    label: str = ""
    time: str = ""  # 公共属性：边的更新时间（程序写入，非配置）
    rank: int = 0  # 公共属性：序号（update 模式恒 0；insert 模式递增）
    props: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ParsedGraph:
    entities: List[ParsedEntity] = field(default_factory=list)
    edges: List[ParsedEdge] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
