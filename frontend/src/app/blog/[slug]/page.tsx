'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { BLOG_POSTS } from '../../../constants/blogData';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Article Not Found</h2>
        <p className="text-sm text-gray-500">The study you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/blog')}
          className="px-6 py-2.5 bg-[#4F6D5A] text-white text-xs font-bold uppercase rounded"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 flex-grow">
      
      {/* Back Button */}
      <button
        onClick={() => router.push('/blog')}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F6D5A] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Science Journal</span>
      </button>

      {/* Hero Visual Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#D6C3A5]/40 shadow-lg">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-[#4F6D5A] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded">
          {post.category}
        </span>
      </div>

      {/* Meta Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> {post.date}</span>
          <span>&bull;</span>
          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> {post.readTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1E1E1E] leading-tight">
          {post.title}
        </h1>
      </div>

      {/* Article Body Content */}
      <div className="font-serif text-sm sm:text-base text-gray-700 leading-relaxed space-y-6 border-t border-[#D6C3A5]/30 pt-8">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Peer-Reviewed Sources Reference Box */}
      <div className="bg-[#FAF8F5] border border-[#D6C3A5]/45 p-6 rounded-xl space-y-3 mt-10 shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-[#4F6D5A] font-extrabold flex items-center">
          <BookOpen className="w-4 h-4 mr-1.5" /> Clinical Reference Library
        </span>
        <h4 className="font-serif text-sm font-bold text-[#1E1E1E]">Peer-Reviewed Literature Cited</h4>
        <ul className="space-y-2 text-xs text-gray-500 list-decimal pl-4">
          {post.sources.map((source, index) => (
            <li key={index} className="leading-relaxed">
              {source}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom CTA Block */}
      <div className="border-t border-[#D6C3A5]/30 pt-10 mt-12 text-center space-y-5">
        <Sparkles className="w-8 h-8 text-[#D6C3A5] mx-auto animate-pulse" />
        <h3 className="font-serif text-lg font-bold text-[#1E1E1E]">Take Control of Your Skin Biology</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Our clinical builders analyze your specific epidermal sebum levels and hair follicles to formulate a daily personalized treatment ritual.
        </p>
        <button
          onClick={() => router.push('/quiz')}
          className="px-8 py-3 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition"
        >
          Start Clinical Assessment &rarr;
        </button>
      </div>

    </div>
  );
}
