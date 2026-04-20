import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        email: '',
        location: '',
        street: '',
        postalcode: ''
    });

    const fetchCartItems = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setLoading(false);
            return;
        }
        
        const user = JSON.parse(userStr);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.userid}`);
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const [processing, setProcessing] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateSubTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.totalamt, 0);
    };

    const subTotal = calculateSubTotal();
    const shippingFee = subTotal > 2000 || subTotal === 0 ? 0 : 100;
    const total = subTotal + shippingFee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to place an order');
            return;
        }

        const user = JSON.parse(userStr);

        if (!formData.fullname || !formData.phone || !formData.street || !formData.postalcode) {
            alert('Please fill in all required fields');
            return;
        }

        setProcessing(true);

        // If Cash on Delivery, place order directly
        if (paymentMethod === 'COD') {
            await finalizeOrder(user, 'COD', 'Pending');
            return;
        }

        // Razorpay Integration
        try {
            // 1. Create Order on Backend
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, currency: 'INR' })
            });

            if (!res.ok) throw new Error('Failed to create payment order');
            const order = await res.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: 'rzp_test_SQnwxoDTCXne45', // User's specific demo key
                amount: order.amount,
                currency: order.currency,
                name: "Preety Salon",
                description: "Product Purchase",
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment Signature
                    try {
                        const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                amount: total,
                                userid: user.userid,
                                internalOrderId: `ORD${Date.now()}` // Temporary ID for tracking, will be replaced by actual order saving
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.status === 'success') {
                            await finalizeOrder(user, paymentMethod, 'Completed', response.razorpay_payment_id);
                        } else {
                            alert('Payment verification failed');
                            setProcessing(false);
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        alert('Error verifying payment');
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: formData.fullname,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#000000"
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Razorpay Error:', error);
            alert('Payment initialization failed');
            setProcessing(false);
        }
    };

    const finalizeOrder = async (user, method, paymentStatus, transactionId = '') => {
        const orderData = {
            userid: user.userid,
            ...formData,
            paymentmethod: method,
            totalamount: total,
            paymentstatus: paymentStatus,
            transactionid: transactionId
        };

        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                alert('Order placed successfully!');
                window.location.href = '/profile';
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
                setProcessing(false);
            }
        } catch (error) {
            console.error('Finalize order error:', error);
            alert('Failed to place order');
            setProcessing(false);
        }
    };

    return (
        <>
            <Navbar />

            {/* Breadcrumb section strats here */}
            <div className="breadcrumb-section spa-breadcrumb"
                style={{ backgroundColor: '#0d1117', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 20h36v20H12V20zm2 4v2h32v-2H14zm0 8v2h8v-2h-8zm12 0v2h6v-2h-6z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")", backgroundSize: '60px 60px' }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 d-flex justify-content-center">
                            <div className="banner-content style-2 text-center">
                                <h1>CHECKOUT</h1>
                                <ul className="breadcrumb-list">
                                    <li><Link to="/">Home</Link></li>
                                    <li>CHECKOUT</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb section ends here */}

            {/* Start CheckOut Page */}
            <div className="checkout-page pt-120 mb-120">
                <div className="container-lg container-fluid">
                    <div className="row g-lg-4 gy-5">
                        <div className="col-lg-7">
                            <div className="checkout-form-wrapper">
                                <div className="checkout-form-title style-2">
                                    <h5>Billing Information</h5>
                                </div>
                                <div className="checkout-form style-2">
                                    <form id="checkoutForm" onSubmit={handlePlaceOrder}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Full Name*</label>
                                                    <input type="text" name="fullname" placeholder="Daniel Scoot" value={formData.fullname} onChange={handleInputChange} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Phone Number*</label>
                                                    <input type="text" name="phone" placeholder="(212)+ 455 645 678" value={formData.phone} onChange={handleInputChange} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Email Address <span>(Optional)</span></label>
                                                    <input type="email" name="email" placeholder="preetysalon@gmail.com" value={formData.email} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Your Location</label>
                                                    <input type="text" name="location" placeholder="Type Location" value={formData.location} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Street Address*</label>
                                                    <input type="text" name="street" placeholder="Street address" value={formData.street} onChange={handleInputChange} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-inner mb-25">
                                                    <label className="style-2">Postal Code*</label>
                                                    <input type="text" name="postalcode" placeholder="Postal code" value={formData.postalcode} onChange={handleInputChange} required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-inner2">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="contactCheck" />
                                                        <label className="form-check-label" htmlFor="contactCheck">
                                                            Save my information for next time when I purchased
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="checkout-form-wrapper">
                                <div className="checkout-form-title style-2">
                                    <h5>Order Summary</h5>
                                </div>
                                <div className="order-sum-area style-2">
                                    <div className="cart-menu">
                                        <div className="cart-body">
                                            <ul>
                                                {loading ? (
                                                    <li className="text-center py-3">Loading order details...</li>
                                                ) : cartItems.length === 0 ? (
                                                    <li className="text-center py-3">Your cart is empty.</li>
                                                ) : (
                                                    cartItems.map((item) => (
                                                        <li className="single-item" key={item.cartid}>
                                                            <div className="item-area" style={{ width: '100%', marginBottom: '15px' }}>
                                                                <div className="main-item" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                                    <div className="item-img" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                                                        <img 
                                                                            src={item.product?.pimg ? `${import.meta.env.VITE_API_URL}${item.product.pimg}` : "https://demo.egenslab.com/html/buret/preview/assets/image/beauty-spa/checkout/sb-product.png"} 
                                                                            alt={item.product?.pname} 
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                                        />
                                                                    </div>
                                                                    <div className="content-and-quantity" style={{ flexGrow: 1 }}>
                                                                        <div className="content">
                                                                            <h6 style={{ fontSize: '15px', marginBottom: '5px' }}>
                                                                                <Link to={`/product-details/${item.productid}`}>{item.product?.pname}</Link>
                                                                            </h6>
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <span style={{ fontSize: '14px', color: '#666' }}>
                                                                                    {Math.round(item.totalamt / (item.product?.price || 1))} x ₹{item.product?.price}
                                                                                </span>
                                                                                <span style={{ fontWeight: '600', color: '#111' }}>₹{item.totalamt}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                        <div className="cart-footer">
                                            <div className="pricing-area mb-40">
                                                <ul>
                                                    <li>
                                                        <strong>Sub Total</strong>
                                                        <strong>₹{subTotal.toFixed(2)}</strong>
                                                    </li>
                                                    <li>
                                                        <strong>Shipping</strong>
                                                        <div className="order-info">
                                                            <p>{shippingFee === 0 ? 'Free Shipping*' : `₹${shippingFee.toFixed(2)}`}</p>
                                                            {shippingFee > 0 && <span style={{ fontSize: '12px' }}>Add ₹{2000 - subTotal} more for Free Shipping</span>}
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <strong>Total</strong>
                                                        <strong>₹{total.toFixed(2)}</strong>
                                                    </li>
                                                </ul>
                                            </div>

                                            <button 
                                                type="submit" 
                                                className="primary-btn1" 
                                                form="checkoutForm"
                                                disabled={cartItems.length === 0 || processing} 
                                                style={{ width: '100%', opacity: (cartItems.length === 0 || processing) ? 0.5 : 1 }}
                                            >
                                                {processing ? 'Processing Payment...' : 'Place Your Order'}
                                                {!processing && (
                                                    <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9"
                                                            stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End CheckOut Page */}

            <Footer />
        </>
    );
};

export default Checkout;
