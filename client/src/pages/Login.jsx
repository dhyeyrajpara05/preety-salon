import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/profile', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile', { replace: true });
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('Server error. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="auth-page-wrapper" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop')" }}>
            <div className="auth-overlay"></div>
            
            <div className="glass-card">
                <div className="text-center mb-40">
                    <img 
                        src="https://demo.egenslab.com/html/buret/preview/assets/image/beauty-spa/icon/banner-sm-icon.svg" 
                        alt="Logo" 
                        className="mb-20 auth-stagger" 
                        style={{ animationDelay: '0.1s' }}
                    />
                    <h2 className="auth-title auth-stagger" style={{ animationDelay: '0.2s' }}>Sign In</h2>
                    <p className="auth-subtitle auth-stagger" style={{ animationDelay: '0.3s' }}>
                        Welcome back to Preety Salon. Please enter your details to continue your ritual.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group auth-stagger" style={{ animationDelay: '0.4s' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group auth-stagger" style={{ animationDelay: '0.5s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label style={{ margin: 0, paddingRight: '10px' }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '11px', color: '#e5e342', textDecoration: 'none', letterSpacing: '1px', fontWeight: '500' }}>Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-stagger" style={{ animationDelay: '0.6s' }}>
                        <button type="submit" className="auth-btn-premium">
                            SIGN IN
                            <svg className="arrow" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="auth-footer auth-stagger" style={{ animationDelay: '0.7s' }}>
                        <p>New to our community? <Link to="/register">Create Account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
