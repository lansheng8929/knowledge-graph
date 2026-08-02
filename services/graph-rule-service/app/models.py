"""规则目录模型（契约固化，T2.1.1）。"""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class RuleStatus(str):
    DRAFT = "draft"
    PUBLISHED = "published"
    DEPRECATED = "deprecated"


class RuleDefinition(BaseModel):
    """一条拓出规则：定义允许的 targetType/relationType/property/operator 白名单。"""

    id: str = ""
    name: str = ""
    version: int = 1
    status: str = RuleStatus.DRAFT
    owner: str = ""
    description: str = ""

    # 白名单（前端 conditions 只能在规则暴露的组合内取值）
    allowedTargetTypes: List[str] = Field(default_factory=list)
    allowedRelationTypes: List[str] = Field(default_factory=list)
    allowedProperties: List[str] = Field(default_factory=list)
    allowedOperators: List[str] = Field(default_factory=list)
    maxHops: int = 5

    createdBy: str = ""
    createdAt: str = ""

    model_config = ConfigDict(extra="allow")


class RuleCreate(BaseModel):
    name: str
    owner: str = ""
    description: str = ""
    allowedTargetTypes: List[str] = Field(default_factory=list)
    allowedRelationTypes: List[str] = Field(default_factory=list)
    allowedProperties: List[str] = Field(default_factory=list)
    allowedOperators: List[str] = Field(default_factory=list)
    maxHops: int = 5


class ValidateRequest(BaseModel):
    """校验请求：conditions + 可选 ruleId / 内联规则定义。"""

    ruleId: Optional[str] = None
    conditions: str = ""
    rule: Optional[RuleDefinition] = None


class ValidateResponse(BaseModel):
    valid: bool
    normalized: list = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)


class EnvelopeRule(BaseModel):
    """规则端点响应信封。"""

    success: bool = True
    data: Optional[RuleDefinition] = None


class EnvelopeRuleValidate(BaseModel):
    """校验端点响应信封。"""

    success: bool = True
    data: Optional[ValidateResponse] = None
