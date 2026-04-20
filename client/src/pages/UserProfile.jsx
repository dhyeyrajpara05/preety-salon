import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const profilePicRef = useRef(null);
    const coverPhotoRef = useRef(null);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);

    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);

    const [availedServices, setAvailedServices] = useState([]);
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [feedbackForm, setFeedbackForm] = useState({});
    const [feedbackSaving, setFeedbackSaving] = useState({});
    const [feedbackSuccess, setFeedbackSuccess] = useState({});
    const [generalFeedback, setGeneralFeedback] = useState({ rating: 0, comment: '' });
    const [generalFeedbackSaving, setGeneralFeedbackSaving] = useState(false);
    const [generalFeedbackSuccess, setGeneralFeedbackSuccess] = useState(false);
    const [allStaff, setAllStaff] = useState([]);
    const [staffLoading, setStaffLoading] = useState(true);
    const [staffReviews, setStaffReviews] = useState({}); 
    

    // Postpone states
    const [postponeModalId, setPostponeModalId] = useState(null);
    const [newPostponeDate, setNewPostponeDate] = useState('');
    const [newPostponeTime, setNewPostponeTime] = useState('');
    const [isPostponing, setIsPostponing] = useState(false);

    // Invoice Detail Modal
    const [selectedInvoice, setSelectedInvoice] = useState(null);


    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setEditData({ uname: parsed.uname, contact: parsed.contact, gender: parsed.gender });
            fetchOrders(parsed.userid);
            fetchAppointments(parsed.userid);
            fetchFeedbackData(parsed.contact, parsed.userid);
            fetchAllStaff();
            if (parsed.contact) {
                fetchInvoices(parsed.contact);
                fetchMembershipStatus(parsed.contact);
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const fetchAllStaff = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/staff');
            if (res.ok) {
                const data = await res.json();
                setAllStaff(data.filter(s => s.status !== 'Inactive'));
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setStaffLoading(false);
        }
    };

    const fetchOrders = async (userid) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${userid}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchInvoices = async (phone) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/by-phone/${phone}`);
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setInvoicesLoading(false);
        }
    };

    const fetchMembershipStatus = async (phone) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/membership/${phone}`);
            if (res.ok) {
                const data = await res.json();
                setUser(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching membership status:', error);
        }
    };

    const fetchFeedbackData = async (phone, userId) => {
        try {
            const [servicesRes, feedbackRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/feedback/my-services/${phone}`),
                fetch(`${import.meta.env.VITE_API_URL}/api/feedback/by-user/${userId}`)
            ]);
            const services = servicesRes.ok ? await servicesRes.json() : [];
            const feedbacks = feedbackRes.ok ? await feedbackRes.json() : [];
            setAvailedServices(services);
            setMyFeedbacks(feedbacks);
            const prefill = {};
            feedbacks.forEach(f => { prefill[f.serviceName] = { rating: f.rating, comment: f.comment }; });
            setFeedbackForm(prefill);
        } catch (err) {
            console.error('Error fetching feedback data:', err);
        }
    };

    const submitGeneralFeedback = async () => {
        if (!generalFeedback.rating) return alert('Please select a star rating.');
        setGeneralFeedbackSaving(true);
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userid,
                    userName: user.uname,
                    serviceName: 'General Experience',
                    rating: generalFeedback.rating,
                    comment: generalFeedback.comment || ''
                })
            });
            if (res.ok) {
                setGeneralFeedbackSuccess(true);
                setTimeout(() => setGeneralFeedbackSuccess(false), 3000);
            }
        } catch (err) {
            console.error('General feedback error:', err);
        } finally {
            setGeneralFeedbackSaving(false);
        }
    };

    const submitStaffReview = async (staffId, staffName) => {
        const form = staffReviews[staffId];
        if (!form?.rating) return alert('Please select a star rating for ' + staffName);
        
        setStaffReviews(p => ({ ...p, [staffId]: { ...p[staffId], saving: true } }));
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userid,
                    userName: user.uname,
                    staffId: staffId,
                    staffName: staffName,
                    rating: form.rating,
                    comment: form.comment || ''
                })
            });
            if (res.ok) {
                setStaffReviews(p => ({ ...p, [staffId]: { ...p[staffId], saving: false, success: true } }));
                fetchFeedbackData(user.contact, user.userid); 
                setTimeout(() => {
                    setStaffReviews(p => ({ ...p, [staffId]: { ...p[staffId], success: false } }));
                }, 3000);
            }
        } catch (err) {
            console.error('Staff review error:', err);
        } finally {
            setStaffReviews(p => ({ ...p, [staffId]: { ...p[staffId], saving: false } }));
        }
    };

    const submitFeedback = async (serviceName, invoiceId, sId, sName) => {
        const form = feedbackForm[serviceName];
        if (!form?.rating) return alert('Please select a star rating.');
        setFeedbackSaving(p => ({ ...p, [serviceName]: true }));
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userid,
                    userName: user.uname,
                    serviceName: serviceName,
                    rating: form.rating,
                    comment: form.comment || '',
                    invoiceId: invoiceId,
                    staffId: sId || '',
                    staffName: sName || ''
                })
            });
            if (res.ok) {
                setFeedbackSuccess(p => ({ ...p, [serviceName]: true }));
                fetchFeedbackData(user.contact, user.userid);
                setTimeout(() => setFeedbackSuccess(p => ({ ...p, [serviceName]: false })), 3000);
            }
        } catch (err) {
            console.error('Submit feedback error:', err);
        } finally {
            setFeedbackSaving(p => ({ ...p, [serviceName]: false }));
        }
    };

    const fetchAppointments = async (userid) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${userid}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setAppointmentsLoading(false);
        }
    };

    const handlePostponeRequest = async () => {
        if (!newPostponeDate || !newPostponeTime) return alert('Please select a date and time.');
        setIsPostponing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${postponeModalId}/postpone-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newDate: newPostponeDate, newTime: newPostponeTime })
            });
            if (res.ok) {
                alert('Postponement request sent to admin for approval.');
                setPostponeModalId(null);
                fetchAppointments(user.userid);
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Postpone error:', error);
        } finally {
            setIsPostponing(false);
        }
    };

    const timeSlots = [
        '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
        '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    const getAvailablePostponeSlots = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        if (newPostponeDate !== todayStr) return timeSlots;
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        return timeSlots.filter(slot => {
            const [time, period] = slot.split(' ');
            let [hour, minute] = time.split(':').map(Number);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            if (hour > currentHour + 1) return true;
            if (hour === currentHour + 1 && currentMinutes === 0) return true;
            return false;
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const handlePhotoUpload = async (file, type) => {
        if (!file) return;
        const data = new FormData();
        data.append(type, file);
        data.append('email', user.email);
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/update-photo', { method: 'POST', body: data });
            const result = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, [type]: result[type] };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                alert(result.message || 'Upload failed');
            }
        } catch (error) {
            alert('Server error. Please try again.');
        }
    };

    const handleEditSave = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, uname: editData.uname, contact: editData.contact, gender: editData.gender })
            });
            const result = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, uname: editData.uname, contact: editData.contact, gender: editData.gender };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
            } else {
                alert(result.message || 'Update failed');
            }
        } catch (error) {
            alert('Server error. Please try again.');
        }
    };

    if (!user) return null;

    const profilePicUrl = user.profilepic ? `${import.meta.env.VITE_API_URL}${user.profilepic}` : null;
    const coverPhotoUrl = user.coverphoto ? `${import.meta.env.VITE_API_URL}${user.coverphoto}` : null;

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const styles = {
        mainWrapper: {
            background: '#0f0f0f',
            minHeight: '100vh',
            color: '#fff',
            fontFamily: '"Outfit", sans-serif',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'hidden'
        },
        backgroundBlob: {
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 227, 66, 0.15) 0%, rgba(0,0,0,0) 70%)',
            top: '-200px',
            right: '-200px',
            zIndex: 0,
            filter: 'blur(80px)'
        },
        backgroundBlob2: {
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 227, 66, 0.1) 0%, rgba(0,0,0,0) 70%)',
            bottom: '-100px',
            left: '-100px',
            zIndex: 0,
            filter: 'blur(80px)'
        },
        container: {
            position: 'relative',
            zIndex: 1,
            paddingTop: '60px',
            paddingBottom: '120px',
            maxWidth: '1300px',
            margin: '0 auto',
            paddingLeft: '20px',
            paddingRight: '20px'
        },
        heroSection: {
            height: '350px',
            borderRadius: '40px',
            marginBottom: '50px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '50px',
            backgroundImage: coverPhotoUrl ? `url(${coverPhotoUrl})` : 'none',
            backgroundColor: '#1a1a1a',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
        },
        heroOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.4) 100%)',
            zIndex: 1
        },
        heroContent: {
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '35px',
            width: '100%'
        },
        avatarLarge: {
            width: '130px',
            height: '130px',
            borderRadius: '38px',
            border: '4px solid rgba(229, 227, 66, 0.3)',
            background: '#252525',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            position: 'relative'
        },
        greetingText: {
            fontFamily: '"Playfair Display", serif',
            fontSize: '44px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#fff',
            letterSpacing: '-0.5px'
        },
        subGreeting: {
            fontSize: '17px',
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '400'
        },
        tabSystem: {
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start'
        },
        glassSidebar: {
            flex: '0 0 320px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(30px)',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '35px',
            position: 'sticky',
            top: '120px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        },
        glassContent: {
            flex: 1,
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(30px)',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '45px',
            minHeight: '700px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        },
        menuItem: (isActive) => ({
            padding: '18px 22px',
            borderRadius: '18px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            cursor: 'pointer',
            background: isActive ? 'rgba(229, 227, 66, 0.08)' : 'transparent',
            color: isActive ? '#e5e342' : 'rgba(255,255,255,0.5)',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: isActive ? '1px solid rgba(229, 227, 66, 0.15)' : '1px solid transparent'
        }),
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
            marginBottom: '50px'
        },
        statCard: {
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '24px',
            padding: '28px',
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#e5e342',
            display: 'block',
            marginBottom: '6px',
            fontFamily: '"Playfair Display", serif'
        },
        statLabel: {
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600'
        },
        premiumTable: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 15px'
        },
        tableRow: {
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '20px',
            transition: 'transform 0.2s ease, background 0.2s ease'
        },
        tableCell: {
            padding: '22px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)'
        },
        badge: (status) => ({
            padding: '7px 14px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 
                status === 'Completed' || status === 'Paid' || status === 'Verified' ? 'rgba(46, 125, 50, 0.12)' : 
                status === 'Upcoming' || status === 'Pending' ? 'rgba(21, 101, 192, 0.12)' : 
                'rgba(239, 108, 0, 0.12)',
            color: 
                status === 'Completed' || status === 'Paid' || status === 'Verified' ? '#81c784' : 
                status === 'Upcoming' || status === 'Pending' ? '#64b5f6' : 
                '#ffb74d',
            border: '1px solid currentColor'
        }),
        input: {
            width: '100%',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '14px 18px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s ease',
            marginTop: '10px'
        },
        actionBtn: {
            background: '#e5e342',
            color: '#000',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 24px rgba(229, 227, 66, 0.15)'
        },
        secondaryBtn: {
            background: 'rgba(255,255,255,0.04)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '14px 30px',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        feedbackCard: {
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '30px',
            marginBottom: '20px'
        }
    };

    const renderRating = (score, size = '16px') => (
        <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star} style={{ fontSize: size, color: star <= score ? '#e5e342' : 'rgba(255,255,255,0.1)' }}>★</span>
            ))}
        </div>
    );

    return (
        <div style={styles.mainWrapper}>
            <Navbar />
            <div style={styles.backgroundBlob}></div>
            <div style={styles.backgroundBlob2}></div>

            <div className="container" style={styles.container}>
                
                {/* ================= HERO UNIT ================= */}
                <div style={styles.heroSection}>
                    <div style={styles.heroOverlay}></div>
                    <div style={styles.heroContent}>
                        <div style={styles.avatarLarge} onClick={() => profilePicRef.current.click()}>
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt="Ritual User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ fontSize: '42px', fontWeight: '700', color: '#e5e342' }}>{getInitials(user.uname)}</div>
                            )}
                            <div style={{ position: 'absolute', bottom: 10, width: '40px', height: '40px', background: 'rgba(229,227,66,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '14px', right: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>✎</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={styles.greetingText}>{user.uname.split(' ')[0]}</h1>
                            <div style={styles.subGreeting}>
                                <span style={{ color: '#e5e342' }}>★</span>
                                {user.membershipTier ? `${user.membershipTier} Member` : 'Elite Ritual Guest'}
                                <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 8px' }}>•</span>
                                {user.email}
                            </div>
                        </div>
                        <button style={styles.secondaryBtn} onClick={() => coverPhotoRef.current.click()}>
                            Refine Ambience
                        </button>
                    </div>
                </div>

                <div style={styles.tabSystem}>
                    {/* ================= NAVIGATION GLASS ================= */}
                    <div style={styles.glassSidebar}>
                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '25px', fontWeight: '700' }}>Executive Console</h4>
                            <div style={styles.menuItem(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>
                                <span>👤</span> Profile Identity
                            </div>
                            <div style={styles.menuItem(activeTab === 'appointments')} onClick={() => setActiveTab('appointments')}>
                                <span>📅</span> Scheduled Rituals
                            </div>
                            <div style={styles.menuItem(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>
                                <span>🛍️</span> Curated Orders
                            </div>
                            <div style={styles.menuItem(activeTab === 'invoices')} onClick={() => setActiveTab('invoices')}>
                                <span>📄</span> Financial Ledger
                            </div>
                            <div style={styles.menuItem(activeTab === 'staff_appraisals')} onClick={() => setActiveTab('staff_appraisals')}>
                                <span>💆</span> Artisan Reviews
                            </div>
                            <div style={styles.menuItem(activeTab === 'feedback')} onClick={() => setActiveTab('feedback')}>
                                <span>⭐</span> Ritual Reflections
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px' }}>
                            <div style={styles.menuItem(false)} onClick={handleLogout}>
                                <span style={{ opacity: 0.5 }}>🚪</span> Terminate Session
                            </div>
                        </div>
                    </div>

                    {/* ================= CONTENT GLASS ================= */}
                    <div style={styles.glassContent}>
                        
                        {/* --- STATS LAYER --- */}
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <span style={styles.statValue}>{appointments.filter(a => a.status === 'Upcoming' || a.status === 'Pending').length}</span>
                                <span style={styles.statLabel}>Active Rituals</span>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statValue}>₹{orders.reduce((sum, o) => sum + (o.totalamount || 0), 0).toFixed(0)}</span>
                                <span style={styles.statLabel}>Ritual Investment</span>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statValue}>{invoices.length}</span>
                                <span style={styles.statLabel}>Verified Invoices</span>
                            </div>
                        </div>

                        {/* --- PROFILE CONTENT --- */}
                        {activeTab === 'profile' && (
                            <div className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
                                    <div>
                                        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>Identity Records</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '15px' }}>Manage your signature profile and digital credentials.</p>
                                    </div>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} style={styles.actionBtn}>
                                            Refine Profile
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => setIsEditing(false)} style={styles.secondaryBtn}>Cancel</button>
                                            <button onClick={handleEditSave} style={styles.actionBtn}>Commit Changes</button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Legal Name</label>
                                        {isEditing ? (
                                            <input style={styles.input} value={editData.uname} onChange={(e) => setEditData({ ...editData, uname: e.target.value })} />
                                        ) : (
                                            <p style={{ fontSize: '19px', fontWeight: '500', margin: '12px 0' }}>{user.uname}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Address</label>
                                        <p style={{ fontSize: '19px', fontWeight: '400', margin: '12px 0', color: 'rgba(255,255,255,0.6)' }}>{user.email}</p>
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Connection</label>
                                        {isEditing ? (
                                            <input style={styles.input} value={editData.contact} onChange={(e) => setEditData({ ...editData, contact: e.target.value })} />
                                        ) : (
                                            <p style={{ fontSize: '19px', fontWeight: '500', margin: '12px 0' }}>{user.contact || 'No Contact Linked'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ritual Preference</label>
                                        {isEditing ? (
                                            <select style={styles.input} value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}>
                                                <option value="">Select Gender</option>
                                                <option value="male">Gentleman</option>
                                                <option value="female">Lady</option>
                                                <option value="other">Non-Binary</option>
                                            </select>
                                        ) : (
                                            <p style={{ fontSize: '19px', fontWeight: '500', margin: '12px 0', textTransform: 'capitalize' }}>{user.gender || 'Not Specified'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- APPOINTMENTS CONTENT --- */}
                        {activeTab === 'appointments' && (
                            <div className="fade-in">
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 35px 0' }}>Ritual Schedule</h2>
                                {appointmentsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(255,255,255,0.3)' }}>Synchronizing with Salon Calendar...</div>
                                ) : appointments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '35px', fontSize: '16px' }}>Your ritual calendar is currently empty.</p>
                                        <button onClick={() => navigate('/book-appointment')} style={styles.actionBtn}>Book New Ritual</button>
                                    </div>
                                ) : (
                                    <table style={styles.premiumTable}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                                <th style={{ padding: '0 25px 15px' }}>Service Essence</th>
                                                <th style={{ padding: '0 25px 15px' }}>Temporal Link</th>
                                                <th style={{ padding: '0 25px 15px' }}>Status</th>
                                                <th style={{ padding: '0 25px 15px', textAlign: 'right' }}>Management</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map(appt => (
                                                <tr key={appt.appid} style={styles.tableRow} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                                    <td style={styles.tableCell}>
                                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{Array.isArray(appt.service) ? appt.service.join(', ') : appt.service}</div>
                                                        <div style={{ fontSize: '11px', opacity: 0.3, marginTop: '4px' }}>RITUAL ID: #{appt.appid}</div>
                                                    </td>
                                                    <td style={styles.tableCell}>
                                                        <div style={{ fontWeight: '600' }}>{new Date(appt.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                                        <div style={{ fontSize: '12px', opacity: 0.5 }}>at {appt.time}</div>
                                                    </td>
                                                    <td style={styles.tableCell}>
                                                        <span style={styles.badge(appt.status)}>{appt.status}</span>
                                                    </td>
                                                    <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                                                        {appt.postponeRequest?.status === 'Pending' ? (
                                                            <div style={{ background: 'rgba(229,227,66,0.1)', color: '#e5e342', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', display: 'inline-block' }}>PENDING ALIGNMENT</div>
                                                        ) : (
                                                            (appt.status === 'Upcoming' || appt.status === 'Pending') && (
                                                                <button style={styles.secondaryBtn} onClick={() => { setPostponeModalId(appt.appid); setNewPostponeDate(''); setNewPostponeTime(''); }}>
                                                                    Reschedule
                                                                </button>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* --- ORDERS CONTENT --- */}
                        {activeTab === 'orders' && (
                            <div className="fade-in">
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 35px 0' }}>Order History</h2>
                                {ordersLoading ? (
                                    <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(255,255,255,0.3)' }}>Retrieving Curated Orders...</div>
                                ) : orders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '32px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '35px' }}>No orders found in your history.</p>
                                        <button onClick={() => navigate('/product')} style={styles.actionBtn}>Explore Boutique</button>
                                    </div>
                                ) : (
                                    <table style={styles.premiumTable}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                                <th style={{ padding: '0 25px 15px' }}>Order Identification</th>
                                                <th style={{ padding: '0 25px 15px' }}>Placement Timestamp</th>
                                                <th style={{ padding: '0 25px 15px' }}>Status</th>
                                                <th style={{ padding: '0 25px 15px', textAlign: 'right' }}>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.orderid} style={styles.tableRow}>
                                                    <td style={styles.tableCell}>
                                                        <div style={{ fontWeight: '600' }}>#{order.orderid}</div>
                                                        <div style={{ fontSize: '11px', opacity: 0.4 }}>VIA: {order.paymentmethod}</div>
                                                    </td>
                                                    <td style={styles.tableCell}>
                                                        <div style={{ fontWeight: '500' }}>{new Date(order.orderdate).toLocaleDateString()}</div>
                                                    </td>
                                                    <td style={styles.tableCell}>
                                                        <span style={styles.badge(order.status)}>{order.status}</span>
                                                    </td>
                                                    <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '700', fontSize: '18px', color: '#e5e342' }}>₹{order.totalamount?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* --- INVOICES CONTENT --- */}
                        {activeTab === 'invoices' && (
                            <div className="fade-in">
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 35px 0' }}>Financial Ledger</h2>
                                {invoicesLoading ? (
                                    <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(255,255,255,0.3)' }}>Loading Ledger Details...</div>
                                ) : invoices.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '32px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No billed invoices associated with your account.</p>
                                    </div>
                                ) : (
                                    <table style={styles.premiumTable}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                                <th style={{ padding: '0 25px 15px' }}>Document ID</th>
                                                <th style={{ padding: '0 25px 15px' }}>Issuance Date</th>
                                                <th style={{ padding: '0 25px 15px' }}>Status</th>
                                                <th style={{ padding: '0 25px 15px', textAlign: 'right' }}>Grand Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map(inv => (
                                                 <tr 
                                                    key={inv._id} 
                                                    style={{ ...styles.tableRow, cursor: 'pointer' }} 
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                 >
                                                     <td style={styles.tableCell}>
                                                         <div style={{ fontWeight: '600', color: '#e5e342' }}>{inv.invoiceNumber}</div>
                                                         <div style={{ fontSize: '10px', opacity: 0.3, marginTop: '4px' }}>CLICK TO VIEW DETAILS</div>
                                                     </td>
                                                     <td style={styles.tableCell}>
                                                         <div style={{ fontWeight: '500' }}>{new Date(inv.date).toLocaleDateString()}</div>
                                                     </td>
                                                     <td style={styles.tableCell}>
                                                         <span style={styles.badge('Paid')}>Verified</span>
                                                     </td>
                                                     <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '700', fontSize: '18px' }}>₹{inv.total?.toFixed(0)}</td>
                                                 </tr>
                                             ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* --- STAFF APPRAISALS CONTENT --- */}
                        {activeTab === 'staff_appraisals' && (
                            <div className="fade-in">
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 35px 0' }}>Artisan Reviews</h2>
                                {staffLoading ? (
                                    <div style={{ textAlign: 'center', padding: '100px' }}>Locating Artisans...</div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                                        {allStaff.map(staff => (
                                            <div key={staff._id} style={styles.feedbackCard}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                                    <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(229,227,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#e5e342' }}>{staff.name ? staff.name[0] : 'S'}</div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '16px' }}>{staff.name}</h4>
                                                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{staff.designation}</p>
                                                    </div>
                                                </div>
                                                
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)' }}>Artisan Score</label>
                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button 
                                                                key={star} 
                                                                onClick={() => setStaffReviews(p => ({ ...p, [staff._id]: { ...p[staff._id], rating: star } }))}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: 0, color: star <= (staffReviews[staff._id]?.rating || 0) ? '#e5e342' : 'rgba(255,255,255,0.05)' }}
                                                            >★</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <textarea 
                                                    placeholder="Express your gratitude or feedback..."
                                                    style={{ ...styles.input, minHeight: '80px', fontSize: '13px' }}
                                                    value={staffReviews[staff._id]?.comment || ''}
                                                    onChange={(e) => setStaffReviews(p => ({ ...p, [staff._id]: { ...p[staff._id], comment: e.target.value } }))}
                                                ></textarea>
                                                
                                                <button 
                                                    onClick={() => submitStaffReview(staff._id, staff.name)}
                                                    style={{ ...styles.actionBtn, marginTop: '20px', width: '100%', justifyContent: 'center', padding: '12px' }}
                                                    disabled={staffReviews[staff._id]?.saving}
                                                >
                                                    {staffReviews[staff._id]?.success ? 'REVIEWED ✓' : 'POST APPRAISAL'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- FEEDBACK CONTENT --- */}
                        {activeTab === 'feedback' && (
                            <div className="fade-in">
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: '0 0 35px 0' }}>Ritual Reflections</h2>
                                
                                <div style={{ background: 'rgba(229,227,66,0.03)', border: '1px solid rgba(229,227,66,0.1)', borderRadius: '24px', padding: '30px', marginBottom: '40px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Global Experience</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '20px' }}>How was your overall synergy with Preety Salon?</p>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} onClick={() => setGeneralFeedback({...generalFeedback, rating: s})} style={{ background: 'none', border: 'none', fontSize: '30px', color: s <= generalFeedback.rating ? '#e5e342' : 'rgba(255,255,255,0.1)', cursor: 'pointer' }}>★</button>
                                        ))}
                                    </div>
                                    <button onClick={submitGeneralFeedback} style={styles.actionBtn} disabled={generalFeedbackSaving}>
                                        {generalFeedbackSuccess ? 'THANK YOU ✓' : 'SUBMIT GLOBAL REFLECTION'}
                                    </button>
                                </div>

                                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', marginBottom: '25px' }}>Service Feedback</h3>
                                {availedServices.length === 0 ? (
                                    <p style={{ opacity: 0.3 }}>Complete your first ritual to provide specific service reflections.</p>
                                ) : (
                                    availedServices.map((svc, i) => (
                                        <div key={i} style={styles.feedbackCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '18px' }}>{svc.serviceName}</h4>
                                                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Artisan: {svc.staffName || 'Expert Artisan'}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <button key={s} onClick={() => setFeedbackForm(p => ({ ...p, [svc.serviceName]: { ...p[svc.serviceName], rating: s } }))} style={{ background: 'none', border: 'none', fontSize: '20px', color: s <= (feedbackForm[svc.serviceName]?.rating || 0) ? '#e5e342' : 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>★</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea 
                                                style={{ ...styles.input, minHeight: '80px' }} 
                                                placeholder="Share your experience..." 
                                                value={feedbackForm[svc.serviceName]?.comment || ''}
                                                onChange={(e) => setFeedbackForm(p => ({ ...p, [svc.serviceName]: { ...p[svc.serviceName], comment: e.target.value } }))}
                                            ></textarea>
                                            <button 
                                                onClick={() => submitFeedback(svc.serviceName, svc.invoiceId, svc.staffId, svc.staffName)}
                                                style={{ ...styles.actionBtn, marginTop: '15px' }}
                                                disabled={feedbackSaving[svc.serviceName]}
                                            >
                                                {feedbackSuccess[svc.serviceName] ? 'REFLECTED ✓' : 'SHARE FEEDBACK'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Hidden Inputs */}
            <input type="file" ref={coverPhotoRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e.target.files[0], 'coverphoto')} />
            <input type="file" ref={profilePicRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e.target.files[0], 'profilepic')} />

            {/* Postpone Modal (Modernized) */}
            {postponeModalId && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(25px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(25,25,25,0.8)', padding: '50px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', width: '450px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ fontFamily: '"Playfair Display", serif', marginBottom: '12px', fontSize: '28px' }}>Reschedule Ritual</h3>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '35px' }}>Seek a new temporal alignment for your session.</p>
                        
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ fontSize: '10px', color: '#e5e342', textTransform: 'uppercase', letterSpacing: '1px' }}>New Ritual Date</label>
                            <input type="date" style={styles.input} value={newPostponeDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setNewPostponeDate(e.target.value)} />
                        </div>
                        
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '10px', color: '#e5e342', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Time Slot</label>
                            <select style={styles.input} value={newPostponeTime} onChange={(e) => setNewPostponeTime(e.target.value)}>
                                <option value="">Select Temporal Slot</option>
                                {getAvailablePostponeSlots().map(slot => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button onClick={() => setPostponeModalId(null)} style={{ ...styles.secondaryBtn, flex: 1 }}>Abort</button>
                            <button onClick={handlePostponeRequest} style={{ ...styles.actionBtn, flex: 2 }} disabled={isPostponing}>
                                {isPostponing ? 'ALIGNING...' : 'COMMIT REQUEST'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(30px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedInvoice(null)}>
                    <div 
                        style={{ background: 'rgba(30,30,30,0.9)', padding: '50px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '700px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 50px 100px rgba(0,0,0,0.6)', position: 'relative' }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedInvoice(null)} 
                            style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >✕</button>

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'inline-block', padding: '10px 25px', borderRadius: '100px', background: 'rgba(229, 227, 66, 0.1)', color: '#e5e342', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Invoice Receipt</div>
                            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', margin: 0 }}>{selectedInvoice.invoiceNumber}</h2>
                            <p style={{ opacity: 0.4, fontSize: '14px', marginTop: '8px' }}>Issued on {new Date(selectedInvoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>

                        <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div>
                                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Client Details</label>
                                <div style={{ fontWeight: '600', fontSize: '18px' }}>{selectedInvoice.customerName}</div>
                                <div style={{ opacity: 0.5 }}>{selectedInvoice.customerPhone}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Payment Status</label>
                                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '10px', background: 'rgba(46, 125, 50, 0.2)', color: '#81c784', fontWeight: '700', fontSize: '13px' }}>PAID SUCCESSFUL</div>
                                <div style={{ opacity: 0.5, marginTop: '8px', fontSize: '12px' }}>Method: {selectedInvoice.paymentMethod || 'Digital Transaction'}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={{ textAlign: 'left', padding: '15px 10px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase' }}>Description</th>
                                        <th style={{ textAlign: 'center', padding: '15px 10px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase' }}>Qty</th>
                                        <th style={{ textAlign: 'right', padding: '15px 10px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ textAlign: 'right', padding: '15px 10px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.items.map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <td style={{ padding: '20px 10px' }}>
                                                <div style={{ fontWeight: '500' }}>{item.serviceName}</div>
                                                {item.staffName && <div style={{ fontSize: '11px', opacity: 0.3, marginTop: '4px' }}>BY {item.staffName.toUpperCase()}</div>}
                                            </td>
                                            <td style={{ padding: '20px 10px', textAlign: 'center', opacity: 0.6 }}>{item.quantity}</td>
                                            <td style={{ padding: '20px 10px', textAlign: 'right', opacity: 0.6 }}>₹{item.price.toLocaleString()}</td>
                                            <td style={{ padding: '20px 10px', textAlign: 'right', fontWeight: '600' }}>₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', opacity: 0.6 }}>
                                <span>Subtotal Ritual Value</span>
                                <span>₹{(selectedInvoice.subtotal || selectedInvoice.total + (selectedInvoice.discount || 0)).toLocaleString()}</span>
                            </div>
                            {selectedInvoice.discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#e5e342' }}>
                                    <span>Membership Synergy Discount</span>
                                    <span>- ₹{selectedInvoice.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', fontWeight: '700' }}>Final Amount</span>
                                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: '700', color: '#e5e342' }}>₹{selectedInvoice.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '20px' }} className="no-print">
                            <button onClick={() => window.print()} style={{ ...styles.actionBtn, padding: '16px 40px' }}>
                                <span>🖨️</span> Save as PDF
                            </button>
                            <button onClick={() => setSelectedInvoice(null)} style={{ ...styles.secondaryBtn, padding: '16px 40px' }}>
                                Close Registry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default UserProfile;
