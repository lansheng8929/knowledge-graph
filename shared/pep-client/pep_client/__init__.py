"""PEP（策略执行点）客户端——本地引用，不发布。

封装「组装属性 → 调 OPA(PDP) → 解析决策 → 写审计」，
供各模块后端（graph-query-service / graph-rule-service / graph-ingestion）复用，
保证"执行分散、决策集中、姿势一致"（架构 §3.4）。
"""

from .client import PepClient

__all__ = ["PepClient"]
