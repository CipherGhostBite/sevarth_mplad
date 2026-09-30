'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Props {
  summary: {
    headline: string;
    summaryText: string;
    recommendations: string[];
  };
  spatialCount: number;
  timelineCount: number;
  dependencyCount: number;
}

export default function AiIntelligencePanel({
  summary,
  spatialCount,
  timelineCount,
  dependencyCount
}: Props) {
  const { isHindi } = useLanguage();

  return (
    <div className="floating-slab p-6 bg-[#0f172a] border-2 border-cyan-500/40 rounded-3xl text-white font-mono space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* Animated Holographic Laser Scanning Line Effect */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/50">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>✦ {isHindi ? 'सेवाार्थ एआई बुद्धिमत्ता' : 'SEVAARTH AI INTELLIGENCE'}</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-2 py-0.5 rounded-full font-bold">
                {isHindi ? 'इंजन सक्रिय' : 'ENGINE ACTIVE'}
              </span>
            </h3>
            <span className="text-[10px] text-slate-400 font-sans">
              {isHindi ? 'स्वयत्त अंतर-सरकारी अवसंरचना समन्वय विश्लेषण' : 'Autonomous Cross-Government Infrastructure Coordination Analysis'}
            </span>
          </div>
        </div>
      </div>

      {/* Detected Anomaly Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="editorial-number text-2xl text-blue-400 font-bold block">
            0{spatialCount}
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
            {isHindi ? 'स्थानिक दोहराव' : 'SPATIAL OVERLAPS'}
          </span>
        </div>
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="editorial-number text-2xl text-amber-400 font-bold block">
            0{timelineCount}
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
            {isHindi ? 'समय-सीमा समवर्ती' : 'TIMELINE CONCURRENCIES'}
          </span>
        </div>
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="editorial-number text-2xl text-red-400 font-bold block">
            0{dependencyCount}
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
            {isHindi ? 'उपयोगिता निर्भरताएं' : 'UTILITY DEPENDENCIES'}
          </span>
        </div>
      </div>

      {/* Headline & Synthesis Text */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>{summary.headline}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {summary.summaryText}
        </p>
      </div>

      {/* Recommended Coordination Actions */}
      <div className="space-y-2.5">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
          {isHindi ? 'अनुशंसित अंतर-एजेंसी कार्रवाई' : 'RECOMMENDED INTER-AGENCY ACTIONS'}
        </div>
        <div className="space-y-2 text-xs">
          {summary.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/70 rounded-xl border border-slate-800/80 text-slate-200 flex items-start gap-2.5 leading-snug font-sans"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
