import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter basename="/Srabon">
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} catch (e) {
  console.error("🔥 Root render error:", e);
}
