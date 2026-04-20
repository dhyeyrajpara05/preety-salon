import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/users`);
      setUsers(res.data);
      if (res.data.length > 0 && !selectedUser) {
        setSelectedUser(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async (id, currentStatus) => {
    try {
      const isBlocking = currentStatus !== 'blocked';
      const endpoint = isBlocking ? 'block' : 'unblock';
      await axios.put(`${import.meta.env.VITE_ADMIN_API_URL}/api/users/${id}/${endpoint}`);
      
      // Update local state to reflect change instantly
      setUsers(users.map(u => u._id === id ? { ...u, status: isBlocking ? 'blocked' : 'active'} : u));
      if (selectedUser && selectedUser._id === id) {
        setSelectedUser({ ...selectedUser, status: isBlocking ? 'blocked' : 'active'});
      }
    } catch (err) {
      console.error(`Error ${currentStatus !== 'blocked' ? 'blocking' : 'unblocking'} user:`, err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.uname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "U";
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
                            placeholder={`Search out of ${users.length} users`} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1.5px solid #3b82f6', fontSize: '14px', outline: 'none' }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No users found.</div>
                        ) : (
                          filteredUsers.map(user => (
                            <div 
                              key={user._id} 
                              onClick={() => setSelectedUser(user)}
                              style={{ 
                                padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s',
                                backgroundColor: selectedUser?._id === user._id ? '#eff6ff' : 'transparent',
                                display: 'flex', alignItems: 'center', gap: '15px'
                              }}
                            >
                              <div style={{ 
                                width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #3b82f6', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#3b82f6' 
                              }}>
                                {getInitials(user.uname)}
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#111827', textTransform: 'uppercase' }}>
                                    {user.uname}
                                    {user.status === 'blocked' && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#ef4444', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '4px'}}>BLOCKED</span>}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right Detail View */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfe', overflowY: 'auto', height: '100%' }}>
                      {selectedUser ? (
                        <>
                          <div style={{ padding: '40px', display: 'flex', gap: '40px' }}>
                            
                            {/* Profile Summary Card */}
                            <div style={{ width: '280px', flexShrink: 0 }}>
                              <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '30px', textAlign: 'center', position: 'relative' }}>
                                <div style={{ 
                                  width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #3b82f6', 
                                  margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#3b82f6' 
                                }}>
                                  {getInitials(selectedUser.uname)}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase' }}>{selectedUser.uname}</h4>
                                <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>User ID: {selectedUser.userid}</div>
                                
                                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => handleBlockUser(selectedUser._id, selectedUser.status)}
                                    style={{ 
                                        padding: '10px 20px', borderRadius: '8px', 
                                        backgroundColor: selectedUser.status === 'blocked' ? '#10b981' : '#ef4444', 
                                        color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer',
                                        width: '100%', transition: 'all 0.2s'
                                    }}
                                  >
                                    {selectedUser.status === 'blocked' ? 
                                        <><i className="icon-check-circle" style={{marginRight: '8px'}}></i> Unblock User</> : 
                                        <><i className="icon-slash" style={{marginRight: '8px'}}></i> Block User</>
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Content Area */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <section>
                                  <h5 style={{ fontSize: '16px', fontWeight: '800', color: '#1e40af', marginBottom: '25px' }}>Account Details</h5>
                                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Full Name</div>
                                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedUser.uname}</div>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Email Address</div>
                                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedUser.email}</div>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Phone / Contact</div>
                                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>{selectedUser.contact || "-"}</div>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Gender</div>
                                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700', textTransform: 'capitalize' }}>{selectedUser.gender || "-"}</div>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Account Status</div>
                                    <div style={{ 
                                        color: selectedUser.status === 'blocked' ? '#ef4444' : '#059669', 
                                        fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' 
                                    }}>
                                        {selectedUser.status || 'active'}
                                    </div>
                                    
                                    <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Joined On</div>
                                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700' }}>
                                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    
                                  </div>
                                </section>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                           <i className="icon-users" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.2 }}></i>
                           <div style={{ fontSize: '18px', fontWeight: '600' }}>Select a user to view details or manage access</div>
                        </div>
                      )}
                    </div>

                  </div>
        </div>
      </div>
    </>
  );
};

export default Users;
