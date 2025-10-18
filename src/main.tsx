import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@web3modal/wagmi/style.css';

createRoot(document.getElementById("root")!).render(<App />);
