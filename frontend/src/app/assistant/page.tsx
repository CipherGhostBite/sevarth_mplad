'use client';

import React from 'react';
import AiChatDrawer from '@/components/AiChatDrawer';
import { Terminal, Cpu } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function AssistantPortalPage() {
  const { lang, t, isHindi } = useLanguage();
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="floating-slab p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#285C7A]" />
            <h1 className="text-lg font-black text-[#182027] tracking-wider uppercase">
              {t('assistant.title', 'MPLADS AI Cognitive Assistant')}
            </h1>
          </div>
          <p className="text-xs text-[#667078] font-sans mt-1">
            {t('assistant.subtitle', 'Instant explainable answers grounded in MoSPI guidelines & database records.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-[#E4E7E1] text-xs font-mono font-bold text-[#285C7A] shadow-xs">
          <Cpu className="w-4 h-4 text-[#C88A25]" />
          <span>{isHindi ? 'आरएजी साक्ष्य इंजन' : 'RAG EVIDENCE ENGINE'}</span>
        </div>
      </div>

      {/* Main Terminal Workspace */}
      <div className="max-w-5xl mx-auto">
        <AiChatDrawer />
      </div>
    </div>
  );
}
