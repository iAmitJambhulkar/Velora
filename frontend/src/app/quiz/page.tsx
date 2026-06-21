'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';

export default function QuizPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  // Quiz progression
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // User responses
  const [gender, setGender] = useState('');
  const [skinType, setSkinType] = useState('');
  const [hairType, setHairType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setStep(5); // Render loading/results
    try {
      // Build query string based on concern selections
      let url = `/products?limit=4`;
      if (gender) url += `&gender=${gender}`;
      if (skinType && skinType !== 'Sensitive') url += `&skinType=${skinType}`;
      if (concerns.length > 0) {
        url += `&concern=${encodeURIComponent(concerns[0])}`; // Recommends matching their primary concern
      }

      const res = await apiFetch(url);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Quiz recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setGender('');
    setSkinType('');
    setHairType('');
    setConcerns([]);
    setRecommendations([]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow flex flex-col justify-center">
      
      {/* Quiz Progress Indicator (Step 1-4) */}
      {step <= 4 && (
        <div className="w-full bg-[#D6C3A5]/30 h-1 rounded-full mb-8 relative overflow-hidden">
          <div
            className="bg-[#4F6D5A] h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      {/* QUIZ BOX CONTAINER */}
      <div className="bg-white border border-[#D6C3A5]/40 rounded-lg p-8 shadow-md min-h-[50vh] flex flex-col justify-between">
        
        {/* STEP 1: GENDER */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-6 h-6 text-[#D6C3A5] mx-auto animate-pulse" />
              <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Select Your Profile</h2>
              <p className="text-xs text-gray-500">We optimize formulas to match gender-specific skin densities and hair patterns.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {['Men', 'Women', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => { setGender(g); handleNextStep(); }}
                  className={`p-6 rounded-lg border-2 text-sm font-semibold uppercase tracking-wider transition ${
                    gender === g
                      ? 'border-[#4F6D5A] bg-[#4F6D5A]/5 text-[#4F6D5A]'
                      : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                  }`}
                >
                  {g === 'Unisex' ? 'Neutral / Unisex' : g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SKIN TYPE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">What is your skin type?</h2>
              <p className="text-xs text-gray-500">Formulating active concentrations requires understanding your skin sebum levels.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
              {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map((type) => (
                <button
                  key={type}
                  onClick={() => { setSkinType(type); handleNextStep(); }}
                  className={`p-4 rounded-lg border-2 text-xs font-bold uppercase transition ${
                    skinType === type
                      ? 'border-[#4F6D5A] bg-[#4F6D5A]/5 text-[#4F6D5A]'
                      : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: HAIR TYPE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">What is your hair structure?</h2>
              <p className="text-xs text-gray-500">Helps us recommend shampoo surfactant weights and pre-wash scalp serums.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {['Straight', 'Wavy', 'Curly', 'Coily'].map((type) => (
                <button
                  key={type}
                  onClick={() => { setHairType(type); handleNextStep(); }}
                  className={`p-4 rounded-lg border-2 text-xs font-bold uppercase transition ${
                    hairType === type
                      ? 'border-[#4F6D5A] bg-[#4F6D5A]/5 text-[#4F6D5A]'
                      : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PRIMARY CONCERNS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Select Your Concerns</h2>
              <p className="text-xs text-gray-500">Pick all goals that you want to address. Select at least one.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {['Acne', 'Hair Fall', 'Dandruff', 'Dry Skin', 'Oily Skin', 'Beard Growth', 'Anti Aging', 'Dark Circles'].map((c) => {
                const selected = concerns.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={`p-3 rounded-lg border-2 text-xs font-semibold transition ${
                      selected
                        ? 'border-[#4F6D5A] bg-[#4F6D5A]/5 text-[#4F6D5A]'
                        : 'border-[#D6C3A5]/30 hover:border-[#4F6D5A]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS SCREEN */}
        {step === 5 && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16 space-y-4">
                <Loader2 className="w-10 h-10 text-[#4F6D5A] animate-spin mx-auto" />
                <p className="text-sm text-gray-500 font-medium">Synthesizing personalized routines...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-2 border-b border-[#D6C3A5]/30 pb-4">
                  <CheckCircle className="w-8 h-8 text-[#4F6D5A] mx-auto" />
                  <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Your Personalized Regimen</h2>
                  <p className="text-xs text-gray-500">Based on: {gender} &bull; {skinType} Skin &bull; {hairType} Hair &bull; Concerns: {concerns.join(', ')}</p>
                </div>

                {/* Routine Recommendation Cards */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold mb-3">Reconstituted Routine</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* AM Routine */}
                      <div className="p-4 border border-[#D6C3A5]/40 rounded-lg bg-[#FAF8F5]">
                        <span className="text-[10px] text-[#4F6D5A] font-bold uppercase tracking-wider block">Morning Step</span>
                        <h4 className="font-serif text-sm font-bold text-[#1E1E1E] mt-1">Dermal Hydrate + Protect</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          Cleanse, apply your recommended active serum, lock in with a light moisturizer, and apply sunscreen.
                        </p>
                      </div>
                      
                      {/* PM Routine */}
                      <div className="p-4 border border-[#D6C3A5]/40 rounded-lg bg-[#FAF8F5]">
                        <span className="text-[10px] text-[#4F6D5A] font-bold uppercase tracking-wider block">Night Step</span>
                        <h4 className="font-serif text-sm font-bold text-[#1E1E1E] mt-1">Cell Renewal + Restore</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          Double cleanse, apply high-potency molecules (e.g. Salicylic Acid or Retinol), and lock with moisture barrier creams.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Products Grid */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#4F6D5A] font-bold mb-3">Recommended Formulations</h3>
                    {recommendations.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No exact product fits found. Visit the shop page for standard treatments.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((p) => (
                          <div key={p._id} className="flex p-3 bg-[#FAF8F5] border border-[#D6C3A5]/30 rounded-lg space-x-3 items-center">
                            <img src={p.images[0]} alt={p.title} className="w-14 h-14 object-cover rounded border bg-white" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-[#1E1E1E] truncate">{p.title}</h4>
                              <p className="text-[10px] text-[#4F6D5A] mt-0.5">₹{p.salePrice || p.price}</p>
                            </div>
                            <button
                              onClick={() => {
                                addItem(p, 1);
                                addToast(`${p.title} added to bag!`, 'success');
                              }}
                              className="p-2 bg-[#4F6D5A] text-white rounded-full hover:bg-[#4F6D5A]/90 transition"
                              title="Add to Bag"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#D6C3A5]/30">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-2.5 border border-[#D6C3A5] text-xs font-bold uppercase rounded text-gray-600 hover:bg-black/5"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => router.push('/shop')}
                    className="flex-1 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/90 text-white text-xs font-bold uppercase rounded"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP BUTTON BAR CONTROLS */}
        {step <= 4 && (
          <div className="flex justify-between items-center pt-8 border-t border-[#FAF8F5] mt-6">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-[#1E1E1E] disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step === 4 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={concerns.length === 0}
                className="px-6 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 transition"
              >
                Get My Recommendations
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                disabled={
                  (step === 1 && !gender) ||
                  (step === 2 && !skinType) ||
                  (step === 3 && !hairType)
                }
                className="flex items-center space-x-1 px-6 py-2.5 bg-[#4F6D5A] hover:bg-[#4F6D5A]/95 text-white rounded text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
