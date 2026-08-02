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

    model_config = ConfigDict(extra="allow")


class IngestLink(BaseModel):
    """关系写入：source/target + linkType + 属性 + 强制标签。"""

    id: str
    source: str
    target: str
    linkType: str
    label: str = ""
    time: str = ""
    # 强制标签（T3.1.2）
    tenantId: str
    classification: int
    owner: str
    visibility: str

    model_config = ConfigDict(extra="allow")


class IngestNodesRequest(BaseModel):
    nodes: List[IngestNode] = Field(default_factory=list)


class IngestLinksRequest(BaseModel):
    links: List[IngestLink] = Field(default_factory=list)


class IngestResult(BaseModel):
    imported: int = 0
    skipped: int = 0
    subject: str = ""
