# agent-service 图查询工具（P1，2026-08-23 落地）

- **实现**：`services/agent-service/app/tools/graph.py`，3 个工具（2026-08-23 移除 `init_graph`——对话业务无"加载图谱"场景）：
  - `search_nodes`（模糊搜索，limit≤50）/ `expand_graph`（拓出）/ `analyze_node`（通话圈）
- **注册**：`register_graph_tools(registry)` 在 `app/main.py` `create_app()` 调用（`GET /api/v1/agent/tools` 可见 3 个）
- **调用方式**：httpx 直连 `GRAPH_QUERY_URL`（env，dev=kg-dev-query:8001）；用共享 `AUTH_SECRET` 重签用户 JWT（Bearer，短 TTL 300s）→ graph-query 按用户既有 L2/L3/L4 执行
- **输出摘要化**：`ToolResult.summary` 回填 LLM（`SUMMARY_MAX=20`，节点 `id(label)` 截断）
- **错误**：graph-query HTTP 4xx → 提取 `detail` 抛 ValueError → registry 兜底 `ok=False` 回填 LLM 纠错
- **测试注入**：模块级 `_transport`（httpx.MockTransport）；`tests/test_graph_tools.py` 7 用例
- **已验证端到端**：qwen3:8b 收到 "帮我查找张三" → 调 `search_nodes` → graph-query 真实查询 → 摘要回填 → LLM 按事实作答（工具循环收敛）
- 相关文件：app/tools/registry.py（容器）、app/agent.py（循环）、app/tools/graph.py（实现）
