import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import womenHero from '../assets/image/beauty-spa/feservice.jpg';
import menHero from '../assets/image/beauty-spa/menservice.jpg';

const getCategoryIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('beard') || t.includes('thread')) return '✂';
    if (t.includes('hair') && (t.includes('treat') || t.includes('spa') || t.includes('kera') || t.includes('smooth') || t.includes('botox'))) return '✦';
    if (t.includes('hair') && (t.includes('colour') || t.includes('color') || t.includes('global') || t.includes('highlight'))) return '◈';
    if (t.includes('hair') || t.includes('cleansi') || t.includes('essential')) return '◉';
    if (t.includes('bridal')) return '✿';
    if (t.includes('makeup') || t.includes('mua')) return '◆';
    if (t.includes('skin') || t.includes('facial') || t.includes('clean up') || t.includes('brillare') || t.includes('lotus') || t.includes('03+') || t.includes('mask') || t.includes('d-tan')) return '◯';
    if (t.includes('wax') || t.includes('polish')) return '◇';
    if (t.includes('massage')) return '◈';
    if (t.includes('nail') || t.includes('mani') || t.includes('pedi')) return '✧';
    return '◉';
};

const ACCENT_COLORS = [
    '#c9602e','#6b5ce7','#00b4aa','#e84393','#f59e0b',
    '#10b981','#3b82f6','#ef4444','#8b5cf6','#14b8a6',
    '#f97316','#06b6d4','#84cc16','#ec4899','#a855f7',
    '#22d3ee','#fb923c','#4ade80','#f43f5e',
];

const Services = () => {
    const { gender } = useParams();
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);

    // Fetch rituals
    useEffect(() => {
        setActiveIdx(0);
        setLoading(true);
        setError(null);
        fetch('http://localhost:5000/api/services')
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch services');
                return r.json();
            })
            .then(data => { 
                setAllServices(data); 
                setLoading(false); 
            })
            .catch((err) => {
                console.error(err);
                setError('Unable to load rituals. Please try again.');
                setLoading(false); 
            });
    }, [gender]);

    // Categories memoization
    const categories = useMemo(() => {
        const targetGender = gender || 'women';
        return allServices.filter(s =>
            s.gender === targetGender ||
            s.gender === (targetGender.charAt(0).toUpperCase() + targetGender.slice(1))
        );
    }, [allServices, gender]);

    // Redirect if gender is missing or invalid - AFTER all hooks
    if (!gender || (gender !== 'women' && gender !== 'men')) {
        return <Navigate to="/services/women" replace />;
    }

    const active = categories[activeIdx] || null;
    const isWomen = gender === 'women';
    const heroBg = isWomen ? womenHero : menHero;

    return (
        <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"Jost", sans-serif' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                /* ── HERO ── */
                .srv-hero {
                    position: relative;
                    height: 68vh;
                    min-height: 500px;
                    overflow: hidden;
                    display: flex;
                    align-items: flex-end;
                }
                .srv-hero-img {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center top;
                    z-index: 0;
                }
                .srv-hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(0,0,0,0.65) 0%,
                        rgba(0,0,0,0.40) 50%,
                        rgba(0,0,0,0.75) 100%
                    );
                    z-index: 1;
                }
                .srv-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 0 80px 80px;
                    max-width: 650px;
                }
                .srv-hero-tag {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    color: rgba(229, 227, 66, 0.9);
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .srv-hero-tag::before {
                    content: '';
                    width: 28px; height: 1px;
                    background: rgba(229, 227, 66, 0.4);
                }
                .srv-hero-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.8rem, 6vw, 5.4rem);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.05;
                    letter-spacing: -1px;
                    margin-bottom: 18px;
                }
                .srv-hero-title em { font-style: italic; font-weight: 400; color: #e5e342; }
                .srv-hero-sub {
                    font-size: 14px;
                    font-weight: 300;
                    color: rgba(255,255,255,0.7);
                    line-height: 1.8;
                    max-width: 380px;
                }
                .srv-gender-nav {
                    display: flex;
                    gap: 22px;
                    margin-top: 34px;
                }
                .srv-gender-link {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    text-decoration: none;
                    color: #bbb;
                    padding-bottom: 5px;
                    border-bottom: 2px solid transparent;
                    transition: color 0.25s, border-color 0.25s;
                }
                .srv-gender-link.active { color: #111; border-color: #111; }
                .srv-gender-link:hover { color: #555; }

                /* ── SPLIT PANEL ── */
                .srv-split {
                    display: flex;
                    align-items: flex-start; /* Crucial: stops sidebar from stretching to the full height of the list */
                    min-height: 600px;
                    background: #fafaf8;
                }

                /* ── LEFT: Category list ── */
                .srv-left {
                    width: 340px;
                    flex-shrink: 0;
                    border-right: 1px solid #ebebeb;
                    padding: 40px 0 100px 0; /* Extra bottom padding for last items */
                    position: sticky;
                    top: 100px; /* Offset for fixed Navbar */
                    height: calc(100vh - 100px);
                    overflow-y: scroll; /* Force scrolling to work within this container */
                    overscroll-behavior-y: contain; /* Prevents whole page from scrolling when inside sidebar */
                    background: #fff;
                    scrollbar-width: thin;
                    scrollbar-color: #ddd transparent; /* Thin grey scrollbar for Firefox */
                }
                .srv-left::-webkit-scrollbar { 
                    width: 4px;
                    display: block; /* Show scrollbar in Chrome/Edge/Safari */
                }
                .srv-left::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 10px;
                }
                .srv-left::-webkit-scrollbar-track {
                    background: transparent;
                }
                .srv-left-header {
                    padding: 0 36px 28px;
                    border-bottom: 1px solid #f0f0f0;
                    margin-bottom: 16px;
                }
                .srv-left-heading {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    color: #ccc;
                }

                .srv-cat-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 36px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    position: relative;
                    border-left: 3px solid transparent;
                }
                .srv-cat-item:hover { background: #f7f7f7; }
                .srv-cat-item.active {
                    background: #f4f4f4;
                }
                .srv-cat-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: var(--cat-accent, #111);
                }
                .srv-cat-num {
                    font-size: 11px;
                    font-weight: 700;
                    color: #ddd;
                    width: 22px;
                    flex-shrink: 0;
                    font-variant-numeric: tabular-nums;
                    letter-spacing: 0;
                }
                .srv-cat-item.active .srv-cat-num { color: var(--cat-accent, #111); }
                .srv-cat-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #888;
                    line-height: 1.3;
                    flex: 1;
                }
                .srv-cat-item.active .srv-cat-name { color: #111; font-weight: 600; }
                .srv-cat-count {
                    font-size: 10px;
                    color: #ccc;
                    font-weight: 400;
                    flex-shrink: 0;
                }
                .srv-cat-item.active .srv-cat-count { color: var(--cat-accent, #aaa); }

                /* ── RIGHT: Detail panel ── */
                .srv-right {
                    flex: 1;
                    padding: 60px 70px 100px;
                    min-width: 0;
                    overflow-y: auto;
                }
                .srv-detail-head {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 24px;
                    margin-bottom: 50px;
                    flex-wrap: wrap;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #efefef;
                }
                .srv-detail-icon {
                    width: 56px; height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    color: #fff;
                    flex-shrink: 0;
                }
                .srv-detail-title-wrap { flex: 1; }
                .srv-detail-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 3vw, 2.6rem);
                    font-weight: 700;
                    color: #111;
                    line-height: 1.1;
                    margin-bottom: 6px;
                }
                .srv-detail-sub {
                    font-size: 12px;
                    color: #bbb;
                    letter-spacing: 1px;
                    font-weight: 400;
                }
                .srv-book-now {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 34px;
                    border-radius: 50px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    text-decoration: none;
                    color: #fff;
                    flex-shrink: 0;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .srv-book-now:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
                }

                /* Services table */
                .srv-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .srv-table thead tr {
                    border-bottom: 2px solid #f0f0f0;
                }
                .srv-table thead th {
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    color: #ccc;
                    padding: 0 0 14px;
                    text-align: left;
                }
                .srv-table thead th:last-child { text-align: right; }
                .srv-table tbody tr {
                    border-bottom: 1px solid #f8f8f8;
                    transition: background 0.15s ease;
                }
                .srv-table tbody tr:hover { background: #fafafa; }
                .srv-table tbody td {
                    padding: 16px 0;
                    vertical-align: middle;
                }
                .srv-row-num {
                    font-size: 11px;
                    color: #ddd;
                    width: 32px;
                    font-variant-numeric: tabular-nums;
                    letter-spacing: 0;
                }
                .srv-row-name {
                    font-size: 14px;
                    font-weight: 400;
                    color: #333;
                    padding-right: 20px;
                }
                .srv-row-price {
                    font-size: 14px;
                    font-weight: 600;
                    text-align: right;
                    white-space: nowrap;
                }

                /* Empty / loading */
                .srv-empty-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    font-size: 13px;
                    color: #ccc;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                .srv-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 100px 0;
                    gap: 10px;
                }
                .srv-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: #ddd;
                    animation: dp 1.4s ease-in-out infinite;
                }
                .srv-dot:nth-child(2) { animation-delay: 0.2s; }
                .srv-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dp {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
                    40% { transform: scale(1.1); opacity: 1; }
                }

                /* ── CTA ── */
                .srv-cta {
                    background: #111;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 40px;
                    padding: 70px 80px;
                    flex-wrap: wrap;
                }
                .srv-cta h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 3vw, 2.8rem);
                    font-weight: 600;
                    color: #fff;
                    line-height: 1.2;
                    margin-bottom: 8px;
                }
                .srv-cta p {
                    font-size: 13px;
                    font-weight: 300;
                    color: rgba(255,255,255,0.45);
                }
                .srv-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px 52px;
                    background: #e5e342;
                    color: #111;
                    border-radius: 50px;
                    font-weight: 700;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    text-decoration: none;
                    font-size: 10px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .srv-cta-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(229,227,66,0.3);
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .srv-hero-content { padding: 0 24px 50px; }
                    .srv-split { flex-direction: column; }
                    .srv-left {
                        width: 100%;
                        height: auto;
                        position: static;
                        border-right: none;
                        border-bottom: 1px solid #ebebeb;
                        padding: 24px 0;
                        display: flex;
                        overflow-x: auto;
                        gap: 0;
                        flex-direction: row;
                        flex-wrap: nowrap;
                    }
                    .srv-left-header { display: none; }
                    .srv-cat-item {
                        flex-direction: column;
                        gap: 4px;
                        padding: 14px 20px;
                        border-left: none;
                        border-bottom: 3px solid transparent;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .srv-cat-item.active::before { display: none; }
                    .srv-cat-item.active { border-bottom-color: var(--cat-accent, #111); }
                    .srv-cat-count { display: none; }
                    .srv-right { padding: 32px 24px 80px; }
                    .srv-cta { padding: 60px 24px; }
                }
            `}</style>

            <Navbar />

            {/* ── HERO ── */}
            <section className="srv-hero">
                <div className="srv-hero-img" style={{ backgroundImage: `url(${heroBg})` }} />
                <div className="srv-hero-overlay" />
                <div className="srv-hero-content">
                    <p className="srv-hero-tag">{isWomen ? 'For Her' : 'For Him'}</p>
                    <h1 className="srv-hero-title">
                        {isWomen ? <><em>Luxurious</em><br />Experiences.</> : <><em>Refined</em><br />Grooming.</>}
                    </h1>
                    <p className="srv-hero-sub">
                        {isWomen
                            ? 'Premium beauty & wellness, crafted for you.'
                            : 'Tailored grooming & care for the modern gentleman.'
                        }
                    </p>
                    <nav className="srv-gender-nav">
                        <Link to="/services/women" className={`srv-gender-link ${isWomen ? 'active' : ''}`}>For Her</Link>
                        <Link to="/services/men" className={`srv-gender-link ${!isWomen ? 'active' : ''}`}>For Him</Link>
                    </nav>
                </div>
            </section>

            {/* ── SPLIT PANEL ── */}
            {loading ? (
                <div className="srv-loading">
                    <div className="srv-dot" /><div className="srv-dot" /><div className="srv-dot" />
                </div>
            ) : error ? (
                <div className="srv-empty-state">{error}</div>
            ) : (
                <div className="srv-split">
                    {/* LEFT — category list */}
                    <div className="srv-left" data-lenis-prevent>
                        <div className="srv-left-header">
                            <p className="srv-left-heading">Categories</p>
                        </div>
                        {categories.map((cat, idx) => {
                            const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                            const icon = getCategoryIcon(cat.title);
                            const isActive = activeIdx === idx;
                            return (
                                <div
                                    key={cat._id || idx}
                                    className={`srv-cat-item ${isActive ? 'active' : ''}`}
                                    style={{ '--cat-accent': accent }}
                                    onClick={() => setActiveIdx(idx)}
                                >
                                    <span className="srv-cat-num">{String(idx + 1).padStart(2, '0')}</span>
                                    <span className="srv-cat-name">{cat.title}</span>
                                    <span className="srv-cat-count">{(cat.items || []).length}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT — detail panel */}
                    <div className="srv-right" data-lenis-prevent>
                        {!active ? (
                            <div className="srv-empty-state">Select a category</div>
                        ) : (() => {
                            const accent = ACCENT_COLORS[activeIdx % ACCENT_COLORS.length];
                            const icon = getCategoryIcon(active.title);
                            const items = active.items || [];
                            return (
                                <>
                                    {/* Header */}
                                    <div className="srv-detail-head">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                                            <div className="srv-detail-icon" style={{ background: accent }}>
                                                {icon}
                                            </div>
                                            <div className="srv-detail-title-wrap">
                                                <h2 className="srv-detail-title">{active.title}</h2>
                                                <p className="srv-detail-sub">{items.length} {items.length === 1 ? 'service' : 'services'} available</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/book-appointment"
                                            className="srv-book-now"
                                            style={{ background: accent }}
                                        >
                                            Book Now
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M1 6h10M6 1l5 5-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Services table */}
                                    {items.length === 0 ? (
                                        <div className="srv-empty-state">No services listed yet.</div>
                                    ) : (
                                        <table className="srv-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 32 }}></th>
                                                    <th>Service</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="srv-row-num">{String(i + 1).padStart(2, '0')}</td>
                                                        <td className="srv-row-name">{item.name}</td>
                                                        <td className="srv-row-price" style={{ color: accent }}>₹{item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* ── CTA ── */}
            <div className="srv-cta">
                <div>
                    <h2>Ready for your transformation?</h2>
                    <p>Book your appointment at Preety Salon today.</p>
                </div>
                <Link to="/book-appointment" className="srv-cta-btn">
                    Book Appointment
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default Services;
