'use client';

import React from 'react';
import { BookOpen, Scale } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function GuidelinesLibraryPage() {
  const { isHindi, t } = useLanguage();

  const guidelines = [
    {
      para: 'Para 4.12',
      title: isHindi ? 'कार्यों के दोहराव और संपत्ति निर्माण पर प्रतिबंध' : 'Prohibition on Duplication of Works & Asset Creation',
      category: isHindi ? 'योजना पात्रता एवं सत्यापन' : 'Scheme Eligibility & Verification',
      text: isHindi ? 'एमपीएलएडीएस के तहत किसी ऐसे स्थान पर काम के लिए कोई धन स्वीकृत नहीं किया जाएगा जहां पिछले 5 वर्षों के भीतर किसी भी केंद्रीय या राज्य योजना के तहत समान टिकाऊ संपत्ति बनाई गई है, जब तक कि जिला प्राधिकरण द्वारा पूरी तरह से जर्जर या गैर-कार्यात्मक प्रमाणित न किया गया हो।' : 'No funds under MPLADS shall be sanctioned for a work in a location where a similar durable asset has been created under any Central or State Scheme within the last 5 years, unless certified as fully dilapidated or non-functional by the District Authority.',
      implication: isHindi ? 'द्वितीय किश्त जारी करने से पहले स्थानिक निकटता जांच और आकृत दोहराव का पता लगाना अनिवार्य है।' : 'Spatial proximity checks and semantic duplicate detection are mandatory before second tranche release.',
    },
    {
      para: 'Para 3.4',
      title: isHindi ? 'तकनीकी अनुमान और दरों की मानक अनुसूची (SOR)' : 'Technical Estimates & Standard Schedule of Rates (SOR)',
      category: isHindi ? 'वित्तीय शासन' : 'Financial Governance',
      text: isHindi ? 'एमपीएलएडीएस कार्यों के लिए सभी अनुमानों को लोक निर्माण विभाग / ग्रामीण कार्य विभाग की वर्तमान राज्य दर अनुसूची (एसओआर) के अनुरूप होना चाहिए। निष्पादन एजेंसियों को आकस्मिकता या ऊपरी दरों को नहीं बढ़ाना चाहिए।' : 'All estimates for MPLADS works must strictly conform to the current State Schedule of Rates (SOR) of the Public Works Department / Rural Works Department. Implementing agencies must not inflate contingency or overhead rates.',
      implication: isHindi ? 'लागत-प्रति-इकाई और सहकर्मी मध्यिका लागत विचलन +40% से अधिक होने पर तत्काल डेस्क ऑडिट ट्रिगर होता है।' : 'Cost-per-unit and peer median cost deviations exceeding +40% flag an immediate desk audit trigger.',
    },
    {
      para: 'Para 5.2',
      title: isHindi ? 'कार्य निष्पादन और देरी के लिए निर्धारित समय-सीमा' : 'Stipulated Timeframe for Work Execution & Delays',
      category: isHindi ? 'समय-सीमा अनुपालन' : 'Timeline Compliance',
      text: isHindi ? 'निष्पादित करने वाली एजेंसियां प्रशासनिक स्वीकृति के 45 दिनों के भीतर काम शुरू करने और स्वीकृत संरचनात्मक अनुसूची के अनुसार 6 से 12 महीनों के भीतर काम पूरा करने के लिए बाध्य हैं। 90 दिनों से अधिक की अस्पष्टीकृत देरी पर ज़िला मजिस्ट्रेट द्वारा समीक्षा की जाती है।' : 'Executing agencies are bound to commence work within 45 days of administrative sanction and complete works within 6 to 12 months as per the sanctioned structural schedule. Unexplained delays beyond 90 days attract review by the District Collector.',
      implication: isHindi ? 'देरी ट्रैकिंग और एजेंसी की ऐतिहासिक देरी दर की गणना व्यवस्थित रूप से की जाती है।' : 'Delay tracking and agency historical delay rate calculation are monitored systematically.',
    },
    {
      para: 'Para 6.1',
      title: isHindi ? 'मेज़रमेंट बुक (MB) रिकॉर्डिंग और फंड किश्तें' : 'Measurement Book (MB) Recording & Fund Tranches',
      category: isHindi ? 'निरीक्षण एवं रिलीज़ प्रोटोकॉल' : 'Inspection & Release Protocol',
      text: isHindi ? 'सत्यापित भौतिक मील के पत्थरों से जुड़ी किश्तों में धन जारी किया जाएगा। अंतिम किश्त जारी करना आधिकारिक माप पुस्तिका (एमबी) में प्रविष्टि, समापन प्रमाण पत्र और औपचारिक संपत्ति उपयोग प्रमाण पत्र (यूसी) पर निर्भर है।' : 'Funds shall be released in tranches linked to verified physical milestones. Release of the final installment is contingent on entry in the official Measurement Book (MB), a Completion Certificate, and a formal Asset Utilization Certificate (UC).',
      implication: isHindi ? 'सभी किश्त दावों का मिलान भौतिक मील के पत्थर के साक्ष्यों और जियो-टैग की गई साइट इमेजरी से किया जाना चाहिए।' : 'All tranche claims must be matched against physical milestone evidence and geo-tagged site imagery.',
    },
    {
      para: 'Para 2.8',
      title: isHindi ? 'मूल प्रणाली नियंत्रण: एआई प्राथमिकता स्कोरिंग के लिए एक इंटेलिजेंस लेयर है' : 'Core System Guardrail: AI is an Intelligence Layer for Priority Scoring',
      category: isHindi ? 'सिस्टम ऑपरेटिंग गार्डरेल' : 'System Operating Guardrail',
      text: isHindi ? 'जोखिम स्कोर और विसंगति का पता लगाने वाले एल्गोरिदम जाँच प्राथमिकताओं को उजागर करते हैं। स्वचालित मॉडल साक्ष्य खोज में मानव सतर्कता अधिकारियों की सहायता करते हैं; प्रशासनिक या कानूनी कार्रवाई से पहले सभी निष्कर्षों को नामित सरकारी अन्वेषकों द्वारा भौतिक रूप से सत्यापित किया जाना चाहिए।' : 'Risk scores and anomaly detection algorithms highlight investigation priorities. Automated models assist human vigilance officers in evidence discovery; all findings must be physically verified by designated government investigators before administrative or legal actions.',
      implication: isHindi ? 'ऑन-ग्राउंड मानव सत्यापन के बिना कोई भी एआई सिस्टम घटक प्रशासनिक आदेश जारी नहीं करेगा।' : 'No AI system component shall issue administrative orders without on-ground human verification.',
    },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="floating-slab p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#285C7A]" />
            <h1 className="text-lg font-black text-[#182027] tracking-wider uppercase">
              {isHindi ? 'डिजिटल संग्रह • एमओएसपीआई योजना दिशानिर्देश' : 'DIGITAL ARCHIVE • MoSPI SCHEME GUIDELINES & NORMS'}
            </h1>
          </div>
          <p className="text-xs text-[#667078] font-sans mt-1">
            {isHindi ? 'सांसद स्थानीय क्षेत्र विकास योजना को नियंत्रित करने वाले आधिकारिक वैधानिक नियम और अनुपालन मानदंड।' : 'Official statutory rules and compliance benchmarks governing Member of Parliament Local Area Development Scheme.'}
          </p>
        </div>

        <span className="bg-[#FAFAF7] text-[#285C7A] text-xs font-mono font-bold px-4 py-2 rounded-full border border-[#E4E7E1]">
          {isHindi ? 'एमओएसपीआई दिशानिर्देश 2023 संस्करण' : 'MoSPI GUIDELINES 2023 EDITION'}
        </span>
      </div>

      {/* Indexed Document Panels Stack */}
      <div className="space-y-5">
        {guidelines.map((g, idx) => (
          <div
            key={idx}
            className="floating-slab p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E4E7E1] pb-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#285C7A]/10 text-[#285C7A] font-mono text-xs font-extrabold px-3 py-1 rounded-full border border-[#285C7A]/20">
                  {g.para}
                </span>
                <h3 className="font-bold text-[#182027] text-base font-sans">{g.title}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#667078] bg-[#FAFAF7] px-3 py-1 rounded-full border border-[#E4E7E1] font-bold uppercase">
                {g.category}
              </span>
            </div>

            <div className="recessed-light-display p-4 text-xs text-[#182027] font-sans leading-relaxed">
              &ldquo;{g.text}&rdquo;
            </div>

            <div className="flex items-center gap-2 text-xs text-[#182027] font-mono pt-1">
              <Scale className="w-4 h-4 text-[#C88A25] shrink-0" />
              <span>
                <strong className="text-[#C88A25]">{isHindi ? 'सिस्टम विश्लेषणात्मक मैपिंग:' : 'SYSTEM ANALYTICAL MAPPING:'}</strong> <span className="font-sans text-[#667078]">{g.implication}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

