import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SimplePay() {
  const [priceData, setPriceData] = useState({ price: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceData({
      ...priceData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order on Backend
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/razorpay/create-order",
        priceData,
      );

      const order = response.data;

      if (response.status === 200) {
        const options = {
          key: "rzp_test_SQnwxoDTCXne45", // User's specific demo key
          amount: order.amount,
          currency: "INR",
          name: "Preety Salon - Demo",
          description: "Test Transaction",
          order_id: order.id,

          handler: async function (response) {
            // Verify payment
            try {
                const verifyRes = await axios.post(import.meta.env.VITE_API_URL + '/api/razorpay/verify-payment', {
                    ...response,
                    amount: priceData.price
                });
                if (verifyRes.data.status === 'success') {
                    alert("Payment Successful & Verified!");
                }
            } catch (err) {
                console.error("Verification failed", err);
                alert("Payment successful, but verification failed.");
            }
          },

          prefill: {
            name: "Test User",
            email: "test@gmail.com",
            contact: "9999999999",
          },

          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.log(error);
      alert("Payment failed to initialize");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-120" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '800' }}>Simple Pay Demo</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Enter an amount to test the Razorpay integration with the provided keys.</p>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>Amount (INR)</label>
                    <input 
                        type="number" 
                        name="price" 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600' }}
                        placeholder="e.g. 500"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '15px', 
                        borderRadius: '12px', 
                        background: '#000', 
                        color: '#fff', 
                        fontWeight: '700', 
                        border: 'none',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SimplePay;
