import { createRoot } from "react-dom/client"
import App from "./App"
import "../../shell/src/styles/tokens.css"
import "./styles.css"

createRoot(document.getElementById("root")!).render(<App />)
