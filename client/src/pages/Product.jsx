import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductCard = ({ product, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
            observer.disconnect();
        };
    }, []);
    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
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
                    quantity: 1,
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

    const handleBuyNow = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to purchase items');
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
                    quantity: 1,
                    price: product.price
                })
            });

            if (res.ok) {
                window.location.href = '/checkout';
            } else {
                alert('Failed to process Buy Now');
            }
        } catch (error) {
            console.error('Buy Now error:', error);
            alert('Server error occurred');
        }
    };

    return (
        <div 
            ref={cardRef}
            className="modern-card-reveal"
            style={{
                width: '100%',
                perspective: '1500px',
                marginBottom: '60px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) rotateX(0)' : 'translateY(80px) rotateX(-20deg)',
                transition: `all 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.1}s`
            }}
        >
            <Link 
                to={`/product-details/${product.pid}`} 
                style={{ textDecoration: 'none', display: 'block' }}
                onMouseEnter={(e) => {
                    const inner = e.currentTarget.querySelector('.card-glow-inner');
                    inner.style.transform = 'translateZ(20px) rotateY(5deg) rotateX(2deg)';
                    inner.style.boxShadow = '0 40px 80px rgba(0,0,0,0.6), 0 0 20px rgba(229, 227, 66, 0.1)';
                    const overlay = e.currentTarget.querySelector('.glass-overlay');
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'translateY(0)';
                }}
                onMouseLeave={(e) => {
                    const inner = e.currentTarget.querySelector('.card-glow-inner');
                    inner.style.transform = 'translateZ(0) rotateY(0) rotateX(0)';
                    inner.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                    const overlay = e.currentTarget.querySelector('.glass-overlay');
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translateY(30px)';
                }}
            >
                <div 
                    className="card-glow-inner"
                    style={{ 
                        position: 'relative', 
                        height: '560px', 
                        borderRadius: '40px', 
                        overflow: 'hidden', 
                        backgroundColor: '#111',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Background Image with slight parallax potential */}
                    <img 
                        src={product.pimg ? `http://localhost:5000${product.pimg}` : 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=1000'} 
                        alt={product.pname} 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} 
                    />

                    {/* Gradient Depth */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))',
                        pointerEvents: 'none'
                    }}></div>

                    {/* Floating Price Pill */}
                    <div style={{
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        padding: '10px 22px',
                        background: 'rgba(5, 5, 5, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(229, 227, 66, 0.2)',
                        borderRadius: '40px',
                        color: 'var(--primary-color)',
                        fontWeight: '700',
                        fontSize: '18px',
                        fontFamily: '"Jost", sans-serif',
                        zIndex: 10,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }}>
                        ₹{product.price}
                    </div>

                    {/* Glassmorphic Content Overlay - Modern Tech Style */}
                    <div 
                        className="glass-overlay"
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '20px',
                            right: '20px',
                            padding: '35px',
                            background: 'rgba(15, 15, 15, 0.5)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '32px',
                            opacity: 0,
                            transform: 'translateY(30px)',
                            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                            zIndex: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--primary-color)', fontSize: '10px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase' }}>
                                        {product.pcategory || 'Premium'}
                                    </span>
                                    {product.company && (
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            {product.company}
                                        </span>
                                    )}
                                </div>
                                <h3 style={{ 
                                    fontFamily: '"Playfair Display", serif', 
                                    color: '#fff', 
                                    fontSize: '28px',
                                    margin: 0,
                                    lineHeight: '1.1',
                                    fontWeight: '400'
                                }}>
                                    {product.pname}
                                </h3>
                            </div>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
                            {product.pdesc ? product.pdesc.substring(0, 70) + '...' : 'An exquisite artifact designed for the modern connoisseur of beauty.'}
                        </p>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <button 
                                onClick={(e) => handleAddToCart(e, product)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '16px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '900',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                Add to Bag
                            </button>
                            <button 
                                onClick={(e) => handleBuyNow(e, product)}
                                style={{
                                    flex: 1,
                                    background: 'var(--primary-color)',
                                    color: '#111',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '900',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onMouseEnter={(e) => e.target.style.letterSpacing = '4px'}
                                onMouseLeave={(e) => e.target.style.letterSpacing = '2px'}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Minimalist Peek-a-boo Info (visible when not hovered) */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        transition: 'opacity 0.4s',
                        zIndex: 5
                    }}>
                        <h4 style={{ color: '#fff', fontSize: '18px', fontFamily: '"Playfair Display", serif', margin: 0 }}>{product.pname}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Exclusive</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- Filtering & Sorting State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const location = useLocation();

    // Use query parameters to initialize filters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const company = params.get('company');
        const category = params.get('category');
        const subcategory = params.get('subcategory');

        // Reset to 'All' if not present in URL, otherwise set from URL
        setSelectedCompany(company || 'All');
        setSelectedCategory(category || 'All');
        setSelectedSubcategory(subcategory || 'All');
    }, [location.search]);
    
    const galleryRef = useRef(null);

    // Derived unique categories
    const categories = ['All', ...new Set(products.map(p => p.pcategory).filter(Boolean))];

    // Derived filtered and sorted products
    const filteredAndSortedProducts = React.useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch = product.pname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      (product.pdesc && product.pdesc.toLowerCase().includes(searchTerm.toLowerCase()));
                
                // Normalize company for comparison (handle 'Generic' vs empty string)
                const prodCompany = product.company || 'Generic';
                const filterCompany = selectedCompany;
                const matchesCompany = filterCompany === 'All' || prodCompany === filterCompany;

                const matchesCategory = selectedCategory === 'All' || product.pcategory === selectedCategory;
                const matchesSubcategory = selectedSubcategory === 'All' || product.psubcategory === selectedSubcategory;
                
                return matchesSearch && matchesCategory && matchesCompany && matchesSubcategory;
            })
            .sort((a, b) => {
                if (sortOption === 'price-asc') return a.price - b.price;
                if (sortOption === 'price-desc') return b.price - a.price;
                return 0; // default order
            });
    }, [products, searchTerm, selectedCompany, selectedCategory, selectedSubcategory, sortOption]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', fontFamily: '"Jost", sans-serif' }}>
            <style>{`
                @keyframes blurIn {
                    from { filter: blur(30px); opacity: 0; transform: scale(1.1); }
                    to { filter: blur(0); opacity: 1; transform: scale(1); }
                }
                @keyframes slideUpFade {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modern-card-reveal { perspective: 2000px; }
                
                /* Custom Scrollbar for Modern Look */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #050505; }
                ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }
            `}</style>

            <Navbar />

            {/* --- CINEMATIC HERO ENTRANCE --- */}
            <div style={{
                height: '90vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000'
            }}>
                {/* Background Video Layer */}
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster="https://images.unsplash.com/photo-1522338242992-e1a54906a8ad?auto=format&fit=crop&q=80&w=2000"
                    style={{
                        position: 'absolute',
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.7,
                        filter: 'grayscale(20%) contrast(110%)',
                        zIndex: 0
                    }}
                    src="/src/assets/image/beauty-spa/productbgvid.mp4"
                />

                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, width: '100%', height: '20vh',
                    background: 'linear-gradient(to top, #050505, transparent)',
                    zIndex: 1
                }}></div>

                <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{ 
                        display: 'block', 
                        fontSize: '11px', 
                        fontWeight: '800', 
                        letterSpacing: '8px', 
                        textTransform: 'uppercase', 
                        color: 'var(--primary-color)',
                        marginBottom: '30px',
                        animation: 'slideRight 1s ease-out'
                    }}>
                        Curated Cosmetics
                    </span>
                    <h1 style={{ 
                        fontSize: 'clamp(3.5rem, 12vw, 9rem)', 
                        fontFamily: '"Playfair Display", serif',
                        color: '#fff',
                        margin: '0',
                        lineHeight: '0.8',
                        textTransform: 'uppercase',
                        letterSpacing: '-4px',
                        animation: 'blurIn 2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}>
                        The <br />
                        <span style={{ fontStyle: 'italic', fontWeight: '400', color: 'var(--primary-color)', textTransform: 'none', letterSpacing: '0' }}>Boutique.</span>
                    </h1>
                </div>
            </div>

            {/* --- GALLERY CONTROLS --- */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(5,5,5,0.85)',
                backdropFilter: 'blur(20px)',
                padding: '20px 0',
                borderBottom: '1px solid rgba(229, 227, 66, 0.1)'
            }}>
                <div className="container">
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        {/* Status Label */}
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                            Discovering <span>{filteredAndSortedProducts.length}</span> Masterpieces
                        </p>

                        {/* Controls Group */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '15px', 
                            alignItems: 'center', 
                            flexWrap: 'wrap',
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}>
                            
                            {/* Search */}
                            <div style={{ position: 'relative', width: '250px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search artifacts..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '30px',
                                        padding: '10px 40px 10px 20px',
                                        color: '#fff',
                                        fontSize: '13px',
                                        outline: 'none',
                                        fontFamily: '"Jost", sans-serif'
                                    }}
                                />
                                <i className="icon-search" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}></i>
                            </div>

                            {/* Company Filter */}
                            <select 
                                value={selectedCompany} 
                                onChange={(e) => {
                                    setSelectedCompany(e.target.value);
                                    setSelectedCategory('All');
                                    setSelectedSubcategory('All');
                                }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    paddingRight: '40px',
                                    position: 'relative',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 15px center'
                                }}
                            >
                                <option value="All" style={{ background: '#111', color: '#fff' }}>All Brands</option>
                                {[...new Set(products.map(p => p.company).filter(Boolean))].sort().map(company => (
                                    <option key={company} value={company} style={{ background: '#111', color: '#fff' }}>
                                        {company}
                                    </option>
                                ))}
                            </select>

                            {/* Category Filter */}
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedSubcategory('All');
                                }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    paddingRight: '40px',
                                    position: 'relative',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 15px center'
                                }}
                            >
                                <option value="All" style={{ background: '#111', color: '#fff' }}>All Categories</option>
                                {[...new Set(products
                                    .filter(p => selectedCompany === 'All' || p.company === selectedCompany)
                                    .map(p => p.pcategory).filter(Boolean))].sort().map(cat => (
                                    <option key={cat} value={cat} style={{ background: '#111', color: '#fff' }}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {/* Subcategory Filter */}
                            <select 
                                value={selectedSubcategory} 
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    paddingRight: '40px',
                                    position: 'relative',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 15px center'
                                }}
                            >
                                <option value="All" style={{ background: '#111', color: '#fff' }}>All Subcategories</option>
                                {[...new Set(products
                                    .filter(p => (selectedCompany === 'All' || p.company === selectedCompany) && (selectedCategory === 'All' || p.pcategory === selectedCategory))
                                    .map(p => p.psubcategory).filter(Boolean))].sort().map(sub => (
                                    <option key={sub} value={sub} style={{ background: '#111', color: '#fff' }}>
                                        {sub}
                                    </option>
                                ))}
                            </select>

                            {/* Sort Filter */}
                            <select 
                                value={sortOption} 
                                onChange={(e) => setSortOption(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '30px',
                                    padding: '10px 20px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    paddingRight: '40px',
                                    position: 'relative',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='var(%2D%2Dprimary-color)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 15px center'
                                }}
                            >
                                <option value="default" style={{ background: '#111', color: '#fff' }}>Sort by: Default</option>
                                <option value="price-asc" style={{ background: '#111', color: '#fff' }}>Price: Low to High</option>
                                <option value="price-desc" style={{ background: '#111', color: '#fff' }}>Price: High to Low</option>
                            </select>

                        </div>
                    </div>
                </div>
            </div>

            {/* --- ASYMMETRIC BOUTIQUE GALLERY --- */}
            <div className="product-section pt-120 pb-120">
                <div className="container">
                    <div className="row g-lg-5" ref={galleryRef}>
                        {loading ? (
                            <div className="col-12 text-center" style={{ padding: '200px 0' }}>
                                <div className="spinner-border text-warning" role="status"></div>
                            </div>
                        ) : filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product, index) => (
                                <div 
                                    key={product.pid} 
                                    className="col-lg-4 col-md-6"
                                >
                                    <ProductCard 
                                        product={product} 
                                        index={index} 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center" style={{ padding: '100px 0' }}>
                                <h3 style={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>No Artifacts Found</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Product;
