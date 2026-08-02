"""Prometheus 指标（T2.4.2）。

依赖 prometheus-client（用户手动安装）。/metrics 端点暴露给 Prometheus 抓取。
"""

from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.responses import Response

REQUEST_TOTAL = Counter(
    "kg_query_http_requests_total",
    "HTTP 请求总数",
    ["method", "path", "status"],
)
REQUEST_LATENCY = Histogram(
    "kg_query_http_request_duration_seconds",
    "HTTP 请求耗时（秒）",
    ["method", "path"],
)
NEO4J_QUERY_COUNT = Counter("kg_query_neo4j_queries_total", "Neo4j 查询次数")


def metrics_response() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
