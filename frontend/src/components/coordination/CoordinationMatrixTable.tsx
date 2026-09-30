'use client';

import React, { useState } from 'react';
import { CoordinationMatrixItem } from '@/lib/api';
import { Table, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Props {
  matrix: CoordinationMatrixItem[];
  onSelectProject: (id: string) => void;
}

export default function CoordinationMatrixTable({ matrix, onSelectProject }: Props) {
  const { isHindi } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredMatrix = matrix.filter((item) => {
    const matchesSearch =
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'ALL' || item.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return <span className="bg-red-900/60 text-red-300 border border-red-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{isHindi ? 'गंभीर' : 'CRITICAL'}</span>;
      case 'HIGH':
        return <span className="bg-amber-900/60 text-amber-300 border border-amber-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{isHindi ? 'उच्च' : 'HIGH'}</span>;
      case 'MODERATE':
        return <span className="bg-blue-900/60 text-blue-300 border border-blue-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{isHindi ? 'मध्यम' : 'MODERATE'}</span>;
      default:
        return <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{isHindi ? 'कम' : 'LOW'}</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CENTRAL':
        return <span className="bg-purple-900/50 text-purple-300 border border-purple-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full">{isHindi ? 'केंद्रीय' : 'CENTRAL'}</span>;
      case 'STATE':
        return <span className="bg-blue-900/50 text-blue-300 border border-blue-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full">{isHindi ? 'राज्य' : 'STATE'}</span>;
      case 'DISTRICT':
        return <span className="bg-amber-900/50 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full">{isHindi ? 'जिला' : 'DISTRICT'}</span>;
      default:
        return <span className="bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full">{isHindi ? 'स्थानीय' : 'LOCAL'}</span>;
    }
  };

  return (
    <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-5 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <span>{isHindi ? 'परियोजना समन्वय मैट्रिक्स' : 'PROJECT COORDINATION MATRIX'}</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {isHindi ? 'अंतर-सरकारी दोहराव एवं निर्भरता रजिस्टर' : 'Cross-Government Overlap & Dependency Register'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isHindi ? 'परियोजना खोजें...' : 'Search project...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl text-xs pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500"
            />
          </div>

          {/* Level Filter dropdown */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl text-xs px-3 py-1.5 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">{isHindi ? 'सभी स्तर' : 'ALL LEVELS'}</option>
            <option value="CENTRAL">{isHindi ? 'केंद्रीय' : 'CENTRAL'}</option>
            <option value="STATE">{isHindi ? 'राज्य' : 'STATE'}</option>
            <option value="DISTRICT">{isHindi ? 'जिला' : 'DISTRICT'}</option>
            <option value="LOCAL">{isHindi ? 'स्थानीय' : 'LOCAL'}</option>
          </select>
        </div>
      </div>

      {/* Matrix Cards Table */}
      <div className="space-y-3">
        {filteredMatrix.map((item) => (
          <div
            key={item.projectId}
            onClick={() => onSelectProject(item.projectId)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm hover:shadow-lg"
          >
            {/* Project info */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2.5">
                {getLevelBadge(item.level)}
                <span className="text-[10px] text-slate-400">{item.projectId}</span>
                <span className="text-[10px] text-slate-400">&bull; {item.category}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition leading-snug">
                {item.projectName}
              </h4>
              <div className="text-[11px] text-slate-400 font-sans">
                {isHindi ? 'विभाग:' : 'Dept:'} <span className="text-slate-200">{item.department}</span> &bull; {isHindi ? 'बजट:' : 'Budget:'} <span className="font-mono text-emerald-400 font-bold">₹{(item.budget / 10000000).toFixed(1)} {isHindi ? 'करोड़' : 'Cr'}</span>
              </div>
            </div>

            {/* Overlap Badges & Risk */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-bold">
                {item.hasSpatialOverlap ? (
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                    ⚠️ {isHindi ? 'स्थानिक' : 'SPATIAL'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    ✅ {isHindi ? 'स्थानिक ओके' : 'SPATIAL OK'}
                  </span>
                )}

                {item.hasTimelineOverlap ? (
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                    ⚠️ {isHindi ? 'समय-सीमा' : 'TIMELINE'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    ✅ {isHindi ? 'समय ओके' : 'TIMELINE OK'}
                  </span>
                )}

                {item.hasDependency ? (
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                    🔴 {isHindi ? 'निर्भरता' : 'DEPENDENCY'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    ✅ {isHindi ? 'अनुक्रम ओके' : 'SEQUENCE OK'}
                  </span>
                )}
              </div>

              {getRiskBadge(item.coordinationRisk)}

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
