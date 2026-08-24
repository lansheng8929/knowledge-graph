import { marked } from "marked"
import DOMPurify from "dompurify"

marked.setOptions({ gfm: true, breaks: true })

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener noreferrer")
  }
})

export function renderMarkdown(text: string): string {
  return DOMPurify.sanitize(marked.parse(text) as string)
}
