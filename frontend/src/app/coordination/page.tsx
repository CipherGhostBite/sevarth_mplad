'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  api,
  CoordinationOverview,
  CoordinationProjectItem,
  CoordinationMatrixItem,
  CoordinationDossier
} from '@/lib/api';
import Coordination3DCanvas from '@/components/coordination/Coordination3DCanvas';
import CoordinationRiskGauge from '@/components/coordination/CoordinationRiskGauge';
import SpatialTimeline3D from '@/components/coordination/SpatialTimeline3D';
import NetworkGraph3D from '@/components/coordination/NetworkGraph3D';
import AiIntelligencePanel from '@/components/coordination/AiIntelligencePanel';
import CoordinationMatrixTable from '@/components/coordination/CoordinationMatrixTable';
import {
  Layers,
  Network,
  Calendar,
  Table,
  Sparkles,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ShieldAlert,
  Building2,
  DollarSign,
  Activity,
  ArrowRight,
  Filter,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function CoordinationPage() {
  const [overview, setOverview] = useState<CoordinationOverview | null>(null);
  const [projects, setProjects] = useState<CoordinationProjectItem[]>([]);
  const [matrix, setMatrix] = useState<CoordinationMatrixItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-GOV-STATE-01');
  const [dossier, setDossier] = useState<CoordinationDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active View Tab: '3D_GIS' | 'RELATIONSHIPS' | 'TIMELINE' | 'MATRIX'
  const [activeTab, setActiveTab] = useState<'3D_GIS' | 'RELATIONSHIPS' | 'TIMELINE' | 'MATRIX'>('3D_GIS');

  // Filters
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [overviewRes, projectsRes, matrixRes, dossierRes] = await Promise.all([
          api.getCoordinationOverview(),
          api.getCoordinationProjects(),
          api.getCoordinationMatrix(),
          api.getCoordinationDossier(selectedProjectId)
        ]);

        setOverview(overviewRes);
        setProjects(projectsRes);
        setMatrix(matrixRes);
        setDossier(dossierRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load multi-level project coordination data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedProjectId]);

  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    try {
      const dossierRes = await api.getCoordinationDossier(id);
      setDossier(dossierRes);
    } catch (e) {}
  };

  const filteredProjects = projects.filter(
    (p) => selectedLevel === 'ALL' || p.level.toUpperCase() === selectedLevel.toUpperCase()
  );

  if (loading && !overview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4 font-mono">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">INITIALIZING 3D GOVERNMENT INTELLIGENCE COMMAND CENTER...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 18. COMMAND-CENTER HEADER */}
      <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/40">
                NATIONAL INFRASTRUCTURE COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400">&bull; NALANDA CONSTITUENCY ECOSYSTEM</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              PROJECT ECOSYSTEM INTELLIGENCE
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Cross-Government Infrastructure Coordination &amp; Multi-Level Conflict Detection Platform
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">● LIVE PROJECT NETWORK</div>
                <div className="text-slate-200 text-[11px] font-bold">Last Analysis: Just now</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Stats Bar */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30">
              <span className="editorial-number text-2xl text-purple-300 font-bold block">
                {overview.levelCounts.CENTRAL}
              </span>
              <span className="text-[9px] text-purple-300/80 font-bold tracking-wider uppercase">
                CENTRAL PROJECTS
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30">
              <span className="editorial-number text-2xl text-blue-300 font-bold block">
                {overview.levelCounts.STATE}
              </span>
              <span className="text-[9px] text-blue-300/80 font-bold tracking-wider uppercase">
                STATE PROJECTS
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <span className="editorial-number text-2xl text-amber-300 font-bold block">
                {overview.levelCounts.DISTRICT}
              </span>
              <span className="text-[9px] text-amber-300/80 font-bold tracking-wider uppercase">
                DISTRICT PROJECTS
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="editorial-number text-2xl text-emerald-300 font-bold block">
                {overview.levelCounts.LOCAL}
              </span>
              <span className="text-[9px] text-emerald-300/80 font-bold tracking-wider uppercase">
                LOCAL / MUNICIPAL
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 19. INTERACTIVE CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-[#0f172a] border border-[#285c7a]/40 rounded-2xl font-mono text-xs text-white shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('3D_GIS')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === '3D_GIS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>[ 3D GIS COMMAND ]</span>
          </button>

          <button
            onClick={() => setActiveTab('RELATIONSHIPS')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'RELATIONSHIPS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>[ RELATIONSHIP NETWORK ]</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'TIMELINE'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>[ SPATIAL TIMELINE ]</span>
          </button>

          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'MATRIX'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>[ COORDINATION MATRIX ]</span>
          </button>
        </div>

        {/* Level Selector Filter */}
        <div className="flex items-center gap-2 pr-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[11px]">FILTER LEVEL:</span>
          {['ALL', 'CENTRAL', 'STATE', 'DISTRICT', 'LOCAL'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                selectedLevel === lvl
                  ? 'bg-slate-700 text-white border border-cyan-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HERO 3D EXPERIENCE & GIS CANVAS */}
      <AnimatePresence mode="wait">
        {activeTab === '3D_GIS' && (
          <motion.div
            key="3d-gis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Coordination3DCanvas
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={handleSelectProject}
            />
          </motion.div>
        )}

        {activeTab === 'RELATIONSHIPS' && dossier && (
          <motion.div
            key="relationships"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <NetworkGraph3D
              networkData={dossier.networkGraph}
              onSelectNode={handleSelectProject}
            />
          </motion.div>
        )}

        {activeTab === 'TIMELINE' && dossier && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SpatialTimeline3D items={dossier.timelineSpatial} />
          </motion.div>
        )}

        {activeTab === 'MATRIX' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CoordinationMatrixTable
              matrix={matrix}
              onSelectProject={handleSelectProject}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOSSIER & AI INTELLIGENCE GRID */}
      {dossier && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* LEFT: 3D COORDINATION RISK GAUGE & AI PANEL (6 COLS) */}
          <div className="lg:col-span-6 space-y-8">
            {/* 3D Coordination Risk Energy Ring */}
            <CoordinationRiskGauge
              score={dossier.coordinationScore}
              breakdown={dossier.scoreBreakdown}
              riskLevel={dossier.riskLevel}
            />

            {/* ✦ SEVAARTH AI INTELLIGENCE PANEL */}
            <AiIntelligencePanel
              summary={dossier.aiSummary}
              spatialCount={dossier.spatialOverlapsCount}
              timelineCount={dossier.timelineOverlapsCount}
              dependencyCount={dossier.dependenciesCount}
            />
          </div>

          {/* RIGHT: SELECTED PROJECT DOSSIER & RELATED MULTI-LEVEL PROJECTS (6 COLS) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Subject Project Dossier Header Card */}
            <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  PRIMARY INVESTIGATION DOSSIER
                </span>
                <span className="text-xs text-slate-400 font-mono">{dossier.subjectProject.id}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 leading-snug">
                  {dossier.subjectProject.name}
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {dossier.subjectProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
                  <span className="font-bold text-slate-200">{dossier.subjectProject.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SANCTIONED BUDGET</span>
                  <span className="font-bold text-emerald-400">
                    ₹{(dossier.subjectProject.budget / 10000000).toFixed(1)} Cr
                  </span>
                </div>
              </div>
            </div>

            {/* Related Government Projects List */}
            <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  RELATED MULTI-LEVEL PROJECTS ({dossier.relatedProjects.length})
                </h4>
                <span className="text-[10px] text-slate-400">PROXIMITY &amp; CONFLICT LIST</span>
              </div>

              <div className="space-y-3">
                {dossier.relatedProjects.map((rel, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectProject(rel.targetProject.id)}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        rel.targetProject.level === 'CENTRAL' ? 'bg-purple-900/60 text-purple-300 border border-purple-500' :
                        rel.targetProject.level === 'STATE' ? 'bg-blue-900/60 text-blue-300 border border-blue-500' :
                        rel.targetProject.level === 'DISTRICT' ? 'bg-amber-900/60 text-amber-300 border border-amber-500' :
                        'bg-emerald-900/60 text-emerald-300 border border-emerald-500'
                      }`}>
                        {rel.targetProject.level} PROJECT
                      </span>

                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-500">
                        {rel.riskLevel} CONFLICT
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition leading-snug">
                      {rel.targetProject.name}
                    </h5>

                    <div className="text-[11px] text-slate-400 font-sans flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/80">
                      <span>Proximity: <strong className="text-slate-200">{rel.distanceKm} km</strong></span>
                      <span>Timeline Overlap: <strong className="text-amber-400">{rel.overlapMonths} Mos</strong></span>
                      <span>Resource: <strong className="text-cyan-300">{rel.sharedResource}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
