"""LLM 客户端层。

- `LLM_PROVIDER=mock`（默认）：`MockLLM` 确定性模拟 —— 触发一次工具调用后
  汇总工具结果作答，无真实网络，用于开发/测试跑通全链路。
- `LLM_PROVIDER=openai`（预留启用）：`OpenAILLMClient` —— 经 httpx 直连任何
  OpenAI 兼容 chat/completions 接口（DeepSeek / Qwen / Ollama / vLLM 等），
  配置 `LLM_BASE_URL` + `LLM_MODEL` 即可启用（`LLM_API_KEY` 本地服务可空）。

环境变量统一经 config.get_env* 获取（docs/agent-plan.md §11.2）。
"""

from __future__ import annotations

import json
import logging
from typing import Any, Protocol

import httpx

from .config import get_env, get_env_float
from .models import LLMMessage, ToolCall

logger = logging.getLogger(__name__)


class LLMClient(Protocol):
    async def chat(
        self,
        messages: list[LLMMessage],
        tools: list[dict] | None = None,
    ) -> LLMMessage: ...

    async def ping(self) -> tuple[bool, str]: ...


class MockLLM:
    """确定性 mock：无真实网络。

    行为：
    1. 对话中已有工具结果（role=tool 消息）→ 汇总各结果作为最终回答（收敛，不重复触发）；
    2. 无工具结果且最后一条用户消息命中 MOCK_SCRIPT.trigger → 返回脚本化 tool_calls
       （工具名不在本次 tools 白名单内的调用被跳过）；
    3. 其余 → 原样回显最后一条用户消息。
    """

    def __init__(self, script: dict[str, Any] | None = None) -> None:
        # 形态：{"trigger": ["关键词A", ...],
        #        "tool_calls": [{"name": ..., "arguments": {...}}, ...]}
        self._script = script

    def _script_calls(self, last_user: str, tools: list[dict] | None) -> list[ToolCall]:
        if not self._script or not any(
            kw in last_user for kw in self._script.get("trigger", [])
        ):
            return []
        allowed = {t.get("name") for t in (tools or [])}
        calls: list[ToolCall] = []
        for i, c in enumerate(self._script.get("tool_calls", [])):
            name = c.get("name", "")
            if tools is not None and name not in allowed:
                logger.warning("MOCK_SCRIPT 引用了未注册工具 %s，跳过", name)
                continue
            calls.append(
                ToolCall(
                    id=f"mock-{i}", name=name or "", arguments=c.get("arguments", {})
                )
            )
        return calls

    async def chat(
        self,
        messages: list[LLMMessage],
        tools: list[dict] | None = None,
    ) -> LLMMessage:
        # ① 已有工具结果 → 汇总作答（保证工具流程一轮后收敛）
        tool_msgs = [m for m in messages if m.role == "tool"]
        if tool_msgs:
            lines = [f"{m.tool_call_id}: {m.content}" for m in tool_msgs]
            return LLMMessage.assistant(f"[mock] 工具执行完成：{'；'.join(lines)}")

        # ② 命中脚本 → 工具调用（仅当脚本工具在本次白名单内）
        last_user = next(
            (m.content for m in reversed(messages) if m.role == "user"), ""
        )
        calls = self._script_calls(last_user, tools)
        if calls:
            return LLMMessage.assistant(tool_calls=calls)

        # ③ 普通回显
        return LLMMessage.assistant(f"[mock] {last_user}")

    async def ping(self) -> tuple[bool, str]:
        return True, ""


# ── OpenAI 兼容转换（chat/completions 协议）─────────────


def _to_openai_message(m: LLMMessage) -> dict:
    """LLMMessage → OpenAI messages 元素。"""
    if m.role == "assistant" and m.tool_calls:
        return {
            "role": "assistant",
            "content": m.content or None,
            "tool_calls": [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.name,
                        "arguments": json.dumps(tc.arguments, ensure_ascii=False),
                    },
                }
                for tc in m.tool_calls
            ],
        }
    if m.role == "tool":
        return {"role": "tool", "tool_call_id": m.tool_call_id, "content": m.content}
    return {"role": m.role, "content": m.content}


def _to_openai_tool(spec: dict) -> dict:
    """工具元数据 dict → OpenAI tools 元素。"""
    return {
        "type": "function",
        "function": {
            "name": spec["name"],
            "description": spec.get("description", ""),
            "parameters": spec.get("parameters", {"type": "object", "properties": {}}),
        },
    }


def _from_openai_choice(msg: dict) -> LLMMessage:
    """OpenAI chat.completion message → LLMMessage。"""
    tool_calls: list[ToolCall] = []
    for tc in msg.get("tool_calls") or []:
        fn = tc.get("function") or {}
        try:
            arguments = json.loads(fn.get("arguments") or "{}")
        except json.JSONDecodeError:
            arguments = {}
        tool_calls.append(
            ToolCall(id=tc.get("id", ""), name=fn.get("name", ""), arguments=arguments)
        )
    return LLMMessage(
        role="assistant", content=msg.get("content") or "", tool_calls=tool_calls
    )


class OpenAILLMClient:
    """OpenAI 兼容 chat/completions 实现（httpx 直连，无 openai SDK 依赖）。

    配置（env，经 config.get_env）：
      LLM_BASE_URL          必填，如 https://api.deepseek.com/v1 或 http://localhost:11434/v1
      LLM_MODEL             必填，如 deepseek-chat / qwen2.5 / llama3.1
      LLM_API_KEY           可空（本地 Ollama 等无需鉴权）
      LLM_TIMEOUT_SECONDS   默认 60
    """

    def __init__(self, transport: httpx.AsyncBaseTransport | None = None) -> None:
        self._base_url = get_env("LLM_BASE_URL", "").rstrip("/")
        self._api_key = get_env("LLM_API_KEY", "")
        self._model = get_env("LLM_MODEL", "")
        self._timeout = get_env_float("LLM_TIMEOUT_SECONDS", 60.0)
        self._transport = transport  # 测试注入用
        if not self._base_url or not self._model:
            raise ValueError(
                "LLM_PROVIDER=openai 需要配置 LLM_BASE_URL 与 LLM_MODEL（LLM_API_KEY 可空）"
            )

    async def ping(self) -> tuple[bool, str]:
        """连通性 + 模型可用性探测（GET /models），不可用返回 (False, 原因)。"""
        headers = {"Authorization": f"Bearer {self._api_key}"} if self._api_key else {}
        try:
            async with httpx.AsyncClient(
                timeout=min(self._timeout, 5.0), transport=self._transport
            ) as client:
                resp = await client.get(f"{self._base_url}/models", headers=headers)
                resp.raise_for_status()
                data = resp.json()
        except httpx.HTTPStatusError as exc:
            code = exc.response.status_code if exc.response is not None else "?"
            logger.exception("LLM 服务 /models 返回 HTTP %s", code)
            return False, f"LLM 服务不可达: HTTP {code}"
        except Exception as exc:
            detail = str(exc) or type(exc).__name__
            logger.exception("LLM 服务不可达: %s", detail)
            return False, f"LLM 服务不可达: {detail}"
        models = [m.get("id") for m in data.get("data", [])]
        if models and self._model not in models:
            return False, f"模型 {self._model} 不在可用列表（{', '.join(models)}）"
        return True, ""

    async def chat(
        self,
        messages: list[LLMMessage],
        tools: list[dict] | None = None,
    ) -> LLMMessage:
        payload: dict[str, Any] = {
            "model": self._model,
            "messages": [_to_openai_message(m) for m in messages],
        }
        if tools:
            payload["tools"] = [_to_openai_tool(t) for t in tools]

        headers = {"Authorization": f"Bearer {self._api_key}"} if self._api_key else {}
        async with httpx.AsyncClient(
            timeout=self._timeout, transport=self._transport
        ) as client:
            resp = await client.post(
                f"{self._base_url}/chat/completions",
                headers=headers,
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()

        return _from_openai_choice(data["choices"][0]["message"])


def get_llm() -> LLMClient:
    """按 LLM_PROVIDER 环境变量返回客户端实例。"""
    provider = get_env("LLM_PROVIDER", "mock").lower()
    if provider == "mock":
        script: dict[str, Any] | None = None
        raw = get_env("MOCK_SCRIPT", "")
        if raw:
            try:
                script = json.loads(raw)
            except json.JSONDecodeError:
                logger.warning("MOCK_SCRIPT 不是合法 JSON，忽略")
        return MockLLM(script=script)
    if provider == "openai":
        return OpenAILLMClient()
    raise ValueError(f"未知 LLM_PROVIDER: {provider!r}（可选 mock|openai）")
