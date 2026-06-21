'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[]; ingredients: any[]; blogs: any[] }>({
    products: [],
    ingredients: [],
    blogs: []
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults({ products: [], ingredients: [], blogs: [] });
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], ingredients: [], blogs: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog box */}
      <div className="relative w-full max-w-2xl bg-[#F5F1EB] border border-[#D6C3A5] rounded-lg shadow-2xl overflow-hidden max-h-[60vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#D6C3A5]">
          <Search className="w-5 h-5 text-[#4F6D5A]" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 ml-3 bg-transparent border-0 outline-none text-[#1E1E1E] placeholder-gray-500 text-base"
            placeholder="Search products, active ingredients, blog articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#4F6D5A] animate-spin" />
          ) : (
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-[#1E1E1E]" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-8 h-8 text-[#D6C3A5] mx-auto mb-2" />
              <p className="text-sm font-medium">Type to explore Velora formulations</p>
              <p className="text-xs text-gray-400 mt-1">Tip: Search for "Vitamin C", "Acne", or "Biotin"</p>
            </div>
          ) : (
            <>
              {/* Products Match */}
              {results.products.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-semibold mb-3">Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.products.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => handleNavigate(`/product/${p.slug}`)}
                        className="flex items-center p-2 rounded-md hover:bg-[#D6C3A5]/10 cursor-pointer border border-transparent hover:border-[#D6C3A5]/30 transition"
                      >
                        <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded bg-white border" />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1E1E1E] truncate">{p.title}</p>
                          <p className="text-xs text-[#4F6D5A]">₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Match */}
              {results.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-semibold mb-3">Ingredients Library</h4>
                  <div className="space-y-2">
                    {results.ingredients.map((ing) => (
                      <div
                        key={ing.name}
                        onClick={() => handleNavigate(`/ingredients#${ing.name.toLowerCase()}`)}
                        className="p-3 rounded-md hover:bg-[#D6C3A5]/10 cursor-pointer border border-[#D6C3A5]/30 transition"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-[#1E1E1E]">{ing.name} ({ing.percentage})</span>
                          <span className="text-xs px-2 py-0.5 bg-[#4F6D5A]/10 text-[#4F6D5A] rounded-full">{ing.type}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{ing.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Match */}
              {results.blogs.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-semibold mb-3">Science Journal Articles</h4>
                  <div className="space-y-3">
                    {results.blogs.map((blog) => (
                      <div
                        key={blog.slug}
                        onClick={() => handleNavigate(`/blog/${blog.slug}`)}
                        className="flex items-center p-2 rounded-md hover:bg-[#D6C3A5]/10 cursor-pointer transition"
                      >
                        <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#1E1E1E]">{blog.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{blog.category} &bull; {blog.readTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length === 0 && results.ingredients.length === 0 && results.blogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No results matching "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try checking your spelling or search another concern</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer shortcuts */}
        <div className="bg-[#D6C3A5]/10 px-4 py-2 text-[10px] text-gray-500 flex justify-between border-t border-[#D6C3A5]/30">
          <span>Search for active molecules or products...</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
