/// <reference types="vite/client" />

// T2.3.4：构建版本标记（由 vite define 注入，见 vite.single-spa.config.ts / vite.config.ts）
declare const __BUILD_VERSION__: string

// CSS 副作用导入声明（side-effect import，编辑器 TS 解析用）
declare module "*.css"
