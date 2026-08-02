"""初始化脚本：把种子用户插入用户存储（幂等，替代代码硬编码 seed）。

用法（容器，自动继承服务 env）：
  docker compose -f infra/docker-compose.dev.yml run --rm --no-deps auth python -m app.seed_users
  docker compose -f infra/docker-compose.yml     run --rm --no-deps auth python -m app.seed_users

或本地：
  cd services/auth-service && USER_STORE=postgres AUTH_DB_DSN=... .venv/bin/python -m app.seed_users

密码规则（不进入服务代码）：
  默认 <username>123；SEED_PASSWORD=xxx 统一；SEED_PASSWORD_PREFIX=xx 用 xx+username
"""

import os

from .config import settings
from .security import hash_password
from .store import create_user_store
from .users import SEED_USERS


def main() -> None:
    store = create_user_store(settings.user_store, settings.auth_db_dsn)
    fixed = os.getenv("SEED_PASSWORD", "")
    prefix = os.getenv("SEED_PASSWORD_PREFIX", "")
    created = skipped = 0
    for u in SEED_USERS:
        if store.get(u["username"]) is not None:
            skipped += 1
            continue
        pw = fixed or (prefix + u["username"] if prefix else u["username"] + "123")
        store.upsert(
            {**u, "password_hash": hash_password(pw), "disabled": False}
        )
        print(f"[seed] created {u['username']}")
        created += 1
    print(f"[seed] done: created={created}, skipped={skipped}")


if __name__ == "__main__":
    main()
