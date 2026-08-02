import { useCallback, useEffect, useRef, useState } from "react"

/** 请求状态机：idle → loading → success | error */
export type RequestStatus = "idle" | "loading" | "success" | "error"

export interface RequestState<T> {
  status: RequestStatus
  data: T | null
  error: string | null
}

/**
 * 通用异步请求状态机制。
 *
 * 特性：
 * - 状态机 idle → loading → success | error
 * - 过期响应保护：多次 run 时只保留最后一次的结果（序号比对）
 * - AbortController：新请求会中断上一个未完成的请求；卸载时自动中断
 * - run 返回 Promise<T | undefined>，成功时 resolve 数据
 */
export function useRequest<T = unknown>() {
  const [state, setState] = useState<RequestState<T>>({
    status: "idle",
    data: null,
    error: null,
  })

  // 请求序号：递增，只接受最新一次请求的响应
  const seqRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async (fn: (signal: AbortSignal) => Promise<T>) => {
    const seq = ++seqRef.current
    // 中断上一个未完成的请求
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((s) => ({ ...s, status: "loading", error: null }))
    try {
      const data = await fn(controller.signal)
      if (seq !== seqRef.current) return // 过期响应，丢弃
      setState({ status: "success", data, error: null })
      return data
    } catch (e) {
      if (seq !== seqRef.current) return
      if ((e as { name?: string })?.name === "AbortError") return
      setState({
        status: "error",
        data: null,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }, [])

  /** 重置为初始 idle 状态，并中断进行中的请求 */
  const reset = useCallback(() => {
    seqRef.current++
    abortRef.current?.abort()
    setState({ status: "idle", data: null, error: null })
  }, [])

  // 卸载时中断进行中的请求
  useEffect(() => {
    return () => {
      seqRef.current++
      abortRef.current?.abort()
    }
  }, [])

  return {
    ...state,
    run,
    reset,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  }
}
