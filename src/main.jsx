import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Add this!
import './index.css'
import App from './App.jsx'
import LanguageProvider from './LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>  {/* Wrap your <App /> with BrowserRouter */}
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
