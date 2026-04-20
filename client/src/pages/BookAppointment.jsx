import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MultiSelect from '../components/MultiSelect';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [guestName, setGuestName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialWishes, setSpecialWishes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/services');
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
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setGuestName(parsed.uname || '');
            setEmail(parsed.email || '');
            setPhone(parsed.contact || '');
        } else {
            alert('Please log in to book an appointment.');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

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

    const timeSlots = [
        '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
        '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    const getAvailableTimeSlots = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        if (selectedDate !== todayStr) return timeSlots;

        // If today is selected, filter out past slots
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();

        return timeSlots.filter(slot => {
            const [time, period] = slot.split(' ');
            let [hour, minute] = time.split(':').map(Number);
            
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            // Buffer: Only show slots at least 1 hour in the future
            if (hour > currentHour + 1) return true;
            if (hour === currentHour + 1 && currentMinutes === 0) return true;
            
            return false;
        });
    };

    const availableSlots = getAvailableTimeSlots();

    useEffect(() => {
        // If the currently selected time is no longer available, reset it
        if (selectedTime && !availableSlots.includes(selectedTime)) {
            setSelectedTime('');
        }
    }, [selectedDate, selectedTime, availableSlots]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedService.length === 0 || !selectedDate || !selectedTime) {
            alert('Please select at least one service, a date, and a time.');
            return;
        }

        if (!user) {
            alert('You must be logged in.');
            return;
        }

        setIsSubmitting(true);

        const appointmentData = {
            userid: user.userid,
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            guestName,
            email,
            phone,
            specialWishes
        };

        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });

            if (res.ok) {
                alert('Appointment booked successfully! We look forward to seeing you.');
                navigate('/profile'); // Redirect to profile to see the new appointment
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to book appointment.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Server error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh', fontFamily: '"Jost", sans-serif', color: '#111', overflowX: 'hidden' }}>
            <Navbar />

            {/* --- BOOKING HERO --- */}
            <div style={{
                height: '60vh',
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
                    backgroundImage: 'url(https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=2000)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5,
                    filter: 'brightness(0.7) contrast(1.2)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(250,250,249,1))',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '8px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '25px', fontWeight: '600' }}>
                        Reservation Ritual
                    </span>
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', 
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: '400',
                        color: '#fff',
                        margin: 0,
                        lineHeight: '1.1',
                        letterSpacing: '-2px'
                    }}>
                        Schedule Your <br/>
                        <span style={{ fontStyle: 'italic', fontWeight: '300', color: 'var(--primary-color)' }}>Transformation</span>
                    </h1>
                </div>
            </div>

            {/* --- BOOKING INTERFACE --- */}
            <div style={{ maxWidth: '1200px', margin: '-100px auto 150px', position: 'relative', zIndex: 3, padding: '0 20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                    gap: '40px',
                    backgroundColor: '#fff',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    
                    {/* --- STEP 1: RITUAL SELECTION --- */}
                    <div style={{ padding: '60px', borderRight: '1px solid #f0f0f0' }}>
                        <div style={{ marginBottom: '40px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '15px' }}>
                                Phase 01
                            </span>
                            <h3 style={{ fontSize: '28px', fontFamily: '"Playfair Display", serif', marginBottom: '10px' }}>Ritual & Timing</h3>
                            <p style={{ fontSize: '15px', color: '#888', fontWeight: '300' }}>Choose your desired experience and preferred moment.</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Select Service</label>
                            <MultiSelect 
                                options={services}
                                selectedValues={selectedService}
                                onChange={(values) => setSelectedService(values)}
                                placeholder="Choose Signature Rituals"
                                loading={loadingServices}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Select Date</label>
                            <input 
                                type="date" 
                                style={inputStyle} 
                                className="booking-input"
                                value={selectedDate}
                                min={(() => {
                                    const today = new Date();
                                    const year = today.getFullYear();
                                    const month = String(today.getMonth() + 1).padStart(2, '0');
                                    const day = String(today.getDate()).padStart(2, '0');
                                    return `${year}-${month}-${day}`;
                                })()}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '15px' }}>Available Moments</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {availableSlots.length > 0 ? (
                                    availableSlots.map((time) => (
                                        <button 
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            style={{
                                                padding: '12px 5px',
                                                backgroundColor: selectedTime === time ? '#111' : 'transparent',
                                                color: selectedTime === time ? '#fff' : '#888',
                                                border: '1px solid',
                                                borderColor: selectedTime === time ? '#111' : '#eee',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            className="time-btn"
                                        >
                                            {time}
                                        </button>
                                    ))
                                ) : (
                                    <div style={{ gridColumn: 'span 3', padding: '20px', textAlign: 'center', color: '#888', fontSize: '12px', backgroundColor: '#f9f9f9' }}>
                                        No rituals available for this moment. Please select a later time or different date.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 2: GUEST DETAILS --- */}
                    <div style={{ padding: '60px' }}>
                        <div style={{ marginBottom: '40px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary-color)', display: 'block', marginBottom: '15px' }}>
                                Phase 02
                            </span>
                            <h3 style={{ fontSize: '28px', fontFamily: '"Playfair Display", serif', marginBottom: '10px' }}>Guest Information</h3>
                            <p style={{ fontSize: '15px', color: '#888', fontWeight: '300' }}>Confirm your contact details for the transformation.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Full Identity</label>
                                <input type="text" placeholder="Your Name" style={inputStyle} className="booking-input" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Digital Mail</label>
                                    <input type="email" placeholder="email@example.com" style={inputStyle} className="booking-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Phone Ritual</label>
                                    <input type="tel" placeholder="+91" style={inputStyle} className="booking-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Special Wishes</label>
                                <textarea placeholder="Add any specific requests..." style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} className="booking-input" value={specialWishes} onChange={(e) => setSpecialWishes(e.target.value)}></textarea>
                            </div>

                            <button type="submit" disabled={isSubmitting} style={{
                                width: '100%',
                                padding: '22px',
                                backgroundColor: isSubmitting ? '#e0e0e0' : '#111',
                                color: isSubmitting ? '#888' : '#fff',
                                border: 'none',
                                fontSize: '13px',
                                letterSpacing: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }} className="booking-submit-btn">
                                {isSubmitting ? 'Reserving...' : 'Request Your Appointment'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Footer />

            <style>{`
                .booking-input:focus {
                    background-color: #fff !important;
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .time-btn:hover:not(:disabled) {
                    border-color: var(--primary-color) !important;
                    color: var(--primary-color) !important;
                }
                .booking-submit-btn:hover {
                    background-color: var(--primary-color) !important;
                    color: #fff !important;
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(229, 227, 66, 0.2);
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .booking-interface-container {
                    animation: slideUp 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) both;
                }
            `}</style>
        </div>
    );
};

export default BookAppointment;
