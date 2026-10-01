'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LeafletMap from '@/components/LeafletMap';
import ConstituencySelector from '@/components/ConstituencySelector';
import { ALL_543_CONSTITUENCIES, Constituency } from '@/lib/constituenciesData';
import { 
  MapPin, 
  RefreshCw, 
  ShieldAlert, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  Compass, 
  Globe,
  Radio
} from 'lucide-react';

export default function MapExplorerPage() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [minPriority, setMinPriority] = useState<number | undefined>(undefined);
  const [workType, setWorkType] = useState<string>('ALL');
  const [showProximityCircle, setShowProximityCircle] = useState<boolean>(false);
  const [proximityRadius, setProximityRadius] = useState<number>(0.5);

  const [selectedConstituency, setSelectedConstituency] = useState<Partial<Constituency>>({
    id: 'nalanda',
    shortName: 'Nalanda',
    name: 'Nalanda Lok Sabha Constituency',
    state: 'Bihar',
    latitude: 25.1982,
    longitude: 85.5149,
    mpName: 'Shri Kaushalendra Kumar',
    mpParty: 'JD(U)',
    code: 'PC-028'
  });

  const loadSavedConstituency = () => {
    try {
      const saved = localStorage.getItem('selected_constituency');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          if (parsed.id === 'all_india') {
            setSelectedConstituency({
              id: 'all_india',
              shortName: 'All India',
              name: 'All India (All 543 Constituencies)',
              state: 'National View',
              latitude: 20.5937,
              longitude: 78.9629,
              mpName: '18th Lok Sabha Assembly',
              mpParty: '543 Seats',
              code: 'IND-543'
            });
          } else {
            const found = ALL_543_CONSTITUENCIES.find((c) => c.id === parsed.id);
            if (found) {
              setSelectedConstituency(found);
            } else {
              setSelectedConstituency(parsed);
            }
          }
        }
      }
    } catch (e) {}
  };

  const fetchMarkers = async () => {
    setLoading(true);
    setError('');
    loadSavedConstituency();
    
    let activeId = 'nalanda';
    try {
      const saved = localStorage.getItem('selected_constituency');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) activeId = parsed.id;
      }
    } catch (e) {}

    try {
      const data = await api.getMapMarkers({
        constituency: activeId,
        min_priority: minPriority,
        work_type: workType !== 'ALL' ? workType : undefined,
      });
      setMarkers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load map markers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkers();

    const handleConstituencyChange = () => {
      fetchMarkers();
    };
    window.addEventListener('constituency-changed', handleConstituencyChange);
    return () => {
      window.removeEventListener('constituency-changed', handleConstituencyChange);
    };
  }, [minPriority, workType]);

  const mapCenter: [number, number] =
    markers.length > 0
      ? [
          markers.reduce((sum, m) => sum + m.latitude, 0) / markers.length,
          markers.reduce((sum, m) => sum + m.longitude, 0) / markers.length,
        ]
      : [selectedConstituency.latitude || 25.1982, selectedConstituency.longitude || 85.5149];

  const highPriorityCount = markers.filter((m) => m.priority_score >= 75).length;
  const medPriorityCount = markers.filter((m) => m.priority_score >= 45 && m.priority_score < 75).length;
  const lowPriorityCount = markers.filter((m) => m.priority_score < 45).length;
  const totalSanctionedCr = (markers.reduce((sum, m) => sum + (m.sanctioned_amount || 0), 0)).toFixed(1);

  return (
    <div className="space-y-6 font-mono">
      {/* 1. TOP HEADER & CONSTITUENCY TELEMETRY SLAB */}
      <div className="floating-slab p-6 border-l-4 border-[#285C7A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Title & Active Constituency Badge */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#285C7A]/10 text-[#285C7A] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-[#285C7A]/20">
                <Radio className="w-3 h-3 text-[#398265] animate-pulse" />
                <span>GIS SPATIAL INTELLIGENCE PIPELINE</span>
              </span>
              <span className="text-xs text-[#667078]">&bull; {selectedConstituency.code || 'PC'} &bull; {selectedConstituency.state}</span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-[#182027] tracking-tight uppercase flex items-center gap-3">
              <Globe className="w-6 h-6 text-[#285C7A]" />
              <span>{selectedConstituency.shortName || selectedConstituency.name}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#667078]">
              {selectedConstituency.mpName && (
                <span>
                  <strong>Member of Parliament:</strong> {selectedConstituency.mpName} ({selectedConstituency.mpParty})
                </span>
              )}
              <span>&bull;</span>
              <span>
                <strong>GIS Coordinates:</strong> {selectedConstituency.latitude?.toFixed(4)}° N, {selectedConstituency.longitude?.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Constituency Selector Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <ConstituencySelector variant="header" />
            <button
              onClick={fetchMarkers}
              disabled={loading}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#ECEFEA] border border-[#C5CBC0] text-[#182027] text-xs font-bold shadow-xs hover:border-[#285C7A] transition flex items-center gap-2 active:translate-y-0.5"
              title="Refresh spatial markers"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#285C7A] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">REFRESH GIS</span>
            </button>
          </div>

        </div>

        {/* METRICS DASHBOARD ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#E4E7E1]">
          <div className="bg-[#FAFBF8] p-3 rounded-xl border border-[#E4E7E1]">
            <span className="text-[10px] text-[#667078] font-bold block uppercase">TOTAL ASSET PINS</span>
            <span className="editorial-number text-xl font-black text-[#182027]">{markers.length}</span>
            <span className="text-[10px] text-[#667078] block">Geocoded Works</span>
          </div>

          <div className="bg-[#FAFBF8] p-3 rounded-xl border border-[#E4E7E1]">
            <span className="text-[10px] text-[#C45145] font-bold block uppercase">HIGH PRIORITY ANOMALIES</span>
            <span className="editorial-number text-xl font-black text-[#C45145]">{highPriorityCount}</span>
            <span className="text-[10px] text-[#667078] block">Risk Score &ge; 75</span>
          </div>

          <div className="bg-[#FAFBF8] p-3 rounded-xl border border-[#E4E7E1]">
            <span className="text-[10px] text-[#C88A25] font-bold block uppercase">MEDIUM PRIORITY</span>
            <span className="editorial-number text-xl font-black text-[#C88A25]">{medPriorityCount}</span>
            <span className="text-[10px] text-[#667078] block">Risk Score 45–74</span>
          </div>

          <div className="bg-[#FAFBF8] p-3 rounded-xl border border-[#E4E7E1]">
            <span className="text-[10px] text-[#398265] font-bold block uppercase">TOTAL SANCTIONED</span>
            <span className="editorial-number text-xl font-black text-[#398265]">₹{totalSanctionedCr} L</span>
            <span className="text-[10px] text-[#667078] block">In Active View</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & PROXIMITY CONTROLS SLAB */}
      <div className="floating-slab p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#285C7A] font-bold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>GIS MAP FILTERS:</span>
          </div>

          {/* Priority Tier Filter */}
          <select
            value={minPriority === 75 ? 'HIGH' : minPriority === 45 ? 'MED' : 'ALL'}
            onChange={(e) => {
              if (e.target.value === 'HIGH') setMinPriority(75);
              else if (e.target.value === 'MED') setMinPriority(45);
              else setMinPriority(undefined);
            }}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-3.5 py-1.5 font-bold text-[#285C7A] focus:outline-hidden"
          >
            <option value="ALL">All Priority Tiers (0–100)</option>
            <option value="HIGH">High Priority Only (&ge;75)</option>
            <option value="MED">Medium &amp; High (&ge;45)</option>
          </select>

          {/* Work Category Filter */}
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="bg-[#FAFAF7] border border-[#D2D7CE] rounded-xl px-3.5 py-1.5 font-bold text-[#182027] focus:outline-hidden"
          >
            <option value="ALL">All Work Categories</option>
            <option value="PCC Road & Drainage">PCC Road &amp; Drainage</option>
            <option value="Community Hall / Center">Community Hall / Center</option>
            <option value="Solar Street Lights Installation">Solar Street Lights</option>
            <option value="Drinking Water & RO Plant">Drinking Water &amp; RO</option>
            <option value="High School Science Lab & Classrooms">School / Education Lab</option>
            <option value="Primary Health Center Upgrade">Health Center Upgrade</option>
          </select>
        </div>

        {/* Proximity Layer Controls */}
        <div className="flex items-center gap-3 bg-[#FAFBF8] p-1.5 rounded-xl border border-[#E4E7E1]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showProximityCircle}
              onChange={(e) => setShowProximityCircle(e.target.checked)}
              className="rounded text-[#285C7A] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="font-bold text-[#182027]">Proximity Circle</span>
          </label>

          {showProximityCircle && (
            <select
              value={proximityRadius}
              onChange={(e) => setProximityRadius(parseFloat(e.target.value))}
              className="bg-white border border-[#D2D7CE] rounded-lg px-2 py-0.5 font-bold text-[#C45145]"
            >
              <option value={0.35}>350m Radius</option>
              <option value={0.5}>500m Radius</option>
              <option value={1.0}>1.0km Radius</option>
              <option value={3.0}>3.0km Radius</option>
            </select>
          )}
        </div>
      </div>

      {/* 3. LEAFLET MAP DISPLAY PLATFORM */}
      <div className="floating-slab p-5 space-y-4">
        {loading ? (
          <div className="h-[650px] flex flex-col items-center justify-center text-xs text-[#667078] space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#285C7A]" />
            <span className="font-bold">INITIALIZING GIS TERRAIN ENGINE FOR {selectedConstituency.shortName || 'CONSTITUENCY'}...</span>
            <span className="text-[10px] opacity-75">Fetching geocoded asset pins &amp; risk scores</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-[#C45145] font-bold bg-[#FFF5F5] rounded-2xl border border-[#F8D7DA]">
            <ShieldAlert className="w-8 h-8 text-[#C45145] mx-auto mb-2" />
            <p>{error}</p>
            <button
              onClick={fetchMarkers}
              className="mt-3 px-4 py-1.5 rounded-xl bg-[#C45145] text-white font-mono text-xs font-bold"
            >
              RETRY MAP LOAD
            </button>
          </div>
        ) : (
          <LeafletMap
            markers={markers}
            center={mapCenter}
            zoom={12}
            height="650px"
            showProximityCircle={showProximityCircle}
            proximityRadiusKm={proximityRadius}
          />
        )}
      </div>

      {/* 4. GIS MAP FOOTER HELP BAR */}
      <div className="px-5 py-3 floating-slab text-[11px] font-mono text-[#667078] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#285C7A]" />
          <span>Click on any colored priority pin to open asset dossier &amp; duplicate risk telemetry.</span>
        </div>
        <div>
          Showing <strong>{markers.length}</strong> geocoded asset locations in <strong>{selectedConstituency.shortName || 'selected constituency'}</strong>
        </div>
      </div>
    </div>
  );
}
