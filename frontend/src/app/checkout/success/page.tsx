'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, ArrowRight, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/shop');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await apiFetch(`/orders/${orderId}`);
        setOrder(res.data);
        
        // Add artificial delay of 3-4 seconds to show loading animation
        const delay = 3000 + Math.random() * 1000; // 3-4 seconds
        setTimeout(() => {
          setLoading(false);
          setShowLoader(false);
        }, delay);
      } catch (err) {
        console.error('Failed to load success order:', err);
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (showLoader) {
    return (
      <div className="min-h-[50vh] sm:min-h-[70vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6 px-4 py-8">
        <div className="relative">
          {/* Spinning circle loader */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#D6C3A5]/30 border-t-[#4F6D5A] rounded-full animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4F6D5A]/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1E1E1E]">Processing Your Order</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Order Not Found</h2>
        <p className="text-sm text-gray-500">Could not resolve checkout transaction details.</p>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-[#4F6D5A] text-white text-xs font-bold uppercase rounded">
          Go Home
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // Open printable HTML invoice in a new tab
    window.open(`http://localhost:5000/api/orders/invoice/${order._id}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-16 text-center space-y-4 sm:space-y-8 flex-grow flex flex-col justify-center animate-in fade-in duration-700">
      <div className="space-y-2 sm:space-y-3">
        <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#4F6D5A] mx-auto" />
        <h1 className="font-serif text-xl sm:text-2xl md:text-4xl font-extrabold text-[#1E1E1E]">Order Confirmed!</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">Thank you for choosing Velora. Your daily self-care routine is being prepared.</p>
        <p className="text-[10px] sm:text-xs font-mono bg-[#FAF8F5] border inline-block px-2 sm:px-3 py-1 rounded text-gray-700">Order ID: {order._id}</p>
      </div>

      {/* Shipping details */}
      <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-4 sm:p-6 text-left space-y-3 sm:space-y-4 shadow-sm">
        <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-[#4F6D5A] font-bold border-b border-[#FAF8F5] pb-2">
          Delivery Summary
        </h3>
        <div className="text-[11px] sm:text-xs text-gray-600 space-y-1">
          <p><strong>Billed To:</strong> {order.shippingAddress.name}</p>
          <p><strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
          <p><strong>Contact Email:</strong> {order.shippingAddress.email}</p>
          <p><strong>Payment Mode:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
        </div>

        {/* Short items summary */}
        <div className="space-y-2 border-t border-[#FAF8F5] pt-3 sm:pt-4">
          <h4 className="text-[10px] uppercase font-bold text-gray-500">Ordered Items ({order.products.length})</h4>
          <div className="space-y-1">
            {order.products.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[11px] sm:text-xs text-gray-700">
                <span className="truncate pr-2">{p.title} &times; {p.quantity}</span>
                <span className="font-semibold whitespace-nowrap">₹{p.price * p.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-dashed border-[#D6C3A5] pt-2 sm:pt-3 text-sm sm:text-base font-bold text-[#1E1E1E]">
          <span>Amount Paid</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-2">
        <button
          onClick={handleDownloadInvoice}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Download Invoice</span>
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 border border-[#D6C3A5] hover:bg-black/5 text-[#1E1E1E] rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back To Home</span>
        </button>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#4F6D5A] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
