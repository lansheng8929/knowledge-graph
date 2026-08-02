"""PEP 客户端（T4.3.1）。

用法：
    pep = PepClient(opa_url="http://localhost:8181")
    allow = pep.check(
        subject={"tenantId": "t1", "clearance": 2, "uid": "u1", "roles": ["analyst"]},
        resource={"tenantId": "t1", "classification": 1, "owner": "dept-a",
                  "visibility": "internal", "nodeType": "person"},
        action="expand",
    )

约定：
    - OPA 决策入口：POST {opa_url}/v1/data/{policy_path}（默认 kg/allow）
    - fail-closed：OPA 不可达 → deny + 审计 reason=opa_unavailable
    - 每次决策写独立 audit logger（subject/resource/action/decision/reason）
"""

import json
import logging
import urllib.request
from typing import Any, Dict, Optional


class PepClient:
    def __init__(
        self,
        opa_url: str,
        policy_path: str = "kg/allow",
        timeout: float = 2.0,
    ) -> None:
        self._opa_url = opa_url.rstrip("/")
        self._policy_path = policy_path.lstrip("/")
        self._timeout = timeout

    def check(
        self,
        subject: Dict[str, Any],
        resource: Dict[str, Any],
        action: str,
        extra: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """执行 PEP 决策：True=allow，False=deny（OPA 不可达按 deny）。"""
        input_data: Dict[str, Any] = {
            "subject": subject,
            "resource": resource,
            "action": action,
        }
        if extra:
            input_data["extra"] = extra

        try:
            result = self._query(input_data)
        except Exception as e:  # noqa: BLE001
            logging.getLogger("pep").warning(f"OPA unavailable, deny by default: {e}")
            self._audit(subject, resource, action, "deny", reason="opa_unavailable")
            return False

        allow = self._resolve(result)
        self._audit(subject, resource, action, "allow" if allow else "deny")
        return allow

    def _query(self, input_data: Dict[str, Any]) -> Any:
        url = f"{self._opa_url}/v1/data/{self._policy_path}"
        req = urllib.request.Request(
            url,
            data=json.dumps({"input": input_data}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=self._timeout) as resp:
            body = json.loads(resp.read().decode("utf-8"))
        return body.get("result")

    def _resolve(self, result: Any) -> bool:
        """解析 OPA 决策结果：兼容标量布尔与 dict 两种形态。"""
        if isinstance(result, bool):
            return result
        if isinstance(result, dict):
            return bool(result.get("allow"))
        return False

    def _audit(
        self,
        subject: Dict[str, Any],
        resource: Dict[str, Any],
        action: str,
        decision: str,
        reason: str = "",
    ) -> None:
        logging.getLogger("audit").info(
            json.dumps(
                {
                    "subject": subject,
                    "resource": resource,
                    "action": action,
                    "decision": decision,
                    "reason": reason,
                },
                ensure_ascii=False,
                default=str,
            )
        )
