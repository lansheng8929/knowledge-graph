# infra — 部署编排

> 对应架构 §3.3.7 / 计划 T2.5

## 结构

```
infra/
  gateway/
    nginx.conf          # API Gateway（Nginx，:8080）
    README.md
  neo4j/
    docker-compose.yml  # Neo4j 5-community（复用 vite-test_neo4j_data 卷）
  docker-compose.yml    # 本地一键起全栈（T2.5.1）
  k8s/                  # Kubernetes 清单（T2.5.2）
  README.md             # 本文件
```

## 本地一键起（docker-compose）

复用现有 Neo4j（`infra/neo4j/` 的 `knowledge-graph-neo4j`，数据 volume 不丢）：

```bash
docker compose -f infra/docker-compose.yml up -d

# 验证（经网关）
curl http://localhost:8080/api/v1/graph/init -X POST -H 'Content-Type: application/json' -d '{"ids":[]}'
curl http://localhost:8080/api/v1/rules

docker compose -f infra/docker-compose.yml down   # 停（数据卷保留）
```

> 若服务已在 host 跑（本地 uvicorn :8001/:8002），会与容器内端口无关——服务容器默认不映射 host 端口，只经网关 :8080；如需直连，取消 `docker-compose.yml` 里 `ports` 注释。

## 生产部署（K8s，T2.5.2）

- 每服务一镜像一 Deployment + Service（见 `k8s/` 骨架）；
- 可选 service mesh（Istio）将 ABAC PEP 做成 sidecar（Phase 4）。

## 配置与密钥（T2.5.3，占位）

- 配置中心 + **Vault** 管理 Neo4j/PG 口令：Phase 4 前落地；
- 当前口令经 env 注入（`docker-compose.yml` / K8s Secret 占位）。

## 可观测组件（可选）

OTel Collector / Prometheus / Loki 的 compose 服务已注释在 `docker-compose.yml`，需要时解开并按需补齐 `otel/otel-config.yaml`、`prometheus/prometheus.yml`。
