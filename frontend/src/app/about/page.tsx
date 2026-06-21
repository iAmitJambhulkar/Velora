'use client';

import React from 'react';
import { ShieldCheck, Leaf, BookOpen, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Our Mission</span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Elevated Rituals. Clinically Verified.</h1>
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          We believe personal grooming should be a daily luxury anchored in dermatological science, not marketing miracles.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="h-80 bg-[#FAF8F5] rounded-lg overflow-hidden border border-[#D6C3A5]/40 shadow-md">
        <img
          src="/images/our_story.webp"
          alt="Clean Clinical Formulation Labs"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Philosophy Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-600 leading-relaxed">
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1E1E1E]">The Velora Origin</h3>
          <p>
            Founded by a collective of clinical researchers and cosmetic designers, Velora was born out of frustration with e-commerce skincare clutter. Standard shelves were filled with low-potency ingredients hidden behind complex terminology, housed in cheap, generic plastic packaging.
          </p>
          <p>
            We resolved to strip away the fluff. We formulate with precise active molecular levels, label every concentration transparently, and package our formulas in recyclable premium glass jars that preserve molecular stability.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1E1E1E]">Our Clinical Promise</h3>
          <p>
            We do not sell "miracles." We sell targeted biological outcomes (pore clarification, follicle fortification, skin hydration). Every molecule in our library is selected based on peer-reviewed double-blind clinical trials.
          </p>
          <p>
            Through our network of consulting dermatologists, our products undergo patch diagnostics on sensitive skin profiles to guarantee absolute dermal safety and high efficacy.
          </p>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#D6C3A5]/40 text-center">
        <div className="space-y-1">
          <ShieldCheck className="w-6 h-6 text-[#4F6D5A] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#1E1E1E]">100% Transparent</h4>
          <p className="text-[10px] text-gray-400">All active percentages declared.</p>
        </div>
        <div className="space-y-1">
          <Leaf className="w-6 h-6 text-[#4F6D5A] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#1E1E1E]">Vegan & Cruelty Free</h4>
          <p className="text-[10px] text-gray-400">Zero animal testing or elements.</p>
        </div>
        <div className="space-y-1">
          <BookOpen className="w-6 h-6 text-[#4F6D5A] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#1E1E1E]">Clinical Verification</h4>
          <p className="text-[10px] text-gray-400">Backed by peer-reviewed studies.</p>
        </div>
        <div className="space-y-1">
          <Award className="w-6 h-6 text-[#4F6D5A] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#1E1E1E]">Derm Tested</h4>
          <p className="text-[10px] text-gray-400">Certified for sensitive skin.</p>
        </div>
      </div>

    </div>
  );
}
