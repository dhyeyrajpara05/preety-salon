import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section spa-footer">
            <div className="container">
                <div className="footer-button-area">
                    <div className="row g-4 mb-100">
                        <div className="col-lg-4 col-md-6">
                            <Link className="primary-btn1 footer-btn" to="/book-appointment">
                                BOOK AN APPOINTMENT
                                <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                        stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <Link className="primary-btn1 footer-btn" to="/services">
                                ASK ANY QUESTIONS
                                <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                        stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <a className="primary-btn1 footer-btn" href="mailto:preetysalon@gmail.com">
                                EMAIL - preetysalon@gmail.com
                                <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                        stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row g-lg-4 gy-5 mb-70">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-logo-section">
                            <div className="footer-top-section">
                                <Link to="/" className="footer-logo" style={{ textDecoration: 'none' }}>
                                    <span style={{
                                        fontFamily: '"EB Garamond", serif',
                                        fontSize: '26px',
                                        fontWeight: '700',
                                        letterSpacing: '3px',
                                        lineHeight: '1',
                                        textTransform: 'uppercase',
                                        textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                                        display: 'inline-block',
                                    }}>
                                        <span style={{ color: '#ffffff' }}>PREETY</span>
                                        <span style={{ color: '#e5e342', marginLeft: '6px' }}>SALON</span>
                                    </span>
                                </Link>
                                <p><a href="https://maps.app.goo.gl/edVGHhGyvUAH9axD7" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>301, Preety Salon, Soham Arcade, Green City Rd, nr. Bagban Circle, Surat, Gujarat 394510</a></p>
                                <ul style={{ display: 'flex', gap: '15px' }}>
                                    <li>
                                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                            <svg width="6" height="12" viewBox="0 0 6 12" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.81526 11.2483V6.46735H5.42818L5.66793 4.59543H3.81526V3.4031C3.81526 2.86293 3.96576 2.4931 4.74101 2.4931H5.72334V0.824182C5.24538 0.77296 4.76495 0.748228 4.28426 0.750099C2.85859 0.750099 1.87976 1.62043 1.87976 3.21818V4.59193H0.277344V6.46385H1.88326V11.2483H3.81526Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/preety_salon_surat" target="_blank" rel="noopener noreferrer">
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.844.047 1.097.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.844.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                                <div className="footer-contact-section">
                                    <div className="call-now-section">
                                        <span>Call Now</span>
                                        <h4><a href="tel:9924433195">9924433195</a></h4>
                                    </div>
                                    <p>N:B - Tuesday Closed,<span> otherswsie you can call anytime within opening hours.</span></p>
                                </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 d-flex justify-content-xl-end justify-content-lg-center justify-content-md-end">
                        <div className="footer-list">
                            <div className="footer-widget">
                                <div className="widget-title">
                                    <h4>QUICK LINKS</h4>
                                </div>
                                <ul className="widget-list">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/services">Services</Link></li>
                                    <li><Link to="/products">Products</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                    <li><Link to="/profile">My Account</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 d-flex justify-content-lg-end">
                        <div className="footer-list">
                            <div className="footer-widget">
                                <div className="widget-title">
                                    <h4>OPENING HOURS</h4>
                                </div>
                                <ul>
                                    <li>
                                        WED - MON <span>(10AM - 9PM)</span>
                                    </li>
                                    <li>
                                        TUESDAY- <span>CLOSED</span>
                                    </li>
                                </ul>
                                <p className="star-text"><span className="star-icon">*</span>Visit our Preety Salon &amp; take your favourite beauty &amp; spa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-btm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="footer-btm-content">
                                <div className="copyright-area">
                                    <p> © Copyright 2026 <Link to="/"> Preety Salon </Link> | All Right
                                        Reserved </p>
                                </div>
                                <div className="right-area">
                                    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                d="M0 5.99981C0 5.83405 0.0632157 5.67508 0.17574 5.55787C0.288264 5.44066 0.44088 5.37481 0.600014 5.37481H8.7518L6.17534 2.69231C6.06267 2.57496 5.99938 2.41578 5.99938 2.24981C5.99938 2.08384 6.06267 1.92467 6.17534 1.80731C6.28801 1.68995 6.44081 1.62402 6.60015 1.62402C6.75948 1.62402 6.91229 1.68995 7.02496 1.80731L10.625 5.55731C10.6809 5.61537 10.7252 5.68434 10.7555 5.76027C10.7857 5.8362 10.8013 5.9176 10.8013 5.99981C10.8013 6.08202 10.7857 6.16342 10.7555 6.23935C10.7252 6.31529 10.6809 6.38426 10.625 6.44231L7.02496 10.1923C6.91229 10.3097 6.75948 10.3756 6.60015 10.3756C6.44081 10.3756 6.28801 10.3097 6.17534 10.1923C6.06267 10.075 5.99938 9.91578 5.99938 9.74981C5.99938 9.58384 6.06267 9.42467 6.17534 9.30731L8.7518 6.62481H0.600014C0.44088 6.62481 0.288264 6.55897 0.17574 6.44176C0.0632157 6.32455 0 6.16557 0 5.99981Z" />
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                d="M11.3998 1C11.559 1 11.7116 1.06585 11.8241 1.18306C11.9366 1.30027 11.9998 1.45924 11.9998 1.625V10.375C11.9998 10.5408 11.9366 10.6997 11.8241 10.8169C11.7116 10.9342 11.559 11 11.3998 11C11.2407 11 11.0881 10.9342 10.9755 10.8169C10.863 10.6997 10.7998 10.5408 10.7998 10.375V1.625C10.7998 1.45924 10.863 1.30027 10.9755 1.18306C11.0881 1.06585 11.2407 1 11.3998 1Z" />
                                        </g>
                                    </svg>
                                    <p>Our Business <Link to="#"> Policy, Terms &amp; Condition</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
