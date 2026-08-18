# agent-service

对话 Agent 服务（FastAPI）：以自然语言编排**图谱查询**（graph-query-service）与**数据抽取**（file-import-service / graph-ingestion）能力。

> **状态**：P0 脚手架（2026-08-15）。对话端点与工具循环为 Phase 1。
> 按决策「先只写配置，不接真实 LLM」：默认 `LLM_PROVIDER=mock`，OpenAI 兼容 provider 仅预留配置。
> 设计文档：`docs/agent-plan.md`。

## 路由

| 方法 | 路径 | 说明 | 状态 |
| --- | --- | --- | --- |
| GET | `/health` `/healthz` | 健康检查（含版本 + LLM provider） | ✅ |
| GET | `/api/v1/agent/tools` | 工具注册表清单 | ✅（空，P1 填充） |
| POST | `/api/v1/agent/chat` | SSE 对话（delta/tool/graph/done/error） | ⏳ P1 |

## 本地运行

```bash
cd services/agent-service
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env    # 按需修改（默认 mock，无需任何 LLM 密钥）
uvicorn app.main:app --host 0.0.0.0 --port 8006
```

## 测试

```bash
pytest tests/
```

## 配置（P0）

| 环境变量 | 默认 | 说明 |
| --- | --- | --- |
| `LLM_PROVIDER` | `mock` | `mock`（默认，无需外部服务）\| `openai`（预留，未接入） |
| `LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL` | 空 | 预留：真实 LLM 接入时填（DeepSeek/Qwen/Ollama 等 OpenAI 兼容） |
| `MOCK_SCRIPT` | 空 | 可选 JSON：mock 工具调用序列（P1 测试用） |
| `MAX_TOOL_TURNS` / `MAX_OUTPUT_TOKENS` | 8 / 2048 | Agent 循环上限（P1 生效） |
| `AUTH_SECRET` | dev-secret-change-me | P1：以用户 JWT 重签调用上游（与 auth-service 同密钥） |
| `GRAPH_QUERY_URL` / `IMPORT_SERVICE_URL` / `INGESTION_URL` | localhost:8001/8005/8003 | P1 工具调用目标 |
