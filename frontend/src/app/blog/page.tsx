'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../../constants/blogData';

export default function BlogPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Scientific Studies</span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Science Journal</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Peer-reviewed guides, ingredient deep-dives, and dermatologist notes on daily skincare and hair wellness.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="group bg-white border border-[#D6C3A5]/40 rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition"
          >
            <div className="h-60 bg-gray-100 overflow-hidden relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
              <span className="absolute top-4 left-4 bg-[#4F6D5A] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
                {post.category}
              </span>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTime}</span>
                </div>
                
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#1E1E1E] leading-snug group-hover:text-[#4F6D5A] transition">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-[#FAF8F5] flex items-center justify-between text-xs font-semibold text-[#4F6D5A]">
                <span>Read Full Scientific Study</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
