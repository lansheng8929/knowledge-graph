"""PBKDF2 密码哈希测试。"""

from app.security import hash_password, verify_password


def test_hash_verify_roundtrip():
    h = hash_password("s3cret")
    assert h.startswith("pbkdf2_sha256$")
    assert verify_password("s3cret", h)


def test_wrong_password_rejected():
    h = hash_password("s3cret")
    assert not verify_password("wrong", h)


def test_salt_uniqueness():
    assert hash_password("same") != hash_password("same")


def test_malformed_stored_rejected():
    assert not verify_password("x", "not-a-hash")
    assert not verify_password("x", "")
