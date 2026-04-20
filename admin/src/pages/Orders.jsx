import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('All')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_ADMIN_API_URL + '/api/admin/orders')
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
            alert("Failed to fetch orders.")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderid, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/admin/orders/${orderid}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                fetchOrders()
            } else {
                alert("Failed to update status.")
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert("Error occurred while updating status.")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { color: '#d97706', bg: '#fffbeb' }
            case 'Processing': return { color: '#2563eb', bg: '#eff6ff' }
            case 'Shipped': return { color: '#9333ea', bg: '#faf5ff' }
            case 'Delivered': return { color: '#16a34a', bg: '#f0fdf4' }
            case 'Cancelled': return { color: '#dc2626', bg: '#fef2f2' }
            default: return { color: '#64748b', bg: '#f8fafc' }
        }
    }

    const filteredOrders = statusFilter === 'All' 
        ? orders 
        : orders.filter(o => o.status === statusFilter)

    const stats = {
        totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.totalamount || 0), 0),
        activeOrders: orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length,
        cancelledOrders: orders.filter(o => o.status === 'Cancelled').length
    }

    // Animation styles
    const fadeUpStyle = {
        animation: 'fadeUp 0.5s ease-out forwards',
        opacity: 0,
        transform: 'translateY(10px)'
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>
                {`
                    @keyframes fadeUp {
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .order-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    }
                    .btn-hover:hover { opacity: 0.9; }
                    .btn-hover:active { transform: scale(0.98); }
                    .custom-select {
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 0.5rem center;
                        background-size: 1.5em 1.5em;
                        padding-right: 2.5rem;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                `}
            </style>
            
            <div className="main-content-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div className="main-content-wrap">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Admin</Link>
                                <span style={{ color: '#94a3b8', fontSize: '13px' }}>/</span>
                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '700' }}>Orders</span>
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Orders Management</h2>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ ...fadeUpStyle, padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Revenue</div>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>₹{stats.totalRevenue.toLocaleString()}</div>
                        </div>
                        <div style={{ ...fadeUpStyle, animationDelay: '0.1s', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Active Orders</div>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>{stats.activeOrders}</div>
                        </div>
                        <div style={{ ...fadeUpStyle, animationDelay: '0.2s', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Cancelled</div>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626' }}>{stats.cancelledOrders}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className="btn-hover"
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid',
                                    borderColor: statusFilter === status ? '#0f172a' : '#e2e8f0',
                                    backgroundColor: statusFilter === status ? '#0f172a' : '#fff',
                                    color: statusFilter === status ? '#fff' : '#64748b',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ padding: '80px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '20px', border: '1px dashed #e2e8f0' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                            <h4 style={{ fontWeight: '700', color: '#1e293b' }}>No orders found</h4>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Try switching filters or check back later.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            {filteredOrders.map((order, idx) => {
                                const statusTheme = getStatusColor(order.status)
                                return (
                                    <div 
                                        key={order.orderid} 
                                        className="order-card"
                                        style={{ 
                                            ...fadeUpStyle, 
                                            animationDelay: `${idx * 0.05 + 0.3}s`,
                                            padding: '32px', // Increased padding
                                            backgroundColor: '#fff', 
                                            borderRadius: '24px', // More rounded
                                            border: '1px solid #f1f5f9',
                                            display: 'grid',
                                            gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1.2fr', // Adjusted widths
                                            alignItems: 'center',
                                            gap: '30px', // More gap
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            lineHeight: '1.5' // Better line height
                                        }}
                                    >
                                        {/* ID & Customer */}
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '6px' }}>#{order.orderid}</div>
                                            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>{order.fullname}</div>
                                            <div style={{ fontSize: '14px', color: '#64748b' }}>{order.phone}</div>
                                            {order.transactionid && (
                                                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700', marginTop: '4px' }}>TXN: {order.transactionid}</div>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Amount</div>
                                            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>₹{order.totalamount?.toFixed(2)}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{order.paymentmethod}</div>
                                        </div>

                                        {/* Date */}
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Date</div>
                                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                                                {new Date(order.orderdate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <span style={{ 
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 16px', // More padding
                                                borderRadius: '24px',
                                                backgroundColor: statusTheme.bg,
                                                color: statusTheme.color,
                                                fontSize: '12px',
                                                fontWeight: '800'
                                            }}>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: statusTheme.color }}></span>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <div style={{ textAlign: 'right' }}>
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleStatusUpdate(order.orderid, e.target.value)}
                                                className="custom-select"
                                                style={{ 
                                                    padding: '10px 14px', // More padding
                                                    borderRadius: '12px', 
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    color: '#1e293b',
                                                    backgroundColor: '#f8fafc',
                                                    cursor: 'pointer',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Orders
