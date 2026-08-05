# 数据解析导入模块计划（raw file → 实体/边 → 图库）

> 版本：v0.1（草案）
> 日期：2026-08-04
> 范围：把原始数据文件（Excel / Word / TXT / CSV）解析为实体与边，写入 Neo4j；
> 当前假设文件"完美格式化"，后续扩展大模型（LLM）解析非结构化数据。

---

## 1. 定位与边界

新建**文件解析导入服务**（编排层）：把原始文件 → 实体/边 → 写入图库。
它**不自连 Neo4j 写数据**，而是复用 `graph-ingestion` 作为唯一写入口（MERGE 幂等 + 强制打标 + 审计单一通道）。

### 数据流

```mermaid
flowchart LR
    U[用户上传<br/>Excel/Word/TXT/CSV] --> S[file-import-service<br/>解析→映射→校验→编排]
    S --> P1[Excel Parser]
    S --> P2[CSV Parser]
    S --> P3[TXT Parser]
    S --> P4[Word Parser]
    S --> P5[LLM Parser · 后续]
    P1 & P2 & P3 & P4 & P5 --> IR[(统一中间表示<br/>Entity[] + Edge[])]
    IR --> M[映射/打标/校验]
    M --> W[批量写入<br/>POST /ingest/nodes|links]
    W --> GI[graph-ingestion<br/>MERGE 幂等 + 强制打标]
    GI --> NEO[(Neo4j)]
    NEO --> Q[graph-query-service]
    Q --> GA[graph-app 渲染]
```

### 不做什么

- 不承担低层写库（交给 graph-ingestion）
- 不做规则推理 / 图谱分析（交给 rule-service / 后续 analysis service）
- 阶段一不做非结构化内容理解（留给 LLM 通道）

---

## 2. 解析模式决策（重要）

**结论：用户配置模式为主 + 平台自动建议为辅；平台自动/LLM 解析作为第二阶段补充通道。**

### 2.1 两种模式对比

| 维度 | 用户配置模式（推荐默认） | 解析平台模式（自动/通用） |
| --- | --- | --- |
| 实体识别 | 用户从预定义 nodeType 选择 + 字段映射 | 平台自动推断类型 |
| 关系定义 | 用户显式声明 `source类型 → 关系 → target类型` | 平台猜测 |
| 确定性 / 可审计 | 高（声明即配置，可复现） | 低（黑盒） |
| 与现有契约 | 天然对齐白名单 / 强制打标 / ABAC | 易产生非白名单类型，污染 schema |
| 适用输入 | 结构化、完美格式化（Excel/CSV/TXT/Word） | 未知 schema / 非结构化（LLM 场景） |
| 成本 | 低、可控 | 高、需兜底校验 |

### 2.2 推荐形态：配置驱动 + 智能建议

1. 平台按表头**自动建议**映射（如 `姓名→person.label`、`手机号→phone`、`账户→account`）；
2. 用户**一键采纳**或**手动调整**：
   - 实体：选 `nodeType` + 字段映射（保留列 `id/nodeType/label/icon/time`，其余列进 props）
   - 边：选 `source类型 → 关系类型 → target类型`，并声明边的数据来源列
3. 用户确认 → 统一 IR 管道 → 校验 → 写入。

### 2.3 第二通道：LLM 解析（P4）

- 实现同一 `Parser` 接口（`parse(raw, filename) -> ParsedGraph`），输出同一 IR；
- 下游映射 / 打标 / 校验 / 写入**零改动**；
- 两套通道并存：配置模式管"结构化、要可控"，LLM 管"非结构化、要灵活"。

---

## 3. 核心设计：可插拔管道

### 3.1 统一中间表示（IR）

所有解析器输出同一结构（这是"以后加 LLM 零成本接入"的关键）：

```python
ParsedEntity: { id, nodeType, label, props{...} }
ParsedEdge:   { id, source, target, linkType, label, time, props{...} }
ParsedGraph:  { entities[], edges[], warnings[] }
```

与 `graph-ingestion/app/models.py` 的 `IngestNode / IngestLink` 对齐（仅差强制标签）。

> **约定（需求）：`time` 是所有边的共有属性，语义为「边的更新时间」**
> - 它不是业务事件时间（转账时间、通话时间等业务时间一律进 `props`，如 `transTime`）；
> - 默认取**导入时间**（now），可被文件中的 `time` 列覆盖；
> - 因为是「更新时间」，重导同一文件时应被**覆盖刷新**，所以**不得作为边 id 的一部分**（否则更新时间一变就生成新 id、产生重复边）。

> **约定（需求）：`rank` 是所有边的共有属性，语义为「相同边的序号/版本」，进入边 id 哈希**
> - 同一对节点 + 同一 `linkType` 可存在多条“完全一样的边”，靠 `rank`（0,1,2,…）区分；
> - **创建边流程**：先查是否有相同边（同 `sourceId + targetId + linkType + businessKey 值`，忽略 rank/props）：
>   - 无 → 新增边，`rank = 0`；
>   - 有 → 由**插入配置**（`edgeInsertMode`，按导入任务配置）决定：
>     - `update`（默认）：**更新相同边**——MERGE 命中（取 rank 最小者，通常 0），刷新 props 与 `time`，rank 不变，id 稳定；
>     - `insert`：**新插入边**——取相同边集合 `max(rank)+1` 作为新边 rank，插入一条新边（id 随之变化）。
> - 边 id：`edgeId = sha1(linkType | sourceId | targetId | businessKeys… | rank)`（**rank 与 businessKey 进哈希，time 不进**）；
> - `insert` 用于需要保留多条平行/历史边的场景（注意：反复导入会持续追加 rank，需结合数据清理/生命周期策略）。

> **约定（需求）：`businessKey`（业务键列）为可选共有配置，可配置多个，进入边 id 哈希**
> - 用于“同一对节点 + 同一 `linkType` + 业务上不同的事件各成一条边”的场景（如按流水号、按业务时间分边）；
> - **可配置多个业务键列**：`businessKey: [{ col: "流水号" }, { col: "业务时间" }, …]`，按顺序依次拼入哈希；
> - 例：`sha1(linkType | sourceId | targetId | 流水号 | 业务时间 | rank)`；
> - 有了业务键后，“相同边”判定扩展为：同 `sourceId + targetId + linkType + businessKey 值`（忽略 rank/props）；业务键值不同 ⇒ 各成一条边（各自 rank 从 0 起）；
> - 与 `time` 的关系：更新时间 `time` 仍不进 id；业务时间（如需分边）作为 businessKey 之一进 id；
> - 与 `rank` 的关系：业务键唯一 ⇒ rank 恒为 0；无业务键或业务键仍不唯一 ⇒ 靠 `rank`（insert 模式）兜底递增分边。

### 3.2 可插拔解析器

统一 `Parser` 接口，按扩展名注册：

| 解析器 | 依赖 | 说明 |
| --- | --- | --- |
| ExcelParser `.xlsx/.xls` | `openpyxl` | 两个 sheet：`entities` + `edges` |
| CsvParser `.csv` | `csv / pandas` | 表头同上 |
| TxtParser `.txt` | 标准库 | JSONL 或 TSV |
| WordParser `.docx` | `python-docx` | 两个表格（首行表头） |
| LLMParser（后续） | LLM SDK | 文本/文件 → LLM 返回 IR JSON，走同一管道 |

### 3.3 下游三件套（所有格式共享）

- **映射器**：保留列 `id/nodeType/label/icon/time`，其余列自动进 `props`；`nodeType` 默认白名单 = 现有 7 种（`person/phone/address/account/company/ip/device`），可配置扩展
- **打标器**：从请求上下文（`X-User-Context`）+ 配置注入 `tenantId/classification/owner/visibility`，复用 `graph-ingestion/app/tags.py` 校验规则
- **校验器**：id 必填且唯一；`source/target` 必须引用本批实体；`nodeType/linkType` 合法标识符 `[A-Za-z0-9_]`；**按行收集错误，不因单行失败整批回滚**

---

## 4. 文件格式约定（"完美格式化"假设）

一个文件 = 两个结构相同的表：

```
entities:  id | nodeType | label | <任意属性列...>
edges:     id | source | target | linkType | label | time | <任意属性列...>
```

- `edges.time` 为**保留列**，语义 = 边的更新时间（默认导入时间，缺省自动填充；见 §3.1）；业务时间（如转账时间）放 `props`。
- `edges.rank` 为**保留列**（通常自动生成 0,1,2,…；见 §3.1），如文件提供则优先采用。
- `entities.time` 同理为实体更新时间（如需要）。

- Excel：默认按 **sheet 顺序**匹配（第一个非空表 = entities，第二个 = edges）；可用 `config.sheetMapping` 指定（如 `{"entities": "人员表", "edges": "转账关系"}`）
- CSV：`entities`/`edges` 两个文件
- TXT：JSONL（每行一个对象）或 TSV
- Word：两个表格（首行表头）

---

## 5. 服务接口（新增 `file-import-service`）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/v1/import/files` | multipart 上传 → 创建导入任务，返回 `taskId` |
| POST | `/api/v1/import/preview` | 解析 + 校验**不写库**，返回前 N 条实体/边 + 错误（前端确认用） |
| GET | `/api/v1/import/tasks/{id}` | 任务状态 / 进度 / 报告（imported/skipped/errors） |
| GET | `/api/v1/import/formats` | 支持的格式 + 表头约定说明 |

写入按 ~500 条一批调用 `graph-ingestion` 的 `/ingest/nodes|links`；
大文件用异步任务（先 FastAPI `BackgroundTasks`，量大再上队列）。

---

## 6. 前端模块（Single-SPA 子应用 `import-app`）

按架构 §3.3.4，新建子应用 `import-app`，路由 `/import/*`：

- 上传页（拖拽 + 格式选择）
- **预览页**（调 `/preview`，展示实体/边 + 错误行，确认后提交）
- 进度 / 结果报告页

接入与 `graph-app` 同构：`apps/shell/src/main.ts` `registerApplication`（`activeWhen: pathname.startsWith("/import")`），token 经 `customProps` 注入，导航加"数据导入"入口。

---

## 7. 落地阶段

| 阶段 | 内容 |
| --- | --- |
| P1 | 后端骨架 + Excel/CSV 解析 + 校验 + 经 graph-ingestion 写入 + 任务状态 |
| P2 | TXT/Word 解析 + `/preview` + 报告细化 |
| P3 | 前端 `import-app`（上传/预览/报告）+ shell 注册 |
| P4 | LLM 解析器接入（实现同一 `Parser` 接口，管道零改动） |
| P5 | 大文件异步队列 + 进度推送 + 审计 |

---

## 8. 与现有代码衔接点

- 新增 `services/file-import-service/`（FastAPI，依赖 pandas / openpyxl / python-docx，与低层写入解耦）
- 复用 `services/graph-ingestion/app/models.py`（IR 对齐）+ `app/tags.py`（打标校验）
- 默认 `nodeType` 白名单取现有 7 种；导入后经 `graph-query-service` **立即可查、立即渲染**
- `infra/docker-compose.dev.yml` 加 `kg-dev-import`；网关 `/api/v1/import/*` 路由过去

---

## 9. 暂缓 / 待办（已讨论、未实现）

以下为讨论确定但**暂不实现**的设计，记档待后续排期：

### 9.1 跨租户查看（暂缓）

- 需求：某些租户可查看另一租户的部分数据。
- 拟定方案：数据共享标记 `sharedTenants`（属主侧主动授权）：
  - 资源加 `sharedTenants: ["t2", ...]`（默认空 = 不共享）
  - 查询改写：`WHERE n.tenantId = $tenant OR $tenant IN n.sharedTenants`（密级/可见性约束不变）
  - OPA：`tenant_ok` 增加 `subject.tenantId in resource.sharedTenants`
  - 属主授权 + 审计 + 可撤销；跨租户只读
- **状态：暂缓，不实现。**

### 9.2 标签自动配置（部分实现：按登录用户权限）

- 需求：租户/密级/属主/可见性不应由导入用户显式越权配置。
- 已实现（2026-08-05，权限驱动的可配置选项）：
  - 后端 `GET /api/v1/import/options`：按主体（`X-User-Context`，dev 直连时兜底验 `Authorization` JWT）返回
    `defaults`（tenantId=用户租户、owner=用户名）+ `constraints`（classificationMax=clearance、
    visibilityAllowed=按密级过滤、canSetTenant/canSetOwner=是否 admin）；
  - 写路径防绕过：`preview` / `import files` 对打标做越权校验（非 admin 只能写自己租户/属主、
    密级 ≤ clearance、可见性在允许集），越权 403；
  - 前端 `import-app`：挂载时拉 options，默认值自动初始化归属；租户/属主按权限锁定（只读）、
    可见性下拉只显示允许档、密级输入上限 = 用户密级。
- 待做（剩余）：业务标签策略（管理员配置"导入通道"）、预览展示"将写入的标签"（只读）。

### 9.3 仅本人 / 团队可见（已实现，并精细化分层）

- 已实现（2026-08-05）：`l3_conditions`（Cypher 改写）+ `l3_visible`（内存投影）+ OPA `kg.rego` 统一按可见性分层：
  - `public`：同租户全员可见
  - `private`：仅属主本人（不再放行团队/下级）
  - `internal`：属主范围 = 本人 / 属主所在团队 / 属主的下级（上级看下级）
  - `secret`：属主范围 + 额外要求密级 ≥ 2
  - 未打标放行；未知可见性档位安全默认拒绝
- 测试：`test_pep.py`（分层用例）+ `kg_test.rego`（17/17）覆盖 private/internal/secret 的允许/拒绝路径。

### 9.4 组织层级（上下级可见，已实现）

- 需求：上级用户数据仅自己和下级可见、其它组织不可见（"其它组织不可见"已由租户隔离覆盖）。
- 已实现（2026-08-05）：主体加组织层级（`orgPath` / `managerUid` / `subUids`），auth 登录计算下级集合；查询改写 + OPA 加层级过滤。
- 延伸：通用业务能力组件（审批/任务/报表/审计）已基于组织层级落地，见 `docs/business-core-plan.md`。
