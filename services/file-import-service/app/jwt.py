"""JWT（HS256）校验（与 auth-service 对齐，纯标准库无依赖）。

用途：dev 直连服务（绕过网关、无 X-User-Context 注入）时，从
Authorization: Bearer 兜底还原主体；生产仍以网关注入的 X-User-Context 为准。
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(s: str) -> bytes:
    pad = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + pad)


def sign(payload: Dict[str, Any], secret: str) -> str:
    """签发 JWT（供测试构造 token；与 auth-service 同构）。"""
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
