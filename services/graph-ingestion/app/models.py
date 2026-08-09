"""ingest 请求模型（契约固化，T3.1.1）。"""

from typing import Any, Dict, List

from pydantic import BaseModel, ConfigDict, Field


class IngestNode(BaseModel):
    """节点写入：id + nodeType + 属性 + 强制标签。"""

    id: str
    nodeType: str
    label: str = ""
    icon: str = ""
    props: Dict[str, Any] = Field(default_factory=dict)
    # 强制标签（T3.1.2）
    tenantId: str
    classification: int
    owner: str
    visibility: str
    # 属主 uid（“内部=自己及下级”可见性匹配用）
    ownerUid: str = ""

    model_config = ConfigDict(extra="allow")


class IngestLink(BaseModel):
    """关系写入：source/target + linkType + 公共属性(rank/time) + 属性 + 强制标签。"""

    id: str
    source: str
    target: str
    linkType: str
    label: str = ""
    time: str = ""
    rank: int = 0
    props: Dict[str, Any] = Field(default_factory=dict)
    # 强制标签（T3.1.2）
    tenantId: str
    classification: int
    owner: str
    visibility: str
    # 属主 uid（“内部=自己及下级”可见性匹配用）
    ownerUid: str = ""

    model_config = ConfigDict(extra="allow")


class IngestNodesRequest(BaseModel):
    nodes: List[IngestNode] = Field(default_factory=list)


class IngestLinksRequest(BaseModel):
    links: List[IngestLink] = Field(default_factory=list)


class IngestResult(BaseModel):
    imported: int = 0
    skipped: int = 0
    subject: str = ""


class IntimacyEdge(BaseModel):
    """亲密度计算入参：一条待计算的边（只读，不写库）。

    v2：亲密度 = 单条边的质量。weight 可作调用方覆盖的类型权重；
    props 携带业务指标字段、time 携带时间字段（供 businessMetric/timeDecay 维度）。
    """

    id: str
    source: str
    target: str
    linkType: str = ""
    # 类型权重覆盖（linkTypeWeight 维度缺省时用之；默认 1.0 = 未指定）
    weight: float = 1.0
    # 业务属性（如 { "amount": 80000, "duration": 120 }）
    props: Dict[str, Any] = Field(default_factory=dict)
    # 边时间（ISO 字符串，timeDecay 维度用）
    time: str = ""

    model_config = ConfigDict(extra="allow")


class IntimacyRequest(BaseModel):
    edges: List[IntimacyEdge] = Field(default_factory=list)


class RecomputeIntimacyRequest(BaseModel):
    """亲密度重算（可更新）：按当前配置重算并更新库中边。"""

    # all | linkTypes | edgeIds | pairs
    scope: str = "all"
    linkTypes: List[str] = Field(default_factory=list)
    edgeIds: List[str] = Field(default_factory=list)
    pairs: List[List[str]] = Field(default_factory=list)


class RecomputeIntimacyResult(BaseModel):
    updated: int = 0


class IntimacyResult(BaseModel):
    intimacies: Dict[str, float] = Field(default_factory=dict)
    stats: Dict[str, Dict[str, Dict[str, float]]] = Field(default_factory=dict)
