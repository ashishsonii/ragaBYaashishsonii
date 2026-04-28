import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initAuthListener } from './store/authStore'
import { initTheme } from './store/themeStore'
import { registerServiceWorker } from './utils/serviceWorker'

// Initialize theme (dark/light)
initTheme()

// Initialize auth state listener (Firebase or demo)
initAuthListener()

// Register Service Worker
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
