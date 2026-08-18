"""JWT（HS256）签发与校验。

统一实现见 service_common.jwt（单一来源，安全加固只改一处即全服务传导）。
"""
from service_common.jwt import issue, sign, verify  # noqa: F401

