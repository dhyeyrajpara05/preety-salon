import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Category = () => {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    catname: '',
    catdesc: '',
    company: '',
    subcategories: []
  })
  const [subInput, setSubInput] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('All')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_ADMIN_API_URL + '/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert("Failed to fetch categories.")
    }
  }

  const handleDelete = async (catid) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/categories/${catid}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchCategories()
          alert("Category deleted successfully!")
        } else {
          alert("Failed to delete category.")
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert("Error occurred while deleting category.")
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddClick = () => {
    setEditingCategory(null)
    setFormData({ catname: '', catdesc: '', company: '', subcategories: [] })
    setShowForm(true)
  }

  const handleEditClick = (category) => {
    setEditingCategory(category)
    setFormData({
      catname: category.catname,
      catdesc: category.catdesc,
      company: category.company || '',
      subcategories: category.subcategories || []
    })
    setShowForm(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingCategory 
        ? `${import.meta.env.VITE_ADMIN_API_URL}/api/categories/${editingCategory.catid}` 
        : import.meta.env.VITE_ADMIN_API_URL + '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        fetchCategories()
        alert(editingCategory ? "Category updated successfully!" : "Category added successfully!")
      } else {
        alert("Failed to save category.")
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert("Error occurred while saving category.")
    }
  }

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
                  <div className="flex items-center flex-wrap justify-between gap20 mb-30" style={{borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
                    <h3 style={{fontSize: '24px', fontWeight: '600', color: '#333'}}>
                        {showForm ? (editingCategory ? 'Edit Category' : 'Add New Category') : 'Category Management'}
                    </h3>
                    <div className="breadcrumbs flex items-center gap10">
                        <Link to="/" style={{color: '#666', textDecoration: 'none'}}>Dashboard</Link>
                        <span>/</span>
                        <Link to="/category" style={{color: '#333', fontWeight: '500', textDecoration: 'none'}}>Categories</Link>
                    </div>
                  </div>
                  
                  {!showForm ? (
                    <div>
                        <div className="flex justify-between items-center mb-30" style={{gap: '20px', flexWrap: 'wrap'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <h4 style={{fontSize: '18px', color: '#555', margin: 0}}>{categories.length} Categories Found</h4>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px', backgroundColor: '#fff', padding: '5px 15px', borderRadius: '8px', border: '1px solid #ddd'}}>
                                    <label style={{fontSize: '13px', fontWeight: '600', color: '#666'}}>Filter by Company:</label>
                                    <select 
                                        value={selectedCompany} 
                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                        style={{border: 'none', outline: 'none', fontSize: '13px', color: '#333', cursor: 'pointer', fontWeight: '500'}}
                                    >
                                        <option value="All">All Companies</option>
                                        {[...new Set(categories.map(c => c.company || 'Generic'))].sort().map(company => (
                                            <option key={company} value={company}>{company}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleAddClick} style={{
                                backgroundColor: '#4CAF50', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>
                                Add New Category
                            </button>
                        </div>
                        
                        <div style={{
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '20px'
                        }}>
                            {categories
                                .filter(cat => selectedCompany === 'All' || (cat.company || 'Generic') === selectedCompany)
                                .length === 0 ? (
                                <p style={{textAlign: 'center', width: '100%', padding: '50px', color: '#888'}}>No categories found for the selected company.</p>
                            ) : (
                                categories
                                    .filter(cat => selectedCompany === 'All' || (cat.company || 'Generic') === selectedCompany)
                                    .map((cat) => (
                                    <div key={cat.catid} style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        border: '1px solid #eaeaea',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <h5 style={{fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#1a1a1a'}}>{cat.catname}</h5>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                                            <span style={{fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#3182ce', backgroundColor: '#ebf8ff', padding: '2px 8px', borderRadius: '4px'}}>
                                                {cat.company || 'Generic'}
                                            </span>
                                            <span style={{fontSize: '11px', color: '#a0aec0'}}>ID: {cat.catid}</span>
                                        </div>
                                        <p style={{fontSize: '14px', color: '#4a5568', marginBottom: '20px', flex: 1}}>{cat.catdesc || 'No description provided.'}</p>
                                        
                                        {cat.subcategories && cat.subcategories.length > 0 && (
                                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px'}}>
                                                {cat.subcategories.map((sub, i) => (
                                                    <span key={i} style={{fontSize: '11px', color: '#718096', background: '#f7fafc', padding: '2px 10px', borderRadius: '12px', border: '1px solid #edf2f7'}}>
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div style={{display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                                            <button onClick={() => handleEditClick(cat)} style={{
                                                flex: 1,
                                                padding: '8px',
                                                backgroundColor: '#f8f9fa',
                                                color: '#333',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(cat.catid)} style={{
                                                flex: 1,
                                                padding: '8px',
                                                backgroundColor: '#ffebee',
                                                color: '#d32f2f',
                                                border: '1px solid #ffcdd2',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                  ) : (
                    <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                                <div>
                                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Category Name *</label>
                                    <input 
                                        type="text" 
                                        name="catname" 
                                        value={formData.catname} 
                                        onChange={handleInputChange} 
                                        required 
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                        placeholder="Enter category name"
                                    />
                                </div>
                                
                                <div>
                                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Company / Brand</label>
                                    <input 
                                        type="text" 
                                        name="company" 
                                        value={formData.company} 
                                        onChange={handleInputChange} 
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                        placeholder="e.g. L'Oreal, Dyson"
                                    />
                                </div>

                                <div>
                                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Subcategories</label>
                                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                        <input 
                                            type="text" 
                                            value={subInput} 
                                            onChange={(e) => setSubInput(e.target.value)} 
                                            style={{flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                            placeholder="Add subcategory (e.g. Shampoo)"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (subInput.trim()) {
                                                        setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, subInput.trim()] }));
                                                        setSubInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (subInput.trim()) {
                                                    setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, subInput.trim()] }));
                                                    setSubInput('');
                                                }
                                            }}
                                            style={{padding: '0 15px', backgroundColor: '#f0f4f8', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563'}}
                                        >Add</button>
                                    </div>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                        {formData.subcategories.map((sub, i) => (
                                            <div key={i} style={{backgroundColor: '#e5e7eb', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151'}}>
                                                {sub}
                                                <span 
                                                    onClick={() => setFormData(prev => ({ ...prev, subcategories: prev.subcategories.filter((_, idx) => idx !== i) }))}
                                                    style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', lineHeight: '1'}}
                                                >×</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Description</label>
                                    <textarea 
                                        name="catdesc" 
                                        value={formData.catdesc} 
                                        onChange={handleInputChange} 
                                        rows="4"
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                                        placeholder="Describe the category..."
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                                <button type="button" onClick={() => setShowForm(false)} style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}>Cancel</button>
                                <button type="submit" style={{
                                    padding: '12px 30px',
                                    backgroundColor: '#0052cc',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>{editingCategory ? 'Update Category' : 'Save Category'}</button>
                            </div>
                        </form>
                    </div>
                  )}
        </div>
      </div>
    </>
  )
}

export default Category
