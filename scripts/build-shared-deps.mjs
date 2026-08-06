#!/usr/bin/env node
/**
 * 生成共享依赖文件（scripts/build-shared-deps.mjs）
 *
 * 原生 importmap + ESM 方案：从 jspm CDN（ga.jspm.io）下载子应用共享依赖
 * （react / react-dom / scheduler / jsx-runtime，由 scripts/detect-shared-deps.mjs
 * 自动识别）的「标准 ESM 产物」到 apps/shell/public/shared/，自托管，
 * 供 shell 的原生 importmap 加载：
 *   - 子应用 single-spa 构建 external 这些依赖（ESM 裸说明符），不打包
 *   - 产物是标准 ESM：零运行时、无格式锁定；jspm 正确处理 React 的 CJS→ESM
 *   - 产物间是裸说明符依赖（react/scheduler），由 import map 解析 → 自托管后完全离线
 *   - 一次性下载固化；版本跟随实际安装版本（与 detect-shared-deps.mjs 一致）
 *
 * 说明：
 *   - react-dom/client 是 jspm 独立产物（import "react-dom" + re-export createRoot），
 *     importmap 里 react-dom/client 映射到 -client.js。
 *
 * 用法:
 *   bun scripts/build-shared-deps.mjs
 *   bun run shared:build
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  renameSync,
} from "node:fs"
import { resolve, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const APP = join(ROOT, "apps/graph-app") // 解析已安装版本（三应用 react 版本一致）
const OUT = join(ROOT, "apps/shell/public/shared")
const CDN = "https://ga.jspm.io"

// 与 detect-shared-deps.mjs 相同的版本解析：已安装版本是文件名的唯一事实来源
const REQ = createRequire(join(APP, "node_modules/react-dom/package.json"))
function installedVersion(name) {
  try {
    return JSON.parse(readFileSync(REQ.resolve(`${name}/package.json`), "utf8"))
      .version
  } catch {
    return null
  }
}

const v = {
  react: installedVersion("react") ?? "18.3.1",
  "react-dom": installedVersion("react-dom") ?? "18.3.1",
  scheduler: installedVersion("scheduler") ?? "0.23.2",
}

// 清空旧产物，避免残留旧格式文件（System.register 版等）
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

console.log(
  `[build-shared-deps] react@${v.react} / react-dom@${v["react-dom"]} / scheduler@${v.scheduler}`,
)

// [jspm ESM 产物 URL, 目标文件名]
const downloads = [
  [`${CDN}/npm:react@${v.react}/index.js`, `react@${v.react}.js`],
  [
    `${CDN}/npm:react@${v.react}/jsx-runtime.js`,
    `react@${v.react}-jsx-runtime.js`,
  ],
  [
    `${CDN}/npm:react-dom@${v["react-dom"]}/index.js`,
    `react-dom@${v["react-dom"]}.js`,
  ],
  [
    `${CDN}/npm:react-dom@${v["react-dom"]}/client.js`,
    `react-dom@${v["react-dom"]}-client.js`,
  ],
  [
    `${CDN}/npm:scheduler@${v.scheduler}/index.js`,
    `scheduler@${v.scheduler}.js`,
  ],
]

// 先下载到临时目录，全部成功后再替换正式目录（防止发布链里网络失败清空现有产物）
const TMP = join(dirname(OUT), ".shared-tmp")
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })
try {
  for (const [url, name] of downloads) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`下载失败 ${url}: HTTP ${res.status}`)
    const text = await res.text()
    writeFileSync(join(TMP, name), text)
    console.log(`  ${name}  (${(text.length / 1024).toFixed(1)} KB)`)
  }
} catch (e) {
  rmSync(TMP, { recursive: true, force: true })
  throw e
}
rmSync(OUT, { recursive: true, force: true })
renameSync(TMP, OUT)
console.log(
  `[build-shared-deps] 已生成 -> ${OUT}（自托管 ESM，产物间裸说明符由 import map 解析）`,
)
