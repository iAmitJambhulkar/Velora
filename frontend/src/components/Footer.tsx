'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ShieldCheck, Heart, Leaf } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1E1E1E] text-[#F5F1EB] pt-16 pb-8 border-t border-[#D6C3A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#F5F1EB]/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <ShieldCheck className="w-8 h-8 text-[#D6C3A5]" />
            <div>
              <h4 className="font-serif text-sm font-bold tracking-wider">Dermatologist Approved</h4>
              <p className="text-xs text-[#F5F1EB]/70 mt-1">Every molecule is thoroughly tested for dermal compatibility and clinically certified.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <Leaf className="w-8 h-8 text-[#D6C3A5]" />
            <div>
              <h4 className="font-serif text-sm font-bold tracking-wider">Clean & Conscious</h4>
              <p className="text-xs text-[#F5F1EB]/70 mt-1">100% cruelty-free, vegan formulations without parabens, phthalates, or artificial colors.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
            <Heart className="w-8 h-8 text-[#D6C3A5]" />
            <div>
              <h4 className="font-serif text-sm font-bold tracking-wider">Money Back Guarantee</h4>
              <p className="text-xs text-[#F5F1EB]/70 mt-1">Love our formulas or get a full refund within 30 days. No questions asked.</p>
            </div>
          </div>
        </div>

        {/* Directory links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-lg font-bold tracking-widest text-white">VELORA</h3>
            <p className="text-xs text-[#F5F1EB]/70 leading-relaxed max-w-sm">
              We engineer advanced formulations designed to restore and elevate skin, hair, and grooming wellness. No fluff, no marketing miracles—just pure active science in luxurious daily rituals.
            </p>
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-[#D6C3A5] font-semibold block">Office Location</span>
              <span className="text-xs text-[#F5F1EB]/60 block mt-0.5">Nagpur Hub, Maharashtra, India</span>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#D6C3A5] font-bold mb-4">Shop Solutions</h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1EB]/80">
              <li><button onClick={() => router.push('/shop?category=Skin+Care')} className="hover:text-white transition">Skincare Actives</button></li>
              <li><button onClick={() => router.push('/shop?category=Hair+Care')} className="hover:text-white transition">Haircare Cleansers</button></li>
              <li><button onClick={() => router.push('/shop?category=Grooming')} className="hover:text-white transition">Men Grooming & Beard</button></li>
              <li><button onClick={() => router.push('/quiz')} className="hover:text-white font-medium text-[#D6C3A5] transition">Personalized Routines</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#D6C3A5] font-bold mb-4">Information</h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1EB]/80">
              <li><button onClick={() => router.push('/about')} className="hover:text-white transition">Our Clinical Story</button></li>
              <li><button onClick={() => router.push('/ingredients')} className="hover:text-white transition">Ingredients Glossary</button></li>
              <li><button onClick={() => router.push('/blog')} className="hover:text-white transition">Science Journal</button></li>
              <li><button onClick={() => router.push('/faq')} className="hover:text-white transition">FAQs</button></li>
              <li><button onClick={() => router.push('/contact')} className="hover:text-white transition">Contact Us</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#D6C3A5] font-bold">Science Digest</h4>
            <p className="text-xs text-[#F5F1EB]/70 leading-relaxed">
              Subscribe to receive active ingredient studies, routine guides, and early access to drops.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#D6C3A5] font-semibold animate-pulse">Welcome to the journal. Check your inbox.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    suppressHydrationWarning={true}
                    className="w-full bg-[#F5F1EB]/10 border border-[#F5F1EB]/20 rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-[#D6C3A5] outline-none transition"
                  />
                  <button type="submit" className="absolute right-2 top-2 text-[#D6C3A5] hover:text-white">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Legal and Copyright */}
        <div className="border-t border-[#F5F1EB]/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#F5F1EB]/50 space-y-3 md:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Velora Labs Pvt Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button onClick={() => router.push('/privacy-policy')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => router.push('/terms-of-service')} className="hover:text-white transition">Terms & Conditions</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
