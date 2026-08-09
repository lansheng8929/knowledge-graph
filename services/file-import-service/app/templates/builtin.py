"""内置解析模板（P1 种子，默认取第一个）。

模板结构：
  id          唯一标识
  name        展示名
  description 说明
  format      目标格式（excel/csv）
  default     是否默认（前端默认选中第一个）
  sheetMapping 显式指定实体/边表名（可选）
  entityRule  实体抽取逻辑（无 = 不解析实体表）。两种模式：
    - columns: [列...]   从同一张表的多列按值抽取实体（按 id 去重），
                         用于「边行内嵌实体」场景（如通话：拨通方/接听方 → phone）
    - idColumn/labelColumn + nodeType   独立实体表：一行一个实体
    - 两者都配 sheetKeywords 指定表
  edgeRule    边抽取逻辑（无 = 不解析边表）
    linkType / sourceColumn / targetColumn / labelColumn /
    businessKeyColumns / sheetKeywords
    （time 不配置：固定为边的更新时间，由程序写入）
  config      客户端合并进 ImportConfig 的结构默认（businessKey 等；
              不再依赖 dangling=auto-create 自动补实体）
  tags        建议打标（最终以登录用户权限为准）
"""

BUILTIN_TEMPLATES = [
    {
        "id": "tpl-call",
        "name": "通话关系",
        "description": "通话记录表：从 拨通方/接听方 列抽取 phone 实体，用 拨通方/接听方/通话时间 生成「通话」边",
        "format": "excel",
        "default": True,
        "entityRule": {
            "nodeType": "phone",
            "columns": ["拨通方", "接听方"],
            "sheetKeywords": ["通话", "拨通", "接听"],
        },
        "edgeRule": {
            "linkType": "通话",
            "sourceColumn": "拨通方",
            "targetColumn": "接听方",
            "businessKeyColumns": ["通话时间"],
            "sheetKeywords": ["通话", "拨通", "接听"],
        },
        "config": {
            "edge": {"businessKey": [{"col": "通话时间"}]},
        },
        "tags": {"classification": 0, "visibility": "internal"},
    },
    {
        "id": "tpl-trade",
        "name": "转账交易",
        "description": "账户表 + 转账表：识别 账号/户名 与 转出/转入/时间 列，生成 account 实体 + 「转账」关系",
        "format": "excel",
        "default": False,
        "entityRule": {
            "nodeType": "account",
            "idColumn": "账号",
            "labelColumn": "户名",
            "sheetKeywords": ["账户", "账号"],
        },
        "edgeRule": {
            "linkType": "转账",
            "sourceColumn": "转出账号",
            "targetColumn": "转入账号",
            "businessKeyColumns": ["转账时间"],
            "sheetKeywords": ["转账", "转出"],
        },
        "config": {
            "edge": {"businessKey": [{"col": "转账时间"}]},
        },
        "tags": {"classification": 0, "visibility": "internal"},
    },
    {
        "id": "tpl-bare",
        "name": "通用（标准表头）",
        "description": "按标准表头 id|nodeType|label / source|target|linkType 直配，兼容已有格式",
        "format": "excel",
        "default": False,
        "config": {
            "dangling": "auto-create",
            "danglingNodeType": "person",
        },
    },
]
