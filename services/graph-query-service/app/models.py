"""API 请求 / 响应 Pydantic 模型（契约固化）。

对应计划 T1.1.3：GraphNode / GraphLink / NeighborSummary / PageResult。
响应统一信封：{ "success": bool, "data": ... }（与现状兼容）。
"""

from typing import Any, Dict, Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field


# ── 请求模型 ──────────────────────────────────────────


class InitRequest(BaseModel):
    ids: List[str] = Field(default_factory=list)


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class ExpandRequest(BaseModel):
    sourceNodeId: str
    ruleId: str = ""
    existingNodeIds: List[str] = Field(default_factory=list)
    existingLinkIds: List[str] = Field(default_factory=list)
    conditions: Optional[str] = None


class AnalysisRequest(BaseModel):
    nodeIds: List[str]
    type: str = "call_circle"
    timeWindow: Optional[str] = None


# ── 响应模型（宽松兼容动态字段）──────────────────────


class _Lenient(BaseModel):
    """允许任意额外字段（与现状返回的动态 data 兼容）。"""

    model_config = ConfigDict(extra="allow")


class NeighborCounts(BaseModel):
    out: int = 0
    in_: int = Field(default=0, alias="in")
    total: int = 0

    model_config = ConfigDict(populate_by_name=True, extra="allow")


class NeighborSummary(_Lenient):
    """{ targetType: { relType: NeighborCounts } } 的动态映射。"""


class NodeData(_Lenient):
    nodeType: str = "default"
    label: str = ""
    icon: str = ""
    count: int = 0
    total: int = 0
    neighbors: Dict[str, Any] = Field(default_factory=dict)


class GraphNode(BaseModel):
    id: str
    data: NodeData


class LinkData(_Lenient):
    linkType: str = ""
    label: str = ""
    time: str = ""


class GraphLink(BaseModel):
    id: str
    source: str
    target: str
    data: LinkData


class GraphData(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    links: List[GraphLink] = Field(default_factory=list)


class InitData(BaseModel):
    """init 响应 data：{ graphData }（后端 query_init 嵌套结构）。"""

    graphData: GraphData


class PageResult(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    links: List[GraphLink] = Field(default_factory=list)
    total: int = 0
    hasMore: bool = False
    rulesMap: Dict[str, Any] = Field(default_factory=dict)


T = TypeVar("T")


class Envelope(BaseModel, Generic[T]):
    """统一响应信封 { success, data: T }。"""

    success: bool = True
    data: Optional[T] = None


class SearchData(BaseModel):
    """search 响应 data。"""

    nodes: List[GraphNode] = Field(default_factory=list)


class AnalyzeItem(BaseModel):
    """analyze 结果条目（call_circle）。"""

    sourceId: str = ""
    id: str = ""
    label: str = ""
    relation: str = ""
    time: str = ""
    count: int = 0

    model_config = ConfigDict(extra="allow")


class AnalyzeData(BaseModel):
    """analyze 响应 data。"""

    type: str = "call_circle"
    items: List[AnalyzeItem] = Field(default_factory=list)
    graphData: Optional[GraphData] = None

    model_config = ConfigDict(extra="allow")
