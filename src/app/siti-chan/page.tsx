"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import {
  MessageSquare,
  Mic,
  Camera,
  Globe,
  Users,
  Sparkles,
  ChevronDown,
  Star,
  Shield,
  Zap,
  Download,
  ExternalLink,
  Mail,
} from "lucide-react";
import Character3DViewer from "./components/Character3DViewer";
import "./siti-chan.css";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sitichan.app";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Chat 3D Interaktif",
    desc: "Ngobrol dengan avatar 3D yang ekspresif. Setiap karakter punya kepribadian unik dan bisa menunjukkan emosi secara real-time.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "#00f2fe",
  },
  {
    icon: Mic,
    title: "Voice Chat",
    desc: "Bicara langsung menggunakan suaramu! Teknologi Speech-to-Text & Text-to-Speech membuat percakapan terasa alami.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "#a855f7",
  },
  {
    icon: Camera,
    title: "AR Mode",
    desc: "Tampilkan avatar favoritmu di dunia nyata dengan Augmented Reality. Ambil foto bersama menggunakan kamera!",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "#f472b6",
  },
  {
    icon: Globe,
    title: "31 Bahasa",
    desc: "Dari Bahasa Indonesia, English, 日本語, hingga العربية — pilih bahasa yang kamu inginkan.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "#10b981",
  },
  {
    icon: Users,
    title: "5 Karakter Unik",
    desc: "Pilih teman bicara sesuai seleramu. Masing-masing punya suara, kepribadian, dan penampilan yang berbeda.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "#f59e0b",
  },
  {
    icon: Sparkles,
    title: "Emosi & Ekspresi",
    desc: "Avatar akan menunjukkan emosi — senang, sedih, tertawa, terkejut — sesuai konteks percakapan.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconColor: "#4facfe",
  },
];

const CHARACTERS = [
  {
    id: "siti",
    name: "Siti-Chan",
    desc: "Teman bicara yang lemah lembut, sopan, dan hangat. Dia siap menemani obrolan santaimu sehari-hari.",
    personality: "Lembut & Hangat",
    color: "#00f2fe",
    emoji: "💙",
  },
  {
    id: "hana",
    name: "Hana-Chan",
    desc: "Gadis ceria yang ekspresif dan penuh energi positif! Suaranya imut dan dia selalu antusias mendengarmu.",
    personality: "Ceria & Energik",
    color: "#f472b6",
    emoji: "🌸",
  },
  {
    id: "iroha",
    name: "Iroha-Chan",
    desc: "Sosok tenang, dewasa, dan penuh perhatian. Bicaranya lembut dan menenangkan pikiran yang sedang lelah.",
    personality: "Tenang & Dewasa",
    color: "#a855f7",
    emoji: "🦋",
  },
  {
    id: "victoria",
    name: "Victoria-Chan",
    desc: "Gadis anggun dengan wibawa elegan dan berkelas. Berbicara dengan bahasa yang teratur namun tetap ramah.",
    personality: "Anggun & Elegan",
    color: "#f59e0b",
    emoji: "👑",
  },
  {
    id: "vivi",
    name: "Vivi-Chan",
    desc: "Gadis kecil lincah yang menggemaskan, lincah, dan sedikit manja. Bicaranya imut dengan intonasi anak-anak.",
    personality: "Imut & Lincah",
    color: "#10b981",
    emoji: "🍀",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Download & Login",
    desc: "Install Siti-Chan dari Google Play Store dan login dengan akun Google-mu atau langsung masuk sebagai tamu.",
    icon: Download,
  },
  {
    num: "02",
    title: "Pilih Karakter",
    desc: "Jelajahi 5 karakter avatar 3D unik dan pilih teman bicara yang paling sesuai dengan kepribadianmu.",
    icon: Users,
  },
  {
    num: "03",
    title: "Mulai Ngobrol!",
    desc: "Ketik pesan atau gunakan voice chat. Avatar akan merespons dengan suara dan ekspresi yang hidup!",
    icon: MessageSquare,
  },
];

const LANGUAGES_SAMPLE = [
  "🇬🇧 English",
  "🇮🇩 Indonesia",
  "🇯🇵 日本語",
  "🇰🇷 한국어",
  "🇫🇷 Français",
  "🇩🇪 Deutsch",
  "🇪🇸 Español",
  "🇮🇹 Italiano",
  "🇧🇷 Português",
  "🇷🇺 Русский",
  "🇸🇦 العربية",
  "🇮🇳 हिन्दी",
  "🇹🇷 Türkçe",
  "🇻🇳 Tiếng Việt",
  "🇳🇱 Nederlands",
  "🇸🇪 Svenska",
];

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */

function SectionTitle({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      className="text-center mb-16 md:mb-20"
    >
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase sc-glass-sm mb-6"
        style={{ color: "var(--sc-accent)" }}
      >
        {badge}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 sc-gradient-text">
        {title}
      </h2>
      <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "var(--sc-text-muted)" }}>
        {subtitle}
      </p>
    </motion.div>
  );
}

function Floating3DElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none sc-hero-3d-container">
      {/* Cube */}
      <div className="absolute top-[15%] left-[8%] md:left-[12%] sc-float-cube">
        <div className="sc-cube-face" />
        <div className="sc-cube-face" />
        <div className="sc-cube-face" />
        <div className="sc-cube-face" />
        <div className="sc-cube-face" />
        <div className="sc-cube-face" />
      </div>

      {/* Ring */}
      <div className="absolute top-[20%] right-[10%] md:right-[15%]">
        <div className="sc-float-ring" />
      </div>

      {/* Pyramid */}
      <div className="absolute bottom-[25%] left-[15%] md:left-[20%]">
        <div className="sc-float-pyramid" />
      </div>

      {/* Second smaller cube */}
      <div className="absolute bottom-[20%] right-[8%] md:right-[18%] sc-float-cube" style={{ animationDelay: "-4s", width: 50, height: 50 }}>
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
        <div className="sc-cube-face" style={{ width: 50, height: 50, borderColor: "rgba(168, 85, 247, 0.25)" }} />
      </div>

      {/* Orbit dots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <div className="sc-orbit-dot absolute" />
        <div className="sc-orbit-dot absolute" />
        <div className="sc-orbit-dot absolute" />
      </div>

      {/* Background orbs */}
      <div className="sc-orb sc-orb-1 top-[10%] left-[-5%]" />
      <div className="sc-orb sc-orb-2 top-[50%] right-[-10%]" />
      <div className="sc-orb sc-orb-3 bottom-[5%] left-[30%]" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function SitiChanLandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <div className="sc-page sc-grid-bg min-h-screen">
      {/* ═══════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        id="hero"
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--sc-gradient-hero)" }}
        />

        <Floating3DElements />

        {/* Content */}
        <div className="relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* App icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
                  style={{ background: "var(--sc-gradient-accent)" }}
                />
                <Image
                  src="/assets/siti-chan/icon.png"
                  alt="Siti-Chan App Icon"
                  width={100}
                  height={100}
                  className="relative rounded-3xl shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tight"
            >
              <span className="sc-gradient-text">Siti-Chan</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg sm:text-xl font-light mb-3 max-w-xl mx-auto lg:mx-0"
              style={{ color: "var(--sc-text-muted)" }}
            >
              Teman Bicara Virtual 3D — Interaktif, Ekspresif, & Cerdas
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-sm md:text-base mb-8 max-w-lg mx-auto lg:mx-0"
              style={{ color: "var(--sc-text-muted)", opacity: 0.7 }}
            >
              AI companion dengan avatar 3D VRM, voice chat, AR mode, dan dukungan 31 bahasa.
              Gratis di Google Play!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sc-glow-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
                style={{
                  background: "var(--sc-gradient-accent)",
                  color: "#050816",
                }}
                id="hero-download-btn"
              >
                <Download className="w-5 h-5" />
                Download di Google Play
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base sc-glass-sm hover:bg-white/5 transition-all"
                style={{ color: "var(--sc-accent)" }}
                id="hero-learn-more-btn"
              >
                <Sparkles className="w-5 h-5" />
                Pelajari Fitur
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12"
            >
              {[
                { value: "5", label: "Karakter", icon: "✨" },
                { value: "31", label: "Bahasa", icon: "🌐" },
                { value: "3D", label: "Avatar VRM", icon: "🎭" },
                { value: "AR", label: "Mode", icon: "📱" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold sc-gradient-text sc-stat-number">
                    {stat.icon} {stat.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--sc-text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Model Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 w-full"
          >
            <Character3DViewer />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 sc-bounce"
        >
          <ChevronDown
            className="w-6 h-6"
            style={{ color: "var(--sc-text-muted)" }}
          />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="features">
        <div className="sc-orb sc-orb-2 top-[20%] left-[-15%]" />

        <div className="max-w-6xl mx-auto">
          <SectionTitle
            badge="Fitur Unggulan"
            title="Lebih Dari Sekadar Chatbot"
            subtitle="Siti-Chan menghadirkan pengalaman percakapan yang hidup dengan avatar 3D interaktif, suara natural, dan teknologi AR."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <FeatureCard key={feat.title} feat={feat} Icon={Icon} index={i} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CHARACTERS SECTION
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="characters">
        <div className="sc-orb sc-orb-1 bottom-[10%] right-[-10%]" />

        <div className="max-w-6xl mx-auto">
          <SectionTitle
            badge="Karakter"
            title="Pilih Teman Bicaramu"
            subtitle="5 karakter unik dengan kepribadian berbeda. Siapa yang akan menemanimu hari ini?"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {CHARACTERS.map((char, i) => (
              <CharacterCard key={char.id} char={char} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS SECTION
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="how-it-works">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            badge="Cara Pakai"
            title="Mulai dalam 3 Langkah"
            subtitle="Tanpa ribet, tanpa registrasi panjang. Langsung ngobrol dengan AI companion 3D favoritmu."
          />

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          MULTILINGUAL SECTION
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="languages">
        <div className="sc-orb sc-orb-3 top-[30%] left-[-5%]" />

        <div className="max-w-6xl mx-auto">
          <SectionTitle
            badge="Multilingual"
            title="Bicara dalam Bahasamu"
            subtitle="Dukungan 31 bahasa dengan teknologi TTS Supertonic-3 yang natural."
          />

          <LanguageOrbit />
        </div>
      </section>

      {/* ═══════════════════════════════════
          TECH HIGHLIGHTS
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="tech">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            badge="Teknologi"
            title="Dibangun dengan Teknologi Terbaik"
            subtitle="Siti-Chan menggunakan stack teknologi modern untuk pengalaman terbaik."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "On-Device AI",
                desc: "Model AI berjalan langsung di perangkatmu. Percakapan privat tanpa dikirim ke cloud.",
                color: "#f59e0b",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Data percakapanmu tidak disimpan di server. Semua tetap di perangkatmu.",
                color: "#10b981",
              },
              {
                icon: Star,
                title: "VRM 3D Engine",
                desc: "Avatar 3D berkualitas tinggi dengan ekspresi wajah, gestur, dan lip-sync real-time.",
                color: "#a855f7",
              },
            ].map((tech, i) => {
              const Icon = tech.icon;
              return (
                <TechCard key={tech.title} tech={tech} Icon={Icon} index={i} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA DOWNLOAD SECTION
         ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6" id="download">
        <div className="max-w-3xl mx-auto text-center">
          <CTASection />
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
         ═══════════════════════════════════ */}
      <footer
        className="border-t py-12 px-6"
        style={{ borderColor: "var(--sc-border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/siti-chan/icon.png"
              alt="Siti-Chan"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-semibold sc-gradient-text">Siti-Chan</span>
            <span className="text-sm" style={{ color: "var(--sc-text-muted)" }}>
              v1.0.2
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--sc-text-muted)" }}>
            <a
              href="/privacy-siti.html"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Google Play
            </a>
            <a
              href="mailto:arsyrangga@gmail.com"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
          </div>

          <div className="text-sm" style={{ color: "var(--sc-text-muted)" }}>
            © 2026 RANGGA AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FEATURE CARD
   ═══════════════════════════════════════════ */

function FeatureCard({
  feat,
  Icon,
  index,
}: {
  feat: (typeof FEATURES)[0];
  Icon: typeof MessageSquare;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleUp}
      custom={index}
      className="sc-tilt-card"
    >
      <div className={`sc-tilt-card-inner sc-glass p-7 h-full bg-gradient-to-br ${feat.gradient}`}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: `${feat.iconColor}15`,
            boxShadow: `0 0 20px ${feat.iconColor}20`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: feat.iconColor }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--sc-text)" }}>
          {feat.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sc-text-muted)" }}>
          {feat.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   CHARACTER CARD
   ═══════════════════════════════════════════ */

function CharacterCard({
  char,
  index,
}: {
  char: (typeof CHARACTERS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleUp}
      custom={index}
      className="sc-char-card"
    >
      <div
        className="sc-char-card-inner sc-glass p-6 text-center h-full"
        style={{
          background: `linear-gradient(135deg, ${char.color}08 0%, ${char.color}03 100%)`,
          borderColor: `${char.color}20`,
        }}
      >
        {/* Avatar Emoji placeholder */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{
            background: `linear-gradient(135deg, ${char.color}20, ${char.color}08)`,
            boxShadow: `0 0 30px ${char.color}15`,
          }}
        >
          {char.emoji}
        </div>

        <h3 className="font-bold text-base mb-1" style={{ color: char.color }}>
          {char.name}
        </h3>

        <span
          className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3 sc-shimmer"
          style={{
            background: `${char.color}15`,
            color: char.color,
          }}
        >
          {char.personality}
        </span>

        <p className="text-xs leading-relaxed" style={{ color: "var(--sc-text-muted)" }}>
          {char.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP CARD
   ═══════════════════════════════════════════ */

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index}
      className="sc-step-line"
    >
      <div className="flex gap-6 items-start">
        {/* Step number circle */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, rgba(0,242,254,0.15), rgba(79,172,254,0.1))",
            color: "var(--sc-accent)",
            boxShadow: "0 0 20px rgba(0,242,254,0.1)",
          }}
        >
          {step.num}
        </div>

        <div className="sc-glass p-6 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5" style={{ color: "var(--sc-accent)" }} />
            <h3 className="font-bold text-lg" style={{ color: "var(--sc-text)" }}>
              {step.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--sc-text-muted)" }}>
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   LANGUAGE ORBIT
   ═══════════════════════════════════════════ */

function LanguageOrbit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
    >
      {/* Globe visualization */}
      <div className="relative flex justify-center items-center mb-12">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full sc-globe-ring"
            style={{
              border: "2px solid rgba(0, 242, 254, 0.1)",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-6 rounded-full sc-globe-ring-reverse"
            style={{
              border: "2px dashed rgba(168, 85, 247, 0.12)",
            }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-12 rounded-full sc-globe-ring"
            style={{
              border: "1px solid rgba(79, 172, 254, 0.1)",
              animationDuration: "20s",
            }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,242,254,0.15), rgba(168,85,247,0.1))",
                boxShadow: "0 0 40px rgba(0,242,254,0.15)",
              }}
            >
              <Globe className="w-10 h-10" style={{ color: "var(--sc-accent)" }} />
            </div>
          </div>

          {/* Floating language tags around the globe */}
          {LANGUAGES_SAMPLE.slice(0, 8).map((lang, i) => {
            const angle = (i / 8) * 360;
            const radius = 52; // percentage from center
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
            return (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="absolute sc-glass-sm px-2 py-1 text-[10px] md:text-xs whitespace-nowrap font-medium"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  color: "var(--sc-text-muted)",
                }}
              >
                {lang}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Language grid below */}
      <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
        {LANGUAGES_SAMPLE.map((lang, i) => (
          <motion.span
            key={lang}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.04 }}
            className="sc-glass-sm px-3 py-1.5 text-xs md:text-sm font-medium hover:bg-white/5 transition-colors cursor-default"
            style={{ color: "var(--sc-text-muted)" }}
          >
            {lang}
          </motion.span>
        ))}
        <span
          className="sc-glass-sm px-3 py-1.5 text-xs md:text-sm font-bold"
          style={{ color: "var(--sc-accent)" }}
        >
          +15 lainnya
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TECH CARD
   ═══════════════════════════════════════════ */

function TechCard({
  tech,
  Icon,
  index,
}: {
  tech: { icon: typeof Zap; title: string; desc: string; color: string };
  Icon: typeof Zap;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index}
      className="sc-tilt-card"
    >
      <div className="sc-tilt-card-inner sc-glass p-7 text-center h-full">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: `${tech.color}15`,
            boxShadow: `0 0 25px ${tech.color}15`,
          }}
        >
          <Icon className="w-7 h-7" style={{ color: tech.color }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--sc-text)" }}>
          {tech.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sc-text-muted)" }}>
          {tech.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════ */

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
    >
      {/* Pulsing background */}
      <div className="relative inline-block mb-8">
        <div
          className="absolute inset-0 rounded-full sc-pulse-ring"
          style={{
            background: "radial-gradient(circle, rgba(0,242,254,0.2), transparent 70%)",
            width: 160,
            height: 160,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <Image
          src="/assets/siti-chan/icon.png"
          alt="Download Siti-Chan"
          width={100}
          height={100}
          className="relative rounded-3xl shadow-2xl"
        />
      </div>

      <h2 className="text-3xl md:text-5xl font-bold mb-4 sc-gradient-text">
        Siap Ngobrol?
      </h2>
      <p
        className="text-base md:text-lg mb-10 max-w-md mx-auto"
        style={{ color: "var(--sc-text-muted)" }}
      >
        Download Siti-Chan sekarang dan temukan teman bicara virtual 3D
        yang selalu ada untukmu.
      </p>

      {/* Big download button */}
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sc-glow-btn inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-bold text-lg transition-all"
        style={{
          background: "var(--sc-gradient-accent)",
          color: "#050816",
        }}
        id="cta-download-btn"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="currentColor"
        >
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
        </svg>
        Download di Google Play
        <ExternalLink className="w-5 h-5 opacity-60" />
      </a>

      {/* Sub info */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs" style={{ color: "var(--sc-text-muted)" }}>
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
          Gratis
        </span>
        <span>Android 8.0+</span>
        <span>v1.0.2</span>
        <span>~80 MB</span>
      </div>
    </motion.div>
  );
}
