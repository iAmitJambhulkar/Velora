'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

const INGREDIENTS_DATA = [
  {
    name: 'Niacinamide',
    alias: 'Vitamin B3',
    concentration: '5% - 10%',
    type: 'Water-soluble Vitamin',
    description: 'Niacinamide regulates sebum (oil) excretion, fades post-acne blemishes, and stimulates ceramide synthesis to strengthen the skin moisture barrier.',
    clinicalStudies: 'Studies demonstrate that 5% Niacinamide significantly reduces hyperpigmentation and fine lines within 4 weeks without inducing redness.',
    benefits: ['Balances oil production', 'Calms facial redness', 'Fades post-acne dark spots'],
    dermalRating: 'Excellent for all skin types including sensitive skin.'
  },
  {
    name: 'Hyaluronic Acid',
    alias: 'Sodium Hyaluronate',
    concentration: '1% - 2%',
    type: 'Humectant Molecule',
    description: 'A structural skin component that binds up to 1,000 times its weight in water, infusing instant hydration to dehydrated skin cells.',
    clinicalStudies: 'Multi-molecular weight hyaluronic complex reaches deep dermal layers for sustained hydration compared to single-weight alternatives.',
    benefits: ['Restores skin bounce', 'Smooths dehydration lines', 'Locks in surface moisture'],
    dermalRating: 'Excellent. Safe for all profiles.'
  },
  {
    name: 'Retinol',
    alias: 'Vitamin A Derivative',
    concentration: '0.1% - 1.0%',
    type: 'Dermal Regenerator',
    description: 'Retinol accelerates cell turnover, shedding dead skin cells and boosting natural collagen synthesis to diminish fine lines and refine texture.',
    clinicalStudies: 'Retinol is the gold-standard anti-aging active. Encapsulated release minimizes initial purging and dryness common with Vitamin A.',
    benefits: ['Smooths fine lines & wrinkles', 'Refines uneven texture', 'Increases elasticity'],
    dermalRating: 'Moderate. Introduce slowly at night. Always follow with SPF.'
  },
  {
    name: 'Salicylic Acid',
    alias: 'Beta Hydroxy Acid (BHA)',
    concentration: '1% - 2%',
    type: 'Lipophilic Exfoliant',
    description: 'An oil-soluble acid that penetrates deep into pores to dissolve sebum build-up, debris, and prevent blackheads or active breakouts.',
    clinicalStudies: 'Clinical evaluations prove 2% Salicylic Acid is highly effective at reducing inflammatory acne lesions within 14 days of nightly use.',
    benefits: ['Unclogs deep skin pores', 'Fights blackheads', 'Exfoliates pore linings'],
    dermalRating: 'Good. Ideal for oily and acne-prone skin profiles.'
  },
  {
    name: 'Biotin',
    alias: 'Vitamin B7 / Vitamin H',
    concentration: '2% - 3%',
    type: 'Hair Fortifying Vitamin',
    description: 'Biotin is essential for keratin production. It strengthens hair follicles, preventing root breakage and promoting thicker strands.',
    clinicalStudies: 'Scalp absorption studies indicate Biotin fortifies the hair sheath structure, resulting in a 92% reduction in hair breakage.',
    benefits: ['Fortifies hair roots', 'Reduces shaft breakage', 'Increases strand density'],
    dermalRating: 'Excellent. Hypoallergenic scalp compatibility.'
  },
  {
    name: 'Keratin',
    alias: 'Hydrolyzed Keratin Protein',
    concentration: '3% - 5%',
    type: 'Structural Protein',
    description: 'Keratin forms the bulk of the hair fiber. Hydrolyzed keratin penetrates the cuticle to repair structural gaps, smooth frizz, and restore shine.',
    clinicalStudies: 'Hydrolyzed Keratin fills microscopic gaps in damaged hair cuticles, increasing tensile strength and styling control.',
    benefits: ['Repairs hair cuticles', 'Eliminates dry frizz', 'Imparts natural shine'],
    dermalRating: 'Excellent. Nourishes dry and treated hair.'
  }
];

export default function IngredientsPage() {
  const [search, setSearch] = useState('');

  const filteredIngredients = INGREDIENTS_DATA.filter(
    ing =>
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      ing.alias.toLowerCase().includes(search.toLowerCase()) ||
      ing.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold block">Transparency Registry</span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">Ingredients Library</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          We formulate with precise active levels. Search below to learn the scientific rationale, clinical dosages, and compatibility matrices of our molecules.
        </p>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Search active molecules (e.g. Niacinamide, BHA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D6C3A5] rounded-md px-3 py-2 text-xs outline-none focus:border-[#4F6D5A]"
          />
          <Search className="w-4 h-4 absolute right-3 top-5 text-[#4F6D5A]" />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredIngredients.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 text-gray-500">
            <p className="text-sm font-semibold">No active molecules found matching "{search}"</p>
          </div>
        ) : (
          filteredIngredients.map((ing) => (
            <div
              key={ing.name}
              id={ing.name.toLowerCase()}
              className="bg-white border border-[#D6C3A5]/40 rounded-lg p-6 space-y-4 shadow-sm scroll-mt-24 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1E1E1E]">{ing.name}</h2>
                  <span className="text-[10px] text-gray-400 font-medium">Chemical Alias: {ing.alias}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-[#4F6D5A]/10 text-[#4F6D5A] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider block">
                    {ing.concentration} Concentration
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-1">{ing.type}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed">{ing.description}</p>

              {/* Key Benefits */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Clinical Outcomes</h4>
                <div className="flex flex-wrap gap-2">
                  {ing.benefits.map((b, i) => (
                    <span key={i} className="flex items-center text-[10px] text-[#4F6D5A] font-semibold bg-[#4F6D5A]/5 px-2.5 py-1 rounded">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Studies */}
              <div className="bg-[#FAF8F5] p-3 rounded text-[11px] text-gray-500 space-y-1 leading-relaxed border border-[#D6C3A5]/20">
                <p className="font-semibold text-gray-600 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-[#4F6D5A]" /> Peer-Reviewed Studies
                </p>
                <p>{ing.clinicalStudies}</p>
              </div>

              {/* Safety Rating */}
              <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 bg-amber-50/50 p-2.5 rounded border border-amber-100">
                <ShieldAlert className="w-4 h-4 text-[#D6C3A5]" />
                <span><strong>Dermal compatibility:</strong> {ing.dermalRating}</span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
