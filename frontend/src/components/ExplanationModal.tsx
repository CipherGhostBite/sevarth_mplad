'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Bot, FileSpreadsheet, ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export type ExplanationTopic = 'intelligence' | 'constituencies' | 'explainability' | 'dossiers' | null;

interface ExplanationModalProps {
  isOpen: boolean;
  topic: ExplanationTopic;
  onClose: () => void;
}

interface StepNode {
  stepNum: string;
  label: string;
  short: string;
  detail: string;
  keyMetric: string;
}

interface TopicConfig {
  id: NonNullable<ExplanationTopic>;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  steps: StepNode[];
  summary: string;
}

export default function ExplanationModal({ isOpen, topic, onClose }: ExplanationModalProps) {
  const { isHindi, t } = useLanguage();
  const [currentTopic, setCurrentTopic] = useState<NonNullable<ExplanationTopic>>('intelligence');
  const [activeStep, setActiveStep] = useState<number>(0);

  const getTopicData = (): Record<NonNullable<ExplanationTopic>, TopicConfig> => ({
    intelligence: {
      id: 'intelligence',
      badge: isHindi ? 'जोखिम इंजन गणना' : 'RISK ENGINE CALCULATION',
      badgeColor: 'bg-[#C88A25]/15 text-[#9E6B17] border-[#C88A25]/40',
      icon: Sparkles,
      title: isHindi ? 'अनियमितता संकेत की गणना कैसे की जाती है?' : 'How is an anomaly signal calculated?',
      subtitle: isHindi
        ? 'व्यय अंतर और भौगोलिक डेटा को 0–100 प्राथमिकता स्कोर में बदलने वाला मल्टी-सिग्नल जोखिम इंजन।'
        : 'Multi-signal risk engine converting expenditure variance & spatial telemetry into 0–100 priority scores.',
      steps: [
        {
          stepNum: '01',
          label: isHindi ? 'डेटा संग्रह' : 'Telemetry Ingestion',
          short: isHindi ? 'डेटा संग्रह' : 'Data Ingest',
          detail: isHindi
            ? 'स्वीकृति राशि, व्यय वाउचर, पूर्णता समय-सीमा और ठेकेदार रजिस्ट्रियों को एकत्रित करता है।'
            : 'Aggregates sanction amounts, expenditure vouchers, completion timelines, and contractor registry logs.',
          keyMetric: isHindi ? 'कच्चा डेटा सूचकांक' : 'Raw Data Index',
        },
        {
          stepNum: '02',
          label: isHindi ? 'आइसोलेशन अनिमियतता इंजन' : 'Isolation Anomaly Engine',
          short: isHindi ? 'अनियमितता मॉडल' : 'Anomaly Model',
          detail: isHindi
            ? 'सांख्यिकीय आइसोलेशन फ़ॉरेस्ट ऐतिहासिक मानकों से लागत वृद्धि और विलंब का पता लगाता है।'
            : 'Statistical Isolation Forest isolates cost overruns & start delay deviations from historical block benchmarks.',
          keyMetric: isHindi ? 'जेड-स्कोर दूरी' : 'Z-Score Distance',
        },
        {
          stepNum: '03',
          label: isHindi ? 'सत्यापनीय ऑडिट स्कोर' : 'Traceable Audit Signal',
          short: isHindi ? 'ऑडिट स्कोर' : 'Audit Score',
          detail: isHindi
            ? 'भौतिक ऑडिट के लिए विशिष्ट साक्ष्य मदों में विभाजित 0–100 स्कोर तैयार करता है।'
            : 'Generates deterministic 0–100 priority score decomposed into specific evidence line-items for field audit.',
          keyMetric: isHindi ? 'सत्यापनीय स्कोर' : 'Traceable Score',
        },
      ],
      summary: isHindi
        ? 'प्रत्येक प्राथमिकता स्कोर 100% निश्चित है और भौतिक निरीक्षण के लिए विशिष्ट साक्ष्य मदों में विभाजित है।'
        : 'Every priority score is 100% deterministic and decomposed into specific evidence line-items for physical audit verification.',
    },
    constituencies: {
      id: 'constituencies',
      badge: isHindi ? 'स्थानिक भूगोल एवं ग्राफ विश्लेषण' : 'SPATIAL GEOGRAPHY & GRAPH ANALYTICS',
      badgeColor: 'bg-[#285C7A]/15 text-[#285C7A] border-[#285C7A]/40',
      icon: MapPin,
      title: isHindi ? 'संसदीय क्षेत्रों को इंटरैक्टिव ग्राफ के साथ क्यों दिखाया गया है?' : 'Why are cities shown with interactive graphs?',
      subtitle: isHindi
        ? 'ग्राफ-आधारित मानचित्रण भौगोलिक स्थिति, परियोजना घनत्व और विक्रेता नेटवर्क को जोड़ता है।'
        : 'Graph-based spatial mapping connects geographic location, project density, and vendor overlap.',
      steps: [
        {
          stepNum: '01',
          label: isHindi ? 'वेक्टर निर्देशांक' : 'Vector Coordinates',
          short: isHindi ? 'स्थानिक वेक्टर' : 'Geospatial Vectors',
          detail: isHindi
            ? 'उच्च-गुणवत्ता वाले वेक्टर मानचित्र सटीक अक्षांश/देशांतर के साथ स्वीकृत कार्यों को दर्शाते हैं।'
            : 'High-resolution vector maps pinpoint sanctioned works with exact lat/long coordinates across blocks.',
          keyMetric: isHindi ? 'स्थानिक वेक्टर' : 'Spatial Vectors',
        },
        {
          stepNum: '02',
          label: isHindi ? 'ठेकेदार ग्राफ जुड़ाव' : 'Contractor Graph Edges',
          short: isHindi ? 'ग्राफ टोपोलॉजी' : 'Graph Topology',
          detail: isHindi
            ? 'नेटवर्क ग्राफ समान ठेकेदारों या समय सीमा को साझा करने वाली परियोजनाओं को जोड़ता है।'
            : 'Network edges link projects sharing identical contractors, agencies, or execution timeframes.',
          keyMetric: isHindi ? 'विक्रेता ग्राफ' : 'Vendor Graph',
        },
        {
          stepNum: '03',
          label: isHindi ? 'क्लस्टर हीटमैप' : 'Cluster Heatmaps',
          short: isHindi ? 'स्थानिक सूझबूझ' : 'Spatial Insight',
          detail: isHindi
            ? 'प्रशासनिक सीमाओं के पार भौतिक क्लस्टरिंग और दोहराव कार्य आवंटन का दृश्य प्रस्तुत करता है।'
            : 'Visualizes physical clustering and duplicate work allocations across administrative boundaries.',
          keyMetric: isHindi ? 'निकटता संकेत' : 'Proximity Signal',
        },
      ],
      summary: isHindi
        ? 'ग्राफ जुड़ाव कच्चे जीपीएस डेटा को स्थानिक मानचित्र में बदलता है, जिससे दोहराव आवंटन उजागर होता है।'
        : 'Graph connectivity transforms raw GPS coordinates into spatial heatmaps, spotlighting duplicate work allocations.',
    },
    explainability: {
      id: 'explainability',
      badge: isHindi ? 'आरएजी संरचना एवं शून्य-भ्रम' : 'RAG ARCHITECTURE & ZERO-HALLUCINATION',
      badgeColor: 'bg-[#398265]/15 text-[#398265] border-[#398265]/40',
      icon: Bot,
      title: isHindi ? 'एआई सहायक आरएजी प्रणाली के साथ कैसे तर्क करता है?' : 'How does Sevaarth AI reason with RAG?',
      subtitle: isHindi
        ? 'रिट्रीवल-ऑगमेंटेड जनरेशन एआई उत्तरों को सीधे एमओएसपीआई नियमों और वाउचरों से जोड़ता है।'
        : 'Retrieval-Augmented Generation grounds AI responses directly in official MoSPI guidelines & vouchers.',
      steps: [
        {
          stepNum: '01',
          label: isHindi ? 'प्राकृतिक भाषा प्रश्न' : 'Natural Language Query',
          short: isHindi ? 'प्रश्न विश्लेषण' : 'Query Ingest',
          detail: isHindi
            ? 'परियोजना प्रगति और एमओएसपीआई नियमों से संबंधित प्रश्नों का विश्लेषण करता है।'
            : 'Parses investigator prompts regarding project progress, guidelines, or expenditure compliance rules.',
          keyMetric: isHindi ? 'प्रश्न संग्रह' : 'NL Ingest',
        },
        {
          stepNum: '02',
          label: isHindi ? 'नीति वेक्टर खोज' : 'Policy Vector Lookup',
          short: isHindi ? 'वेक्टर खोज' : 'Vector Search',
          detail: isHindi
            ? 'वेक्टर खोज आधिकारिक एमओएसपीआई परिपत्रों और योजना नियमों को स्कैन करती है।'
            : 'Vector search scans official MoSPI circulars, scheme norms, and sanction evidence records.',
          keyMetric: isHindi ? 'वेक्टर खोज' : 'Vector Lookup',
        },
        {
          stepNum: '03',
          label: isHindi ? 'सत्यापित ऑडिट उत्तर' : 'Cited Audit Answer',
          short: isHindi ? 'शून्य-भ्रम' : 'Zero-Hallucination',
          detail: isHindi
            ? 'मूल स्रोत दस्तावेजों के क्लिक करने योग्य संदर्भों के साथ उत्तर तैयार करता है।'
            : 'Synthesizes answers with explicit clickable citations back to official source documents.',
          keyMetric: isHindi ? 'शून्य-भ्रम' : 'Zero-Hallucination',
        },
      ],
      summary: isHindi
        ? 'आरएजी सटीक नीति संदर्भ प्राप्त करके और स्रोतों के साथ उत्तर तैयार करके शून्य भ्रम सुनिश्चित करता है।'
        : 'RAG guarantees zero hallucination by retrieving exact policy clauses before synthesizing answers with clickable citations.',
    },
    dossiers: {
      id: 'dossiers',
      badge: isHindi ? 'प्राथमिकता फ़ाइल रेंकर' : 'PRIORITY DOSSIER RANKER',
      badgeColor: 'bg-[#C45145]/15 text-[#C45145] border-[#C45145]/40',
      icon: FileSpreadsheet,
      title: isHindi ? 'ऑडिट के लिए परियोजना साक्ष्य फ़ाइल कैसे रैंक की जाती है?' : 'How is a project dossier ranked for audit?',
      subtitle: isHindi
        ? 'डेटा संकेतों को प्राथमिकताबद्ध भौतिक ऑडिट फ़ाइलों में व्यवस्थित करने वाला स्वचालित संकलनकर्ता।'
        : 'Automated compiler that stacks telemetry signals into prioritized physical audit dossiers.',
      steps: [
        {
          stepNum: '01',
          label: isHindi ? 'मल्टी-सिग्नल संलयन' : 'Multi-Signal Fusion',
          short: isHindi ? 'सिग्नल संलयन' : 'Signal Fusion',
          detail: isHindi
            ? 'वित्तीय अंतर, विलंब सूचकांक और ठेकेदार भार को एक संचयी जोखिम प्रोफ़ाइल में मिलाता है।'
            : 'Merges financial variance, delay index, and contractor load into a composite risk profile.',
          keyMetric: isHindi ? 'संचयी जोखिम' : 'Composite Risk',
        },
        {
          stepNum: '02',
          label: isHindi ? 'साक्ष्य बाइंडिंग' : 'Evidence Binder Stacking',
          short: isHindi ? 'बाइंडर स्टैकिंग' : 'Binder Stacking',
          detail: isHindi
            ? 'प्रिंट करने योग्य बाइंडिंग में वाउचर, मानचित्र, विलंब लॉग और चेकलिस्ट स्वतः संकलित करता है।'
            : 'Auto-compiles vouchers, map snips, delay logs, and statutory checklists into a printable binder.',
          keyMetric: isHindi ? 'साक्ष्य बाइंडिंग' : 'Evidence Binder',
        },
        {
          stepNum: '03',
          label: isHindi ? 'प्राथमिकता फ़ील्ड कतार' : 'Priority Field Queue',
          short: isHindi ? 'रैंक की गई कतार' : 'Ranked Queue',
          detail: isHindi
            ? 'अधिकारियों के लक्षित स्थल निरीक्षण के लिए जोखिम तीव्रता के क्रम में परियोजनाओं को रैंक करता है।'
            : 'Ranks projects in order of risk intensity for targeted officer physical field inspection.',
          keyMetric: isHindi ? 'रैंक की गई कतार' : 'Ranked Queue',
        },
      ],
      summary: isHindi
        ? 'साक्ष्य फ़ाइलें कच्चे डेटा को प्राथमिकताबद्ध ऑडिट पैक में बदलती हैं, जिससे अधिकारियों का ध्यान उच्च जोखिम वाली परियोजनाओं पर पहले जाता है।'
        : 'Dossiers convert raw data into prioritized physical audit packs, directing officer focus to high-risk projects first.',
    },
  });

  const topicData = getTopicData();

  // Sync internal topic state when external topic prop changes
  useEffect(() => {
    if (topic && topicData[topic]) {
      setCurrentTopic(topic);
      setActiveStep(0);
    }
  }, [topic]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !topicData[currentTopic]) return null;

  const data = topicData[currentTopic];
  const Icon = data.icon;
  const currentStepData = data.steps[activeStep] || data.steps[0];

  const topicsList: NonNullable<ExplanationTopic>[] = ['intelligence', 'constituencies', 'explainability', 'dossiers'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b131e]/75 backdrop-blur-2xl animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      {/* 3D Glassmorphic Container with Ambient Specular Glow */}
      <div
        className="relative max-w-3xl w-full p-6 sm:p-8 space-y-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-white/80 dark:border-white/10 shadow-[0_35px_100px_rgba(15,23,42,0.35),0_15px_35px_rgba(15,23,42,0.2),inset_0_2px_1px_rgba(255,255,255,1)] rounded-3xl overflow-hidden transition-all duration-300 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gloss Specular Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#285C7A] via-[#C88A25] to-[#398265] opacity-80" />

        {/* Top Navigation Bar: Quick Topic Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E4E7E1]/80 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {topicsList.map((tKey) => {
              const tItem = topicData[tKey];
              const isSelected = tKey === currentTopic;
              const TIcon = tItem.icon;
              return (
                <button
                  key={tKey}
                  onClick={() => {
                    setCurrentTopic(tKey);
                    setActiveStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-[#182027] text-white shadow-md scale-[1.02] border border-[#182027]'
                      : 'bg-[#FAFAF7] text-[#667078] hover:bg-[#ECEFEA] hover:text-[#182027] border border-[#E4E7E1]'
                  }`}
                >
                  <TIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C88A25]' : 'text-[#667078]'}`} />
                  <span className="hidden sm:inline">
                    {tKey === 'intelligence' && (isHindi ? 'गणना विधि?' : 'Calculated?')}
                    {tKey === 'constituencies' && (isHindi ? 'ग्राफ क्यों?' : 'Why Cities?')}
                    {tKey === 'explainability' && (isHindi ? 'एआई तर्क' : 'AI Reasoning')}
                    {tKey === 'dossiers' && (isHindi ? 'फ़ाइल रैंकिंग' : 'Dossier Ranking')}
                  </span>
                  <span className="sm:hidden capitalize">{tKey}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#667078] hover:text-[#182027] hover:bg-[#ECEFEA] transition shrink-0 border border-transparent hover:border-[#E4E7E1]"
            title={isHindi ? 'बंद करें (Esc)' : 'Close Panel (Esc)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border shadow-xs ${data.badgeColor}`}>
              {data.badge}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-0.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white to-[#FAFAF7] border border-[#D2D7CE] flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-5 h-5 text-[#285C7A]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#182027] tracking-tight font-sans">
              {data.title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#667078] leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* 3-Stage Visual Pipeline Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#667078] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[#285C7A]">
              <Zap className="w-3.5 h-3.5 text-[#C88A25]" />
              <span>{isHindi ? '3-चरण प्रणाली कार्यप्रवाह' : '3-STAGE SYSTEM WORKFLOW'}</span>
            </span>
            <span className="text-[10px] bg-[#285C7A]/10 text-[#285C7A] px-2.5 py-0.5 rounded-full border border-[#285C7A]/20">
              {isHindi ? `चरण ${activeStep + 1} / ${data.steps.length}` : `STAGE ${activeStep + 1} OF ${data.steps.length}`}
            </span>
          </div>

          {/* 3-Column Glass Keycap Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.steps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-[#182027] to-[#24313C] text-white border-[#182027] shadow-[0_12px_28px_rgba(24,32,39,0.25)] scale-[1.02] z-10'
                      : 'bg-white/90 text-[#182027] border-[#E4E7E1] hover:border-[#285C7A]/40 hover:bg-[#FAFAF7] hover:shadow-md'
                  }`}
                >
                  {/* Top Specular Glow inside active card */}
                  {isActive && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C88A25] to-transparent" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-[#C88A25] text-white' : 'bg-[#285C7A]/10 text-[#285C7A]'
                    }`}>
                      {step.stepNum}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isActive ? 'border-white/20 text-white/80 bg-white/10' : 'border-[#E4E7E1] text-[#667078] bg-[#FAFAF7]'
                    }`}>
                      {step.keyMetric}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold block mb-1 font-sans ${isActive ? 'text-white' : 'text-[#182027]'}`}>
                    {step.label}
                  </h3>

                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${isActive ? 'text-white/80' : 'text-[#667078]'}`}>
                    {step.detail}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Breakdown Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAFAF7] to-white border border-[#E4E7E1] space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#285C7A] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#398265]" />
              <span>{isHindi ? `चरण ${currentStepData.stepNum}: ${currentStepData.label}` : `STAGE ${currentStepData.stepNum}: ${currentStepData.label}`}</span>
            </div>
            <p className="text-xs text-[#182027] leading-relaxed font-sans">
              {currentStepData.detail}
            </p>
          </div>
        </div>

        {/* Bottom Key Principle Summary */}
        <div className="p-3.5 rounded-2xl bg-[#285C7A]/5 border border-[#285C7A]/15 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#285C7A] shrink-0 mt-0.5" />
          <div className="text-xs text-[#182027] font-sans leading-snug space-y-0.5">
            <span className="font-mono font-bold text-[#285C7A] text-[10px] uppercase tracking-wider block">
              {isHindi ? 'प्रणाली गारंटी' : 'SYSTEM GUARANTEE'}
            </span>
            <span>{data.summary}</span>
          </div>
        </div>

        {/* Footer Close Action */}
        <div className="pt-1 flex items-center justify-between border-t border-[#E4E7E1]/80">
          <span className="text-[10px] font-mono text-[#667078]">
            {isHindi ? 'सेवाार्थ एआई • व्याख्या योग्य सार्वजनिक व्यय मॉडल' : 'Sevaarth AI • Explainable Public Expenditure Model'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#182027] text-white hover:bg-[#285C7A] text-xs font-bold font-mono inline-flex items-center gap-2 shadow-md transition-all duration-200"
          >
            <span>{t('common.close', 'CLOSE').toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C88A25]" />
          </button>
        </div>
      </div>
    </div>
  );
}
