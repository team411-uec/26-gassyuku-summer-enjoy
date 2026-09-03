import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./lib/firebase"
import "./style.css"

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <div className="p-8">Vite + React + TypeScript + Tailwind CSS</div>
  </StrictMode>,
)
