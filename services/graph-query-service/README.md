# graph-query-service

图谱查询服务（FastAPI），由 `vite-test/neo4j-server.py` 重构迁移（计划 T1.1）。

## 路由

| 方法 | 路径                    | 说明                                |
| ---- | ----------------------- | ----------------------------------- |
| POST | `/api/v1/graph/init`    | 按 ids 加载初始节点                 |
| POST | `/api/v1/graph/search`  | 模糊搜索节点                        |
| POST | `/api/v1/graph/expand`  | 拓出（conditions JSON，白名单校验） |
| POST | `/api/v1/graph/analyze` | 分析（call_circle）                 |
| GET  | `/health` `/healthz`    | 健康检查（含版本）                  |

旧路由 `/api/graph/*` 默认兼容保留，由 `ENABLE_LEGACY_ROUTES=false` 关闭。

统一响应信封：`{ "success": bool, "data": ... }`。

## 本地运行

前置：Neo4j 已启动（docker），详见 `infra/` 与 `vite-test/docker-compose.yml`。

```bash
cd services/graph-query-service
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env            # 按需修改
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## 测试

```bash
# 单元测试（validator，无外部依赖）
pytest tests/test_validator.py

# 契约测试（需要可用的 Neo4j）
NEO4J_TEST_URI=bolt://localhost:7687 \
NEO4J_TEST_USER=neo4j \
NEO4J_TEST_PASSWORD=password123 \
pytest tests/test_contract.py
```

未配置 `NEO4J_TEST_URI` 时契约测试自动 skip。

## Docker

```bash
docker build -t graph-query-service:0.1.0 .
docker run --rm -p 8001:8001 \
  -e NEO4J_URI=bolt://host.docker.internal:7687 \
  graph-query-service:0.1.0
```
