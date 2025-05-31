import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import LanguageProvider from './LanguageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename="/Srabon">
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);
