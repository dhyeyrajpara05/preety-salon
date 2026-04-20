import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Product = () => {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    pname: '',
    price: '',
    quantity: '',
    pdesc: '',
    pcategory: '',
    psubcategory: '',
    company: '',
    pimg: null
  })
  const [categories, setCategories] = useState([])
  const [previewImg, setPreviewImg] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert("Failed to fetch products.")
    }
  }

  const handleDelete = async (pid) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${pid}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchProducts()
          alert("Product deleted successfully!")
        } else {
          console.error('Failed to delete product')
          alert("Failed to delete product.")
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert("Error occurred while deleting product.")
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'price' && Number(value) < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, pimg: file }))
      setPreviewImg(URL.createObjectURL(file))
    }
  }

  const handleAddClick = () => {
    setEditingProduct(null)
    setFormData({ pname: '', price: '', quantity: '', pdesc: '', pcategory: '', psubcategory: '', company: '', pimg: null })
    setPreviewImg('')
    setShowForm(true)
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setFormData({
      pname: product.pname,
      price: product.price,
      quantity: product.quantity,
      pdesc: product.pdesc,
      pcategory: product.pcategory || '',
      psubcategory: product.psubcategory || '',
      company: product.company || '',
      pimg: null
    })
    setPreviewImg(product.pimg ? `http://localhost:5001${product.pimg}` : '')
    setShowForm(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    const data = new FormData()
    data.append('pname', formData.pname)
    data.append('price', formData.price)
    data.append('quantity', formData.quantity)
    data.append('pdesc', formData.pdesc)
    data.append('pcategory', formData.pcategory)
    data.append('psubcategory', formData.psubcategory)
    data.append('company', formData.company)
    if (formData.pimg) {
      data.append('pimg', formData.pimg)
    }

    try {
      const url = editingProduct 
        ? `http://localhost:5001/api/products/${editingProduct.pid}` 
        : 'http://localhost:5001/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (response.ok) {
        setShowForm(false)
        fetchProducts()
        alert(editingProduct ? "Product updated successfully!" : "Product added successfully!")
      } else {
        console.error('Failed to save product')
        alert("Failed to save product. Please check the backend connection.")
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert("Error occurred while saving product.")
    }
  }

  return (
    <>
      <div className="main-content-inner">
        <div className="main-content-wrap">
                  <div className="flex items-center flex-wrap justify-between gap20 mb-30" style={{borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
                    <h3 style={{fontSize: '24px', fontWeight: '600', color: '#333'}}>
                        {showForm ? (editingProduct ? 'Edit Product' : 'Add New Product') : 'Inventory Management'}
                    </h3>
                    <div className="breadcrumbs flex items-center gap10">
                        <Link to="/" style={{color: '#666', textDecoration: 'none'}}>Dashboard</Link>
                        <span>/</span>
                        <Link to="/product" style={{color: '#333', fontWeight: '500', textDecoration: 'none'}}>Products</Link>
                    </div>
                  </div>
                  
                  {!showForm ? (
                    // MODERN PRODUCT CARDS
                    <div>
                        <div className="flex justify-between items-center mb-30">
                            <h4 style={{fontSize: '18px', color: '#555'}}>{products.length} Products Found</h4>
                            <button onClick={handleAddClick} style={{
                                backgroundColor: '#4CAF50', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <i className="icon-plus"></i> Add New Product
                            </button>
                        </div>
                        
                        <div style={{
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '20px'
                        }}>
                            {products.length === 0 ? (
                                <p style={{textAlign: 'center', width: '100%', padding: '50px', color: '#888'}}>No products available. Click "Add New Product" to create one.</p>
                            ) : (
                                products.map((product) => (
                                    <div key={product.pid} style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        border: '1px solid #eaeaea',
                                        transition: 'transform 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{height: '200px', width: '100%', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <img 
                                                src={product.pimg ? `http://localhost:5001${product.pimg}` : 'images/products/product-1.jpg'} 
                                                alt={product.pname} 
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                                                onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}}
                                            />
                                        </div>
                                        <div style={{padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                            <h5 style={{fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{product.pname}</h5>
                                            <p style={{fontSize: '12px', color: '#777', marginBottom: '5px'}}>{product.pid}</p>
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '15px'}}>
                                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <p style={{fontSize: '12px', color: '#3498db', fontWeight: '600', margin: 0}}>{product.pcategory || 'Uncategorized'}</p>
                                                    <p style={{fontSize: '11px', color: '#888', fontWeight: '500', margin: 0}}>{product.company || 'Private Label'}</p>
                                                </div>
                                                {product.psubcategory && (
                                                    <p style={{fontSize: '11px', color: '#7f8c8d', fontStyle: 'italic', margin: 0}}>Sub: {product.psubcategory}</p>
                                                )}
                                            </div>
                                            
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '20px'}}>
                                                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#2c3e50'}}>₹{product.price}</span>
                                                <span style={{
                                                    fontSize: '12px', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px',
                                                    backgroundColor: product.quantity > 0 ? '#e8f5e9' : '#ffebee',
                                                    color: product.quantity > 0 ? '#2e7d32' : '#c62828',
                                                    fontWeight: '500'
                                                }}>
                                                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                                                </span>
                                            </div>
                                            
                                            <div style={{display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                                                <button onClick={() => handleEditClick(product)} style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: '#f8f9fa',
                                                    color: '#333',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s'
                                                }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(product.pid)} style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: '#ffebee',
                                                    color: '#d32f2f',
                                                    border: '1px solid #ffcdd2',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s'
                                                }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                  ) : (
                    // CLEAN FORM
                    <div style={{maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
                                {/* Image Upload Column */}
                                <div style={{flex: '1', minWidth: '300px'}}>
                                    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444'}}>Product Image</label>
                                    <div style={{
                                        border: '2px dashed #ddd',
                                        borderRadius: '8px',
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        backgroundColor: '#fafafa',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}>
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            style={{
                                                position: 'absolute',
                                                top: 0, left: 0, width: '100%', height: '100%',
                                                opacity: 0, cursor: 'pointer'
                                            }}
                                            accept="image/*"
                                        />
                                        {previewImg ? (
                                            <img src={previewImg} alt="Preview" style={{maxHeight: '200px', maxWidth: '100%', objectFit: 'contain'}} />
                                        ) : (
                                            <div>
                                                <i className="icon-upload-cloud" style={{fontSize: '40px', color: '#ccc', marginBottom: '10px', display: 'block'}}></i>
                                                <p style={{color: '#777', margin: 0}}>Click or drag image to upload</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Form Fields Column */}
                                <div style={{flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                                    <div>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Product Title *</label>
                                        <input 
                                            type="text" 
                                            name="pname" 
                                            value={formData.pname} 
                                            onChange={handleInputChange} 
                                            required 
                                            style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                            placeholder="Enter product title"
                                        />
                                    </div>

                                    <div>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Company / Brand</label>
                                        <select 
                                            name="company" 
                                            value={formData.company} 
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                // Reset category and subcategory if it doesn't belong to the new company
                                                setFormData(prev => ({ ...prev, pcategory: '', psubcategory: '' }));
                                            }}
                                            style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff'}}
                                        >
                                            <option value="">Select Company</option>
                                            {[...new Set(categories.map(cat => cat.company || 'Generic'))].sort().map(company => (
                                                <option key={company} value={company}>{company}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div style={{display: 'flex', gap: '20px'}}>
                                        <div style={{flex: 1}}>
                                            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Price (₹) *</label>
                                            <input 
                                                type="number" 
                                                onKeyDown={(e) => {
                                                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                                                }}
                                                name="price" 
                                                value={formData.price} 
                                                onChange={handleInputChange} 
                                                required 
                                                min="0"
                                                step="0.01"
                                                style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div style={{flex: 1}}>
                                            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Stock Quantity *</label>
                                            <input 
                                                type="number" 
                                                name="quantity" 
                                                value={formData.quantity} 
                                                onChange={handleInputChange} 
                                                required 
                                                min="0"
                                                style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Category *</label>
                                        <select 
                                            name="pcategory" 
                                            value={formData.pcategory} 
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setFormData(prev => ({ ...prev, psubcategory: '' }));
                                            }}
                                            required 
                                            style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff'}}
                                        >
                                            <option value="">Select Category</option>
                                            {categories
                                                .filter(cat => !formData.company || (cat.company || 'Generic') === formData.company)
                                                .map(cat => (
                                                <option key={cat.catid} value={cat.catname}>{cat.catname}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Subcategory</label>
                                        <select 
                                            name="psubcategory" 
                                            value={formData.psubcategory} 
                                            onChange={handleInputChange} 
                                            disabled={!formData.pcategory}
                                            style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: formData.pcategory ? '#fff' : '#f5f5f5', cursor: formData.pcategory ? 'pointer' : 'not-allowed'}}
                                        >
                                            <option value="">Select Subcategory</option>
                                            {formData.pcategory && categories.find(c => 
                                                c.catname === formData.pcategory && 
                                                (c.company || 'Generic') === (formData.company || 'Generic')
                                            )?.subcategories?.map((sub, i) => (
                                                <option key={i} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555'}}>Description *</label>
                                        <textarea 
                                            name="pdesc" 
                                            value={formData.pdesc} 
                                            onChange={handleInputChange} 
                                            required 
                                            rows="5"
                                            style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                                            placeholder="Describe the product..."
                                        ></textarea>
                                    </div>
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
                                    fontWeight: '500',
                                    fontSize: '15px'
                                }}>Cancel</button>
                                <button type="submit" style={{
                                    padding: '12px 30px',
                                    backgroundColor: '#0052cc',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '15px'
                                }}>{editingProduct ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                  )}
                  
        </div>
      </div>
    </>
  )
}

export default Product
