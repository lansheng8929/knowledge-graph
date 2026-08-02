#!/usr/bin/env bash
# 一键启动（全容器）：开发模式 / 生产模式 / 停止 / 状态
#
#   bash scripts/up.sh dev     # 开发：全容器 + 源码挂载热更新（后端 --reload、前端 HMR）
#   bash scripts/up.sh prod    # 生产：全容器（后端 + 网关 + 前端 Nginx）
#   bash scripts/up.sh down    # 停止两套容器（数据卷保留）
#   bash scripts/up.sh status  # 查看状态
#
# dev 与 prod 共用 Neo4j 数据卷（vite-test_neo4j_data），勿同时运行；up.sh 已自动切换。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROD="infra/docker-compose.yml"
DEV="infra/docker-compose.dev.yml"

cmd="${1:-dev}"
case "$cmd" in
  dev)
    echo "== 开发模式（全容器 + 热更新）=="
    # 切换：停生产 neo4j，避免与 dev neo4j 共用同一数据卷
    (cd infra/neo4j && docker compose stop 2>/dev/null) || true
    docker compose -f "$DEV" up -d --build
    echo
    echo "✅ dev 全容器已启动（后端挂载源码 --reload、前端 vite HMR）"
    echo "   入口 http://localhost:3001/graph?user=analyst"
    echo "   改后端 .py / 前端 .tsx 即自动生效"
    docker compose -f "$DEV" run --rm --no-deps auth python -m app.seed_users 2>/dev/null || true
    ;;
  prod)
    echo "== 生产模式（全容器）=="
    # 切换：停 dev 套件（其 neo4j 亦用同一数据卷）
    docker compose -f "$DEV" down 2>/dev/null || true
    docker compose -f "$PROD" up -d --build
    (cd infra/neo4j && docker compose up -d)
    echo
    echo "✅ prod 全容器已启动（含前端 Nginx web）"
    echo "   前端 http://localhost:3001/graph?user=analyst（经网关 :8080）"
    docker compose -f "$PROD" run --rm --no-deps auth python -m app.seed_users 2>/dev/null || true
    ;;
  seed)
    echo "== 初始化演示账户（幂等）=="
    if docker compose -f "$DEV" ps -q auth >/dev/null 2>&1; then
      docker compose -f "$DEV" run --rm --no-deps auth python -m app.seed_users
    else
      docker compose -f "$PROD" run --rm --no-deps auth python -m app.seed_users
    fi
    ;;
  down)
    echo "== 停止 =="
    docker compose -f "$DEV" down 2>/dev/null || true
    docker compose -f "$PROD" down 2>/dev/null || true
    (cd infra/neo4j && docker compose stop 2>/dev/null) || true
    echo "✅ 已停止（数据卷保留：vite-test_neo4j_data 等）"
    ;;
  status)
    echo "== 容器 =="
    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E "NAMES|kg-|knowledge" || true
    echo
    echo "== 监听端口（host）=="
    lsof -nP -iTCP:3001 -iTCP:8080 -iTCP:8001 -iTCP:8002 -iTCP:8004 -iTCP:8181 -iTCP:7687 -iTCP:5432 -sTCP:LISTEN 2>/dev/null | awk 'NR==1 || /node|python|com.docke/' | awk '{print $1, $9}' | sort -u || true
    ;;
  *)
    echo "用法: bash scripts/up.sh [dev|prod|down|status]"
    ;;
esac
