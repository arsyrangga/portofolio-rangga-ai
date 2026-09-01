// File: pages/index.js
"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  Award,
  Users,
  BookOpen,
  Eye,
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2,
  Boxes,
  Smartphone,
  Server,
  Cpu,
  ShieldCheck,
  Wrench,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";
import { gradientColors } from "@/constant/gradientColors";
import { medsos } from "@/constant/constant";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, Variants } from "framer-motion";

interface Article {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  thumbnail: string;
  tags: string[];
  views: number;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const Portfolio = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom Cursor / Spotlight
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);
  const [expandedIndex, setExpandedIndex] = useState<null | number>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchSkill, setSearchSkill] = useState<string>("");

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-4 h-4" />;
      case "Boxes":
        return <Boxes className="w-4 h-4" />;
      case "Smartphone":
        return <Smartphone className="w-4 h-4" />;
      case "Server":
        return <Server className="w-4 h-4" />;
      case "Cpu":
        return <Cpu className="w-4 h-4" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4" />;
      case "Wrench":
        return <Wrench className="w-4 h-4" />;
      case "Users":
        return <Users className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const totalSkillsCount = skills.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  const filteredCategories = skills
    .map((category) => {
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return null;
      }

      if (searchSkill.trim()) {
        const query = searchSkill.toLowerCase().trim();
        const matchesCategory =
          category.name.toLowerCase().includes(query) ||
          category.desc.toLowerCase().includes(query);
        const matchingItems = category.items.filter((item) =>
          item.toLowerCase().includes(query)
        );

        if (!matchesCategory && matchingItems.length === 0) {
          return null;
        }

        return {
          ...category,
          filteredItems: matchesCategory ? category.items : matchingItems,
          isCategoryMatch: matchesCategory,
        };
      }

      return {
        ...category,
        filteredItems: category.items,
        isCategoryMatch: false,
      };
    })
    .filter(Boolean) as (typeof skills[0] & {
      filteredItems: string[];
      isCategoryMatch: boolean;
    })[];

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState(false);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleOpenImage = (src: string, title: string) => {
    setSelectedImage({ src, title });
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.75, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.75, 1));
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 2 : 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendToWhatsApp = () => {
    const phoneNumber = "6289673494895";
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=Nama: ${name} \n Email: ${email} \n Pesan: ${text}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
          setArticles(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setArticlesError(true);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden min-h-screen transition-colors duration-200 font-sans relative">
      {/* Global Cursor Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] w-8 h-8 rounded-full bg-primary/30 blur-xl mix-blend-screen hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] w-3 h-3 rounded-full bg-primary mix-blend-screen hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Overlay untuk mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${isScrolled
          ? "bg-background/95 border-b border-border text-foreground shadow-xs"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Rangga Portfolio
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="ml-10 flex items-baseline space-x-6">
                {["home", "about", "skills", "projects", "certificates", "articles", "contact"].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group capitalize font-medium text-sm cursor-pointer"
                    >
                      {section === "skills"
                        ? "Skills"
                        : section === "certificates"
                          ? "Sertifikat"
                          : section === "articles"
                            ? "Artikel"
                            : section}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-200 group-hover:w-full"></span>
                    </button>
                  )
                )}
              </div>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button & Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-200 ease-in-out ${isMobileMenuOpen
            ? "max-h-80 opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
            } overflow-hidden bg-background border-b border-border`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {["home", "about", "skills", "projects", "certificates", "articles", "contact"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 capitalize cursor-pointer"
                >
                  {section === "skills"
                    ? "Skills"
                    : section === "certificates"
                      ? "Sertifikat"
                      : section === "articles"
                        ? "Artikel"
                        : section}
                </button>
              )
            )}
          </div>

          {/* Mobile Social Links */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex space-x-4 justify-center">
              {medsos.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-muted"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden pt-16"
      >
        {/* Ambient Radiant Mesh Glow */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-full blur-3xl opacity-60 animate-pulse-glow" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center z-10 max-w-4xl mx-auto px-4 py-12"
        >
          <motion.div variants={fadeInUp}>
            {/* Profile Avatar with Glowing Ring */}
            <div className="flex justify-center mb-6">
              <div className="relative group inline-block">
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-teal-500/30 blur-sm group-hover:blur-md transition-all duration-500 animate-pulse-glow" />
                <motion.img
                  alt="profile_image"
                  loading="lazy"
                  width="350"
                  height="350"
                  decoding="async"
                  src="/assets/images/rangga.jpg"
                  className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-2 border-border/80 shadow-md transition-transform duration-500"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 px-4 text-foreground">
              Rangga Arsy Prawira
              <br />
              <span className="text-muted-foreground text-xl sm:text-3xl md:text-4xl font-normal block mt-2">
                Full Stack Developer
              </span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Creating high-performance digital products and elegant web applications with modern web standards.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("projects")}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm shadow-xs hover:shadow-md hover:shadow-primary/20 cursor-pointer"
            >
              See Portfolio
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/assets/pdf/cv.pdf"
              className="w-full sm:w-auto border border-border bg-background text-foreground hover:bg-muted px-6 py-2.5 rounded-lg font-medium text-sm shadow-xs hover:shadow-sm"
              download={true}
            >
              Download CV
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-60">
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce cursor-pointer hover:scale-125 transition-transform" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30 border-y border-border">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              About Me
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              I am a Full-Stack Developer with over 4 years of experience,
              skilled in building responsive, SEO-friendly interfaces and writing clean, maintainable code.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div variants={fadeInUp}>
              <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6">
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                  Background
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  I am a Full Stack Developer with a passion for creating
                  innovative digital solutions. With more than 3 years of
                  experience in web development, I have worked with various
                  modern technologies to deliver production-ready software.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Next.js", "JavaScript"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Core Strengths & Focus
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="group p-3.5 rounded-lg bg-muted/40 border border-border/80 hover:border-foreground/30 hover:shadow-sm transition-colors space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <div className="p-1 rounded-md bg-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                        <Code2 className="w-4 h-4 text-blue-500" />
                      </div>
                      <span>Full Stack & Mobile</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      React, Next.js, Kotlin, Swift, React Native
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="group p-3.5 rounded-lg bg-muted/40 border border-border/80 hover:border-foreground/30 hover:shadow-sm transition-colors space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <div className="p-1 rounded-md bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                        <Server className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span>Cloud & Backend</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Node.js, Golang, GCP Cloud Run, SQL/NoSQL
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="group p-3.5 rounded-lg bg-muted/40 border border-border/80 hover:border-foreground/30 hover:shadow-sm transition-colors space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <div className="p-1 rounded-md bg-rose-500/10 group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                      </div>
                      <span>Security & Quality</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SonarQube, Jest, Incident Response, Risk Mgmt
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="group p-3.5 rounded-lg bg-muted/40 border border-border/80 hover:border-foreground/30 hover:shadow-sm transition-colors space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                      <div className="p-1 rounded-md bg-teal-500/10 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-4 h-4 text-teal-500" />
                      </div>
                      <span>Agile & Delivery</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Project Planning, Mentoring, Task Prioritization
                    </p>
                  </motion.div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Explore all 8 domains & {totalSkillsCount} skills
                  </span>
                  <button
                    onClick={() => scrollToSection("skills")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group"
                  >
                    View Full Skillset <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-background relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute top-1/3 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border mb-3 shadow-2xs animate-float">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Technical Arsenal • {totalSkillsCount} Skills across 8 Domains</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Skills & Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              A comprehensive directory of programming languages, frameworks, cloud architecture, and engineering practices I utilize in production.
            </p>
          </motion.div>

          {/* Search and Category Filter Controls */}
          <motion.div variants={fadeInUp} className="mb-10 space-y-4">
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Search any skill, tool, or technology (e.g. Kotlin, Golang, Jest, GCP)..."
                className="w-full pl-10 pr-9 py-2.5 bg-card border border-input text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-all shadow-2xs hover:border-foreground/30"
              />
              {searchSkill && (
                <button
                  onClick={() => setSearchSkill("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-transform cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-border"
                  }`}
              >
                All Domains ({totalSkillsCount})
              </motion.button>
              {skills.map((cat) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-border"
                    }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full transition-colors ${selectedCategory === cat.id
                      ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                      : "bg-background text-muted-foreground border border-border"
                      }`}
                  >
                    {cat.items.length}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Grid of Skill Categories */}
          {filteredCategories.length === 0 ? (
            <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-10 text-center max-w-md mx-auto shadow-2xs">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-60 animate-bounce" />
              <p className="text-sm font-semibold text-foreground mb-1">
                No matching skills found
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                No skill or technology matched "{searchSkill}". Try clearing your search or looking across all domains.
              </p>
              <button
                onClick={() => {
                  setSearchSkill("");
                  setSelectedCategory("all");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                Reset Filter & Search
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((category) => (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  key={category.id}
                  className="bg-card text-card-foreground border border-border shadow-2xs rounded-xl p-5 hover:border-foreground/30 hover:shadow-lg transition-colors flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Ambient Card Glow */}
                  <div
                    className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500 ease-out"
                    style={{ backgroundColor: category.color }}
                  />

                  {/* Top Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: category.color }}
                  />

                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="p-2 rounded-lg bg-muted border border-border text-foreground group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0"
                        >
                          {getCategoryIcon(category.icon)}
                        </div>
                        <div className="flex items-center min-w-0">
                          <span
                            className="relative flex h-2 w-2 mr-2 flex-shrink-0"
                          >
                            <span
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{ backgroundColor: category.color }}
                            />
                            <span
                              className="relative inline-flex rounded-full h-2 w-2"
                              style={{ backgroundColor: category.color }}
                            />
                          </span>
                          <h3 className="text-sm font-bold tracking-tight text-foreground truncate">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border flex-shrink-0 group-hover:border-foreground/20 transition-colors">
                        {category.filteredItems.length}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[32px]">
                      {category.desc}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {category.filteredItems.map((item) => {
                        const isMatched =
                          searchSkill.trim() &&
                          item
                            .toLowerCase()
                            .includes(searchSkill.toLowerCase().trim());
                        return (
                          <motion.span
                            whileHover={{ scale: 1.1, y: -2 }}
                            key={item}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-default ${isMatched
                              ? "bg-primary text-primary-foreground font-semibold ring-2 ring-primary/40 shadow-xs animate-pulse"
                              : "bg-secondary text-secondary-foreground border border-border/80 hover:bg-muted hover:border-foreground/30 shadow-2xs"
                              }`}
                          >
                            {item}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-background">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              A collection of digital products, applications, and web services I've engineered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                key={project.title}
                className="bg-card text-card-foreground border border-border shadow-2xs rounded-xl overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-colors flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div
                  className="h-44 bg-muted relative border-b border-border overflow-hidden group cursor-pointer"
                  onClick={() =>
                    handleOpenImage(
                      project.image ||
                      `https://picsum.photos/400/200?random=${index}`,
                      project.title
                    )
                  }
                >
                  <img
                    src={
                      project.image ||
                      `https://picsum.photos/400/200?random=${index}`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    style={{ objectPosition: "0% 5%" }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-background/90 text-foreground p-2.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-md border border-border">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                      {expandedIndex === index ||
                        project.description.length <= 130
                        ? project.description
                        : `${project.description.slice(0, 130)}...`}
                      {project.description.length > 130 && (
                        <button
                          className="text-foreground hover:underline ml-1 font-medium cursor-pointer"
                          onClick={() =>
                            setExpandedIndex(
                              expandedIndex === index ? null : index
                            )
                          }
                        >
                          {expandedIndex === index ? "Less" : "More"}
                        </button>
                      )}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:scale-105 hover:bg-secondary hover:text-foreground transition-all duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link !== "#" && project.link && (
                      <button
                        className="text-xs font-semibold text-foreground hover:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer group/btn"
                        onClick={() => {
                          window.open(project.link, "_blank");
                        }}
                      >
                        View Project <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 bg-muted/30 border-y border-border">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Licenses & Certificates
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Verified certifications and industry credentials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                key={cert.title}
                className="bg-card text-card-foreground border border-border shadow-2xs rounded-xl p-5 hover:border-foreground/30 hover:shadow-lg transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-muted border border-border group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border">
                      {cert.date}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-base font-semibold tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-xs mb-2">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      <span>{cert.issuer}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                      {cert.description}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border hover:scale-105 hover:bg-muted transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Credential ID
                        </p>
                        <p className="text-xs font-mono text-foreground font-medium">
                          {cert.credentialId}
                        </p>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all p-1"
                        onClick={() => window.open(cert.link)}
                        title="View Certificate"
                      >
                        <ExternalLink className="w-4 h-4 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certificate Summary */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6 max-w-xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-foreground mr-2" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  Achievements Summary
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center divide-x divide-border">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {certificates.length}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">Certificates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-muted-foreground text-xs mt-1">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">15+</div>
                  <div className="text-muted-foreground text-xs mt-1">Technologies</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-background">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Latest Articles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Articles, technical insights, and digital tutorials published on Blogyra.
            </p>
          </motion.div>

          {isLoadingArticles ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border shadow-xs rounded-xl p-5 animate-pulse space-y-4"
                >
                  <div className="h-40 bg-muted rounded-lg w-full"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : articlesError || articles.length === 0 ? (
            <div className="bg-card border border-border shadow-xs rounded-xl p-8 text-center max-w-md mx-auto">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Unable to load articles
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Visit Blogyra directly to read our latest publications.
              </p>
              <a
                href="https://blogyra.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Visit Blogyra <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  key={article.slug || index}
                  className="bg-card text-card-foreground border border-border shadow-2xs rounded-xl overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-colors flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="h-44 bg-muted relative border-b border-border overflow-hidden">
                      <img
                        src={
                          article.thumbnail.startsWith("http")
                            ? article.thumbnail
                            : `https://blogyra.site${article.thumbnail}`
                        }
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://blogyra.site/icon/icon.png";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 bg-background/90 backdrop-blur-xs text-foreground text-xs font-medium rounded-full border border-border shadow-xs">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views || 0}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold tracking-tight text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-4">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <a
                      href={`https://blogyra.site/blog/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition-colors group/link"
                    >
                      Read Article <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer CTA */}
          {!articlesError && articles.length > 0 && (
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <a
                href="https://blogyra.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium transition-all shadow-xs"
              >
                View All Articles on Blogyra <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Get In Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Let's connect and collaborate on your next project.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6 space-y-5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Mail,
                        label: "Email",
                        value: "arsyrangga@gmail.com",
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: "+6289673494895",
                      },
                      {
                        icon: MapPin,
                        label: "Location",
                        value: "Jakarta, Indonesia",
                      },
                    ].map((contact) => (
                      <div key={contact.label} className="flex items-center">
                        <div className="p-2.5 rounded-lg bg-muted border border-border mr-3.5">
                          <contact.icon className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{contact.label}</p>
                          <p className="text-sm font-medium text-foreground">
                            {contact.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6 space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary placeholder:text-muted-foreground transition-all hover:border-foreground/30"
                      onInput={(e) => setName(e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary placeholder:text-muted-foreground transition-all hover:border-foreground/30"
                      onInput={(e) => setEmail(e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Pesan Anda"
                      rows={4}
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary placeholder:text-muted-foreground transition-all hover:border-foreground/30 resize-none"
                      onInput={(e) => setMessage(e.currentTarget.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendToWhatsApp}
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] py-2.5 rounded-lg font-medium text-sm shadow-xs hover:shadow-md hover:shadow-primary/20 transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Rangga Arsy Prawira. All rights reserved.</p>
            <div className="flex space-x-6">
              {medsos.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium"
                >
                  <social.icon className="w-3.5 h-3.5" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-card border border-border shadow-2xl rounded-2xl overflow-hidden text-card-foreground p-3 sm:p-5 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border mb-2 flex-shrink-0 gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight truncate max-w-[45%]">
                {selectedImage.title}
              </h3>

              {/* Controls */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="flex items-center bg-muted border border-border rounded-lg p-0.5">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 text-foreground font-medium min-w-[42px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2.5}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {zoomLevel > 1 && (
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-all cursor-pointer border-l border-border ml-0.5"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-1"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Touch Hint */}
            <p className="text-[11px] text-muted-foreground text-center mb-2 flex-shrink-0 sm:hidden">
              Ketuk gambar atau gunakan tombol + / - untuk perbesar • Geser untuk pan
            </p>

            {/* Image Box with Scroll / Touch Pan Support */}
            <div className="relative flex-1 overflow-auto rounded-xl bg-muted/40 border border-border p-4 min-h-[300px] select-none">
              <div
                className="transition-all duration-200 flex items-center justify-center m-auto"
                style={{
                  width: zoomLevel === 1 ? "100%" : `${zoomLevel * 100}%`,
                  minWidth: zoomLevel === 1 ? "100%" : `${zoomLevel * 100}%`,
                  minHeight: zoomLevel === 1 ? "auto" : `${zoomLevel * 100}%`,
                }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  onClick={handleToggleZoom}
                  style={{
                    maxHeight: zoomLevel === 1 ? "70vh" : "none",
                    maxWidth: zoomLevel === 1 ? "100%" : "none",
                    width: zoomLevel === 1 ? "auto" : "100%",
                  }}
                  className={`rounded-lg shadow-xs transition-all duration-200 ${zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
