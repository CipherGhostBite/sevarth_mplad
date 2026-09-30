'use client';

import React, { useState } from 'react';
import { api, InvestigationDetail } from '@/lib/api';
import { Save, CheckCircle2, UserCheck, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface InvestigationModalProps {
  projectId: string;
  currentStatus: string;
  currentNotes: string;
  onUpdate?: (updated: InvestigationDetail) => void;
  readOnly?: boolean;
}

export default function InvestigationModal({
  projectId,
  currentStatus,
  currentNotes,
  onUpdate,
  readOnly = false,
}: InvestigationModalProps) {
  const { isHindi, t } = useLanguage();
  const [status, setStatus] = useState<string>(currentStatus || 'NEW');
  const [notes, setNotes] = useState<string>(currentNotes || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const statuses = [
    { value: 'NEW', label: isHindi ? 'नया (ट्रियाज लंबित)' : 'NEW (Triage Pending)', color: 'border-slate-300' },
    { value: 'UNDER REVIEW', label: isHindi ? 'समीक्षाधीन (सक्रिय जांच)' : 'UNDER REVIEW (Active Inquiry)', color: 'border-[#C88A25]' },
    { value: 'VERIFIED', label: isHindi ? 'सत्यापित (भौतिक ऑडिट पास)' : 'VERIFIED (Physical Audit Clear)', color: 'border-[#398265]' },
    { value: 'DISMISSED', label: isHindi ? 'खारिज (सामान्य भिन्नता)' : 'DISMISSED (Benign Variation)', color: 'border-slate-400' },
    { value: 'ESCALATED', label: isHindi ? 'आगे भेजा गया (सतर्कता ब्यूरो प्रेषण)' : 'ESCALATED (Vigilance Bureau Referral)', color: 'border-[#C45145]' },
  ];

  const handleSave = async () => {
    if (readOnly) return;
    setLoading(true);
    setSuccess(false);
    try {
      const res = await api.updateInvestigation(projectId, {
        status,
        notes,
      });
      if (onUpdate) onUpdate(res);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(isHindi ? `ऑडिट अपडेट में त्रुटि: ${err.message}` : `Error updating investigation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-slab p-6 space-y-5 font-mono">
      <div className="flex items-center justify-between border-b border-[#E4E7E1] pb-3.5">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-[#285C7A]" />
          <h3 className="font-bold text-[#182027] text-sm tracking-wider uppercase">
            {isHindi ? 'जांचकर्ता निर्णय एवं कार्रवाई लॉग' : 'INVESTIGATOR DECISION & ACTION LOG'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {readOnly ? (
            <span className="text-[10px] text-[#C88A25] font-mono bg-[#C88A25]/10 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-[#C88A25]/20">
              <Lock className="w-3 h-3 text-[#C88A25]" />
              {isHindi ? 'केवल पढ़ने योग्य' : 'READ-ONLY LOG'}
            </span>
          ) : (
            <span className="text-[10px] text-[#285C7A] font-mono bg-[#285C7A]/10 px-2.5 py-1 rounded-full font-bold">
              {isHindi ? 'मानव सत्यापन प्रोटोकॉल' : 'HUMAN-IN-THE-LOOP PROTOCOL'}
            </span>
          )}
        </div>
      </div>

      {/* Status selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#182027] uppercase block tracking-wider">
          {isHindi ? 'जाँच स्थिति' : 'Investigation Status'}
        </label>
        <select
          value={status}
          disabled={readOnly}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-4 py-2.5 text-xs font-bold text-[#285C7A] focus:ring-2 focus:ring-[#285C7A] focus:outline-hidden ${
            readOnly ? 'opacity-70 cursor-not-allowed bg-[#F5F6F3]' : ''
          }`}
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} className="bg-white text-[#182027]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Investigator Notes */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#182027] uppercase block tracking-wider">
          {isHindi ? 'जांचकर्ता के निष्कर्ष / टिप्पणियां' : 'Investigator Findings / Notes'}
        </label>
        <textarea
          rows={4}
          value={notes}
          readOnly={readOnly}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            readOnly
              ? (isHindi ? 'कोई टिप्पणी दर्ज नहीं की गई है। अपडेट करने के लिए अधिकारी लॉगिन आवश्यक है।' : 'No notes entered yet. Officer login required to update notes.')
              : (isHindi ? 'ऑडिट निरीक्षण, भौतिक सत्यापन निष्कर्ष, मेजरमेंट बुक क्रॉस-चेक दर्ज करें...' : 'Record audit observations, field verification findings, Measurement Book cross-checks, or escalation reasons...')
          }
          className={`w-full bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl p-4 text-xs text-[#182027] focus:ring-2 focus:ring-[#285C7A] focus:outline-hidden font-sans placeholder-[#9AA3AB] ${
            readOnly ? 'opacity-80 cursor-not-allowed bg-[#F5F6F3]' : ''
          }`}
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#E4E7E1]">
        {success ? (
          <div className="flex items-center gap-2 text-xs font-bold text-[#398265]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'निर्णय लॉग सफलतापूर्वक अपडेट किया गया!' : 'Decision log updated successfully!'}</span>
          </div>
        ) : (
          <div className="text-[10px] text-[#667078]">
            {readOnly
              ? (isHindi ? 'केवल पढ़ने योग्य रिकॉर्ड। संपादित करने के लिए लॉगिन करें।' : 'Read-only audit record. Sign in as Vigilance Officer to edit.')
              : (isHindi ? 'परिवर्तन समय-छाप और वैधानिक ऑडिट ट्रेल के साथ सहेजे जाएंगे।' : 'Changes persisted with investigator timestamp and statutory audit trail.')}
          </div>
        )}

        {readOnly ? (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#667078] bg-[#FAFAF7] px-3.5 py-2 rounded-xl border border-[#E4E7E1]">
            <Lock className="w-3.5 h-3.5 text-[#C88A25]" />
            <span>{isHindi ? 'केवल पढ़ने योग्य दृश्य' : 'READ-ONLY VIEW'}</span>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="tactile-light-switch tactile-light-switch-active px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{loading ? (isHindi ? 'सहेजा जा रहा है...' : 'SAVING...') : (isHindi ? 'निर्णय सहेजें' : 'SAVE DECISION')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
