# infra/k8s — Kubernetes 清单骨架（T2.5.2）

> 生产部署：每服务一镜像一 Deployment + Service。可选 service mesh（Istio）把 ABAC PEP 做成 sidecar（Phase 4）。

## 文件

- `graph-query-service.yaml` — 完整示例（Deployment + Service + 探针 + Secret 引用）

## 部署

```bash
kubectl apply -f infra/k8s/

# Secret 占位（Vault 接管前，T2.5.3）
kubectl create secret generic kg-secrets \
  --from-literal=neo4j-user=neo4j \
  --from-literal=neo4j-password=password123
```

## 其余服务

- `graph-rule-service`：按 `graph-query-service.yaml` 类推（镜像 `graph-rule-service:0.1.0`，端口 8002，`RULE_STORE` 按需 `postgres`）；
- `gateway`：nginx Deployment + NodePort/LB 暴露 :8080，挂 `infra/gateway/nginx.conf`（ConfigMap）。

## 配置与密钥（T2.5.3）

- 当前经 K8s Secret 注入；Phase 4 前接入 Vault（Neo4j/PG 口令、JWT 密钥）。
