# Siti-Chan 3D Model Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive 3D character viewer (`Character3DViewer.tsx`) powered by Three.js and `@pixiv/three-vrm` to the Siti-Chan landing page.

**Architecture:** A Client Component (`Character3DViewer.tsx`) that mounts a WebGL canvas, loads VRM avatar models with `GLTFLoader` and `@pixiv/three-vrm`, enables OrbitControls, provides interactive character switching tabs, and is integrated directly into the Hero section of `src/app/siti-chan/page.tsx`.

**Tech Stack:** Next.js 15, React 19, Three.js (`three`), `@pixiv/three-vrm`, `@types/three`, Tailwind CSS, Lucide Icons.

## Global Constraints
- Target workspace: `/Users/steradian/terminal/nextjs/portfolio-rangga`
- TypeScript strict compatibility
- Next.js Client Component directive `"use client"` for 3D canvas component

---

### Task 1: Install 3D Engine Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: None
- Produces: `three`, `@types/three`, `@pixiv/three-vrm` packages in node_modules

- [ ] **Step 1: Install `three` and `@pixiv/three-vrm`**

Run: `npm install three @pixiv/three-vrm`
Expected: Packages installed successfully.

- [ ] **Step 2: Install `@types/three` dev dependency**

Run: `npm install -D @types/three`
Expected: Dev dependency installed successfully.

- [ ] **Step 3: Commit dependency changes**

Run: `git add package.json package-lock.json`
Run: `git commit -m "deps: add three and @pixiv/three-vrm"`

---

### Task 2: Create Character3DViewer Client Component

**Files:**
- Create: `src/app/siti-chan/components/Character3DViewer.tsx`

**Interfaces:**
- Consumes: `three`, `@pixiv/three-vrm`, `three/examples/jsm/loaders/GLTFLoader.js`, `three/examples/jsm/controls/OrbitControls.js`
- Produces: `<Character3DViewer />` React component

- [ ] **Step 1: Create `Character3DViewer.tsx` component**

Create `src/app/siti-chan/components/Character3DViewer.tsx` with full WebGL canvas setup, OrbitControls, VRM loader plugin, blinking/breathing loop, character tabs, and loading state.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import { Sparkles, RefreshCw, RotateCcw } from "lucide-react";

interface CharacterOption {
  id: string;
  name: string;
  role: string;
  vrmUrl: string;
  color: string;
}

const CHARACTERS: CharacterOption[] = [
  {
    id: "siti",
    name: "Siti-chan",
    role: "Ceria & Ramah",
    vrmUrl: "https://cdn.jsdelivr.net/gh/pixiv/three-vrm@master/packages/three-vrm/examples/models/VRM1_Constraint_Sample.vrm",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "rangga",
    name: "Rangga-kun",
    role: "Tech & Smart",
    vrmUrl: "https://cdn.jsdelivr.net/gh/pixiv/three-vrm@master/packages/three-vrm/examples/models/VRM1_Constraint_Sample.vrm",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "aoi",
    name: "Aoi-chan",
    role: "Lembut & Calming",
    vrmUrl: "https://cdn.jsdelivr.net/gh/pixiv/three-vrm@master/packages/three-vrm/examples/models/VRM1_Constraint_Sample.vrm",
    color: "from-pink-500 to-rose-600",
  },
];

export default function Character3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedChar, setSelectedChar] = useState<CharacterOption>(CHARACTERS[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentVrmRef = useRef<VRM | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 20.0);
    camera.position.set(0.0, 1.2, 2.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1.0, 2.0, 1.5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x00f2fe, 0.6);
    fillLight.position.set(-1.0, 1.0, -1.0);
    scene.add(fillLight);

    // 5. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 1.0, 0.0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 4.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.update();
    controlsRef.current = controls;

    // 6. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (currentVrmRef.current) {
        currentVrmRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Load VRM Model on Selected Character Change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    setLoading(true);
    setLoadingProgress(0);

    // Remove previous VRM
    if (currentVrmRef.current) {
      scene.remove(currentVrmRef.current.scene);
      VRMUtils.deepDispose(currentVrmRef.current.scene);
      currentVrmRef.current = null;
    }

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      selectedChar.vrmUrl,
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;
        if (vrm) {
          VRMUtils.rotateVRM0(vrm);
          currentVrmRef.current = vrm;
          scene.add(vrm.scene);

          // Position VRM nicely
          vrm.scene.position.set(0, 0, 0);
          
          if (controlsRef.current && cameraRef.current) {
            controlsRef.current.target.set(0.0, 1.1, 0.0);
            cameraRef.current.position.set(0.0, 1.2, 2.2);
            controlsRef.current.update();
          }
        }
        setLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadingProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (error) => {
        console.warn("Error loading VRM model:", error);
        setLoading(false);
      }
    );
  }, [selectedChar]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.set(0.0, 1.1, 0.0);
      cameraRef.current.position.set(0.0, 1.2, 2.2);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[420px] md:h-[500px] rounded-3xl overflow-hidden sc-glass-card p-2 border border-white/10 shadow-2xl flex flex-col">
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full sc-glass-sm pointer-events-auto">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/90">3D Interactive Avatar</span>
        </div>

        <button
          onClick={handleResetCamera}
          className="p-2 rounded-full sc-glass-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-medium text-white/80">Memuat Model 3D {selectedChar.name}...</p>
          {loadingProgress > 0 && (
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Bottom Character Selector */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-center gap-2 pointer-events-auto">
        {CHARACTERS.map((char) => {
          const isSelected = selectedChar.id === char.id;
          return (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                isSelected
                  ? `bg-gradient-to-r ${char.color} text-white shadow-lg scale-105 border border-white/30`
                  : "sc-glass-sm text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{char.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify component TypeScript build**

Run: `npx tsc --noEmit`
Expected: Clean pass or no errors in `Character3DViewer.tsx`.

- [ ] **Step 3: Commit Character3DViewer component**

Run: `git add src/app/siti-chan/components/Character3DViewer.tsx`
Run: `git commit -m "feat: create Character3DViewer client component"`

---

### Task 3: Embed Character3DViewer in Landing Page Hero Section

**Files:**
- Modify: `src/app/siti-chan/page.tsx:270-360`

**Interfaces:**
- Consumes: `<Character3DViewer />` from `src/app/siti-chan/components/Character3DViewer.tsx`
- Produces: Hero section with 3D model viewer on landing page

- [ ] **Step 1: Import Character3DViewer in `page.tsx`**

Add import statement:
```tsx
import Character3DViewer from "./components/Character3DViewer";
```

- [ ] **Step 2: Update Hero section right column to render `<Character3DViewer />`**

Replace static hero preview image container with `<Character3DViewer />`.

- [ ] **Step 3: Run `npm run build` to verify full compilation**

Run: `npm run build`
Expected: SUCCESS with zero type errors.

- [ ] **Step 4: Commit changes**

Run: `git add src/app/siti-chan/page.tsx`
Run: `git commit -m "feat: embed Character3DViewer into Siti-Chan landing page hero section"`

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-23-siti-chan-3d-model-viewer.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
