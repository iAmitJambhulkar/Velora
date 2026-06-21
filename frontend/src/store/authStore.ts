import { create } from 'zustand';
import { apiFetch } from '../lib/api';

interface UserAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  addresses: UserAddress[];
  wishlist: string[];
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  guestWishlist: string[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  initialize: () => void;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  addAddress: (address: Omit<UserAddress, '_id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  guestWishlist: [],
  loading: false,
  error: null,
  initialized: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('velora_token');
    const savedUser = localStorage.getItem('velora_user');
    const guestWish = localStorage.getItem('velora_guest_wishlist');
    
    set({
      token: token || null,
      user: savedUser ? JSON.parse(savedUser) : null,
      guestWishlist: guestWish ? JSON.parse(guestWish) : [],
      initialized: true
    });
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const guestWishlist = get().guestWishlist;
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ ...credentials, guestWishlist })
      });
      
      const { token, ...userData } = res.data;
      
      localStorage.setItem('velora_token', token);
      localStorage.setItem('velora_user', JSON.stringify(userData));
      localStorage.removeItem('velora_guest_wishlist'); // Merged and cleared

      set({
        user: userData,
        token,
        guestWishlist: [],
        loading: false
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      const { token, ...user } = res.data;

      localStorage.setItem('velora_token', token);
      localStorage.setItem('velora_user', JSON.stringify(user));

      set({
        user,
        token,
        loading: false
      });

      // If they have guest wishlist items, merge them immediately
      const guestWishlist = get().guestWishlist;
      if (guestWishlist.length > 0) {
        const mergeRes = await apiFetch('/auth/wishlist/merge', {
          method: 'POST',
          body: JSON.stringify({ wishlist: guestWishlist })
        });
        localStorage.removeItem('velora_guest_wishlist');
        set(state => ({
          user: state.user ? { ...state.user, wishlist: mergeRes.data } : null,
          guestWishlist: []
        }));
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('velora_token');
    localStorage.removeItem('velora_user');
    set({ user: null, token: null });
  },

  addAddress: async (address) => {
    try {
      const res = await apiFetch('/auth/address', {
        method: 'POST',
        body: JSON.stringify(address)
      });
      set(state => ({
        user: state.user ? { ...state.user, addresses: res.data } : null
      }));
    } catch (err: any) {
      console.error('Failed to add address:', err.message);
      throw err;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const res = await apiFetch(`/auth/address/${addressId}`, {
        method: 'DELETE'
      });
      set(state => ({
        user: state.user ? { ...state.user, addresses: res.data } : null
      }));
    } catch (err: any) {
      console.error('Failed to delete address:', err.message);
      throw err;
    }
  },

  toggleWishlist: async (productId) => {
    const { user, guestWishlist } = get();
    
    if (user) {
      try {
        const res = await apiFetch('/auth/wishlist/toggle', {
          method: 'POST',
          body: JSON.stringify({ productId })
        });
        set(state => ({
          user: state.user ? { ...state.user, wishlist: res.data } : null
        }));
      } catch (err: any) {
        console.error('Failed to toggle DB wishlist:', err.message);
      }
    } else {
      // Guest wishlist in localStorage
      let updatedList = [...guestWishlist];
      const index = updatedList.indexOf(productId);
      if (index >= 0) {
        updatedList.splice(index, 1);
      } else {
        updatedList.push(productId);
      }
      localStorage.setItem('velora_guest_wishlist', JSON.stringify(updatedList));
      set({ guestWishlist: updatedList });
    }
  }
}));
