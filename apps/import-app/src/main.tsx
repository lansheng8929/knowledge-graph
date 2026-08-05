import { createRoot } from "react-dom/client"
import App from "./App"
// 主题 token 单一来源（壳层 shell 持有）
import "../../shell/src/styles/tokens.css"
import "./styles.css"

// 独立运行入口（常规路径经 shell 挂载，此入口仅用于独立调试）
createRoot(document.getElementById("root")!).render(<App />)
