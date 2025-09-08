import React, { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './PaymentPage.css';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QtJz1Rxfj9ChJvkMTwyy8pM8qPNtgEEpw1hjvrVMw23mSmmbrMSDKGaG0mt4ZIu6SCWFdgv2hUuVfEzroH3RwiE00P5ctJdKc');

function CheckoutForm({ premium }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Chưa có token, chưa đăng nhập");
            navigate("/login");
            return;
        }

        // Kiểm tra token có hợp lệ không bằng API
        axios.post("http://localhost:2109/api/extract-user-id?token=" + token)
            .then((res) => {
                // Token hợp lệ, cho phép ở lại
                console.log("Token hợp lệ, userId:", res.data.id);
            })
            .catch(() => {
                alert("Token hết hạn hoặc không hợp lệ");
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe chưa sẵn sàng");
      setIsProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Không tìm thấy phần nhập thẻ");
      setIsProcessing(false);
      return;
    }



    try {
      const { data } = await axios.post('http://localhost:2109/api/problem-access/create-payment-intent', {
        amount: Math.round(premium.price * 100),
        token: localStorage.getItem("token"),         // ✅ lấy từ localStorage hoặc context
        premiumId: premium.id,  // ✅ từ props
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
      }
    } catch (err) {
      setError("⚠️ Không kết nối được đến server");
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-container">
      <div className="premium-summary">
        <h2>{premium.name}</h2>
        <p><b>Giá:</b> ${premium.price.toFixed(2)}</p>
        <p><b>Thời hạn:</b> {premium.durationDays} ngày</p>
        <ul>
          {premium.description.split(';').map((line, idx) => (
            <li key={idx}>{line.trim()}</li>
          ))}
        </ul>
      </div>

      {success ? (
        <div className="payment-success">
          ✅ Payment successful! Thank you for your support.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="payment-form">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' }
              },
              invalid: { color: '#fa755a' }
            }
          }} />
          <button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processing...' : `Pay $${premium.price.toFixed(2)}`}
          </button>
          {error && <div className="payment-error">{error}</div>}
        </form>
      )}
    </div>
  );
}

export default function PaymentPage() {
  const [params] = useSearchParams();
  const premiumId = params.get('id');
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (premiumId) {
      axios.get(`http://localhost:2109/api/problem-access/premium/${premiumId}`)
        .then(res => {
          setPremium(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [premiumId]);

  if (loading) return <div className="loading">Đang tải dữ liệu gói Premium...</div>;
  if (!premium) return <div className="not-found">Không tìm thấy gói Premium</div>;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm premium={premium} />
    </Elements>
  );
}