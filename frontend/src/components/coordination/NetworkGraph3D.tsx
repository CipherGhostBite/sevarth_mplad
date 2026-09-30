'use client';

import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import { Network, RefreshCw, ZoomIn, ZoomOut, Filter, Info } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Props {
  networkData: {
    nodes: Array<{
      id: string;
      name: string;
      level: string;
      category: string;
      isPrimary: boolean;
      heightVal: number;
      budget: number;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      relationshipType: string;
      coordinationScore: number;
      distanceKm: number;
      overlapMonths: number;
      sharedResource: string;
      riskLevel: string;
    }>;
  };
  onSelectNode?: (id: string) => void;
}

export default function NetworkGraph3D({ networkData, onSelectNode }: Props) {
  const { isHindi, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<any | null>(null);

  useEffect(() => {
    if (!containerRef.current || !networkData) return;

    const elements: Cytoscape.ElementDefinition[] = [];

    // Add Nodes
    networkData.nodes.forEach((node) => {
      let color = '#3B82F6'; // State blue
      if (node.level === 'CENTRAL') color = '#A855F7';
      else if (node.level === 'DISTRICT') color = '#F59E0B';
      else if (node.level === 'LOCAL') color = '#10B981';

      if (node.isPrimary) color = '#EF4444'; // Central selected node

      elements.push({
        data: {
          id: node.id,
          label: `${node.level}\n${node.name.slice(0, 22)}...`,
          level: node.level,
          color: color,
          size: node.isPrimary ? 65 : 45
        }
      });
    });

    // Add Edges
    networkData.edges.forEach((edge) => {
      let lineColor = '#3B82F6';
      let lineStyle = 'solid';

      if (edge.relationshipType === 'dependency') {
        lineColor = '#EF4444';
        lineStyle = 'solid';
      } else if (edge.relationshipType === 'spatial_overlap') {
        lineColor = '#F59E0B';
        lineStyle = 'dashed';
      } else if (edge.relationshipType === 'timeline_overlap') {
        lineColor = '#3B82F6';
        lineStyle = 'dotted';
      }

      elements.push({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: `${edge.distanceKm} km | ${edge.overlapMonths}m`,
          relationshipType: edge.relationshipType,
          color: lineColor,
          lineStyle: lineStyle,
          edgeData: edge
        }
      });
    });

    const cy = Cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#FFFFFF',
            'font-size': '10px',
            'font-family': 'monospace',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'width': 'data(size)',
            'height': 'data(size)',
            'border-width': 3,
            'border-color': '#FFFFFF'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': 'data(color)',
            'line-style': 'data(lineStyle)' as any,
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#94A3B8',
            'font-size': '9px',
            'font-family': 'monospace'
          }
        }
      ],
      layout: {
        name: 'concentric',
        concentric: (node: any) => (node.data('id') === networkData.nodes[0]?.id ? 2 : 1),
        levelWidth: () => 1,
        padding: 30
      }
    });

    cyRef.current = cy;

    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      setSelectedEdge(edge.data('edgeData'));
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      if (onSelectNode) {
        onSelectNode(node.id());
      }
    });

    return () => {
      cy.destroy();
    };
  }, [networkData]);

  const handleResetLayout = () => {
    if (cyRef.current) {
      cyRef.current.layout({ name: 'concentric', padding: 30 }).run();
      cyRef.current.fit();
    }
  };

  return (
    <div className="floating-slab p-6 bg-[#0f172a] border border-[#285c7a]/40 rounded-3xl text-white font-mono space-y-4 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            {isHindi ? '3D स्थानिक संबंध नेटवर्क' : '3D SPATIAL RELATIONSHIP NETWORK'}
          </h3>
        </div>
        <button
          onClick={handleResetLayout}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          title={isHindi ? 'ग्राफ़ लेआउट रीसेट करें' : 'Reset Graph Layout'}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Graph Container */}
      <div ref={containerRef} className="w-full h-80 rounded-2xl bg-[#0a0f18] border border-slate-800" />

      {/* Selected Relationship Detail Plaque */}
      {selectedEdge && (
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-cyan-500/50 text-xs text-slate-200 flex items-center justify-between animate-fadeIn">
          <div className="space-y-0.5">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              {isHindi ? 'संबंध:' : 'RELATIONSHIP:'} {selectedEdge.relationshipType.toUpperCase()}
            </span>
            <div className="font-semibold text-slate-100">
              {isHindi ? 'साझा संसाधन:' : 'Shared Resource:'} {selectedEdge.sharedResource}
            </div>
            <div className="text-[10px] text-slate-400">
              {isHindi ? 'दूरी:' : 'Distance:'} {selectedEdge.distanceKm} {isHindi ? 'किमी • समय अतिव्यापन:' : 'km • Timeline Overlap:'} {selectedEdge.overlapMonths} {isHindi ? 'महीने' : 'Months'}
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-900/60 text-red-300 border border-red-500">
            {selectedEdge.riskLevel} {isHindi ? 'जोखिम' : 'RISK'}
          </span>
        </div>
      )}
    </div>
  );
}

