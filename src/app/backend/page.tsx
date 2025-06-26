"use client";

import Hero from "@/components/backend/hero/Hero";
import Navbar from "@/components/backend/navbar/Navbar";
import AOS from "aos";
import { Suspense, useEffect } from "react";
import "aos/dist/aos.css";
import FlareCursor from "@/components/backend/flareCursor/flareComponent";
import Skills from "@/components/backend/skills/Skills";
import Portfolio from "@/components/backend/portfolio/Portfolio";
import Contact from "@/components/backend/contact/Contact";
import Footer from "@/components/backend/footer/Footer";
import Script from "next/script";


export default function Home() {
  useEffect(() => {
    AOS.init();
    window.scroll({ top: 0 });
  }, []);
  return (
    <div className="flex w-100 flex-col justify-center items-center" id="my-background">
      <FlareCursor />
      <Suspense
        fallback={
          <div
            style={{
              background: "red",
              width: "100vw",
              height: "100vh",
              position: "fixed",
              top: 0,
              zIndex: "9999",
            }}
          ></div>
        }
      >
        <main>
          <Navbar />
          <Hero />
          <Skills />
          <Portfolio />
          <Contact />
        </main>
      </Suspense>
      <Footer />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log("Three.js loaded")}
      />

      {/* Load Vanta.js */}
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          window?.VANTA.NET({
            el: "#my-background",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            // color: 0x00FFE1,
            color: 0xFF0285,
            backgroundColor: 0x23004F
          })
        }}
      />
    </div>
  );
}
