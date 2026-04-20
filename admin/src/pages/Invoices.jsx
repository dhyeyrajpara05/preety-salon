import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Invoices = () => {
  const location = useLocation();
  // Styles for modern UI
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
    .invoice-row-hover-simple:hover {
      background-color: #f8fafc;
    }
  `;

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);


  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View State
  const [activeView, setActiveView] = useState('list'); // 'list' or 'builder'
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSelector, setActiveSelector] = useState(null); // 'services' or 'products'
  const [dateFilter, setDateFilter] = useState('All Time');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");

  
  // Create/Edit Invoice Form
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    newCustomerMode: false,
    date: new Date().toISOString().split('T')[0],
    items: [],
    discount: 0,
    paidAmount: 0,
    paymentMethod: "Cash",
    paymentBreakdown: { Cash: 0, Card: 0, UPI: 0 },
    notes: "",
    status: "Paid"
  });

  const [editingId, setEditingId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedCustomerMembership, setSelectedCustomerMembership] = useState(null);

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - formData.discount);
  const pendingAmount = Math.max(0, total - formData.paidAmount);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, custRes, servRes, prodRes, staffRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/invoices`),
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/customers`),
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/services`),
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/staff`)
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
      setStaff(staffRes.data.filter(s => s.status !== 'On Leave'));
      
      // Flatten services: each category has items array
      const flattenedServices = [];
      servRes.data.forEach(cat => {
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach(item => {
            flattenedServices.push({
              ...item,
              category: cat.title,
              _id: item._id || `${cat.sid}-${item.name}` // fallback id
            });
          });
        }
      });
      setServices(flattenedServices);
      
      setProducts(prodRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load invoices data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (invoices.length > 0 && location.state?.viewInvoiceId) {
      const targetInvoice = invoices.find(inv => inv._id === location.state.viewInvoiceId);
      if (targetInvoice) {
        openBuilder(targetInvoice, true);
      }
    }
  }, [invoices, location.state]);

  const openBuilder = (invoice = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (invoice) {
      setEditingId(invoice._id);
      setFormData({
        customerId: invoice.customerId?._id || invoice.customerId,
        customerName: invoice.customerName,
        customerPhone: invoice.customerPhone,
        newCustomerMode: false,
        date: new Date(invoice.date).toISOString().split('T')[0],
        items: [...invoice.items],
        discount: invoice.discount,
        paidAmount: invoice.paidAmount || invoice.total, 
        paymentMethod: invoice.paymentMethod || "Cash",
        paymentBreakdown: invoice.paymentBreakdown ? 
          invoice.paymentBreakdown.reduce((acc, curr) => ({ ...acc, [curr.method]: curr.amount }), { Cash: 0, Card: 0, UPI: 0 }) : 
          { Cash: (invoice.paymentMethod === 'Cash' ? invoice.paidAmount : 0), Card: (invoice.paymentMethod === 'Card' ? invoice.paidAmount : 0), UPI: (invoice.paymentMethod === 'UPI' ? invoice.paidAmount : 0) },
        status: invoice.status
      });
    } else {
      setEditingId(null);
      setSelectedCustomerMembership(null);
      setFormData({
        customerId: "",
        customerName: "",
        customerPhone: "",
        newCustomerMode: false,
        date: new Date().toISOString().split('T')[0],
        items: [],
        discount: 0,
        paidAmount: 0,
        paymentMethod: "Cash",
        paymentBreakdown: { Cash: 0, Card: 0, UPI: 0 },
        notes: "",
        status: "Paid"
      });
    }
    setActiveView('builder');
  };

  const closeBuilder = () => {
    setActiveView('list');
    setEditingId(null);
    setIsViewMode(false);
  };

  // Add a blank service item row
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { serviceName: "", price: 0, quantity: 1, amount: 0 }]
    });
  };

  // Remove a service item row
  const removeItemRow = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  // Handle changes in service rows
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const item = newItems[index];
    
    if (field === "serviceAuto") {
      // Auto-fill from selected service
      const selectedService = services.find(s => s._id === value);
      if (selectedService) {
        item.serviceName = selectedService.name;
        item.price = selectedService.price;
        item.amount = selectedService.price * item.quantity;
      }
    } else {
      item[field] = value;
      if (field === "price" || field === "quantity") {
        item.amount = Number(item.price) * Number(item.quantity);
      }
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleCustomerSelect = (e) => {
    const cid = e.target.value;
    if (cid === "NEW") {
      setSelectedCustomerMembership(null);
      setFormData({ ...formData, customerId: "", customerName: "", customerPhone: "", newCustomerMode: true, discount: 0 });
    } else {
      const cust = customers.find(c => c._id === cid);
      if (cust) {
        // Check if customer has active membership
        const isActiveMember = cust.membershipStatus === 'Active' && cust.membershipEndDate && new Date(cust.membershipEndDate) >= new Date();
        setSelectedCustomerMembership(isActiveMember ? cust : null);

        // Auto-apply 20% discount on services if member
        let updatedItems = formData.items;
        let autoDiscount = formData.discount;
        if (isActiveMember && formData.items.length > 0) {
          const discountPercent = cust.membershipPlanId?.discount || 20; // fallback to 20
          const discountMultiplier = (100 - discountPercent) / 100;
          
          updatedItems = formData.items.map(item => {
            if (item.type !== 'product') {
              const discountedPrice = Math.round(item.price * discountMultiplier);
              return { ...item, price: discountedPrice, amount: discountedPrice * item.quantity };
            }
            return item;
          });
        }

        setFormData({ 
          ...formData, 
          customerId: cust._id, 
          customerName: cust.name, 
          customerPhone: cust.phone, 
          newCustomerMode: false,
          items: updatedItems
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.items.length === 0) {
        alert("Please add at least one service/product to the invoice.");
        return;
      }

      let activeCustomerId = formData.customerId;

      // Create new customer first if needed
      if (formData.newCustomerMode) {
        const custRes = await axios.post(`${import.meta.env.VITE_ADMIN_API_URL}/api/customers`, {
          name: formData.customerName,
          phone: formData.customerPhone
        });
        activeCustomerId = custRes.data._id;
      }

      const invoicePayload = {
        customerId: activeCustomerId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        date: formData.date,
        items: formData.items,
        subtotal,
        discount: Number(formData.discount),
        total,
        paidAmount: Number(formData.paidAmount),
        pendingAmount: pendingAmount,
        paymentMethod: formData.paymentMethod,
        paymentBreakdown: formData.paymentMethod === 'Split' ? 
          Object.entries(formData.paymentBreakdown).map(([method, amount]) => ({ method, amount: Number(amount) })).filter(b => b.amount > 0) :
          [{ method: formData.paymentMethod, amount: Number(formData.paidAmount) }],
        notes: formData.notes,
        status: pendingAmount <= 0 ? "Paid" : (formData.paidAmount > 0 ? "Partially Paid" : "Unpaid")
      };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_ADMIN_API_URL}/api/invoices/${editingId}`, invoicePayload);
      } else {
        await axios.post(`${import.meta.env.VITE_ADMIN_API_URL}/api/invoices`, invoicePayload);
      }
      
      closeBuilder();
      fetchData();
    } catch (err) {
      console.error("Save invoice error:", err);
      alert("Failed to save invoice.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this invoice forever?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_ADMIN_API_URL}/api/invoices/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete invoice error:", err);
        alert("Failed to delete invoice.");
      }
    }
  };


  // Render the new Invoice Builder view (Split Pane)
  const renderInvoiceBuilder = () => {
    return (
      <div className="invoice-builder-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
        {/* Builder Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={closeBuilder} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
              <i className="icon-arrow-left"></i> Back
            </button>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>
              {isViewMode ? "View Invoice" : editingId ? `Edit Invoice` : "Create New Invoice"}
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isViewMode && (
              <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="icon-printer"></i> Print
              </button>
            )}
            <button onClick={closeBuilder} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>
              {isViewMode ? "Close" : "Cancel"}
            </button>
          </div>
        </div>

        {/* Builder Body Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 1fr)', gap: '20px', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '5px' }}>
            {/* Customer Details */}
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h5 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '700' }}>Customer Details</h5>
              {!isViewMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px' }}>
                    <select 
                      value={formData.newCustomerMode ? "NEW" : formData.customerId}
                      onChange={handleCustomerSelect}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${selectedCustomerMembership ? '#c9a96e' : '#e2e8f0'}`, fontSize: '14px', backgroundColor: '#f8fafc' }}
                    >
                      <option value="">-- Select Client --</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
                      <option value="NEW">+ New Walk-in Client</option>
                    </select>
                    <div>
                      <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #2563eb', fontWeight: '700', fontSize: '14px', color: '#2563eb', backgroundColor: '#eff6ff', outline: 'none' }} />
                    </div>
                  </div>
                  {selectedCustomerMembership && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fdf8f0', border: '1px solid #c9a96e', borderRadius: '8px', padding: '10px 15px' }}>
                      <span style={{ fontSize: '16px' }}>⭐</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#92400e' }}>
                          {selectedCustomerMembership.membershipPlanId?.planName || 'Member'} — {selectedCustomerMembership.membershipPlanId?.discount || 20}% Off on Services Applied Automatically
                        </div>
                        <div style={{ fontSize: '11px', color: '#a16207' }}>Membership valid until: {selectedCustomerMembership.membershipEndDate}</div>
                      </div>
                    </div>
                  )}
                  {(formData.newCustomerMode || formData.customerId) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Name</label>
                        <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: '600', fontSize: '15px' }} placeholder="Client Name" disabled={!formData.newCustomerMode} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Mobile</label>
                        <input type="text" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: '600', fontSize: '15px' }} placeholder="Client Phone" disabled={!formData.newCustomerMode} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="icon-user" style={{ fontSize: '20px', color: '#64748b' }}></i></div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '16px' }}>{formData.customerName}</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>{formData.customerPhone}</div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 15px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', fontWeight: '700', color: '#2563eb', fontSize: '14px' }}>
                    {new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>

            {/* Items List */}
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Items / Services <span style={{ color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', marginLeft: '5px' }}>{formData.items.length}</span></h5>
                {!isViewMode && <button onClick={() => { setActiveSelector('services'); setSelectorOpen(true); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>+ Add Services</button>}
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {formData.items.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                    <div style={{ backgroundColor: '#f8fafc', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}><i className="icon-scissors" style={{ color: '#94a3b8', fontSize: '24px' }}></i></div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>No items yet. Click "+ Add Services" to start.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formData.items.map((item, idx) => (
                      <div key={idx} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '4px', height: '30px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.serviceName}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {isViewMode ? (
                              <div style={{ fontWeight: '700' }}>₹ {item.amount.toLocaleString()}</div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '700', color: '#64748b' }}>₹</span>
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={e => handleItemChange(idx, 'price', e.target.value)}
                                  style={{ width: '80px', padding: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none', fontSize: '14px', textAlign: 'right' }}
                                />
                              </div>
                            )}
                            {!isViewMode && <button onClick={() => removeItemRow(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="icon-trash-2"></i></button>}
                          </div>
                        </div>
                        {/* Staff selector per service */}
                        {item.type !== 'product' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '16px' }}>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap' }}>Done by:</span>
                            {isViewMode ? (
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{item.staffName || '—'}</span>
                            ) : (
                              <select
                                value={item.staffId || ''}
                                onChange={e => {
                                  const sel = staff.find(s => s._id === e.target.value);
                                  const newItems = [...formData.items];
                                  newItems[idx] = { ...item, staffId: e.target.value, staffName: sel ? sel.name : '' };
                                  setFormData({ ...formData, items: newItems });
                                }}
                                style={{ fontSize: '13px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', background: '#f8fafc', flex: 1 }}
                              >
                                <option value=''>Select Staff</option>
                                {staff.map(s => <option key={s._id} value={s._id}>{s.name} — {s.designation || s.role || ''}</option>)}
                              </select>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto' }}>
            <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Checkout</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}><span style={{ color: '#64748b' }}>Sub total</span><span style={{ fontWeight: '700' }}>₹ {subtotal.toLocaleString()}</span></div>
              {!isViewMode ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><button style={{ border: 'none', background: 'none', color: '#2563eb', fontWeight: '600', padding: 0, fontSize: '14px' }}>+ Add discount</button><input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} style={{ width: '80px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: '700' }} /></div>
              ) : formData.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}><span style={{ color: '#64748b' }}>Discount</span><span style={{ fontWeight: '700', color: '#ef4444' }}>- ₹ {formData.discount.toLocaleString()}</span></div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '5px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}><span>Total Invoice amount</span><span>₹ {total.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}><span>Rounding off</span><span>₹ 0</span></div>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}><span>To collect</span><span>₹ {total.toLocaleString()}</span></div>
            </div>
            
            {/* Payment Collection Section */}
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                 <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>AMOUNT PAID</label>
                 {!isViewMode && (
                   <button 
                     onClick={() => setFormData({...formData, paidAmount: total})}
                     style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', background: '#eff6ff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                   >
                     Collect Full
                   </button>
                 )}
               </div>
               <div style={{ position: 'relative' }}>
                 <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#94a3b8' }}>₹</span>
                 <input 
                   type="number" 
                   value={formData.paidAmount} 
                   onChange={e => setFormData({...formData, paidAmount: parseFloat(e.target.value) || 0})} 
                   style={{ width: '100%', padding: '12px 12px 12px 30px', borderRadius: '10px', border: '1.5px solid #2563eb', fontWeight: '800', fontSize: '18px', color: '#2563eb', outline: 'none' }}
                   placeholder="0.00"
                   disabled={isViewMode}
                 />
               </div>
               {pendingAmount > 0 && (
                 <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                   <span style={{ color: '#ef4444' }}>BALANCE DUE</span>
                   <span style={{ color: '#ef4444' }}>₹ {pendingAmount.toLocaleString()}</span>
                 </div>
               )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>Payment method</label>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2px' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                   {['Cash', 'Card', 'UPI', 'Split'].map(m => (
                     <button 
                       key={m} 
                       type="button" 
                       onClick={() => {
                         if (isViewMode) return;
                         let newBreakdown = { Cash: 0, Card: 0, UPI: 0 };
                         if (m !== 'Split' && m !== 'Split') {
                           newBreakdown[m] = formData.paidAmount;
                         } else if (m === 'Split') {
                           // Keep current paidAmount or split it? Let's leave it to user
                         }
                         setFormData({...formData, paymentMethod: m, paymentBreakdown: newBreakdown});
                       }} 
                       style={{ 
                         padding: '10px 5px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: isViewMode ? 'default' : 'pointer', borderRadius: '10px', 
                         backgroundColor: formData.paymentMethod === m ? '#2563eb' : 'transparent', 
                         color: formData.paymentMethod === m ? '#fff' : '#64748b',
                         transition: 'all 0.2s'
                       }}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
              </div>

              {formData.paymentMethod === 'Split' && (
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#eff6ff', padding: '15px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#1e40af', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Split Breakdown</div>
                  {["Cash", "Card", "UPI"].map(m => (
                    <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '45px', fontSize: '12px', fontWeight: '700', color: '#1e40af' }}>{m}</span>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#60a5fa', fontSize: '12px' }}>₹</span>
                        <input 
                          type="number" 
                          value={formData.paymentBreakdown?.[m] || 0} 
                          disabled={isViewMode}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            const newBreakdown = { ...formData.paymentBreakdown, [m]: val };
                            const sum = Object.values(newBreakdown).reduce((a, b) => a + b, 0);
                            setFormData({ ...formData, paymentBreakdown: newBreakdown, paidAmount: sum });
                          }}
                          style={{ width: '100%', padding: '8px 8px 8px 25px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '14px', fontWeight: '700', color: '#1e40af', outline: 'none', backgroundColor: isViewMode ? 'transparent' : '#fff' }}
                        />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '5px', paddingTop: '10px', borderTop: '1px dashed #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af' }}>TOTAL SPLIT</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#1e40af' }}>₹ {formData.paidAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>Additional notes</label>
              <textarea placeholder="Write any notes here..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', height: '80px', resize: 'none' }} disabled={isViewMode} />
            </div>
            {!isViewMode && <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>Generate Invoice</button>}
          </div>
        </div>
        {selectorOpen && renderSelector()}
      </div>
    );
  };

  const renderSelector = () => {
    // Determine which list to show based on activeSelector state
    const currentList = activeSelector === 'services' ? services : products;
    const filteredList = currentList.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      if (activeSelector === 'services') {
        const inVarieties = item.varieties?.some(v => v.vname?.toLowerCase().includes(q) || v.vprice?.toString().toLowerCase().includes(q));
        return (item.name?.toLowerCase().includes(q)) || (item.category?.toLowerCase().includes(q)) || (item.price?.toString().toLowerCase().includes(q)) || inVarieties;
      } else {
        return (item.pname?.toLowerCase().includes(q)) || (item.company?.toLowerCase().includes(q)) || (item.pcategory?.toLowerCase().includes(q)) || (item.psubcategory?.toLowerCase().includes(q)) || (item.price?.toString().toLowerCase().includes(q));
      }
    });

    return (
      <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: '900px', backgroundColor: '#f8fafc', height: '100%', boxShadow: '-10px 0 25px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px' }}>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fff', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => setSelectorOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                <i className="icon-arrow-left"></i>
              </button>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Add Items</h4>
            </div>

            {/* Toggle Tabs */}
            <div style={{ display: 'flex', gap: '5px', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '12px' }}>
              <button 
                onClick={() => { setActiveSelector('services'); setSearchQuery(''); }}
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                  backgroundColor: activeSelector === 'services' ? '#fff' : 'transparent',
                  color: activeSelector === 'services' ? '#2563eb' : '#64748b',
                  boxShadow: activeSelector === 'services' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Services
              </button>
              <button 
                onClick={() => { setActiveSelector('products'); setSearchQuery(''); }}
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                  backgroundColor: activeSelector === 'products' ? '#fff' : 'transparent',
                  color: activeSelector === 'products' ? '#2563eb' : '#64748b',
                  boxShadow: activeSelector === 'products' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Products
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <i className="icon-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`Search ${activeSelector}...`} style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '15px' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase' }}>
                Available {activeSelector}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredList.map((item, idx) => {
                  const itemName = activeSelector === 'services' ? (item.name || 'Unnamed') : (item.company ? `${item.company} - ${item.pname}` : (item.pname || 'Unnamed'));
                  const itemPrice = item.price;
                  const hasVarieties = activeSelector === 'services' && item.varieties?.length > 0;
                  const parsedMinPrice = Number(String(itemPrice || '0').split('-')[0].replace(/[^0-9.]/g, '')) || 0;

                  return (
                    <div key={idx} style={{ padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '16px' }}>
                            {itemName} {!hasVarieties && ` - ₹${parsedMinPrice.toLocaleString()}`}
                          </div>
                          <div style={{ fontSize: '14px', color: '#64748b' }}>
                            {activeSelector === 'services' ? `${item.category || 'Service'} • ${item.duration || 0}` : `${item.company || 'Product'} • Stock: ${item.quantity || 0}`}
                          </div>
                        </div>
                        {!hasVarieties && (
                          <button 
                            onClick={() => {
                              const finalName = itemName;
                              const finalPrice = parsedMinPrice;
                              const existingIdx = formData.items.findIndex(i => i.serviceName === finalName);
                              
                              if (existingIdx > -1) {
                                handleItemChange(existingIdx, 'quantity', formData.items[existingIdx].quantity + 1);
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  items: [
                                    ...formData.items, 
                                    { serviceName: finalName, price: finalPrice, quantity: 1, amount: finalPrice }
                                  ] 
                                });
                              }
                            }}
                            style={{ padding: '8px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}
                          >
                            ADD
                          </button>
                        )}
                      </div>

                      {hasVarieties && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                          {item.varieties.map((v, vIdx) => (
                            <button 
                              key={vIdx}
                              onClick={() => {
                                const finalName = `${itemName} (${v.vname})`;
                                const finalPrice = Number(v.vprice.replace(/[^0-9.-]+/g,"")) || 0;
                                const existingIdx = formData.items.findIndex(i => i.serviceName === finalName);
                                
                                if (existingIdx > -1) {
                                  handleItemChange(existingIdx, 'quantity', formData.items[existingIdx].quantity + 1);
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    items: [
                                      ...formData.items, 
                                      { serviceName: finalName, price: finalPrice, quantity: 1, amount: finalPrice }
                                    ] 
                                  });
                                }
                              }}
                              style={{ flex: '1 1 120px', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
                            >
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{v.vname}</span>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>₹{v.vprice}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredList.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No {activeSelector} found {searchQuery ? `matching "${searchQuery}"` : ''}.</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cart Sidebar */}
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>
            <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Selection Cart</h5>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {formData.items.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '14px', marginTop: '10px', padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  Empty
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {formData.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.serviceName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>x{item.quantity}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb' }}>
                        ₹{item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: '700', color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: '800', fontSize: '18px' }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => setSelectorOpen(false)} 
                disabled={formData.items.length === 0} 
                style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: formData.items.length > 0 ? '#2563eb' : '#cbd5e1', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
                  
                  {activeView === 'list' && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                      {/* Modern Header Section */}
                      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                          <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Invoices</h2>
                            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Manage your collections and billing records</p>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                              onClick={() => openBuilder()}
                              style={{ 
                                backgroundColor: '#fff', color: '#111827', border: '1px solid #e2e8f0', padding: '12px 24px', 
                                borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', 
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                              }}
                              className="hover-lift"
                            >
                              <i className="icon-calendar" style={{ fontSize: '18px', color: '#2563eb' }}></i>
                              Past Invoice
                            </button>
                            <button 
                              onClick={() => openBuilder()}
                              style={{ 
                                backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', 
                                borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', 
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                              }}
                              className="hover-lift"
                            >
                              <i className="icon-plus" style={{ fontSize: '18px' }}></i>
                              Generate New
                            </button>
                          </div>
                        </div>

                        {/* Stats Summary Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                          {[
                            { label: 'Total Invoices', value: invoices.length, icon: 'icon-file-text', color: '#2563eb' },
                            { label: "Today's Revenue", value: `₹ ${invoices.filter(i => new Date(i.date).toDateString() === new Date().toDateString()).reduce((s, c) => s + c.total, 0).toLocaleString()}`, icon: 'icon-trending-up', color: '#10b981' },
                            { label: 'Pending Amount', value: `₹ ${invoices.filter(i => i.status !== 'Paid').reduce((s, c) => s + c.total, 0).toLocaleString()}`, icon: 'icon-clock', color: '#f59e0b' }
                          ].map((stat, i) => (
                            <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stat.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className={stat.icon} style={{ fontSize: '20px', color: stat.color }}></i>
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{stat.label}</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{stat.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Filter & Search Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '12px' }}>
                            <i className="icon-search" style={{ color: '#94a3b8' }}></i>
                            <input 
                              type="text" 
                              placeholder="Search invoice number or customer name..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', color: '#1e293b' }} 
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Filter:</span>
                              <div style={{ position: 'relative' }}>
                                <select 
                                  value={dateFilter} 
                                  onChange={(e) => setDateFilter(e.target.value)}
                                  style={{ padding: '8px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#1e293b', outline: 'none', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                                >
                                  <option>All Time</option>
                                  <option>Today</option>
                                  <option>Yesterday</option>
                                  <option>Last 7 Days</option>
                                  <option>Last 30 Days</option>
                                  <option>Custom</option>
                                </select>
                              </div>
                            </div>
                            {dateFilter === 'Custom' && (
                              <input 
                                type="date" 
                                value={customDate} 
                                onChange={(e) => setCustomDate(e.target.value)}
                                style={{ padding: '7px 12px', borderRadius: '10px', border: '1px solid #2563eb', fontSize: '13px', fontWeight: '600', color: '#2563eb', outline: 'none', backgroundColor: '#eff6ff' }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="wg-box" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', borderRadius: '20px', backgroundColor: '#fff' }}>

                        {loading ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading invoices...</div>
                        ) : error ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
                        ) : (() => {
                          const filtered = invoices.filter(inv => {
                            if (dateFilter === 'All Time') return true;
                            const invDate = new Date(inv.date);
                            const now = new Date();
                            
                            const isToday = (d) => d.toDateString() === now.toDateString();
                            const isYesterday = (d) => {
                              const yest = new Date();
                              yest.setDate(yest.getDate() - 1);
                              return d.toDateString() === yest.toDateString();
                            };

                            if (dateFilter === 'Today') return isToday(invDate);
                            if (dateFilter === 'Yesterday') return isYesterday(invDate);
                            
                            if (dateFilter === 'Last 7 Days') {
                              const cutoff = new Date();
                              cutoff.setDate(cutoff.getDate() - 7);
                              return invDate >= cutoff;
                            }
                            if (dateFilter === 'Last 30 Days') {
                              const cutoff = new Date();
                              cutoff.setDate(cutoff.getDate() - 30);
                              return invDate >= cutoff;
                            }
                            if (dateFilter === 'Custom' && customDate) {
                              return invDate.toDateString() === new Date(customDate).toDateString();
                            }
                            return true;
                          }).filter(inv => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            return (inv.invoiceNumber.toLowerCase().includes(q) || 
                                    inv.customerName.toLowerCase().includes(q) || 
                                    inv.customerPhone.toLowerCase().includes(q));
                          });


                          return filtered.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                              <i className="icon-file-text" style={{ fontSize: '48px', marginBottom: '15px', display: 'block', color: '#cbd5e1' }}></i>
                              <div style={{ fontSize: '16px', fontWeight: '500' }}>No invoices found for "{dateFilter}".</div>
                            </div>
                          ) : (
                            <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '10px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Invoice #</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Customer name</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Contact number</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Date <i className="icon-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i></th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Amount</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'right' }}></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filtered.map(invoice => (
                                    <tr key={invoice._id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} className="invoice-row-hover-simple">
                                      <td style={{ padding: '18px 20px', fontSize: '15px', color: '#475569' }}>{invoice.invoiceNumber}</td>
                                      <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>{invoice.customerName}</td>
                                      <td style={{ padding: '18px 20px', fontSize: '15px', color: '#475569' }}>{invoice.customerPhone}</td>
                                      <td style={{ padding: '18px 20px', fontSize: '15px', color: '#475569' }}>
                                        {new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(',', '')}
                                      </td>
                                      <td style={{ padding: '18px 20px', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>₹ {invoice.total.toLocaleString()}</td>
                                      <td style={{ padding: '18px 20px' }}>
                                        <span style={{ 
                                          padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                          backgroundColor: '#eff6ff', color: '#2563eb'
                                        }}>
                                          {invoice.status}
                                        </span>
                                      </td>
                                      <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                          <button onClick={() => openBuilder(invoice, true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }} title="View">
                                            <i className="icon-eye" style={{ fontSize: '18px' }}></i>
                                          </button>
                                          <button onClick={() => openBuilder(invoice)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#2563eb' }} title="Edit">
                                            <i className="icon-edit-3" style={{ fontSize: '18px' }}></i>
                                          </button>
                                          <button onClick={() => handleDelete(invoice._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444' }} title="Delete">
                                            <i className="icon-trash-2" style={{ fontSize: '18px' }}></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {activeView === 'builder' && renderInvoiceBuilder()}

        </div>
      </div>
    </>
  );
};

export default Invoices;
