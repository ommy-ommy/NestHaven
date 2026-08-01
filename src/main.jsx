import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PropertyProvider } from './context/PropertyContext'
import { FavoriteProvider } from './context/FavoriteContext'
import { CompareProvider } from './context/CompareContext'
import { DocumentProvider } from './context/DocumentContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <PropertyProvider>
            <FavoriteProvider>
              <CompareProvider>
                <DocumentProvider>
                  <App />
                </DocumentProvider>
              </CompareProvider>
            </FavoriteProvider>
          </PropertyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
