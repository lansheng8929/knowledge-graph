/**
 * API 配置（T1.2.3 地址外置）。
 *
 * - 开发环境默认走 Vite proxy：`/api/v1` → localhost:8001（见 vite.config.ts）
 * - 生产环境由 `VITE_API_BASE` 注入（网关统一出口），不硬编码后端地址
 */

export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api/v1"
