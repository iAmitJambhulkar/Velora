'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Grid, List, Search, Loader2, X, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter selection state (initialized from URL search parameters if present)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedConcern, setSelectedConcern] = useState(searchParams.get('concern') || '');
  const [selectedSkinType, setSelectedSkinType] = useState(searchParams.get('skinType') || '');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<number>(3000);

  // Collections lists
  const categoriesList = ['Skin Care', 'Hair Care', 'Grooming', 'Wellness', 'Beauty Essentials'];
  const concernsList = ['Acne', 'Hair Fall', 'Dandruff', 'Dry Skin', 'Oily Skin', 'Beard Growth', 'Anti Aging', 'Dark Circles'];
  const skinTypesList = ['Oily', 'Dry', 'Combination', 'Sensitive', 'All'];
  const gendersList = ['Men', 'Women', 'Unisex'];

  useEffect(() => {
    // Sync filters with URL parameters changes
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedConcern(searchParams.get('concern') || '');
    setSelectedSkinType(searchParams.get('skinType') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?limit=50&sort=${sortOption}&maxPrice=${priceRange}`;
        if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedConcern) url += `&concern=${encodeURIComponent(selectedConcern)}`;
        if (selectedSkinType) url += `&skinType=${encodeURIComponent(selectedSkinType)}`;
        if (selectedGender) url += `&gender=${encodeURIComponent(selectedGender)}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

        const res = await apiFetch(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchFilteredProducts, 200);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, selectedConcern, selectedSkinType, selectedGender, sortOption, searchQuery, priceRange]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedConcern('');
    setSelectedSkinType('');
    setSelectedGender('');
    setSearchQuery('');
    setPriceRange(3000);
    router.push('/shop');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 flex-grow flex flex-col justify-start">
      
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#D6C3A5]/45 pb-8 mb-10 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4F6D5A] tracking-widest block">Velora Apothecary</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Shop Formulations</h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Dermatologist-formulated molecular treatments targeting specific epidermal and follicular concerns.
          </p>
        </div>

        {/* View togglers, Sort filters */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden relative z-20 flex items-center space-x-2 px-4 py-2.5 border border-[#D6C3A5] bg-white rounded-lg text-xs font-semibold text-[#1E1E1E] transition hover:bg-gray-50 active:scale-98"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#4F6D5A]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs text-gray-500 hidden sm:inline font-medium">Sort formulations:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3.5 py-2.5 border border-[#D6C3A5] rounded-lg text-xs bg-white text-[#1E1E1E] focus:outline-none focus:border-[#4F6D5A] transition shadow-sm"
            >
              <option value="newest">New Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Clinical Rating</option>
              <option value="popularity">Bestsellers</option>
            </select>

            <div className="hidden sm:flex border border-[#D6C3A5] rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#4F6D5A] text-white' : 'bg-transparent text-gray-500 hover:bg-black/5'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#4F6D5A] text-white' : 'bg-transparent text-gray-500 hover:bg-black/5'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start flex-grow">
        
        {/* DESKTOP SIDEBAR FILTERS (col-span-3 - Separately Scrollable) */}
        <aside className="hidden md:block md:col-span-3 bg-white/70 backdrop-blur-md border border-[#D6C3A5]/40 rounded-xl p-6 space-y-6 sticky top-28 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto pr-3">
          
          <div className="flex justify-between items-center border-b border-[#D6C3A5]/25 pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#4F6D5A] font-extrabold flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Filter Catalog
            </span>
            <button 
              onClick={clearAllFilters} 
              className="text-[10px] text-gray-400 hover:text-[#4F6D5A] flex items-center space-x-1.5 transition-colors font-bold uppercase tracking-wider border-b border-transparent hover:border-[#4F6D5A]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search filter input */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Search Formulation</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search active ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D6C3A5]/60 rounded-lg pl-3 pr-9 py-2.5 text-xs outline-none focus:border-[#4F6D5A] focus:ring-1 focus:ring-[#4F6D5A] transition shadow-inner"
              />
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Category</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs transition-all border ${
                  !selectedCategory
                    ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                    : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/45'
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                      : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/45'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Concerns Selection (Wrapped Pills) */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Concern / Target</h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedConcern('')}
                className={`px-3 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border ${
                  !selectedConcern
                    ? 'bg-[#4F6D5A] border-[#4F6D5A] text-white shadow-sm shadow-[#4F6D5A]/15'
                    : 'bg-white/40 border-[#D6C3A5]/30 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/60'
                }`}
              >
                All
              </button>
              {concernsList.map((con) => (
                <button
                  key={con}
                  onClick={() => setSelectedConcern(con)}
                  className={`px-3 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border ${
                    selectedConcern === con
                      ? 'bg-[#4F6D5A] border-[#4F6D5A] text-white shadow-sm shadow-[#4F6D5A]/15'
                      : 'bg-white/40 border-[#D6C3A5]/30 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/60'
                  }`}
                >
                  {con}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Skin Type</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedSkinType('')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs transition-all border ${
                  !selectedSkinType
                    ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                    : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/45'
                }`}
              >
                All Skin Types
              </button>
              {skinTypesList.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedSkinType(st)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs transition-all border ${
                    selectedSkinType === st
                      ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                      : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10 hover:border-[#D6C3A5]/45'
                  }`}
                >
                  {st} Skin
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Gender</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedGender('')}
                className={`text-center py-2.5 rounded-lg text-xs transition-all border col-span-2 ${
                  !selectedGender
                    ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                    : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10'
                }`}
              >
                All Genders
              </button>
              {gendersList.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`text-center py-2.5 rounded-lg text-xs transition-all border ${
                    selectedGender === g
                      ? 'bg-[#4F6D5A]/10 border-[#4F6D5A] text-[#4F6D5A] font-bold shadow-sm'
                      : 'bg-white/50 border-[#D6C3A5]/25 text-gray-600 hover:bg-[#D6C3A5]/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#1E1E1E]">Max Budget</h4>
              <span className="text-xs font-bold text-[#4F6D5A]">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#4F6D5A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>₹300</span>
              <span>₹3,000</span>
            </div>
          </div>
        </aside>

        {/* MOBILE FILTER SIDEBOARD (MODAL DRAWER - Fixed Header/Footer with Separately Scrollable Center) */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)} />
            <div className="relative w-80 bg-[#F5F1EB] flex flex-col shadow-2xl h-screen max-h-screen border-r border-[#D6C3A5]">
              
              {/* Header (Fixed) */}
              <div className="px-6 pt-6 pb-4 border-b border-[#D6C3A5]/30 flex justify-between items-center bg-[#F5F1EB]">
                <span className="font-serif text-lg font-extrabold text-[#1E1E1E] flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2 text-[#4F6D5A]" /> Filters
                </span>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full hover:bg-black/5">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Scrollable Center Body */}
              <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
                
                {/* Search */}
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Search Formulation</h5>
                  <input
                    type="text"
                    placeholder="Search active ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#D6C3A5] rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#4F6D5A]"
                  />
                </div>
                
                {/* Categories */}
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Categories</h5>
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className={`text-[10px] px-3.5 py-2 rounded-lg border font-semibold transition ${
                          selectedCategory === cat 
                            ? 'bg-[#4F6D5A] text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-600 border-[#D6C3A5]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Concerns / Targets</h5>
                  <div className="flex flex-wrap gap-2">
                    {concernsList.map(con => (
                      <button
                        key={con}
                        onClick={() => setSelectedConcern(selectedConcern === con ? '' : con)}
                        className={`text-[10px] px-3.5 py-2 rounded-lg border font-semibold transition ${
                          selectedConcern === con 
                            ? 'bg-[#4F6D5A] text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-600 border-[#D6C3A5]'
                        }`}
                      >
                        {con}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Type */}
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Skin Type</h5>
                  <div className="flex flex-wrap gap-2">
                    {skinTypesList.map(st => (
                      <button
                        key={st}
                        onClick={() => setSelectedSkinType(selectedSkinType === st ? '' : st)}
                        className={`text-[10px] px-3.5 py-2 rounded-lg border font-semibold transition ${
                          selectedSkinType === st 
                            ? 'bg-[#4F6D5A] text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-600 border-[#D6C3A5]'
                        }`}
                      >
                        {st} Skin
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Gender</h5>
                  <div className="flex flex-wrap gap-2">
                    {gendersList.map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                        className={`text-[10px] px-3.5 py-2 rounded-lg border font-semibold transition ${
                          selectedGender === g 
                            ? 'bg-[#4F6D5A] text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-600 border-[#D6C3A5]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-[#1E1E1E]">
                    <span>Budget limit</span>
                    <span>₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="3000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#4F6D5A]"
                  />
                </div>
              </div>
              
              {/* Footer Actions (Fixed) */}
              <div className="p-6 border-t border-[#D6C3A5]/30 bg-[#F5F1EB] flex gap-3">
                <button
                  onClick={() => { clearAllFilters(); setShowMobileFilters(false); }}
                  className="flex-1 py-3 border border-[#D6C3A5] rounded-lg text-xs font-bold text-[#1E1E1E] bg-white transition hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-[#4F6D5A] text-white rounded-lg text-xs font-bold transition hover:bg-[#4F6D5A]/95 shadow-sm"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PRODUCTS LISTINGS GRID (col-span-9) */}
        <section className="md:col-span-9 flex flex-col">
          {loading ? (
            <div className="flex-grow flex flex-col justify-center items-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-[#4F6D5A] animate-spin" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sorting chemical structures...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#D6C3A5]/40 rounded-xl space-y-4 shadow-sm">
              <SlidersHorizontal className="w-10 h-10 text-[#D6C3A5] mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-700">No molecular formulations found</p>
                <p className="text-xs text-gray-400">Try adjusting your filters, budget, or keyword query.</p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#4F6D5A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition hover:bg-[#4F6D5A]/95"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((prod) => {
                const itemPrice = prod.salePrice || prod.price;
                return (
                  <div
                    key={prod._id}
                    onClick={() => router.push(`/product/${prod.slug}`)}
                    className="bg-white border border-[#D6C3A5]/40 p-5 rounded-xl flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <img src={prod.images[0]} alt={prod.title} className="w-full sm:w-36 h-36 object-cover rounded-lg bg-[#FAF8F5] border" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-[#4F6D5A] font-bold block">{prod.category}</span>
                        <h3 className="font-serif text-lg font-bold text-[#1E1E1E] leading-tight">{prod.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">{prod.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#D6C3A5]/20 mt-4">
                        <span className="text-base font-serif font-extrabold text-[#1E1E1E]">₹{itemPrice}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const user = useAuthStore.getState().user;
                            if (!user) {
                              router.push('/login');
                              return;
                            }
                            useCartStore.getState().addItem(prod, 1);
                            useToastStore.getState().addToast(`${prod.title} added to bag!`, 'success');
                          }}
                          className="px-5 py-2 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#4F6D5A] animate-spin" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#4F6D5A]">Loading Apothecary Catalog...</span>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
