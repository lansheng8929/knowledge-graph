#!/usr/bin/env bash
# 生成 shared/api-client（T1.3.1）
#
# 前置条件：
#   1. 已安装 graph-query-service 的 Python 依赖（离线生成用）
#   2. 已安装 openapi-typescript（脚本用 npx 拉取；或提前 npm i -g openapi-typescript）
#
# 生成方式（自动选择）：
#   A. 离线生成：直接从后端代码 app.openapi() 产出 OpenAPI（无需启动服务 / Neo4j）——推荐
#   B. 回退：从运行中的服务拉取 http://localhost:8001/openapi.json（可用 GRAPH_API_URL 覆盖）
#
# 产出：
#   shared/api-client/openapi.json          # 契约快照
#   shared/api-client/generated/graph.ts    # TS SDK（openapi-typescript 生成）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_URL="${GRAPH_API_URL:-http://localhost:8001}"
OUT_DIR="$ROOT/shared/api-client"
SRV_DIR="$ROOT/services/graph-query-service"

# 优先使用服务自身的 venv Python（不依赖当前终端激活环境）
if [ -x "$SRV_DIR/.venv/bin/python" ]; then
  PY_BIN="$SRV_DIR/.venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
  PY_BIN="python3"
else
  PY_BIN="python"
fi

mkdir -p "$OUT_DIR/generated"

# ── 方式 A：离线从代码生成（推荐）───────────────────
if (cd "$SRV_DIR" && "$PY_BIN" -c "import app.main" >/dev/null 2>&1); then
  echo "==> 离线生成 OpenAPI（app.openapi()，无需启动服务）"
  (
    cd "$SRV_DIR"
    OPENAPI_OUT="$OUT_DIR/openapi.json" "$PY_BIN" - <<'PY'
import json
import os

from app.main import app

out = os.environ["OPENAPI_OUT"]
with open(out, "w", encoding="utf-8") as f:
    json.dump(app.openapi(), f, ensure_ascii=False, indent=2)
print(f"==> 已写入 {out}")
PY
  )
# ── 方式 B：从运行中的服务拉取（仅显式指定地址时）───
elif [ -n "${GRAPH_API_URL:-}" ]; then
  echo "==> 离线不可用，从 HTTP 拉取: $API_URL/openapi.json"
  curl -fsS "$API_URL/openapi.json" -o "$OUT_DIR/openapi.json"
else
  echo "!! 离线生成不可用：无法 import app.main（Python 环境缺少依赖）。"
  echo "   请先安装服务依赖："
  echo "     cd $SRV_DIR"
  echo "     python3 -m venv .venv && source .venv/bin/activate && pip install -e \".[dev]\""
  echo "   装好后重新运行本脚本；或启动后端并设置 GRAPH_API_URL 走 HTTP 拉取。"
  exit 1
fi

echo "==> 生成 TS SDK"
npx openapi-typescript "$OUT_DIR/openapi.json" -o "$OUT_DIR/generated/graph.ts"

echo "==> OK: $OUT_DIR/generated/graph.ts"

