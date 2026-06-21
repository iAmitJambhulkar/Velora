'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-600 leading-relaxed">
      <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1E1E1E] border-b pb-3">Privacy Policy</h1>
      <p className="text-gray-500">Effective Date: June 19, 2026</p>
      
      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">1. Information We Collect</h3>
        <p>
          We collect personal credentials (name, email address, shipping addresses, phone numbers) to register accounts and fulfill order checkouts. We also utilize local storage variables to track cart items, recently viewed selections, and guest wishlists to optimize your e-commerce interactions.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">2. How We Protect Your Details</h3>
        <p>
          Transactions are processed through verified, secure payment gateways (Razorpay / Stripe) using SSL encryption protocols. We do not store card data or raw transaction credentials on our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">3. Cookies and Diagnostics</h3>
        <p>
          We use functional cookies to maintain your shopping cart state. You can disable cookies in your browser settings, but please note that some elements of checkout and assessment quizzes may function incorrectly.
        </p>
      </section>
    </div>
  );
}
