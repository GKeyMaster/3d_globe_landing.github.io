import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/theme.css'
import './styles/app.css'

// Set Cesium base URL for static assets
(window as any).CESIUM_BASE_URL = '/cesium'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)