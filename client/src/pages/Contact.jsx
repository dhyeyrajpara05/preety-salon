import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MultiSelect from '../components/MultiSelect';

const Contact = () => {
    const [formData, setFormData] = React.useState({
        fullname: '',
        email: '',
        phone: '',
        service: [],
        message: ''
    });
    const [status, setStatus] = React.useState({ loading: false, success: false, error: '' });
    const [services, setServices] = React.useState([]);
    const [loadingServices, setLoadingServices] = React.useState(true);

    React.useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: '' });
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus({ loading: false, success: true, error: '' });
                setFormData({ fullname: '', email: '', phone: '', service: '', message: '' });
                setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
            } else {
                const data = await res.json();
                setStatus({ loading: false, success: false, error: data.message || 'Failed to send inquiry' });
            }
        } catch (error) {
            setStatus({ loading: false, success: false, error: 'Server error. Please try again.' });
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '0px',
        fontFamily: '"Jost", sans-serif',
        fontSize: '14px',
        color: '#111',
        outline: 'none',
        transition: 'all 0.4s ease',
        marginBottom: '20px'
    };

    return (
        <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh', fontFamily: '"Jost", sans-serif', color: '#111', overflowX: 'hidden' }}>
            <Navbar />

            {/* --- CONTACT HERO --- */}
            <div style={{
                height: '70vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=2000)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5,
                    filter: 'brightness(0.8) contrast(1.1)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(250,250,249,1))',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '900px', padding: '0 20px' }}>
                    <span style={{ fontSize: '12px', letterSpacing: '8px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '30px', fontWeight: '600' }}>
                        Inquiry Ritual
                    </span>
                    <h1 style={{ 
                        fontSize: 'clamp(3rem, 8vw, 6.5rem)', 
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: '400',
                        color: '#fff',
                        margin: 0,
                        lineHeight: '1',
                        letterSpacing: '-2px'
                    }}>
                        Connect With <br/>
                        <span style={{ fontStyle: 'italic', fontWeight: '300', color: 'var(--primary-color)' }}>Preety Salon</span>
                    </h1>
                </div>
            </div>

            {/* --- CONTACT GRID --- */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 20px 150px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
                    
                    {/* --- DETAILS SECTION --- */}
                    <div style={{ paddingRight: '40px' }} className="reveal-left">
                        <div style={{ marginBottom: '80px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '25px' }}>
                                The Physical Sanctuary
                            </span>
                            <h2 style={{ fontSize: '42px', fontFamily: '"Playfair Display", serif', marginBottom: '30px', color: '#111' }}>
                                Visit Our Studio
                            </h2>
                            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', fontWeight: '300', marginBottom: '40px' }}>
                                Located in the heart of Surat at Soham Arcade, our salon is designed to be your escape from the everyday.
                            </p>
                            <div style={{ padding: '30px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                                <div style={{ marginBottom: '25px' }}>
                                    <h4 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', color: '#888' }}>Surat Flagship</h4>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#111' }}>
                                        301, Soham Arcade, Green City Rd, <br/>
                                        nr. Bagban Circle, Surat, Gujarat 394510
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '40px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', color: '#888' }}>Direct Call</h4>
                                        <p style={{ fontSize: '16px', color: '#111', fontWeight: '500' }}>+91 99244 33195</p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', color: '#888' }}>Digital Mail</h4>
                                        <p style={{ fontSize: '16px', color: '#111', fontWeight: '500' }}>preetysalon@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '25px' }}>
                                Ritual Hours
                            </span>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {[
                                    { day: 'Wednesday - Monday', hours: '10:00 AM — 09:00 PM' },
                                    { day: 'Tuesday', hours: 'Studio Closed', highlight: true }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '500', color: item.highlight ? 'var(--primary-color)' : '#111' }}>{item.day}</span>
                                        <span style={{ fontSize: '15px', color: '#666' }}>{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- FORM SECTION --- */}
                    <div style={{ 
                        padding: '60px', 
                        backgroundColor: '#fff', 
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.05)',
                        position: 'relative',
                        zIndex: 2
                    }} className="reveal-right">
                        <h3 style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', marginBottom: '15px' }}>Send An Inquiry</h3>
                        <p style={{ fontSize: '15px', color: '#777', marginBottom: '40px', fontWeight: '300' }}>
                            Tell us about your beauty goals, and our artisans will curate the perfect ritual for you.
                        </p>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Full Name *" 
                                    style={inputStyle} 
                                    className="contact-input" 
                                    required 
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email Address *" 
                                    style={inputStyle} 
                                    className="contact-input" 
                                    required 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <input 
                                type="tel" 
                                placeholder="Phone Number" 
                                style={inputStyle} 
                                className="contact-input" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <MultiSelect 
                                options={services}
                                selectedValues={formData.service}
                                onChange={(values) => setFormData({ ...formData, service: values })}
                                placeholder="Select Signature Rituals"
                                loading={loadingServices}
                            />
                            <textarea 
                                placeholder="Your Message or Wishes..." 
                                style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} 
                                className="contact-input"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                            
                            {status.success && (
                                <div style={{ color: '#059669', marginBottom: '20px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                                    ✨ Your inquiry has been dispatched to our artisans. We will reach out shortly.
                                </div>
                            )}
                            {status.error && (
                                <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                                    ❌ {status.error}
                                </div>
                            )}

                            <button type="submit" disabled={status.loading} style={{
                                width: '100%',
                                padding: '22px',
                                backgroundColor: status.loading ? '#666' : '#111',
                                color: '#fff',
                                border: 'none',
                                fontSize: '13px',
                                letterSpacing: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                cursor: status.loading ? 'not-allowed' : 'pointer'
                            }} className="contact-submit-btn">
                                {status.loading ? 'Dispatching...' : 'Dispatch Ritual Inquiry'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* --- MAP SECTION --- */}
            <div style={{ width: '100%', height: '500px', backgroundColor: '#eee', opacity: 0.9 }}>
                <iframe 
                    title="Preety Salon Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4116045544!2d72.7745771!3d21.1360145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fbc51e89f93%3A0x6a053de15764c004!2sPreety%20Salon!5e0!3m2!1sen!2sin!4v1709923853110!5m2!1sen!2sin&q=Preety+Salon+Soham+Arcade" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.95)' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <Footer />

            <style>{`
                .contact-input:focus {
                    background-color: #fff !important;
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .contact-submit-btn:hover {
                    background-color: var(--primary-color) !important;
                    color: #fff !important;
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(229, 227, 66, 0.2);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .reveal-left { animation: fadeInUp 1s ease-out both; }
                .reveal-right { animation: fadeInUp 1s ease-out 0.2s both; }
                @media (max-width: 768px) {
                    .reveal-left { padding-right: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default Contact;
