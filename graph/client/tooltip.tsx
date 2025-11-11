import React from "react"

import { renderToStaticMarkup } from "react-dom/server"
import type { GraphLink, GraphNode, LinkObject, NodeObject } from "../type"

function ToolTip({ node, debug }: { node: GraphNode; debug: boolean }) {
  return debug ? (
    <div className=" space-y-2 flex flex-col">
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
            <strong key={key}>
              {key}:{JSON.stringify(value)}
            </strong>
          ))
        : null}
    </div>
  ) : null
}

const nodeLabel = (node: NodeObject, debug?: boolean) =>
  renderToStaticMarkup(<ToolTip node={node} debug={debug ?? false} />)

function LinkToolTip({ link, debug }: { link: GraphLink; debug?: boolean }) {
  return debug ? (
    <div className=" space-y-2 flex flex-col">
      <strong>{link.id}</strong>
      <strong>{link.ranking}</strong>

      {link?.data
        ? Object.entries(link.data).map(([key, value]) => (
            <strong key={key}>
              {key}:{JSON.stringify(value)}
            </strong>
          ))
        : null}
    </div>
  ) : null
}

const linkLabel = (link: LinkObject, debug?: boolean) =>
  renderToStaticMarkup(<LinkToolTip link={link} debug={debug ?? false} />)

export { nodeLabel, linkLabel }
