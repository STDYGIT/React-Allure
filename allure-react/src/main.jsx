import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminVideos from './pages/AdminVideos.jsx'
import AdminServices from './pages/AdminServices.jsx'
import AdminContacts from './pages/AdminContacts.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pops" element={<AdminLogin />} />
        <Route 
          path="/pops/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pops/videos" 
          element={
            <ProtectedRoute>
              <AdminVideos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pops/services" 
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pops/contacts" 
          element={
            <ProtectedRoute>
              <AdminContacts />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
