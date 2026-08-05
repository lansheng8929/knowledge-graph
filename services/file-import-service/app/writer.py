"""经 graph-ingestion 批量写入（唯一写通道，不自连 Neo4j）。

写入口（services/graph-ingestion）：
  POST /api/v1/ingest/nodes   节点（MERGE 幂等 + 强制打标）
  POST /api/v1/ingest/links   关系（MERGE 幂等 + 强制打标）
"""

from __future__ import annotations

from typing import Dict, List, Tuple

import httpx

from .ir import ParsedEdge, ParsedEntity


class IngestionError(RuntimeError):
    """graph-ingestion 写失败。"""


class IngestionClient:
    def __init__(self, base_url: str, timeout: float = 60.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def ingest_nodes(
        self,
        nodes: List[ParsedEntity],
        tags: Dict,
        chunk: int = 500,
        subject: str = "",
    ) -> Tuple[int, int, List[str]]:
        return self._ingest(
            "/api/v1/ingest/nodes",
            "nodes",
            [
                {
                    "id": n.id,
                    "nodeType": n.nodeType,
                    "label": n.label,
                    "icon": n.icon,
                    "props": n.props,
                    **tags,
                }
                for n in nodes
            ],
            chunk,
            subject,
        )

    def ingest_links(
        self,
        links: List[ParsedEdge],
        tags: Dict,
        chunk: int = 500,
        subject: str = "",
    ) -> Tuple[int, int, List[str]]:
        return self._ingest(
            "/api/v1/ingest/links",
            "links",
            [
                {
                    "id": l.id,
                    "source": l.source,
                    "target": l.target,
                    "linkType": l.linkType,
                    "label": l.label,
                    "time": l.time,
                    "rank": l.rank,
                    "props": l.props,
                    **tags,
                }
                for l in links
            ],
            chunk,
            subject,
        )

    def _ingest(
        self,
        path: str,
        key: str,
        items: List[Dict],
        chunk: int,
        subject: str,
    ) -> Tuple[int, int, List[str]]:
        headers = {"X-User-Context": subject} if subject else {}
        imported = 0
        skipped = 0
        errors: List[str] = []
        with httpx.Client(
            base_url=self.base_url, timeout=self.timeout, headers=headers
        ) as client:
            for start in range(0, len(items), chunk):
                batch = items[start : start + chunk]
                try:
                    resp = client.post(path, json={key: batch})
                except httpx.HTTPError as e:
                    errors.append(f"{path}: network error: {e}")
                    skipped += len(batch)
                    continue
                if resp.status_code >= 400:
                    errors.append(f"{path} HTTP {resp.status_code}: {resp.text[:300]}")
                    skipped += len(batch)
                else:
                    imported += len(batch)
        return imported, skipped, errors
