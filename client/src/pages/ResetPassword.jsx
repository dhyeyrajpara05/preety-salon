import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Failed to reset password');
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
                    <h1 style={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>Security Authentication</h1>
                    <p style={{ color: '#eee' }}>Enter your security code and define your new ritual password.</p>
                </div>
            </div>

            <div className="auth-section pt-120 mb-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-9">
                            <div className="auth-card">
                                <div className="auth-card-header text-center">
                                    <h3>Reset Ritual Password</h3>
                                    <p>Confirm the 6rd-digit code sent to <b>{email}</b></p>
                                </div>
                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="form-inner mb-20">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-inner mb-20">
                                        <label>6-Digit Security Code</label>
                                        <input
                                            type="text"
                                            placeholder="X X X X X X"
                                            maxLength="6"
                                            style={{ textAlign: 'center', letterSpacing: '10px', fontSize: '20px', fontWeight: 'bold' }}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-inner mb-20">
                                        <label>New Ritual Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-inner mb-30">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {success && <div style={{ color: '#059669', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>✨ Ritual password updated! Redirecting to login...</div>}
                                    {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>❌ {error}</div>}

                                    <button type="submit" className="primary-btn1 form-btn auth-submit-btn" disabled={loading}>
                                        {loading ? 'RESETTING...' : 'RESET RITUAL PASSWORD'}
                                    </button>
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

export default ResetPassword;
