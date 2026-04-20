import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/dashboard-stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '600' }}>Loading Dashboard Statistics...</div>
      </div>
    );
  }

  const { totalSales, servicesSales, productsSales, visitsBreakdown, recentInvoices, todaysAppointments } = stats || {};

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        {/* Dashboard Grid Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 350px',
          gap: '25px',
          alignItems: 'start'
        }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Top Row: Sales & Visits */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              
              {/* 1. SALES CARD */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Sales</h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '13px', fontWeight: '600' }}>
                    <Link to="/invoices" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="icon-eye" style={{fontSize: '14px'}}></i> View Collections
                    </Link>
                  </div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '30px' }}>
                  ₹ {totalSales?.toLocaleString() || 0}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  {/* Simple Pie Chart Representation */}
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', 
                    background: `conic-gradient(#0284c7 0% 85%, #ea580c 85% 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#fff' }}></div>
                  </div>
                  
                  {/* Breakdown Rows */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#e0f2fe', padding: '10px 15px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#0369a1' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #0284c7' }}></div>
                        Services
                      </div>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>₹ {servicesSales?.toLocaleString() || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff7ed', padding: '10px 15px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#c2410c' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #ea580c' }}></div>
                        Products
                      </div>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>₹ {productsSales?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. VISITS CARD */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Visits</h3>
                  <Link to="/appointments" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                    <i className="icon-calendar" style={{fontSize: '14px'}}></i> Manage
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{visitsBreakdown?.total || 0}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Total Appointments</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  {/* Visits Chart Placeholder */}
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', border: '20px solid #f1f5f9',
                    borderTopColor: '#10b981', borderRightColor: '#f59e0b', flexShrink: 0
                  }}></div>
                  
                  {/* Status Blocks Grid */}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                        Upcoming
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{visitsBreakdown?.upcoming || 0}</div>
                    </div>
                    <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#b45309', marginBottom: '4px' }}>
                        Done
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{visitsBreakdown?.completed || 0}</div>
                    </div>
                    <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>
                        Cancel
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{visitsBreakdown?.cancelled || 0}</div>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                        Other
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{visitsBreakdown?.noShow || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Invoices */}
            {/* 3. INVOICES CARD */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              border: '1px solid #f0f0f0',
              minHeight: '250px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Recent Invoices</h3>
                <Link to="/invoices" style={{ 
                  textDecoration: 'none', color: '#2563eb', fontWeight: '600', fontSize: '14px', 
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  New Invoice <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '18px'}}>+</span>
                </Link>
              </div>
              
              {recentInvoices && recentInvoices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {recentInvoices.map((inv, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <i className="icon-file-text" style={{ color: '#2563eb' }}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '15px' }}>{inv.customerName}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(inv.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: '#111827' }}>₹ {inv.total.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: inv.status === 'Paid' ? '#166534' : '#b45309', fontWeight: '700', textTransform: 'uppercase' }}>{inv.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingTop: '20px' }}>
                  <i className="icon-file-text" style={{ fontSize: '32px', color: '#cbd5e1' }}></i>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>No invoices found</div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Appointments List */}
          {/* 4. APPOINTMENTS QUICK VIEW */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
            height: '100%',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Today's Appts</h3>
              <Link to="/appointments" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>View All</Link>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {todaysAppointments && todaysAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {todaysAppointments.map((appt, idx) => (
                    <div key={idx} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', borderLeft: '4px solid #2563eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontWeight: '800', fontSize: '14px' }}>{appt.time}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>{appt.status}</span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{appt.guestName}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{appt.service}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', opacity: 0.6 }}>
                  <i className="icon-calendar" style={{ fontSize: '32px', color: '#cbd5e1' }}></i>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>No appointments today</div>
                </div>
              )}
            </div>
            
            <Link to="/appointments" style={{ 
              marginTop: '20px', width: '100%', padding: '12px', borderRadius: '10px', border: 'none', 
              backgroundColor: '#2563eb', color: '#fff', textAlign: 'center', fontWeight: '700', textDecoration: 'none'
            }}>
              Add New Appointment
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
