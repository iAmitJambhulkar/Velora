import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export interface CartItem {
  product: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    stock: number;
  };
  quantity: number;
}

interface CouponDetails {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
}

interface CartState {
  items: CartItem[];
  saveForLater: CartItem[];
  recentlyViewed: string[]; // Slugs array
  coupon: CouponDetails | null;
  shippingEstimate: number;
  
  initialize: () => void;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  saveItemForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  addRecentlyViewed: (slug: string) => void;
  
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  saveForLater: [],
  recentlyViewed: [],
  coupon: null,
  shippingEstimate: 0,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const cart = localStorage.getItem('velora_cart');
    const later = localStorage.getItem('velora_later');
    const recent = localStorage.getItem('velora_recent');
    const coup = localStorage.getItem('velora_coupon');
    
    set({
      items: cart ? JSON.parse(cart) : [],
      saveForLater: later ? JSON.parse(later) : [],
      recentlyViewed: recent ? JSON.parse(recent) : [],
      coupon: coup ? JSON.parse(coup) : null,
      shippingEstimate: 0
    });
  },

  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const index = items.findIndex(item => item.product._id === product._id);
    
    if (index >= 0) {
      const newQty = items[index].quantity + quantity;
      items[index].quantity = Math.min(newQty, product.stock || 10);
    } else {
      items.push({ product, quantity });
    }

    localStorage.setItem('velora_cart', JSON.stringify(items));
    set({ items });
  },

  removeItem: (productId) => {
    const items = get().items.filter(item => item.product._id !== productId);
    localStorage.setItem('velora_cart', JSON.stringify(items));
    set({ items });
  },

  updateQuantity: (productId, quantity) => {
    const items = get().items.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock || 10)) };
      }
      return item;
    });

    localStorage.setItem('velora_cart', JSON.stringify(items));
    set({ items });
  },

  clearCart: () => {
    localStorage.removeItem('velora_cart');
    localStorage.removeItem('velora_coupon');
    set({ items: [], coupon: null });
  },

  applyCoupon: async (code) => {
    try {
      const subtotal = get().getCartSubtotal();
      const res = await apiFetch('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
      const couponDetails = res.data;
      localStorage.setItem('velora_coupon', JSON.stringify(couponDetails));
      set({ coupon: couponDetails });
    } catch (err: any) {
      set({ coupon: null });
      throw err;
    }
  },

  removeCoupon: () => {
    localStorage.removeItem('velora_coupon');
    set({ coupon: null });
  },

  saveItemForLater: (productId) => {
    const { items, saveForLater } = get();
    const itemToSave = items.find(item => item.product._id === productId);
    if (!itemToSave) return;

    const filteredItems = items.filter(item => item.product._id !== productId);
    const updatedLater = [...saveForLater, itemToSave];

    localStorage.setItem('velora_cart', JSON.stringify(filteredItems));
    localStorage.setItem('velora_later', JSON.stringify(updatedLater));
    set({ items: filteredItems, saveForLater: updatedLater });
  },

  moveToCart: (productId) => {
    const { items, saveForLater } = get();
    const itemToMove = saveForLater.find(item => item.product._id === productId);
    if (!itemToMove) return;

    const filteredLater = saveForLater.filter(item => item.product._id !== productId);
    const updatedItems = [...items, itemToMove];

    localStorage.setItem('velora_cart', JSON.stringify(updatedItems));
    localStorage.setItem('velora_later', JSON.stringify(filteredLater));
    set({ items: updatedItems, saveForLater: filteredLater });
  },

  removeSavedItem: (productId) => {
    const saveForLater = get().saveForLater.filter(item => item.product._id !== productId);
    localStorage.setItem('velora_later', JSON.stringify(saveForLater));
    set({ saveForLater });
  },

  addRecentlyViewed: (slug) => {
    let recent = [...get().recentlyViewed];
    recent = recent.filter(s => s !== slug); // Remove duplicate
    recent.unshift(slug); // Add to beginning
    if (recent.length > 5) {
      recent.pop(); // Max 5 items
    }
    localStorage.setItem('velora_recent', JSON.stringify(recent));
    set({ recentlyViewed: recent });
  },

  getCartSubtotal: () => {
    return get().items.reduce((acc, item) => {
      const price = item.product.salePrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);
  },

  getCartDiscount: () => {
    const { coupon } = get();
    const subtotal = get().getCartSubtotal();
    if (!coupon) return 0;
    
    if (coupon.discountType === 'Percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return coupon.discountValue;
  },

  getCartTotal: () => {
    const subtotal = get().getCartSubtotal();
    const discount = get().getCartDiscount();
    const shipping = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0); // Free shipping over ₹1500
    return Math.max(0, subtotal - discount + shipping);
  }
}));
