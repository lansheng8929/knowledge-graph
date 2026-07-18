#!/usr/bin/env node

import { mkdirSync, writeFileSync, readFileSync, appendFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entityName = process.argv[2]
if (!entityName) {
  console.error("Usage: node create-entity.js <entity-name>")
  process.exit(1)
}

// 转换为kebab-case
const kebabName = entityName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
// 转换为PascalCase
const pascalName = entityName.replace(/(^\w|-\w)/g, (match) =>
  match.replace("-", "").toUpperCase()
)
// 转换为camelCase
const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1)

const entityDir = join(__dirname, kebabName)

// 创建目录
mkdirSync(entityDir, { recursive: true })

// 生成type文件
const typeContent = `import type { GraphNode } from "../../client/type"


export type ${pascalName}NodeType = GraphNode<{
}>
`
writeFileSync(join(entityDir, `${kebabName}.type.ts`), typeContent)

// 生成client文件
const clientContent = `import {
  makeDrawWrapper,
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_NODE_LABEL_SCALE_THRESHOLD,
} from "../../client/"
import { getPaginator } from "../../utils"
import type { EntityCreator } from "../entity-types"

import type { ${pascalName}NodeType } from "./${kebabName}.type"

export const create${pascalName}Entity: EntityCreator = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: ({node, ctx, globalScale, style}) => {
      const { x = 0, y = 0 } = node
      const { ${camelName}, pageIndex, pageSize, count } = (node.data as ${pascalName}NodeType["data"]) ?? {}

      const iconPath = \`/api/v1/connValueType-icon?key=${kebabName}\`

      const {
        radius = DEFAULT_RADIUS,
        fontSize = DEFAULT_FONT_SIZE,
        bgColor = DEFAULT_BG_COLOR,
        textColor = DEFAULT_TEXT_COLOR,
        opacity = 1,
        strokeColor,
        strokeWidth,
        light,
      } = style

      if (light) {
        makeDrawWrapper(ctx).circle(x, y, 5, light)
      }

      makeDrawWrapper(ctx)
        .circle(x, y, radius, bgColor, opacity)
        .stroke(x, y, radius, strokeColor, strokeWidth, opacity)
        .drawImg(imageCache, iconPath, x, y, radius, radius, opacity)

      if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
        const paginator = getPaginator(pageIndex, pageSize, count)

        makeDrawWrapper(ctx)
          .text(
            \`\${${camelName}}\${paginator}\`,
            x,
            y + radius + fontSize,
            fontSize,
            textColor,
            opacity
          )
          .text(
            "${pascalName}",
            x,
            y + radius + (fontSize + 0.5) * 2,
            fontSize,
            textColor,
            opacity
          )
      }
    },

    renderNodePointerArea: ({node, color, ctx, style}) => {
      const { x = 0, y = 0 } = node
      const { strokeColor, strokeWidth, radius = DEFAULT_RADIUS } = style
      makeDrawWrapper(ctx)
        .stroke(x, y, radius, strokeColor, strokeWidth)
        .circle(x, y, radius, indexColor)
    },

    getCollisionRadius: ({node, style}) => {
      const { radius = DEFAULT_RADIUS } = style
      return radius
    },
  }
}
`
writeFileSync(join(entityDir, `${kebabName}.client.ts`), clientContent)

// 生成server文件
const serverContent = `

`
writeFileSync(join(entityDir, `${kebabName}.server.ts`), serverContent)

// 生成style文件
const styleContent = `import type { ${pascalName}NodeType } from "./${kebabName}.type"

export const ${camelName}Style = {
  // Style definitions here
}
`
writeFileSync(join(entityDir, `${kebabName}.style.ts`), styleContent)

// 生成index文件
const indexContent = `export * from "./${kebabName}.client";
export * from "./${kebabName}.type";
`
writeFileSync(join(entityDir, "index.ts"), indexContent)

// 更新主index.client.ts
const indexClientPath = join(__dirname, "index.client.ts")
let indexClientContent = readFileSync(indexClientPath, "utf-8")
const exportLine = `export * from "./${kebabName}/${kebabName}.client"`
if (!indexClientContent.includes(exportLine)) {
  indexClientContent += `\n${exportLine}`
  writeFileSync(indexClientPath, indexClientContent)
}

// 更新主index.ts
const indexPath = join(__dirname, "index.ts")
let indexContentMain = readFileSync(indexPath, "utf-8")
const exportLineMain = `export * from "./${kebabName}/${kebabName}.type"`
if (!indexContentMain.includes(exportLineMain)) {
  indexContentMain += `\n${exportLineMain}`
  writeFileSync(indexPath, indexContentMain)
}

console.log(`✅ Entity "${entityName}" created successfully!`)
console.log(`📁 Created files:`)
console.log(`   - ${kebabName}/${kebabName}.type.ts`)
console.log(`   - ${kebabName}/${kebabName}.client.ts`)
console.log(`   - ${kebabName}/${kebabName}.server.ts`)
console.log(`   - ${kebabName}/${kebabName}.style.ts`)
console.log(`   - ${kebabName}/index.ts`)
console.log(`📝 Updated:`)
console.log(`   - index.client.ts`)
console.log(`   - index.ts`)
