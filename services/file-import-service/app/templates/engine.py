"""模板引擎（parsekit 核心）：把「语义列 → IR 保留列」的模板规则应用到解析表格。

分层（重要）：
  - 解析器层（parsers/）：文件格式 → 按 sheet 名组织的统一表格；
  - 模板层（本模块）：从统一表格中按模板挑选实体/边表 + 列重映射，
    输出仍是现有 mapper/validator 可消费的 Table（entities/edges 按 IR 保留列）。

因此模板化解析对下游零改动：mapper / validator / writer 完全复用。
"""

from __future__ import annotations

from typing import Dict, List, Optional, Tuple

from ..models import ParseError
from ..parsers import Table, get_parser
from .builtin import BUILTIN_TEMPLATES


def list_templates() -> List[dict]:
    """内置模板列表（后续并入业务库模板存储）。"""
    return [dict(t) for t in BUILTIN_TEMPLATES]


def get_template(template_id: str) -> Optional[dict]:
    for t in BUILTIN_TEMPLATES:
        if t["id"] == template_id:
            return t
    return None


def _resolve_column(keys: List[str], spec) -> Optional[str]:
    """解析列名：先精确（忽略大小写），再关键词包含匹配。"""
    if not spec:
        return None
    specs = [spec] if isinstance(spec, str) else list(spec)
    if not specs:
        return None
    for k in keys:
        if any(k.lower() == s.lower() for s in specs):
            return k
    for k in keys:
        for s in specs:
            if s and s.lower() in k.lower():
                return k
    return None


def _remap_entity_row(row: Dict, rule: Dict) -> Dict:
    keys = list(row.keys())
    out = dict(row)
    for to, spec in (("id", rule.get("idColumn")), ("label", rule.get("labelColumn"))):
        if spec:
            c = _resolve_column(keys, spec)
            if c:
                out[to] = row[c]
    if rule.get("nodeType"):
        out["nodeType"] = rule["nodeType"]
    if rule.get("icon"):
        out["icon"] = rule["icon"]
    return out


def _extract_entities(rows: List[Dict], rule: Dict) -> List[Dict]:
    """从同一张表的多列按值抽取实体（按 id 去重）。

    用于「边行内嵌实体」场景（如通话记录：每行的 拨通方/接听方 各自成为一个
    phone 实体）。实体 id = 列值本身，label 缺省 = 值本身。
    """
    cols = rule.get("columns") or []
    node_type = rule.get("nodeType", "")
    icon = rule.get("icon", "")
    label_spec = rule.get("labelColumn")
    seen: Dict[str, bool] = {}
    out: List[Dict] = []
    for row in rows:
        keys = list(row.keys())
        for c in cols:
            col = _resolve_column(keys, c)
            if not col:
                continue
            val = str(row.get(col, "")).strip()
            if not val:
                continue
            if val in seen:
                continue
            seen[val] = True
            ent: Dict = {"id": val, "nodeType": node_type, "icon": icon, "label": val}
            if label_spec:
                lc = _resolve_column(keys, label_spec)
                if lc and str(row.get(lc, "")).strip():
                    ent["label"] = row[lc]
            out.append(ent)
    return out


def _remap_edge_row(row: Dict, rule: Dict) -> Dict:
    """边列重映射：把语义列映射到 source/target/label，并剔除已用列。

    time 不在此配置（固定为边的更新时间，由 mapper 程序写入）；
    被映射为结构字段的原列（如 拨通方/接听方）从结果行删除，
    避免它们作为原始属性混进 props（props 只保留未消费的业务/额外列）。
    """
    keys = list(row.keys())
    out = dict(row)
    consumed: List[str] = []
    for to, spec in (
        ("source", rule.get("sourceColumn")),
        ("target", rule.get("targetColumn")),
        ("label", rule.get("labelColumn")),
    ):
        if spec:
            c = _resolve_column(keys, spec)
            if c:
                out[to] = row[c]
                consumed.append(c)
    if rule.get("linkType"):
        out["linkType"] = rule["linkType"]
    for c in consumed:
        if c in out:
            del out[c]
    return out


def _sheet_for(
    sheets: Dict[str, List[Dict]], rule: Dict, explicit: str
) -> Optional[str]:
    """挑选实体/边表：显式映射 > 表头关键词（不再位置兜底）。"""
    if explicit and explicit in sheets:
        return explicit
    kws = rule.get("sheetKeywords") or []
    if kws:
        for n in sheets:
            rows = sheets[n]
            if not rows:
                continue
            headers = [str(h) for h in rows[0].keys()]
            if any(any(k.lower() in h.lower() for h in headers) for k in kws):
                return n
    return None


def parse_with_template(
    entities: Optional[Tuple[str, bytes]],
    edges: Optional[Tuple[str, bytes]],
    template: dict,
    warnings: Optional[List[str]] = None,
) -> Table:
    """按模板解析上传文件 → Table（列已重映射到 IR 保留列）。

    实体/边可来自同一文件的不同 sheet，或单 sheet 混排（边规则自动从行中
    的实体列生成节点：见 mapper 的 dangling=auto-create）。

    选表不做位置兜底：模板匹配不到对应表时记入 warnings（并因此可能整体
    报「模板未匹配」），避免把不相关表误当实体/边解析。
    """
    sheets: Dict[str, List[Dict]] = {}
    for f in (entities, edges):
        if f is None:
            continue
        name, raw = f
        parser = get_parser(name)
        if hasattr(parser, "parse_sheets"):
            sheets.update(parser.parse_sheets(raw, name))
        else:
            sheets.update(parser.parse(raw, name, kind="", sheet_mapping=None))
    if not sheets:
        raise ParseError("no data found in uploaded file(s)")

    sm = template.get("sheetMapping") or {}
    ent_rule = template.get("entityRule") or {}
    edg_rule = template.get("edgeRule") or {}
    tname = template.get("name", "")
    tables: Table = {}
    if ent_rule:
        n = _sheet_for(sheets, ent_rule, sm.get("entities", ""))
        if n:
            rows = sheets[n]
            if ent_rule.get("columns"):
                tables["entities"] = _extract_entities(rows, ent_rule)
            else:
                tables["entities"] = [_remap_entity_row(r, ent_rule) for r in rows]
        elif warnings is not None:
            warnings.append(
                f"模板「{tname}」未匹配到实体表（需包含列关键词："
                f"{ent_rule.get('sheetKeywords') or '指定表名'}）"
            )
    if edg_rule:
        n = _sheet_for(sheets, edg_rule, sm.get("edges", ""))
        if n:
            tables["edges"] = [_remap_edge_row(r, edg_rule) for r in sheets[n]]
        elif warnings is not None:
            warnings.append(
                f"模板「{tname}」未匹配到关系表（需包含列关键词："
                f"{edg_rule.get('sheetKeywords') or '指定表名'}）"
            )
    if not tables:
        raise ParseError(
            "模板未匹配到任何表/列：请检查文件结构，或换用「通用（标准表头）」模板"
        )
    return tables
