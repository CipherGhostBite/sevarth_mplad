'use client';

import React, { useState } from 'react';
import { api, AssistantAnswer } from '@/lib/api';
import { Send, Terminal, FileText, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface AiChatDrawerProps {
  projectId?: string;
}

export default function AiChatDrawer({ projectId }: AiChatDrawerProps) {
  const { isHindi, t } = useLanguage();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const getConstituencyName = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('selected_constituency');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.shortName) return parsed.shortName;
        }
      } catch (e) {}
    }
    return 'Varanasi';
  };
  const activeConstituency = getConstituencyName();

  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'assistant';
      text: string;
      citations?: any[];
      mode?: string;
    }>
  >([
    {
      sender: 'assistant',
      text: projectId
        ? (isHindi 
            ? `जाँच विश्लेषण केंद्र [मामला: ${projectId}]\nसाक्ष्य-आधारित विश्लेषण सक्रिय है। प्राथमिकता विश्लेषण, लागत तुलना, या नियमों के संबंध में प्रश्न पूछें।`
            : `INVESTIGATION ANALYTICAL WORKSTATION [CASE: ${projectId}]\nGrounded cognitive analysis active. Formulate inquiries regarding score breakdown, peer cost benchmarks, agency delay records, or verification protocols.`)
        : (isHindi
            ? `जाँच विश्लेषण केंद्र [संसदीय क्षेत्र: ${activeConstituency}]\nक्षेत्रीय जोखिम संकेतों, एजेंसी विलंब, या एमओएसपीआई नियमों से संबंधित प्रश्न पूछें।`
            : `INVESTIGATION ANALYTICAL WORKSTATION [CONSTITUENCY: ${activeConstituency.toUpperCase()}]\nFormulate analytical inquiries regarding constituency risk signals, agency concentration, or MoSPI scheme compliance parameters.`),
    },
  ]);

  const presetQuestions = projectId
    ? (isHindi
        ? [
            'इस मामले को प्राथमिकता क्यों दी गई?',
            'लागत की तुलना अन्य कार्यों से कैसे की जाती है?',
            'इस एजेंसी के बारे में क्या असामान्य है?',
            'जांच अधिकारी को क्या सत्यापित करना चाहिए?',
          ]
        : [
            'Why was this case prioritized?',
            'How does cost compare to peer works?',
            'What is unusual about this agency?',
            'What should an investigator verify?',
          ])
    : (isHindi
        ? [
            `${activeConstituency} में शीर्ष प्राथमिकता वाली परियोजनाएं कौन सी हैं?`,
            'किन एजेंसियों की विलंब दर सबसे अधिक है?',
            'कार्यों के दोहराव पर एमओएसपीआई पैरा 4.12 क्या कहता है?',
          ]
        : [
            `What are the top prioritized projects in ${activeConstituency}?`,
            'Which agencies have high delay rates?',
            'What does MoSPI Para 4.12 say about work duplication?',
          ]);

  const handleSend = async (qToSend?: string) => {
    const q = (qToSend || question).trim();
    if (!q || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    if (!qToSend) setQuestion('');
    setLoading(true);

    try {
      const res: AssistantAnswer = await api.askAssistant(q, projectId);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.answer,
          citations: res.evidence_citations,
          mode: res.mode,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: isHindi
            ? `सिस्टम त्रुटि: बुद्धिमत्ता सेवा से संपर्क करने में असमर्थ (${err.message || 'एपीआई अनुपलब्ध'})।`
            : `SYSTEM ERROR: Unable to contact intelligence service (${err.message || 'API Unavailable'}).`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-slab flex flex-col h-[620px] overflow-hidden font-mono border border-[#E4E7E1]">
      {/* Workspace Header */}
      <div className="bg-[#FAFAF7] text-[#182027] px-6 py-4 border-b border-[#E4E7E1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#285C7A]/10 border border-[#285C7A]/20 text-[#285C7A]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold flex items-center gap-2.5 tracking-wider text-[#182027]">
              <span>{isHindi ? 'जाँच विश्लेषणात्मक कार्यकेंद्र' : 'INVESTIGATION ANALYTICAL WORKSTATION'}</span>
              <span className="bg-[#285C7A]/10 text-[#285C7A] text-[9px] px-2 py-0.5 rounded-full font-bold">
                {t('assistant.rag_engine', 'RAG ENGINE')}
              </span>
            </h3>
            <p className="text-[10px] text-[#667078] font-sans">
              {isHindi ? 'साक्ष्य-आधारित निर्णय सहायता • सत्यापन अनिवार्य' : 'Evidence-Grounded Cognitive Decision Support • Verification Required'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                sender: 'assistant',
                text: projectId
                  ? (isHindi ? `मामले ${projectId} के लिए कार्यकेंद्र रीसेट किया गया। प्रश्नों के लिए तैयार।` : `WORKSTATION RESET FOR CASE ${projectId}. READY FOR INQUIRIES.`)
                  : (isHindi ? 'कार्यकेंद्र रीसेट किया गया। प्रश्नों के लिए तैयार।' : 'WORKSTATION RESET. READY FOR INQUIRIES.'),
              },
            ])
          }
          className="tactile-light-switch p-2 rounded-full text-[#667078] hover:text-[#182027]"
          title={isHindi ? 'लॉग रीसेट करें' : 'Reset Log'}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Analytical Findings Output Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#F5F6F3] text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Header label */}
            <div className="text-[10px] font-mono text-[#667078] mb-1.5 px-1 flex items-center gap-1.5">
              {m.sender === 'user' ? (
                <span className="text-[#C88A25] font-bold">&gt; {isHindi ? 'विश्लेषक प्रश्न:' : 'ANALYST INQUIRY:'}</span>
              ) : (
                <span className="text-[#285C7A] font-bold">&gt; {isHindi ? 'विश्लेषणात्मक निष्कर्ष:' : 'ANALYTICAL FINDING:'}</span>
              )}
            </div>

            <div
              className={`max-w-[88%] rounded-2xl p-5 leading-relaxed border ${
                m.sender === 'user'
                  ? 'bg-[#173F58] border-[#173F58] text-white font-mono shadow-md'
                  : 'bg-white border-[#E4E7E1] text-[#182027] font-sans shadow-[0_12px_32px_rgba(40,50,55,0.05)]'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Structured Categorization Tags for Assistant Output */}
              {m.sender === 'assistant' && (
                <div className="mt-4 pt-3 border-t border-[#E4E7E1] flex flex-wrap gap-2 text-[9px] font-mono">
                  <span className="bg-[#285C7A]/10 text-[#285C7A] px-2.5 py-1 rounded-full border border-[#285C7A]/20 font-bold">
                    {isHindi ? 'निष्कर्ष: साक्ष्य आधारित डेटा' : 'FINDING: Grounded Dataset'}
                  </span>
                  <span className="bg-[#C88A25]/10 text-[#C88A25] px-2.5 py-1 rounded-full border border-[#C88A25]/20 font-bold">
                    {isHindi ? 'जोखिम संकेत: परिकलित' : 'RISK SIGNAL: Calculated'}
                  </span>
                  <span className="bg-[#398265]/10 text-[#398265] px-2.5 py-1 rounded-full border border-[#398265]/20 font-bold">
                    {isHindi ? 'विश्वासनीयता: उच्च (RAG)' : 'CONFIDENCE: High (RAG)'}
                  </span>
                  <span className="bg-[#C45145]/10 text-[#C45145] px-2.5 py-1 rounded-full border border-[#C45145]/20 font-bold">
                    {isHindi ? 'सत्यापन आवश्यक' : 'REQUIRES VERIFICATION'}
                  </span>
                </div>
              )}

              {/* Evidence Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E4E7E1] space-y-2">
                  <div className="text-[9px] font-mono font-bold text-[#667078] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#285C7A]" />
                    <span>{isHindi ? `समर्थक साक्ष्य दस्तावेज (${m.citations.length})` : `SUPPORTING EVIDENCE ARTIFACTS (${m.citations.length})`}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.citations.map((cit, cIdx) => (
                      <span
                        key={cIdx}
                        className="bg-[#FAFAF7] text-[#285C7A] text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#E4E7E1] font-bold"
                        title={`${cit.title} (${cit.source})`}
                      >
                        [{cit.evidence_id}]
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[#285C7A] text-xs p-2 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-[#285C7A]" />
            <span>{isHindi ? 'साक्ष्य प्राप्त किए जा रहे हैं और निष्कर्ष संकलित हो रहे हैं...' : 'RETRIEVING GROUNDED EVIDENCE & SYNTHESIZING ANALYTICAL FINDINGS...'}</span>
          </div>
        )}
      </div>

      {/* Preset Action Switches */}
      <div className="p-3 bg-[#FAFAF7] border-t border-[#E4E7E1] flex flex-wrap gap-2">
        {presetQuestions.map((qText, qIdx) => (
          <button
            key={qIdx}
            onClick={() => handleSend(qText)}
            className="tactile-light-switch text-[10px] font-mono px-3 py-1.5 rounded-full text-[#182027]"
          >
            &gt; {qText}
          </button>
        ))}
      </div>

      {/* Input Workspace Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white border-t border-[#E4E7E1] flex items-center gap-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('assistant.placeholder', 'Ask any question about constituency projects, guidelines, or anomalies...')}
            className="w-full bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-4 py-2.5 text-xs text-[#182027] font-mono focus:outline-hidden focus:border-[#285C7A] placeholder-[#9AA3AB]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="tactile-light-switch tactile-light-switch-active px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition"
        >
          <Send className="w-4 h-4 text-white" />
          <span>{t('assistant.send', 'Ask Assistant')}</span>
        </button>
      </form>
    </div>
  );
}
