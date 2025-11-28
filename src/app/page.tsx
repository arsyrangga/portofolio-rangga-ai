<<<<<<< HEAD
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
  Twitter,
  ExternalLink,
  Menu,
  X,
  Award,
  Calendar,
  Users,
} from "lucide-react";
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { certificates } from '@/data/certificates';
import { gradientColors } from '@/data/gradientColors';

const Portfolio = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<null | number>(null);useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const observerOptions = {
    threshold: 0.01,
    rootMargin: "50px 0px 50px 0px", // mobile friendly
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log("OBSERVE:", entry.target.id, entry.isIntersecting);
      if (entry.isIntersecting) {
        setVisibleSections((prev) => new Set([...prev, entry.target.id]));
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => observer.observe(section));

  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
    observer.disconnect();
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
    <div className="bg-slate-900 text-white overflow-x-hidden">
      {/* Overlay untuk mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Rangga Portfolio
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {["home", "about", "projects", "certificates", "contact"].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className="hover:text-blue-400 transition-colors duration-300 relative group capitalize"
                    >
                      {section === "certificates" ? "Sertifikat" : section}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-80 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {["home", "about", "projects", "certificates", "contact"].map(
              (section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 capitalize transform ${
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {section === "certificates" ? "Sertifikat" : section}
                </button>
              )
            )}
          </div>

          {/* Mobile Social Links */}
          <div className="border-t border-slate-800/50 px-4 py-3">
            <div className="flex space-x-4 justify-center">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="text-slate-400 hover:text-blue-400 transition-colors duration-300 p-2 rounded-full hover:bg-slate-800"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden pt-16"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full animate-bounce"></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-cyan-500/10 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto px-4">
                <div
            className={`transition-all duration-1000 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex justify-center mb-6">
              <img
                alt="profile_image"
                loading="lazy"
                width="350"
                height="350"
                decoding="async"
                src="https://rangga.tech/assets/images/rangga_arsy_prawira.png"
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Rangga Arsy Prawira
              </span>
              <br />
              <span className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl">Full Stack Developer</span>
            </h1>
          </div>
          <div
            className={`transition-all duration-1000 delay-300 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Creating amazing digital experiences with modern technology.
            </p>
          </div>
          <div
            className={`transition-all duration-1000 delay-500 space-x-4 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              Lihat Portfolio
            </button>
            <button className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Download CV
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("about")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Tentang Saya
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Organized and dependable candidate successful at managing multiple
              priorities with a positive attitude. Willingness to take on added
              responsibilities to meet team goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 delay-200 ${
                visibleSections.has("about")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">
                  Background
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  I am a Full Stack Developer with a passion for creating
                  innovative digital solutions. With more than 3 years of
                  experience in web development, I have worked with various
                  modern technologies.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Next.js", "JavaScript"].map(
                    (tech, index) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 rounded-full text-sm ${
                          index === 0
                            ? "bg-blue-600/20 text-blue-400"
                            : index === 1
                            ? "bg-green-600/20 text-green-400"
                            : index === 2
                            ? "bg-purple-600/20 text-purple-400"
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}
                      >
                        {tech}a
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-400 ${
                visibleSections.has("about")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-xl p-6 transform hover:translate-x-2 transition-all duration-300`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-3 h-3 rounded-full mr-3`}
                        style={{
                          backgroundColor: skill.color,
                        }}
                      ></div>
                      <h4 className="text-xl font-semibold">{skill.name}</h4>
                    </div>
                    <p className="text-slate-300">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("projects")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Throughout my career, I’ve had the opportunity to collaborate on a
              diverse range of projects—each one presenting unique challenges,
              creative solutions, and valuable lessons.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 group ${
                  visibleSections.has("projects")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Image Section */}
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                  <img
                    src={
                      project.image ||
                      `https://picsum.photos/400/200?random=${index}`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: "0% 5%" }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                  {/* Gradient overlay untuk blend dengan theme */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  {/* Icon atau badge di corner */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-8 h-8 bg-${project.color}-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse`}
                    >
                      <div
                        className={`w-3 h-3 bg-${project.color}-400 rounded-full`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3
                    className={`text-xl font-bold mb-2 text-${project.color}-400`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-slate-300 mb-4">
                    {expandedIndex === index ||
                    project.description.length <= 150
                      ? project.description
                      : `${project.description.slice(0, 150)}...`}
                    {project.description.length > 150 && (
                      <button
                        className={`text-${project.color}-400 hover:underline ml-1`}
                        onClick={() =>
                          setExpandedIndex(
                            expandedIndex === index ? null : index
                          )
                        }
                      >
                        {expandedIndex === index ? "See Less" : "See More"}
                      </button>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 rounded text-xs ${
                          techIndex === 0
                            ? "bg-blue-600/20 text-blue-400"
                            : techIndex === 1
                            ? "bg-green-600/20 text-green-400"
                            : "bg-purple-600/20 text-purple-400"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`text-${project.color}-400 hover:text-${project.color}-300 font-semibold transition-colors duration-300 flex items-center gap-2`}
                  >
                    View Project <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("certificates")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Licenses & Certificates
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Certifications and achievements in technology development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <div
                key={cert.title}
                className={`bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-6 transform hover:scale-105 transition-all duration-500 group relative overflow-hidden ${
                  visibleSections.has("certificates")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Certificate Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br  ${
                      gradientColors[cert.color as keyof typeof gradientColors]
                        .from
                    } ${
                      gradientColors[cert.color as keyof typeof gradientColors]
                        .to
                    } rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className={`px-3 py-1 bg-${cert.color}-600/20 text-${cert.color}-400 rounded-full text-sm font-medium`}
                  >
                    {cert.date}
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="mb-4">
                  <h3
                    className={`text-xl font-bold mb-2 text-${cert.color}-400 group-hover:text-${cert.color}-300 transition-colors duration-300`}
                  >
                    {cert.title}
                  </h3>
                  <div className="flex items-center text-slate-300 mb-3">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{cert.issuer}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {cert.description}
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className={`px-2 py-1 rounded text-xs ${
                        skillIndex % 4 === 0
                          ? "bg-blue-600/20 text-blue-400"
                          : skillIndex % 4 === 1
                          ? "bg-green-600/20 text-green-400"
                          : skillIndex % 4 === 2
                          ? "bg-purple-600/20 text-purple-400"
                          : "bg-orange-600/20 text-orange-400"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Credential ID */}
                <div className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        Credential ID
                      </p>
                      <p className="text-sm font-mono text-slate-300">
                        {cert.credentialId}
                      </p>
                    </div>
                    <button
                      className={`text-${cert.color}-400 hover:text-${cert.color}-300 transition-colors duration-300`}
                    >
                      <ExternalLink
                        style={{ cursor: "pointer" }}
                        onClick={() => window.open(cert.link)}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${cert.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl`}
                ></div>
              </div>
            ))}
          </div>

          {/* Certificate Summary */}
          <div
            className={`mt-16 text-center transition-all duration-1000 delay-600 ${
              visibleSections.has("certificates")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-blue-400">Pencapaian</h3>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {certificates.length}
                  </div>
                  <div className="text-slate-300 text-sm">Sertifikat</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">500+</div>
                  <div className="text-slate-300 text-sm">Jam Belajar</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">15+</div>
                  <div className="text-slate-300 text-sm">Teknologi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("contact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Mari berkolaborasi untuk menciptakan sesuatu yang luar biasa
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div
                className={`transition-all duration-1000 delay-200 ${
                  visibleSections.has("contact")
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400">
                    Mari Berkolaborasi
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Mail,
                        label: "Email",
                        value: "arsyrangga@example.com",
                        color: "blue",
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: "+6289673494895",
                        color: "green",
                      },
                      {
                        icon: MapPin,
                        label: "Location",
                        value: "Jakarta, Indonesia",
                        color: "purple",
                      },
                    ].map((contact) => (
                      <div key={contact.label} className="flex items-center">
                        <div
                          className={`w-12 h-12 bg-${contact.color}-600/20 rounded-full flex items-center justify-center mr-4`}
                        >
                          <contact.icon
                            className={`w-6 h-6 text-${contact.color}-400`}
                          />
                        </div>
                        <div>
                          <p className="text-slate-300">{contact.label}</p>
                          <p className="text-white font-semibold">
                            {contact.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-1000 delay-400 ${
                  visibleSections.has("contact")
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-8 space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Pesan Anda"
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors duration-300 resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Pesan berhasil dikirim!")}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400">
              ©Copyright Rangga Arsy Prawira @2025 || All Right Reserved
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <social.icon className="w-5 h-5" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
=======
"use client";

import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import AOS from "aos";
import { Suspense, useEffect } from "react";
import "aos/dist/aos.css";
import FlareCursor from "@/components/flareCursor/flareComponent";
import Skills from "@/components/skills/Skills";
import Portfolio from "@/components/portfolio/Portfolio";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
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
>>>>>>> 836eea28404329b0bc8df15f93801556f13a2229
