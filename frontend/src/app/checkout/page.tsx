'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Check, HelpCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../lib/api';
import { useToastStore } from '../../store/toastStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, getCartSubtotal, getCartDiscount, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Loader state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Razorpay simulated sandbox modal states
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedData, setSimulatedData] = useState<{ orderId: string; amount: number; localOrderId: string } | null>(null);

  // Shipping Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/shop');
      return;
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      
      const defaultAddr = user.addresses.find((addr: any) => addr.isDefault) || user.addresses[0];
      if (defaultAddr) {
        setStreet(defaultAddr.street);
        setCity(defaultAddr.city);
        setStateName(defaultAddr.state);
        setZipCode(defaultAddr.zipCode);
      }
    }
  }, [user, items, orderPlaced]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setErrorMsg('');

    const orderData = {
      products: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        name,
        street,
        city,
        state: stateName,
        zipCode,
        country: 'India',
        phone,
        email
      },
      paymentMethod,
      couponCode: coupon?.code || undefined,
      guestDetails: user ? undefined : { name, email, phone }
    };

    try {
      const res = await apiFetch('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (res.success) {
        if (paymentMethod === 'COD') {
          setOrderPlaced(true);
          clearCart();
          addToast('Order placed successfully via Cash on Delivery!', 'success');
          router.push(`/checkout/success?id=${res.data._id}`);
        } else {
          // Initiate Razorpay payment
          const initRes = await apiFetch('/payments/initiate', {
            method: 'POST',
            body: JSON.stringify({
              amount: res.data.total,
              receipt: res.data._id
            })
          });

          if (initRes.success) {
            if (initRes.isSimulated) {
              setSimulatedData({
                orderId: initRes.orderId,
                amount: initRes.amount,
                localOrderId: res.data._id
              });
              setShowSimulatedModal(true);
              setSubmitting(false);
            } else {
              const options = {
                key: initRes.keyId,
                amount: initRes.amount,
                currency: 'INR',
                name: 'Velora',
                description: 'Clinical Formulations Order',
                order_id: initRes.orderId,
                handler: async function (response: any) {
                  try {
                    setSubmitting(true);
                    const verifyRes = await apiFetch('/payments/verify', {
                      method: 'POST',
                      body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        order_id: res.data._id
                      })
                    });
                    if (verifyRes.success) {
                      setOrderPlaced(true);
                      clearCart();
                      addToast('Payment captured and order placed!', 'success');
                      router.push(`/checkout/success?id=${res.data._id}`);
                    } else {
                      setErrorMsg('Payment verification failed.');
                      setSubmitting(false);
                    }
                  } catch (verifyErr: any) {
                    setErrorMsg(verifyErr.message || 'Payment verification failed.');
                    setSubmitting(false);
                  }
                },
                prefill: {
                  name,
                  email,
                  contact: phone
                },
                theme: {
                  color: '#4F6D5A'
                },
                modal: {
                  ondismiss: function () {
                    setSubmitting(false);
                    addToast('Payment popup closed.', 'warning');
                  }
                }
              };
              const rzp = new (window as any).Razorpay(options);
              rzp.open();
            }
          } else {
            setErrorMsg('Failed to initiate payment gateway.');
            setSubmitting(false);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check stock details.');
      setSubmitting(false);
    }
  };

  const handleSimulatedPaymentSuccess = async () => {
    if (!simulatedData) return;
    setSubmitting(true);
    setShowSimulatedModal(false);
    setErrorMsg('');

    try {
      const verifyRes = await apiFetch('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: simulatedData.orderId,
          razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).substring(7),
          razorpay_signature: 'simulated_sig_value',
          order_id: simulatedData.localOrderId
        })
      });

      if (verifyRes.success) {
        setOrderPlaced(true);
        clearCart();
        addToast('Simulated payment successful! Order confirmed.', 'success');
        router.push(`/checkout/success?id=${simulatedData.localOrderId}`);
      } else {
        setErrorMsg('Simulated payment verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Simulated payment verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulatedPaymentCancel = () => {
    setShowSimulatedModal(false);
    setSubmitting(false);
    addToast('Simulated payment cancelled by user.', 'warning');
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shipping = subtotal > 1500 ? 0 : 99;
  const total = getCartTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1E1E1E] mb-8 border-b border-[#D6C3A5]/40 pb-4">
        Checkout Securely
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* SHIPPING FORM & PAYMENT */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-3 space-y-8">
          
          {/* Address Details */}
          <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1E1E1E] border-b border-[#FAF8F5] pb-2">
              1. Delivery Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Contact Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Street Address / House No.</label>
              <input
                type="text"
                required
                placeholder="e.g. 402, Block C, Maple Heights"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">State</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">ZIP / Postal Code</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  placeholder="6-digit ZIP"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1E1E1E] border-b border-[#FAF8F5] pb-2">
              2. Payment Mode
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Razorpay Option */}
              <div
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 border rounded-lg cursor-pointer flex items-start space-x-3 transition ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#4F6D5A] bg-[#4F6D5A]/5'
                    : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                  paymentMethod === 'Razorpay' ? 'border-[#4F6D5A]' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'Razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[#4F6D5A]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1E1E] flex items-center">
                    <CreditCard className="w-4 h-4 mr-1 text-[#4F6D5A]" /> Instant Online Pay (UPI / Cards)
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Simulated Razorpay transaction. Sandbox mode.</p>
                </div>
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 border rounded-lg cursor-pointer flex items-start space-x-3 transition ${
                  paymentMethod === 'COD'
                    ? 'border-[#4F6D5A] bg-[#4F6D5A]/5'
                    : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                  paymentMethod === 'COD' ? 'border-[#4F6D5A]' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#4F6D5A]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1E1E] flex items-center">
                    Cash on Delivery (COD)
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Pay at door in cash or via scanning QR code on delivery.</p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow-md flex items-center justify-center space-x-2 transition"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Place Order (₹{total})</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ORDER SUMMARY PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1E1E1E] border-b border-[#FAF8F5] pb-2">
              Order Summary
            </h3>

            {/* Products List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center text-xs text-gray-600">
                  <div className="flex items-center min-w-0">
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF8F5] border mr-2.5" />
                    <div className="truncate">
                      <p className="font-semibold text-[#1E1E1E] truncate max-w-[120px]">{item.product.title}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-[#1E1E1E]">
                    ₹{(item.product.salePrice || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-[#FAF8F5] text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1E1E1E]">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Applied Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-[#1E1E1E]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>

              {coupon && (
                <div className="p-2 bg-[#4F6D5A]/10 border border-[#4F6D5A]/30 rounded text-[10px] text-[#4F6D5A] font-semibold flex justify-between items-center">
                  <span>Promo Applied: {coupon.code}</span>
                  <span>Saved ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#D6C3A5] text-base font-serif font-bold text-[#1E1E1E]">
                <span>Order Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#D6C3A5]/20 p-3 rounded text-[10px] text-gray-500 space-y-1 text-center">
              <p className="font-bold flex items-center justify-center text-gray-600">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#4F6D5A]" /> 256-bit Secure Gateway
              </p>
              <p>Your details are secured under SSL and privacy protocols.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Simulated Sandbox Payment Modal */}
      {showSimulatedModal && simulatedData && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#D6C3A5] rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col p-6 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold text-[#4F6D5A] uppercase tracking-widest bg-[#4F6D5A]/10 px-2 py-0.5 rounded">
                Razorpay Sandbox Environment
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Simulated Payment Gateway</h3>
              <p className="text-xs text-gray-500">
                No API keys are configured on the server. Velora is running in a simulated transaction sandbox.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#D6C3A5]/30 rounded-lg p-4 space-y-2 text-xs text-[#1E1E1E]">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-mono font-semibold">{simulatedData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount to Pay:</span>
                <span className="font-bold text-[#4F6D5A]">₹{(simulatedData.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient:</span>
                <span className="font-medium text-gray-700">Velora Clinical Lab</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2.5 sm:space-y-0 pt-2">
              <button
                type="button"
                onClick={handleSimulatedPaymentCancel}
                className="flex-1 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase rounded tracking-wider transition"
              >
                Cancel / Decline
              </button>
              <button
                type="button"
                onClick={handleSimulatedPaymentSuccess}
                className="flex-1 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white text-xs font-bold uppercase rounded tracking-wider transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
