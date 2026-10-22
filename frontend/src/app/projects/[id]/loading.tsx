import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function LoadingProjectDossier() {
  return (
    <div className="space-y-6 font-mono animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="floating-slab p-6 border-l-4 border-[#285C7A] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-4 w-32 bg-[#E4E7E1] rounded" />
            <div className="h-4 w-24 bg-[#ECEFEA] rounded-full" />
          </div>
          <div className="h-6 w-96 max-w-full bg-[#E4E7E1] rounded" />
          <div className="h-4 w-64 bg-[#ECEFEA] rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-12 w-28 bg-[#E4E7E1] rounded-xl" />
          <div className="h-12 w-20 bg-[#E4E7E1] rounded-xl" />
        </div>
      </div>

      {/* Loading indicator */}
      <div className="floating-slab p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#285C7A] border-t-transparent rounded-full animate-spin" />
        <div className="flex items-center gap-2 text-xs font-bold text-[#285C7A] tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4 text-[#C88A25]" />
          <span>ASSEMBLING SPATIAL INVESTIGATION DOSSIER...</span>
        </div>
        <p className="text-[11px] text-[#667078] font-sans">
          Correlating geographic, contractor, and multi-dimensional expenditure signals...
        </p>
      </div>
    </div>
  );
}
