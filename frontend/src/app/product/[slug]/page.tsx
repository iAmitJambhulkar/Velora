'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShieldCheck, RefreshCw, Truck, Heart, ArrowRight, Play, Sparkles, Plus, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../lib/api';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useToastStore } from '../../../store/toastStore';
import ProductCard from '../../../components/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // State
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState<'ingredients' | 'usage' | 'clinical'>('ingredients');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Review submission state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Zustand Store
  const addItem = useCartStore((state) => state.addItem);
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);
  const toggleWishlist = useAuthStore((state) => state.toggleWishlist);
  const user = useAuthStore((state) => state.user);
  const guestWishlist = useAuthStore((state) => state.guestWishlist);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        // Fetch primary product
        const res = await apiFetch(`/products/${slug}`);
        const prod = res.data;
        setProduct(prod);
        setActiveImage(prod.images[0] || 'placeholder.jpg');

        // Add to recently viewed in store
        addRecentlyViewed(slug);

        // Fetch related products (matching category or concerns)
        const relatedRes = await apiFetch(`/products?category=${encodeURIComponent(prod.category)}&limit=3`);
        setRelatedProducts(relatedRes.data.filter((p: any) => p._id !== prod._id));

        // Fetch product reviews
        const reviewsRes = await apiFetch(`/reviews/product/${prod._id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#4F6D5A] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Formulation Not Found</h2>
        <p className="text-sm text-gray-500">The product you are looking for does not exist or has been discontinued.</p>
        <button
          onClick={() => router.push('/shop')}
          className="px-6 py-2 bg-[#4F6D5A] text-white text-xs font-bold uppercase rounded"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addItem(product, 1);
    addToast(`${product.title} added to bag!`, 'success');
  };

  const handleToggleWishlist = () => {
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

  const isProductInWishlist = user
    ? user.wishlist.includes(product._id)
    : guestWishlist.includes(product._id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          rating: ratingInput,
          comment: commentInput
        })
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setCommentInput('');
        // Update product rating locally
        setProduct((prev: any) => {
          const newCount = prev.ratings.count + 1;
          const newAvg = Number(((prev.ratings.average * prev.ratings.count + ratingInput) / newCount).toFixed(1));
          return {
            ...prev,
            ratings: { average: newAvg, count: newCount }
          };
        });
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. PRODUCT DETAILS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Media Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-white border border-[#D6C3A5]/40 rounded-lg overflow-hidden group shadow-sm">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {hasSale && (
              <span className="absolute top-4 left-4 bg-[#4F6D5A] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                Offer Applied
              </span>
            )}
          </div>

          {/* Thumbnail Selectors */}
          <div className="flex gap-3">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 bg-white border rounded overflow-hidden p-1 transition ${
                  activeImage === img ? 'border-[#4F6D5A] ring-1 ring-[#4F6D5A]' : 'border-[#D6C3A5]/30'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-[#D6C3A5]/30 pb-4">
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] leading-tight">
              {product.title}
            </h1>
            
            {/* Rating Scores */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings.average) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-semibold">{product.ratings.average} ({product.ratings.count} reviews)</span>
            </div>
          </div>

          {/* Pricing description */}
          <div className="flex items-baseline space-x-3 text-lg">
            {hasSale ? (
              <>
                <span className="text-2xl font-serif font-extrabold text-[#1E1E1E]">₹{product.salePrice}</span>
                <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                <span className="text-xs text-[#4F6D5A] font-bold">({Math.round(((product.price - product.salePrice) / product.price) * 100)}% Off)</span>
              </>
            ) : (
              <span className="text-2xl font-serif font-extrabold text-[#1E1E1E]">₹{product.price}</span>
            )}
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Key Benefits Bullets */}
          <div className="bg-[#FAF8F5] border border-[#D6C3A5]/25 p-4 rounded-md space-y-2">
            <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Key Benefits</h4>
            <ul className="space-y-1 text-xs text-gray-700">
              {product.benefits.map((b: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#4F6D5A] mr-2 font-bold">&bull;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call To Actions */}
          <div className="flex gap-4 items-center pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-3 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded font-bold uppercase tracking-wider text-xs shadow-md transition"
            >
              {product.stock > 0 ? 'Add Formulation to Bag' : 'Out of Stock'}
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className="p-3 border border-[#D6C3A5] hover:bg-black/5 rounded-md transition"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isProductInWishlist ? 'fill-red-500 text-red-500 border-transparent' : 'text-gray-500'}`} />
            </button>
          </div>

          {/* Quick trust signs */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D6C3A5]/30 text-center text-[10px] text-gray-500">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-[#4F6D5A] mb-1" />
              <span>Dermatologist Approved</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-[#4F6D5A] mb-1" />
              <span>Free Ship &gt; ₹1,500</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-[#4F6D5A] mb-1" />
              <span>Easy 30-Day Returns</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. TABS: ACTIVE INGREDIENTS & USAGE GUIDE */}
      <div className="border-t border-[#D6C3A5]/40 pt-10">
        <div className="flex border-b border-[#D6C3A5]/20 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 pr-6 border-b-2 transition ${
              activeTab === 'ingredients' ? 'border-[#4F6D5A] text-[#4F6D5A]' : 'border-transparent text-gray-500 hover:text-[#1E1E1E]'
            }`}
          >
            Ingredients Transparency
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-3 px-6 border-b-2 transition ${
              activeTab === 'usage' ? 'border-[#4F6D5A] text-[#4F6D5A]' : 'border-transparent text-gray-500 hover:text-[#1E1E1E]'
            }`}
          >
            Usage Guide
          </button>
          <button
            onClick={() => setActiveTab('clinical')}
            className={`pb-3 px-6 border-b-2 transition ${
              activeTab === 'clinical' ? 'border-[#4F6D5A] text-[#4F6D5A]' : 'border-transparent text-gray-500 hover:text-[#1E1E1E]'
            }`}
          >
            Clinical Studies
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">We declare all active molecules and their physiological purpose in detail.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.ingredients.map((ing: any, i: number) => (
                  <div key={i} className="bg-white border border-[#D6C3A5]/30 p-4 rounded-md space-y-1">
                    <span className="text-[10px] text-[#4F6D5A] font-bold block">{ing.percentage || 'Trace'} Concentration</span>
                    <h4 className="font-serif text-sm font-bold text-[#1E1E1E]">{ing.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{ing.purpose || 'Active base compound.'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-[#D6C3A5]/30 p-5 rounded-md space-y-2">
                <span className="text-xs font-bold text-[#4F6D5A] uppercase tracking-wider block">Morning Routine</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {product.usageGuide.morning || 'This active compound is not recommended for morning application.'}
                </p>
              </div>
              <div className="bg-white border border-[#D6C3A5]/30 p-5 rounded-md space-y-2">
                <span className="text-xs font-bold text-[#4F6D5A] uppercase tracking-wider block">Night Routine</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {product.usageGuide.night || 'Wash face, apply hydration base, and pat product gently. Finish with moisturizer.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'clinical' && (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed max-w-3xl">
              <h4 className="font-serif font-bold text-sm text-[#1E1E1E]">Dermatological Safety Profile</h4>
              <p>
                In a 4-week independent clinical test conducted on 60 volunteers with sensitive skin profiles:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>94% experienced visible restoration in skin tone hydration parameters.</li>
                <li>88% reported fading of red hyperpigmented post-acne blemishes.</li>
                <li>0% recorded symptoms of dermal sensitization or active breakouts.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3. TUTORIAL VIDEO & BEFORE/AFTER */}
      {(product.videoUrl || (product.beforeAfterImages && product.beforeAfterImages.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#D6C3A5]/40 pt-10">
          
          {/* Before After visualizer */}
          {product.beforeAfterImages && product.beforeAfterImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Verifiable Transformations</h3>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] uppercase text-[#4F6D5A] font-bold block">Before (Day 1)</span>
                  <img src={product.beforeAfterImages[0]} alt="Before formulation usage" className="w-full h-48 object-cover rounded border" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] uppercase text-[#4F6D5A] font-bold block">After (Day 28)</span>
                  <img src={product.beforeAfterImages[1] || product.beforeAfterImages[0]} alt="After formulation usage" className="w-full h-48 object-cover rounded border" />
                </div>
              </div>
            </div>
          )}

          {/* Video tutorial player */}
          {product.videoUrl && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Tutorial & Application Video</h3>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[#D6C3A5]/40">
                <video src={product.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CUSTOMER REVIEWS */}
      <div className="border-t border-[#D6C3A5]/40 pt-10 space-y-8">
        <h3 className="font-serif text-lg md:text-xl font-bold text-[#1E1E1E]">Customer Reviews ({reviews.length})</h3>
        
        {/* Write a review form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="bg-white border border-[#D6C3A5]/30 p-5 rounded-lg space-y-4 max-w-xl">
            <h4 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Write a review</h4>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">Your Rating:</span>
              <select
                value={ratingInput}
                onChange={(e) => setRatingInput(Number(e.target.value))}
                className="px-2 py-1 border rounded text-xs bg-[#FAF8F5]"
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Below Average)</option>
                <option value={1}>1 Star (Poor)</option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Share your experience with this molecular treatment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D6C3A5] rounded p-2.5 text-xs outline-none focus:border-[#4F6D5A]"
              required
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded text-xs font-semibold uppercase tracking-wider transition"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-[#FAF8F5] border border-dashed border-[#D6C3A5] rounded-md text-xs text-gray-600">
            Please <button onClick={() => router.push('/login')} className="text-[#4F6D5A] underline font-semibold">login</button> to post your review.
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to try this formula!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="bg-white border border-[#D6C3A5]/30 p-5 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1E1E1E]">{rev.userName}</span>
                  <span className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-amber-500 text-xs">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {rev.comment}
                </p>
                {rev.verifiedPurchase && (
                  <span className="text-[8px] bg-[#4F6D5A]/10 text-[#4F6D5A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                    Verified Buyer
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. RELATED MOLECULAR SOLUTIONS */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#D6C3A5]/40 pt-16 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Routine Synergy</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1E1E1E]">Complementary Formulations</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 6. STICKY MOBILE ADD-TO-CART BAR */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#D6C3A5] p-3 md:hidden flex justify-between items-center shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">{product.title}</span>
          <span className="text-sm font-serif font-bold text-[#1E1E1E]">₹{product.salePrice || product.price}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="px-6 py-2 bg-[#4F6D5A] text-white rounded text-xs font-bold uppercase tracking-wider"
        >
          {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>

    </div>
  );
}
