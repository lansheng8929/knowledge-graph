"""subject 解析单元测试。"""

from app.subject import DEFAULT_SUBJECT, subject_from_request


class _Req:
    def __init__(self, ctx: str = ""):
        self.headers = {"X-User-Context": ctx}


def test_parse_full_context():
    ctx = '{"uid":"u-a","tenantId":"t1","clearance":2,"roles":["analyst"],"teams":["x"],"orgPath":"t1/ops","managerUid":"u-admin","subUids":["u-b"]}'
    s = subject_from_request(_Req(ctx))
    assert s["uid"] == "u-a"
    assert s["tenantId"] == "t1"
    assert s["managerUid"] == "u-admin"
    assert s["subUids"] == ["u-b"]


def test_missing_context_uses_default():
    s = subject_from_request(_Req(""))
    assert s["uid"] == "anonymous"
    assert s["subUids"] == []


def test_invalid_json_falls_back():
    s = subject_from_request(_Req("not-json"))
    assert s == DEFAULT_SUBJECT
