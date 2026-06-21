'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, CheckCircle, BarChart2 } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';

export default function ComparePage() {
  const router = useRouter();
  const { products, toggleCompare, clearCompare } = useCompareStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleRemove = (product: any) => {
    toggleCompare(product);
    addToast('Removed from comparison', 'info');
  };

  const handleAddToBag = (product: any) => {
    addItem(product, 1);
    addToast(`${product.title} added to bag!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#D6C3A5]/40 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Scientific Diagnostics</span>
          <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[#1E1E1E] mt-1">Formulation Comparison</h1>
          <p className="text-xs text-gray-500 mt-1">Analyze concentrations, active ingredients, and clinical rationales side-by-side.</p>
        </div>
        {products.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Clear Matrix
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#D6C3A5]/40 rounded-lg space-y-4">
          <BarChart2 className="w-12 h-12 text-[#D6C3A5] mx-auto rotate-90" />
          <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Comparison Matrix is Empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Go to our shop catalog and click the comparison icon on product cards to analyze formulations side-by-side.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2.5 bg-[#4F6D5A] text-white text-xs font-bold uppercase rounded shadow-sm hover:bg-[#4F6D5A]/90 transition"
          >
            Go to Shop Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border border-[#D6C3A5]/40 rounded-lg p-6 shadow-sm overflow-x-auto">
          
          {/* Attributes Labels Column */}
          <div className="hidden md:flex flex-col justify-between text-xs font-bold text-gray-400 uppercase tracking-wider space-y-8 pt-[240px]">
            <div className="border-b pb-4">Category</div>
            <div className="border-b pb-4">Target Concerns</div>
            <div className="border-b pb-4">Active Concentration</div>
            <div className="border-b pb-4">Clinical Benefits</div>
            <div className="border-b pb-4">Ratings</div>
            <div className="pb-4">Action</div>
          </div>

          {/* Compared Products Columns */}
          {products.map((p) => (
            <div key={p._id} className="relative flex flex-col justify-between space-y-6 border-b md:border-b-0 pb-6 md:pb-0">
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(p)}
                className="absolute top-0 right-0 p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition"
                title="Remove from comparison"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Card Info */}
              <div className="space-y-3">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-44 object-cover rounded bg-[#FAF8F5] border border-[#D6C3A5]/20 cursor-pointer"
                  onClick={() => router.push(`/product/${p.slug}`)}
                />
                <div>
                  <h3
                    className="font-serif text-sm font-bold text-[#1E1E1E] hover:text-[#4F6D5A] cursor-pointer line-clamp-1"
                    onClick={() => router.push(`/product/${p.slug}`)}
                  >
                    {p.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#4F6D5A]">₹{p.price}</span>
                </div>
              </div>

              {/* Category */}
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase md:hidden block">Category</span>
                <span className="text-xs text-gray-700">{p.category}</span>
              </div>

              {/* Target Concerns */}
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase md:hidden block">Target Concerns</span>
                <div className="flex flex-wrap gap-1 mt-1 md:mt-0">
                  {p.concern.map((c: string, idx: number) => (
                    <span key={idx} className="text-[9px] bg-[#FAF8F5] text-gray-600 border border-[#D6C3A5]/30 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Concentrations */}
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase md:hidden block">Active Molecules</span>
                <ul className="text-xs text-gray-700 space-y-1 mt-1 md:mt-0">
                  {p.ingredients.map((ing: any, idx: number) => (
                    <li key={idx} className="truncate">
                      <strong>{ing.name}</strong> {ing.percentage ? `(${ing.percentage})` : ''}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Benefits */}
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase md:hidden block">Clinical Benefits</span>
                <ul className="text-[11px] text-gray-600 space-y-1 mt-1 md:mt-0">
                  {p.benefits.slice(0, 2).map((b: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-[#4F6D5A] mr-1.5 mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ratings */}
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase md:hidden block">Ratings</span>
                <div className="flex items-center space-x-1 mt-1 md:mt-0">
                  <span className="text-xs text-amber-500 font-bold">★ {p.ratings.average}</span>
                  <span className="text-[10px] text-gray-400">({p.ratings.count} reviews)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t md:border-t-0 pt-4 md:pt-0">
                <button
                  onClick={() => handleAddToBag(p)}
                  disabled={p.stock <= 0}
                  className="w-full py-2 bg-[#4F6D5A] hover:bg-[#4F6D5A]/90 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
