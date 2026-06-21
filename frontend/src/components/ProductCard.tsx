'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, BarChart2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useCompareStore } from '../store/compareStore';
import { useToastStore } from '../store/toastStore';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    price: number;
    salePrice?: number;
    images: string[];
    ratings: {
      average: number;
      count: number;
    };
    ingredients?: Array<{ name: string; percentage?: string }>;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useAuthStore((state) => state.toggleWishlist);
  const user = useAuthStore((state) => state.user);
  const guestWishlist = useAuthStore((state) => state.guestWishlist);
  const { toggleCompare, isComparing } = useCompareStore();
  const addToast = useToastStore((state) => state.addToast);

  const isProductInWishlist = user
    ? user.wishlist?.includes(product._id) ?? false
    : guestWishlist?.includes(product._id) ?? false;

  const isInCompare = isComparing(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    addItem(product, 1);
    addToast(`${product.title} added to bag!`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleWishlist(product._id);
    if (isProductInWishlist) {
      addToast('Removed from wishlist', 'info');
    } else {
      addToast('Added to wishlist!', 'success');
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleCompare(product);
    if (isInCompare) {
      addToast('Removed from comparison', 'info');
    } else {
      addToast('Added to comparison!', 'success');
    }
  };

  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <div
      onClick={() => router.push(`/product/${product.slug}`)}
      className="group relative bg-white border border-[#D6C3A5]/40 rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden border-b border-[#D6C3A5]/20">
        <img
          src={product.images[0] || 'placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasSale && (
          <span className="absolute top-3 left-3 bg-[#4F6D5A] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            Save ₹{product.price - (product.salePrice ?? 0)}
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-[#1E1E1E] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Heart Action */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-md transition"
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isProductInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Compare Check Action */}
        <button
          onClick={handleToggleCompare}
          className={`absolute bottom-3 right-3 p-1.5 rounded-full shadow-md transition ${
            isInCompare ? 'bg-[#4F6D5A] text-white' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-[#4F6D5A]'
          }`}
          title="Compare Product"
        >
          <BarChart2 className="w-4 h-4 rotate-90" />
        </button>
      </div>

      {/* Product Details Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          {/* Category */}
          <span className="text-[9px] uppercase tracking-widest text-[#4F6D5A] font-bold block">
            {product.category}
          </span>
          
          {/* Title */}
          <h3 className="font-serif text-sm font-bold text-[#1E1E1E] leading-snug line-clamp-2 group-hover:text-[#4F6D5A] transition">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 pt-1">
            <div className="flex text-amber-500 text-xs">
              {'★'.repeat(Math.round(product.ratings.average))}
              {'☆'.repeat(5 - Math.round(product.ratings.average))}
            </div>
            <span className="text-[10px] text-gray-500">({product.ratings.count})</span>
          </div>
        </div>

        {/* Ingredients Spotlight Tags */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {product.ingredients.slice(0, 2).map((ing, i) => (
              <span key={i} className="text-[9px] bg-[#FAF8F5] text-gray-600 border border-[#D6C3A5]/30 px-1.5 py-0.5 rounded">
                {ing.name} {ing.percentage ? `(${ing.percentage})` : ''}
              </span>
            ))}
          </div>
        )}

        {/* Pricing and Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F5]">
          <div className="flex items-baseline space-x-1.5">
            {hasSale ? (
              <>
                <span className="text-sm font-serif font-bold text-[#1E1E1E]">₹{product.salePrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-sm font-serif font-bold text-[#1E1E1E]">₹{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-1.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/90 text-white rounded disabled:opacity-50 transition"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
