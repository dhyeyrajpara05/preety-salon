import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroVideo from '../assets/image/beauty-spa/bgvid2.mp4';

const Home = () => {
    return (
        <>
            <Navbar />
            <style>{`
                .home-surface {
                    transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease, background-color 240ms ease;
                    will-change: transform;
                }

                .home-surface:hover {
                    transform: translate3d(0, -10px, 0);
                }

                .home-review-card:hover {
                    box-shadow: 0 24px 48px rgba(0,0,0,0.08);
                    border-color: #e5e342;
                }

                .home-info-card:hover {
                    background: rgba(255, 255, 255, 0.88) !important;
                    border-color: rgba(229, 227, 66, 0.45) !important;
                    box-shadow: 0 24px 48px rgba(0,0,0,0.08) !important;
                }

                .home-outline-button:hover {
                    background: #1a1a1a !important;
                    color: #fff !important;
                }

                .home-cta-button:hover {
                    transform: translate3d(0, -6px, 0) scale(1.02) !important;
                    box-shadow: 0 30px 60px rgba(229, 227, 66, 0.24) !important;
                    letter-spacing: 5px !important;
                }

                @media (max-width: 991px) {
                    .home-parallax-section {
                        background-attachment: scroll !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .home-surface,
                    .home-outline-button,
                    .home-cta-button {
                        transition: none !important;
                    }
                }
            `}</style>

            {/* Banner section - Video Background */}
            <div className="spa-banner-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        filter: 'brightness(0.75) contrast(1.1)',
                    }}
                    src={heroVideo}
                />
                {/* Dark overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.65) 100%)',
                    zIndex: 1,
                }} />
                {/* Content */}
                <div className="banner-wrapper" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 d-flex justify-content-center">
                                <div className="banner-content text-center">
                                    <h1>PREETY SALON Elegance Perfected</h1>
                                    <p>A refined unisex salon experience designed for those who expect nothing but perfection.</p>
                                    <Link className="primary-btn4 breadcram-btn" to="/services">
                                        VIEW All TREATMENTS
                                        <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Banner section ends */}

            {/* Frosted Parallax Key info section */}
            <div className="kye-info-section home-parallax-section" style={{ 
                position: 'relative',
                padding: '120px 0',
                backgroundImage: "url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=2070)",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'scroll',
                overflow: 'hidden'
            }}>
                {/* Frosted glass overlay for the entire section */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(255, 255, 255, 0.92)',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row g-4">
                        {[
                            {
                                icon: (
                                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#e5e342" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 3h12l4 6-10 12L2 9l4-6z"></path>
                                        <path d="M11 3l-4 6 5 11 5-11-4-6"></path>
                                        <path d="M2 9h20"></path>
                                    </svg>
                                ),
                                title: "SIGNATURE BEAUTY EXPERIENCE",
                                desc: "At Pretty Salon, every service is designed to enhance your natural elegance. From precision hair styling to flawless makeup artistry."
                            },
                            {
                                icon: (
                                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#e5e342" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="6" cy="6" r="3"></circle>
                                        <path d="M8.12 8.12 12 12"></path>
                                        <path d="M20 4 8.12 15.88"></path>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <path d="M8.12 15.88 12 12"></path>
                                        <path d="M20 20 8.12 8.12"></path>
                                    </svg>
                                ),
                                title: "COMPLETE UNISEX GROOMING",
                                desc: "Luxury grooming for both men and women. Haircuts, beard styling, skin treatments, and advanced beauty services — all in one destination."
                            },
                            {
                                icon: (
                                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#e5e342" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        <path d="M9 12l2 2 4-4"></path>
                                    </svg>
                                ),
                                title: "ELITE HYGIENE & SAFETY",
                                desc: "We maintain the highest standards of cleanliness and professional care, ensuring every visit is safe, relaxing, and indulgent."
                            },
                            {
                                icon: (
                                    <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#e5e342" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                                    </svg>
                                ),
                                title: "PREMIUM RESULTS THAT LAST",
                                desc: "Our expert techniques and high-quality products deliver long-lasting beauty and confidence — because luxury should never fade."
                            }
                        ].map((info, idx) => (
                            <div key={idx} className="col-lg-3 col-md-6">
                                <div className="info-card-wrap" style={{ height: '100%' }}>
                                    <div className="info-card-frosted home-surface home-info-card" style={{
                                        background: 'rgba(255, 255, 255, 0.4)',
                                        border: '1px solid rgba(255, 255, 255, 0.6)',
                                        borderRadius: '30px',
                                        padding: '50px 35px',
                                        height: '100%',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                                    }}>
                                        <div className="info-image-wrap" style={{ 
                                            marginBottom: '35px',
                                            padding: '20px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                            border: '1px solid #f1f1f1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {info.icon}
                                        </div>
                                        <h5 style={{ 
                                            color: '#1e1e1e', 
                                            fontSize: '14px', 
                                            letterSpacing: '3px', 
                                            marginBottom: '20px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>{info.title}</h5>
                                        <p style={{ 
                                            color: '#595959', 
                                            fontSize: '15px', 
                                            lineHeight: '1.8',
                                            fontWeight: '400'
                                        }}>{info.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Key info section ends */}

            {/* Social & Reviews Section (Replacing Couture Gallery) */}
            <div className="social-review-section" style={{ 
                padding: '100px 0', 
                background: '#ffffff', 
                overflow: 'hidden' 
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="text-center mb-80">
                        <span style={{ color: '#b5b08d', letterSpacing: '12px', fontWeight: '500', fontSize: '10px', display: 'block', marginBottom: '25px', textTransform: 'uppercase' }}>Voices of Elegance</span>
                        <h2 style={{ color: '#1a1a1a', fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '300', lineHeight: '1.2' }}>
                            TRACING <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#e5e342' }}>STORIES</span> <br /> OF TRANSFORMATION.
                        </h2>
                    </div>

                    <div className="row g-4">
                        {[
                            { name: "Leena Karia", role: "Bridal Client", text: "Had a great experience at my niece's wedding. They were very professional and gave great suggestions for hair and make up. Was extremely happy with the end result! Great team!!", stars: 5 },
                            { name: "Ritu Shah", role: "Bridal Makeup", text: "The best bridal makeup in Surat. They truly made me look like a queen on my special day. Sangeeta's attention to saree draping and hair was absolutely perfect.", stars: 5 },
                            { name: "Shaily Pastor", role: "Google Reviewer", text: "Awesome time management, clean parlour, and they always give first priority to the client. Well behaved staff and an amazing experience overall.", stars: 5 },
                            { name: "Sturdex Infra", role: "Google Reviewer", text: "My visit was absolutely delightful. The ambience is soothing, the staff is highly skilled, and every service is done with perfection and patience. 🌸✨", stars: 5 },
                            { name: "Purva Pandya", role: "Verified Client", text: "Visited for the first time and I'm truly impressed! The stylist really understood my haircut perfectly—it was like magic. They absolutely live up to their name.", stars: 5 },
                            { name: "Pallavi Roy", role: "Google Reviewer", text: "Loved the service. The staff is professional and efficient. The salon has an aesthetically pleasing and relaxing environment. Highly recommend!", stars: 5 }
                        ].map((review, i) => (
                            <div key={i} className="col-lg-4 col-md-6">
                                <div className="review-card home-surface home-review-card" style={{ 
                                    padding: '50px 40px', 
                                    background: '#fcfcfc', 
                                    borderRadius: '32px', 
                                    border: '1px solid #f0f0f0',
                                    height: '100%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '30px' }}>
                                        {[...Array(review.stars)].map((_, s) => (
                                            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#e5e342">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p style={{ color: '#333', fontSize: '18px', fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: '1.8', marginBottom: '40px', flexGrow: 1 }}>
                                        "{review.text}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: 'auto' }}>
                                        <div style={{ width: '45px', height: '1px', background: '#b5b08d' }}></div>
                                        <div>
                                            <h5 style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '900', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{review.name}</h5>
                                            <span style={{ color: '#b5b08d', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-80">
                        <a href="https://www.google.com/maps/place/Preety+Salon/@21.1896065,72.7711217,17z/data=!4m8!3m7!1s0x3be04d7d42ae0bfb:0x8ab64f930fb834a6!8m2!3d21.1896065!4d72.7711217!9m1!1b1!16s%2Fg%2F11f7805ry5" target="_blank" rel="noopener noreferrer" className="home-outline-button perf-button" style={{ 
                            padding: '16px 60px', 
                            border: '1px solid #1a1a1a',
                            color: '#1a1a1a', 
                            fontSize: '11px', 
                            fontWeight: '900', 
                            letterSpacing: '5px', 
                            textTransform: 'uppercase', 
                            textDecoration: 'none', 
                            display: 'inline-block'
                        }}>
                            View All 300+ Google Reviews
                        </a>
                    </div>
                </div>
            </div>
            {/* Gallery section ends */}

            {/* Frosted Video section */}
            <div className="spa-video-area" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="spa-video-wrapper" style={{ position: 'relative', height: '80vh', minHeight: '600px' }}>
                    <video 
                        autoPlay loop muted playsInline preload="metadata"
                        src="https://demo.egenslab.com/html/buret/preview/assets/video/beauty-and-spa.mp4"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    ></video>
                    
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(255, 255, 255, 0.18)',
                        zIndex: 1
                    }}></div>

                    <div className="spa-video-content-wrap" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center' }}>
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-7">
                                    <div className="video-left-content" style={{ padding: '60px 50px', background: 'rgba(255, 255, 255, 0.86)', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                                        <h2 style={{ color: '#1e1e1e', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: '"Playfair Display", serif', lineHeight: '1.1', marginBottom: '35px', fontWeight: '300' }}>
                                            Elevating Mind, <br />
                                            <span style={{ color: '#e5e342', fontStyle: 'italic', fontWeight: '400' }}>Body, & Soul</span>
                                        </h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ width: '50px', height: '2px', background: '#e5e342' }}></div>
                                            <span style={{ color: '#1e1e1e', fontSize: '14px', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: '800' }}>PRITI RAJPARA</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 offset-lg-1">
                                    <div className="video-right-content" style={{ padding: '60px 45px', background: 'rgba(255, 255, 255, 0.86)', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', color: '#1e1e1e' }}>
                                        <div style={{ marginBottom: '45px' }}>
                                            <h6 style={{ color: '#e5e342', fontSize: '12px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '900' }}>Opening Hours</h6>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                <li style={{ fontSize: '26px', fontFamily: '"Playfair Display", serif', marginBottom: '10px' }}>Wed - Mon</li>
                                                <li style={{ fontSize: '18px', color: '#595959', fontWeight: '400' }}>10:00 AM — 09:00 PM</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h6 style={{ color: '#e5e342', fontSize: '12px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '900' }}>Direct Contact</h6>
                                            <span style={{ fontSize: '30px', fontFamily: '"Playfair Display", serif' }}><a href="tel:9924433195" style={{ color: '#1e1e1e', textDecoration: 'none' }}>99244 33195</a></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Serenity Divider */}
            <div className="serenity-divider" style={{ 
                padding: '50px 0', 
                background: '#f9f9f9', 
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h3 style={{ 
                                fontFamily: '"Playfair Display", serif', 
                                fontSize: '32px', 
                                fontStyle: 'italic', 
                                fontWeight: '300', 
                                color: '#1a1a1a', 
                                lineHeight: '1.6' 
                            }}>
                                "In every treatment, there is a path to serenity. <br /> In every detail, there is a 
                                <span style={{ color: '#e5e342', fontWeight: '400', fontStyle: 'normal' }}> promise of perfection."</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            {/* Video section ends */}

            {/* Enhanced Offer Section */}
            <div className="spa-offer-section home-parallax-section" style={{
                position: 'relative',
                padding: '100px 0',
                backgroundImage: "url(https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=2069)",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'scroll',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8))',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '100px 40px',
                                borderRadius: '50px',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.4)',
                                animation: 'revealUp 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
                            }}>
                                <div style={{ 
                                    width: '100px', height: '100px', 
                                    background: 'rgba(229, 227, 66, 0.1)', 
                                    borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    margin: '0 auto 50px auto',
                                    border: '1px solid rgba(229, 227, 66, 0.2)',
                                    boxShadow: '0 0 40px rgba(229, 227, 66, 0.1)'
                                }}>
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#e5e342" strokeWidth="1.2">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                                    </svg>
                                </div>

                                <span style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    letterSpacing: '8px',
                                    textTransform: 'uppercase',
                                    color: '#e5e342',
                                    marginBottom: '40px',
                                    opacity: 0.9
                                }}>
                                    Premium Experience
                                </span>

                                <h2 style={{
                                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                                    fontFamily: '"Playfair Display", serif',
                                    color: '#fff',
                                    lineHeight: '1.1',
                                    marginBottom: '45px',
                                    fontWeight: '300',
                                    letterSpacing: '-1px'
                                }}>
                                    Every new guest enjoys a <br />
                                    <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#e5e342' }}>20% Reward</span> <span style={{fontWeight: '200'}}>on their first visit.</span>
                                </h2>

                                <p style={{
                                    fontSize: '19px',
                                    color: 'rgba(255,255,255,0.7)',
                                    maxWidth: '650px',
                                    margin: '0 auto 60px auto',
                                    lineHeight: '1.9',
                                    fontWeight: '300',
                                    letterSpacing: '0.5px'
                                }}>
                                    Redefining luxury through precision and passion. Step into a world where your beauty is our masterwork.
                                </p>

                                <Link to="/book-appointment" className="home-cta-button perf-button" style={{
                                    display: 'inline-block',
                                    padding: '26px 70px',
                                    backgroundColor: '#e5e342',
                                    color: '#111',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    fontWeight: '900',
                                    letterSpacing: '4px',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    boxShadow: '0 25px 50px rgba(229, 227, 66, 0.15)'
                                }}>
                                    Claim Your Privilege
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes revealUp {
                        from { opacity: 0; transform: translateY(80px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
            {/* Offer section ends */}

            <Footer />
        </>
    );
};

export default Home;
