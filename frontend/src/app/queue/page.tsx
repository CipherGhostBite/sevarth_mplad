'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ProjectSummary } from '@/lib/api';
import { formatCurrency, getInvestigationStatusBadge } from '@/lib/utils';
import RiskBadge from '@/components/RiskBadge';
import {
  ShieldAlert,
  Search,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function InvestigationQueuePage() {
  const router = useRouter();
  const { lang, t, isHindi } = useLanguage();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  const handleOpenDossier = (e: React.MouseEvent, projectId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!projectId) return;
    router.push(`/projects/${encodeURIComponent(projectId)}`);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [workTypeFilter, setWorkTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('priority_score');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      let min_p: number | undefined = undefined;
      let max_p: number | undefined = undefined;

      if (priorityFilter === 'HIGH') min_p = 75;
      else if (priorityFilter === 'MEDIUM') {
        min_p = 45;
        max_p = 74.9;
      } else if (priorityFilter === 'LOW') {
        max_p = 44.9;
      }

      const data = await api.getProjects({
        search: search.trim() || undefined,
        work_type: workTypeFilter !== 'ALL' ? workTypeFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        min_priority: min_p,
        max_priority: max_p,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch investigation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const handleConstituencyChange = () => {
      fetchProjects();
    };
    window.addEventListener('constituency-changed', handleConstituencyChange);
    return () => {
      window.removeEventListener('constituency-changed', handleConstituencyChange);
    };
  }, [priorityFilter, workTypeFilter, statusFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="floating-slab p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#C88A25]" />
            <h1 className="text-lg font-black text-[#182027] tracking-wider uppercase">
              {t('queue.title', 'Priority Investigation Queue')}
            </h1>
          </div>
          <p className="text-xs text-[#667078] font-sans mt-1">
            {t('queue.subtitle', 'Prioritized evidence records dynamically ranked from 0–100 based on multi-dimensional anomaly signals.')}
          </p>
        </div>

        <button
          onClick={fetchProjects}
          className="tactile-light-switch px-4 py-2 rounded-full text-xs font-mono font-bold text-[#182027] flex items-center gap-2"
          title="Refresh Queue"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isHindi ? 'कतार रीफ़्रेश करें' : 'REFRESH QUEUE'}</span>
        </button>
      </div>

      {/* Filter Console */}
      <div className="floating-slab p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#285C7A] font-bold uppercase tracking-wider pb-3 border-b border-[#E4E7E1]">
          <SlidersHorizontal className="w-4 h-4" />
          <span>{isHindi ? 'स्थानिक फ़िल्टर एवं सॉर्ट कंसोल' : 'SPATIAL FILTER & SORT CONSOLE'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#285C7A] absolute left-3.5 top-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('queue.search_placeholder', 'Search ID, project name, agency...')}
              className="w-full bg-gradient-to-b from-[#FAFBF8] to-[#EEF2EA] border-2 border-[#B8C2B3] rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#182027] focus:ring-4 focus:ring-[#285C7A]/25 focus:border-[#285C7A] focus:outline-none font-mono placeholder-[#78828A] shadow-[inset_0_3px_6px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 p-1 rounded-lg bg-[#E2E7DC] hover:bg-[#D4DBD0] text-[#4A525A] transition shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-4 py-2.5 text-xs font-bold text-[#182027] focus:ring-2 focus:ring-[#285C7A] focus:outline-hidden"
          >
            <option value="ALL">{isHindi ? 'सभी जोखिम श्रेणियां' : 'All Priority Tiers'}</option>
            <option value="HIGH">{isHindi ? 'उच्च जोखिम (≥75)' : 'High Risk Tier (≥75)'}</option>
            <option value="MEDIUM">{isHindi ? 'मध्यम जोखिम (45-74)' : 'Medium Risk Tier (45-74)'}</option>
            <option value="LOW">{isHindi ? 'कम जोखिम (<45)' : 'Low Risk Tier (<45)'}</option>
          </select>

          {/* Work Type Filter */}
          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-4 py-2.5 text-xs font-bold text-[#182027] focus:ring-2 focus:ring-[#285C7A] focus:outline-hidden"
          >
            <option value="ALL">{isHindi ? 'सभी कार्य श्रेणियां' : 'All Work Categories'}</option>
            <option value="PCC Road & Drainage">{isHindi ? 'पीसीसी सड़क और जल निकासी' : 'PCC Road & Drainage'}</option>
            <option value="Community Hall / Center">{isHindi ? 'सामुदायिक भवन / केंद्र' : 'Community Hall / Center'}</option>
            <option value="Solar Street Lights Installation">{isHindi ? 'सोलर स्ट्रीट लाइट' : 'Solar Street Lights'}</option>
            <option value="High School Science Lab & Classrooms">{isHindi ? 'स्कूल कक्षाएं / प्रयोगशालाएं' : 'School Classrooms / Labs'}</option>
            <option value="Drinking Water & RO Plant">{isHindi ? 'पेयजल और आरओ' : 'Drinking Water & RO'}</option>
            <option value="Primary Health Center Upgrade">{isHindi ? 'प्राथमिक स्वास्थ्य केंद्र उन्नयन' : 'Health Center Upgrade'}</option>
            <option value="Rural Culvert & Small Bridge">{isHindi ? 'पुलिया और छोटे पुल' : 'Culverts & Bridges'}</option>
            <option value="Anganwadi Center Building">{isHindi ? 'आंगनवाड़ी केंद्र भवन' : 'Anganwadi Buildings'}</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('_');
              setSortBy(sb);
              setSortOrder(so);
            }}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-4 py-2.5 text-xs font-bold text-[#182027] focus:ring-2 focus:ring-[#285C7A] focus:outline-hidden"
          >
            <option value="priority_score_desc">{isHindi ? 'प्राथमिकता स्कोर: उच्च से निम्न' : 'Priority Score: High to Low'}</option>
            <option value="priority_score_asc">{isHindi ? 'प्राथमिकता स्कोर: निम्न से उच्च' : 'Priority Score: Low to High'}</option>
            <option value="sanctioned_amount_desc">{isHindi ? 'लागत: उच्चतम पहले' : 'Cost: Highest First'}</option>
            <option value="sanctioned_amount_asc">{isHindi ? 'लागत: न्यूनतम पहले' : 'Cost: Lowest First'}</option>
            <option value="sanction_date_desc">{isHindi ? 'स्वीकृति: नवीनतम पहले' : 'Sanction: Newest First'}</option>
          </select>
        </div>
      </div>

      {/* SPATIAL EVIDENCE RECORDS LIST (NO DENSE RECTANGULAR TABLE WALL!) */}
      {loading ? (
        <div className="p-16 text-center text-xs text-[#667078]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#285C7A] mb-3" />
          <span>{isHindi ? 'स्थानिक साक्ष्य रिकॉर्ड प्राप्त किए जा रहे हैं...' : 'FETCHING SPATIAL EVIDENCE RECORDS...'}</span>
        </div>
      ) : error ? (
        <div className="floating-slab bg-[#C45145]/10 border border-[#C45145]/30 p-6 text-center text-xs text-[#C45145] font-bold">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="floating-slab p-16 text-center text-xs text-[#667078]">
          {isHindi ? 'चयनित फ़िल्टर से कोई जाँच रिकॉर्ड मेल नहीं खाता।' : 'NO INVESTIGATION RECORDS MATCHED THE SELECTED FILTERS.'}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => {
            const invBadge = getInvestigationStatusBadge(proj.investigation_status);
            const isGolden = proj.project_id === 'MPLAD-NAL-2023-042';
            return (
              <div
                key={proj.project_id}
                className={`floating-slab floating-slab-interactive p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isGolden ? 'border-l-4 border-[#C88A25]' : ''
                }`}
              >
                {/* Left Number Callout + Project Identity */}
                <div className="flex items-start gap-4 min-w-0">
                  <span className="editorial-number text-3xl text-[#9AA3AB] w-10 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/projects/${proj.project_id}`}
                        className="font-mono font-extrabold text-sm text-[#285C7A] hover:underline"
                      >
                        {proj.project_id}
                      </Link>
                      <span className="text-[10px] font-mono text-[#667078] bg-[#ECEFEA] px-2.5 py-0.5 rounded-full font-bold border border-[#E4E7E1]">
                        {proj.work_type}
                      </span>
                      {isGolden && (
                        <span className="bg-[#C88A25] text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-full">
                          {isHindi ? 'गंभीर चिंता' : 'CRITICAL CONCERN'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#182027] font-sans leading-snug">
                      {proj.project_name}
                    </h3>
                    <div className="text-xs text-[#667078] font-sans">
                      {isHindi ? 'एजेंसी:' : 'Agency:'} <span className="text-[#182027] font-semibold">{proj.agency_name}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Risk Score + Cost + Action */}
                <div className="flex items-center gap-6 shrink-0 self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-lg font-mono font-extrabold text-[#182027] block">
                      {formatCurrency(proj.sanctioned_amount)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${invBadge.bg}`}>
                      {invBadge.text}
                    </span>
                  </div>

                  <RiskBadge score={proj.priority_score} isAnomaly={proj.is_anomaly} size="sm" />

                  <Link
                    href={`/projects/${proj.project_id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (proj.project_id) {
                        window.location.href = `/projects/${proj.project_id}`;
                      }
                    }}
                    className="tactile-light-switch px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold text-[#182027] hover:text-[#285C7A] hover:border-[#285C7A] transition inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 select-none relative z-10"
                  >
                    <span>{isHindi ? 'डोजियर' : 'DOSSIER'}</span>
                    <ArrowRight className="w-4 h-4 text-[#285C7A]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

