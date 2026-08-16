"""JWT（HS256）签发与校验，纯标准库实现（无 PyJWT 依赖）。

格式：base64url(header).base64url(payload).base64url(signature)
payload 含：sub/uid/tenantId/clearance/roles/teams/orgPath/managerUid/subUids/iat/exp
"""

import base64
import hashlib
import hmac
import json
import time
import uuid
from typing import Any, Dict


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + pad)


def sign(payload: Dict[str, Any], secret: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    h = _b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    p = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    msg = f"{h}.{p}".encode("utf-8")
    sig = _b64url(hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).digest())
    return f"{h}.{p}.{sig}"


def verify(token: str, secret: str, now: float | None = None) -> Dict[str, Any]:
    """校验签名与过期；非法抛 ValueError。"""
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("malformed token")
    h, p, sig = parts
    msg = f"{h}.{p}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).digest()
    actual = _b64url_decode(sig)
    if not hmac.compare_digest(expected, actual):
        raise ValueError("bad signature")
    try:
        payload = json.loads(_b64url_decode(p))
    except (json.JSONDecodeError, ValueError) as e:
        raise ValueError("bad payload") from e
    now = now if now is not None else time.time()
    if int(payload.get("exp", 0)) < now:
        raise ValueError("token expired")
    return payload


def issue(
    subject: str,
    user: Dict[str, Any],
    secret: str,
    ttl_seconds: int,
    issuer: str = "kg-auth",
    audience: str = "kg-platform",
) -> str:
    """按用户目录签发 JWT（含 iss/aud/jti 规范字段）。"""
    now = int(time.time())
    payload = {
        "iss": issuer,
        "aud": audience,
        "sub": subject,
        "jti": uuid.uuid4().hex,
        "uid": user.get("uid", subject),
        "tenantId": user.get("tenantId", "default"),
        "clearance": int(user.get("clearance", 0)),
        "roles": list(user.get("roles", [])),
        "teams": list(user.get("teams", [])),
        "orgPath": user.get("orgPath", ""),
        "managerUid": user.get("managerUid", ""),
        "subUids": list(user.get("subUids", [])),
        "iat": now,
        "exp": now + ttl_seconds,
    }
    return sign(payload, secret)
