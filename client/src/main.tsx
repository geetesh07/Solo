import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Production-ready Firebase app initialization
createRoot(document.getElementById("root")!).render(<App />);
