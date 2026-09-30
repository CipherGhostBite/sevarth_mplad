'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CoordinationProjectItem } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  ShieldAlert, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Info,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

interface Props {
  projects: CoordinationProjectItem[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  conflicts?: any[];
}

export default function Coordination3DCanvas({
  projects,
  selectedProjectId,
  onSelectProject,
  conflicts = []
}: Props) {
  const { isHindi, t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<CoordinationProjectItem | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [cameraMode, setCameraMode] = useState<'3D' | 'TOP'>('3D');
  
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f18); // Deep Cyber Navy
    scene.fog = new THREE.FogExp2(0x0a0f18, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 35, 45);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.replaceChildren(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 10;
    controls.maxDistance = 120;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const bluePoint = new THREE.PointLight(0x3b82f6, 2, 80);
    bluePoint.position.set(-20, 20, -20);
    scene.add(bluePoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 2, 80);
    purplePoint.position.set(20, 20, 20);
    scene.add(purplePoint);

    // 6. Geographic Depth Grid (3D Digital Twin Ground)
    const gridHelper = new THREE.GridHelper(100, 50, 0x285c7a, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Subtle atmospheric plane with glowing rings
    const planeGeo = new THREE.PlaneGeometry(120, 120);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x0d1527,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Geographic boundary circles
    const circleGeo = new THREE.RingGeometry(15, 15.2, 64);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0x285c7a, side: THREE.DoubleSide });
    const circleRing = new THREE.Mesh(circleGeo, circleMat);
    circleRing.rotation.x = -Math.PI / 2;
    circleRing.position.y = 0.05;
    scene.add(circleRing);

    // Map latitude/longitude to 3D local coordinates centered on Nalanda (25.197, 85.515)
    const centerLat = 25.197;
    const centerLon = 85.515;
    const scale = 1200; // Scaling factor for lat/lng to 3D scene units

    const projectObjects: THREE.Object3D[] = [];
    const raycastTargets: THREE.Mesh[] = [];

    // Helper color per level
    const getLevelColor = (level: string) => {
      switch (level.toUpperCase()) {
        case 'CENTRAL': return 0xa855f7; // Purple
        case 'STATE': return 0x3b82f6;   // Blue
        case 'DISTRICT': return 0xf59e0b; // Amber
        case 'LOCAL': return 0x10b981;    // Emerald
        default: return 0x64748b;
      }
    };

    // 7. Create 3D Holographic Structures for Projects
    projects.forEach((proj) => {
      const dx = (proj.longitude - centerLon) * scale;
      const dz = -(proj.latitude - centerLat) * scale;
      const isSelected = proj.id === selectedProjectId;

      const baseColor = isSelected ? 0xef4444 : getLevelColor(proj.level);

      // Height represents budget/importance
      const height = isSelected ? 14 : (proj.level === 'CENTRAL' ? 12 : (proj.level === 'STATE' ? 9 : (proj.level === 'DISTRICT' ? 6 : 4)));

      const group = new THREE.Group();
      group.position.set(dx, 0, dz);

      // A. Structure Mesh based on level
      let geometry: THREE.BufferGeometry;
      if (proj.level === 'CENTRAL') {
        geometry = new THREE.OctahedronGeometry(2.5, 0);
      } else if (proj.level === 'STATE') {
        geometry = new THREE.CylinderGeometry(1.2, 1.8, height, 6);
      } else if (proj.level === 'DISTRICT') {
        geometry = new THREE.BoxGeometry(2.2, height, 2.2);
      } else {
        geometry = new THREE.CylinderGeometry(1.4, 1.4, height, 16);
      }

      const material = new THREE.MeshPhongMaterial({
        color: baseColor,
        emissive: isSelected ? 0x991b1b : baseColor,
        emissiveIntensity: isSelected ? 0.6 : 0.25,
        shininess: 90,
        transparent: true,
        opacity: 0.95
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = height / 2;
      mesh.castShadow = true;
      mesh.userData = { project: proj };
      group.add(mesh);
      raycastTargets.push(mesh);

      // B. Top Holographic Glowing Beacon / Ring
      const ringGeo = new THREE.RingGeometry(2.5, 3.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.5
      });
      const topRing = new THREE.Mesh(ringGeo, ringMat);
      topRing.rotation.x = -Math.PI / 2;
      topRing.position.y = height + 0.5;
      group.add(topRing);

      // C. Animated Vertical Light Laser Beacon
      const laserGeo = new THREE.CylinderGeometry(0.08, 0.08, 35, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.35
      });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.position.y = 17.5;
      group.add(laser);

      // D. Ground Holographic Pedestal Glow
      const pedGeo = new THREE.CircleGeometry(3.5, 32);
      const pedMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.3
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.rotation.x = -Math.PI / 2;
      pedestal.position.y = 0.05;
      group.add(pedestal);

      scene.add(group);
      projectObjects.push(group);
    });

    // 8. Create Animated 3D Relationship Paths & Laser Conduits
    const selectedProj = projects.find(p => p.id === selectedProjectId);
    if (selectedProj) {
      const sX = (selectedProj.longitude - centerLon) * scale;
      const sZ = -(selectedProj.latitude - centerLat) * scale;

      projects.forEach(other => {
        if (other.id === selectedProj.id) return;
        const oX = (other.longitude - centerLon) * scale;
        const oZ = -(other.latitude - centerLat) * scale;

        // Curved 3D Arc Connection Path
        const start = new THREE.Vector3(sX, 6, sZ);
        const end = new THREE.Vector3(oX, 5, oZ);
        const mid = new THREE.Vector3((sX + oX) / 2, 12, (sZ + oZ) / 2);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(40);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

        // Color based on level
        const lineMat = new THREE.LineDashedMaterial({
          color: other.level === 'DISTRICT' ? 0xf59e0b : 0x3b82f6,
          dashSize: 1,
          gapSize: 0.5,
          linewidth: 2
        });
        const line = new THREE.Line(curveGeo, lineMat);
        line.computeLineDistances();
        scene.add(line);
      });

      // 9. 3D Semi-Transparent Conflict Zone Dome
      const conflictGeo = new THREE.SphereGeometry(14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const conflictMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        roughness: 0.2
      });
      const conflictDome = new THREE.Mesh(conflictGeo, conflictMat);
      conflictDome.position.set(sX, 0, sZ);
      scene.add(conflictDome);
    }

    // 10. Raycasting & Mouse Hover Interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const projData = hitMesh.userData.project as CoordinationProjectItem;
        setHoveredProject(projData);
        setHoverPos({ x: event.clientX, y: event.clientY });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredProject(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const projData = hitMesh.userData.project as CoordinationProjectItem;
        onSelectProject(projData.id);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousemove', handleMouseMove);
    domElem.addEventListener('click', handleClick);

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate project top rings
      projectObjects.forEach((obj) => {
        obj.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
            child.rotation.z = elapsedTime * 0.8;
          }
        });
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousemove', handleMouseMove);
      domElem.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [projects, selectedProjectId]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 35, 45);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      const factor = direction === 'in' ? 0.8 : 1.25;
      cameraRef.current.position.multiplyScalar(factor);
    }
  };

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-[#285c7a]/40 bg-[#0a0f18] shadow-2xl">
      {/* 3D WebGL Canvas Mounting Node */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Header Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#0f172a]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#285c7a]/40 text-xs font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-emerald-400 font-bold tracking-wider uppercase">
          {isHindi ? 'विकास डिजिटल ट्विन' : 'DEVELOPMENT DIGITAL TWIN'}
        </span>
        <span className="text-slate-400">
          {isHindi ? '• 3D जीआईएस कमांड पर्यावरण' : '• 3D GIS Command Environment'}
        </span>
      </div>

      {/* 3D Controls Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0f172a]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#285c7a]/40 text-xs font-mono">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition"
          title={isHindi ? 'ज़ूम इन' : 'Zoom In'}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition"
          title={isHindi ? 'ज़ूम आउट' : 'Zoom Out'}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition"
          title={isHindi ? 'कैमरा दृश्य रीसेट करें' : 'Reset Camera View'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend & Level Markers */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#0f172a]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#285c7a]/40 text-xs font-mono space-y-2">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {isHindi ? 'सरकारी स्तर 3D संरचनाएं' : 'GOVERNMENT LEVEL 3D STRUCTURES'}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> {isHindi ? 'केन्द्रीय' : 'CENTRAL'}
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {isHindi ? 'राज्य' : 'STATE'}
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {isHindi ? 'जिला' : 'DISTRICT'}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {isHindi ? 'स्थानीय' : 'LOCAL'}
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> {isHindi ? 'संघर्ष क्षेत्र' : 'CONFLICT ZONE'}
          </span>
        </div>
      </div>

      {/* Hover Holographic Floating Panel */}
      {hoveredProject && (
        <div
          className="fixed z-50 pointer-events-none w-72 bg-[#0f172a]/95 backdrop-blur-xl border-2 border-cyan-500/50 rounded-2xl p-4 shadow-2xl text-white font-mono animate-fadeIn"
          style={{
            left: `${hoverPos.x + 15}px`,
            top: `${hoverPos.y - 80}px`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              hoveredProject.level === 'CENTRAL' ? 'bg-purple-900/60 text-purple-300 border border-purple-500' :
              hoveredProject.level === 'STATE' ? 'bg-blue-900/60 text-blue-300 border border-blue-500' :
              hoveredProject.level === 'DISTRICT' ? 'bg-amber-900/60 text-amber-300 border border-amber-500' :
              'bg-emerald-900/60 text-emerald-300 border border-emerald-500'
            }`}>
              {hoveredProject.level} {isHindi ? 'परियोजना' : 'PROJECT'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{hoveredProject.id}</span>
          </div>

          <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-tight mb-2">
            {hoveredProject.name}
          </h4>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">{isHindi ? 'विभाग:' : 'Department:'}</span>
              <span className="font-semibold text-right truncate max-w-[140px]">{hoveredProject.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isHindi ? 'बजट:' : 'Budget:'}</span>
              <span className="font-bold text-emerald-400">₹{(hoveredProject.budget / 10000000).toFixed(1)} {isHindi ? 'करोड़' : 'Cr'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isHindi ? 'समय-सीमा:' : 'Timeline:'}</span>
              <span>{hoveredProject.startDate.slice(0, 7)} &rarr; {hoveredProject.endDate.slice(0, 7)}</span>
            </div>
          </div>

          {hoveredProject.prerequisites && hoveredProject.prerequisites.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-amber-400 flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{isHindi ? '⚠ निर्भरता पूर्वापेक्षा का पता चला' : '⚠ DEPENDENCY PREREQUISITE DETECTED'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

