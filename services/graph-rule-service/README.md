# graph-rule-service

规则目录 + 值级白名单校验服务（FastAPI）。对应架构 §3.3.2 / 计划 T2.1（Phase 2 先行）。

## 职责

- **规则目录**：拓出规则定义（targetType / relationType / property / operator 白名单）CRUD + 版本 + 状态流转（draft → published → deprecated）
- **值级白名单校验**：前端自由传 conditions JSON，本服务按规则定义校验取值（未知字段/越界值"传了也没用"）
- 未来承载 **L2 规则级授权**（ABAC 授权对象）

## 路由

| 方法    | 路径                         | 说明                      |
| ------- | ---------------------------- | ------------------------- |
| GET     | `/api/v1/rules`              | 规则列表                  |
| POST    | `/api/v1/rules`              | 创建规则                  |
| GET/PUT | `/api/v1/rules/{id}`         | 获取 / 更新（版本 +1）    |
| POST    | `/api/v1/rules/{id}/publish` | 发布（状态流转）          |
| DELETE  | `/api/v1/rules/{id}`         | 删除                      |
| POST    | `/api/v1/rules/validate`     | 校验 conditions（白名单） |
| GET     | `/health` `/healthz`         | 健康检查                  |

## 存储后端

- `RULE_STORE=memory`（默认）：内存存储，无外部依赖，用于开发/测试；
- `RULE_STORE=postgres`：PostgreSQL（psycopg3），`PG_DSN` 指定连接串（用户手动装 docker）。

## 本地运行

```bash
cd services/graph-rule-service
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8002
```

## 测试

```bash
pytest tests/            # validator 单测 + 规则 API（内存存储，无需 PG）
```

## 校验示例

```bash
# 建一条规则（只允许 OWNS→person、label/age、eq/contains）
curl -X POST localhost:8002/api/v1/rules -H 'Content-Type: application/json' -d '{
  "name": "按人名拓出关联人",
  "allowedTargetTypes": ["person"],
  "allowedRelationTypes": ["OWNS"],
  "allowedProperties": ["label", "age"],
  "allowedOperators": ["eq", "contains"]
}'

# 校验：age 属性越界（rule 不允许 age? 允许）→ 用不在白名单的 property 测拒绝
curl -X POST localhost:8002/api/v1/rules/validate -H 'Content-Type: application/json' -d '{
  "ruleId": "xxx",
  "conditions": "[{\"relationType\":\"OWNS\",\"targetType\":\"person\",\"direction\":\"out\",\"filters\":[{\"property\":\"gender\",\"operator\":\"eq\",\"value\":\"男\"}]}]"
}'
# → valid:false, errors: [property 'gender' not allowed by rule]
```

> 注：`ruleId` 需先用 CRUD 创建的真实 id；`/validate` 也支持内联传 `rule` 定义。
