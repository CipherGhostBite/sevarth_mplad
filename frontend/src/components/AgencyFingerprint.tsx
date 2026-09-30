'use client';

import React from 'react';
import { AgencyDetail } from '@/lib/api';
import { Building2, AlertTriangle, Activity } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface AgencyFingerprintProps {
  agency: AgencyDetail;
}

export default function AgencyFingerprint({ agency }: AgencyFingerprintProps) {
  const { isHindi, t } = useLanguage();

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-[#C45145]/10 text-[#C45145] border-[#C45145]/30';
      case 'ELEVATED':
        return 'bg-[#C88A25]/10 text-[#C88A25] border-[#C88A25]/30';
      default:
        return 'bg-[#398265]/10 text-[#398265] border-[#398265]/30';
    }
  };

  const formatRiskLevelText = (level: string) => {
    if (isHindi) {
      switch (level) {
        case 'HIGH': return 'उच्च जोखिम प्रोफ़ाइल';
        case 'ELEVATED': return 'मध्यम जोखिम प्रोफ़ाइल';
        default: return 'कम जोखिम प्रोफ़ाइल';
      }
    }
    return `${level} RISK PROFILE`;
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Agency Header 3D Plaque */}
      <div className="floating-slab p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#285C7A]/10 border border-[#285C7A]/20 text-[#285C7A]">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-[#182027] text-lg font-sans">{agency.agency_name}</h3>
              <span
                className={`px-3 py-0.5 rounded-full text-[9px] font-mono font-extrabold tracking-wider border ${getRiskLevelBadge(
                  agency.risk_profile_level
                )}`}
              >
                {formatRiskLevelText(agency.risk_profile_level)}
              </span>
            </div>
            <p className="text-xs text-[#667078] font-sans mt-0.5">
              {agency.agency_type} &bull; {agency.district}, {agency.state}
            </p>
          </div>
        </div>

        <Link
          href="/agencies"
          className="tactile-light-switch px-4 py-2 rounded-full text-xs font-mono font-bold text-[#182027] transition self-start md:self-auto"
        >
          {isHindi ? 'सभी एजेंसियां देखें →' : 'VIEW ALL AGENCIES →'}
        </Link>
      </div>

      {/* KPI Instrument Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="recessed-light-display p-4 space-y-1">
          <span className="text-[10px] font-bold text-[#667078] uppercase block">
            {t('agency.project_count', 'Total Works')}
          </span>
          <span className="text-2xl font-mono font-extrabold text-[#182027]">{agency.project_count}</span>
          <span className="text-[9px] text-[#9AA3AB] block">
            {agency.completed_count} {isHindi ? 'पूर्ण' : 'completed'}
          </span>
        </div>

        <div className="recessed-light-display p-4 space-y-1">
          <span className="text-[10px] font-bold text-[#667078] uppercase block">
            {t('agency.delay_rate', 'Delay Rate')}
          </span>
          <span
            className={`text-2xl font-mono font-extrabold ${
              agency.delay_rate > 0.5 ? 'text-[#C45145]' : 'text-[#182027]'
            }`}
          >
            {(agency.delay_rate * 100).toFixed(0)}%
          </span>
          <span className="text-[9px] text-[#9AA3AB] block">
            {agency.delayed_count} {isHindi ? 'विलंबित कार्य' : 'delayed works'}
          </span>
        </div>

        <div className="recessed-light-display p-4 space-y-1">
          <span className="text-[10px] font-bold text-[#667078] uppercase block">
            {t('agency.avg_delay', 'Average Delay')}
          </span>
          <span
            className={`text-2xl font-mono font-extrabold ${
              agency.average_delay > 90 ? 'text-[#C45145]' : 'text-[#182027]'
            }`}
          >
            {agency.average_delay.toFixed(0)} {isHindi ? 'दिन' : 'd'}
          </span>
          <span className="text-[9px] text-[#9AA3AB] block">
            {isHindi ? 'प्रति विलंबित कार्य' : 'per delayed work'}
          </span>
        </div>

        <div className="recessed-light-display p-4 space-y-1">
          <span className="text-[10px] font-bold text-[#667078] uppercase block">
            {isHindi ? 'औसत लागत' : 'Average Cost'}
          </span>
          <span className="text-2xl font-mono font-extrabold text-[#182027]">
            ₹{agency.average_cost.toFixed(1)}{isHindi ? ' लाख' : 'L'}
          </span>
          <span className="text-[9px] text-[#9AA3AB] block">
            {isHindi ? 'प्रति स्वीकृत कार्य' : 'per sanctioned work'}
          </span>
        </div>
      </div>

      {/* Historical Behavioral Fingerprint Log */}
      <div className="floating-slab p-6 space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#285C7A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E4E7E1] pb-2">
          <Activity className="w-4 h-4 text-[#C88A25]" />
          <span>{isHindi ? 'ऐतिहासिक व्यवहार फ़िंगरप्रिंट संकेत' : 'HISTORICAL BEHAVIORAL FINGERPRINT SIGNALS'}</span>
        </h4>
        <div className="space-y-2.5">
          {agency.historical_risk_signals.map((signal, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF7] border border-[#E4E7E1] text-xs text-[#182027] font-sans"
            >
              <AlertTriangle className="w-4 h-4 text-[#C88A25] shrink-0 mt-0.5" />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
