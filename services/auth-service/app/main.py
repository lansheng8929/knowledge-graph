"""auth-service 应用装配（T4.1.1 IDP / T4.1.2 网关校验 / T4.4.1 L1 粗判）。

路由：
  POST /api/v1/auth/login      用户名+密码 → 校验（PBKDF2）→ 签发 JWT
  GET/POST /api/v1/auth/users  用户管理（需 admin 角色）
  GET  /api/v1/auth/userinfo   带 token → 当前用户属性
  GET  /_authz                 网关 auth_request：验 JWT → 200 + X-Subject-Context（含 L1 粗判）
  GET  /health /healthz
"""

import json
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from service_common.errors import register_exception_handler
from service_common.logging import setup_logging
from service_common.subject import subject_from_payload

from .config import settings
from .jwt import issue, verify
from .org import compute_sub_uids
from .security import hash_password, verify_password
from .store import UserStore, create_user_store

logger = logging.getLogger(__name__)

# ── L1 网关 PEP 粗判（T4.4.1）：路径前缀 → 必需角色（空集合=放行）──────
# 匹配规则：最长前缀命中；主体 roles 与必需角色无交集 → 403
L1_RULES = [
    ("/api/v1/ingest/", {"privileged"}),  # 数据写入仅特权角色
    ("/api/v1/graph/expand", {"analyst"}),  # 拓出需至少 analyst
]


class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str
    uid: str = ""
    tenantId: str = "default"
    clearance: int = 0
    roles: list[str] = []
    teams: list[str] = []
    managerUid: str = ""
    orgPath: str = ""


def _bearer_token(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    return auth[len("Bearer ") :].strip()


def _subject_from_token(token: str) -> dict:
    try:
        payload = verify(token, settings.auth_secret)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"invalid token: {e}") from e
    return subject_from_payload(payload)


def _require_admin(subject: dict) -> None:
    if "admin" not in subject.get("roles", []):
        raise HTTPException(status_code=403, detail="admin role required")


def _l1_check(subject: dict, path: str) -> None:
    """L1 粗判：路径前缀 → 必需角色；无交集 → 403。"""
    roles = set(subject.get("roles", []))
    for prefix, required in L1_RULES:
        if path.startswith(prefix):
            if required and not (roles & required):
                raise HTTPException(
                    status_code=403,
                    detail=f"L1 denied: path {prefix} requires roles {sorted(required)}",
                )
            return


def create_app() -> FastAPI:
    setup_logging()
    # 用户存储（memory | postgres）；仅 bootstrap 初始管理员（密码从 Secret 注入，不硬编码）
    store: UserStore = create_user_store(settings.user_store, settings.auth_db_dsn)
    if settings.bootstrap_admin_password and store.get("admin") is None:
        store.upsert(
            {
                "username": "admin",
                "uid": "u-admin",
                "tenantId": "default",
                "clearance": 3,
                "roles": ["admin", "analyst", "privileged"],
                "teams": ["ops"],
                "password_hash": hash_password(settings.bootstrap_admin_password),
                "disabled": False,
            }
        )

    app = FastAPI(
        title="Knowledge Graph Auth Service",
        version=settings.service_version,
    )
    register_exception_handler(app)
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(settings.cors_origins),
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def health() -> dict:
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": settings.service_version,
        }

    app.add_api_route("/health", health, methods=["GET"])
    app.add_api_route("/healthz", health, methods=["GET"])

    # ── 登录（密码认证，T4.1 完善）───────────────────

    def login(req: LoginRequest) -> dict:
        user = store.get(req.username)
        if user is None:
            logger.info("login failed (no user): %s", req.username)
            raise HTTPException(status_code=401, detail="invalid username or password")
        if user.get("disabled"):
            raise HTTPException(status_code=403, detail="account disabled")
        if not verify_password(req.password, user.get("password_hash", "")):
            logger.info("login failed (bad password): %s", req.username)
            raise HTTPException(status_code=401, detail="invalid username or password")
        # 组织层级（T4.6+ 需求2）：登录时计算下级集合，随 JWT/主体上下文注入，
        # 供上级可看下级数据、审批、任务分派、报表聚合等复用
        login_user = {
            **user,
            "subUids": compute_sub_uids(store.list(), user.get("uid", "")),
        }
        token = issue(
            subject=req.username,
            user=login_user,
            secret=settings.auth_secret,
            ttl_seconds=settings.token_ttl_seconds,
        )
        logger.info("login ok: %s", req.username)
        return {
            "success": True,
            "data": {
                "token": token,
                "token_type": "Bearer",
                "expires_in": settings.token_ttl_seconds,
                "user": store._public(user),
            },
        }

    app.add_api_route("/api/v1/auth/login", login, methods=["POST"])

    # ── 用户管理（admin）─────────────────────────────

    def list_users(request: Request) -> dict:
        subject = _subject_from_token(_bearer_token(request))
        _require_admin(subject)
        return {
            "success": True,
            "data": {"users": [store._public(u) for u in store.list()]},
        }

    def create_user(req: UserCreate, request: Request) -> dict:
        subject = _subject_from_token(_bearer_token(request))
        _require_admin(subject)
        if store.get(req.username) is not None:
            raise HTTPException(status_code=409, detail=f"user exists: {req.username}")
        store.upsert(
            {
                "username": req.username,
                "uid": req.uid or f"u-{req.username}",
                "tenantId": req.tenantId,
                "clearance": int(req.clearance),
                "roles": list(req.roles),
                "teams": list(req.teams),
                "managerUid": req.managerUid,
                "orgPath": req.orgPath,
                "password_hash": hash_password(req.password),
                "disabled": False,
            }
        )
        logger.info("user created: %s", req.username)
        return {"success": True, "data": {"username": req.username}}

    def userinfo(request: Request) -> dict:
        token = _bearer_token(request)
        payload = verify(token, settings.auth_secret)
        subject = _subject_from_token(token)
        username = str(payload.get("sub", ""))
        user = store.get(username) if username else None
        if user is not None:
            # 实时查库返回最新用户属性（团队/组织/上下级可能已变，token 是登录快照）
            fresh = {
                "username": username,
                "uid": user.get("uid", subject.get("uid", "")),
                "tenantId": user.get("tenantId", subject.get("tenantId", "default")),
                "clearance": int(user.get("clearance", subject.get("clearance", 0))),
                "roles": list(user.get("roles", [])),
                "teams": list(user.get("teams", [])),
                "orgPath": user.get("orgPath", subject.get("orgPath", "")),
                "managerUid": user.get("managerUid", subject.get("managerUid", "")),
                "subUids": compute_sub_uids(store.list(), user.get("uid", "")),
            }
            return {"success": True, "data": {"user": fresh}}
        return {"success": True, "data": {"user": subject}}

    app.add_api_route("/api/v1/auth/users", list_users, methods=["GET"])
    app.add_api_route("/api/v1/auth/users", create_user, methods=["POST"])
    app.add_api_route("/api/v1/auth/userinfo", userinfo, methods=["GET"])

    # ── 网关 auth_request 端点（T4.1.2）────────────────

    def authz(request: Request) -> Response:
        token = _bearer_token(request)
        subject = _subject_from_token(token)
        # L1 粗判：nginx 传入原始 URI/方法
        original_uri = request.headers.get("X-Original-URI", "")
        _l1_check(subject, original_uri)
        # 主体属性经响应头回传，nginx auth_request_set 注入上游 X-User-Context
        return Response(
            status_code=200,
            headers={"X-Subject-Context": json.dumps(subject, ensure_ascii=False)},
        )

    app.add_api_route("/_authz", authz, methods=["GET", "POST"])

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.host, port=settings.port)
