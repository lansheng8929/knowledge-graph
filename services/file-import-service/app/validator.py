"""校验器：id 唯一、标识符、端点引用（dangling）、强制打标配置。

按行收集错误，不因单行失败整批回滚（失败行计入 skipped，有效行继续）。
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List

from .ir import ParsedEdge, ParsedEntity, ParsedGraph
from .models import ImportConfig

_IDENTIFIER_RE = re.compile(r"^[A-Za-z0-9_\u4e00-\u9fa5]+$")

# 默认 nodeType 白名单（现有 7 种；可经 config.nodeTypes 扩展）
DEFAULT_NODE_TYPES = {
    "person",
    "phone",
    "address",
    "account",
    "company",
    "ip",
    "device",
}

VALID_VISIBILITY = {"public", "internal", "private"}
MIN_CLASSIFICATION = 0
MAX_CLASSIFICATION = 3


@dataclass
class ValidationResult:
    entities: List[ParsedEntity] = field(default_factory=list)
    edges: List[ParsedEdge] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    skipped: int = 0


def _validate_tags(config: ImportConfig, errors: List[str]) -> None:
    t = config.tags
    if not t.tenantId:
        errors.append("config.tags.tenantId required")
    if not t.owner:
        errors.append("config.tags.owner required")
    if not isinstance(t.classification, int) or isinstance(t.classification, bool):
        errors.append("config.tags.classification must be int")
    elif not (MIN_CLASSIFICATION <= t.classification <= MAX_CLASSIFICATION):
        errors.append(
            f"config.tags.classification must be in [{MIN_CLASSIFICATION},{MAX_CLASSIFICATION}]"
        )
    if t.visibility not in VALID_VISIBILITY:
        errors.append(
            f"config.tags.visibility must be one of {sorted(VALID_VISIBILITY)}"
        )
    if config.edge.insertMode not in ("update", "insert"):
        errors.append("config.edge.insertMode must be update|insert")
    if config.dangling not in ("skip", "auto-create"):
        errors.append("config.dangling must be skip|auto-create")


def validate(graph: ParsedGraph, config: ImportConfig) -> ValidationResult:
    res = ValidationResult(warnings=list(graph.warnings))
    _validate_tags(config, res.errors)
    if res.errors:
        return res  # 打标/配置非法 → 直接失败（不写库）

    node_types = set(DEFAULT_NODE_TYPES) | set(config.nodeTypes)
    known_ids: dict = {}

    for ent in graph.entities:
        if ent.id in known_ids:
            res.errors.append(f"duplicate entity id: {ent.id}")
            res.skipped += 1
            continue
        if not _IDENTIFIER_RE.match(ent.nodeType):
            res.errors.append(f"entity {ent.id}: invalid nodeType '{ent.nodeType}'")
            res.skipped += 1
            continue
        if config.strictNodeTypes and ent.nodeType not in node_types:
            res.errors.append(
                f"entity {ent.id}: nodeType '{ent.nodeType}' not in whitelist"
            )
            res.skipped += 1
            continue
        if ent.nodeType not in node_types:
            res.warnings.append(
                f"entity {ent.id}: nodeType '{ent.nodeType}' outside default whitelist"
            )
        known_ids[ent.id] = ent
        res.entities.append(ent)

    for edge in graph.edges:
        if not _IDENTIFIER_RE.match(edge.linkType):
            res.errors.append(f"edge {edge.id}: invalid linkType '{edge.linkType}'")
            res.skipped += 1
            continue
        missing = [nid for nid in (edge.source, edge.target) if nid not in known_ids]
        if missing:
            if config.dangling == "auto-create":
                for nid in missing:
                    placeholder = ParsedEntity(
                        id=nid, nodeType=config.danglingNodeType, label=nid
                    )
                    known_ids[nid] = placeholder
                    res.entities.append(placeholder)
                res.warnings.append(
                    f"edge {edge.id}: dangling endpoints auto-created: {missing}"
                )
            else:
                res.skipped += 1
                res.warnings.append(
                    f"edge {edge.id}: dangling endpoints skipped: {missing}"
                )
                continue
        res.edges.append(edge)

    return res
