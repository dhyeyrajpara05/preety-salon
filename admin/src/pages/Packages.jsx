import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const AdminPackages = () => {
  const [packages, setPackages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [formData, setFormData] = useState({
    pkname: '',
    pkprice: '',
    pkdesc: '',
    pkfeatures: [''],
    status: 'active'
  })
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/packages')
      const data = await response.json()
      setPackages(data)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'pkprice' && Number(value) < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.pkfeatures]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, pkfeatures: newFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      pkfeatures: [...prev.pkfeatures, '']
    }))
  }

  const removeFeature = (index) => {
    if (formData.pkfeatures.length > 1) {
      const newFeatures = formData.pkfeatures.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, pkfeatures: newFeatures }))
    }
  }

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingPackage 
      ? `http://localhost:5001/api/packages/${editingPackage.pkid}`
      : 'http://localhost:5001/api/packages'
    const method = editingPackage ? 'PUT' : 'POST'

    const data = new FormData()
    data.append('pkname', formData.pkname)
    data.append('pkprice', formData.pkprice)
    data.append('pkdesc', formData.pkdesc)
    data.append('pkfeatures', JSON.stringify(formData.pkfeatures))
    data.append('status', formData.status)
    if (selectedImage) {
      data.append('pkimg', selectedImage)
    }

    try {
      const response = await fetch(url, {
        method,
        body: data
      })

      if (response.ok) {
        setShowForm(false)
        setEditingPackage(null)
        setSelectedImage(null)
        fetchPackages()
        alert(editingPackage ? 'Package updated!' : 'Package added!')
      }
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      pkname: pkg.pkname,
      pkprice: pkg.pkprice,
      pkdesc: pkg.pkdesc,
      pkfeatures: pkg.pkfeatures.length > 0 ? [...pkg.pkfeatures] : [''],
      status: pkg.status
    })
    setShowForm(true)
  }

  const handleDelete = async (pkid) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/packages/${pkid}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchPackages()
          alert('Package deleted!')
        }
      } catch (error) {
        console.error('Error deleting package:', error)
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
                        {showForm ? (editingPackage ? 'Edit Package' : 'Add New Package') : 'Packages Management'}
                      </h3>
                      <p style={{color: '#888', marginTop: '5px'}}>Create and manage salon service packages</p>
                    </div>
                    <div className="breadcrumbs flex items-center gap10">
                      <Link to="/" style={{color: '#666', textDecoration: 'none'}}>Dashboard</Link>
                      <span>/</span>
                      <Link to="/packages" style={{color: '#333', fontWeight: '500', textDecoration: 'none'}}>Packages</Link>
                    </div>
                  </div>

                  {!showForm ? (
                    <>
                      <div className="flex justify-between items-center mb-30">
                        <h4 style={{fontSize: '18px', color: '#555'}}>{packages.length} Packages Found</h4>
                        <button onClick={() => { 
                          setEditingPackage(null); 
                          setFormData({ pkname: '', pkprice: '', pkdesc: '', pkfeatures: [''], status: 'active' });
                          setSelectedImage(null);
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
                          <i className="icon-plus"></i> Add New Package
                        </button>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '25px'
                      }}>
                        {packages.length === 0 ? (
                          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '15px', border: '1px dashed #ccc'}}>
                            <i className="icon-package" style={{fontSize: '48px', color: '#ddd', display: 'block', marginBottom: '15px'}}></i>
                            <p style={{color: '#999', fontSize: '16px'}}>No packages found. Create your first package!</p>
                          </div>
                        ) : (
                          packages.map((pkg) => (
                            <div key={pkg.pkid} style={{
                              backgroundColor: '#fff',
                              borderRadius: '12px',
                              padding: '0',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                              border: '1px solid #f0f0f0',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease'
                            }}>
                              <div style={{height: '180px', overflow: 'hidden', position: 'relative'}}>
                                <img 
                                  src={pkg.pkimg ? `http://localhost:5001${pkg.pkimg}` : 'https://placehold.co/600x400?text=No+Image'} 
                                  alt={pkg.pkname} 
                                  style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                                />
                                <div style={{
                                  position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'
                                }}>
                                  <button onClick={() => handleEdit(pkg)} style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', color: '#666'
                                  }} title="Edit"><i className="icon-edit-3"></i></button>
                                  <button onClick={() => handleDelete(pkg.pkid)} style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', color: '#ef4444'
                                  }} title="Delete"><i className="icon-trash-2"></i></button>
                                </div>
                                <span style={{
                                  position: 'absolute', bottom: '15px', left: '15px',
                                  fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px',
                                  backgroundColor: pkg.status === 'active' ? '#dcfce7' : '#fee2e2',
                                  color: pkg.status === 'active' ? '#166534' : '#991b1b',
                                  textTransform: 'uppercase'
                                }}>
                                  {pkg.status}
                                </span>
                              </div>
                              <div style={{padding: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                  <h4 style={{fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: '0'}}>{pkg.pkname}</h4>
                                  <span style={{fontSize: '18px', fontWeight: '800', color: '#0052cc'}}>₹{pkg.pkprice}</span>
                                </div>
                                <p style={{fontSize: '14px', color: '#666', marginBottom: '15px', lineClamp: '2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                  {pkg.pkdesc}
                                </p>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                  {pkg.pkfeatures.slice(0, 3).map((f, i) => (
                                    <span key={i} style={{fontSize: '11px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '10px', color: '#4b5563'}}>
                                      {f}
                                    </span>
                                  ))}
                                  {pkg.pkfeatures.length > 3 && (
                                    <span style={{fontSize: '11px', color: '#9ca3af'}}>+{pkg.pkfeatures.length - 3} more</span>
                                  )}
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
                          <div style={{flex: '1', minWidth: '300px'}}>
                            <div style={{marginBottom: '20px'}}>
                              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Package Name *</label>
                              <input name="pkname" value={formData.pkname} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} placeholder="e.g. Bridal Glow Package" required />
                            </div>
                            <div style={{marginBottom: '20px'}}>
                              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Price (₹) *</label>
                              <input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} name="pkprice" value={formData.pkprice} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} placeholder="e.g. 4999" required />
                            </div>
                            <div style={{marginBottom: '20px'}}>
                              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Status</label>
                              <select name="status" value={formData.status} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff'}}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                            <div style={{marginBottom: '20px'}}>
                              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Package Image</label>
                              <input type="file" onChange={handleImageChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}} accept="image/*" />
                              {editingPackage && !selectedImage && (
                                <p style={{fontSize: '12px', color: '#888', marginTop: '5px'}}>Current image: {editingPackage.pkimg}</p>
                              )}
                            </div>
                          </div>
                          <div style={{flex: '1', minWidth: '300px'}}>
                            <div style={{marginBottom: '20px'}}>
                              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Description *</label>
                              <textarea name="pkdesc" value={formData.pkdesc} onChange={handleInputChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '120px'}} placeholder="What's this package about?" required />
                            </div>
                            
                            <div>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <label style={{fontWeight: '600', color: '#444', margin: '0'}}>Package Features / Highlights</label>
                                <button type="button" onClick={addFeature} style={{
                                  padding: '5px 12px', borderRadius: '6px', border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer', fontSize: '12px'
                                }}>+ Add</button>
                              </div>
                              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {formData.pkfeatures.map((feature, index) => (
                                  <div key={index} style={{display: 'flex', gap: '10px'}}>
                                    <input 
                                      value={feature} 
                                      onChange={(e) => handleFeatureChange(index, e.target.value)} 
                                      style={{flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid #eee'}} 
                                      placeholder="Feature e.g. Full Facial" 
                                      required 
                                    />
                                    <button type="button" onClick={() => removeFeature(index)} style={{
                                      width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', cursor: 'pointer'
                                    }}>×</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px'}}>
                          <button type="button" onClick={() => setShowForm(false)} style={{
                            padding: '12px 30px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', fontWeight: '600'
                          }}>Cancel</button>
                          <button type="submit" style={{
                            padding: '12px 40px', borderRadius: '8px', border: 'none', background: '#0052cc', color: '#fff', cursor: 'pointer', fontWeight: '700'
                          }}>{editingPackage ? 'Update Package' : 'Create Package'}</button>
                        </div>
                      </form>
                    </div>
                  )}

        </div>
      </div>
    </>
  )
}

export default AdminPackages
