"""导入请求/配置模型（契约固化）。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ValidationError


class ParseError(ValueError):
    """文件解析 / 配置解析失败。"""


class TagConfig(BaseModel):
    """强制打标（写入口校验，缺失默认值由本服务补齐）。"""

    tenantId: str = "default"
    classification: int = 0
    owner: str = "system"
    visibility: str = "internal"
    # 属主 uid：由服务端注入（不可伪造），供“内部=自己及下级”可见性匹配
    ownerUid: str = ""


class EdgeConfig(BaseModel):
    """边抽取规则（P1：rank/businessKey/insertMode）。"""

    # 业务键列，可多个：`[{ "col": "流水号" }, { "col": "业务时间" }]`，按序拼入边 id 哈希
    businessKey: List[Dict[str, Any]] = Field(default_factory=list)
    # update=更新相同边（默认）| insert=新插入边（max(rank)+1）
    insertMode: str = "update"


class ImportConfig(BaseModel):
    """导入配置（可选，multipart 的 config 字段）。"""

    tags: TagConfig = Field(default_factory=TagConfig)
    edge: EdgeConfig = Field(default_factory=EdgeConfig)
    # entities 缺 nodeType 列时的兜底类型
    nodeTypeDefault: str = ""
    # nodeType 白名单扩展（默认 7 种见 validator.DEFAULT_NODE_TYPES）
    nodeTypes: List[str] = Field(default_factory=list)
    strictNodeTypes: bool = False
    # 悬空边处理：skip（默认）| auto-create
    dangling: str = "skip"
    danglingNodeType: str = "entity"
    # Excel sheet 映射：{ "entities": "人员表", "edges": "转账关系" }
    # 缺省回退：按 sheet 名 entities/edges（大小写不敏感）识别
    sheetMapping: Dict[str, str] = Field(default_factory=dict)


def parse_config(raw: Optional[str]) -> ImportConfig:
    """解析 config JSON；空串/None → 默认配置。"""
    if not raw or not raw.strip():
        return ImportConfig()
    try:
        return ImportConfig.model_validate_json(raw)
    except ValidationError as e:
        raise ParseError(f"invalid config JSON: {e}") from e
