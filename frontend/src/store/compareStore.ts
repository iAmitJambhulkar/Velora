import { create } from 'zustand';

interface CompareState {
  products: any[];
  toggleCompare: (product: any) => void;
  clearCompare: () => void;
  isComparing: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  products: [],
  
  toggleCompare: (product) => {
    const products = [...get().products];
    const index = products.findIndex(p => p._id === product._id);
    
    if (index >= 0) {
      products.splice(index, 1);
    } else {
      if (products.length >= 3) {
        // Shift first element and add new one to keep max 3
        products.shift();
      }
      products.push(product);
    }
    
    set({ products });
  },
  
  clearCompare: () => {
    set({ products: [] });
  },
  
  isComparing: (productId) => {
    return get().products.some(p => p._id === productId);
  }
}));
