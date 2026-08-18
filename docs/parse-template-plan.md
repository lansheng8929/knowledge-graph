# 解析模板（parsekit）计划 —— 让上传解析更便利、可配置、可沉淀

## 1. 目标

把"上传文件 → 解析成实体/边"从**写死的列名约定**升级为**模板驱动的语义解析**：
- 开发者/管理员预置模板（如「通话关系」「转账交易」），定义列语义映射；
- 上传文件时**默认用第一个模板**解析，用户可切换其它模板；
- 点模板可**临时编辑配置项**（不持久化），此时标记为「自定义模板」；
- 后续：模板 CRUD + 共享 + 审批（发布/变更走审批流，审批组件待建）。

## 2. 分层（关键设计）

不要把「解析库」和「模板」混为一谈，是两层：

```
文件 (Excel/CSV/TXT/Word)
   │  ① 解析器层 parsers/（格式 → 统一表格 Table，按 sheet 名保留）
   ▼
统一表格 {sheet名: [行...]}
   │  ② 模板层 templates/（选实体/边表 + 列重映射到 IR 保留列）
   ▼
Table（entities/edges 按 source/target/linkType... 组织）
   │  ③ 下游完全复用
   ▼
mapper → IR → validator → writer(ingestion)
```

**模板引擎只做 ②**：从解析器产出的统一表格中挑选实体/边表、把「拨通方」这类语义列
重映射到 IR 保留列（source/target/linkType/time/...）。mapper/validator/writer 零改动。

## 3. 模板结构（草案）

```jsonc
{
  "id": "tpl-call",
  "name": "通话关系",
  "description": "识别 拨通方/接听方/通话时间 列，生成 phone 实体 + 「通话」关系",
  "format": "excel",
  "default": true,                    // 前端默认选中第一个
  "sheetMapping": { "edges": "" },    // 显式指定表名（可选）
  "entityRule": {                      // 实体列语义（无 = 不解析实体表）
    "nodeType": "phone", "idColumn": "手机号", "labelColumn": "手机号"
  },
  "edgeRule": {                        // 边列语义（无 = 不解析边表）
    "linkType": "通话",
    "sourceColumn": "拨通方",
    "targetColumn": "接听方",
    "timeColumn": "通话时间",
    "businessKeyColumns": ["通话时间"],
    "sheetKeywords": ["通话", "拨通"]   // 按表头关键词选表
  },
  "config": {                          // 客户端合并进 ImportConfig 的结构默认
    "dangling": "auto-create",
    "danglingNodeType": "phone",
    "edge": { "businessKey": [{ "col": "通话时间" }] }
  },
  "tags": { "classification": 0, "visibility": "internal" }  // 建议打标，最终以权限为准
}
```

### 列识别
精确列名（忽略大小写）> 关键词包含匹配 > 兜底。保留严格模式（只认精确列名）。

### 单表混排（通话模板的关键）
通话模板是 **edge-only**：边行的 拨通方/接听方 号码经 `dangling=auto-create` +
`danglingNodeType=phone` 自动生成 phone 实体，完全复用 mapper 现有能力。

## 4. 交互流程（P1，多文件 + 每文件独立配置）

1. 「待上传文件」框：多选/多次添加文件，每个文件成为一个独立文件框（**不再按顺序配对成实体表/关系表**）；
2. 每个文件框独立设置：**解析模板 / 密级 / 可见性 / 业务键**（密级、可见性按登录用户权限过滤）；
3. 每个文件自动解析（防抖），就地展示统计 + 错误/警告 + 预览详情；
4. 确认导入 → **每个文件生成一个独立任务**，结果页轮询展示所有任务。

## 5. API（一个文件 = 一个任务）

- `GET /api/v1/import/templates` → 模板列表（P1 内置种子）
- `POST /api/v1/import/preview`：单文件 `file` + `config` + `template_id` → 该文件预览
- `POST /api/v1/import/files`：单文件 `file` + `config` + `template_id` → **一个后台任务**（每文件一任务）
  - 有 `entityRule/edgeRule` 的模板 → 模板引擎（选表 + 列重映射）；
  - 无（通用/裸上传）→ 标准列名直配；CSV 按表头自动判别实体表（含 `source/target/linkType` 判为边表）

## 6. 权限 / 审批（后续阶段）

- 模板存 Postgres（`core_records(kind="import_template", ...)` 或独立表），带
  `owner/team/shared/status/version`；
- 共享/审批：发布/变更走审批流（审批状态机待建）；
- 模板访问沿用 ABAC（owner/团队/组织层级/审批通过）。

## 7. 阶段划分

| 阶段 | 内容 |
|---|---|
| **P1（本迭代）** | templates 引擎 + 内置模板（通话/转账/通用）+ 多文件独立配置（模板/密级/可见性/业务键）+ 一个文件一个任务 |
| **P2** | 模板 CRUD（新增/编辑/删除），权限（owner/团队/共享），版本 |
| **P3** | 模板市场/共享，版本+发布 |

## 8. 风险 / 注意

1. 向后兼容：无模板（裸上传）/通用模板 = 旧版列名直配，存量用户不受影响。
2. 单表混排依赖"边规则自动建节点"，列识别先精确 + 关键词，别一上来做重。
3. 临时编辑的「自定义模板」是运行态对象，不写库，避免未审批规则混入正式模板。
4. linkType/nodeType 允许 CJK（validator 标识符正则已放开），中文关系名如「通话」可用。
