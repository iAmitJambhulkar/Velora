'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, BarChart2, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useCompareStore } from '../store/compareStore';
import CartDrawer from './CartDrawer';
import CommandMenu from './CommandMenu';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const compareProducts = useCompareStore((state) => state.products);

  // Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!user) {
          router.push('/login');
          return;
        }
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, router]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Shop Formulations', path: '/shop' },
    { label: 'Self-Care Quiz', path: '/quiz' },
    { label: 'Ingredients Library', path: '/ingredients' },
    { label: 'Science Journal', path: '/blog' },
    { label: 'Our Story', path: '/about' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[#D6C3A5]/50">
        {/* Banner */}
        <div className="bg-[#4F6D5A] text-white py-2 text-center text-[10px] tracking-widest uppercase font-semibold">
          Dermatologist Formulated &bull; Complimentary shipping on orders above ₹1,500
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo Monogram */}
          <div className="flex-1 lg:flex-initial">
            <button onClick={() => router.push('/')} className="text-left">
              <span className="font-serif text-lg md:text-xl font-extrabold tracking-widest text-[#1E1E1E]">
                VELORA
              </span>
              <span className="block text-[8px] tracking-widest text-[#4F6D5A] uppercase font-semibold">
                Clinical Formulations
              </span>
            </button>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#1E1E1E]/80">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className={`hover:text-[#4F6D5A] transition relative py-1 ${active ? 'text-[#4F6D5A]' : ''}`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4F6D5A] rounded-full animate-in fade-in duration-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Icon Actions */}
          <div className="flex-1 lg:flex-initial flex items-center justify-end space-x-5">
            {/* Search (Ctrl+K) */}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login');
                  return;
                }
                setSearchOpen(true);
              }}
              className="text-[#1E1E1E] hover:text-[#4F6D5A] transition"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Compare Badge */}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login');
                  return;
                }
                router.push('/compare');
              }}
              className="hidden sm:flex text-[#1E1E1E] hover:text-[#4F6D5A] transition relative"
              title="Product Comparison"
            >
              <BarChart2 className="w-4.5 h-4.5 rotate-90" />
              {compareProducts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D6C3A5] text-[#1E1E1E] text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-[#F5F1EB]">
                  {compareProducts.length}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            {user ? (
              <div className="hidden sm:block relative group">
                <button
                  onClick={() => router.push(user.role === 'admin' ? '/admin' : '/dashboard')}
                  className="text-[#1E1E1E] hover:text-[#4F6D5A] transition flex items-center space-x-1"
                >
                  <User className="w-4.5 h-4.5" />
                  <span className="hidden md:inline text-[10px] uppercase tracking-wider font-semibold max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                {/* Simple dropdown */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-[#F5F1EB] border border-[#D6C3A5] rounded-md shadow-xl py-2 w-40 text-xs">
                    <button
                      onClick={() => router.push(user.role === 'admin' ? '/admin' : '/dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-[#D6C3A5]/10 text-[#1E1E1E] font-medium"
                    >
                      Dashboard
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => router.push('/admin')}
                        className="w-full text-left px-4 py-2 hover:bg-[#D6C3A5]/10 text-[#1E1E1E] font-medium"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); router.push('/login'); }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium border-t border-[#D6C3A5]/30 mt-1"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="hidden sm:block text-[#1E1E1E] hover:text-[#4F6D5A] transition"
                title="Account Login"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )}

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login');
                  return;
                }
                setCartOpen(true);
              }}
              className="text-[#1E1E1E] hover:text-[#4F6D5A] transition relative"
              title="Shopping bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#4F6D5A] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-[#F5F1EB]">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#1E1E1E] hover:text-[#4F6D5A] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F5F1EB] border-t border-[#D6C3A5]/50 px-4 py-4 space-y-3 shadow-inner animate-in slide-in-from-top-5 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { handleNavClick(); router.push(link.path); }}
                className={`block w-full text-left py-2 text-xs font-semibold uppercase tracking-wider text-[#1E1E1E] hover:text-[#4F6D5A] transition`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Mobile User account links */}
            <div className="border-t border-[#D6C3A5]/30 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => { handleNavClick(); router.push(user.role === 'admin' ? '/admin' : '/dashboard'); }}
                    className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-[#4F6D5A]"
                  >
                    My Account ({user.name.split(' ')[0]})
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => { handleNavClick(); router.push('/admin'); }}
                      className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-[#4F6D5A]"
                    >
                      Admin Console
                    </button>
                  )}
                  <button
                    onClick={() => { handleNavClick(); logout(); router.push('/login'); }}
                    className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-rose-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { handleNavClick(); router.push('/login'); }}
                  className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-[#4F6D5A]"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals/Drawers */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <CommandMenu isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
