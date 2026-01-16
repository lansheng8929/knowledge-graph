// 必须存在react导入
import React from "react"

import { renderToStaticMarkup } from "react-dom/server"
import type { GraphDataGenerics, GraphLink, GraphNode } from "./type"

const tooltipContainerClass = "space-y-2 flex flex-col max-w-xs"
const dataItemClass = "break-words"

function ToolTip<N extends GraphNode>({
  node,
  debug,
}: {
  node?: N
  debug: boolean
}) {
  if (!node) return null

  return debug ? (
    <div className={tooltipContainerClass}>
      <strong>{node.id}</strong>
      <strong>
        ({node.x}, {node.y})
      </strong>
      {node.fx || node.fy ? (
        <strong>
          ({node.fx}, {node.fy})
        </strong>
      ) : null}

      {node.data
        ? Object.entries(node.data).map(([key, value]) => (
            <strong key={key} className={dataItemClass}>
              {key}:{JSON.stringify(value)}
            </strong>
          ))
        : null}
    </div>
  ) : null
}

const nodeLabel = <N extends GraphNode>(node?: N, debug?: boolean) =>
  renderToStaticMarkup(<ToolTip<N> node={node} debug={debug ?? false} />)

function LinkToolTip<L extends GraphLink>({
  link,
  debug,
}: {
  link?: L
  debug?: boolean
}) {
  if (!link) return null

  return debug ? (
    <div className={tooltipContainerClass}>
      <strong>{link.id}</strong>
      <strong>{link.ranking}</strong>

      {link?.data
        ? Object.entries(link.data).map(([key, value]) => (
            <strong key={key} className={dataItemClass}>
              {key}:{JSON.stringify(value)}
            </strong>
          ))
        : null}
    </div>
  ) : null
}

const linkLabel = <
  G extends GraphDataGenerics,
  L extends GraphLink<G> = GraphLink<G>
>(
  link?: L,
  debug?: boolean
) => renderToStaticMarkup(<LinkToolTip link={link} debug={debug ?? false} />)

export { nodeLabel, linkLabel }
