'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 flex-grow flex flex-col justify-center">
      <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-8 shadow-md space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-[#1E1E1E]">Create Account</h1>
          <p className="text-xs text-gray-500">Access personalized routine builders and track order histories.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="Amit Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D6C3A5]/60 rounded px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded font-bold uppercase tracking-wider text-xs shadow flex items-center justify-center space-x-2 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register Account</span>}
          </button>
        </form>

        <div className="border-t border-[#D6C3A5]/30 pt-4 text-center text-xs text-gray-600">
          <span>Already have an account? </span>
          <button onClick={() => router.push('/login')} className="text-[#4F6D5A] font-bold hover:underline">
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
