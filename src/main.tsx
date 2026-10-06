import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/bodoni-moda/latin-400.css'
import '@fontsource/bodoni-moda/latin-400-italic.css'
import '@fontsource/manrope/latin-400.css'
import './styles.css'
import App from './App'

try {
  if (sessionStorage.getItem('bv-reduce-motion') === '1') document.documentElement.dataset.motion = 'reduce'
} catch { /* Session storage can be unavailable. */ }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
