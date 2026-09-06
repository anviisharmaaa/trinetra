import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import earthDarkTexture from '../../assets/textures/earth-dark.jpg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GLOBE_NODES, GLOBE_ARCS, findNode, type GlobeNode } from '../../data/dashboard/network';

/**
 * The Cases Dashboard hero globe — a real, continuously-rendered Three.js
 * scene built the same way as the login screen's globe (a plain
 * THREE.Object3D `three-globe` instance living inside our own
 * scene/camera/renderer), but tuned for a wide hero panel rather than a
 * tall auth-card frame, and with genuine pointer interaction: invisible
 * hit-spheres are attached to the globe at each node's real lat/lng (via
 * `globe.getCoords`), so they rotate with the globe exactly like the
 * points/arcs do, and a raycaster reports which one (if any) is under the
 * cursor each frame so an HTML tooltip can be shown.
 *
 * Respects prefers-reduced-motion: rotation, arc dashes and ring pulses
 * are removed entirely (not just slowed) — see the login globe for the
 * same pattern and why zeroing durations alone isn't enough.
 */

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach(disposeMaterial);
    else if (material) disposeMaterial(material);
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

const RING_NODES = GLOBE_NODES.filter((n) => n.ring);

export interface HoveredNode {
  node: GlobeNode;
  x: number;
  y: number;
}

export function IntelligenceGlobe({ onHover }: { onHover?: (node: HoveredNode | null) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const arcsDataRef = useRef<ArcDatum[] | null>(null);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 4000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x24414d, 1.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0x8fd9ff, 1.85);
    key.position.set(-260, 170, 220);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2a6b82, 0.55);
    rim.position.set(220, -90, -160);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    if (!arcsDataRef.current) {
      arcsDataRef.current = GLOBE_ARCS.map((a) => {
        const from = findNode(a.source);
        const to = findNode(a.target);
        return {
          startLat: from.lat,
          startLng: from.lng,
          endLat: to.lat,
          endLng: to.lng,
          animateTime: 3000 + Math.random() * 3200,
          initialGap: Math.random() * 6,
        };
      });
    }
    const arcsPayload = arcsDataRef.current;
    const startedReduced = reducedMotionRef.current;

    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: false })
      .globeImageUrl(earthDarkTexture)
      .showAtmosphere(true)
      .atmosphereColor('#4cc9f0')
      .atmosphereAltitude(0.17)
      .showGraticules(true)
      .pointsData(GLOBE_NODES)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor((d) => ((d as GlobeNode).hq ? '#eaf9ff' : '#6fd6ff'))
      .pointAltitude(0.008)
      .pointRadius((d) => ((d as GlobeNode).hq ? 0.6 : 0.4))
      .pointResolution(12)
      .ringsData(startedReduced ? [] : RING_NODES)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => (t: number) => `rgba(76,201,240,${Math.max(0, 1 - t) * 0.55})`)
      .ringMaxRadius(5.4)
      .ringPropagationSpeed(2.6)
      .ringRepeatPeriod((d) => (d as GlobeNode).ringPeriod ?? 4500)
      .arcsData(startedReduced ? [] : arcsPayload)
      .arcColor(() => ['rgba(76,201,240,0.85)', 'rgba(76,201,240,0)'])
      .arcAltitudeAutoScale(0.32)
      .arcStroke(0.32)
      .arcDashLength(0.35)
      .arcDashGap(2.5)
      .arcDashInitialGap((d) => (d as { initialGap: number }).initialGap)
      .arcDashAnimateTime((d) => (d as { animateTime: number }).animateTime);

    globeRef.current = globe;
    globeGroup.add(globe);
    globeGroup.rotation.x = 0.26;
    globeGroup.rotation.y = -1.0; // South Asia / Indian Ocean facing the camera by default

    globe.traverse((child) => {
      const mesh = child as THREE.LineSegments;
      const material = mesh.material as THREE.LineBasicMaterial | undefined;
      if (material && 'color' in material && material.color.getHexString() === 'd3d3d3') {
        material.color.set('#2f5866');
        material.opacity = 0.2;
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
          .polygonStrokeColor(() => 'rgba(120,210,235,0.38)')
          .polygonAltitude(0.0018);
        countryOutlines = globe;
      })
      .catch(() => {
        /* nice-to-have overlay; the globe still reads fine without it */
      });

    // Invisible hit-spheres, one per node, parented directly to the globe
    // object so they inherit its (and the group's) rotation exactly like
    // the real points/arcs do — this is what makes hover tracking work
    // correctly as the globe spins, without any manual matrix math.
    const hitMeshes: THREE.Mesh[] = [];
    const hitGeometry = new THREE.SphereGeometry(4.2, 10, 10);
    for (const node of GLOBE_NODES) {
      const coords = globe.getCoords(node.lat, node.lng, 0.02);
      const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
      const hit = new THREE.Mesh(hitGeometry, material);
      hit.position.set(coords.x, coords.y, coords.z);
      hit.userData.nodeId = node.id;
      globe.add(hit);
      hitMeshes.push(hit);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-10, -10);
    let hasPointer = false;
    let hoveredId: string | null = null;
    let lastClientX = 0;
    let lastClientY = 0;

    function updateHover() {
      if (!hasPointer) {
        if (hoveredId !== null) {
          hoveredId = null;
          mount!.style.cursor = 'default';
          onHoverRef.current?.(null);
        }
        return;
      }
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      const id = (hit?.userData.nodeId as string | undefined) ?? null;
      if (id !== hoveredId) {
        hoveredId = id;
        mount!.style.cursor = id ? 'pointer' : 'default';
        if (id) {
          const rect = mount!.getBoundingClientRect();
          onHoverRef.current?.({ node: findNode(id), x: lastClientX - rect.left, y: lastClientY - rect.top });
        } else {
          onHoverRef.current?.(null);
        }
      } else if (id) {
        const rect = mount!.getBoundingClientRect();
        onHoverRef.current?.({ node: findNode(id), x: lastClientX - rect.left, y: lastClientY - rect.top });
      }
    }

    let mouseNX = 0;
    let mouseNY = 0;
    let proximity = 0;
    function onPointerMove(e: PointerEvent) {
      const rect = mount!.getBoundingClientRect();
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      hasPointer = true;
      mouseNX = pointer.x;
      mouseNY = pointer.y;
      const dist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
      proximity = Math.max(0, 1 - dist);
    }
    function onPointerLeave() {
      hasPointer = false;
    }
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerleave', onPointerLeave);

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
    let targetAmbient = 1.6;
    function animate() {
      const reduced = reducedMotionRef.current;
      if (!reduced) {
        globeGroup.rotation.y += 0.00068;
      }
      if (!reduced) {
        camera.position.x += (mouseNX * 34 - camera.position.x) * 0.02;
        camera.position.y += (-mouseNY * 24 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
        targetAmbient = 1.6 + proximity * 0.3;
        ambient.intensity += (targetAmbient - ambient.intensity) * 0.05;
      }
      updateHover();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();
    setReady(true);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      hitGeometry.dispose();
      disposeObject3D(globeGroup);
      if (countryOutlines) disposeObject3D(countryOutlines);
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      globeRef.current = null;
      onHoverRef.current?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return <div ref={mountRef} className={`dash-globe-canvas ${ready ? 'is-ready' : ''}`} />;
}
