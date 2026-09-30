'use client';

import React, { useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Props {
  score: number;
  breakdown: {
    spatial: number;
    timeline: number;
    infrastructure: number;
    dependency: number;
    similarity: number;
  };
  riskLevel: string;
}

export default function CoordinationRiskGauge({ score, breakdown, riskLevel }: Props) {
  const { isHindi, t } = useLanguage();
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // SVG Radial Math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (scoreVal: number) => {
    if (scoreVal >= 75) return '#EF4444'; // Red
    if (scoreVal >= 50) return '#F59E0B'; // Amber
    if (scoreVal >= 30) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  const currentColor = getScoreColor(score);

  const segmentDescriptions: Record<string, { label: string; maxPct: number; current: number; desc: string }> = {
    spatial: {
      label: isHindi ? 'स्थानिक अतिव्यापन (SPATIAL OVERLAP)' : 'SPATIAL OVERLAP',
      maxPct: 30,
      current: breakdown.spatial,
      desc: isHindi ? 'भौतिक निकटता और साझा अधिकार-क्षेत्र कॉरिडोर का आकलन करता है (<1.5 किमी थ्रेशोल्ड)।' : 'Calculates physical proximity and shared right-of-way corridor (<1.5 km threshold).'
    },
    timeline: {
      label: isHindi ? 'समय-सीमा अतिव्यापन (TIMELINE OVERLAP)' : 'TIMELINE OVERLAP',
      maxPct: 25,
      current: breakdown.timeline,
      desc: isHindi ? 'विभिन्न एजेंसियों में निष्पादन तिथि विंडो समवर्तीता को महीनों में मापता है।' : 'Measures execution date window concurrency across agencies in months.'
    },
    infrastructure: {
      label: isHindi ? 'साझा बुनियादी ढांचा (SHARED INFRASTRUCTURE)' : 'SHARED INFRASTRUCTURE',
      maxPct: 20,
      current: breakdown.infrastructure,
      desc: isHindi ? 'उप-सतह और नागरिक उपयोगिता संसाधन संघर्षों का मूल्यांकन करता है (जैसे सड़क बनाम पाइपलाइन)।' : 'Evaluates sub-surface and civil utility resource conflicts (e.g. Roads vs Pipelines).'
    },
    dependency: {
      label: isHindi ? 'परियोजना निर्भरता (PROJECT DEPENDENCY)' : 'PROJECT DEPENDENCY',
      maxPct: 20,
      current: breakdown.dependency,
      desc: isHindi ? 'पूर्वापेक्षित निर्माण अनुक्रमों की पहचान करता है (सड़क की सतह से पहले उपयोगिता ट्रेंचिंग)।' : 'Identifies prerequisite construction sequences (Utility trenching prior to road surfacing).'
    },
    similarity: {
      label: isHindi ? 'दायरा समानता (SCOPE SIMILARITY)' : 'SCOPE SIMILARITY',
      maxPct: 5,
      current: breakdown.similarity,
      desc: isHindi ? 'एक ही इलाके के भीतर संभावित प्रशासनिक दोहराव का पता लगाता है।' : 'Detects potential administrative duplication within the same locality.'
    }
  };

  return (
    <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentColor }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            {isHindi ? '3D समन्वय जोखिम सूचकांक' : '3D COORDINATION RISK INDEX'}
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
          score >= 75 ? 'bg-red-900/60 text-red-400 border border-red-500' :
          score >= 50 ? 'bg-amber-900/60 text-amber-400 border border-amber-500' :
          'bg-emerald-900/60 text-emerald-400 border border-emerald-500'
        }`}>
          {riskLevel} {isHindi ? 'समन्वय जोखिम' : 'COORDINATION RISK'}
        </span>
      </div>

      {/* Main Gauge & Editorial Score */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        
        {/* 3D Radial Energy Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Energy Ring */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={currentColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]"
            />
          </svg>

          {/* Central Animated Core Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="editorial-number text-5xl font-black tracking-tighter drop-shadow-md" style={{ color: currentColor }}>
              {Math.round(score)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
              {isHindi ? 'स्कोर / 100' : 'SCORE / 100'}
            </span>
          </div>
        </div>

        {/* 5-Factor Decomposable Breakdown Bars */}
        <div className="flex-1 w-full space-y-2.5 text-xs">
          {Object.entries(segmentDescriptions).map(([key, data]) => {
            const isHovered = activeSegment === key;
            const pct = Math.round((data.current / data.maxPct) * 100);

            return (
              <div
                key={key}
                onMouseEnter={() => setActiveSegment(key)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/90 border-cyan-500 scale-[1.02] shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                  <span className="text-slate-300">{data.label} ({data.maxPct}%)</span>
                  <span className="text-cyan-400 font-mono">+{data.current} {isHindi ? 'अंक' : 'pts'}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: data.current >= (data.maxPct * 0.7) ? '#EF4444' : '#3B82F6'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Explanatory Context Footer on Hover */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5 min-h-[48px]">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        {activeSegment ? (
          <div>
            <strong className="text-slate-200">{segmentDescriptions[activeSegment].label}: </strong>
            <span>{segmentDescriptions[activeSegment].desc}</span>
          </div>
        ) : (
          <span>{isHindi ? 'इसके बहु-आयामी प्रभाव का निरीक्षण करने के लिए ऊपर दिए गए 5 समन्वय स्कोर कारकों में से किसी पर भी होवर करें।' : 'Hover over any of the 5 coordination score factors above to inspect its multi-dimensional impact.'}</span>
        )}
      </div>
    </div>
  );
}

