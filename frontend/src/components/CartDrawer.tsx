'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, ShoppingBag, ArrowRight, Bookmark, MoveUp, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    saveForLater,
    coupon,
    applyCoupon,
    removeCoupon,
    removeItem,
    updateQuantity,
    saveItemForLater,
    moveToCart,
    removeSavedItem,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal
  } = useCartStore();

  const toggleWishlist = useAuthStore((state) => state.toggleWishlist);
  const addToast = useToastStore((state) => state.addToast);

  const [couponCode, setCouponCode] = useState('');
  const [productToRemove, setProductToRemove] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      await applyCoupon(couponCode);
      setCouponSuccess('Coupon applied successfully!');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shipping = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0);
  const total = getCartTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F1EB] border-l border-[#D6C3A5] shadow-2xl flex flex-col relative">
          {/* Remove Confirmation Modal Overlay */}
          {productToRemove && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
              <div className="bg-[#F5F1EB] border border-[#D6C3A5] rounded-xl p-6 shadow-2xl max-w-xs w-full space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1E1E1E]">Remove Formulation</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Would you like to move <span className="font-semibold text-[#1E1E1E]">{productToRemove.title}</span> to your Wishlist, or just remove it from your bag?
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      toggleWishlist(productToRemove._id);
                      removeItem(productToRemove._id);
                      addToast(`${productToRemove.title} moved to wishlist!`, 'success');
                      setProductToRemove(null);
                    }}
                    className="w-full py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/90 text-white rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                  >
                    Move to Wishlist
                  </button>
                  <button
                    onClick={() => {
                      removeItem(productToRemove._id);
                      addToast(`${productToRemove.title} removed from bag`, 'info');
                      setProductToRemove(null);
                    }}
                    className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#1E1E1E] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                  >
                    Remove Only
                  </button>
                  <button
                    onClick={() => setProductToRemove(null)}
                    className="w-full py-2 text-center text-xs text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#D6C3A5] flex justify-between items-center bg-[#F5F1EB]">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 text-[#4F6D5A] mr-2" />
              <span className="font-serif text-lg font-bold text-[#1E1E1E]">Your Ritual Bag ({items.length})</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 text-gray-500 hover:text-[#1E1E1E]">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-500 space-y-4">
                <p className="text-sm">Your bag is currently empty.</p>
                <button
                  onClick={() => { onClose(); router.push('/shop'); }}
                  className="px-4 py-2 border border-[#4F6D5A] text-[#4F6D5A] text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#4F6D5A] hover:text-white transition"
                >
                  Start Exploring Formulations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const itemPrice = item.product.salePrice || item.product.price;
                  return (
                    <div key={item.product._id} className="flex p-3 bg-white border border-[#D6C3A5]/40 rounded-lg space-x-3">
                      <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-16 object-cover rounded bg-[#F5F1EB] border" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-[#1E1E1E] truncate">{item.product.title}</h4>
                          <p className="text-xs text-[#4F6D5A] mt-0.5">{item.product.category}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-[#D6C3A5] rounded-md px-1 bg-[#F5F1EB]">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="px-1 text-xs text-[#1E1E1E] font-bold hover:text-[#4F6D5A]"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs text-[#1E1E1E] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="px-1 text-xs text-[#1E1E1E] font-bold hover:text-[#4F6D5A]"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Item price */}
                          <span className="text-sm font-medium text-[#1E1E1E]">₹{itemPrice * item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button onClick={() => setProductToRemove(item.product)} className="text-gray-400 hover:text-red-600 transition p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => saveItemForLater(item.product._id)}
                          title="Save for Later"
                          className="text-gray-400 hover:text-[#4F6D5A] transition p-1"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Save For Later Section */}
            {saveForLater.length > 0 && (
              <div className="pt-6 border-t border-[#D6C3A5]/50">
                <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-semibold mb-3 flex items-center">
                  <Bookmark className="w-3.5 h-3.5 mr-1" /> Saved For Later ({saveForLater.length})
                </h4>
                <div className="space-y-3">
                  {saveForLater.map((item) => (
                    <div key={item.product._id} className="flex p-3 bg-white/50 border border-[#D6C3A5]/20 rounded-lg space-x-3 opacity-80 hover:opacity-100 transition">
                      <img src={item.product.images[0]} alt={item.product.title} className="w-12 h-12 object-cover rounded bg-[#F5F1EB] border" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-[#1E1E1E] truncate">{item.product.title}</h5>
                        <p className="text-xs text-gray-500">₹{item.product.salePrice || item.product.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveToCart(item.product._id)}
                          className="p-1.5 bg-[#4F6D5A]/10 text-[#4F6D5A] hover:bg-[#4F6D5A] hover:text-white rounded transition"
                          title="Move to Bag"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSavedItem(item.product._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary (if items in cart) */}
          {items.length > 0 && (
            <div className="px-6 py-6 border-t border-[#D6C3A5] bg-white space-y-4">
              {/* Coupon Form */}
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 border border-[#D6C3A5] rounded-md text-xs bg-[#F5F1EB] outline-none"
                    placeholder="Enter Coupon Code (e.g. VELORA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-1.5 bg-[#4F6D5A] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#4F6D5A]/90 transition"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center p-2 bg-[#4F6D5A]/10 border border-[#4F6D5A]/30 rounded-md">
                  <span className="text-xs font-medium text-[#4F6D5A] flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1" /> Code {coupon.code} active
                  </span>
                  <button onClick={removeCoupon} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-red-600 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-green-600 mt-1">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#1E1E1E]">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Code Applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-[#1E1E1E]">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400">Add ₹{Math.max(0, 1500 - subtotal)} more for FREE shipping</p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#D6C3A5] text-[#1E1E1E]">
                <span className="font-serif text-sm font-bold">Total Amount</span>
                <span className="font-serif text-lg font-bold">₹{total}</span>
              </div>

              {/* CTA Checkout */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#4F6D5A] hover:bg-[#4F6D5A]/90 text-white rounded-md font-semibold tracking-wider text-xs uppercase flex items-center justify-center space-x-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
