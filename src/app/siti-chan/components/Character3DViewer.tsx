"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

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
    vrmUrl: "/assets/vrm/siti-chan.vrm",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "hana",
    name: "Hana-chan",
    role: "Cerdas & Energik",
    vrmUrl: "/assets/vrm/hana-chan.vrm",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "iroha",
    name: "Iroha-chan",
    role: "Lembut & Calming",
    vrmUrl: "/assets/vrm/iroha-chan.vrm",
    color: "from-pink-500 to-rose-600",
  },
];

// Natural Idle Pose Constants from avatar-animation.js
const IDLE_POSE = {
  leftUpperArm: { x: 0.08, y: 0, z: 1.25 },
  leftLowerArm: { x: -0.12, y: 0.15, z: 0 },
  leftHand: { x: 0, y: 0, z: 0 },
  rightUpperArm: { x: 0.08, y: 0, z: -1.25 },
  rightLowerArm: { x: -0.12, y: -0.15, z: 0 },
  rightHand: { x: 0, y: 0, z: 0 },
};

const FINGER_NAMES = ["Index", "Middle", "Ring", "Little"];
const FINGER_SEGMENTS = [
  ["Proximal", 0.22],
  ["Intermediate", 0.28],
  ["Distal", 0.14],
] as const;

export default function Character3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedChar, setSelectedChar] = useState<CharacterOption>(CHARACTERS[0]);
  const [loading, setLoading] = useState<boolean>(true);

  // Store references for Three.js instance
  const threeRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animationFrameId: number;

    const initThree = async () => {
      try {
        setLoading(true);

        // Dynamically import Three.js, GLTFLoader, OrbitControls, and @pixiv/three-vrm from ESM CDN
        const THREE = await import(
          /* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/three@0.160.0/+esm" as any
        );
        const { GLTFLoader } = await import(
          /* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm" as any
        );
        const { OrbitControls } = await import(
          /* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js/+esm" as any
        );
        const { VRMLoaderPlugin, VRMUtils } = await import(
          /* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.3.3/+esm" as any
        );

        if (!isMounted || !container) return;

        const width = container.clientWidth || 400;
        const height = container.clientHeight || 550;
        const isMobile = width < 640;

        // 1. Scene
        const scene = new THREE.Scene();

        // 2. Camera: Position closer & higher so the 3D model appears large and clear
        const fov = isMobile ? 32 : 28;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 20.0);
        const camZ = isMobile ? 2.1 : 1.85;
        camera.position.set(0.0, 1.15, camZ);

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

        // 5. Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0.0, 1.05, 0.0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1.0;
        controls.maxDistance = 4.0;
        controls.maxPolarAngle = Math.PI / 2 + 0.1;
        controls.update();

        // Save active state to Ref
        threeRef.current = {
          THREE,
          GLTFLoader,
          OrbitControls,
          VRMLoaderPlugin,
          VRMUtils,
          scene,
          camera,
          renderer,
          controls,
          currentVrm: null,
          time: 0,
          blinkTimer: 0,
          blinkVal: 0,
        };

        // 6. Animation loop (Breathing, Swaying, & Eye Blinking)
        const clock = new THREE.Clock();
        const animate = () => {
          if (!isMounted) return;
          animationFrameId = requestAnimationFrame(animate);
          const delta = clock.getDelta();
          const state = threeRef.current;

          if (state?.currentVrm) {
            const vrm = state.currentVrm;
            state.time += delta;
            const t = state.time;

            // --- Procedural Breathing & Body Sway ---
            const breath = Math.sin(t * 1.5) * 0.012;
            const sway = Math.sin(t * 0.6) * 0.006;
            const microNoise = Math.sin(t * 2.2) * 0.003;

            // Spine & Chest Breathing
            const spine = vrm.humanoid?.getNormalizedBoneNode("spine");
            if (spine) {
              spine.rotation.x = breath;
              spine.rotation.z = sway;
            }

            const chest = vrm.humanoid?.getNormalizedBoneNode("chest");
            if (chest) {
              chest.rotation.x = breath * 0.8;
            }

            const head = vrm.humanoid?.getNormalizedBoneNode("head");
            if (head) {
              head.rotation.y = Math.sin(t * 0.4) * 0.03;
              head.rotation.x = Math.sin(t * 0.8) * 0.015;
            }

            // Natural Arm Resting Pose + Micro Motion
            const leftUpper = vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
            if (leftUpper) {
              leftUpper.rotation.set(
                IDLE_POSE.leftUpperArm.x + microNoise,
                IDLE_POSE.leftUpperArm.y,
                IDLE_POSE.leftUpperArm.z + breath * 0.3
              );
            }

            const leftLower = vrm.humanoid?.getNormalizedBoneNode("leftLowerArm");
            if (leftLower) {
              leftLower.rotation.set(
                IDLE_POSE.leftLowerArm.x,
                IDLE_POSE.leftLowerArm.y,
                IDLE_POSE.leftLowerArm.z
              );
            }

            const rightUpper = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
            if (rightUpper) {
              rightUpper.rotation.set(
                IDLE_POSE.rightUpperArm.x + microNoise,
                IDLE_POSE.rightUpperArm.y,
                IDLE_POSE.rightUpperArm.z - breath * 0.3
              );
            }

            const rightLower = vrm.humanoid?.getNormalizedBoneNode("rightLowerArm");
            if (rightLower) {
              rightLower.rotation.set(
                IDLE_POSE.rightLowerArm.x,
                IDLE_POSE.rightLowerArm.y,
                IDLE_POSE.rightLowerArm.z
              );
            }

            // --- Eye Blinking Loop ---
            state.blinkTimer += delta;
            if (state.blinkTimer > 3.5) {
              state.blinkVal += delta * 12;
              if (state.blinkVal >= Math.PI) {
                state.blinkTimer = 0;
                state.blinkVal = 0;
              }
              const blinkAmount = Math.sin(state.blinkVal);
              vrm.expressionManager?.setValue("blink", blinkAmount);
            } else {
              vrm.expressionManager?.setValue("blink", 0);
            }

            vrm.update(delta);
          }

          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Load Initial Model
        loadModel(selectedChar.vrmUrl);

        // Responsive Resize Handler
        const handleResize = () => {
          if (!container || !camera || !renderer) return;
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;

          const isMob = newWidth < 640;
          camera.fov = isMob ? 32 : 28;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (err) {
        console.warn("Failed to load 3D engine via CDN:", err);
        setLoading(false);
      }
    };

    initThree();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (threeRef.current) {
        const { renderer, currentVrm, scene, VRMUtils } = threeRef.current;
        if (currentVrm && VRMUtils) {
          VRMUtils.deepDispose(currentVrm.scene);
        }
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      }
    };
  }, []);

  // Apply natural arm & finger posture when VRM is loaded
  const applyNaturalPosture = (vrm: any) => {
    if (!vrm) return;

    // Apply Arm Idle Pose
    for (const [boneName, rot] of Object.entries(IDLE_POSE)) {
      const bone = vrm.humanoid?.getNormalizedBoneNode(boneName);
      if (bone) {
        bone.rotation.set(rot.x, rot.y, rot.z);
      }
    }

    // Apply Relaxed Finger Curl
    for (const side of ["left", "right"]) {
      const sign = side === "left" ? 1 : -1;
      for (const finger of FINGER_NAMES) {
        for (const [segment, curl] of FINGER_SEGMENTS) {
          const bone = vrm.humanoid?.getNormalizedBoneNode(side + finger + segment);
          if (bone) {
            bone.rotation.z = curl * sign;
          }
        }
      }
    }
  };

  // Function to load VRM model
  const loadModel = (url: string) => {
    if (!threeRef.current) return;
    const { scene, GLTFLoader, VRMLoaderPlugin, VRMUtils, controls, camera } = threeRef.current;

    setLoading(true);

    // Remove existing VRM if present
    if (threeRef.current.currentVrm) {
      scene.remove(threeRef.current.currentVrm.scene);
      if (VRMUtils) VRMUtils.deepDispose(threeRef.current.currentVrm.scene);
      threeRef.current.currentVrm = null;
    }

    const loader = new GLTFLoader();
    loader.register((parser: any) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf: any) => {
        const vrm = gltf.userData.vrm;
        if (vrm) {
          if (VRMUtils) VRMUtils.rotateVRM0(vrm);
          threeRef.current.currentVrm = vrm;
          scene.add(vrm.scene);

          vrm.scene.position.set(0, 0, 0);

          // Apply natural arms down + relaxed fingers pose
          applyNaturalPosture(vrm);

          if (controls && camera) {
            controls.target.set(0.0, 1.05, 0.0);
            const isMob = (containerRef.current?.clientWidth || 400) < 640;
            camera.position.set(0.0, 1.15, isMob ? 2.1 : 1.85);
            controls.update();
          }
        }
        setLoading(false);
      },
      undefined,
      (error: any) => {
        console.warn("Error loading VRM model:", error);
        setLoading(false);
      }
    );
  };

  const handleSelectCharacter = (char: CharacterOption) => {
    setSelectedChar(char);
    loadModel(char.vrmUrl);
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] md:h-[620px] lg:h-[680px] flex flex-col items-center justify-center">
      {/* 3D Canvas Container - Clean, borderless, seamless */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Indicator Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-slate-950/40 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-medium text-white/90">Memuat Model 3D {selectedChar.name}...</p>
        </div>
      )}

      {/* Bottom Character Selector */}
      <div className="absolute bottom-2 z-20 flex items-center justify-center gap-2 pointer-events-auto">
        {CHARACTERS.map((char) => {
          const isSelected = selectedChar.id === char.id;
          return (
            <button
              key={char.id}
              onClick={() => handleSelectCharacter(char)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
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
