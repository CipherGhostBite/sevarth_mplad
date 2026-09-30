'use client';

import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Filter, 
  Search, 
  ArrowRight,
  ShieldAlert,
  Calendar,
  DollarSign,
  Maximize2,
  Share2
} from 'lucide-react';
import LeafletMap from '@/components/LeafletMap';
import { formatCurrency } from '@/lib/utils';

interface CoordinationProjectNode {
  id: string;
  name: string;
  level: 'CURRENT' | 'DISTRICT' | 'STATE' | 'AGENCY';
  department: string;
  location: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PROPOSED';
  category: string;
  latitude: number;
  longitude: number;
  budget: number;
  startDate: string;
  endDate: string;
  distanceKm: number;
  relationshipStatus: 'POTENTIAL OVERLAP' | 'COORDINATION REQUIRED' | 'NO CONFLICT' | 'NEARBY' | 'RELATED SCOPE' | 'SHARED INFRASTRUCTURE';
  conflictRationale?: string;
  recommendedAction?: string;
}

const SAMPLE_COORDINATION_DATA: CoordinationProjectNode[] = [
  {
    id: 'MPLAD-NAL-2023-042',
    name: 'Construction of PCC Road and Covered Drain from Main Road to High School',
    level: 'CURRENT',
    department: 'Rural Works Department (RWD), Bihar Sharif',
    location: 'Ward 12, Bihar Sharif, Nalanda',
    status: 'ACTIVE',
    category: 'Road & Drainage',
    latitude: 25.1982,
    longitude: 85.5149,
    budget: 18400000,
    startDate: '2026-10-01',
    endDate: '2027-12-31',
    distanceKm: 0.0,
    relationshipStatus: 'COORDINATION REQUIRED',
    conflictRationale: 'Primary Subject Project under investigation.',
    recommendedAction: 'Coordinate utility excavation prior to asphalt resurfacing.'
  },
  {
    id: 'PRJ-DST-NAL-2026-008',
    name: 'Nalanda District Bulk Water Supply Pipeline Phase-II Excavation',
    level: 'DISTRICT',
    department: 'BUIDCO / District Water Board Nalanda',
    location: 'Main Arterial Road, Bihar Sharif',
    status: 'ACTIVE',
    category: 'Water Supply',
    latitude: 25.1970,
    longitude: 85.5150,
    budget: 240000000,
    startDate: '2026-08-15',
    endDate: '2027-08-14',
    distanceKm: 0.2,
    relationshipStatus: 'COORDINATION REQUIRED',
    conflictRationale: 'Underground pipeline trenching directly intersects the proposed PCC road corridor during Q1 2027.',
    recommendedAction: 'Complete subterranean pipeline excavation and trench backfilling before PWD initiates road compaction.'
  },
  {
    id: 'PRJ-DST-NAL-2026-014',
    name: 'District Community Health Center Upgrade & Solar Roof Backup',
    level: 'DISTRICT',
    department: 'District Health Society, Nalanda',
    location: 'Hospital Campus Road, Bihar Sharif',
    status: 'PROPOSED',
    category: 'Healthcare',
    latitude: 25.2010,
    longitude: 85.5190,
    budget: 85000000,
    startDate: '2026-11-01',
    endDate: '2027-09-30',
    distanceKm: 0.6,
    relationshipStatus: 'NEARBY',
    conflictRationale: 'Geographically proximate within 0.6 km but independent site boundary.',
    recommendedAction: 'No excavation conflict; align municipal power feeder connections.'
  },
  {
    id: 'PRJ-ST-BHR-2026-102',
    name: 'State Highway SH-78 Arterial Strengthening & Shoulder Drainage Upgrade',
    level: 'STATE',
    department: 'Public Works Department (PWD), Govt of Bihar',
    location: 'Bihar Sharif Township Bypass',
    status: 'ACTIVE',
    category: 'Road Corridor',
    latitude: 25.1950,
    longitude: 85.5180,
    budget: 450000000,
    startDate: '2026-06-01',
    endDate: '2028-05-31',
    distanceKm: 0.8,
    relationshipStatus: 'POTENTIAL OVERLAP',
    conflictRationale: 'Concurrently active construction timeline along the main feeder junction.',
    recommendedAction: 'Stagger heavy equipment movement to avoid regional traffic gridlock.'
  },
  {
    id: 'PRJ-ST-BHR-2026-205',
    name: 'State Model Skill Development Institute Construction',
    level: 'STATE',
    department: 'Department of Labour Resources, Govt of Bihar',
    location: 'Industrial Estate Sector 3, Bihar Sharif',
    status: 'COMPLETED',
    category: 'Education',
    latitude: 25.2100,
    longitude: 85.5300,
    budget: 120000000,
    startDate: '2025-01-01',
    endDate: '2026-02-28',
    distanceKm: 2.1,
    relationshipStatus: 'NO CONFLICT',
    conflictRationale: 'Completed work; no physical or timeline concurrency.',
    recommendedAction: 'No administrative action required.'
  },
  {
    id: 'AGY-BUIDCO-BHR',
    name: 'Bihar Urban Infrastructure Development Corp (BUIDCO Execution Wing)',
    level: 'AGENCY',
    department: 'State Nodal Executing Agency',
    location: 'Regional HQ Bihar Sharif',
    status: 'ACTIVE',
    category: 'Executing Body',
    latitude: 25.1960,
    longitude: 85.5130,
    budget: 690000000,
    startDate: '2026-01-01',
    endDate: '2028-12-31',
    distanceKm: 0.3,
    relationshipStatus: 'SHARED INFRASTRUCTURE',
    conflictRationale: 'Executing agency manages multiple subterranean water & drainage contracts in Ward 12.',
    recommendedAction: 'Hold joint weekly coordination briefing with District Nodal Nodal Officer.'
  },
  {
    id: 'AGY-PWD-NAL',
    name: 'Public Works Department (PWD Division II Nalanda)',
    level: 'AGENCY',
    department: 'State Infrastructure Wing',
    location: 'Civil Lines, Bihar Sharif',
    status: 'ACTIVE',
    category: 'Executing Body',
    latitude: 25.1990,
    longitude: 85.5160,
    budget: 1250000000,
    startDate: '2026-01-01',
    endDate: '2028-12-31',
    distanceKm: 0.4,
    relationshipStatus: 'RELATED SCOPE',
    conflictRationale: 'Maintains right-of-way jurisdiction over connecting arterial roads.',
    recommendedAction: 'Obtain mandatory PWD NOC before starting municipal road cut operations.'
  }
];

import { useLanguage } from '@/lib/LanguageContext';

interface Props {
  currentProjectId?: string;
}

export default function CrossGovtCoordinationTab({ currentProjectId = 'MPLAD-NAL-2023-042' }: Props) {
  const { isHindi, t } = useLanguage();
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [conflictFilter, setConflictFilter] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<CoordinationProjectNode | null>(SAMPLE_COORDINATION_DATA[1]);
  const [activeViewMode, setActiveViewMode] = useState<'NETWORK' | 'MAP' | 'TIMELINE'>('NETWORK');

  // Filter Data
  const filteredNodes = SAMPLE_COORDINATION_DATA.filter((item) => {
    if (levelFilter !== 'ALL' && item.level !== levelFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (conflictFilter !== 'ALL' && item.relationshipStatus !== conflictFilter) return false;
    return true;
  });

  // Summary Metrics
  const totalRelated = SAMPLE_COORDINATION_DATA.length - 1;
  const potentialOverlaps = SAMPLE_COORDINATION_DATA.filter(i => i.relationshipStatus === 'POTENTIAL OVERLAP').length;
  const coordinationRequired = SAMPLE_COORDINATION_DATA.filter(i => i.relationshipStatus === 'COORDINATION REQUIRED').length;
  const noConflict = SAMPLE_COORDINATION_DATA.filter(i => i.relationshipStatus === 'NO CONFLICT').length;

  const getRelationshipBadgeStyle = (status: string) => {
    switch (status) {
      case 'COORDINATION REQUIRED':
        return 'bg-[#C45145]/10 text-[#C45145] border-[#C45145]/30 font-bold';
      case 'POTENTIAL OVERLAP':
        return 'bg-[#C88A25]/10 text-[#C88A25] border-[#C88A25]/30 font-bold';
      case 'NO CONFLICT':
        return 'bg-[#398265]/10 text-[#398265] border-[#398265]/30 font-bold';
      case 'NEARBY':
        return 'bg-[#285C7A]/10 text-[#285C7A] border-[#285C7A]/30 font-bold';
      case 'SHARED INFRASTRUCTURE':
        return 'bg-purple-100 text-purple-800 border-purple-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'CURRENT':
        return 'bg-[#285C7A] text-white font-black';
      case 'DISTRICT':
        return 'bg-[#C88A25]/15 text-[#C88A25] border-[#C88A25]/30 font-bold';
      case 'STATE':
        return 'bg-[#285C7A]/15 text-[#285C7A] border-[#285C7A]/30 font-bold';
      case 'AGENCY':
        return 'bg-purple-100 text-purple-900 border-purple-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-bold';
    }
  };

  // Convert nodes for Map component
  const mapMarkers = SAMPLE_COORDINATION_DATA.map(node => ({
    project_id: node.id,
    project_name: node.name,
    work_type: node.category,
    status: node.status,
    agency_name: node.department,
    sanctioned_amount: node.budget / 100000, // Lakhs
    latitude: node.latitude,
    longitude: node.longitude,
    priority_score: node.relationshipStatus === 'COORDINATION REQUIRED' ? 92 : (node.relationshipStatus === 'POTENTIAL OVERLAP' ? 68 : 35),
    is_anomaly: node.relationshipStatus === 'COORDINATION REQUIRED'
  }));

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. HEADER SECTION (Clean MPLAD-GUARD Institutional Header) */}
      <div className="floating-slab p-6 border-l-4 border-[#285C7A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#285C7A]/10 text-[#285C7A] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {isHindi ? 'अंतर-विभागीय बुद्धिमत्ता' : 'INTER-DEPARTMENTAL INTELLIGENCE'}
            </span>
            <span className="text-xs font-mono text-[#667078]">&bull; {isHindi ? 'एमपीलैड्स बनाम बहु-स्तरीय परियोजनाएं' : 'MPLAD vs MULTI-LEVEL PROJECTS'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#182027] font-mono tracking-tight flex items-center gap-2.5">
            <Network className="w-5 h-5 text-[#285C7A]" />
            <span>{t('coordination.title', 'Cross-Govt Coordination')}</span>
          </h2>
          <p className="text-xs text-[#667078] font-sans">
            {t('coordination.subtitle', 'Multi-agency collusion tracking, joint site inspections, and cross-constituency audit escalation.')}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-[#ECEFEA] p-1 rounded-xl border border-[#E4E7E1] font-mono text-xs">
          <button
            onClick={() => setActiveViewMode('NETWORK')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeViewMode === 'NETWORK'
                ? 'tactile-light-switch-active text-white shadow-xs'
                : 'text-[#667078] hover:text-[#182027]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'नेटवर्क ट्री' : 'NETWORK TREE'}</span>
          </button>
          <button
            onClick={() => setActiveViewMode('MAP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeViewMode === 'MAP'
                ? 'tactile-light-switch-active text-white shadow-xs'
                : 'text-[#667078] hover:text-[#182027]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('nav.map', 'GIS MAP').toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (4 Sleek Physical Slabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="floating-slab p-4 space-y-1.5 border-t-2 border-t-[#285C7A]">
          <span className="text-[10px] font-mono font-bold text-[#667078] uppercase tracking-wider">
            RELATED PROJECTS
          </span>
          <div className="editorial-number text-3xl font-black text-[#182027]">{totalRelated}</div>
          <span className="text-[10px] text-[#667078] font-sans block truncate">District &amp; State Level Works</span>
        </div>

        <div className="floating-slab p-4 space-y-1.5 border-t-2 border-t-[#C88A25]">
          <span className="text-[10px] font-mono font-bold text-[#C88A25] uppercase tracking-wider">
            POTENTIAL OVERLAPS
          </span>
          <div className="editorial-number text-3xl font-black text-[#C88A25]">{potentialOverlaps}</div>
          <span className="text-[10px] text-[#667078] font-sans block truncate">Shared Corridor Concurrency</span>
        </div>

        <div className="floating-slab p-4 space-y-1.5 border-t-2 border-t-[#C45145]">
          <span className="text-[10px] font-mono font-bold text-[#C45145] uppercase tracking-wider">
            COORDINATION REQUIRED
          </span>
          <div className="editorial-number text-3xl font-black text-[#C45145]">{coordinationRequired}</div>
          <span className="text-[10px] text-[#667078] font-sans block truncate">Mandatory Excavation Sequence</span>
        </div>

        <div className="floating-slab p-4 space-y-1.5 border-t-2 border-t-[#398265]">
          <span className="text-[10px] font-mono font-bold text-[#398265] uppercase tracking-wider">
            NO CONFLICT DETECTED
          </span>
          <div className="editorial-number text-3xl font-black text-[#398265]">{noConflict}</div>
          <span className="text-[10px] text-[#667078] font-sans block truncate">Verified Independent Sites</span>
        </div>
      </div>

      {/* 3. INTERACTIVE FILTERS BAR */}
      <div className="floating-slab p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#285C7A] font-bold">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTERS:</span>
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-3 py-1.5 font-bold text-[#182027] focus:outline-hidden"
          >
            <option value="ALL">All Levels</option>
            <option value="DISTRICT">District Projects</option>
            <option value="STATE">State Projects</option>
            <option value="AGENCY">Government Agencies</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-3 py-1.5 font-bold text-[#182027] focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Works</option>
            <option value="PROPOSED">Proposed Works</option>
            <option value="COMPLETED">Completed Works</option>
          </select>

          {/* Conflict Filter */}
          <select
            value={conflictFilter}
            onChange={(e) => setConflictFilter(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-3 py-1.5 font-bold text-[#182027] focus:outline-hidden"
          >
            <option value="ALL">All Relationships</option>
            <option value="COORDINATION REQUIRED">Coordination Required</option>
            <option value="POTENTIAL OVERLAP">Potential Overlap</option>
            <option value="NO CONFLICT">No Conflict</option>
            <option value="NEARBY">Nearby</option>
          </select>
        </div>

        <span className="text-[11px] text-[#667078]">
          Showing <strong>{filteredNodes.length}</strong> of <strong>{SAMPLE_COORDINATION_DATA.length}</strong> project entities
        </span>
      </div>

      {/* 4. MAIN WORKSPACE VIEW (NETWORK HIERARCHY OR GIS MAP) */}
      {activeViewMode === 'NETWORK' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* HIERARCHICAL PROJECT RELATIONSHIP TREE (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CURRENT MPLAD PROJECT (PRIMARY CENTER OBJECT) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#285C7A] uppercase tracking-wider block">
                1. PRIMARY MPLAD SUBJECT PROJECT
              </span>
              {SAMPLE_COORDINATION_DATA.filter(n => n.level === 'CURRENT').map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => setSelectedNode(proj)}
                  className={`floating-slab p-5 border-2 transition-all cursor-pointer ${
                    selectedNode?.id === proj.id
                      ? 'border-[#285C7A] bg-white shadow-lg translate-y-[-2px]'
                      : 'border-[#285C7A]/40 bg-[#FAFBF8] hover:border-[#285C7A]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full ${getLevelBadgeStyle(proj.level)}`}>
                          CURRENT MPLAD PROJECT
                        </span>
                        <span className="font-mono text-xs font-bold text-[#285C7A]">{proj.id}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#182027] font-sans">
                        {proj.name}
                      </h3>
                      <div className="text-xs text-[#667078] font-sans">
                        Department: <strong className="text-[#182027]">{proj.department}</strong> &bull; Location: <strong className="text-[#182027]">{proj.location}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 font-mono text-xs">
                      <span className="font-extrabold text-[#398265]">{formatCurrency(proj.budget / 100000)}</span>
                      <span className="text-[10px] text-[#667078]">{proj.startDate.slice(0, 7)} &rarr; {proj.endDate.slice(0, 7)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CONNECTING DIRECTIONAL ARROW */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center text-[#285C7A]">
                <div className="w-0.5 h-6 bg-gradient-to-b from-[#285C7A] to-[#C88A25]" />
                <span className="text-[10px] font-mono font-bold bg-[#ECEFEA] px-3 py-1 rounded-full border border-[#E4E7E1] my-1 text-[#667078]">
                  INTER-GOVERNMENT RELATIONSHIPS &amp; PROXIMITY
                </span>
                <div className="w-0.5 h-6 bg-gradient-to-b from-[#C88A25] to-[#285C7A]" />
              </div>
            </div>

            {/* DISTRICT PROJECTS LEVEL */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#C88A25] uppercase tracking-wider block">
                2. DISTRICT-LEVEL GOVERNMENT PROJECTS
              </span>
              <div className="space-y-3">
                {filteredNodes.filter(n => n.level === 'DISTRICT').map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedNode(proj)}
                    className={`floating-slab p-4 border transition-all cursor-pointer ${
                      selectedNode?.id === proj.id
                        ? 'border-[#C88A25] bg-white shadow-md translate-x-1'
                        : 'border-[#E4E7E1] bg-white hover:border-[#C88A25]/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${getLevelBadgeStyle(proj.level)}`}>
                            DISTRICT LEVEL
                          </span>
                          <span className="font-mono text-xs font-bold text-[#285C7A]">{proj.id}</span>
                          <span className="text-[10px] text-[#667078] font-mono">({proj.distanceKm} km away)</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#182027] font-sans truncate max-w-lg">
                          {proj.name}
                        </h4>
                        <div className="text-[11px] text-[#667078] font-sans">
                          {proj.department} &bull; {proj.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getRelationshipBadgeStyle(proj.relationshipStatus)}`}>
                          {proj.relationshipStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STATE PROJECTS LEVEL */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono font-bold text-[#285C7A] uppercase tracking-wider block">
                3. STATE-LEVEL GOVERNMENT PROJECTS
              </span>
              <div className="space-y-3">
                {filteredNodes.filter(n => n.level === 'STATE').map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedNode(proj)}
                    className={`floating-slab p-4 border transition-all cursor-pointer ${
                      selectedNode?.id === proj.id
                        ? 'border-[#285C7A] bg-white shadow-md translate-x-1'
                        : 'border-[#E4E7E1] bg-white hover:border-[#285C7A]/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${getLevelBadgeStyle(proj.level)}`}>
                            STATE LEVEL
                          </span>
                          <span className="font-mono text-xs font-bold text-[#285C7A]">{proj.id}</span>
                          <span className="text-[10px] text-[#667078] font-mono">({proj.distanceKm} km away)</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#182027] font-sans truncate max-w-lg">
                          {proj.name}
                        </h4>
                        <div className="text-[11px] text-[#667078] font-sans">
                          {proj.department} &bull; {proj.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getRelationshipBadgeStyle(proj.relationshipStatus)}`}>
                          {proj.relationshipStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GOVERNMENT AGENCIES LEVEL */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider block">
                4. RELEVANT EXECUTING GOVERNMENT AGENCIES
              </span>
              <div className="space-y-3">
                {filteredNodes.filter(n => n.level === 'AGENCY').map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedNode(proj)}
                    className={`floating-slab p-4 border transition-all cursor-pointer ${
                      selectedNode?.id === proj.id
                        ? 'border-purple-600 bg-white shadow-md translate-x-1'
                        : 'border-[#E4E7E1] bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${getLevelBadgeStyle(proj.level)}`}>
                            GOVT AGENCY
                          </span>
                          <span className="font-mono text-xs font-bold text-purple-900">{proj.id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#182027] font-sans truncate max-w-lg">
                          {proj.name}
                        </h4>
                        <div className="text-[11px] text-[#667078] font-sans">
                          {proj.department} &bull; Location: {proj.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getRelationshipBadgeStyle(proj.relationshipStatus)}`}>
                          {proj.relationshipStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* NODE & RELATIONSHIP DETAIL INSPECTOR (4 COLS - RECESSED LIGHT DISPLAY) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            {selectedNode ? (
              <div className="floating-slab p-6 space-y-4 border-2 border-[#285C7A]/30">
                <div className="flex items-center justify-between border-b border-[#E4E7E1] pb-3">
                  <span className="text-[10px] font-mono font-bold text-[#285C7A] uppercase tracking-wider">
                    ENTITY INSPECTOR
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${getLevelBadgeStyle(selectedNode.level)}`}>
                    {selectedNode.level}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-xs font-extrabold text-[#285C7A] block">{selectedNode.id}</span>
                  <h3 className="text-sm font-bold text-[#182027] font-sans leading-snug">
                    {selectedNode.name}
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-sans pt-2 border-t border-[#E4E7E1]">
                  <div className="flex justify-between py-1 border-b border-[#F5F6F3]">
                    <span className="text-[#667078]">Department:</span>
                    <span className="font-semibold text-[#182027] text-right truncate max-w-[180px]">{selectedNode.department}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F6F3]">
                    <span className="text-[#667078]">Category:</span>
                    <span className="font-mono text-[#182027]">{selectedNode.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F6F3]">
                    <span className="text-[#667078]">Status:</span>
                    <span className="font-mono font-bold text-[#398265]">{selectedNode.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F6F3]">
                    <span className="text-[#667078]">Budget:</span>
                    <span className="font-mono font-bold text-[#182027]">{formatCurrency(selectedNode.budget / 100000)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F6F3]">
                    <span className="text-[#667078]">Proximity Distance:</span>
                    <span className="font-mono font-bold text-[#285C7A]">{selectedNode.distanceKm} km</span>
                  </div>
                </div>

                {/* Relationship Status & Recommendation */}
                <div className="recessed-light-display p-4 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#667078] font-bold uppercase">COORDINATION RATIONALE</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getRelationshipBadgeStyle(selectedNode.relationshipStatus)}`}>
                      {selectedNode.relationshipStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#182027] font-sans leading-relaxed">
                    {selectedNode.conflictRationale}
                  </p>
                  {selectedNode.recommendedAction && (
                    <div className="pt-2 border-t border-[#E4E7E1] space-y-1">
                      <span className="text-[10px] text-[#285C7A] font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#398265]" />
                        <span>RECOMMENDED PROTOCOL</span>
                      </span>
                      <p className="text-[11px] text-[#667078] font-sans leading-relaxed">
                        {selectedNode.recommendedAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="floating-slab p-6 text-center text-xs text-[#667078] font-mono">
                Click any project entity or relationship node to inspect inter-departmental details.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* GIS MAP VIEW */
        <div className="space-y-4">
          <div className="floating-slab p-4 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-[#285C7A] font-bold">
              <MapPin className="w-4 h-4" />
              <span>SPATIAL MAP &bull; MULTI-LEVEL PROJECT PROXIMITY CLUSTER</span>
            </div>
            <span className="text-[11px] text-[#667078]">showing 0.5 km radius proximity circle</span>
          </div>

          <LeafletMap
            markers={mapMarkers}
            selectedProjectId={currentProjectId}
            center={[25.1982, 85.5149]}
            zoom={14}
            height="550px"
            showProximityCircle={true}
            proximityRadiusKm={0.5}
          />
        </div>
      )}

    </div>
  );
}
