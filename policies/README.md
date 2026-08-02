# policies — OPA / Rego 策略仓库

> 对应架构 §3.4.1（PAP 策略管理点）/ 计划 T4.2

## 内容

- `kg.rego`：ABAC 主策略（决策入口 `data.kg.allow`）
  - 四维判定：租户隔离、密级（clearance >= classification）、动作白名单、属主/可见性、节点类型限制
- `kg_test.rego`：策略测试（`opa test`）

## 输入约定（PEP 客户端组装）

```
input.subject  = { tenantId, clearance, uid, roles[], teams[] }   # 来自 IDP/JWT
input.resource = { tenantId, classification, owner, visibility, nodeType }  # 数据打标
input.action   = "init" | "search" | "expand" | "analyze" | "ingest"
```

## 运行 / 测试

```bash
# 测试
opa test ./policies

# 本地起 OPA（docker）
docker run --rm -p 8181:8181 -v "$PWD:/policies" openpolicyagent/opa run --server /policies

# 查询决策
curl -X POST localhost:8181/v1/data/kg/allow \
  -H 'Content-Type: application/json' \
  -d '{"input":{"subject":{"tenantId":"t1","clearance":2},
                "resource":{"tenantId":"t1","classification":1,"visibility":"public"},
                "action":"expand"}}'
# → {"result":{"allow":true}}
```

## Bundle 下发（生产）

策略打包为 bundle 由 OPA 拉取（版本化，PAP→PDP）：`opa build -b policies/ -o bundle.tar.gz`，或经 OPA bundle 服务/配置中心下发。策略漂移由「单一仓库 + bundle + 共享 PEP 客户端」防。

## 注意

- OPA 是 **PDP（决策点）**；各服务内嵌 `shared/pep-client`（PEP）调用它。
- 决策默认 **fail-closed**：OPA 不可达 → deny。
