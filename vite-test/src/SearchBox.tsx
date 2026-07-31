import { useState, useRef, useEffect } from "react"

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
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setOpen(false)
      return
    }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/graph/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, limit: 10 }),
        })
        const json = await res.json()
        if (json.success) {
          setResults(json.data.nodes)
          setOpen(true)
        }
      } catch {
        // ignore
      }
    }, 300)

    return () => clearTimeout(timerRef.current)
  }, [query])

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

  const handleSelect = (nodeId: string) => {
    setQuery("")
    setResults([])
    setOpen(false)
    onSelect(nodeId)
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        placeholder="搜索节点..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        style={inputStyle}
      />
      {open && results.length > 0 && (
        <div style={dropdownStyle}>
          {results.map((r) => (
            <div
              key={r.id}
              style={itemStyle}
              onClick={() => handleSelect(r.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgb(var(--hover))"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgb(var(--background))"
              }}
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
