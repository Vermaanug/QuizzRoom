import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import {  QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import queryClientGlobal from './config/tanstack-query.config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClientGlobal}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', color: '#172033', fontSize: '14px' },
          success: { iconTheme: { primary: '#4f46e5', secondary: '#ffffff' } },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
