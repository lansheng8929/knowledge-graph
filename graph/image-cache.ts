// 修改为单例模式，直接导出Map实例，确保全局唯一
export const imageCache = new Map<string, HTMLImageElement>()
