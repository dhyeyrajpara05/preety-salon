import React, { useState, useEffect } from 'react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleData, setRescheduleData] = useState(null); // { appid, date, time }

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_ADMIN_API_URL + '/api/all-appointments');
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appid, currentStatus) => {
        const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        let currentIndex = statuses.indexOf(currentStatus);
        let nextStatus = statuses[(currentIndex + 1) % statuses.length];

        try {
            const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/appointments/${appid}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                fetchAppointments();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePostponeAction = async (appid, action) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/appointments/${appid}/${action}-postpone`, {
                method: 'POST'
            });
            if (res.ok) {
                alert(`Postponement ${action}ed`);
                fetchAppointments();
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error('Postpone action error:', error);
        }
    };

    const handleDirectReschedule = async () => {
        if (!rescheduleData.date || !rescheduleData.time) return alert('Please select date and time');
        try {
            const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/appointments/${rescheduleData.appid}/direct-postpone`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: rescheduleData.date, time: rescheduleData.time })
            });
            if (res.ok) {
                alert('Appointment rescheduled');
                setRescheduleData(null);
                fetchAppointments();
            } else {
                alert('Failed to reschedule');
            }
        } catch (error) {
            console.error('Direct reschedule error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fef3c7', text: '#d97706', label: 'Pending' }; // yellow
            case 'Confirmed': return { bg: '#dbeafe', text: '#2563eb', label: 'Confirmed' }; // blue
            case 'Completed': return { bg: '#d1fae5', text: '#059669', label: 'Completed' }; // green
            case 'Cancelled': return { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' }; // red
            default: return { bg: '#f3f4f6', text: '#4b5563', label: 'Unknown' };
        }
    };

    const getActionText = (status) => {
        switch (status) {
            case 'Pending': return 'Confirm Appointment';
            case 'Confirmed': return 'Mark Completed';
            case 'Completed': return 'Completed';
            case 'Cancelled': return 'Cancelled';
            default: return 'Update';
        }
    };

    return (
        <>
            <div className="main-content-inner">
                <div className="main-content-wrap">
                            <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                <h3>Appointments Management</h3>
                            </div>
                            
                            <div className="wg-box">
                                {loading ? (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading appointments...</div>
                                ) : appointments.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No appointments found.</div>
                                ) : (
                                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 2fr) minmax(150px, 1fr) minmax(120px, 1fr) minmax(150px, 1fr)', gap: '15px', padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <div>Guest Details</div>
                                            <div>Service / Request</div>
                                            <div>Date & Time</div>
                                            <div>Status</div>
                                            <div style={{ textAlign: 'right' }}>Action</div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {appointments.map((appt, i) => {
                                                const statusStyle = getStatusColor(appt.status);
                                                return (
                                                    <div key={appt.appid} style={{ 
                                                        display: 'grid', 
                                                        gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 2fr) minmax(150px, 1fr) minmax(120px, 1fr) minmax(150px, 1fr)', 
                                                        gap: '15px', 
                                                        padding: '24px', 
                                                        borderBottom: i === appointments.length - 1 ? 'none' : '1px solid #f1f5f9',
                                                        alignItems: 'center',
                                                        transition: 'background-color 0.2s ease',
                                                        backgroundColor: '#fff'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                    >
                                                        {/* Guest Details */}
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', marginBottom: '4px' }}>{appt.guestName}</div>
                                                            <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '2px' }}>{appt.email}</div>
                                                            <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <i className="icon-phone" style={{ fontSize: '12px' }}></i> {appt.phone}
                                                            </div>
                                                        </div>

                                                        {/* Service */}
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
                                                                {Array.isArray(appt.service) ? appt.service.join(', ') : appt.service}
                                                            </div>
                                                            {appt.specialWishes ? (
                                                                <div style={{ 
                                                                    fontSize: '12px', 
                                                                    color: '#64748b', 
                                                                    backgroundColor: '#f1f5f9', 
                                                                    padding: '8px 12px', 
                                                                    borderRadius: '6px',
                                                                    borderLeft: '2px solid #cbd5e1',
                                                                    fontStyle: 'italic',
                                                                    maxWidth: '100%',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical'
                                                                }} title={appt.specialWishes}>
                                                                    "{appt.specialWishes}"
                                                                </div>
                                                            ) : (
                                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>No special requests</div>
                                                            )}
                                                        </div>

                                                        {/* Date & Time */}
                                                        <div>
                                                            <div style={{ fontWeight: '500', color: '#334155', fontSize: '14px', marginBottom: '4px' }}>
                                                                {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                            <div style={{ 
                                                                display: 'inline-flex', 
                                                                alignItems: 'center', 
                                                                gap: '6px', 
                                                                backgroundColor: '#f1f5f9', 
                                                                padding: '4px 8px', 
                                                                borderRadius: '4px', 
                                                                color: '#475569', 
                                                                fontSize: '13px',
                                                                fontWeight: '500'
                                                            }}>
                                                                <i className="icon-clock"></i> {appt.time}
                                                            </div>
                                                            
                                                            {appt.postponeRequest && appt.postponeRequest.status === 'Pending' && (
                                                                <div style={{ 
                                                                    marginTop: '10px', padding: '10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px'
                                                                }}>
                                                                    <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '5px' }}>⏳ Postpone Request</div>
                                                                    <div style={{ color: '#b45309' }}>New: {appt.postponeRequest.newDate} at {appt.postponeRequest.newTime}</div>
                                                                    <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                                                                        <button onClick={() => handlePostponeAction(appt.appid, 'approve')} style={{ padding: '4px 8px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Approve</button>
                                                                        <button onClick={() => handlePostponeAction(appt.appid, 'reject')} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Reject</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Status */}
                                                        <div>
                                                            <span style={{ 
                                                                backgroundColor: statusStyle.bg,
                                                                color: statusStyle.text,
                                                                padding: '6px 12px',
                                                                borderRadius: '20px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                border: `1px solid ${statusStyle.text}20`
                                                            }}>
                                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.text }}></span>
                                                                {statusStyle.label}
                                                            </span>
                                                        </div>

                                                        {/* Action */}
                                                        <div style={{ textAlign: 'right' }}>
                                                            {appt.status !== 'Completed' && appt.status !== 'Cancelled' ? (
                                                                <button 
                                                                    onClick={() => handleStatusChange(appt.appid, appt.status)}
                                                                    style={{ 
                                                                        padding: '8px 16px', 
                                                                        backgroundColor: appt.status === 'Pending' ? '#0f172a' : '#10b981', 
                                                                        color: 'white', 
                                                                        border: 'none', 
                                                                        borderRadius: '6px', 
                                                                        cursor: 'pointer',
                                                                        fontSize: '13px',
                                                                        fontWeight: '500',
                                                                        transition: 'all 0.2s ease',
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                                                >
                                                                    {getActionText(appt.status)}
                                                                </button>
                                                            ) : (
                                                                <span style={{ 
                                                                    fontSize: '13px', 
                                                                    color: '#94a3b8', 
                                                                    fontWeight: '500',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}>
                                                                    {appt.status === 'Completed' ? <><i className="icon-check"></i> Done</> : <><i className="icon-x"></i> Void</>}
                                                                </span>
                                                            )}
                                                            
                                                            {/* Manage Status Dropdown (Alternative approach) */}
                                                            {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                                                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                                                                    <button 
                                                                        onClick={() => setRescheduleData({ appid: appt.appid, date: appt.date, time: appt.time })}
                                                                        style={{ background: 'none', border: 'none', color: '#0f172a', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                                                                    >
                                                                        Direct Reschedule
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => {
                                                                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                                                                handleStatusChange(appt.appid, 'Completed');
                                                                            }
                                                                        }}
                                                                        style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                                                                    >
                                                                        Cancel Appointment
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

            {/* Direct Reschedule Modal */}
            {rescheduleData && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ marginBottom: '20px' }}>Direct Reschedule</h4>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>New Date</label>
                            <input 
                                type="date" 
                                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                value={rescheduleData.date}
                                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>New Time Slot</label>
                            <select 
                                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                value={rescheduleData.time}
                                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                            >
                                {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setRescheduleData(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleDirectReschedule} style={{ padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Update Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Appointments;
