"""图查询工具（P1）：search_nodes / expand_graph / analyze_node / graph_jump_link。

- httpx 直连 graph-query-service（GRAPH_QUERY_URL）
- 共享 AUTH_SECRET 重签用户 JWT（Bearer）随请求发出 → 目标服务按用户既有 L2/L3/L4 执行
- 输出摘要化（ToolResult.summary 回填 LLM），大结果截断防上下文膨胀
"""

from __future__ import annotations

import logging
import time
from typing import Any
from urllib.parse import quote

import httpx

from service_common.jwt import sign

from ..config import get_env
from ..models import ToolCall, ToolResult, ToolSpec

logger = logging.getLogger(__name__)

SUMMARY_MAX = 20
_TIMEOUT = 30.0

_transport: httpx.AsyncBaseTransport | None = None  # 测试注入用


def _headers(subject: dict[str, Any]) -> dict[str, str]:
    secret = get_env("AUTH_SECRET", "")
    payload = {
        **subject,
        "iat": int(time.time()),
        "exp": int(time.time()) + 300,
    }
    return {"Authorization": f"Bearer {sign(payload, secret)}"}


async def _post(path: str, body: dict[str, Any], subject: dict[str, Any]) -> dict[str, Any]:
    """调用 graph-query 并解析 {success, data} 信封；失败抛 ValueError（带 detail）。"""
    url = f"{get_env('GRAPH_QUERY_URL', 'http://localhost:8001')}{path}"
    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT, transport=_transport) as client:
            resp = await client.post(url, json=body, headers=_headers(subject))
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as exc:
        detail = ""
        try:
            detail = exc.response.json().get("detail", "")
        except Exception:  # noqa: BLE001
            pass
        raise ValueError(detail or f"HTTP {exc.response.status_code}") from exc
    if not data.get("success"):
        raise ValueError(str(data.get("error") or data.get("detail") or "graph-query 调用失败"))
    return data.get("data") or {}


def _fmt_nodes(nodes: list[dict[str, Any]], limit: int = SUMMARY_MAX) -> str:
    parts = []
    for n in nodes[:limit]:
        d = n.get("data", {})
        parts.append(f"{n.get('id')}({d.get('label') or d.get('nodeType')})")
    text = ", ".join(parts)
    if len(nodes) > limit:
        text += f" … 共 {len(nodes)} 个"
    return text


async def _search(query: str, limit: int, subject: dict[str, Any]) -> str:
    data = await _post(
        "/api/v1/graph/search", {"query": query, "limit": min(limit or 10, 50)}, subject
    )
    nodes = data.get("nodes") or []
    return f"搜索到 {len(nodes)} 个节点：{_fmt_nodes(nodes)}"


async def _expand(args: dict[str, Any], subject: dict[str, Any]) -> str:
    body = {
        "sourceNodeId": args.get("sourceNodeId", ""),
        "ruleId": args.get("ruleId", ""),
        "existingNodeIds": args.get("existingNodeIds", []),
        "existingLinkIds": args.get("existingLinkIds", []),
        "conditions": args.get("conditions"),
    }
    data = await _post("/api/v1/graph/expand", body, subject)
    nodes = data.get("nodes") or []
    links = data.get("links") or []
    return f"拓出 {len(nodes)} 个节点 / {len(links)} 条关系（命中 {data.get('total', 0)}）：{_fmt_nodes(nodes)}"


async def _analyze(
    node_ids: list[str], atype: str | None, time_window: str | None, subject: dict[str, Any]
) -> str:
    body: dict[str, Any] = {"nodeIds": node_ids, "type": atype or "call_circle"}
    if time_window:
        body["timeWindow"] = time_window
    data = await _post("/api/v1/graph/analyze", body, subject)
    items = data.get("items") or []
    desc = "; ".join(
        f"{it.get('label')}({it.get('relation')}×{it.get('count')})"
        for it in items[:SUMMARY_MAX]
    )
    return f"通话圈 {len(items)} 个联系：{desc}"


async def _handler_search(call: ToolCall, subject: dict[str, Any]) -> ToolResult:
    a = call.arguments
    return ToolResult(
        tool_call_id=call.id,
        summary=await _search(a.get("query", ""), int(a.get("limit", 10)), subject),
    )


async def _handler_expand(call: ToolCall, subject: dict[str, Any]) -> ToolResult:
    return ToolResult(tool_call_id=call.id, summary=await _expand(call.arguments, subject))


async def _handler_analyze(call: ToolCall, subject: dict[str, Any]) -> ToolResult:
    a = call.arguments
    return ToolResult(
        tool_call_id=call.id,
        summary=await _analyze(a.get("nodeIds") or [], a.get("type"), a.get("timeWindow"), subject),
    )


async def _handler_jump_link(call: ToolCall, subject: dict[str, Any]) -> ToolResult:
    a = call.arguments
    node_ids = [str(x).strip() for x in (a.get("nodeIds") or []) if str(x).strip()]
    if not node_ids:
        return ToolResult(
            tool_call_id=call.id, ok=False, summary="nodeIds 为空，无法生成图谱跳转链接"
        )
    label = str(a.get("label") or "").strip() or "在画布中打开图谱"
    ids = ",".join(quote(x, safe="") for x in node_ids)
    link = f"[{label}](/graph?ids={ids})"
    return ToolResult(
        tool_call_id=call.id,
        ok=True,
        summary=f"已生成图谱跳转链接，请原样插入回复末尾：{link}",
    )


TOOL_SPECS: list[ToolSpec] = [
    ToolSpec(
        name="search_nodes",
        description="查找/定位知识图谱节点：支持按名称模糊搜索或按节点 ID 精确查询（只读）",
        parameters={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "搜索关键词或节点 ID（如 device-617）"},
                "limit": {"type": "integer", "description": "返回上限，默认 10，最大 50"},
            },
            "required": ["query"],
        },
    ),
    ToolSpec(
        name="expand_graph",
        description="从指定节点按条件拓出关联节点与关系（只读）",
        parameters={
            "type": "object",
            "properties": {
                "sourceNodeId": {"type": "string", "description": "源节点 id"},
                "ruleId": {"type": "string", "description": "规则 id，为空走自定义"},
                "existingNodeIds": {"type": "array", "items": {"type": "string"}},
                "existingLinkIds": {"type": "array", "items": {"type": "string"}},
                "conditions": {"type": "string", "description": "可选：条件 JSON 字符串"},
            },
            "required": ["sourceNodeId"],
        },
    ),
    ToolSpec(
        name="analyze_node",
        description="分析节点通话圈（call_circle，只读）",
        parameters={
            "type": "object",
            "properties": {
                "nodeIds": {"type": "array", "items": {"type": "string"}},
                "type": {"type": "string", "description": "默认 call_circle"},
                "timeWindow": {"type": "string", "description": "如 30d"},
            },
            "required": ["nodeIds"],
        },
    ),
    ToolSpec(
        name="graph_jump_link",
        description="为回复中的具体节点组装「在画布中打开」跳转链接（/graph?ids=…）；返回的链接请原样插入回复末尾（只读，纯组装不查询）",
        parameters={
            "type": "object",
            "properties": {
                "nodeIds": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "要跳转的节点 id 列表（来自 search_nodes / expand_graph / analyze_node 的结果）",
                },
                "label": {
                    "type": "string",
                    "description": "链接文字，默认「在画布中打开图谱」",
                },
            },
            "required": ["nodeIds"],
        },
    ),
]


def register_graph_tools(registry) -> None:
    """注册图查询工具（P1）。"""
    handlers = [_handler_search, _handler_expand, _handler_analyze, _handler_jump_link]
    for spec, handler in zip(TOOL_SPECS, handlers):
        registry.register(spec, handler)
