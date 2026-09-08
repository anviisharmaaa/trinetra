import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import earthDarkTexture from '../../assets/textures/earth-dark.jpg';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * The TRINETRA login globe — a real, continuously-rendered Three.js scene
 * (via the `three-globe` object, which stays a plain THREE.Object3D so it
 * lives happily inside our own scene/camera/renderer) rather than a static
 * image or video loop. It fills its parent container and re-fits itself on
 * resize.
 *
 * Layers, all attached to the same rotating group so they turn together as
 * one 3D object:
 *  - a dark earth texture + bump map (very subtle surface relief)
 *  - thin glowing country outlines (fetched once, degrades gracefully if
 *    unavailable — the globe still reads fine without them)
 *  - a faint latitude/longitude graticule
 *  - a small network of intelligence "nodes" (world cities) with staggered
 *    pulsing rings so the network feels alive rather than mechanical
 *  - animated arcs between nodes with a travelling dash standing in for a
 *    light particle carrying data from source to destination
 *  - a soft atmospheric rim glow
 *
 * Respects prefers-reduced-motion: rotation, dash travel and ring pulses
 * all stop, leaving a static (but fully legible) globe.
 */

interface GlobeNode {
  lat: number;
  lng: number;
  label: string;
  hq?: boolean;
  ring?: boolean;
  ringPeriod?: number;
}

const NODES: GlobeNode[] = [
  { lat: 19.076, lng: 72.8777, label: 'Mumbai', hq: true, ring: true, ringPeriod: 3600 },
  { lat: 28.6139, lng: 77.209, label: 'New Delhi', ring: true, ringPeriod: 4800 },
  { lat: 25.2048, lng: 55.2708, label: 'Dubai', ring: true, ringPeriod: 4200 },
  { lat: 1.3521, lng: 103.8198, label: 'Singapore', ring: true, ringPeriod: 5400 },
  { lat: 51.5074, lng: -0.1278, label: 'London', ring: true, ringPeriod: 6000 },
  { lat: 6.9271, lng: 79.8612, label: 'Colombo' },
  { lat: 13.7563, lng: 100.5018, label: 'Bangkok' },
  { lat: 22.3193, lng: 114.1694, label: 'Hong Kong' },
  { lat: -1.2921, lng: 36.8219, label: 'Nairobi' },
  { lat: 27.7172, lng: 85.324, label: 'Kathmandu' },
];

const ARCS: { from: string; to: string }[] = [
  { from: 'Mumbai', to: 'Dubai' },
  { from: 'Mumbai', to: 'Singapore' },
  { from: 'Mumbai', to: 'London' },
  { from: 'Mumbai', to: 'Colombo' },
  { from: 'Mumbai', to: 'Nairobi' },
  { from: 'New Delhi', to: 'Kathmandu' },
  { from: 'New Delhi', to: 'Bangkok' },
  { from: 'New Delhi', to: 'Dubai' },
  { from: 'Dubai', to: 'London' },
  { from: 'Singapore', to: 'Hong Kong' },
];

function byLabel(label: string) {
  return NODES.find((n) => n.label === label)!;
}

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) {
      material.forEach((m) => disposeMaterial(m));
    } else if (material) {
      disposeMaterial(material);
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  const mat = material as THREE.MeshStandardMaterial & Record<string, unknown>;
  Object.values(mat).forEach((value) => {
    if (value && typeof value === 'object' && 'isTexture' in (value as object)) {
      (value as THREE.Texture).dispose();
    }
  });
  material.dispose();
}

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  animateTime: number;
  initialGap: number;
}

const RING_NODES = NODES.filter((n) => n.ring);

export function TrinetraGlobe({ interactive = true }: { interactive?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const arcsDataRef = useRef<ArcDatum[] | null>(null);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let width = mount.clientWidth || 640;
    let height = mount.clientHeight || 640;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 4000);
    camera.position.set(0, 0, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // A gentle, fixed "sun" so the sphere reads as a lit 3D object with a
    // dark far side, rather than a flat evenly-lit disc — this stays fixed
    // in camera space while the globe itself rotates underneath it.
    const ambient = new THREE.AmbientLight(0x24414d, 1.65);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0x8fd9ff, 1.9);
    key.position.set(-260, 160, 220);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2a6b82, 0.6);
    rim.position.set(200, -80, -160);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Computed once per mount so re-toggling reduced-motion later swaps the
    // *same* arcs back in rather than re-randomizing their timing.
    if (!arcsDataRef.current) {
      arcsDataRef.current = ARCS.map((a) => {
        const from = byLabel(a.from);
        const to = byLabel(a.to);
        return {
          startLat: from.lat,
          startLng: from.lng,
          endLat: to.lat,
          endLng: to.lng,
          animateTime: 3200 + Math.random() * 3200,
          initialGap: Math.random() * 6,
        };
      });
    }
    const arcsPayload = arcsDataRef.current;
    const startedReduced = reducedMotionRef.current;

    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: false })
      .globeImageUrl(earthDarkTexture)
      .showAtmosphere(true)
      .atmosphereColor('#48d8ff')
      .atmosphereAltitude(0.16)
      .showGraticules(true)
      .pointsData(NODES)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor((d) => ((d as GlobeNode).hq ? '#eaf9ff' : '#6fd6ff'))
      .pointAltitude(0.008)
      .pointRadius((d) => ((d as GlobeNode).hq ? 0.55 : 0.38))
      .pointResolution(12)
      // Rings (node pulses) and arcs (travelling route particles) are the
      // two purely decorative animations in this scene. Under reduced
      // motion we don't just slow them down — we omit the data entirely, so
      // there is truly nothing left animating frame-to-frame; the network
      // still reads clearly from the static points, graticule and atmosphere.
      .ringsData(startedReduced ? [] : RING_NODES)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => (t: number) => `rgba(72,216,255,${Math.max(0, 1 - t) * 0.55})`)
      .ringMaxRadius(5.2)
      .ringPropagationSpeed(2.6)
      .ringRepeatPeriod((d) => (d as GlobeNode).ringPeriod ?? 4500)
      .arcsData(startedReduced ? [] : arcsPayload)
      .arcColor(() => ['rgba(72,216,255,0.85)', 'rgba(72,216,255,0)'])
      .arcAltitudeAutoScale(0.32)
      .arcStroke(0.34)
      .arcDashLength(0.35)
      .arcDashGap(2.4)
      .arcDashInitialGap((d) => (d as { initialGap: number }).initialGap)
      .arcDashAnimateTime((d) => (d as { animateTime: number }).animateTime);

    globeRef.current = globe;
    globeGroup.add(globe);
    globeGroup.rotation.x = 0.32;
    globeGroup.rotation.y = -2.35; // opens facing the Indian Ocean / South Asia

    // Tint the built-in graticule (default is flat light-grey) toward the
    // house cyan so it reads as instrument-panel latitude/longitude lines
    // rather than a generic wireframe.
    globe.traverse((child) => {
      const mesh = child as THREE.LineSegments;
      const material = mesh.material as THREE.LineBasicMaterial | undefined;
      if (material && 'color' in material && material.color.getHexString() === 'd3d3d3') {
        material.color.set('#2f5866');
        material.opacity = 0.22;
      }
    });

    let countryOutlines: THREE.Object3D | null = null;
    fetch('/data/world-countries-110m.geojson')
      .then((r) => (r.ok ? r.json() : null))
      .then((geojson) => {
        if (disposed || !geojson) return;
        globe
          .polygonsData((geojson as { features: object[] }).features)
          .polygonCapColor(() => 'rgba(0,0,0,0)')
          .polygonSideColor(() => 'rgba(0,0,0,0)')
          .polygonStrokeColor(() => 'rgba(120,210,235,0.4)')
          .polygonAltitude(0.0018);
        countryOutlines = globe;
      })
      .catch(() => {
        /* country outline overlay is a nice-to-have — the globe still
           reads fine from the earth texture + graticule alone */
      });

    let mouseX = 0;
    let mouseY = 0;
    let proximity = 0; // 0..1, how close the cursor is to the globe's screen position
    function onPointerMove(e: PointerEvent) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      const rect = mount!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2 || 1);
      const dy = (e.clientY - cy) / (rect.height / 2 || 1);
      const dist = Math.sqrt(dx * dx + dy * dy);
      proximity = Math.max(0, 1 - dist);
    }
    if (interactive) window.addEventListener('pointermove', onPointerMove);

    function onResize() {
      if (!mount) return;
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    window.addEventListener('resize', onResize);

    let raf = 0;
    let targetAmbient = 1.65;
    function animate() {
      const reduced = reducedMotionRef.current;
      if (!reduced) {
        globeGroup.rotation.y += 0.00075;
      }
      if (interactive && !reduced) {
        camera.position.x += (mouseX * 46 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 32 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
        targetAmbient = 1.65 + proximity * 0.35;
        ambient.intensity += (targetAmbient - ambient.intensity) * 0.05;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      disposeObject3D(globeGroup);
      if (countryOutlines) disposeObject3D(countryOutlines);
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      globeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // The initial `.ringsData(...)`/`.arcsData(...)` calls above only read
  // `reducedMotionRef` once, at setup time. If the OS-level setting changes
  // later in the session, swap the datasets in or out again so any
  // already-travelling arc dashes and ring pulses actually stop (or resume)
  // immediately, rather than only affecting globe rotation/parallax.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const globe = globeRef.current;
    if (!globe || !arcsDataRef.current) return;
    globe.ringsData(reducedMotion ? [] : RING_NODES);
    globe.arcsData(reducedMotion ? [] : arcsDataRef.current);
  }, [reducedMotion]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
