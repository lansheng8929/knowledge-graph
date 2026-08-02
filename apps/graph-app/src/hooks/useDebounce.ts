import { useEffect, useRef, useState, useCallback } from "react"

/**
 * 防抖值：value 变化后延迟 delay 毫秒才更新返回的 debounced 值。
 * 常用于把输入框 value 与昂贵的副作用（搜索、过滤）解耦。
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}

/**
 * 防抖回调：连续调用时只执行「最后一次」——停止触发 delay 毫秒后才执行。
 * 返回的引用稳定（依赖只有 delay），不会引起子组件多余重渲染。
 */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
): (...args: A) => void {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  // 始终引用最新的 fn，避免闭包过期
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay],
  )
}

/**
 * 节流回调：在 delay 毫秒内最多执行一次（取首次）。
 * 适用于滚动、拖拽等高频率事件。
 */
export function useThrottledCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
): (...args: A) => void {
  const last = useRef(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  return useCallback(
    (...args: A) => {
      const now = Date.now()
      if (now - last.current >= delay) {
        last.current = now
        fnRef.current(...args)
      }
    },
    [delay],
  )
}
