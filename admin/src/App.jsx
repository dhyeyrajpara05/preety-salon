import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Product from './pages/Product'
import Category from './pages/Category'
import Orders from './pages/Orders'
import Login from './pages/Login'
import AdminServices from './pages/Services'
import AdminPackages from './pages/Packages'
import Appointments from './pages/Appointments'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import Staff from './pages/Staff'
import Membership from './pages/Membership'
import Users from './pages/Users'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'
import Layout from './components/Layout'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const admin = localStorage.getItem('currentAdmin')
  if (!admin) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside Global Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/category" element={<Category />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/services" element={<AdminServices />} />
          <Route path="/packages" element={<AdminPackages />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
