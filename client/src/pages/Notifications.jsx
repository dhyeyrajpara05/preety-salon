import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Notifications = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            fetchNotifications(parsed.userid);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchNotifications = async (userid) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${userid}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
                method: 'PUT'
            });
            if (res.ok) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        if (!window.confirm('Mark all alerts as read?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all/${user.userid}`, {
                method: 'PUT'
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    if (!user) return null;

    // Helper to group by relative date
    const groupNotifications = (notifs) => {
        const groups = {
            'Today': [],
            'Yesterday': [],
            'Older': []
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        notifs.forEach(n => {
            const d = new Date(n.createdAt);
            d.setHours(0, 0, 0, 0);
            if (d.getTime() === today.getTime()) groups['Today'].push(n);
            else if (d.getTime() === yesterday.getTime()) groups['Yesterday'].push(n);
            else groups['Older'].push(n);
        });
        return groups;
    };

    const grouped = groupNotifications(notifications);

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>
                {`
                    @keyframes fadeUp {
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .notif-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    }
                    .btn-premium {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    .btn-premium:hover {
                        box-shadow: 0 10px 15px -3px rgba(229, 227, 66, 0.3);
                        transform: translateY(-1px);
                    }
                    .btn-premium:active { transform: scale(0.98); }
                    
                    .hero-gradient {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        position: relative;
                        overflow: hidden;
                    }
                    .hero-gradient::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-43c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20-27c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm58 52c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM22 37c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm54 56c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm32-47c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM71 2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM20 71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 10c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
                        opacity: 0.4;
                    }
                `}
            </style>

            <Navbar />
            
            {/* Immersive Hero Section */}
            <div className="hero-gradient" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', margin: 0 }}>
                            Notifications
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginTop: '16px', fontWeight: '500' }}>
                            Stay updated on your premium salon journey and orders.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, backgroundColor: '#fcfcfd', padding: '100px 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                        
                        {/* Stream Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Latest Updates</h3>
                                <div style={{ height: '4px', width: '40px', backgroundColor: 'var(--primary-color)', marginTop: '8px', borderRadius: '2px' }}></div>
                            </div>
                            {notifications.some(n => !n.isRead) && (
                                <button 
                                    onClick={markAllAsRead}
                                    style={{ 
                                        background: 'transparent', 
                                        border: '1px solid #e2e8f0', 
                                        color: '#64748b', 
                                        fontWeight: '700', 
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.borderColor = '#0f172a'; e.target.style.color = '#0f172a'; }}
                                    onMouseLeave={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.color = '#64748b'; }}
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading updates...</div>
                        ) : notifications.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '80px 40px', 
                                background: '#fff', 
                                borderRadius: '24px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '24px' }}>✨</div>
                                <h4 style={{ fontWeight: '800', fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>All caught up!</h4>
                                <p style={{ color: '#64748b', fontSize: '15px' }}>We'll notify you here about your orders and appointments.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {Object.entries(grouped).map(([title, items], gIdx) => items.length > 0 && (
                                    <div key={title} style={{ animation: `fadeUp 0.6s ease-out ${gIdx * 0.1}s forwards`, opacity: 0, transform: 'translateY(20px)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
                                            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {items.map((notif, i) => (
                                                <div 
                                                    key={notif._id}
                                                    className="notif-card"
                                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                                    style={{
                                                        padding: '24px',
                                                        background: '#fff',
                                                        borderRadius: '20px',
                                                        border: '1px solid',
                                                        borderColor: notif.isRead ? '#f1f5f9' : 'rgba(229, 227, 66, 0.2)',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: notif.isRead ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.03)',
                                                        backgroundColor: notif.isRead ? 'rgba(255,255,255,0.7)' : '#fff'
                                                    }}
                                                >
                                                    {!notif.isRead && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '24px',
                                                            right: '24px',
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--primary-color)',
                                                            boxShadow: '0 0 0 6px rgba(229, 227, 66, 0.15)'
                                                        }}></div>
                                                    )}
                                                    
                                                    <div style={{ display: 'flex', gap: '20px' }}>
                                                        <div style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            borderRadius: '12px',
                                                            backgroundColor: notif.type === 'order' ? '#f0f9ff' : '#fff7ed',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '18px',
                                                            flexShrink: 0
                                                        }}>
                                                            {notif.type === 'order' ? '🛍️' : '📅'}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                                <h5 style={{ margin: 0, fontWeight: '800', color: '#0f172a', fontSize: '15.5px' }}>{notif.title}</h5>
                                                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>
                                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{notif.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Notifications;
