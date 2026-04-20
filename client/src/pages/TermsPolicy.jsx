import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPolicy = () => {
    return (
        <div style={{ background: '#08090b', color: '#ffffff', minHeight: '100vh' }}>
            <Navbar />
            
            {/* Hero Section */}
            <div className="spa-banner-section" 
                style={{ 
                    backgroundImage: "linear-gradient(180deg, rgba(8, 9, 11, 0.7), rgba(8, 9, 11, 0.9)), url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2070')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '120px 0 80px'
                }}>
                <div className="container text-center">
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#e5e342', marginBottom: '20px' }}>
                        Terms & Policy
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>
                        Your trust is our priority. Please read our terms and conditions carefully to understand how we serve you.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-5" style={{ marginBottom: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '60px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                            
                            <section className="mb-5">
                                <h3 style={{ color: '#e5e342', marginBottom: '20px' }}>1. Introduction</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                                    Welcome to Preety Salon. By accessing our website and booking our services, you agree to be bound by these Terms and Conditions. Our services are provided with the utmost care and professionalism to ensure your relaxation and beauty needs are met.
                                </p> Section
                            </section>

                            <section className="mb-5">
                                <h3 style={{ color: '#e5e342', marginBottom: '20px' }}>2. Appointment & Cancellation</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                                    Appointments are highly recommended. We value your time and ours; therefore, we require a minimum of 24 hours' notice for any cancellations or profile changes. Late cancellations may be subject to a fee.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h3 style={{ color: '#e5e342', marginBottom: '20px' }}>3. Privacy Policy</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                                    We respect your privacy. All personal information collected (name, contact, gender) is used solely for appointment management and providing personalized services. We never share your data with third parties without your explicit consent.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h3 style={{ color: '#e5e342', marginBottom: '20px' }}>4. Health & Safety</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                                    Please inform our staff of any medical conditions, allergies, or physical restrictions before your treatment. We maintain strict hygiene standards to ensure a safe and sanitary environment for all guests.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h3 style={{ color: '#e5e342', marginBottom: '20px' }}>5. Payment Terms</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                                    All prices are subject to change without notice. We accept various payment methods including cash, credit/debit cards, and digital wallets. Membership benefits are non-transferable and subject to tier-specific rules.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsPolicy;
