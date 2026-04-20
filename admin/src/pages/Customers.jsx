import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", phone: "", email: "", gender: "", 
    birthday: "", anniversary: "", notes: "", membershipStatus: "Inactive" 
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/customers`);
      setCustomers(res.data);
      if (res.data.length > 0 && !selectedCustomer) {
        setSelectedCustomer(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerInvoices = async (id) => {
    try {
      setInvoicesLoading(true);
      const res = await axios.get(`http://localhost:5001/api/customers/${id}/invoices`);
      setCustomerInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setInvoicesLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerInvoices(selectedCustomer._id);
    }
  }, [selectedCustomer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ 
        name: customer.name, 
        phone: customer.phone, 
        email: customer.email || "", 
        gender: customer.gender || "", 
        birthday: customer.birthday || "", 
        anniversary: customer.anniversary || "", 
        notes: customer.notes || "", 
        membershipStatus: customer.membershipStatus || "Inactive" 
      });
    } else {
      setEditingCustomer(null);
      setFormData({ 
        name: "", phone: "", email: "", gender: "", 
        birthday: "", anniversary: "", notes: "", membershipStatus: "Inactive" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await axios.put(`http://localhost:5001/api/customers/${editingCustomer._id}`, formData);
      } else {
        await axios.post(`http://localhost:5001/api/customers`, formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <div className="main-content-inner" style={{ padding: 0 }}>
        <div className="main-content-wrap" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', height: 'calc(100vh - 30px)', overflow: 'hidden' }}>
                    
                    {/* Left Sidebar List */}
                    <div style={{ width: '350px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ position: 'relative' }}>
                          <i className="icon-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}></i>
                          <input 
                            type="text" 
                            placeholder={`Search out of ${customers.length} entries`} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1.5px solid #3b82f6', fontSize: '14px', outline: 'none' }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredCustomers.map(customer => (
                          <div 
                            key={customer._id} 
                            onClick={() => setSelectedCustomer(customer)}
                            style={{ 
                              padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s',
                              backgroundColor: selectedCustomer?._id === customer._id ? '#eff6ff' : 'transparent',
                              display: 'flex', alignItems: 'center', gap: '15px'
                            }}
                          >
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #3b82f6', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#3b82f6' 
                            }}>
                              {getInitials(customer.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111827', textTransform: 'uppercase' }}>{customer.name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{customer.phone}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Detail View */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfe', overflowY: 'auto', height: '100%' }}>
                      {selectedCustomer ? (
                        <>
                          {/* Top Header */}
                          <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f3f4f6' }}>
                            <button onClick={() => openModal()} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Add new</button>
                          </div>

                          <div style={{ padding: '40px', display: 'flex', gap: '40px' }}>
                            
                            {/* Profile Summary Card */}
                            <div style={{ width: '280px', flexShrink: 0 }}>
                              <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '30px', textAlign: 'center', position: 'relative' }}>
                                <div style={{ 
                                  width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #3b82f6', 
                                  margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#3b82f6' 
                                }}>
                                  {getInitials(selectedCustomer.name)}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase' }}>{selectedCustomer.name}</h4>
                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                   <button onClick={() => openModal(selectedCustomer)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #bfdbfe', background: '#fff', color: '#3b82f6', cursor: 'pointer' }}><i className="icon-edit-3" style={{ fontSize: '12px' }}></i></button>
                                   <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #fecaca', background: '#fff', color: '#ef4444', cursor: 'pointer' }}><i className="icon-trash-2" style={{ fontSize: '12px' }}></i></button>
                                </div>
                              </div>

                              <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                {['Profile', 'Transactions'].map(tab => (
                                  <div 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)}
                                    style={{ 
                                      padding: '15px 25px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: activeTab === tab ? '#1e40af' : '#6b7280',
                                      backgroundColor: activeTab === tab ? '#eff6ff' : '#fff', transition: 'all 0.2s',
                                      borderLeft: activeTab === tab ? '4px solid #3b82f6' : '4px solid transparent',
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                  >
                                    {tab}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Content Area */}
                            <div style={{ flex: 1 }}>
                              {activeTab === 'Profile' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                  <section>
                                    <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '25px' }}>Personal data</h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Full Name</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.name}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Mobile</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>+91 {selectedCustomer.phone}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>email</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.email || "-"}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Gender</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.gender || "-"}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Birthday</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.birthday || "-"}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Promotional SMS</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.promotionalSMS ? "ON" : "OFF"}</div>
                                    </div>
                                  </section>

                                  <section>
                                    <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '25px' }}>Membership</h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Status</div>
                                      <div style={{ color: selectedCustomer.membershipStatus === 'Active' ? '#059669' : '#64748b', fontSize: '14px', fontWeight: '700' }}>{selectedCustomer.membershipStatus}</div>
                                    </div>
                                  </section>

                                  <section>
                                    <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '15px' }}>Past Activity</h5>
                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>Showing last 5 transactions...</div>
                                    {/* Brief transaction list could go here */}
                                  </section>
                                </div>
                              ) : activeTab === 'Transactions' ? (
                                <div>
                                   <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '25px' }}>Transaction History</h5>
                                   {invoicesLoading ? (
                                     <div style={{ padding: '20px', textAlign: 'center' }}>Loading invoices...</div>
                                   ) : customerInvoices.length === 0 ? (
                                     <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>
                                        No transactions found for this customer.
                                     </div>
                                   ) : (
                                     <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                                       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                         <thead style={{ backgroundColor: '#f8fafc' }}>
                                           <tr>
                                             <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Invoice #</th>
                                             <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Date</th>
                                             <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Amount</th>
                                             <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Status</th>
                                           </tr>
                                         </thead>
                                         <tbody>
                                           {customerInvoices.map(inv => (
                                             <tr key={inv._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                               <td 
                                                 onClick={() => navigate('/invoices', { state: { viewInvoiceId: inv._id } })}
                                                 style={{ padding: '12px 20px', fontSize: '13px', color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                                               >
                                                 {inv.invoiceNumber}
                                               </td>
                                               <td style={{ padding: '12px 20px', fontSize: '13px', color: '#475569' }}>{new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                               <td style={{ padding: '12px 20px', fontSize: '13px', color: '#1e293b', fontWeight: '700' }}>₹ {inv.total.toLocaleString()}</td>
                                               <td style={{ padding: '12px 20px' }}>
                                                 <span style={{ 
                                                   padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700',
                                                   backgroundColor: inv.status === 'Paid' ? '#ecfdf5' : '#eff6ff',
                                                   color: inv.status === 'Paid' ? '#059669' : '#2563eb'
                                                 }}>
                                                   {inv.status}
                                                 </span>
                                               </td>
                                             </tr>
                                           ))}
                                         </tbody>
                                       </table>
                                     </div>
                                   )}
                                </div>
                              ) : (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{activeTab} feature coming soon...</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                           <i className="icon-users" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.2 }}></i>
                           <div style={{ fontSize: '18px', fontWeight: '600' }}>Select a customer to view details</div>
                        </div>
                      )}
                    </div>

                  </div>
        </div>
      </div>

      {/* Modern Modal for Add/Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '40px', 
            width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>
                {editingCustomer ? "Edit Customer Details" : "Create New Customer"}
              </h4>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#94a3b8' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>FULL NAME *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>PHONE NUMBER *</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>EMAIL</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>GENDER</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>BIRTHDAY</label>
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>ANNIVERSARY</label>
                  <input type="date" name="anniversary" value={formData.anniversary} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>NOTES</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', height: '80px', outline: 'none', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: '700', color: '#64748b' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: '800' }}>
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
