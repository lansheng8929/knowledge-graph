#!/usr/bin/env bash
# 构建 import-app 子应用独立产物，并按版本发布到 shell 的静态目录（模拟 CDN / 独立部署）。
#
# 用法:
#   bash scripts/publish-import-app.sh              # 版本取 apps/import-app/package.json
#   bash scripts/publish-import-app.sh 0.1.0        # 指定版本
#
# 产出: apps/shell/public/subapps/import-app@<version>.js
#       （shell 经 importmap 指向该文件；换版本 = 换 URL = 单模块更新）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT/apps/import-app"
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

# 共享依赖与子应用同步：发布前先检测并生成共享依赖（react/react-dom/scheduler ESM），
# 保证 importmap 的共享条目与子应用版本一致（版本不漂移）
(cd "$ROOT" && bun run shared:detect && bun run shared:build)

mkdir -p "$SUBAPPS"
echo "[publish] build import-app (single-spa bundle, v$VERSION)..."
(cd "$APP_DIR" && APP_VERSION="$VERSION" bun run build:single-spa)

# 内联 CSS → 单文件自包含（importmap 只需映射 import-app 一个键，无需额外 <link>）
echo "[publish] inline css into bundle..."
node -e "
const fs = require('fs');
const dir = process.argv[1];
const jsPath = dir + '/import-app.js';
const cssPath = dir + '/import-app.css';
let js = fs.readFileSync(jsPath, 'utf8');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const style = 'const __kgImportStyle=document.createElement(\"style\");__kgImportStyle.textContent=' + JSON.stringify(css) + ';document.head.appendChild(__kgImportStyle);\n';
  js = style + js;
  fs.unlinkSync(cssPath);
  console.log('[inline-css] import-app.css 已内联');
}
fs.writeFileSync(jsPath, js);
" "$DIST"

cp "$DIST/import-app.js" "$SUBAPPS/import-app@$VERSION.js"
echo "[publish] published -> apps/shell/public/subapps/import-app@$VERSION.js"
echo "[publish] 切换版本: 修改 apps/shell/public/importmap.json 里 import-app 的 URL"

