# infra/gateway — API Gateway（Nginx）

> 对应架构 §3.3.3 / 计划 T2.2（Phase 2）

## 路由

| 入口                       | 目标                       |
| -------------------------- | -------------------------- |
| `GET/POST /api/v1/graph/*` | `graph-query-service:8001` |
| `GET/POST /api/v1/rules/*` | `graph-rule-service:8002`  |

统一出口 `:8080`；限流 `30r/s`（burst 20）；CORS 统一；`/_authz` 为 Phase 4 JWT 校验占位（`auth_request` 钩子）。

## 启动（docker，服务已在同一 docker 网络时）

```bash
cd infra/gateway
docker run -d --name kg-gateway -p 8080:8080 \
  -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.27-alpine

# 验证
curl http://localhost:8080/api/v1/graph/init -X POST -H 'Content-Type: application/json' -d '{"ids":[]}'
```

> upstream 用的是 docker 网络服务名（`graph-query-service`/`graph-rule-service`）。
> 若服务跑在宿主机（非 docker），把 `nginx.conf` 中 upstream 改为 `127.0.0.1:8001` / `127.0.0.1:8002`。
> 全栈编排（含 Neo4j/PostgreSQL 统一起）在 T2.5 的 `infra/docker-compose.yml` 落地。

## 开发说明

开发阶段前端 `VITE_API_BASE=/api/v1` 走 Vite proxy 直连 `:8001`，不强制走网关；
生产/联调走网关统一入口 `:8080`。前端只需把 `VITE_API_BASE` 指向网关地址。

## 状态

- [x] T2.2.1 路由（graph/rules → 各自服务）
- [x] T2.2.2 限流 / CORS / 统一出口
- [x] T2.2.3 JWT 校验占位（`/_authz` 钩子，Phase 4 接入）
