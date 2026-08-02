#!/usr/bin/env bash
# 构建 graph-app 子应用独立产物，并按版本发布到 shell 的静态目录（模拟 CDN / 独立部署）。
#
# 用法:
#   bash scripts/publish-graph-app.sh              # 版本取 apps/graph-app/package.json
#   bash scripts/publish-graph-app.sh 0.2.0        # 指定版本
#
# 产出: apps/shell/public/subapps/graph-app@<version>.js
#       （shell 经 importmap 指向该文件；换版本 = 换 URL = 单模块更新）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT/apps/graph-app"
DIST="$APP_DIR/dist-single-spa"
SUBAPPS="$ROOT/apps/shell/public/subapps"

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  VERSION="$(node -p "require('$APP_DIR/package.json').version" 2>/dev/null || true)"
fi
if [ -z "$VERSION" ] || [ "$VERSION" = "undefined" ]; then
  VERSION="0.1.0"
  echo "[publish] package.json 无 version，默认使用 $VERSION"
fi

mkdir -p "$SUBAPPS"
echo "[publish] build graph-app (single-spa bundle, v$VERSION)..."
(cd "$APP_DIR" && APP_VERSION="$VERSION" bun run build:single-spa)

# 内联 CSS → 单文件自包含（importmap 只需映射 graph-app 一个键，无需额外 <link>）
echo "[publish] inline css into bundle..."
node -e "
const fs = require('fs');
const dir = process.argv[1];
const jsPath = dir + '/graph-app.js';
const cssPath = dir + '/graph-app.css';
let js = fs.readFileSync(jsPath, 'utf8');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const style = 'const __kgStyle=document.createElement(\"style\");__kgStyle.textContent=' + JSON.stringify(css) + ';document.head.appendChild(__kgStyle);\n';
  js = style + js;
  fs.unlinkSync(cssPath);
  console.log('[inline-css] graph-app.css 已内联');
}
fs.writeFileSync(jsPath, js);
" "$DIST"

cp "$DIST/graph-app.js" "$SUBAPPS/graph-app@$VERSION.js"
echo "[publish] published -> apps/shell/public/subapps/graph-app@$VERSION.js"
echo "[publish] 切换版本: 修改 apps/shell/index.html 里 importmap 的 graph-app URL"
