#!/usr/bin/env node
/**
 * 自动识别子应用共享依赖（scripts/detect-shared-deps.mjs）
 *
 * 直接读取 apps/ 下所有子项目（凡含 package.json 的目录，不硬编码名单），
 * 找出「出现在 >= MIN_SHARED 个子应用」的依赖作为共享依赖，自动生成：
 *   ① shared/deps/shared-externals.json        —— 子应用 rollup external 清单（构建期不打包）
 *   ② apps/shell/public/shared-importmap.json  —— shell importmap 共享条目（运行期只提供一次）
 *
 * 用法:
 *   bun scripts/detect-shared-deps.mjs
 *   node scripts/detect-shared-deps.mjs
 */
import {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs"
import { resolve, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const APPS = join(ROOT, "apps")

// 共享判定阈值：出现在 >=2 个子应用才算共享
const MIN_SHARED = 2

// 「已安装版本」是文件名的唯一事实来源（与 scripts/build-shared-deps.mjs 保持一致）。
// bun 工作区未根 hoist：scheduler 在根 node_modules/.bun store，须从 react-dom 目录解析。
const REQ = createRequire(
  join(ROOT, "apps/graph-app/node_modules/react-dom/package.json"),
)
function installedVersion(name) {
  try {
    return JSON.parse(readFileSync(REQ.resolve(`${name}/package.json`), "utf8"))
      .version
  } catch {
    return null
  }
}

// 版本固定策略：优先取手动固定的版本（保证 importmap 不随安装漂移），
// 未固定的包回退到声明范围里解析出的版本号。
const PINNED_VERSIONS = {
  react: "18.3.1",
  "react-dom": "18.3.1",
  scheduler: "0.23.2",
}

// 特殊展开：SystemJS 直接加载 CJS——react-dom/client 的实现就在 react-dom CJS 里
// （createRoot 具名导出），映射到同一文件；react-dom CJS 内部 require("scheduler")，
// 由 SystemJS 从 importmap 解析，故一并加入。
const IMPORTMAP_EXTRA = {
  react: (v) => ({
    react: `./shared/react@${v}.js`,
    "react/jsx-runtime": `./shared/react@${v}-jsx-runtime.js`,
  }),
  "react-dom": (v) => ({
    "react-dom": `./shared/react-dom@${v}.js`,
    // react-dom/client 是 jspm 独立 ESM 产物（import "react-dom" + re-export createRoot）
    "react-dom/client": `./shared/react-dom@${v}-client.js`,
    scheduler: `./shared/scheduler@${installedVersion("scheduler") ?? "0.23.2"}.js`,
  }),
}

// ── 1. 自动扫描 apps/ 下所有子项目（有 package.json 即算，不用维护名单）────
const subApps = readdirSync(APPS, { withFileTypes: true })
  .filter(
    (d) => d.isDirectory() && existsSync(join(APPS, d.name, "package.json")),
  )
  .map((d) => d.name)
  .sort()

if (subApps.length === 0) {
  console.error(
    "[detect-shared-deps] apps/ 下未找到任何子项目（无 package.json）",
  )
  process.exit(1)
}

// ── 2. 收集每个子应用的 dependencies ──
const usage = {} // name -> [{ app, range }]
for (const app of subApps) {
  const pkg = JSON.parse(readFileSync(join(APPS, app, "package.json"), "utf8"))
  for (const [name, range] of Object.entries(pkg.dependencies ?? {})) {
    ;(usage[name] ??= []).push({ app, range })
  }
}

// ── 3. 找出共享依赖（按包名排序，输出稳定可 diff）──
const shared = Object.entries(usage)
  .filter(([, v]) => v.length >= MIN_SHARED)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, v]) => ({
    name,
    count: v.length,
    apps: v.map((x) => x.app),
    ranges: v.map((x) => x.range),
  }))

console.log("[detect-shared-deps] 扫描到子应用:", subApps.join(", "))
if (shared.length === 0) {
  console.log(
    "[detect-shared-deps] 未发现共享依赖（阈值: 出现在 >=%d 个子应用）",
    MIN_SHARED,
  )
} else {
  console.table(
    shared.map((s) => ({
      name: s.name,
      count: s.count,
      apps: s.apps.join(","),
    })),
  )
}

// ── 4. 输出①：子应用 rollup external 清单 ──
const externals = shared.map((s) => s.name)
const externalsPath = join(ROOT, "shared/deps/shared-externals.json")
mkdirSync(dirname(externalsPath), { recursive: true })
writeFileSync(externalsPath, JSON.stringify(externals, null, 2) + "\n")
console.log("→ 已生成", externalsPath)

// ── 5. 输出②：shell importmap 共享条目（含 React 生态子路径展开）──
function resolveVersion(s) {
  // 优先取已安装版本（与 build-shared-deps.sh 产物文件名一致）
  const inst = installedVersion(s.name)
  if (inst) return inst
  // 兜底：手动固定版本 → 声明范围提取
  if (PINNED_VERSIONS[s.name]) return PINNED_VERSIONS[s.name]
  for (const range of s.ranges) {
    const m = /(\d+\.\d+\.\d+)/.exec(range)
    if (m) return m[1]
  }
  return "latest"
}

const sharedImports = {}
for (const s of shared) {
  const v = resolveVersion(s)
  const expand = IMPORTMAP_EXTRA[s.name]
  if (expand) Object.assign(sharedImports, expand(v))
  else sharedImports[s.name] = `./shared/${s.name}@${v}.js`
}

const sharedMapPath = join(ROOT, "apps/shell/public/shared-importmap.json")
writeFileSync(
  sharedMapPath,
  JSON.stringify({ imports: sharedImports }, null, 2) + "\n",
)
console.log("→ 已生成", sharedMapPath)

// ── 6. 合并进 shell 实际使用的 importmap.json（保留子应用版本条目，写入/更新共享条目）──
const importmapPath = join(ROOT, "apps/shell/public/importmap.json")
let map = { imports: {} }
try {
  map = JSON.parse(readFileSync(importmapPath, "utf8"))
} catch {
  // 首次运行：importmap.json 尚不存在，从空开始
}
map.imports = { ...(map.imports ?? {}), ...sharedImports }
writeFileSync(importmapPath, JSON.stringify(map, null, 2) + "\n")
console.log("→ 已合并", importmapPath)
