# 代码优雅度审查报告

> 日期：2026-08-15　范围：services/（6 服务 ~7.4k 行 Python）+ apps/（4 应用 ~8.8k 行 TS/TSX）+ graph/src（WebGL 引擎）+ scripts/ + shared/
> 审查原则：① 减少不必要的注释（只留"为什么"）；② 代码直接具有业务可读性；③ 命名语义随函数上下文自动表达，短函数不冗余前缀
> 方法：三个并行子代理逐文件审查 + 主代理抽样复核（抽查 7 项关键声明全部属实）

## 一、总体结论

**整体处于「中上」水平，优于绝大多数同规模项目，但存在三类系统性问题：**

1. **跨模块复制是最大负债**：主体(subject)解析在 5 个后端服务逐行复制、jwt.py ×3、observability.py ×2、_now()/uuid.hex[:12] ×7、前端标签映射 ×5、single-spa 骨架 ×3、as any 访问 data ×50——改一处业务字段要改多个文件，且已出现复制后分叉（DEFAULT_TEXT_COLOR 一处 #2c2c2c 一处 #000）。
2. **死代码与调试残留**：console.log(dx, dy) 在每帧 pointermove 刷日志、恒返回 0 的 shapeToType 桩函数混入生产拾取路径、389 行整文件 draw-ctx.ts 无人引用、被注释掉的旧逻辑与死 DOM 节点。
3. **魔法数字/哨兵值散落**：缩放上下限 0.03/10 复制两处、动画时长 320、BATCH 300/50、防抖 350、轮询 1500/3000、LIMIT 20、[:12]/[:20]/[:300]、掩码 3/4/7、"__custom__"、"unknown" 等均未常量化。

**正面**：注释纪律整体优于平均——大量"为什么"注释（锁时序自死锁、流式让出事件循环、视口中心增量节点、d3 tick 语义），领域命名到位（subUids/intimacy/l3_conditions/org_in_scope），白名单常量集中管理。

## 二、按原则分项评价

### 原则 1：减少不必要的注释 —— 中上（有亮点，有重灾区）

- 后端：基本无复述型注释；少数重复注释（# node 必须带外层 {id, data} ×2、# L3 投影过滤 ×4、迁移残留"保持原结构"）、分节框在 100 行小文件里也出现 3 个。
- 前端：graph-app 重灾区——// ── xxx ── 分节框 + JSX 内 {/* 关系类型 */} 复述注释叠加（RuleMenu.tsx 8 处、SelectionOverlay.tsx 8 处、LinkTooltip.tsx 与可见文本重复）；同义注释"主题 token 单一来源"在 4 个文件各写一遍。
- 引擎：client/utils.ts 多处 // 行高// 绘制// 计算总宽度 复述型注释；graph-renderer.ts 每个 trivial getter 配一句 JSDoc；// ═══ 分节符 7 处；utils.ts:27-42 一整段被注释掉的旧 merge 逻辑。
- 硬伤（注释与代码不符）：interaction-manager.ts:171 注释描述"dead zone 消耗"逻辑但代码中不存在（字段 panDeadZone 声明后无引用）；view-new.ts:585 注释挂错位置（/** Fit all nodes in view */ 悬在 setLayout 上方）。

### 原则 2：代码直接具有业务可读性 —— 中上（领域命名好，泛名/缩写拖后腿）

- **关键路径泛名**：obj（queries.py 图节点）、r（queries.py 边关系，同文件另有 rel/rel_type 三种叫法）、data（rule store 6 个方法入参全叫 data）、res（validator 校验结果）、p（子任务入参，30 行函数全程穿透）、d（reports 文档对象）、sid/tid/rid/imp_n/imp_l（缩写套缩写）、s2（intimacy 规范化时间串）、cls（masking.py 密级变量——与 Python 类方法首参惯例名撞车）。
- **名实不符（最危险）**：intimacy.py 配置语义 weighted_sum 的实现是不加权平均——按"加权"理解补权重的人必踩坑，应改实现或改名 mean；generate-data.py:395 恒真三元 src_c if src_c == tgt_c else src_c 疑似漏改；models.py:8 用 str 子类伪枚举，RuleStatus 白名单形同虚设。
- **伪枚举/断言做流程控制**：RuleStatus(str) 应改 StrEnum/Literal；store.py:177 assert rule is not None 在 python -O 下被剥离。
- **前端魔法哨兵**："__custom__" ×3、"unknown"/"default" 兜底串、"default" 租户占位、tenantId: "" 无语义空串。

### 原则 3：命名语义随上下文表达 —— 中上（正面案例多，反面集中在长函数缩写）

- **正例（符合"get_cases() → key"精神）**：compute_sub_uids（auth/org.py BFS：children/subs/stack/cur）、org_in_scope/uid_in_scope、_pair_key(s,t)、_PUBLIC_FIELDS、前端 previewSig/animatePan/applyIntimacyInfluence 等。
- **反例（短函数+泛名，或长函数+缩写）**：queries.py:110 obj = node_to_obj(...)——函数名已说明是节点，变量应直接叫 node（正是用户给出的原则例子）；_stream_link(sid, tid, rel_type, rel) 8 次使用缩写；subtask_parse(ctx, p) 30 行穿透 p；_ok(ident) 应叫 _is_valid_identifier（兄弟服务 graph-query 就是这么叫的）；_str 与内建 str 同名。
- **命名几乎同形靠注释区分**：Toolbar.tsx selectionMode vs selectedSelectionMode（只差一个前缀，语义靠注释补，且初值都是 "rect" 易误导）→ 应改 activeSelectionMode（临时激活）/toolbarSelectionMode（持久选中）。
- **封装破口**：auth-service 路由直接调 store._public(user)（私有方法被外部调用）；graph-app 71 处 as any 穿透引擎内部（(view as any).renderer?.canvas）——引擎缺公开访问器，建议补 view.getCanvas()/getTransform() 等公开 API。

## 三、分区域问题清单（高优先级条目）

### 后端 Python（services/，55 文件）

| 位置 | 问题 | 建议 |
| --- | --- | --- |
| 5 个服务的 subject 解析（pep.py/permissions.py/subject.py 等） | 主体解析逐行复制 ×5 | 抽 common/subject.py（header+JWT 兜底+默认主体） |
| auth/query/import 的 jwt.py | 整文件复制 ×3（含 issue()） | 抽 services/common/ 统一；安全加固才能传导 |
| queries.py:281/384 r、:447 sid/tid | 边关系三种叫法 r/rel/rel_type 并存 | 统一 rel/source_id/target_id |
| queries.py:377 LIMIT 20、masking.py 3/4/7、intimacy.py 365/86400 | 业务数字散落 SQL/切片 | 模块常量收口 |
| auth store.py:108、rule store.py:215、import tasks.py:309 row[0..19] | 列序与索引两份手工同步 | psycopg.rows.dict_row |
| rule store.py:30 等 6 处 create(self, data) | 业务对象用泛名 data | 改 rule: RuleCreate |
| auth main.py:203-223 | userinfo 同一 token 验签两次、三套字段映射并存 | _subject_from_token 收 payload 而非 token |
| import tasks.py:130/333 Memory/Postgres 双 store | create 构造逻辑整段复制 | 抽 _new_task(...) |
| business-core 4 个模块 | _now() ×4、uuid.hex[:12] ×4 | 抽 clock.py（now_iso/new_id） |
| business-core main.py:25 | store 模块级创建（其余服务都在 create_app 内）+ 空 lifespan 样板 | store 移入 create_app |
| rule main.py:168-185 | 404 分支 ×4、validate 成功响应 ×4 | 抽 _rule_or_404/_ok_resp |
| rule validator.py:45 _ok | 缩写掩盖语义 | 统一 _is_valid_identifier |
| ingestion main.py:42-59 | _node_tags/_link_tags 逐字段重复 | 抽 _tags(...) |
| import main.py:268-273 imp_n, skip_n, err_n | 缩写套缩写 | 具名返回 imported_nodes 等 |

### 前端 TS/TSX（apps/，~8.8k 行）

| 位置 | 问题 | 建议 |
| --- | --- | --- |
| useRuleMenu.ts:52-70 | 生产路径 20 行调试 console.log + _ruleIds 未用参数 | 删除或 env 门控的 console.debug |
| App.tsx:341-351 | 死 DOM #runtime-error（全仓无读写） | 删除 |
| PanelContainer.tsx:13/188 | 被注释掉的 <GripHorizontal/> + 因此产生的未使用 import | 删除 |
| graph-app ~50 处 (x.data as any)?.f ?? fallback | any 掩盖 nodeType 等语义 | 建 AppNodeData/AppLinkData 类型 |
| useGraphHover.ts:91/99 | modelRef.current 进依赖 + join(",") 作依赖（id 含逗号失效） | 单通道事件订阅 |
| useGraphApp.ts BATCH 300/50、逐 chunk fitView(50) | 批次常量无命名差异、重操作逐 chunk 调 | 集中 viewConfig.ts + 节流 |
| shell main.ts:47-55/156-165 | JWT 解码写两份；window.__KG_TOKEN__ 内联强转 ×7 | 抽 parseJwt + declare global + getToken/setToken |
| import-app App.tsx 863 行 8 组件 | 单文件超载，跨视图复用困难 | 拆 components/ |
| import-app 350/1500/3000、user-app/import-app 密级映射重复 | 魔法时间、重复值域 | 常量 + 共享 CLEARANCE_LABELS |
| 3 个应用的 authToken/single-spa 骨架 | 样板 ×3 | shared 提供 createMicroAppLifecycles |

### 图谱引擎 graph/src + scripts + shared

| 位置 | 问题 | 建议 |
| --- | --- | --- |
| interaction-manager.ts:161 | console.log(dx, dy) 每帧刷日志（调试残留） | 删除（最高优先级） |
| node-batch.ts:13-15 | shapeToType 恒返回 0 的桩函数被 cpu-picker 生产调用 | 删除或实现 |
| entity/draw-ctx.ts（389 行） | 整文件无 import，是 client/utils.ts makeDrawWrapper 的分叉副本 | 删除，以 utils.ts 为准 |
| link-batch.ts:473-499 | instancedSingle* 四个私有方法互相调用但无外部引用 | 删除 |
| camera.ts:41 + interaction-manager.ts:233 | 缩放上下限 0.03/10 复制两处；webgl-renderer.ts:320 动画 320 裸数 | renderer/physics 各建 constants.ts |
| view-new.ts:389 Math.random()*100、simulation.ts reheat(0.3)/radius||5/settle(300) | 魔法数 | 常量化 |
| client/constants.ts:15 DEFAULT_FOUCS_LINE_WIDTH、style-manager.ts:33 updategGraphModelData、model.ts:72 updeteFoucsNodes | 拼写错误 | 修正 |
| src/constants.ts vs client/constants.ts | 同名常量值分叉（TEXT_COLOR #2c2c2c vs #000） | 合并 |
| link-batch/text-label 平行边贝塞尔 ×3、uploadDynamic ×3、shader 样板 ×4 | 近 40 行相同代码三份拷贝 | 抽 computeLinkCurves + DynamicBufferPool |
| generate-data.py:395 | 恒真三元（疑似漏改 tgt_c） | 简化或修正 |
| create-entity.js:106-112/84/124 | 模板生成器 bug：indexColor 未解构、getPaginator 参数错位、生成空 .server.ts | 修复 |
| generate-data.py:30 等 random.seed(42)、:32 默认口令 password123 | 裸种子（应为 RNG_SEED 注明可复现目的）、默认口令安全隐患 | 常量化 + 默认口令置空报错 |
| gen-1000-test.py / gen-cluster-test.py _pick_pair | 同簇配对逻辑两份拷贝 | 抽共享模块 |
| shared/audit sink.py:20 与 pep-client client.py:82 | 审计五字段 JSON 序列化两处手工重复 | audit 包导出 format_audit_record |
| shared/audit sink.py:54-70 | PostgresSink 构造函数内 CREATE TABLE 副作用 | 懒建表 |
| 代码文档混入 T4.8/T2.3.4 等工单编号 | 版本迭代后编号腐化 | 迁到 README 关联需求一节 |

## 四、魔法数字汇总（全局治理）

```
后端：LIMIT 20 / [:12] / [:20] / [:300] / [:5] / 86400 / 365 / 掩码 3,4,7 / limit=50 / row[0..19] ×3
前端：BATCH 300/50 / fitView(50) / reheat 0.3,0.5,1 / 防抖 350 / 轮询 1500,3000 / /240 帧 / __custom__ / unknown / default
引擎：0.03 / 10 / 0.95,1.05 / 320 / 100 / 0.3 / 5 / 300
```

## 五、正面例子（值得推广的基准）

1. **锁时序注释**（file-import queue.py:151-154）：讲清事务/行锁/advisory lock 交互与自死锁成因——教科书级"为什么"注释。
2. **视口中心增量节点**（graph-app App.tsx:148-152）：一段注释讲清三条分支的动机与后果。
3. **流式让出事件循环**（graph-app api/client.ts:108-109）与 **d3 tick 语义**（simulation.ts:161-167）：性能坑/库语义注释范本。
4. **auto-fitView 挂载时序**（webgl-renderer.ts:300-302）：single-spa height=0 的完整成因链。
5. **白名单常量集中**（query validator.py:21-28）与 **MiniMap.tsx:12-21 八常量命名**：魔法值治理范本。
6. **纯领域命名**：compute_sub_uids、_pair_key(s,t)、org_in_scope。

## 六、优先修复路线（按收益/风险排序）

**第一批：删死代码（低风险高收益，1 小时内）**
- interaction-manager.ts:161 console.log；App.tsx 死 div；PanelContainer 注释导入；useRuleMenu 调试块；draw-ctx.ts；link-batch instancedSingle*；被注释的旧代码（utils.ts:27-42 等）；graph-types.d.ts 残留单行文件

**第二批：消重复（中风险中收益，治理核心）**
- 后端：services/common/（subject 解析 ×5 → 1、jwt ×3 → 1、observability ×2 → 1、_now/new_id）
- 前端：labels.ts（NODE_TYPE_LABELS ×5、RELATION_LABELS ×3、密级 ×2）、physics-config.ts（forceConfig ×2）、linkEndpoints() 工具（样板 ×7）、createMicroAppLifecycles（骨架 ×3）、authToken 统一
- 引擎：computeLinkCurves + DynamicBufferPool + shader 样板工具

**第三批：恢复语义（长期）**
- AppNodeData/AppLinkData 类型取代 50 处 as any；引擎补公开访问器（getCanvas/getTransform）消除穿透
- 关键路径泛名改名：obj→node、r→rel、data→rule/payload、res→result、p→payload、d→definition、sid/tid→source_id/target_id、imp_n→imported_nodes
- 名实不符修复：weighted_sum→mean（或真加权）、RuleStatus→StrEnum、恒真三元、assert→异常
- 魔法数字收口：后端 constants.py / 前端 viewConfig.ts / 引擎 renderer+physics constants.ts

**注意**：weighted_sum 与 generate-data.py:395 恒真式疑似逻辑 bug（非纯风格问题），建议优先确认意图；改命名类重构建议配合类型检查（bun run graph:tsc / pytest）与契约检测（check:contract）回归。
