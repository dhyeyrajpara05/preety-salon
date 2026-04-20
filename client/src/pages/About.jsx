import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/staff')
            .then(res => setTeamMembers(res.data.filter(m => m.status === 'Active')))
            .catch(err => console.error('Error fetching staff:', err));
    }, []);

    return (
        <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh', fontFamily: '"Jost", sans-serif', color: '#1a1a1a', overflowX: 'hidden' }}>
            <Navbar />

            {/* --- HERITAGE HERO --- */}
            <div style={{
                height: '85vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#000'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=2070)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6,
                    filter: 'grayscale(20%) brightness(0.9)'
                }}></div>
                
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent, rgba(250,250,249,1))',
                    zIndex: 1
                }}></div>

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '0 20px',
                    maxWidth: '1000px'
                }}>
                    <div className="badge-reveal" style={{ 
                        display: 'inline-block',
                        padding: '10px 25px',
                        border: '1px solid var(--primary-color)',
                        borderRadius: '100px',
                        color: 'var(--primary-color)',
                        fontSize: '11px',
                        letterSpacing: '5px',
                        textTransform: 'uppercase',
                        marginBottom: '40px',
                        fontWeight: '600',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        A Decade of Excellence • Est. 2014
                    </div>
                    <h1 style={{ 
                        fontSize: 'clamp(3.5rem, 10vw, 8rem)', 
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: '400',
                        color: '#fff',
                        margin: '0 0 30px 0',
                        lineHeight: '0.9',
                        letterSpacing: '-3px'
                    }}>
                        A Decade of <br/>
                        <span style={{ fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: '300' }}>Defined Beauty</span>
                    </h1>
                    <div style={{ 
                        width: '1px', height: '100px', background: 'var(--primary-color)', 
                        margin: '30px auto',
                        opacity: 0.6
                    }}></div>
                </div>
            </div>

            {/* --- THE STORY REFINED --- */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '150px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '100px', alignItems: 'center' }}>
                    <div className="reveal-left" style={{ paddingRight: '40px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '30px' }}>
                            Our Signature
                        </span>
                        <h2 style={{ fontSize: '60px', fontFamily: '"Playfair Display", serif', lineHeight: '1.1', marginBottom: '40px', color: '#1a1a1a' }}>
                            Crafting Confidence <br/><span style={{ fontStyle: 'italic', fontWeight: '300' }}>Since 2014.</span>
                        </h2>
                        <p style={{ fontSize: '18px', lineHeight: '2.1', color: '#555', marginBottom: '35px', fontWeight: '300' }}>
                            Preety Salon was born from a singular obsession: the pursuit of the perfect glow. Over the last ten years, we have evolved into Surat's premier destination for those who view beauty not as a chore, but as a ritual. Our legacy is built on a decade of precision, where every shear, every stroke, and every treatment is a testament to our commitment to high-end artistry.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: '2.1', color: '#555', fontWeight: '300', fontStyle: 'italic' }}>
                            "To us, beauty is an intentional masterpiece. We don't just follow trends; we define them for the modern individual."
                        </p>
                        <div style={{ marginTop: '50px', display: 'flex', gap: '40px' }}>
                            <div>
                                <h4 style={{ fontSize: '36px', fontFamily: '"Playfair Display", serif', marginBottom: '5px', color: '#111' }}>10+</h4>
                                <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', fontWeight: '600' }}>Elite Years</span>
                            </div>
                            <div style={{ width: '1px', background: '#eee' }}></div>
                            <div>
                                <h4 style={{ fontSize: '36px', fontFamily: '"Playfair Display", serif', marginBottom: '5px', color: '#111' }}>100k+</h4>
                                <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', fontWeight: '600' }}>Styling Rituals</span>
                            </div>
                        </div>
                    </div>
                    <div className="reveal-right">
                        <div style={{ 
                            position: 'relative', 
                            height: '650px', 
                            background: '#111', 
                            borderRadius: '20px', 
                            padding: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '1px solid rgba(229, 227, 66, 0.1)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative background element */}
                            <div style={{ 
                                position: 'absolute', top: '-10%', right: '-10%', 
                                width: '300px', height: '300px', 
                                background: 'radial-gradient(circle, rgba(229, 227, 66, 0.05) 0%, transparent 70%)',
                                borderRadius: '50%'
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <h3 style={{ 
                                    fontFamily: '"Playfair Display", serif', 
                                    fontSize: '120px', 
                                    color: 'rgba(229, 227, 66, 0.03)', 
                                    position: 'absolute',
                                    top: '-40px',
                                    left: '-20px',
                                    fontWeight: '900',
                                    lineHeight: '1'
                                }}>2014</h3>
                                
                                <span style={{ color: 'var(--primary-color)', fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '30px', display: 'block', fontWeight: '800' }}>
                                    The Artisan Path
                                </span>
                                
                                <h4 style={{ color: '#fff', fontSize: '32px', fontFamily: '"Playfair Display", serif', marginBottom: '40px', lineHeight: '1.4' }}>
                                    A ritual defined by <br/>
                                    <span style={{ fontStyle: 'italic', fontWeight: '300', color: 'var(--primary-color)' }}>precision and soul.</span>
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    {[
                                        { title: "Sartorial Scissors", desc: "Every cut is a custom architecture for your unique profile." },
                                        { title: "Luminous Alchemy", desc: "Advanced skin rituals using only global house-grade serums." },
                                        { title: "Bespoke Bridal", desc: "Transformative artistry for the most significant milestones." }
                                    ].map((feat, i) => (
                                        <div key={i} style={{ borderLeft: '1px solid rgba(229, 227, 66, 0.2)', paddingLeft: '25px' }}>
                                            <h6 style={{ color: '#fff', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>{feat.title}</h6>
                                            <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6', fontWeight: '300', margin: 0 }}>{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ 
                                position: 'absolute', bottom: '0', right: '0', 
                                width: '100%', height: '5px', 
                                background: 'var(--primary-color)' 
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PHILOSOPHY SECTION REFINED --- */}
            <div style={{ backgroundColor: '#111', padding: '160px 20px', textAlign: 'center', color: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <span style={{ fontSize: '12px', letterSpacing: '7px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '45px', fontWeight: '600' }}>
                        Our Credo
                    </span>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontFamily: '"Playfair Display", serif', lineHeight: '1.2', marginBottom: '70px', fontWeight: '300' }}>
                        "The art of the <span style={{ fontStyle: 'italic', fontWeight: '200', color: 'var(--primary-color)' }}>intentional glow</span>. We create the sanctuary where your inner radiance meets our technical perfection."
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px', marginTop: '90px' }}>
                        <div style={{ padding: '50px 40px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.01)', transition: 'all 0.4s' }} className="credo-card">
                            <div style={{ fontSize: '28px', color: 'var(--primary-color)', marginBottom: '25px' }}><i className="bi bi-gem"></i></div>
                            <h4 style={{ fontSize: '19px', fontFamily: '"Playfair Display", serif', marginBottom: '18px', letterSpacing: '1px' }}>Curated Quality</h4>
                            <p style={{ fontSize: '14px', color: '#777', lineHeight: '2', fontWeight: '300' }}>We partner exclusively with global luxury houses to bring you the highest-performing rituals.</p>
                        </div>
                        <div style={{ padding: '50px 40px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.01)', transition: 'all 0.4s' }} className="credo-card">
                            <div style={{ fontSize: '28px', color: 'var(--primary-color)', marginBottom: '25px' }}><i className="bi bi-stars"></i></div>
                            <h4 style={{ fontSize: '19px', fontFamily: '"Playfair Display", serif', marginBottom: '18px', letterSpacing: '1px' }}>Global Artistry</h4>
                            <p style={{ fontSize: '14px', color: '#777', lineHeight: '2', fontWeight: '300' }}>Our artisans undergo continuous training across the globe to master evolving beauty frontiers.</p>
                        </div>
                        <div style={{ padding: '50px 40px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.01)', transition: 'all 0.4s' }} className="credo-card">
                            <div style={{ fontSize: '28px', color: 'var(--primary-color)', marginBottom: '25px' }}><i className="bi bi-heart"></i></div>
                            <h4 style={{ fontSize: '19px', fontFamily: '"Playfair Display", serif', marginBottom: '18px', letterSpacing: '1px' }}>Bespoke Aura</h4>
                            <p style={{ fontSize: '14px', color: '#777', lineHeight: '2', fontWeight: '300' }}>We don't believe in templates. Every consultation is a deep dive into your personal aesthetic.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MEET OUR TEAM --- */}
            {teamMembers.length > 0 && (
                <div style={{ padding: '140px 20px', backgroundColor: '#fafaf9' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <span style={{ fontSize: '12px', letterSpacing: '7px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '25px', fontWeight: '600' }}>
                                The Artisans Behind the Magic
                            </span>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: '"Playfair Display", serif', lineHeight: '1.1', color: '#1a1a1a', margin: 0 }}>
                                Meet Our <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Team</span>
                            </h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
                            {teamMembers.map(member => (
                                <div key={member._id} style={{ textAlign: 'center' }} className="team-card">
                                    <Link to={`/staff-profile/${member._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} className="team-card-link">
                                        <div style={{
                                            width: '160px', height: '160px', borderRadius: '50%', margin: '0 auto 25px',
                                            overflow: 'hidden', border: '3px solid var(--primary-color)',
                                            backgroundColor: '#f0f7ff',
                                            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }} className="team-img-wrap">
                                            {member.image ? (
                                                <img src={`http://localhost:5000/uploads/${member.image}`} alt={member.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)', fontFamily: '"Playfair Display", serif' }}>
                                                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', marginBottom: '8px', color: '#1a1a1a' }}>{member.name}</h4>
                                        <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '20px' }}>
                                            {member.designation}
                                        </div>
                                        {member.services?.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                                {member.services.slice(0, 4).map((svc, i) => (
                                                    <span key={i} style={{ padding: '4px 12px', borderRadius: '100px', border: '1px solid #e5e5e0', fontSize: '11px', color: '#555', fontWeight: '500' }}>{svc}</span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- CALL TO ACTION REFINED --- */}
            <div style={{ padding: '160px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '55px', fontFamily: '"Playfair Display", serif', marginBottom: '35px', lineHeight: '1.1' }}>Experience the Transformation</h2>
                    <p style={{ fontSize: '19px', color: '#666', marginBottom: '60px', fontWeight: '300', lineHeight: '1.8' }}>
                        Ten years in the making, your most radiant self is just one appointment away. Step into our world and experience a decade of defined beauty.
                    </p>
                    <Link to="/book-appointment" style={{
                        display: 'inline-block',
                        padding: '22px 65px',
                        backgroundColor: '#111',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '13px',
                        letterSpacing: '5px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }} className="luxe-cta-ultimate">
                        Step Into Your Transformation
                    </Link>
                </div>
            </div>

            <Footer />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .badge-reveal {
                    animation: fadeInUp 1s ease-out;
                }
                .credo-card:hover {
                    background-color: rgba(255,255,255,0.03) !important;
                    border-color: var(--primary-color) !important;
                    transform: translateY(-10px);
                }
                .luxe-cta-ultimate:hover {
                    background: transparent !important;
                    color: #111 !important;
                    box-shadow: inset 0 0 0 1px #111;
                    transform: scale(1.05);
                }
                @media (max-width: 768px) {
                    .reveal-left { padding-right: 0 !important; margin-bottom: 80px; }
                }
            `}</style>
        </div>
    );
};

export default About;
