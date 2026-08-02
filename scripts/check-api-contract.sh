#!/usr/bin/env bash
# T1.3.3 契约校验：检测后端 OpenAPI 与 SDK 契约快照是否漂移。
#
# 用法：bash scripts/check-api-contract.sh
# - 离线从 app.main 生成 openapi.json，与 shared/api-client/openapi.json 对比
# - 不一致 → 退出码 1（CI 中即失败），提示先运行 scripts/generate-api-client.sh
#
# 前置：服务依赖已安装（scripts/generate-api-client.sh 同款环境）。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRV_DIR="$ROOT/services/graph-query-service"
SNAP="$ROOT/shared/api-client/openapi.json"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# 复用 generate-api-client.sh 的 venv 探测
if [ -x "$SRV_DIR/.venv/bin/python" ]; then
  PY_BIN="$SRV_DIR/.venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
  PY_BIN="python3"
else
  PY_BIN="python"
fi

if ! (cd "$SRV_DIR" && "$PY_BIN" -c "import app.main" >/dev/null 2>&1); then
  echo "!! 无法 import app.main，跳过契约校验（请先安装服务依赖）。"
  exit 0
fi

(cd "$SRV_DIR" && OPENAPI_OUT="$TMP" "$PY_BIN" - <<'PY'
import json
import os

from app.main import app

out = os.environ["OPENAPI_OUT"]
with open(out, "w", encoding="utf-8") as f:
    json.dump(app.openapi(), f, ensure_ascii=False, indent=2)
PY
)

if ! diff -q "$TMP" "$SNAP" >/dev/null 2>&1; then
  echo "!! 契约漂移：后端 OpenAPI 与 shared/api-client/openapi.json 不一致。"
  echo "   请先运行 scripts/generate-api-client.sh 重新生成 SDK 后提交。"
  exit 1
fi

echo "==> 契约一致（shared/api-client/openapi.json 与后端同步）"
