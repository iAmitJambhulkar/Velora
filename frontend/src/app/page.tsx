'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle, Shield, Award, HelpCircle, BookOpen } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);
  const recentlyViewedSlugs = useCartStore((state) => state.recentlyViewed);

  // Concerns Definition
  const concernsList = [
    { label: 'Acne Control', concern: 'Acne', img: '/images/concern_acne.webp' },
    { label: 'Hair Fall reduction', concern: 'Hair Fall', img: '/images/concern_hair_fall.webp' },
    { label: 'Anti Dandruff', concern: 'Dandruff', img: '/images/concern_dandruff.webp' },
    { label: 'Deep Hydration', concern: 'Dry Skin', img: '/images/concern_dry_skin.webp' },
    { label: 'Excess Sebum', concern: 'Oily Skin', img: '/images/concern_oily_skin.webp' },
    { label: 'Beard Growth', concern: 'Beard Growth', img: '/images/concern_beard_growth.webp' },
    { label: 'Wrinkle Repair', concern: 'Anti Aging', img: '/images/concern_anti_aging.webp' },
    { label: 'Dark Circles', concern: 'Dark Circles', img: '/images/concern_dark_circles.webp' }
  ];

  // Routine Bundles
  const routineBundles = [
    {
      title: 'Advanced Acne Clarifying Routine',
      concern: 'Acne',
      description: 'A 2-step clinical regimen to purge deep skin impurities, control oiliness, and accelerate cell healing.',
      steps: ['Step 1: 2% Salicylic Acid Acne Clarifier (Night)', 'Step 2: Hyaluronic Deep Hydration Complex (Morning)'],
      price: '₹1,348',
      discountPrice: '₹1,199',
      image: '/images/bundle_acne.webp'
    },
    {
      title: 'Active Root Fortifying Protocol',
      concern: 'Hair Fall',
      description: 'Restore structural proteins to your scalp to stop hair fall, clarify dandruff, and strengthen roots.',
      steps: ['Step 1: Biotin & Keratin Anti-Hair Fall Shampoo', 'Step 2: Tea Tree & Salicylic Scalp Cleansing Serum'],
      price: '₹1,498',
      discountPrice: '₹1,249',
      image: '/images/bundle_hair_fall.webp'
    }
  ];

  // Blog Journal entries
  const blogs = [
    { title: 'The Ultimate Skincare Guide for Sensitive Skin', category: 'Skincare', time: '5 min read', slug: 'skincare-guide-sensitive-skin', img: '/images/blog_sensitive_skin.webp' },
    { title: 'Why Hyaluronic Acid is Crucial for Winter Hydration', category: 'Science', time: '4 min read', slug: 'hyaluronic-acid-winter-hydration', img: '/images/blog_hyaluronic_acid.webp' },
    { title: 'How to Prevent Hair Fall: A Biotin-Based Routine', category: 'Haircare', time: '6 min read', slug: 'prevent-hair-fall-biotin', img: '/images/blog_hair_fall.webp' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CMS Homepage content
        const cmsRes = await apiFetch('/cms/home');
        setCmsContent(cmsRes.data.sections);

        // Fetch Bestsellers
        const bestsellersRes = await apiFetch('/products?bestSeller=true&limit=4');
        setBestSellers(bestsellersRes.data);

        // Fetch All Products
        const productsRes = await apiFetch('/products?limit=8');
        setFeaturedProducts(productsRes.data);

        // Fetch recently viewed items details if slugs are present
        if (recentlyViewedSlugs.length > 0) {
          const recentItems = [];
          for (const slug of recentlyViewedSlugs.slice(0, 4)) {
            try {
              const res = await apiFetch(`/products/${slug}`);
              if (res.success) recentItems.push(res.data);
            } catch (err) {
              console.error('Failed to fetch recently viewed product details:', err);
            }
          }
          setRecentProducts(recentItems);
        }
      } catch (err) {
        console.error('Homepage loading failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recentlyViewedSlugs]);

  const heroData = cmsContent?.hero || {
    headline: 'Clinical formulations. Elevated rituals.',
    subheadline: 'Velora blends high-potency, dermatologist-approved actives with premium sensory aesthetics. Self-care simplified for the modern lifestyle.',
    ctaText: 'Take Self-Care Quiz',
    backgroundImage: '/images/hero_premium.webp',
    secondaryCtaText: 'Explore Catalog'
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const spotlightData = cmsContent?.spotlight?.ingredients || [
    { name: 'Niacinamide (10%)', desc: 'Regulates oil, minimizes pores, repairs barrier.', highlight: 'Blemish control' },
    { name: 'Hyaluronic Acid (2%)', desc: 'Attracts 1000x its weight in moisture to plump cells.', highlight: 'Deep hydration' },
    { name: 'Encapsulated Retinol (1%)', desc: 'Fades fine lines and stimulates structural collagen.', highlight: 'Anti-aging' },
    { name: 'Biotin (3%)', desc: 'Vitamin B7 that fortifies follicles to prevent hair fall.', highlight: 'Hair strength' }
  ];

  const testimonials = cmsContent?.testimonials?.reviews || [
    { name: 'Dr. Neha Sharma', role: 'Consulting Dermatologist', quote: 'Velora formulations bridge the gap between clinical efficacy and aesthetic excellence. I recommend their BHA serum for acne-prone skin.' },
    { name: 'Rohan Malhotra', role: 'Verified Purchase', quote: 'The Biotin shampoo and Beard Elixir transformed my morning routine. Within 3 weeks, my beard was softer and scalp flaking stopped completely.' },
    { name: 'Ananya Sen', role: 'Verified Purchase', quote: 'The 15% Vitamin C serum is incredible. It is the first active serum that actually faded my acne scars without giving me redness.' }
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#F5F1EB]/10">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:h-[85vh] flex items-center overflow-hidden border-b border-[#D6C3A5]/30 bg-[#FAF8F5] py-12 lg:py-0">
        {/* Abstract luxury shapes/gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4F6D5A]/5 to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D6C3A5]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-20 w-80 h-80 rounded-full bg-[#4F6D5A]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Brand Intro & Copy */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-[#4F6D5A]/10 border border-[#4F6D5A]/20 px-3 py-1 rounded-full text-[#4F6D5A] text-[10px] uppercase font-bold tracking-widest animate-pulse">
                <Sparkles className="w-3 h-3 text-[#D6C3A5]" />
                <span>Science Meets Sensory Luxury</span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E1E1E] leading-[1.1] tracking-tight">
                Clinical formulations.<br/>
                <span className="text-[#4F6D5A] italic font-normal font-serif">Elevated daily rituals.</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                Velora synthesizes high-potency, dermatologist-approved molecules with premium organic aesthetics. Formulated to target your specific biology with zero compromise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => router.push('/quiz')}
                  className="px-8 py-4 bg-[#4F6D5A] hover:bg-[#3D5546] text-white rounded font-bold tracking-wider text-xs uppercase shadow-md flex items-center justify-center space-x-2 transition duration-300 transform hover:-translate-y-0.5"
                >
                  <span>{heroData.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => router.push('/shop')}
                  className="px-8 py-4 border border-[#4F6D5A]/30 hover:border-[#4F6D5A] text-[#4F6D5A] hover:bg-[#4F6D5A]/5 rounded font-bold tracking-wider text-xs uppercase flex items-center justify-center transition duration-300"
                >
                  <span>{heroData.secondaryCtaText}</span>
                </button>
              </div>

              {/* Small micro-trust banners */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D6C3A5]/20 max-w-lg">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#1E1E1E]">100%</span>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Vegan & Clean</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#1E1E1E]">Derm</span>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Tested & Approved</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#1E1E1E]">30 Day</span>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Skin Guarantee</p>
                </div>
              </div>
            </div>

            {/* Premium Graphic Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative group w-full max-w-[400px]">
                {/* Decorative border frames */}
                <div className="absolute -inset-4 border border-[#D6C3A5]/40 rounded-xl pointer-events-none group-hover:scale-[1.02] transition duration-500" />
                <div className="absolute top-1/2 -left-8 w-16 h-16 bg-[#D6C3A5]/10 rounded-full blur-xl" />
                
                {/* Main Interactive Card */}
                <div className="relative bg-white border border-[#D6C3A5]/30 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 flex flex-col">
                  <div className="h-[380px] bg-[#FAF8F5] relative overflow-hidden">
                    <img
                      src={heroData.backgroundImage}
                      alt="Velora Skin Formulation"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Glassmorphic floating tag */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 p-3.5 rounded text-white flex justify-between items-center shadow-lg">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#D6C3A5] font-bold block">Featured formulation</span>
                        <span className="font-serif text-sm font-bold block mt-0.5">Daily Radiance Elixir</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#D6C3A5] uppercase tracking-widest">Active 15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SHOP BY CONCERN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Solutions-first approach</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1E1E1E]">Shop By Concern</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">We categorize our formulas by targeted outcomes rather than generic skincare definitions.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {concernsList.map((c, i) => (
            <div
              key={i}
              onClick={() => router.push(`/shop?concern=${encodeURIComponent(c.concern)}`)}
              className="group relative h-48 rounded-lg overflow-hidden border border-[#D6C3A5]/30 cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
            >
              <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition duration-500" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="text-[9px] uppercase tracking-wider text-[#D6C3A5] font-bold">Target</span>
                <h3 className="font-serif text-base font-bold text-white mt-1 group-hover:text-[#D6C3A5] transition duration-300">{c.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end border-b border-[#D6C3A5]/30 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Proven Favourites</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E] mt-1">Best Sellers</h2>
          </div>
          <button onClick={() => router.push('/shop')} className="text-xs font-semibold text-[#4F6D5A] hover:underline flex items-center space-x-1 transition">
            <span>View All Formulas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-white border rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. SELF-CARE ASSESSMENT ONBOARDING */}
      <section className="bg-[#4F6D5A] text-white py-20 relative overflow-hidden">
        {/* Glow dots */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FAF8F5]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#D6C3A5]/25 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <Sparkles className="w-10 h-10 text-[#D6C3A5] mx-auto animate-bounce" />
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Find Your Routine in 2 Minutes
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 max-w-lg mx-auto leading-relaxed">
            Our clinical routine builders analyze your hair type, skin structure, and primary wellness goals to synthesize a personalized morning and night regimen.
          </p>
          <div className="pt-4">
            <button
              onClick={() => router.push('/quiz')}
              className="px-10 py-4 bg-[#FAF8F5] text-[#1E1E1E] hover:bg-white text-xs font-bold uppercase tracking-wider rounded shadow-lg transition duration-300 transform hover:-translate-y-0.5"
            >
              Start Clinical Assessment
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED ROUTINE BUNDLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Synergistic Outcomes</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Featured Routines</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Scientifically paired sets designed to work in synergy for faster, visible transformations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {routineBundles.map((b, idx) => (
            <div key={idx} className="bg-white border border-[#D6C3A5]/40 rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300">
              <div className="w-full md:w-2/5 h-56 md:h-auto bg-gray-50 relative overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover hover:scale-103 transition duration-500" />
                <span className="absolute top-3 left-3 bg-[#4F6D5A] text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Routine Package
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#1E1E1E] leading-snug">{b.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.description}</p>
                  
                  <div className="space-y-2 pt-2">
                    {b.steps.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-start text-xs text-[#4F6D5A] font-semibold">
                        <CheckCircle className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 text-[#D6C3A5]" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#FAF8F5]">
                  <div>
                    <span className="text-xs text-gray-400 line-through mr-1.5">{b.price}</span>
                    <span className="text-lg font-serif font-bold text-[#1E1E1E]">{b.discountPrice}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/shop?concern=${encodeURIComponent(b.concern)}`)}
                    className="px-5 py-2.5 border border-[#4F6D5A] text-[#4F6D5A] hover:bg-[#4F6D5A] hover:text-white rounded text-[10px] uppercase font-bold tracking-wider transition-all duration-300"
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INGREDIENT SPOTLIGHT */}
      <section className="bg-[#FAF8F5] border-y border-[#D6C3A5]/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Active Ingredients</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Active Molecules. Pure Transparency.</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">We formulate with precise active levels. Here is the clinical rationale behind our molecules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spotlightData.map((ing: any, i: number) => (
              <div key={i} className="bg-white border border-[#D6C3A5]/30 p-6 rounded-lg space-y-4 hover:shadow-lg hover:border-[#4F6D5A]/30 transition duration-300 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] bg-[#4F6D5A]/10 text-[#4F6D5A] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                    {ing.highlight || 'Ingredient'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1E1E1E]">{ing.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{ing.desc}</p>
                </div>
                <button
                  onClick={() => router.push('/ingredients')}
                  className="text-xs font-bold text-[#4F6D5A] hover:underline pt-3 block text-left"
                >
                  Read Clinical Studies &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Real Reviews</span>
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E]">Science Backed. Doctor Approved.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t: any, i: number) => (
            <div key={i} className="bg-white border-l-4 border-[#4F6D5A] border-y border-r border-[#D6C3A5]/40 p-6 rounded-r-lg shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex justify-between items-end border-t border-[#FAF8F5] pt-4">
                <div>
                  <h4 className="text-xs font-bold text-[#1E1E1E]">{t.name}</h4>
                  <p className="text-[9px] text-[#4F6D5A] uppercase tracking-wider font-semibold">{t.role}</p>
                </div>
                <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SCIENCE JOURNAL / BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end border-b border-[#D6C3A5]/30 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Scientific Curation</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1E1E] mt-1">Science Journal</h2>
          </div>
          <button onClick={() => router.push('/blog')} className="text-xs font-semibold text-[#4F6D5A] hover:underline flex items-center space-x-1">
            <span>Visit The Journal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((b, i) => (
            <div
              key={i}
              onClick={() => router.push(`/blog/${b.slug}`)}
              className="group bg-white border border-[#D6C3A5]/30 rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300"
            >
              <div className="h-48 bg-gray-50 overflow-hidden relative">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-103 transition duration-500" />
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center space-x-2 text-[9px] uppercase font-bold text-[#4F6D5A] tracking-wider">
                  <span>{b.category}</span>
                  <span className="text-gray-300">&bull;</span>
                  <span>{b.time}</span>
                </div>
                <h3 className="font-serif text-sm font-bold text-[#1E1E1E] group-hover:text-[#4F6D5A] transition leading-snug line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">Read peer-reviewed clinical research and guides regarding active formulations.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section className="relative py-24 overflow-hidden bg-[#1E1E1E]">
        {/* Ambient glow decorations */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4F6D5A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#D6C3A5]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4F6D5A]/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#D6C3A5]/10 border border-[#D6C3A5]/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#D6C3A5]" />
            <span className="text-[10px] uppercase tracking-widest text-[#D6C3A5] font-bold">Exclusive Access</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
            Join the Velora
            <span className="text-[#D6C3A5] italic font-normal"> Science Digest</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Receive early access to new formulations, clinical ingredient research, exclusive routines, and members-only pricing — delivered biweekly to your inbox.
          </p>

          {/* Email form */}
          {newsletterSubscribed ? (
            <div className="bg-[#4F6D5A]/20 border border-[#4F6D5A]/30 rounded-lg px-6 py-4 inline-flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-[#D6C3A5]" />
              <span className="text-sm text-white font-semibold">Welcome to the community. Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                suppressHydrationWarning
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                  }
                }}
                className="flex-1 bg-white/5 border border-white/15 hover:border-[#D6C3A5]/40 focus:border-[#D6C3A5] rounded-lg px-4 py-3.5 text-xs text-white placeholder-gray-500 outline-none transition duration-300"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#D6C3A5] hover:bg-[#C4AD8E] text-[#1E1E1E] rounded-lg text-xs font-bold uppercase tracking-wider transition duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-[#D6C3A5]/20 whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          )}

          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-6 text-[9px] text-gray-500 uppercase tracking-wider font-semibold pt-2">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3 h-3 text-[#4F6D5A]" />
              <span>No Spam Ever</span>
            </div>
            <span className="text-gray-700">•</span>
            <div className="flex items-center space-x-1.5">
              <Award className="w-3 h-3 text-[#4F6D5A]" />
              <span>10% Welcome Discount</span>
            </div>
            <span className="text-gray-700">•</span>
            <div className="flex items-center space-x-1.5">
              <BookOpen className="w-3 h-3 text-[#4F6D5A]" />
              <span>Free Skincare Guide</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. RECENTLY VIEWED PRODUCTS CAROUSEL */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-t border-[#D6C3A5]/30 pt-16">
          <div className="text-left">
            <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold">Pick Up Where You Left Off</span>
            <h2 className="font-serif text-2xl font-bold text-[#1E1E1E] mt-1">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
