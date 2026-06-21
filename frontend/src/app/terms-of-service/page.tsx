'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-600 leading-relaxed">
      <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1E1E1E] border-b pb-3">Terms & Conditions</h1>
      <p className="text-gray-500">Effective Date: June 19, 2026</p>
      
      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">1. Scope of Service</h3>
        <p>
          By utilizing the Velora website and taking our diagnostic assessments, you agree to these terms. All products offered represent cosmetic and wellness formulations for topical application. Consult a certified dermatologist if you have chronic medical skin or scalp conditions.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">2. Delivery & Returns</h3>
        <p>
          We provide complimentary shipping for transactions above ₹1,500. We offer a 30-day money-back guarantee. If a formulation does not suit your profile, submit a query through our contact page to initiate a return routing slip.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-sm font-bold text-[#1E1E1E]">3. Account Usage</h3>
        <p>
          You are responsible for protecting your account credentials. Velora reserves the right to suspend or block profiles that engage in fraudulent checkouts or malicious automated API scraping.
        </p>
      </section>
    </div>
  );
}
