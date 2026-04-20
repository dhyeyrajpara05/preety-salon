import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StaffProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avgRating: 0, reviewCount: 0, recommendations: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, reviewsRes, statsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/staff/${id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/by-staff/${id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/staff/${id}/stats`)
                ]);
                setStaff(staffRes.data);
                setReviews(reviewsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Error fetching staff profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-warning" role="status"></div>
        </div>
    );

    if (!staff) return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', textAlign: 'center', paddingTop: '100px' }}>
            <h2>Artisan not found</h2>
            <button onClick={() => navigate('/about')} className="btn btn-outline-warning mt-4">Back to Team</button>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: '"Jost", sans-serif' }}>
            <Navbar />

            {/* --- CINEMATIC HERO --- */}
            <div style={{ position: 'relative', height: '80vh', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px', overflow: 'hidden' }}>
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `linear-gradient(to top, #0a0a0a 10%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.2)), url(${staff.image ? `${import.meta.env.VITE_API_URL}/uploads/${staff.image}` : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1974'})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{ padding: '8px 20px', backgroundColor: 'var(--primary-color)', color: '#000', borderRadius: '100px', display: 'inline-block', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
                            Master Artisan
                        </div>
                        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontFamily: '"Playfair Display", serif', fontWeight: '400', lineHeight: '0.9', marginBottom: '25px' }}>
                            {staff.name}
                        </h1>
                        <p style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: '#888', fontWeight: '600', marginBottom: '40px' }}>
                            {staff.designation} • {staff.experience || 'Expert'} Artisan
                        </p>
                        
                        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                             <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '20px 35px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '28px', color: 'var(--primary-color)', fontWeight: '700' }}>{stats.avgRating || '5.0'}★</div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '1px' }}>Average Rating</div>
                             </div>
                             <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '20px 35px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '28px', color: '#fff', fontWeight: '700' }}>{stats.reviewCount || 0}</div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '1px' }}>Clients Reviews</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="container" style={{ padding: '100px 15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px' }}>
                    
                    {/* LEFT COLUMN: About & Specialties */}
                    <div>
                        <div style={{ marginBottom: '60px' }}>
                            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', marginBottom: '30px', color: 'var(--primary-color)' }}>Personal Aura</h3>
                            <p style={{ fontSize: '17px', lineHeight: '1.9', color: '#ccc', fontWeight: '300' }}>
                                {staff.bio || `Meet ${staff.name}, a distinguished artisan at Preety Salon, where beauty is treated as a sacred ritual. With a profound understanding of aesthetic harmony, ${staff.name} specializes in crafting transformations that resonate with individual character and elegance.`}
                            </p>
                        </div>

                        {stats.recommendations?.length > 0 && (
                            <div style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), transparent)', borderRadius: '24px', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                                <h4 style={{ fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px', fontWeight: '700' }}>Specialties & Recommendations</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {stats.recommendations.map((rec, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.name}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.5 }}>Recommended by {rec.reviewCount} clients</div>
                                            </div>
                                            <div style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{rec.avgRating}★</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-warning w-100 mt-4 py-3" style={{ borderRadius: '12px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }} onClick={() => navigate('/book-appointment')}>
                                    Book a Consultation
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Client Appraisals */}
                    <div>
                        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', marginBottom: '30px' }}>Client Appraisals</h3>
                        {reviews.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <span style={{ fontSize: '40px', opacity: 0.3 }}>💬</span>
                                <p style={{ color: '#888', marginTop: '15px' }}>No appraisals yet. Experience the magic first!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {reviews.map((rev, i) => (
                                    <div key={i} style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary-color)' }}>{rev.userName}</div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1,2,3,4,5].map(star => (
                                                    <span key={star} style={{ color: star <= rev.rating ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', fontSize: '14px' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.4, marginBottom: '10px' }}>Service: {rev.serviceName}</div>
                                        <p style={{ fontSize: '15px', color: '#bdbdbd', lineHeight: '1.6', margin: 0 }}>"{rev.comment}"</p>
                                        <div style={{ fontSize: '11px', opacity: 0.3, marginTop: '20px' }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Footer />

            <style>{`
                .btn-warning {
                    background-color: var(--primary-color) !important;
                    border: none !important;
                    color: #000 !important;
                }
                .btn-warning:hover {
                    background-color: #fff !important;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
};

export default StaffProfile;
