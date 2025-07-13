import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { PublicClientApplication } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"
import { msalConfig } from "@/lib/msalConfig"

const msalInstance = new PublicClientApplication(msalConfig)

const isProd = import.meta.env.PROD;

const Root = (
  <MsalProvider instance={msalInstance}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </MsalProvider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  isProd
    ? Root
    : <React.StrictMode>{Root}</React.StrictMode>
)
