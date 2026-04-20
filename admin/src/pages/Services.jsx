import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'women', 'men'
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    gender: 'women',
    items: [{ name: '', price: '', duration: '', varieties: [] }]
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_ADMIN_API_URL + '/api/services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    if (field === 'price' && Number(value) < 0) return;
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', price: '', duration: '' }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, items: newItems }))
    }
  }

  const handleVarietyChange = (itemIndex, varietyIndex, field, value) => {
    const newItems = [...formData.items]
    if (!newItems[itemIndex].varieties) newItems[itemIndex].varieties = []
    newItems[itemIndex].varieties[varietyIndex][field] = value
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addVariety = (itemIndex) => {
    const newItems = [...formData.items]
    if (!newItems[itemIndex].varieties) newItems[itemIndex].varieties = []
    newItems[itemIndex].varieties.push({ vname: '', vprice: '' })
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const removeVariety = (itemIndex, varietyIndex) => {
    const newItems = [...formData.items]
    newItems[itemIndex].varieties = newItems[itemIndex].varieties.filter((_, i) => i !== varietyIndex)
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingService 
      ? `${import.meta.env.VITE_ADMIN_API_URL}/api/services/${editingService.sid}`
      : import.meta.env.VITE_ADMIN_API_URL + '/api/services'
    const method = editingService ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          gender: formData.gender,
          items: formData.items
        })
      })

      if (response.ok) {
        setShowForm(false)
        fetchServices()
        alert(editingService ? 'Service updated!' : 'Service added!')
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      subtitle: service.subtitle || '',
      gender: service.gender,
      items: service.items.map(item => ({ 
        ...item, 
        varieties: item.varieties ? item.varieties.map(v => ({ ...v })) : [] 
      }))
    })
    setShowForm(true)
  }

  const handleDelete = async (sid) => {
    if (window.confirm('Are you sure you want to delete this service category?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/services/${sid}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchServices()
          alert('Service deleted!')
        }
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
                  
                  {/* Header Section */}
                  <div className="flex items-center flex-wrap justify-between gap20 mb-30" style={{borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
                    <div>
                      <h3 style={{fontSize: '24px', fontWeight: '600', color: '#333'}}>
                        {showForm ? (editingService ? 'Edit Service Category' : 'Add New Category') : 'Services Management'}
                      </h3>
                      <p style={{color: '#888', marginTop: '5px'}}>Manage your salon's service menu and pricing</p>
                    </div>
                    <div className="breadcrumbs flex items-center gap10">
                      <Link to="/" style={{color: '#666', textDecoration: 'none'}}>Dashboard</Link>
                      <span>/</span>
                      <Link to="/services" style={{color: '#333', fontWeight: '500', textDecoration: 'none'}}>Services</Link>
                    </div>
                  </div>
                  
                  {/* Tab Navigation */}
                  {!showForm && (
                    <div className="flex items-center gap20 mb-30" style={{borderBottom: '1px solid #f0f0f0'}}>
                      <button 
                        onClick={() => setActiveTab('all')}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          background: 'none',
                          color: activeTab === 'all' ? '#0052cc' : '#888',
                          fontWeight: '600',
                          borderBottom: activeTab === 'all' ? '2px solid #0052cc' : '2px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        All Services
                      </button>
                      <button 
                        onClick={() => setActiveTab('women')}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          background: 'none',
                          color: activeTab === 'women' ? '#d6336c' : '#888',
                          fontWeight: '600',
                          borderBottom: activeTab === 'women' ? '2px solid #d6336c' : '2px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        For Women
                      </button>
                      <button 
                        onClick={() => setActiveTab('men')}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          background: 'none',
                          color: activeTab === 'men' ? '#228be6' : '#888',
                          fontWeight: '600',
                          borderBottom: activeTab === 'men' ? '2px solid #228be6' : '2px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        For Men
                      </button>
                    </div>
                  )}

                  {!showForm ? (
                    <>
                      <div className="flex justify-between items-center mb-30">
                        <h4 style={{fontSize: '18px', color: '#555'}}>{services.length} Categories Found</h4>
                        <button onClick={() => { 
                          setEditingService(null); 
                          setFormData({ title: '', subtitle: '', gender: 'women', items: [{ name: '', price: '', duration: '' }] });
                          setShowForm(true); 
                        }} style={{
                          backgroundColor: '#2ecc71',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
                        }}>
                          <i className="icon-plus"></i> Add New Category
                        </button>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '25px'
                      }}>
                        {services
                          .filter(s => activeTab === 'all' ? true : s.gender === activeTab)
                          .sort((a, b) => b.gender.localeCompare(a.gender)) // Group by gender
                          .length === 0 ? (
                          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '15px', border: '1px dashed #ccc'}}>
                            <i className="icon-layers" style={{fontSize: '48px', color: '#ddd', display: 'block', marginBottom: '15px'}}></i>
                            <p style={{color: '#999', fontSize: '16px'}}>No services found in this category.</p>
                          </div>
                        ) : (
                          services
                            .filter(s => activeTab === 'all' ? true : s.gender === activeTab)
                            .sort((a, b) => b.gender.localeCompare(a.gender))
                            .map((service) => (
                            <div key={service.sid} style={{
                              backgroundColor: '#fff',
                              borderRadius: '12px',
                              padding: '24px',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                              border: '1px solid #f0f0f0',
                              transition: 'all 0.3s ease'
                            }}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  textTransform: 'uppercase',
                                  padding: '5px 12px',
                                  borderRadius: '20px',
                                  letterSpacing: '1px',
                                  backgroundColor: service.gender === 'women' ? '#fff0f6' : '#e7f5ff',
                                  color: service.gender === 'women' ? '#d6336c' : '#228be6'
                                }}>
                                  {service.gender}
                                </span>
                                <div style={{display: 'flex', gap: '8px'}}>
                                  <button onClick={() => handleEdit(service)} style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #eee', background: '#fff', cursor: 'pointer', color: '#666'
                                  }} title="Edit"><i className="icon-edit-3"></i></button>
                                  <button onClick={() => handleDelete(service.sid)} style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', color: '#ef4444'
                                  }} title="Delete"><i className="icon-trash-2"></i></button>
                                </div>
                              </div>
                              <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px'}}>
                                <div>
                                  <h4 style={{fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#1a1a1a'}}>{service.title}</h4>
                                  <p style={{fontSize: '13px', color: '#666', margin: 0}}>{service.subtitle}</p>
                                </div>
                              </div>
                              
                              <div style={{borderTop: '1px solid #f8f9fa', paddingTop: '15px', marginTop: '15px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#999'}}>
                                    <i className="icon-check-circle" style={{fontSize: '16px'}}></i>
                                    <span style={{fontSize: '13px'}}>{service.items.length} Service Items</span>
                                  </div>
                                  <span style={{fontSize: '12px', color: '#ccc'}}>Latest update</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{backgroundColor: '#fff', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee'}}>
                      <form onSubmit={handleSubmit}>
                        <div style={{display: 'flex', gap: '30px', marginBottom: '30px', flexWrap: 'wrap'}}>
                          <div style={{flex: '1', minWidth: '250px'}}>
                            <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Category Title *</label>
                            <input name="title" value={formData.title} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} placeholder="e.g. Hair Artistry" required />
                          </div>
                          <div style={{flex: '1', minWidth: '250px'}}>
                            <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Subtitle</label>
                            <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} placeholder="e.g. Precision Cuts & Color" />
                          </div>
                          <div style={{flex: '0 0 200px'}}>
                            <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Gender Category *</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff'}}>
                              <option value="women">For Women</option>
                              <option value="men">For Men</option>
                            </select>
                          </div>
                        </div>

                        <div style={{marginTop: '40px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <h5 style={{fontSize: '18px', fontWeight: '700', color: '#333'}}>Service Items</h5>
                            <button type="button" onClick={addItem} style={{
                              padding: '8px 16px', borderRadius: '6px', border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                            }}>+ Add Service Item</button>
                          </div>

                          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {formData.items.map((item, index) => (
                              <div key={index} style={{background: '#fcfcfc', padding: '25px', borderRadius: '15px', border: '1px solid #f0f0f0'}}>
                                <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px'}}>
                                  <div style={{flex: '3'}}>
                                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '5px', display: 'block'}}>Item Name</label>
                                    <input value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eee'}} placeholder="e.g. Global Hair Color" required />
                                  </div>
                                  <div style={{flex: '1'}}>
                                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '5px', display: 'block'}}>Duration</label>
                                    <input value={item.duration} onChange={(e) => handleItemChange(index, 'duration', e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eee'}} placeholder="e.g. 90 min" required />
                                  </div>
                                    <div style={{flex: '1'}}>
                                      <label style={{fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '5px', display: 'block'}}>Base Price (₹)</label>
                                      <input value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eee'}} placeholder="e.g. 3000" required />
                                    </div>
                                  <div style={{paddingTop: '20px'}}>
                                    <button type="button" onClick={() => removeItem(index)} style={{
                                      width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#fff', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>×</button>
                                  </div>
                                </div>

                                {/* Varieties Section */}
                                <div style={{marginLeft: '30px', paddingLeft: '20px', borderLeft: '2px dashed #eee'}}>
                                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                    <span style={{fontSize: '13px', fontWeight: '600', color: '#666'}}>Varieties / Options (Optional)</span>
                                    <button type="button" onClick={() => addVariety(index)} style={{fontSize: '12px', background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontWeight: '700'}}>+ Add Variety</button>
                                  </div>
                                  
                                  {item.varieties && item.varieties.map((v, vIdx) => (
                                    <div key={vIdx} style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center'}}>
                                      <input 
                                        value={v.vname} 
                                        onChange={(e) => handleVarietyChange(index, vIdx, 'vname', e.target.value)} 
                                        style={{flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #eee', fontSize: '13px'}} 
                                        placeholder="Variety Name (e.g. Premium)" 
                                      />
                                      <input 
                                        value={v.vprice} 
                                        onChange={(e) => handleVarietyChange(index, vIdx, 'vprice', e.target.value)} 
                                        style={{flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #eee', fontSize: '13px'}} 
                                        placeholder="Price" 
                                      />
                                      <button type="button" onClick={() => removeVariety(index, vIdx)} style={{background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer'}}>
                                        <i className="icon-trash-2" style={{fontSize: '14px'}}></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px'}}>
                          <button type="button" onClick={() => setShowForm(false)} style={{
                            padding: '12px 30px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontWeight: '600'
                          }}>Cancel</button>
                          <button type="submit" style={{
                            padding: '12px 40px', borderRadius: '8px', border: 'none', background: '#0052cc', color: '#fff', cursor: 'pointer', fontWeight: '700'
                          }}>{editingService ? 'Update Category' : 'Save Category'}</button>
                        </div>
                      </form>
                    </div>
                  )}

        </div>
      </div>
    </>
  )
}

export default AdminServices
