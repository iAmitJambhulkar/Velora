'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, ClipboardList, Heart, Trash2, Plus, Download, LogOut, Loader2, Home, CheckCircle2, ChevronRight, Calendar, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, addAddress, deleteAddress, loading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await apiFetch('/orders/myorders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load dashboard orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (!user) return;

    const loadWishlist = async () => {
      setWishlistLoading(true);
      try {
        const wishlist = user.wishlist || [];
        if (wishlist.length === 0) {
          setWishlistProducts([]);
          setWishlistLoading(false);
          return;
        }
        
        const res = await apiFetch('/products?limit=100');
        const matched = res.data.filter((p: any) => wishlist.includes(p._id));
        setWishlistProducts(matched);
      } catch (err) {
        console.error('Failed to load wishlist items:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    if (activeTab === 'wishlist') {
      loadWishlist();
    }
  }, [activeTab, user?.wishlist]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#4F6D5A] animate-spin" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F6D5A]">Loading secure session...</span>
        </div>
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      await addAddress({
        street,
        city,
        state: stateName,
        zipCode,
        country: 'India',
        isDefault: user.addresses.length === 0 // Make default if first address
      });
      setStreet('');
      setCity('');
      setStateName('');
      setZipCode('');
      setShowAddressForm(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 flex-grow flex flex-col justify-start">
      
      {/* Banner / Premium Header Section */}
      <div className="mb-10 border-b border-[#D6C3A5]/45 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4F6D5A] tracking-widest block">Velora Member Portal</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">
            Welcome back, <span className="text-[#4F6D5A]">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Review clinical orders, customize your delivery configurations, and track wishlisted formulations.
          </p>
        </div>
        <div className="bg-white/60 border border-[#D6C3A5]/50 px-4 py-2.5 rounded-lg text-[10px] text-gray-600 flex items-center space-x-2.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F6D5A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F6D5A]"></span>
          </span>
          <span>Secure MDB Instance Connected</span>
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
        
        {/* SIDE BAR PROFILE NAV (col-span-3) */}
        <aside className="lg:col-span-3 bg-white/70 backdrop-blur-md border border-[#D6C3A5]/40 rounded-xl p-6 shadow-sm space-y-6 lg:sticky lg:top-28">
          
          <div className="text-center space-y-4 border-b border-[#D6C3A5]/25 pb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#4F6D5A] to-[#688E75] text-[#F5F1EB] rounded-full flex items-center justify-center font-serif text-3xl font-bold shadow-md shadow-[#4F6D5A]/15 border border-[#D6C3A5]/50">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-white border border-[#D6C3A5]/50 text-[#4F6D5A] p-1.5 rounded-full shadow-sm">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-[#1E1E1E] leading-tight">{user.name}</h2>
              <p className="text-[11px] text-gray-400 font-mono tracking-tight">{user.email}</p>
            </div>
            
            <span className="inline-block text-[9px] bg-[#4F6D5A]/10 text-[#4F6D5A] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider border border-[#4F6D5A]/20">
              {user.role} Member
            </span>
          </div>

          <nav className="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 border ${
                activeTab === 'orders'
                  ? 'bg-[#4F6D5A] text-white border-[#4F6D5A] shadow-sm shadow-[#4F6D5A]/20 font-bold'
                  : 'bg-white/40 border-[#D6C3A5]/20 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/40 text-gray-700'
              }`}
            >
              <ClipboardList className="w-4.5 h-4.5" />
              <span className="flex-grow">My Orders</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'orders' ? 'translate-x-0.5' : 'text-gray-400'}`} />
            </button>
            
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 border ${
                activeTab === 'addresses'
                  ? 'bg-[#4F6D5A] text-white border-[#4F6D5A] shadow-sm shadow-[#4F6D5A]/20 font-bold'
                  : 'bg-white/40 border-[#D6C3A5]/20 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/40 text-gray-700'
              }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              <span className="flex-grow">Saved Addresses</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'addresses' ? 'translate-x-0.5' : 'text-gray-400'}`} />
            </button>
            
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 border ${
                activeTab === 'wishlist'
                  ? 'bg-[#4F6D5A] text-white border-[#4F6D5A] shadow-sm shadow-[#4F6D5A]/20 font-bold'
                  : 'bg-white/40 border-[#D6C3A5]/20 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/40 text-gray-700'
              }`}
            >
              <Heart className="w-4.5 h-4.5" />
              <span className="flex-grow">Wishlist ({(user.wishlist || []).length})</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'wishlist' ? 'translate-x-0.5' : 'text-gray-400'}`} />
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full py-3 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50/60 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* DETAILS PANEL CONTAINER (col-span-9) */}
        <section className="lg:col-span-9 bg-white/80 backdrop-blur-md border border-[#D6C3A5]/45 rounded-xl p-6 md:p-8 shadow-sm min-h-[600px] flex flex-col justify-start">
          
          {/* ORDERS HISTORY TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#1E1E1E] border-b border-[#D6C3A5]/20 pb-4 flex items-center justify-between">
                <span>Order History</span>
                <span className="text-xs font-sans font-normal text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''} found</span>
              </h3>

              {ordersLoading ? (
                <div className="flex flex-col justify-center items-center py-20 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#4F6D5A] animate-spin" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Querying orders database...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 space-y-5 bg-[#FAF8F5]/50 border border-dashed border-[#D6C3A5]/50 rounded-xl">
                  <ClipboardList className="w-10 h-10 text-[#D6C3A5] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">No active orders</p>
                    <p className="text-xs text-gray-400">You haven't checked out any formulation treatments yet.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/shop')} 
                    className="px-6 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white text-xs font-bold uppercase rounded-lg shadow-sm transition"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord._id} className="border border-[#D6C3A5]/35 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
                      
                      {/* Order Title Box */}
                      <div className="bg-[#FAF8F5] px-6 py-4.5 border-b border-[#D6C3A5]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Mongoose Unique ID</span>
                          <p className="font-mono text-xs text-gray-700 font-bold tracking-tight">{ord._id}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Checkout Date</span>
                            <span className="text-gray-700 font-semibold flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                              {new Date(ord.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Fulfillment</span>
                            <span className={`inline-flex px-3 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider border ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items & Invoicing Panel */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* List items (7 Cols) */}
                        <div className="md:col-span-7 space-y-4">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Ordered Formulations</span>
                          <div className="divide-y divide-[#D6C3A5]/25">
                            {ord.products.map((p: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                                <div className="flex items-center space-x-3.5">
                                  <span className="inline-flex w-5.5 h-5.5 items-center justify-center bg-[#4F6D5A]/10 text-[#4F6D5A] text-[10px] font-bold rounded-full border border-[#4F6D5A]/20">
                                    {p.quantity}
                                  </span>
                                  <span className="text-xs text-gray-800 font-semibold">{p.title}</span>
                                </div>
                                <span className="text-xs text-gray-600 font-bold">₹{p.price * p.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary / Invoicing (5 Cols with left border) */}
                        <div className="md:col-span-5 md:border-l md:border-[#D6C3A5]/20 md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-4 h-full py-1">
                          <div className="space-y-1">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount Paid</span>
                            <span className="text-2xl font-serif font-extrabold text-[#1E1E1E] block">₹{ord.total}</span>
                            <span className="text-[9px] text-gray-400 block uppercase font-medium tracking-wide">
                              Method: {ord.paymentMethod} &bull; {ord.paymentStatus}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => window.open(`http://localhost:5000/api/orders/invoice/${ord._id}`, '_blank')}
                            className="flex items-center space-x-2 px-4.5 py-2.5 border border-[#D6C3A5] hover:bg-[#4F6D5A] hover:text-white hover:border-[#4F6D5A] rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all duration-250 cursor-pointer shadow-sm hover:shadow"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Invoice</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-[#D6C3A5]/20 pb-4">
                <h3 className="font-serif text-xl font-bold text-[#1E1E1E]">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded-lg text-[10px] uppercase font-bold tracking-widest transition shadow-sm"
                >
                  {showAddressForm ? <span>Hide Form</span> : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-[#FAF8F5] border border-[#D6C3A5]/45 p-6 rounded-xl space-y-4 max-w-xl shadow-inner animate-in fade-in slide-in-from-top-3 duration-250">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#4F6D5A]">New Delivery Location</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Street address / House No. / Apartment</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat 101, Velora Residency, Active Enclave"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-white border border-[#D6C3A5]/60 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#4F6D5A] focus:ring-1 focus:ring-[#4F6D5A] transition"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#D6C3A5]/60 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">State</label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-white border border-[#D6C3A5]/60 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Zip Code</label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        placeholder="400001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-white border border-[#D6C3A5]/60 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-2.5 border border-[#D6C3A5] rounded-lg text-xs font-semibold text-gray-600 bg-white transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="flex-1 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Address</span>}
                    </button>
                  </div>
                </form>
              )}

              {/* Address card grids */}
              {user.addresses.length === 0 ? (
                <div className="text-center py-16 space-y-4 bg-[#FAF8F5]/30 border border-dashed border-[#D6C3A5]/50 rounded-xl">
                  <MapPin className="w-10 h-10 text-[#D6C3A5] mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold">No delivery locations saved. Click "Add New" to save.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses.map((addr: any) => (
                    <div 
                      key={addr._id} 
                      className="border border-[#D6C3A5]/35 rounded-xl p-5 bg-white relative hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[140px]"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                            addr.isDefault 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {addr.isDefault ? 'Default Address' : 'Secondary'}
                          </span>
                          <button
                            onClick={() => deleteAddress(addr._id)}
                            className="text-gray-400 hover:text-rose-600 p-1.5 transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                            {addr.street}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                            {addr.country}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#1E1E1E] border-b border-[#D6C3A5]/20 pb-4 flex items-center justify-between">
                <span>My Wishlist</span>
                <span className="text-xs font-sans font-normal text-gray-500">{(user.wishlist || []).length} item{(user.wishlist || []).length !== 1 ? 's' : ''} saved</span>
              </h3>

              {wishlistLoading ? (
                <div className="flex flex-col justify-center items-center py-20 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#4F6D5A] animate-spin" />
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Querying collections database...</span>
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-20 space-y-5 bg-[#FAF8F5]/50 border border-dashed border-[#D6C3A5]/50 rounded-xl">
                  <Heart className="w-10 h-10 text-[#D6C3A5] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">Wishlist empty</p>
                    <p className="text-xs text-gray-400">Save products to wishlist to track pricing updates.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/shop')} 
                    className="px-6 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white text-xs font-bold uppercase rounded-lg shadow-sm transition"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

        </section>
      </div>

    </div>
  );
}
