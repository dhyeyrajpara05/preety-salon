import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_ADMIN_API_URL + '/api/notifications/admin');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_ADMIN_API_URL}/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (window.confirm('Mark all notifications as read?')) {
            try {
                await axios.put(import.meta.env.VITE_ADMIN_API_URL + '/api/notifications/read-all/admin');
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            } catch (error) {
                console.error('Error marking all as read:', error);
            }
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'order': return 'icon-shopping-cart';
            case 'appointment': return 'icon-calendar';
            case 'inquiry': return 'icon-mail';
            case 'feedback': return 'icon-message-square';
            case 'review': return 'icon-star';
            default: return 'icon-bell';
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'order': return '#eff6ff';
            case 'appointment': return '#fffbeb';
            case 'inquiry': return '#f0fdf4';
            case 'feedback': return '#faf5ff';
            case 'review': return '#fff7ed';
            default: return '#f8fafc';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'order': return '#2563eb';
            case 'appointment': return '#d97706';
            case 'inquiry': return '#16a34a';
            case 'feedback': return '#9333ea';
            case 'review': return '#ea580c';
            default: return '#64748b';
        }
    };

    const filteredNotifications = filter === 'all' 
        ? notifications 
        : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Animation styles
    const fadeUpStyle = {
        animation: 'fadeUp 0.5s ease-out forwards',
        opacity: 0,
        transform: 'translateY(10px)'
    };

    const statsEntries = [
        { label: 'Unread', count: unreadCount, color: '#2563eb', bg: '#eff6ff' },
        { label: 'Total', count: notifications.length, color: '#1e293b', bg: '#f1f5f9' },
        { label: 'Orders', count: notifications.filter(n => n.type === 'order').length, color: '#0891b2', bg: '#ecfeff' },
    ];

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>
                {`
                    @keyframes fadeUp {
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .notif-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    }
                    .filter-btn {
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .filter-btn:active {
                        transform: scale(0.95);
                    }
                `}
            </style>
            
            <div className="main-content-inner" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <div className="main-content-wrap">
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Activity Stream</h2>
                            <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>Real-time updates from your premium salon.</p>
                        </div>
                        <button 
                            onClick={markAllAsRead}
                            className="filter-btn"
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#fff', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '10px', 
                                fontSize: '14px', 
                                fontWeight: '700', 
                                color: '#1e293b',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            Mark all read
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        {statsEntries.map((stat, i) => (
                            <div key={i} style={{ 
                                ...fadeUpStyle, 
                                animationDelay: `${i * 0.1}s`,
                                padding: '24px', 
                                backgroundColor: '#fff', 
                                borderRadius: '16px', 
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{stat.label}</span>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginBottom: '30px', 
                        overflowX: 'auto', 
                        paddingBottom: '10px',
                        scrollbarWidth: 'none' 
                    }}>
                        {['all', 'order', 'appointment', 'inquiry', 'feedback'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className="filter-btn"
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    backgroundColor: filter === t ? '#0f172a' : '#fff',
                                    color: filter === t ? '#fff' : '#64748b',
                                    borderColor: filter === t ? '#0f172a' : '#e2e8f0',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Notification List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                <div className="spinner" style={{ border: '3px solid #f3f3f3', borderTop: '3px solid #2563eb', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                                Loading activities...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div style={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '16px', 
                                padding: '60px', 
                                textAlign: 'center', 
                                border: '1px dashed #cbd5e1' 
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px', opacity: 0.5 }}>📭</div>
                                <h4 style={{ fontWeight: '700', color: '#1e293b', margin: 0 }}>No notifications found</h4>
                                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>Check back later or try changing filters.</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notif, idx) => (
                                <div 
                                    key={notif._id}
                                    className="notif-card"
                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                    style={{
                                        ...fadeUpStyle,
                                        animationDelay: `${idx * 0.05 + 0.3}s`,
                                        display: 'flex',
                                        gap: '20px',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        backgroundColor: notif.isRead ? 'rgba(255, 255, 255, 0.8)' : '#fff',
                                        border: '1px solid',
                                        borderColor: notif.isRead ? '#f1f5f9' : '#e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        backdropFilter: 'blur(8px)',
                                        position: 'relative',
                                        boxShadow: notif.isRead ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {!notif.isRead && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: '#2563eb',
                                            boxShadow: '0 0 0 4px rgba(37,99,235,0.1)'
                                        }}></div>
                                    )}

                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: getIconBg(notif.type),
                                        color: getIconColor(notif.type),
                                        fontSize: '18px',
                                        flexShrink: 0
                                    }}>
                                        <i className={getTypeIcon(notif.type)}></i>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                                                {notif.title}
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
