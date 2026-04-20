import React, { useState, useEffect } from "react";
import axios from "axios";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", phone: "", email: "", designation: "", 
    services: [], status: "Active",
    leaveStartDate: "", leaveEndDate: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, servicesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/staff`),
        axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/services`)
      ]);
      
      setStaffList(staffRes.data);
      
      // Flatten services for the multi-select/tags
      const flattenedServices = [];
      servicesRes.data.forEach(cat => {
        if (cat.items) {
          cat.items.forEach(item => {
            flattenedServices.push(item.name);
          });
        }
      });
      setServices(flattenedServices);

      if (staffRes.data.length > 0 && !selectedMember) {
        setSelectedMember(staffRes.data[0]);
      }
    } catch (err) {
      console.error("Error fetching staff data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceToggle = (serviceName) => {
    const updatedServices = formData.services.includes(serviceName)
      ? formData.services.filter(s => s !== serviceName)
      : [...formData.services, serviceName];
    setFormData({ ...formData, services: updatedServices });
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ 
        name: member.name, 
        phone: member.phone, 
        email: member.email || "", 
        designation: member.designation, 
        services: member.services || [],
        status: member.status || "Active",
        leaveStartDate: member.leaveStartDate || "",
        leaveEndDate: member.leaveEndDate || ""
      });
      setImageFile(null);
      setImagePreview(member.image || "");
    } else {
      setEditingMember(null);
      setFormData({ 
        name: "", phone: "", email: "", designation: "", 
        services: [], status: "Active",
        leaveStartDate: "", leaveEndDate: ""
      });
      setImageFile(null);
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'services') {
          // send services as JSON string
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) data.append('image', imageFile);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editingMember) {
        await axios.put(`${import.meta.env.VITE_ADMIN_API_URL}/api/staff/${editingMember._id}`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_ADMIN_API_URL}/api/staff`, data, config);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving staff:", err);
    }
  };

  const deleteStaff = async (id) => {
     if (window.confirm("Are you sure you want to delete this staff member?")) {
       try {
         await axios.delete(`${import.meta.env.VITE_ADMIN_API_URL}/api/staff/${id}`);
         if (selectedMember?._id === id) setSelectedMember(null);
         fetchData();
       } catch (err) {
         console.error("Error deleting staff:", err);
       }
     }
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <div className="main-content-inner" style={{ padding: 0 }}>
        <div className="main-content-wrap" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', height: 'calc(100vh - 30px)', overflow: 'hidden' }}>
                    
                    {/* Left Staff List */}
                    <div style={{ width: '350px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fff' }}>
                        <button 
                          onClick={() => openModal()} 
                          style={{ 
                            width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', 
                            padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer',
                            marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                          }}
                        >
                          <i className="icon-plus" style={{ fontSize: '14px' }}></i>
                          Add New Staff
                        </button>
                        <div style={{ position: 'relative' }}>
                          <i className="icon-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}></i>
                          <input 
                            type="text" 
                            placeholder="Search staff members..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1.5px solid #3b82f6', fontSize: '14px', outline: 'none' }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredStaff.map(member => (
                          <div 
                            key={member._id} 
                            onClick={() => setSelectedMember(member)}
                            style={{ 
                              padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s',
                              backgroundColor: selectedMember?._id === member._id ? '#eff6ff' : 'transparent',
                              display: 'flex', alignItems: 'center', gap: '15px'
                            }}
                          >
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #3b82f6', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#3b82f6' 
                            }}>
                              {getInitials(member.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: '#111827', textTransform: 'uppercase' }}>{member.name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{member.designation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Member Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfe', overflowY: 'auto', height: '100%' }}>
                      {selectedMember ? (
                        <>
                          <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f3f4f6', minHeight: '70px' }}>
                            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Staff Profile Details</div>
                          </div>

                          <div style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                              <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '30px', textAlign: 'center', width: '280px' }}>
                                <div style={{ 
                                  width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #3b82f6', 
                                  margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#3b82f6' 
                                }}>
                                  {getInitials(selectedMember.name)}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase' }}>{selectedMember.name}</h4>
                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                   <button onClick={() => openModal(selectedMember)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #bfdbfe', background: '#fff', color: '#3b82f6', cursor: 'pointer' }}><i className="icon-edit-3" style={{ fontSize: '12px' }}></i></button>
                                   <button onClick={() => deleteStaff(selectedMember._id)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #fecaca', background: '#fff', color: '#ef4444', cursor: 'pointer' }}><i className="icon-trash-2" style={{ fontSize: '12px' }}></i></button>
                                </div>
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                  <section>
                                    <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '25px' }}>Staff Metadata</h5>
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Designation</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedMember.designation}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Mobile</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>+91 {selectedMember.phone}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Email</div>
                                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedMember.email || "-"}</div>
                                      
                                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Work Status</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <div style={{ color: selectedMember.status === 'Active' ? '#059669' : selectedMember.status === 'On Leave' ? '#f59e0b' : '#64748b', fontSize: '14px', fontWeight: '700' }}>
                                          {selectedMember.status}
                                        </div>
                                        {selectedMember.status === 'On Leave' && selectedMember.leaveStartDate && (
                                          <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '600' }}>
                                            {selectedMember.leaveStartDate} to {selectedMember.leaveEndDate || "..."}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </section>

                                  <section>
                                    <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '20px' }}>Services Offered</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                      {selectedMember.services?.length > 0 ? (
                                        selectedMember.services.map((svc, idx) => (
                                          <span key={idx} style={{ padding: '6px 15px', borderRadius: '20px', backgroundColor: '#f0f7ff', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '12px', fontWeight: '700' }}>
                                            {svc}
                                          </span>
                                        ))
                                      ) : (
                                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>No services specifically assigned.</div>
                                      )}
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                           <i className="icon-user" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.2 }}></i>
                           <div style={{ fontSize: '18px', fontWeight: '600' }}>Select a staff member to view profiles</div>
                        </div>
                      )}
          </div>
        </div>
      </div>
    </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '40px', 
            width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h4 style={{ margin: '0 0 30px', fontSize: '20px', fontWeight: '800', color: '#1e40af' }}>
              {editingMember ? "Edit Staff Profile" : "Add New Staff Member"}
            </h4>
            
            <form onSubmit={handleSubmit}>
              {/* Profile Photo Upload */}
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 15px',
                  border: '3px dashed #cbd5e1', overflow: 'hidden', backgroundColor: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }} onClick={() => document.getElementById('staff-image-input').click()}>
                  {imagePreview ? (
                    <img src={imagePreview.startsWith('blob:') || imagePreview.startsWith('data:') ? imagePreview : `${import.meta.env.VITE_ADMIN_API_URL}/uploads/${imagePreview}`}
                      alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <i className="icon-camera" style={{ fontSize: '24px', color: '#94a3b8' }}></i>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>Upload</div>
                    </div>
                  )}
                </div>
                <input id="staff-image-input" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Click circle to upload profile photo</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>FULL NAME *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>DESIGNATION *</label>
                  <input type="text" name="designation" placeholder="e.g. Senior Stylist" value={formData.designation} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>PHONE NUMBER *</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>EMAIL</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>STATUS *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fff' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                {formData.status === 'On Leave' && (
                  <>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>LEAVE FROM</label>
                      <input type="date" name="leaveStartDate" value={formData.leaveStartDate} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>LEAVE UNTIL</label>
                      <input type="date" name="leaveEndDate" value={formData.leaveEndDate} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '25px', marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '12px' }}>SERVICES THEY OFFER</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {services.map(svc => (
                    <label key={svc} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes(svc)}
                        onChange={() => handleServiceToggle(svc)}
                      />
                      {svc}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '800' }}>Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;
