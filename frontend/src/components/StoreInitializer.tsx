'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function StoreInitializer() {
  useEffect(() => {
    useAuthStore.getState().initialize();
    useCartStore.getState().initialize();
  }, []);

  return null;
}
