import { useState, useRef, useEffect } from "react"
import { useDebouncedCallback } from "./hooks/useDebounce"
import { useRequest } from "./hooks/useRequest"
import { graphApi } from "./api/client"

interface SearchResult {
  id: string
  data: { label?: string; nodeType?: string }
}

const inputStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontSize: "13px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  outline: "none",
  width: 180,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
}

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  boxShadow: "var(--shadow)",
  maxHeight: 240,
  overflowY: "auto",
  zIndex: 100,
}

const itemStyle: React.CSSProperties = {
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "rgb(var(--foreground))",
  borderBottom: "1px solid rgb(var(--border))",
}

const NODE_TYPE_LABELS: Record<string, string> = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
}

interface SearchBoxProps {
  onSelect: (nodeId: string) => void
}

export default function SearchBox({ onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  /** 键盘高亮的下标（-1 = 无） */
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  // 请求状态机制：data=结果、run 发起、reset 清空；新请求自动中断旧请求
  const { data: results, run, reset } = useRequest<SearchResult[]>()

  // 输入停止 300ms 后才发起搜索（防抖）
  const debouncedSearch = useDebouncedCallback((q: string) => {
    const qText = q.trim()
    if (!qText) {
      reset()
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    run(async (signal) => {
      const data = await graphApi.search(qText, 10, signal)
      return (data.nodes ?? []) as SearchResult[]
    }).then((nodes) => {
      setOpen(!!nodes?.length)
      setActiveIndex(nodes?.length ? 0 : -1)
    })
  }, 300)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }

  // 键盘导航：↑/↓ 移动高亮，Enter 选中，Esc 关闭
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = results ?? []
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (open && list.length > 0) {
        setActiveIndex((i) => (i + 1) % list.length)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (open && list.length > 0) {
        setActiveIndex((i) => (i <= 0 ? list.length - 1 : i - 1))
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (open && list.length > 0 && activeIndex >= 0) {
        handleSelect(list[activeIndex].id)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // 键盘导航时把高亮项滚动到可视区
  useEffect(() => {
    const listEl = listRef.current
    if (!listEl || activeIndex < 0) return
    const item = listEl.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const handleSelect = (nodeId: string) => {
    setQuery("")
    reset()
    setOpen(false)
    setActiveIndex(-1)
    onSelect(nodeId)
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        placeholder="搜索节点..."
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => (results?.length ?? 0) > 0 && setOpen(true)}
        style={inputStyle}
      />
      {open && results && results.length > 0 && (
        <div ref={listRef} style={dropdownStyle}>
          {results.map((r, idx) => (
            <div
              key={r.id}
              style={{
                ...itemStyle,
                background:
                  idx === activeIndex ? "rgb(var(--hover))" : "transparent",
              }}
              onClick={() => handleSelect(r.id)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                {r.data?.label ?? r.id}
              </span>
              <span style={{ color: "rgb(var(--muted))", marginLeft: 6 }}>
                {NODE_TYPE_LABELS[r.data?.nodeType ?? ""] ?? r.data?.nodeType}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
