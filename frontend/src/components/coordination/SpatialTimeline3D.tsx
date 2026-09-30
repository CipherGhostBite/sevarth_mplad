'use client';

import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface TimelineItem {
  id: string;
  name: string;
  level: string;
  startDate: string;
  endDate: string;
  isSubject?: boolean;
}

interface Props {
  items: TimelineItem[];
}

export default function SpatialTimeline3D({ items }: Props) {
  const { isHindi, t } = useLanguage();
  const [hoveredOverlap, setHoveredOverlap] = useState<string | null>(null);

  // Time bounds: 2026-01-01 to 2028-06-30 (30 months span)
  const minTime = new Date('2026-01-01').getTime();
  const maxTime = new Date('2028-06-30').getTime();
  const totalDuration = maxTime - minTime;

  const getPositionPct = (dateStr: string) => {
    const t = new Date(dateStr).getTime();
    const pct = ((t - minTime) / totalDuration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CENTRAL': return 'bg-purple-900/60 text-purple-300 border-purple-500';
      case 'STATE': return 'bg-blue-900/60 text-blue-300 border-blue-500';
      case 'DISTRICT': return 'bg-amber-900/60 text-amber-300 border-amber-500';
      default: return 'bg-emerald-900/60 text-emerald-300 border-emerald-500';
    }
  };

  return (
    <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            {isHindi ? 'क्रॉस-सरकार स्थानिक समय-सीमा' : 'CROSS-GOVERNMENT SPATIAL TIMELINE'}
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          {isHindi ? '2026 – 2028 कार्यान्वयन क्षितिज' : '2026 – 2028 IMPLEMENTATION HORIZON'}
        </span>
      </div>

      {/* Year Scale Indicators */}
      <div className="relative w-full h-6 border-b border-slate-800 text-[10px] text-slate-400 flex justify-between font-bold">
        <span>{isHindi ? 'जन 2026' : 'JAN 2026'}</span>
        <span>{isHindi ? 'जुलाई 2026' : 'JUL 2026'}</span>
        <span>{isHindi ? 'जन 2027' : 'JAN 2027'}</span>
        <span>{isHindi ? 'जुलाई 2027' : 'JUL 2027'}</span>
        <span>{isHindi ? 'जन 2028' : 'JAN 2028'}</span>
        <span>{isHindi ? 'जून 2028' : 'JUN 2028'}</span>
      </div>

      {/* Project Timelines Bar Visualizer */}
      <div className="space-y-4 pt-2">
        {items.map((item) => {
          const startPct = getPositionPct(item.startDate);
          const endPct = getPositionPct(item.endDate);
          const widthPct = Math.max(4, endPct - startPct);

          return (
            <div key={item.id} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold truncate max-w-md">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${getLevelBadgeColor(item.level)}`}>
                    {item.level}
                  </span>
                  <span className={item.isSubject ? 'text-cyan-400 font-extrabold' : 'text-slate-200'}>
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.startDate.slice(0, 7)} &rarr; {item.endDate.slice(0, 7)}
                </span>
              </div>

              {/* Timeline Track Bar */}
              <div className="relative w-full h-7 bg-slate-900/80 rounded-xl overflow-hidden border border-slate-800">
                {/* Active Project Schedule Bar */}
                <div
                  className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 flex items-center px-3 text-[10px] font-bold shadow-md ${
                    item.isSubject
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400'
                      : 'bg-slate-700/80 text-slate-200 group-hover:bg-slate-600'
                  }`}
                  style={{
                    left: `${startPct}%`,
                    width: `${widthPct}%`
                  }}
                >
                  <span className="truncate">{item.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Overlap Callout Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <strong className="block font-bold">
              {isHindi ? '4 महीने का गंभीर अतिव्यापन पाया गया (जनवरी 2027 – अप्रैल 2027)' : '4 MONTHS CRITICAL OVERLAP DETECTED (JAN 2027 – APR 2027)'}
            </strong>
            <span className="text-[11px] text-amber-200/80">
              {isHindi ? 'राज्य SH-78 सड़क उन्नयन और जिला जल पाइपलाइन चरण-II बिहार शरीफ टाउनशिप कॉरिडोर में मेल खाते हैं।' : 'State SH-78 Road Upgrade & District Water Pipeline Phase-II coincide in Bihar Sharif township corridor.'}
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/40">
          {isHindi ? 'समन्वय अनिवार्य' : 'COORDINATION MANDATORY'}
        </span>
      </div>
    </div>
  );
}

