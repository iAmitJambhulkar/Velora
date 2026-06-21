'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ClipboardList, Tag, Plus, Trash2, Edit2, Loader2, ArrowRight, ShieldAlert, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons'>('analytics');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Product Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [productTitle, setProductTitle] = useState('');
  const [productCategory, setProductCategory] = useState('Skin Care');
  const [productPrice, setProductPrice] = useState(999);
  const [productSalePrice, setProductSalePrice] = useState(799);
  const [productStock, setProductStock] = useState(30);
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600');
  const [savingProduct, setSavingProduct] = useState(false);

  // Coupon Form states
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [couponValue, setCouponValue] = useState(10);
  const [couponMinOrder, setCouponMinOrder] = useState(500);
  const [savingCoupon, setSavingCoupon] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user]);

  const loadAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      // 1. Fetch Analytics
      const analyticsRes = await apiFetch('/orders/admin/analytics');
      setStats(analyticsRes.data);

      // 2. Fetch Products
      const productsRes = await apiFetch('/products?limit=100');
      setProducts(productsRes.data);

      // 3. Fetch Orders
      const ordersRes = await apiFetch('/orders/admin/list');
      setOrders(ordersRes.data);

      // 4. Fetch Coupons
      const couponsRes = await apiFetch('/coupons');
      setCoupons(couponsRes.data);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center p-6 space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="font-serif text-xl font-bold">Access Denied</h2>
        <p className="text-xs text-gray-500">Only authorized administrators can access this dashboard panel.</p>
      </div>
    );
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const slug = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newProduct = {
        title: productTitle,
        slug,
        category: productCategory,
        price: Number(productPrice),
        salePrice: Number(productSalePrice),
        stock: Number(productStock),
        description: productDescription,
        images: [productImage],
        benefits: ['Dermatologist formulated', 'Clinically verified'],
        ingredients: [{ name: 'Hyaluronic Acid', percentage: '2%', purpose: 'Dermal hydration booster' }],
        usageGuide: { morning: 'Apply to damp face.', night: 'Lock with moisture barrier creams.' },
        ratings: { average: 5, count: 0 }
      };

      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(newProduct)
      });

      // Reload
      loadAdminData();
      setShowProductForm(false);
      setProductTitle('');
      setProductDescription('');
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product formulation?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      loadAdminData();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiFetch(`/orders/admin/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: status })
      });
      loadAdminData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCoupon(true);
    try {
      const newCoupon = {
        code: couponCode.toUpperCase(),
        discountType: couponType,
        discountValue: Number(couponValue),
        minOrderValue: Number(couponMinOrder),
        isActive: true
      };

      await apiFetch('/coupons', {
        method: 'POST',
        body: JSON.stringify(newCoupon)
      });

      loadAdminData();
      setShowCouponForm(false);
      setCouponCode('');
    } catch (err) {
      console.error('Failed to create coupon:', err);
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Remove this promotional code?')) return;
    try {
      await apiFetch(`/coupons/${id}`, { method: 'DELETE' });
      loadAdminData();
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D6C3A5]/40 pb-6 mb-8 gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1E1E1E]">Console Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Configure inventory listings, track payments, and manage fulfillment routines.</p>
        </div>
        
        <button
          onClick={loadAdminData}
          className="px-4 py-2 border border-[#D6C3A5] rounded text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-black/5"
        >
          Refresh Live Data
        </button>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#4F6D5A] animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Admin Navigation Sidebar */}
          <aside className="w-full lg:w-1/5 bg-white border border-[#D6C3A5]/40 rounded-lg p-5 space-y-4 h-fit">
            <nav className="flex flex-row lg:flex-col justify-between lg:justify-start gap-1.5 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'analytics' ? 'bg-[#4F6D5A] text-white' : 'text-gray-600 hover:bg-[#D6C3A5]/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'products' ? 'bg-[#4F6D5A] text-white' : 'text-gray-600 hover:bg-[#D6C3A5]/10'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Products ({products.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'orders' ? 'bg-[#4F6D5A] text-white' : 'text-gray-600 hover:bg-[#D6C3A5]/10'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-md flex items-center space-x-2 transition ${
                  activeTab === 'coupons' ? 'bg-[#4F6D5A] text-white' : 'text-gray-600 hover:bg-[#D6C3A5]/10'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Promo Coupons</span>
              </button>
            </nav>
          </aside>

          {/* MAIN PANELS DISPLAY */}
          <section className="flex-grow bg-white border border-[#D6C3A5]/40 rounded-lg p-6 md:p-8">
            
            {/* ANALYTICS PANEL */}
            {activeTab === 'analytics' && stats && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="font-serif text-lg font-bold text-[#1E1E1E] border-b border-[#FAF8F5] pb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 text-[#4F6D5A] mr-2" /> Live Analytics
                </h3>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#FAF8F5] border border-[#D6C3A5]/35 p-5 rounded-lg space-y-1.5 shadow-sm">
                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Total Sales Revenue</span>
                    <h4 className="text-2xl font-serif font-extrabold text-[#4F6D5A] flex items-center">
                      <TrendingUp className="w-5 h-5 mr-1" /> ₹{stats.totalRevenue}
                    </h4>
                    <p className="text-[9px] text-gray-400">Total volume from completed and COD payments.</p>
                  </div>
                  
                  <div className="bg-[#FAF8F5] border border-[#D6C3A5]/35 p-5 rounded-lg space-y-1.5 shadow-sm">
                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Overall Orders</span>
                    <h4 className="text-2xl font-serif font-extrabold text-[#1E1E1E]">{stats.totalOrders}</h4>
                    <p className="text-[9px] text-gray-400">Total checkouts processed via customer flows.</p>
                  </div>
                  
                  <div className="bg-[#FAF8F5] border border-[#D6C3A5]/35 p-5 rounded-lg space-y-1.5 shadow-sm">
                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Pending Fulfillment</span>
                    <h4 className="text-2xl font-serif font-extrabold text-amber-600">{stats.pendingFulfillment}</h4>
                    <p className="text-[9px] text-gray-400">Orders requiring packaging and dispatch routing.</p>
                  </div>
                </div>

                {/* Stock Warning Box */}
                {stats.lowStockProducts.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                    <h4 className="text-xs uppercase font-bold text-amber-800 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1.5" /> Low Inventory Warnings
                    </h4>
                    <ul className="text-xs text-amber-700 space-y-1.5">
                      {stats.lowStockProducts.map((p: any) => (
                        <li key={p._id} className="flex justify-between max-w-md">
                          <span>{p.title}</span>
                          <strong className="text-red-600">{p.stock} units remaining</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS MANAGER PANEL */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-[#FAF8F5] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Product Catalog ({products.length})</h3>
                  <button
                    onClick={() => setShowProductForm(!showProductForm)}
                    className="flex items-center space-x-1 px-3.5 py-2 bg-[#4F6D5A] text-white rounded text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Formulation</span>
                  </button>
                </div>

                {/* Create Product Form */}
                {showProductForm && (
                  <form onSubmit={handleCreateProduct} className="bg-[#FAF8F5] border border-[#D6C3A5]/40 p-5 rounded-lg space-y-4 max-w-xl">
                    <h4 className="text-xs uppercase font-bold text-[#4F6D5A]">New Product Form</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Product Title</label>
                        <input
                          type="text"
                          required
                          value={productTitle}
                          onChange={(e) => setProductTitle(e.target.value)}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                          placeholder="e.g. 10% Vitamin B5 Dermal Jelly"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Category</label>
                        <select
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        >
                          <option value="Skin Care">Skin Care</option>
                          <option value="Hair Care">Hair Care</option>
                          <option value="Grooming">Grooming</option>
                          <option value="Wellness">Wellness</option>
                          <option value="Beauty Essentials">Beauty Essentials</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={productPrice}
                          onChange={(e) => setProductPrice(Number(e.target.value))}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Sale Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={productSalePrice}
                          onChange={(e) => setProductSalePrice(Number(e.target.value))}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Initial Stock</label>
                        <input
                          type="number"
                          required
                          value={productStock}
                          onChange={(e) => setProductStock(Number(e.target.value))}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Image Asset URL</label>
                      <input
                        type="text"
                        required
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full bg-white border border-[#D6C3A5]/60 rounded p-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                        placeholder="Clinical rationale, sensory feeling, and texture notes..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="flex-1 py-2 border border-[#D6C3A5] rounded text-xs text-gray-600 bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="flex-1 py-2 bg-[#4F6D5A] text-white rounded text-xs font-bold uppercase tracking-wider"
                      >
                        {savingProduct ? '...' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6C3A5]/40 text-gray-400 uppercase tracking-wider font-bold">
                        <th className="py-2.5">Formulation</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} className="border-b border-gray-100 hover:bg-[#FAF8F5]/30">
                          <td className="py-3 flex items-center font-medium text-[#1E1E1E]">
                            <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded border mr-2.5 bg-[#FAF8F5]" />
                            <span className="truncate max-w-[200px]">{p.title}</span>
                          </td>
                          <td className="text-gray-500">{p.category}</td>
                          <td>₹{p.salePrice || p.price}</td>
                          <td className={p.stock <= 5 ? 'text-red-600 font-bold' : ''}>{p.stock} units</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 transition"
                              title="Delete formulation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS MANAGER PANEL */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif text-lg font-bold text-[#1E1E1E] border-b border-[#FAF8F5] pb-3">
                  Customer Orders ({orders.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6C3A5]/40 text-gray-400 uppercase tracking-wider font-bold">
                        <th className="py-2.5">Order ID</th>
                        <th>Placed By</th>
                        <th>Payment Mode</th>
                        <th>Fulfillment</th>
                        <th className="text-right">Action status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} className="border-b border-gray-100 hover:bg-[#FAF8F5]/30">
                          <td className="py-3 font-mono text-gray-600 truncate max-w-[120px]">{o._id}</td>
                          <td className="font-medium text-[#1E1E1E]">
                            {o.shippingAddress.name || o.guestDetails?.name || 'Guest'}
                          </td>
                          <td>{o.paymentMethod} &bull; <strong className="text-gray-700">{o.paymentStatus}</strong></td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              o.orderStatus === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : o.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="text-right">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="px-2 py-1 border border-[#D6C3A5] rounded text-[10px] bg-[#F5F1EB] outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COUPONS MANAGER PANEL */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-[#FAF8F5] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Promo Coupons ({coupons.length})</h3>
                  <button
                    onClick={() => setShowCouponForm(!showCouponForm)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#4F6D5A] text-white rounded text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Promo</span>
                  </button>
                </div>

                {/* Create Coupon Form */}
                {showCouponForm && (
                  <form onSubmit={handleCreateCoupon} className="bg-[#FAF8F5] border border-[#D6C3A5]/40 p-5 rounded-lg space-y-4 max-w-md">
                    <h4 className="text-xs uppercase font-bold text-[#4F6D5A]">New Promo Coupon</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Coupon Code</label>
                        <input
                          type="text"
                          required
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                          placeholder="e.g. RADIANT15"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Type</label>
                        <select
                          value={couponType}
                          onChange={(e) => setCouponType(e.target.value as any)}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        >
                          <option value="Percentage">Percentage Off</option>
                          <option value="Fixed">Fixed Amount Off</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Discount Value</label>
                        <input
                          type="number"
                          required
                          value={couponValue}
                          onChange={(e) => setCouponValue(Number(e.target.value))}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Min Order Requirement</label>
                        <input
                          type="number"
                          required
                          value={couponMinOrder}
                          onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                          className="w-full bg-white border border-[#D6C3A5]/60 rounded px-3 py-1.5 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCouponForm(false)}
                        className="flex-1 py-1.5 border border-[#D6C3A5] rounded text-xs text-gray-600 bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingCoupon}
                        className="flex-1 py-1.5 bg-[#4F6D5A] text-white rounded text-xs font-bold uppercase"
                      >
                        {savingCoupon ? '...' : 'Save Promo'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Coupons Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6C3A5]/40 text-gray-400 uppercase tracking-wider font-bold">
                        <th className="py-2.5">Code</th>
                        <th>Discount Value</th>
                        <th>Min Order Req</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c._id} className="border-b border-gray-100 hover:bg-[#FAF8F5]/30">
                          <td className="py-3 font-mono font-bold text-[#1E1E1E]">{c.code}</td>
                          <td>{c.discountType === 'Percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}</td>
                          <td>₹{c.minOrderValue}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c._id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </section>
        </div>
      )}

    </div>
  );
}
