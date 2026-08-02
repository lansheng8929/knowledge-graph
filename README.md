# knowledge-graph — 知识图谱平台（monorepo）

> 架构设计见 [`docs/architecture.md`](./docs/architecture.md)，执行计划见 [`docs/refactoring-plan.md`](./docs/refactoring-plan.md)。

## 结构

```
apps/
  shell/                # 主应用壳（Single-SPA root-config，Phase 2）
  graph-app/            # 图谱前端（React + Vite，Single-SPA 子应用）
services/
  graph-query-service/  # 图谱查询（FastAPI，/api/v1/graph/*）
  graph-rule-service/   # 规则 + 白名单校验（FastAPI，/api/v1/rules/*，Phase 2）
shared/
  api-client/           # OpenAPI 生成的 TS SDK（@lansheng/api-client）
graph/                  # WebGL 渲染引擎（@lansheng/knowledge-graph）
scripts/                # generate-data.py、generate-api-client.sh、check-api-contract.sh
infra/                  # 网关等部署配置（Phase 2）
```

## 快速开始

### 一键启动（推荐）

```bash
bash scripts/up.sh dev     # 开发模式：全容器 + 源码挂载热更新（后端 --reload、前端 HMR）
bash scripts/up.sh prod    # 生产模式：全容器（后端 + 网关 + 前端 Nginx web）
bash scripts/up.sh down    # 停止所有（数据卷保留）
bash scripts/up.sh status  # 查看状态
```

> dev 与 prod 均为全容器一键部署，共用 Neo4j 数据卷（`up.sh` 自动切换，勿手动并存）。入口 `http://localhost:3001/graph?user=analyst`。

### 数据（Neo4j）

```bash
# Neo4j compose 位于 infra/neo4j/（复用原 vite-test_neo4j_data 卷，勿随意迁移）
cd infra/neo4j && docker compose up -d
# 生成模拟数据（用服务 venv 的 Python）
services/graph-query-service/.venv/bin/python scripts/generate-data.py
```

### 后端

```bash
cd services/graph-query-service
python3 -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 前端

```bash
bun install          # 根目录，链接 workspaces（apps/*、shared/*、graph）
bun run graph:dev    # 等价 cd apps/graph-app && bun run dev → :3000
```

### SDK / 契约

```bash
bash scripts/generate-api-client.sh   # 后端 OpenAPI → shared/api-client（离线生成，无需起服务）
bash scripts/check-api-contract.sh    # 契约漂移检测（CI 用）
```

> `vite-test/` 已退役并删除（应用代码并入 `apps/graph-app`，Neo4j 承载移至 `infra/neo4j/`）。
