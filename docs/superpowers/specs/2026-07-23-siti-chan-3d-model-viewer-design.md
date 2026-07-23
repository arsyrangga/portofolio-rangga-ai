# Siti-Chan Interactive 3D Model Viewer Design Specification

**Date:** 2026-07-23  
**Status:** Approved  
**Target File:** `src/app/siti-chan/components/Character3DViewer.tsx`, `src/app/siti-chan/page.tsx`

---

## 1. Executive Summary

This document specifies the integration of a Three.js and `@pixiv/three-vrm` based interactive 3D character viewer into the **Siti-Chan Landing Page** (`src/app/siti-chan/page.tsx`). The 3D viewer will showcase VRoid 3D models (`.vrm`) directly in the browser, allowing visitors to rotate, inspect, and switch between characters with realistic lighting, idle animations, and smooth glassmorphic UI overlay.

---

## 2. Technical Architecture & Component Flow

```
[SitiChanLandingPage (page.tsx)]
       │
       └──► [Character3DViewer.tsx]
                 │
                 ├──► Three.js Canvas & Scene
                 ├──► GLTFLoader + @pixiv/three-vrm Plugin
                 ├──► OrbitControls (360 Rotation & Zoom)
                 └──► Character Switcher UI & Loading Overlay
```

### 2.1 Dependencies
- `three`: 3D rendering engine.
- `@types/three`: TypeScript definitions for Three.js.
- `@pixiv/three-vrm`: Official Pixiv parser and renderer extension for VRM format avatars.

---

## 3. Detailed Component Requirements

### 3.1 Character3DViewer (`src/app/siti-chan/components/Character3DViewer.tsx`)
- **React Client Component:** Marked with `"use client"`.
- **Canvas Rendering:** Dynamic Three.js WebGL canvas responsive to screen resize.
- **Lighting & Material:**
  - Ambient Light (intensity: 1.2) for balanced soft illumination.
  - Directional Light (intensity: 1.5) simulating studio key light.
  - Soft background glow with glassmorphic border (`sc-glass-card`).
- **VRM Avatar Handling:**
  - Model loading via `GLTFLoader` configured with `VRMLoaderPlugin`.
  - Automatic centering & camera positioning using bounding box calculations (`VRMUtils.rotateVRM0`).
  - Eye blinking loop & subtle breathing motion using `requestAnimationFrame`.
- **Character Selection & State:**
  - Selector tabs: **Siti-chan**, **Rangga-kun**, **Aoi-chan**.
  - Default model source URLs (hosted VRM models / reliable sample VRMs).
  - Smooth transition loading spinner when switching characters.

---

## 4. Integration Point in Landing Page

- **Hero Section Placement:** The `Character3DViewer` will be placed in the right column of the Hero section, replacing/upgrading static preview visuals.
- **Responsive Layout:**
  - **Desktop (md+):** 50/50 split layout. Left side: Copywriting, CTA buttons. Right side: Interactive 3D Avatar Viewer (500px height).
  - **Mobile:** Stacked layout with 380px height 3D canvas.

---

## 5. Verification Plan

1. **Dependency Installation:** Verify `three` and `@pixiv/three-vrm` install cleanly.
2. **Build Verification:** Run `npm run build` to confirm zero TypeScript compilation errors.
3. **Runtime Verification:** Test 3D canvas rendering, orbit controls rotation, character tab switching, and loading indicator.
