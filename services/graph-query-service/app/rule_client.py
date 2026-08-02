"""Rule Service HTTP 客户端（T2.1.4）。

graph-query-service 在 expand 时调用 graph-rule-service 的 /api/v1/rules/validate
做值级白名单校验。使用标准库 urllib（无新增依赖）；一切网络/解析异常包装为
RuleServiceUnavailable，由调用方决定降级策略。
"""

import json
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import List


class RuleServiceUnavailable(Exception):
    """Rule Service 不可达或响应异常。"""


@dataclass
class ValidateResult:
    valid: bool
    errors: List[str] = field(default_factory=list)


class RuleServiceClient:
    def __init__(self, base_url: str, timeout: float = 3.0) -> None:
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    def validate(self, rule_id: str, conditions: str) -> ValidateResult:
        """POST /api/v1/rules/validate。"""
        data = self._post(
            "/api/v1/rules/validate",
            {"ruleId": rule_id, "conditions": conditions},
        )
        d = data.get("data", {}) or {}
        return ValidateResult(valid=bool(d.get("valid")), errors=d.get("errors", []))

    def _post(self, path: str, payload: dict) -> dict:
        url = f"{self._base_url}{path}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=self._timeout) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw)
        except (urllib.error.URLError, OSError, TimeoutError, json.JSONDecodeError) as e:
            raise RuleServiceUnavailable(str(e)) from e
