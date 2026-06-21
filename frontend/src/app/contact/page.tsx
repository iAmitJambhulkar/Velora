'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 flex-grow flex flex-col justify-center">

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Get In Touch</span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Contact Our Labs</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">Have a formulation query or shipping question? Our support team responds in 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Info list */}
        <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6 space-y-6">
          <h3 className="font-serif text-base font-bold text-[#1E1E1E] border-b pb-2">Support Channels</h3>

          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[#4F6D5A] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1E1E1E]">Email Diagnostics Support</p>
                <p className="mt-0.5">support@velora.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#4F6D5A] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1E1E1E]">Call Representative</p>
                <p className="mt-0.5">+91 80 4455 6677 (Mon-Sat, 9AM-6PM)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#4F6D5A] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1E1E1E]">Velora Lab HQ</p>
                <p className="mt-0.5">101, Science Park Lane, Nagpur, Maharashtra, 440001, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#4F6D5A] mx-auto" />
              <h4 className="font-serif text-sm font-bold text-[#1E1E1E]">Message Dispatched</h4>
              <p className="text-xs text-gray-500">We have received your diagnostic inquiry and will follow up shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-1.5 border border-[#D6C3A5] rounded text-xs font-bold uppercase tracking-wider"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1E1E1E] border-b pb-2">Direct Inquiry</h3>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none focus:border-[#4F6D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Message / Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded p-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                  placeholder="Ask us about active ingredients or order tracking..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Dispatch Message</span>}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
