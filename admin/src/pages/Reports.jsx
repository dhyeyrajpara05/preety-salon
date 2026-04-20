import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [data, setData] = useState({
    staffReports: [],
    productReports: [],
    yearlyReport: [],
    detailedTransactions: []
  });
  const [loading, setLoading] = useState(true);

  // Modern color palette for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/reports`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalYearlyRevenue = data.yearlyReport.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalInStore = data.yearlyReport.reduce((acc, curr) => acc + curr.inStoreRevenue, 0);
  const totalOnline = data.yearlyReport.reduce((acc, curr) => acc + curr.onlineRevenue, 0);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Excel Download Utility
  const downloadExcel = (jsonData, fileName) => {
    if (!jsonData || jsonData.length === 0) return;
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
    // Write and download
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7fa' }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
          <i className="icon-loader" style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }}></i>
          Loading Reports...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
          <div className="main-content">
              
              {/* Header Title */}
              <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Analytics Dashboard</h2>
                  <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '14px' }}>Business performance overview for {new Date().getFullYear()}</p>
                </div>
                <button 
                  onClick={fetchReports}
                  style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  <i className="icon-refresh-cw"></i> Refresh Data
                </button>
              </div>

              {/* Top Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue (Yearly)</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginTop: '10px' }}>{formatCurrency(totalYearlyRevenue)}</div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="icon-trending-up"></i> Healthy Growth
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In-Store Sales (Services & Products)</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginTop: '10px' }}>{formatCurrency(totalInStore)}</div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
                    From Walk-ins & Appointments
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Online Sales</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginTop: '10px' }}>{formatCurrency(totalOnline)}</div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
                    From Website Orders
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
                
                {/* Yearly Revenue Chart */}
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Monthly Revenue Breakdown</h3>
                    <button 
                      onClick={() => downloadExcel(data.yearlyReport, 'Yearly_Revenue_Report')}
                      style={{ fontSize: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                    >
                      <i className="icon-download"></i> Excel
                    </button>
                  </div>
                  <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.yearlyReport} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(value) => formatCurrency(value)} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="inStoreRevenue" name="In-Store Sales" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="onlineRevenue" name="Online Sales" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Staff Performance Pie Chart */}
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>Revenue by Staff</h3>
                  {data.staffReports.length > 0 ? (
                    <div style={{ flex: 1, position: 'relative' }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.staffReports}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="totalRevenue"
                            nameKey="staffName"
                          >
                            {data.staffReports.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        {data.staffReports.slice(0, 6).map((staff, idx) => (
                           <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}></span>
                              {staff.staffName || 'Unknown'} - {formatCurrency(staff.totalRevenue)}
                           </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No staff data available.</div>
                  )}
                </div>

              </div>

              {/* Bottom Tables */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                
                {/* Staff Details Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Staff Performance Details</h3>
                        <button 
                          onClick={() => downloadExcel(data.staffReports, 'Staff_Performance_Report')}
                          style={{ fontSize: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                        >
                          <i className="icon-download"></i> Excel
                        </button>
                    </div>
                    <div style={{ padding: '0 25px 25px' }}>
                        {data.staffReports.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No services recorded yet.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopLeftRadius: '8px', borderLeft: 'none', borderRight: 'none' }}>Staff Member</th>
                                        <th style={{ textAlign: 'center', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderLeft: 'none', borderRight: 'none' }}>Services</th>
                                        <th style={{ textAlign: 'right', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopRightRadius: '8px', borderLeft: 'none', borderRight: 'none' }}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.staffReports.map((staff, i) => (
                                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>{staff.staffName || 'Unassigned'}</td>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', color: '#475569', textAlign: 'center', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>
                                                <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px' }}>{staff.totalServices}</span>
                                            </td>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', fontWeight: '700', color: '#10b981', textAlign: 'right', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>{formatCurrency(staff.totalRevenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Products Sold Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Product Sales Details</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <button 
                            onClick={() => downloadExcel(data.productReports, 'Product_Sales_Report')}
                            style={{ fontSize: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                          >
                            <i className="icon-download"></i> Excel
                          </button>
                          <div style={{ fontSize: '12px', color: '#8b5cf6', backgroundColor: '#EDE9FE', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>Store & Online</div>
                        </div>
                    </div>
                    <div style={{ padding: '0 25px 25px' }}>
                        {data.productReports.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No product sales recorded yet.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopLeftRadius: '8px', borderLeft: 'none', borderRight: 'none' }}>Product / Service</th>
                                        <th style={{ textAlign: 'center', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderLeft: 'none', borderRight: 'none' }}>Sold</th>
                                        <th style={{ textAlign: 'right', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopRightRadius: '8px', borderLeft: 'none', borderRight: 'none' }}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.productReports.map((prod, i) => (
                                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>
                                                {prod.productName === 'Online Orders Summary' ? (
                                                    <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <i className="icon-globe"></i> Online Store Orders
                                                    </span>
                                                ) : (
                                                    prod.productName
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', color: '#475569', textAlign: 'center', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>
                                                <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px' }}>{prod.totalQuantity}</span>
                                            </td>
                                            <td style={{ padding: '16px 15px', fontSize: '14px', fontWeight: '700', color: '#3b82f6', textAlign: 'right', borderBottom: '1px solid #f1f5f9', borderLeft: 'none', borderRight: 'none' }}>{formatCurrency(prod.totalRevenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

              </div>

              {/* Detailed Transaction Log */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', marginBottom: '30px' }}>
                  <div style={{ padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Detailed Transaction Log</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Granular view of last 200 items sold / services performed</p>
                      </div>
                      <button 
                        onClick={() => downloadExcel(data.detailedTransactions, 'Detailed_Transaction_Log')}
                        style={{ padding: '10px 20px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#fff', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                      >
                        <i className="icon-download"></i> Download Full Detailed Excel
                      </button>
                  </div>
                  <div style={{ padding: '0 25px 25px', overflowX: 'auto' }}>
                      {data.detailedTransactions.length === 0 ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No detailed transactions found.</div>
                      ) : (
                          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: '20px', minWidth: '900px' }}>
                              <thead>
                                  <tr>
                                      <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopLeftRadius: '8px' }}>Date</th>
                                      <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>Customer</th>
                                      <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>Item / Service</th>
                                      <th style={{ textAlign: 'center', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>Qty</th>
                                      <th style={{ textAlign: 'left', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>Staff</th>
                                      <th style={{ textAlign: 'center', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>Source</th>
                                      <th style={{ textAlign: 'right', padding: '12px 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', borderBottom: '2px solid #f1f5f9', background: '#f8fafc', borderTopRightRadius: '8px' }}>Amount</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {data.detailedTransactions.map((tx, i) => (
                                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                                              {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                          </td>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{tx.customerName}</td>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{tx.itemName}</td>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', color: '#475569', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>{tx.quantity}</td>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>
                                              {tx.staffName !== 'N/A' ? tx.staffName : <span style={{ color: '#94a3b8' }}>-</span>}
                                          </td>
                                          <td style={{ padding: '14px 15px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                              <span style={{ 
                                                fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                                                backgroundColor: tx.source === 'Online' ? '#e0f2fe' : '#f1f5f9',
                                                color: tx.source === 'Online' ? '#0369a1' : '#64748b'
                                              }}>
                                                {tx.source}
                                              </span>
                                          </td>
                                          <td style={{ padding: '14px 15px', fontSize: '13px', fontWeight: '700', color: '#1e293b', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{formatCurrency(tx.amount)}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
