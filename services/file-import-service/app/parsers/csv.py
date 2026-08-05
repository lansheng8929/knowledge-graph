"""CSV 解析：单表格式，由调用方传入 `kind`（entities|edges）归属。"""

from __future__ import annotations

import csv
import io
from typing import Dict, List

from . import Parser, Table, register


class CsvParser(Parser):
    name = "csv"
    extensions = (".csv",)

    def parse(
        self, raw: bytes, filename: str, kind: str = "", sheet_mapping: dict = None
    ) -> Table:
        text = raw.decode("utf-8-sig", errors="replace")
        reader = csv.DictReader(io.StringIO(text))
        rows: List[Dict[str, object]] = []
        for record in reader:
            row: Dict[str, object] = {}
            for k, v in record.items():
                key = (k or "").strip()
                if not key:
                    continue
                row[key] = "" if v is None else v
            if any(str(x).strip() != "" for x in row.values()):
                rows.append(row)
        return {kind or "entities": rows}

    def parse_sheets(
        self, raw: bytes, filename: str
    ) -> Dict[str, List[Dict[str, object]]]:
        """CSV 单表：以固定占位名返回（供模板引擎统一按 sheet 处理）。"""
        return {"__csv__": self.parse(raw, filename, kind="")["entities"]}


register(CsvParser())  # noqa: E402
