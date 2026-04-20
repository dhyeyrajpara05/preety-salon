import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import pexelsBg from '../assets/image/beauty-spa/pexels-sales-trust-162265874-10825668.jpg';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [reviewSaving, setReviewSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    fetchReviews(data.pid);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const fetchReviews = async (productId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/product-reviews/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return alert('Please login to leave a review');
        if (!reviewForm.rating) return alert('Please select a star rating');

        const user = JSON.parse(userStr);
        setReviewSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/product-reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.pid,
                    userId: user.userid,
                    userName: user.uname,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                })
            });
            if (res.ok) {
                fetchReviews(product.pid);
                setReviewForm({ rating: 0, comment: '' });
                alert('Review submitted successfully');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setReviewSaving(false);
        }
    };

    const handleAddToCart = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to add items to bag');
            return;
        }

        const user = JSON.parse(userStr);
        const userid = user.userid;

        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid,
                    productid: product.pid,
                    quantity: quantity,
                    price: product.price
                })
            });

            if (res.ok) {
                alert('Product added to bag successfully');
            } else {
                alert('Failed to add to bag');
            }
        } catch (error) {
            console.error(error);
            alert('Server error occurred');
        }
    };

    if (loading) return (
        <div style={{ background: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-warning" role="status"></div>
        </div>
    );
    
    if (!product) return (
        <div style={{ background: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif' }}>Product not found!</h2>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', fontFamily: '"Jost", sans-serif' }}>
            <style>{`
                @keyframes blurIn {
                    from { filter: blur(20px); opacity: 0; transform: scale(1.1); }
                    to { filter: blur(0); opacity: 1; transform: scale(1); }
                }
                .glass-pane {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(30px);
                    border: 1px solid rgba(229, 227, 66, 0.1);
                    border-radius: 40px;
                    padding: 60px;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.5);
                }
                .quantity-btn {
                    width: 50px; height: 50px;
                    border: 1px solid var(--primary-color);
                    background: transparent;
                    color: var(--primary-color);
                    border-radius: 50%;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                    padding: 0;
                }
                .quantity-btn i {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quantity-btn:hover {
                    background: var(--primary-color);
                    color: #111;
                    box-shadow: 0 0 20px rgba(229, 227, 66, 0.3);
                }
            `}</style>

            <Navbar />

            {/* --- CINEMATIC BREADCRUMB --- */}
            <div style={{
                height: '50vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${pexelsBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                    backgroundAttachment: 'fixed',
                    zIndex: 0
                }}></div>
                <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                     <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 8vw, 6rem)', 
                        fontFamily: '"Playfair Display", serif',
                        color: '#fff',
                        margin: '0',
                        lineHeight: '1',
                        textTransform: 'uppercase',
                        letterSpacing: '-2px',
                        animation: 'blurIn 1.5s ease-out forwards'
                    }}>
                        {product.pname}
                    </h1>
                    <ul style={{ 
                        listStyle: 'none', padding: 0, marginTop: '20px', 
                        display: 'flex', justifyContent: 'center', gap: '15px',
                        color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase'
                    }}>
                        <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
                        <li style={{ color: 'var(--primary-color)' }}>•</li>
                        <li><Link to="/product" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link></li>
                        <li style={{ color: 'var(--primary-color)' }}>•</li>
                        <li style={{ color: '#fff' }}>Details</li>
                    </ul>
                </div>
            </div>

            {/* --- PRODUCT DETAILS CORE --- */}
            <div className="container py-5 mt-5 mb-120">
                <div className="row g-5">
                    {/* Visual Stage */}
                    <div className="col-lg-5">
                        <div style={{
                            position: 'relative',
                            borderRadius: '40px',
                            overflow: 'hidden',
                            height: '650px',
                            boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(229, 227, 66, 0.05)'
                        }}>
                             <img 
                                src={product.pimg ? `http://localhost:5000${product.pimg}` : 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=1000'} 
                                alt={product.pname} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Information Pane */}
                    <div className="col-lg-7">
                        <div className="glass-pane h-100 d-flex flex-column justify-content-center">

                            <h2 style={{ 
                                fontFamily: '"Playfair Display", serif', 
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                                color: '#fff', 
                                marginBottom: '20px',
                                lineHeight: '1.1'
                            }}>
                                {product.pname}
                            </h2>

                            <span style={{ 
                                display: 'block',
                                color: 'var(--primary-color)', 
                                fontSize: '32px', 
                                fontFamily: '"Playfair Display", serif',
                                marginBottom: '40px'
                            }}>
                                ₹{product.price}
                            </span>

                            <p style={{ 
                                color: 'rgba(255,255,255,0.6)', 
                                fontSize: '17px', 
                                lineHeight: '1.8',
                                fontWeight: '300',
                                marginBottom: '50px'
                            }}>
                                {product.pdesc || "Experience the pinnacle of luxury with this master-crafted creation. Designed for those who demand excellence, this product represents the intersection of artistry and precision, essential for your daily refinement ritual."}
                            </p>

                            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                    <button className="quantity-btn" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} title="Decrease quantity"><i className="bi bi-dash-lg"></i></button>
                                    <span style={{ 
                                        color: '#fff', 
                                        fontSize: '26px', 
                                        width: '40px', 
                                        textAlign: 'center',
                                        fontFamily: '"Playfair Display", serif',
                                        fontWeight: '500'
                                    }}>
                                        {quantity}
                                    </span>
                                    <button className="quantity-btn" onClick={() => setQuantity(q => q + 1)} title="Increase quantity"><i className="bi bi-plus-lg"></i></button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    style={{
                                        flexGrow: 1,
                                        padding: '25px',
                                        background: 'var(--primary-color)',
                                        color: '#111',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        letterSpacing: '4px',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-5px) scale(1.02)';
                                        e.target.style.boxShadow = '0 20px 40px rgba(229, 227, 66, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0) scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Secure In Bag
                                </button>
                            </div>

                            <div style={{ 
                                borderTop: '1px solid rgba(229, 227, 66, 0.05)', 
                                paddingTop: '40px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div>
                                    <span style={{ display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Availability</span>
                                    <span style={{ color: '#fff', fontSize: '13px' }}>{product.quantity} Units in Boutique</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Brand / Company</span>
                                    <span style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: '600' }}>{product.company || 'Preety Salon Original'}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Master Code</span>
                                    <span style={{ color: '#fff', fontSize: '13px' }}>PS-{product.pid?.slice(-6).toUpperCase() || 'LUXE-01'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="container pb-120">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="glass-pane" style={{ padding: '60px' }}>
                            <div className="row g-5">
                                {/* Review Form */}
                                <div className="col-md-5">
                                    <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#fff', marginBottom: '30px', fontSize: '28px' }}>Share your Experience</h3>
                                    <div style={{ marginBottom: '25px' }}>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Overall Rating</label>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <i 
                                                    key={star} 
                                                    className={`bi bi-star${star <= reviewForm.rating ? '-fill' : ''}`}
                                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                    style={{ 
                                                        fontSize: '28px', 
                                                        color: star <= reviewForm.rating ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Your Commentary</label>
                                        <textarea 
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Write your thoughts on this creation..."
                                            style={{ 
                                                width: '100%', 
                                                background: 'rgba(255,255,255,0.02)', 
                                                border: '1px solid rgba(229, 227, 66, 0.1)', 
                                                borderRadius: '20px', 
                                                padding: '25px', 
                                                color: '#fff',
                                                fontSize: '16px',
                                                minHeight: '180px',
                                                outline: 'none',
                                                transition: 'all 0.3s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(229, 227, 66, 0.1)'}
                                        ></textarea>
                                    </div>
                                    <button 
                                        onClick={handleReviewSubmit}
                                        disabled={reviewSaving}
                                        style={{ 
                                            width: '100%',
                                            padding: '25px',
                                            background: reviewSaving ? 'rgba(255,255,255,0.05)' : 'var(--primary-color)',
                                            color: '#111',
                                            border: 'none',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '900',
                                            letterSpacing: '4px',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => !reviewSaving && (e.target.style.transform = 'translateY(-3px)')}
                                        onMouseLeave={(e) => !reviewSaving && (e.target.style.transform = 'translateY(0)')}
                                    >
                                        {reviewSaving ? 'Vetting appraisal...' : 'Submit Appraisal'}
                                    </button>
                                </div>

                                {/* Review List Divider */}
                                <div className="col-md-1 d-none d-md-flex justify-content-center">
                                    <div style={{ width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(229, 227, 66, 0.1), transparent)' }}></div>
                                </div>

                                {/* Review List */}
                                <div className="col-md-6">
                                    <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#fff', marginBottom: '30px', fontSize: '28px' }}>Client Appraisals</h3>
                                    <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '20px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(229, 227, 66, 0.2) transparent' }}>
                                        {reviews.length === 0 ? (
                                            <div style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', padding: '60px 0', textAlign: 'center' }}>
                                                <i className="bi bi-chat-dots-fill" style={{ fontSize: '40px', display: 'block', marginBottom: '20px', opacity: 0.1 }}></i>
                                                This collection has yet to be appraised.
                                            </div>
                                        ) : (
                                            reviews.map((rev, idx) => (
                                                <div key={idx} style={{ 
                                                    borderBottom: '1px solid rgba(229, 227, 66, 0.05)', 
                                                    paddingBottom: '30px', 
                                                    marginBottom: '30px' 
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px', letterSpacing: '0.5px' }}>{rev.userName}</span>
                                                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                                {new Date(rev.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div style={{ color: 'var(--primary-color)', fontSize: '13px', display: 'flex', gap: '3px' }}>
                                                            {[1,2,3,4,5].map(i => <i key={i} className={`bi bi-star${i <= rev.rating ? '-fill' : ''}`}></i>)}
                                                        </div>
                                                    </div>
                                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.8', margin: 0, fontWeight: '300' }}>
                                                        "{rev.comment}"
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;
