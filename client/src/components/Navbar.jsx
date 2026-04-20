import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const scrollPos = useRef(0);
    const ticking = useRef(false);
    const visibleRef = useRef(true);
    const stickyRef = useRef(false);
    const location = useLocation();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        setIsLoggedIn(!!userObj);

        const fetchUnread = async () => {
            if (userObj && userObj.userid) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${userObj.userid}`);
                    if (res.ok) {
                        const data = await res.json();
                        setUnreadCount(data.filter(n => !n.isRead).length);
                    }
                } catch (error) {
                    console.error('Error fetching unread count:', error);
                }
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchUnread();
        fetchCategories();
        const interval = setInterval(() => {
            fetchUnread();
            fetchCategories();
        }, 30000);

        const updateScrollState = () => {
            const currentScrollPos = window.scrollY || document.documentElement.scrollTop || 0;
            const nextSticky = currentScrollPos > 50;

            if (stickyRef.current !== nextSticky) {
                stickyRef.current = nextSticky;
                setIsSticky(nextSticky);
            }

            const threshold = 15;
            const diff = currentScrollPos - scrollPos.current;
            let nextVisible = visibleRef.current;

            if (currentScrollPos <= 100) {
                nextVisible = true;
            } else if (Math.abs(diff) > threshold) {
                nextVisible = diff < 0;
                scrollPos.current = currentScrollPos;
            }

            if (visibleRef.current !== nextVisible) {
                visibleRef.current = nextVisible;
                setIsVisible(nextVisible);
            }

            ticking.current = false;
        };

        const handleScroll = () => {
            if (ticking.current) {
                return;
            }

            ticking.current = true;
            window.requestAnimationFrame(updateScrollState);
        };

        updateScrollState();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div id="navbar-top-level">
            <style>{`
                .header-area.spa.buret {
                    position: fixed !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    z-index: 99999 !important;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease, box-shadow 0.4s ease !important;
                }
                .nav-visible {
                    transform: translateY(0%) !important;
                }
                .nav-hidden {
                    transform: translateY(-100%) !important;
                }
                .sub-menu .sub-menu {
                    display: none; /* Disable old nested logic */
                }
                .mega-menu {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(20px);
                    width: 90vw;
                    max-width: 1200px;
                    background: rgba(8, 9, 11, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(229, 227, 66, 0.15);
                    padding: 40px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 30px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    z-index: 1000;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                }
                .menu-list li:hover .mega-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(0);
                }
                .mega-column-title {
                    font-family: '"Playfair Display", serif';
                    font-size: '18px';
                    color: 'var(--primary-color)';
                    text-transform: 'uppercase';
                    letter-spacing: '2px';
                    margin-bottom: '20px';
                    border-bottom: '1px solid rgba(229, 227, 66, 0.1)';
                    padding-bottom: '10px';
                    display: block;
                    text-decoration: none;
                }
                .mega-category {
                    margin-bottom: 20px;
                }
                .mega-category-name {
                    font-size: 13px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 10px;
                    display: block;
                    letter-spacing: 1px;
                }
                .mega-subcategory-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .mega-subcategory-list li {
                    margin-bottom: 6px;
                }
                .mega-subcategory-list a {
                    font-size: 12px !important;
                    color: rgba(255,255,255,0.5) !important;
                    text-transform: none !important;
                    letter-spacing: 0.5px !important;
                    transition: color 0.3s ease;
                    padding: 0 !important;
                    display: inline-block !important;
                }
                .mega-subcategory-list a:hover {
                    color: var(--primary-color) !important;
                }
                @media (max-width: 1199px) {
                    .mega-menu {
                        position: static;
                        transform: none;
                        width: 100%;
                        opacity: 1;
                        visibility: visible;
                        display: block;
                        padding: 20px;
                        background: transparent;
                        border: none;
                        box-shadow: none;
                    }
                    .mega-column { margin-bottom: 30px; }
                }
                
                /* Mobile Responsiveness Overrides */
                @media (max-width: 1199px) {
                    .mobile-menu-btn {
                        display: flex !important;
                        visibility: visible !important;
                    }
                    .main-menu {
                        position: fixed !important;
                        top: 0 !important;
                        left: -300px !important;
                        width: 280px !important;
                        height: 100vh !important;
                        background: #08090b !important;
                        z-index: 100000 !important;
                        transition: left 0.3s ease !important;
                        overflow-y: auto !important;
                        padding: 20px !important;
                        border-right: 1px solid rgba(255,255,255,0.1);
                    }
                    .main-menu.show-menu {
                        left: 0 !important;
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                        object-fit: cover !important;
                    }
                    .banner-area {
                        min-height: 100svh !important;
                    }
                    .nav-right {
                        margin-left: auto; /* push to right */
                    }
                    .menu-list {
                        display: block !important;
                        margin-top: 50px !important;
                    }
                    .menu-list li {
                        display: block !important;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                        padding: 15px 0 !important;
                    }
                    .menu-list li a {
                        color: #ffffff !important;
                        font-size: 16px !important;
                        display: block;
                    }
                    .sub-menu, .mega-menu {
                        position: static !important;
                        display: none !important;
                    }
                    .menu-list li.active .sub-menu, .menu-list li:active .sub-menu {
                        display: block !important;
                    }
                }

                /* STRICTLY STATIC SITE OVERRIDES */
                .profile-area, 
                .cart-area, 
                a[href*="/product"], 
                a[href*="/cart"], 
                a[href*="/checkout"], 
                a[href*="/book-appointment"],
                a[href*="/login"],
                a[href*="/register"],
                a[href*="/profile"],
                .add-to-cart-btn,
                .booking-button,
                .checkout-button,
                .btn-area {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `}</style>
            <header className={`header-area spa buret ${isSticky ? 'sticky' : ''} ${isVisible ? 'nav-visible' : 'nav-hidden'}`} style={{
                backgroundColor: isSticky ? 'rgba(8, 9, 11, 0.98)' : 'transparent',
                backdropFilter: isSticky ? 'blur(12px)' : 'none',
                boxShadow: isSticky ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
                borderBottom: isSticky ? '1px solid rgba(229, 227, 66, 0.15)' : 'none'
            }}>
                <div className="header-wrapper">
                    <div className="header-logo">
                        <Link to="/" style={{ textDecoration: 'none' }}>
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
                </div>
                <div className={`main-menu ${isMenuOpen ? 'show-menu' : ''}`}>
                    <div className="mobile-menu-logo">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <span style={{
                                fontFamily: '"EB Garamond", serif',
                                fontSize: '24px',
                                fontWeight: '700',
                                letterSpacing: '3px',
                                lineHeight: '1',
                                textTransform: 'uppercase',
                                textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                                display: 'inline-block',
                            }}>
                                <span style={{ color: '#1e1e1e' }}>PREETY</span>
                                <span style={{ color: '#e5e342', marginLeft: '6px' }}>SALON</span>
                            </span>
                        </Link>
                    </div>
                    <ul className="menu-list">
                        <li className={location.pathname === '/' ? "active" : ""}>
                            <Link to="/">HOME</Link>
                        </li>
                        <li className={`${location.pathname.startsWith('/services') ? "active" : ""}`}>
                            <Link to="/services">SERVICES</Link>
                            <ul className="sub-menu">
                                <li className={location.pathname === '/services/women' ? "active" : ""}>
                                    <Link to="/services/women">For Her</Link>
                                </li>
                                <li className={location.pathname === '/services/men' ? "active" : ""}>
                                    <Link to="/services/men">For Him</Link>
                                </li>
                            </ul>
                        </li>

                        <li className={location.pathname === '/packages' ? "active" : ""}>
                            <Link to="/packages">PACKAGES</Link>
                        </li>
                        <li className={`${location.pathname === '/about' || location.pathname === '/membership' ? "active" : ""}`}>
                            <Link to="/about">ABOUT US</Link>
                            <ul className="sub-menu">
                                <li className={location.pathname === '/about' ? "active" : ""}>
                                    <Link to="/about">About Us</Link>
                                </li>
                                <li className={location.pathname === '/membership' ? "active" : ""}>
                                    <Link to="/membership">Membership</Link>
                                </li>
                            </ul>
                        </li>
                        <li className={location.pathname === '/contact' ? "active" : ""}>
                            <Link to="/contact">CONTACT</Link>
                        </li>
                    </ul>
                    <div className="d-xl-none d-block">
                        <div className="mobile-search-area mb-30">
                            <form>
                                <div className="form-inner">
                                    <input type="text" placeholder="Enter your keywords" />
                                    <button type="submit" className="primary-btn1">Search Now</button>
                                </div>
                            </form>
                        </div>
                        <Link className="primary-btn1" to="/book-appointment">
                            BOOK APPOINTMENT
                            <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                    stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="nav-right">
                <ul>
                    <li>
                        <Link to={isLoggedIn ? "/profile" : "/login"} className="profile-area" title={isLoggedIn ? "Profile" : "Login"} style={{ display: 'flex', alignItems: 'center', color: '#ffffff' }}>
                            <div className="user">
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.7135 8.34627C12.8653 7.50628 13.6153 6.14686 13.6153 4.61538C13.6153 2.07046 11.5448 0 8.99989 0C6.45497 0 4.38451 2.07046 4.38451 4.61538C4.38451 6.14686 5.1345 7.50628 6.28629 8.34627C3.42316 9.44191 1.38452 12.2179 1.38452 15.4615C1.38452 16.8613 2.52327 18 3.92298 18H14.0768C15.4765 18 16.6153 16.8613 16.6153 15.4615C16.6153 12.2179 14.5766 9.44191 11.7135 8.34627ZM5.76914 4.61538C5.76914 2.83395 7.21845 1.38463 8.99989 1.38463C10.7813 1.38463 12.2306 2.83395 12.2306 4.61538C12.2306 6.39682 10.7813 7.84617 8.99989 7.84617C7.21845 7.84617 5.76914 6.39682 5.76914 4.61538ZM14.0768 16.6154H3.92298C3.28676 16.6154 2.76915 16.0978 2.76915 15.4615C1.76915 12.0258 5.56421 9.23073 8.99993 9.23073C12.4356 9.23073 15.2307 12.0258 15.2307 15.4615C15.2307 16.0978 14.7131 16.6154 14.0768 16.6154Z" 
                                        fill="currentColor" />
                                </svg>
                            </div>
                        </Link>
                    </li>

                    {isLoggedIn && (
                        <li>
                            <Link to="/notifications" className="profile-area" title="Notifications" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', position: 'relative' }}>
                                <div className="user">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            backgroundColor: '#e5e342', // Match Preety Salon theme
                                            color: '#1e1e1e',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #08090b'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to="/cart" className="cart-area">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.375 4.78125H14.625M6.1875 4.78125V3.51562C6.1875 1.96232 7.44669 0.703125 9 0.703125C10.5533 0.703125 11.8125 1.96232 11.8125 3.51562V4.78125M11.8125 7.59375C11.8125 9.14706 10.5533 10.4062 9 10.4062C7.44669 10.4062 6.1875 9.14706 6.1875 7.59375"
                                    strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <path
                                    d="M14.625 4.78125L16.0201 15.7131C16.0275 15.772 16.0313 15.8313 16.0312 15.8906C16.0312 16.6673 15.4016 17.2969 14.625 17.2969H3.375C2.59836 17.2969 1.96875 16.6673 1.96875 15.8906C1.96875 15.8305 1.97251 15.7712 1.97986 15.7131L3.375 4.78125"
                                    strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </li>
                </ul>
                <div className="btn-area d-xl-flex d-none">
                    <Link className="primary-btn1" to="/book-appointment">
                        BOOK APPOINTMENT
                        <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </Link>
                </div>
                <div
                    className={`sidebar-button mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    role="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setIsMenuOpen((open) => !open);
                        }
                    }}
                >
                    <span></span>
                </div>
            </div>
        </header>
        </div>
    );
};

export default Navbar;
