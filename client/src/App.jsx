import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/UserProfile'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductDetails from './pages/ProductDetails'
import Services from './pages/Services'
import Packages from './pages/Packages'
import About from './pages/About'
import Contact from './pages/Contact'
import BookAppointment from './pages/BookAppointment'
import Membership from './pages/Membership'
import StaffProfile from './pages/StaffProfile'
import Notifications from './pages/Notifications'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import TermsPolicy from './pages/TermsPolicy'
import SimplePay from './pages/SimplePay'
import ScrollRestoration from './components/ScrollRestoration'
import SmoothScroll from './components/SmoothScroll'

const AuthCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/status/${user.email}`);
          if (res.data.status === 'blocked') {
            localStorage.removeItem('user');
            alert('Your account has been blocked by an administrator.');
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
    };
    checkStatus();
  }, [location.pathname, navigate]);
  return null;
};

function App() {
  return (
    <Router>
      <AuthCheck />
      <ScrollRestoration />
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:gender" element={<Services />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/staff-profile/:id" element={<StaffProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms-policy" element={<TermsPolicy />} />
        <Route path="/simple-pay" element={<SimplePay />} />
      </Routes>
    </Router>
  )
}

export default App
