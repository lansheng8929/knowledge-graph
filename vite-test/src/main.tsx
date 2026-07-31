import ReactDOM from "react-dom/client"
import App from "./App"
import { ThemeProvider } from "./hooks/useTheme"
import "./styles/tokens.css"
import "./styles/utilities.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
