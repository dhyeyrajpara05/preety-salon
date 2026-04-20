import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/api/packages');
                const data = await response.json();
                setPackages(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh', fontFamily: '"Jost", sans-serif', color: '#1a1a1a', overflowX: 'hidden' }}>
            <Navbar />

            {/* --- MODERN LUXE HERO --- */}
            <div style={{
                height: '70vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#111'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2070)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.7,
                    filter: 'grayscale(15%) contrast(1.1)'
                }}></div>
                
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.5), transparent)',
                    zIndex: 1
                }}></div>

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '0 20px',
                    maxWidth: '1000px'
                }}>
                    <span style={{ 
                        display: 'block', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        letterSpacing: '6px', 
                        textTransform: 'uppercase', 
                        color: 'var(--primary-color)',
                        marginBottom: '25px',
                        animation: 'fadeInUp 1s ease-out'
                    }}>
                        Exclusive Collections
                    </span>
                    <h1 style={{ 
                        fontSize: 'clamp(3rem, 8vw, 6rem)', 
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: '400',
                        color: '#fff',
                        margin: '0 0 35px 0',
                        lineHeight: '1',
                        letterSpacing: '-2px',
                        animation: 'fadeInUp 1.2s ease-out'
                    }}>
                        Artisan <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Wellness</span> Rituals
                    </h1>
                    <div style={{ 
                        width: '60px', height: '2px', background: 'var(--primary-color)', 
                        margin: '0 auto',
                        animation: 'scaleIn 1.5s ease-out'
                    }}></div>
                </div>
            </div>

            {/* --- CURATED COLLECTION GRID --- */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : packages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '150px 20px', background: '#fff', borderRadius: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '28px', fontFamily: '"Playfair Display", serif' }}>New Rituals Arriving Soon</h3>
                        <p style={{ color: '#888', marginTop: '15px' }}>Our experts are crafting new experiences. Please visit us again soon.</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                        gap: '60px' 
                    }}>
                        {packages.map((pkg, idx) => (
                            <div key={pkg.pkid} className="modern-package-card" style={{
                                backgroundColor: '#fff',
                                borderRadius: '0',
                                overflow: 'hidden',
                                transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                cursor: 'pointer',
                                border: '1px solid #f1f1f1',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative'
                            }}>
                                <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
                                    <img 
                                        src={pkg.pkimg ? `${import.meta.env.VITE_API_URL}${pkg.pkimg}` : 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=1000'} 
                                        alt={pkg.pkname} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)' }} 
                                        className="card-img"
                                    />
                                    <div className="card-overlay"></div>
                                    <div style={{ 
                                        position: 'absolute', top: '30px', right: '30px', 
                                        backgroundColor: '#fff', width: '85px', height: '85px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '50%', fontSize: '18px', fontWeight: '700', color: '#111',
                                        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                                        fontFamily: '"Playfair Display", serif',
                                        zIndex: 2
                                    }}>
                                        ₹{pkg.pkprice}
                                    </div>
                                </div>
                                
                                <div style={{ padding: '50px 40px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                    <h3 style={{ 
                                        fontSize: '34px', 
                                        fontFamily: '"Playfair Display", serif', 
                                        margin: '0 0 20px 0',
                                        color: '#1a1a1a',
                                        letterSpacing: '-0.5px'
                                    }}>{pkg.pkname}</h3>
                                    
                                    <p style={{ 
                                        fontSize: '15px', 
                                        color: '#666', 
                                        lineHeight: '1.8', 
                                        marginBottom: '35px',
                                        flex: 1,
                                        fontWeight: '300'
                                    }}>{pkg.pkdesc}</p>
                                    
                                    <div style={{ marginBottom: '40px' }}>
                                        <div style={{ width: '40px', height: '1px', background: '#ccc', margin: '0 auto 25px auto' }}></div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {pkg.pkfeatures.map((feature, i) => (
                                                <li key={i} style={{ 
                                                    fontSize: '12px', color: '#555', marginBottom: '12px',
                                                    textTransform: 'uppercase', letterSpacing: '2px'
                                                }}>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Link to="/contact" className="modern-btn">
                                        RESERVE EXPERIENCE
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODERN LUXE MEMBERSHIP --- */}
            <div style={{ padding: '0 20px 150px 20px' }}>
                <div style={{ 
                    maxWidth: '1200px', margin: '0 auto', 
                    backgroundColor: '#fff', 
                    padding: '100px 60px',
                    textAlign: 'center',
                    border: '1px solid #f1f1f1',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{ 
                            display: 'block', fontSize: '12px', letterSpacing: '5px', 
                            textTransform: 'uppercase', color: 'var(--primary-color)', marginBottom: '30px', fontWeight: '600'
                        }}>
                            The Ultimate Privilege
                        </span>
                        <h2 style={{ fontSize: '52px', fontFamily: '"Playfair Display", serif', marginBottom: '25px', color: '#1a1a1a', lineHeight: '1' }}>Bespoke Memberships</h2>
                        <p style={{ color: '#666', maxWidth: '650px', margin: '0 auto 50px auto', lineHeight: '2', fontSize: '18px', fontWeight: '300' }}>
                            Elevate your beauty routine with an exclusive Preety Salon membership. Experience priority booking and personalized curated treatments every month.
                        </p>
                        <Link to="/contact" style={{
                            display: 'inline-block',
                            padding: '20px 60px',
                            border: '1px solid #111',
                            background: '#111',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                        }}
                        className="membership-btn"
                        >
                            Explore Privileges
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { transform: scaleX(0); opacity: 0; }
                    to { transform: scaleX(1); opacity: 1; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    width: 50px; height: 50px; border: 1px solid #eee; border-top: 1px solid var(--primary-color);
                    border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;
                }
                
                .modern-package-card:hover {
                    box-shadow: 0 40px 80px rgba(0,0,0,0.08);
                    border-color: var(--primary-color);
                    transform: translateY(-10px);
                }
                .modern-package-card:hover .card-img {
                    transform: scale(1.1);
                }
                .modern-btn {
                    display: inline-block;
                    padding: 18px 25px;
                    background: transparent;
                    color: #111;
                    border: 1px solid #eee;
                    text-decoration: none;
                    font-size: 13px;
                    letter-spacing: 3px;
                    font-weight: 600;
                    transition: all 0.4s;
                    border-radius: 0;
                }
                .modern-package-card:hover .modern-btn {
                    background: #111;
                    color: #fff;
                    border-color: #111;
                }
                .membership-btn:hover {
                    background: transparent;
                    color: #111;
                    transform: scale(1.05);
                }
                .card-overlay {
                    position: absolute; top:0; left:0; width:100%; height:100%;
                    background: rgba(0,0,0,0.1);
                    transition: all 0.6s;
                    z-index: 1;
                }
                .modern-package-card:hover .card-overlay {
                    background: rgba(0,0,0,0);
                }
            `}</style>
        </div>
    );
};

export default Packages;
