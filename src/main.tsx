import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 Import this
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster richColors position="top-right" closeButton  />
    </BrowserRouter>
  </React.StrictMode>,
)