import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Membership = () => {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + '/api/membership-plans')
            .then(res => setPlans(res.data.filter(p => p.isActive)))
            .catch(err => console.error(err));
    }, []);

    const handleBuyPlan = async (plan) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to purchase a membership plan');
            return;
        }

        const user = JSON.parse(userStr);

        try {
            // 1. Create Order
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: plan.price, currency: 'INR' })
            });

            if (!res.ok) throw new Error('Order creation failed');
            const rzpOrder = await res.json();

            // 2. Razorpay Options
            const options = {
                key: 'rzp_test_SQnwxoDTCXne45',
                amount: rzpOrder.amount,
                currency: "INR",
                name: "Preety Salon",
                description: `Membership: ${plan.planName}`,
                order_id: rzpOrder.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                amount: plan.price,
                                userid: user.userid,
                                internalOrderId: `MEMB_${Date.now()}`
                            })
                        });

                        if (verifyRes.ok) {
                            alert(`Congratulations! You are now a ${plan.planName} member.`);
                            window.location.href = '/profile';
                        } else {
                            const errorData = await verifyRes.json();
                            alert(`Payment verification failed: ${errorData.message}`);
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        alert('Error during payment verification. Please contact support.');
                    }
                },
                prefill: {
                    name: user.uname,
                    email: user.email,
                    contact: user.contact || ''
                },
                theme: { color: "#000000" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Membership Purchase Error:', error);
            alert('Failed to initiate payment.');
        }
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: '"Jost", sans-serif', color: '#1a1a1a', overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero */}
            <div style={{
                height: '80vh', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', backgroundColor: '#000'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2070)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: 0.5
                }}></div>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
                }}></div>
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', maxWidth: '800px' }}>
                    <div style={{
                        display: 'inline-block', padding: '10px 30px',
                        border: '1px solid var(--primary-color)', borderRadius: '100px',
                        color: 'var(--primary-color)', fontSize: '11px', letterSpacing: '5px',
                        textTransform: 'uppercase', marginBottom: '35px', fontWeight: '600',
                        backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'
                    }}>Exclusive Membership</div>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)', fontFamily: '"Playfair Display", serif',
                        fontWeight: '400', color: '#fff', margin: '0 0 25px',
                        lineHeight: '1', letterSpacing: '-2px'
                    }}>
                        Your Beauty,<br />
                        <span style={{ fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: '300' }}>Elevated.</span>
                    </h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', fontWeight: '300', lineHeight: '1.8', maxWidth: '500px', margin: '0 auto 40px' }}>
                        Experience a new standard of personalized care with our tiered membership rituals at Preety Salon.
                    </p>
                    <a href="#plans" style={{
                        display: 'inline-block', padding: '18px 55px',
                        backgroundColor: 'var(--primary-color)', color: '#fff',
                        textDecoration: 'none', fontSize: '12px', letterSpacing: '4px',
                        fontWeight: '700', textTransform: 'uppercase', borderRadius: '100px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transition: 'all 0.3s'
                    }}>Explore Plans</a>
                </div>
            </div>

            {/* Benefits Strip */}
            <div style={{ backgroundColor: '#111', padding: '50px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'center' }}>
                    {[
                        { icon: '✦', title: 'Tiered Ritual Discounts', desc: 'Personalized benefits per level' },
                        { icon: '◈', title: 'Priority Selection', desc: 'Secure your preferred artisans' },
                        { icon: '❋', title: 'Signature Perks', desc: 'Exclusive seasonal curated gifts' },
                        { icon: '◇', title: 'Birthday Traditions', desc: 'Special celebrations on your day' }
                    ].map((b, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '22px', color: 'var(--primary-color)', marginBottom: '12px' }}>{b.icon}</div>
                            <h5 style={{ color: '#fff', fontFamily: '"Playfair Display", serif', fontSize: '17px', margin: '0 0 8px' }}>{b.title}</h5>
                            <p style={{ color: '#666', fontSize: '13px', margin: 0, fontWeight: '300' }}>{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Plans Section */}
            <div id="plans" style={{ padding: '120px 20px', backgroundColor: '#fafaf9' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <span style={{ fontSize: '12px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '20px', fontWeight: '600' }}>Choose Your Level</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: '"Playfair Display", serif', margin: 0, lineHeight: '1.1' }}>
                            Membership <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Plans</span>
                        </h2>
                    </div>

                    {plans.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '18px' }}>
                            Membership plans coming soon. Contact us to know more.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                            {plans.map((plan, idx) => (
                                <div key={plan._id} style={{
                                    backgroundColor: idx === 1 ? '#111' : '#fff',
                                    borderRadius: '16px', padding: '50px 40px',
                                    boxShadow: idx === 1 ? '0 40px 80px rgba(0,0,0,0.15)' : '0 8px 30px rgba(0,0,0,0.06)',
                                    border: idx === 1 ? 'none' : '1px solid #f1f5f9',
                                    transform: idx === 1 ? 'scale(1.04)' : 'scale(1)',
                                    position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
                                    display: 'flex', flexDirection: 'column'
                                }}>
                                    {idx === 1 && (
                                        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'var(--primary-color)', color: '#fff', fontSize: '10px', padding: '5px 12px', borderRadius: '100px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Popular
                                        </div>
                                    )}
                                    <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', margin: '0 0 8px', color: idx === 1 ? '#fff' : '#1a1a1a' }}>{plan.planName}</h3>
                                    <p style={{ color: idx === 1 ? '#888' : '#94a3b8', fontSize: '13px', margin: '0 0 30px' }}>{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''} membership</p>
                                    <div style={{ marginBottom: '35px' }}>
                                        <span style={{ fontSize: '48px', fontWeight: '800', color: idx === 1 ? '#fff' : '#1a1a1a' }}>₹{plan.price.toLocaleString()}</span>
                                    </div>

                                    <div style={{ borderTop: `1px solid ${idx === 1 ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}`, paddingTop: '30px', marginBottom: '35px', flex: 1 }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                             <span style={{ color: '#c9a96e', fontWeight: '700' }}>✓</span>
                                             <span style={{ fontSize: '14px', color: idx === 1 ? '#ccc' : '#475569', fontWeight: '600' }}>{plan.discount}% off on all services</span>
                                         </div>
                                        {(plan.benefits || []).map((b, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                                <span style={{ color: '#c9a96e', fontWeight: '700' }}>✓</span>
                                                <span style={{ fontSize: '14px', color: idx === 1 ? '#ccc' : '#475569' }}>{b}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => handleBuyPlan(plan)}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'center', padding: '16px',
                                            borderRadius: '8px', border: idx === 1 ? 'none' : '1px solid #1a1a1a',
                                            fontWeight: '700', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase',
                                            backgroundColor: idx === 1 ? 'var(--primary-color)' : 'transparent',
                                            color: idx === 1 ? '#fff' : '#1a1a1a',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >Get Started</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

             {/* Ritual of Excellence Callout */}
             <div style={{ padding: '100px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
                 <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                     <div style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: 'rgba(201, 169, 110, 0.1)', color: '#c9a96e', fontSize: '11px', fontWeight: '700', borderRadius: '100px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px' }}>The Ritual of Excellence</div>
                     <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: '"Playfair Display", serif', margin: '0 0 25px', color: '#1a1a1a', letterSpacing: '-1px' }}>Synergy in Every Session</h2>
                     <p style={{ color: '#666', fontSize: '17px', fontWeight: '300', lineHeight: '1.8', marginBottom: '45px' }}>
                         As a valued member, your tier-specific privileges are seamlessly integrated into our billing system. 
                         Experience the convenience of automatic discount application on all signature services — 
                         allowing you to focus entirely on your transformation.
                     </p>
                     <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Link to="/contact" style={{
                            display: 'inline-block', padding: '18px 45px',
                            backgroundColor: '#111', color: '#fff', textDecoration: 'none',
                            fontSize: '11px', letterSpacing: '3px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '4px'
                        }}>Consult an Artisan</Link>
                        <Link to="/profile" style={{
                            display: 'inline-block', padding: '18px 45px',
                            backgroundColor: 'transparent', color: '#111', textDecoration: 'none',
                            fontSize: '11px', letterSpacing: '3px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '4px', border: '1px solid #111'
                        }}>View My Benefits</Link>
                     </div>
                 </div>
             </div>

            <Footer />

            <style>{`
                #plans [style*="scale(1)"]:hover { transform: scale(1.02) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important; }
            `}</style>
        </div>
    );
};

export default Membership;
