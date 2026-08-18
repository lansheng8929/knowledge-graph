# service-common

平台后端服务共享代码（单一来源，各服务 pip install -e 引用）：

- `service_common/jwt.py` — JWT HS256 签发/校验（纯标准库）
- `service_common/subject.py` — 主体解析（X-User-Context / Bearer JWT 兜底）

> 规则：任何服务改动共享代码需跑全部服务的 pytest 回归。
