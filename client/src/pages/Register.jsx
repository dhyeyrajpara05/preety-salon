import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uname: '',
        email: '',
        gender: '',
        contact: '',
        password: '',
        confirmPassword: ''
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
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uname: formData.uname,
                    email: formData.email,
                    password: formData.password,
                    gender: formData.gender,
                    contact: formData.contact
                })
            });
            const result = await res.json();
            if (res.ok) {
                alert('Registration successful!');
                setFormData({ uname: '', email: '', gender: '', contact: '', password: '', confirmPassword: '' });
                navigate('/login', { replace: true });
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('Server error. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="auth-page-wrapper" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="auth-overlay"></div>

            <div className="glass-card" style={{ maxWidth: '650px' }}>
                <div className="text-center mb-40">
                    <img 
                        src="https://demo.egenslab.com/html/buret/preview/assets/image/beauty-spa/icon/banner-sm-icon.svg" 
                        alt="Logo" 
                        className="mb-20 auth-stagger" 
                        style={{ animationDelay: '0.1s' }}
                    />
                    <h2 className="auth-title auth-stagger" style={{ animationDelay: '0.2s' }}>Create Account</h2>
                    <p className="auth-subtitle auth-stagger" style={{ animationDelay: '0.3s' }}>
                        Join the Preety Salon community and embark on your journey to timeless elegance.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="row">
                        <div className="col-lg-12 auth-stagger" style={{ animationDelay: '0.4s' }}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="uname"
                                    placeholder="Enter your full name"
                                    value={formData.uname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 auth-stagger" style={{ animationDelay: '0.45s' }}>
                            <div className="input-group">
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
                        </div>
                    </div>

                    <div className="row auth-stagger" style={{ animationDelay: '0.5s' }}>
                        <div className="col-md-6">
                            <div className="input-group">
                                <label>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    placeholder="+91 00000 00000"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row auth-stagger" style={{ animationDelay: '0.55s' }}>
                        <div className="col-md-6">
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-stagger mb-30" style={{ animationDelay: '0.6s' }}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="terms" required />
                            <label className="form-check-label" htmlFor="terms" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                I agree to the <Link to="/terms-policy" style={{ color: '#e5e342', textDecoration: 'none', fontWeight: 'bold' }}>Terms & Conditions</Link>
                            </label>
                        </div>
                    </div>

                    <div className="auth-stagger" style={{ animationDelay: '0.65s' }}>
                        <button type="submit" className="auth-btn-premium">
                            CREATE ACCOUNT
                            <svg className="arrow" width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="auth-footer auth-stagger" style={{ animationDelay: '0.7s' }}>
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
