import React, { useState } from 'react';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 2000);
            } else {
                setError(data.message || 'Failed to send security code');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="spa-banner-section auth-banner" style={{
                backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(https://demo.egenslab.com/html/buret/preview/assets/image/beauty-spa/spa-breadcram-image.jpg)",
                backgroundSize: "cover", backgroundPosition: "center", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <div className="container text-center">
                    <h1 style={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>Ritual Recovery</h1>
                    <p style={{ color: '#eee' }}>Restore access to your signature salon profile.</p>
                </div>
            </div>

            <div className="auth-section pt-120 mb-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-9">
                            <div className="auth-card">
                                <div className="auth-card-header text-center">
                                    <h3>Forgot Password?</h3>
                                    <p>Enter your email to receive a 6-digit security code.</p>
                                </div>
                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-inner mb-30">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {message && <div style={{ color: '#059669', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>✅ {message}</div>}
                                    {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>❌ {error}</div>}

                                    <button type="submit" className="primary-btn1 form-btn auth-submit-btn" disabled={loading}>
                                        {loading ? 'SENDING...' : 'SEND SECURITY CODE'}
                                    </button>
                                    <div className="auth-footer-text text-center mt-20">
                                        <p>Remembered your password? <Link to="/login">Sign In</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;
