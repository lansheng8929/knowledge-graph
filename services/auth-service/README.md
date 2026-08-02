# auth-service

自研 IDP / 身份服务（T4.1.1）。签发与校验 JWT、用户管理，供网关 `auth_request` 做登录态校验与主体注入。

## 职责

- **密码认证**：`/api/v1/auth/login`（用户名 + 密码，PBKDF2-HMAC-SHA256 哈希，纯标准库）
- **JWT 签发**：HS256，payload 含 `iss/aud/sub/jti/uid/tenantId/clearance/roles/teams/iat/exp`
- **用户管理**：`/api/v1/auth/users`（需 admin 角色；`USER_STORE=memory|postgres`）
- **用户自省**：`/api/v1/auth/userinfo`
- **网关校验**：`/_authz`（验 JWT → 200 + `X-Subject-Context` 头；含 L1 方法/路径级粗判）

## 端点

| 方法     | 路径                    | 说明                                     |
| -------- | ----------------------- | ---------------------------------------- |
| POST     | `/api/v1/auth/login`    | `{username, password}` → `{token, user}` |
| GET      | `/api/v1/auth/userinfo` | 带 Bearer token → 当前用户属性           |
| GET      | `/api/v1/auth/users`    | 用户列表（admin）                        |
| POST     | `/api/v1/auth/users`    | 创建用户（admin）                        |
| GET/POST | `/_authz`               | 网关内部校验端点（不可直接访问）         |
| GET      | `/health` `/healthz`    | 健康检查                                 |

## 演示账户（由 seed 脚本插入，不在服务代码硬编码）

服务启动只 **bootstrap 初始 admin**（密码来自 `AUTH_BOOTSTRAP_ADMIN_PASSWORD`）；其余演示账户由幂等 seed 脚本插入：

```bash
bash scripts/up.sh seed              # 在 dev/prod 容器环境插入（推荐）
# 或手动：
docker compose -f infra/docker-compose.dev.yml run --rm --no-deps auth python -m app.seed_users
```

seed 默认密码规则：`<username>123`（可用 `SEED_PASSWORD` 统一、`SEED_PASSWORD_PREFIX` 改前缀）。

| 用户           | 密级 | 角色                     | 用途                      |
| -------------- | ---- | ------------------------ | ------------------------- |
| `admin`        | 3    | admin/analyst/privileged | 最高权限、用户管理        |
| `analyst`      | 1    | analyst                  | 普通分析（phone 脱敏）    |
| `viewer`       | 0    | viewer                   | 受限（expand 被 L1 拒绝） |
| `other-tenant` | 2    | analyst                  | 其它租户（验证租户隔离）  |

## 配置（env）

| 变量                        | 默认                                       | 说明                                          |
| --------------------------- | ------------------------------------------ | --------------------------------------------- |
| `AUTH_SECRET`               | `dev-secret-change-me`                     | JWT HMAC 密钥（生产必改）                     |
| `TOKEN_TTL_SECONDS`         | 3600                                       | token 有效期                                  |
| `USER_STORE`                | memory                                     | `memory` \| `postgres`                       |
| `AUTH_DB_DSN`               | postgresql://auth:auth@localhost:5432/auth | postgres 存储用                               |
| `AUTH_BOOTSTRAP_ADMIN_PASSWORD` | （空=不创建）                          | 初始 admin 密码（仅 bootstrap，生产 Secret 注入） |

## 本地运行

```bash
cd services/auth-service
python3 -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8004
# 登录测试
curl -X POST localhost:8004/api/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

> 生产 IDP 可替换为 Keycloak（同契约：签发 JWT + 网关 `/_authz` 校验），本服务保持为轻量实现。
