import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PropertyProvider } from './context/PropertyContext'
import { FavoriteProvider } from './context/FavoriteContext'
import { CompareProvider } from './context/CompareContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <FavoriteProvider>
            <CompareProvider>
              <App />
            </CompareProvider>
          </FavoriteProvider>
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
