import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserCotext.jsx'

createRoot(document.getElementById('root')).render(
 <UserProvider>
   <StrictMode>
    <App />
  </StrictMode>,
 </UserProvider>
)
