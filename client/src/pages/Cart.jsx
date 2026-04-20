import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setLoading(false);
            return;
        }
        
        const user = JSON.parse(userStr);
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${user.userid}`);
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

    const handleRemoveItem = async (cartid) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${cartid}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchCartItems();
            } else {
                alert('Failed to remove item');
            }
        } catch (error) {
            console.error('Remove error', error);
        }
    };

    const handleUpdateQuantity = async (cartid, action) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${cartid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                fetchCartItems();
            } else {
                const errData = await res.json();
                console.error('Failed to update quantity:', errData.message);
            }
        } catch (error) {
            console.error('Update quantity error', error);
        }
    };

    const calculateSubTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.totalamt, 0);
    };

    const subTotal = calculateSubTotal();
    const shippingFee = subTotal > 2000 ? 0 : (subTotal > 0 ? 100 : 0);
    const isCartEmpty = cartItems.length === 0;

    return (
        <>
            <Navbar />

            {/* Breadcrumb section */}
            <div className="breadcrumb-section spa-breadcrumb"
                style={{ backgroundColor: '#0d1117', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 22v-6a10 10 0 0 1 20 0v6h6v20H14V22h6zm4 0h12v-6a6 6 0 0 0-12 0v6z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")", backgroundSize: '60px 60px' }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 d-flex justify-content-center">
                            <div className="banner-content style-2 text-center">
                                <h1>CART PAGE</h1>
                                <ul className="breadcrumb-list">
                                    <li><Link to="/">Home</Link></li>
                                    <li>CART PAGE</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Start Cart Page */}
            <div className="cart-page pt-120 mb-120">
                <div className="container-lg container-fluid">
                    <div className="row g-lg-4 gy-5">
                        <div className="col-xl-8 col-lg-7">
                            <div className="cart-shopping-wrapper">
                                <div className="cart-widget-title">
                                    <h5 className="style-2">My Shopping</h5>
                                </div>
                                <table className="cart-table style-2">
                                    <thead>
                                        <tr>
                                            <th>Product Info</th>
                                            <th>Price</th>
                                            <th className="text-center">Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5">Loading...</td>
                                            </tr>
                                        ) : isCartEmpty ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5">Your cart is empty.</td>
                                            </tr>
                                        ) : (
                                            cartItems.map(item => (
                                                <tr key={item.cartid}>
                                                    <td data-label="Product Info">
                                                        <div className="product-info-wrapper">
                                                            <div className="product-info-img">
                                                                <img src={item.product?.pimg ? `http://localhost:5000${item.product.pimg}` : "https://demo.egenslab.com/html/buret/preview/assets/image/beauty-spa/cart-page/cart-image.png"} alt={item.product?.pname} />
                                                            </div>
                                                            <div className="product-info-content">
                                                                <h6>{item.product?.pname || 'Unknown Product'}</h6>
                                                                <p style={{marginBottom: '5px'}}><span>Product ID: </span>{item.productid}</p>
                                                                 <ul>
                                                                    <li onClick={() => handleRemoveItem(item.cartid)} style={{ cursor: 'pointer', color: 'red' }}>remove</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td data-label="Price"><span>₹{item.product?.price || 0}</span></td>
                                                    <td data-label="Quantity" className="text-center">
                                                        <div className="quantity-counter" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', background: '#fff' }}>
                                                            <button 
                                                                onClick={() => handleUpdateQuantity(item.cartid, 'decrease')}
                                                                style={{ padding: '4px 10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                            ><i className="bi bi-dash"></i></button>
                                                            <input 
                                                                type="text" 
                                                                value={item.quantity} 
                                                                readOnly 
                                                                style={{ width: '35px', textAlign: 'center', borderRight: '1px solid #eee', borderLeft: '1px solid #eee', borderTop: 'none', borderBottom: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500' }} 
                                                            />
                                                            <button 
                                                                onClick={() => handleUpdateQuantity(item.cartid, 'increase')}
                                                                style={{ padding: '4px 10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                            ><i className="bi bi-plus"></i></button>
                                                        </div>
                                                    </td>
                                                    <td data-label="Total">₹{item.totalamt}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <Link to="/product" className="details-button">
                                    Continue Shoping
                                    <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.33624 2.84003L1.17627 10L0 8.82373L7.15914 1.66376H0.849347V0H10V9.15065H8.33624V2.84003Z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5 ">
                            <div className="cart-order-sum-area">
                                <div className="cart-widget-title">
                                    <h5 className="style-2">Order Summary</h5>
                                </div>
                                <div className="order-summary-wrap">
                                    <ul className="order-summary-list style-2">
                                        <li>
                                            <strong>Sub Total</strong>
                                            <strong>₹{subTotal.toFixed(2)}</strong>
                                        </li>
                                        <li>
                                            Shipping
                                            <div className="order-info text-end">
                                                <p>{shippingFee === 0 ? 'Free Shipping' : `Shipping Fee: ₹${shippingFee}`}</p>
                                                {subTotal > 0 && subTotal <= 2000 && <span style={{fontSize: '12px', color: '#777'}}>Add ₹{2000 - subTotal} more for Free Shipping</span>}
                                            </div>
                                        </li>
                                        <li>
                                            <strong>Total</strong>
                                            <strong>₹{(subTotal > 0 ? subTotal + shippingFee : 0).toFixed(2)}</strong>
                                        </li>
                                    </ul>
                                    <Link 
                                        to="/checkout"
                                        className={`primary-btn1 mt-40 ${isCartEmpty ? 'disabled-link' : ''}`} 
                                        style={{ 
                                            width: '100%', 
                                            opacity: isCartEmpty ? 0.5 : 1,
                                            pointerEvents: isCartEmpty ? 'none' : 'auto',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        Processed Checkout
                                        <svg className="arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 9L9 1M9 1C7.22222 1.33333 2.0 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Cart Page */}

            <Footer />
        </>
    );
};

export default Cart;
