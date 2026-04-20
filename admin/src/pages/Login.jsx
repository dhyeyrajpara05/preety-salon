import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Initialize default admin credentials if not already set
  useEffect(() => {
    const admins = localStorage.getItem('adminUsers')
    if (!admins) {
      const defaultAdmin = [
        {
          id: 1,
          name: 'Admin',
          email: 'admin@preetysalon.com',
          password: 'admin123',
          role: 'super_admin',
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('adminUsers', JSON.stringify(defaultAdmin))
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const admins = JSON.parse(localStorage.getItem('adminUsers') || '[]')
      const admin = admins.find(
        (a) => a.email === email && a.password === password
      )

      if (admin) {
        localStorage.setItem(
          'currentAdmin',
          JSON.stringify({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
          })
        )
        navigate('/')
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1e2f 0%, #2d2d44 50%, #1e1e2f 100%)',
        fontFamily: '"EB Garamond", serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          borderRadius: '16px',
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          margin: '20px'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontFamily: '"EB Garamond", serif',
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '4px',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ color: '#1e1e1e' }}>PREETY</span>
            <span style={{ color: '#e5e342', marginLeft: '8px' }}>SALON</span>
          </span>
          <p
            style={{
              color: '#888',
              fontSize: '14px',
              marginTop: '8px',
              fontFamily: 'sans-serif',
              letterSpacing: '1px'
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="alert alert-danger"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontFamily: 'sans-serif'
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                fontFamily: 'sans-serif'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@preetysalon.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#e5e342')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                fontFamily: 'sans-serif'
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#e5e342')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: loading
                ? '#ccc'
                : 'linear-gradient(135deg, #1e1e2f, #2d2d44)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: 'sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '1px'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Default credentials hint */}
        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            background: '#f8f9fa',
            borderRadius: '10px',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            color: '#666',
            textAlign: 'center'
          }}
        >
          <strong>Default Credentials:</strong>
          <br />
          Email: admin@preetysalon.com | Password: admin123
        </div>
      </div>
    </div>
  )
}

export default Login
