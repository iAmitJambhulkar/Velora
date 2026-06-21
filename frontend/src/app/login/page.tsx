'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 flex-grow flex flex-col justify-center">
      <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-8 shadow-md space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-[#1E1E1E]">Sign In</h1>
          <p className="text-xs text-gray-500">Access your personalized self-care routines and tracking.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="border-t border-[#D6C3A5]/30 pt-4 text-center text-xs text-gray-600">
          <span>New to Velora? </span>
          <button onClick={() => router.push('/register')} className="text-[#4F6D5A] font-bold hover:underline">
            Create Account
          </button>
        </div>

        {/* Demo profiles help box */}
        <div className="bg-[#FAF8F5] border border-[#D6C3A5]/20 p-3 rounded text-[10px] text-gray-500 space-y-1">
          <p className="font-bold flex items-center text-gray-600">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#4F6D5A]" /> Demo Credentials
          </p>
          <p>User account: <strong>user@velora.com</strong> / <strong>user123</strong></p>
          <p>Admin panel: <strong>admin@velora.com</strong> / <strong>admin123</strong></p>
        </div>

      </div>
    </div>
  );
}
