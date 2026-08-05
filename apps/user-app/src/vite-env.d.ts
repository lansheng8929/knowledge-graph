/// <reference types="vite/client" />

// T2.3.4：构建版本标记
declare const __BUILD_VERSION__: string

// CSS 副作用导入声明（side-effect import，编辑器 TS 解析用）
declare module "*.css"
