'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Are your formulations dermatologist approved?',
    a: 'Yes, absolutely. Every molecule and finished product undergoes clinical patch testing. All Velora formulas are reviewed and approved by certified dermatologists before release.'
  },
  {
    q: 'How does the Self-Care Assessment work?',
    a: 'Our algorithm takes biological attributes (gender, skin moisture levels, hair cuticle patterns, acne history) to recommend an exact morning/night active routine. This eliminates ingredient conflicts and choice fatigue.'
  },
  {
    q: 'Do you offer a money-back guarantee?',
    a: 'Yes. We are confident in the clinical efficacy of our formulations. If you do not see a visible difference in skin or hair parameters within 30 days, we will issue a full refund. No questions asked.'
  },
  {
    q: 'Are your products cruelty-free and vegan?',
    a: 'Velora is 100% cruelty-free and vegan. We never test on animals, nor do we utilize animal derivatives. All compounds are ethically synthesized in clean clinical labs.'
  },
  {
    q: 'What is your shipping and delivery timeline?',
    a: 'We offer complimentary express delivery across India for orders above ₹1,500. Orders typically dispatch within 24 hours and arrive in 3–5 business days. COD orders are supported.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10 flex-grow flex flex-col justify-center">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Support Hub</span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Frequently Answered Questions</h1>
        <p className="text-xs text-gray-500">Find answers to clinical safety questions, shipping timelines, and return policies.</p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#D6C3A5]/40 rounded-lg overflow-hidden transition shadow-xs"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#FAF8F5] transition"
              >
                <span className="text-xs font-bold text-[#1E1E1E] flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2.5 text-[#4F6D5A]" />
                  {item.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#4F6D5A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-[#FAF8F5]">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
