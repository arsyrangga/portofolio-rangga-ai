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
} from "lucide-react";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";
import { gradientColors } from "@/constant/gradientColors";
import { medsos } from "@/constant/constant";
import { ThemeToggle } from "@/components/theme-toggle";

const Portfolio = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<null | number>(null);

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
    <div className="bg-background text-foreground overflow-x-hidden min-h-screen transition-colors duration-200 font-sans">
      {/* Overlay untuk mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          isScrolled
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
                {["home", "about", "projects", "certificates", "contact"].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group capitalize font-medium text-sm cursor-pointer"
                    >
                      {section === "certificates" ? "Sertifikat" : section}
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
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-80 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden bg-background border-b border-border`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {["home", "about", "projects", "certificates", "contact"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 capitalize cursor-pointer"
                >
                  {section === "certificates" ? "Sertifikat" : section}
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
        <div className="text-center z-10 max-w-4xl mx-auto px-4 py-12">
          <div
            className={`transition-all duration-700 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex justify-center mb-6">
              <img
                alt="profile_image"
                loading="lazy"
                width="350"
                height="350"
                decoding="async"
                src="/assets/images/rangga.jpg"
                className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-2 border-border shadow-xs"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 px-4 text-foreground">
              Rangga Arsy Prawira
              <br />
              <span className="text-muted-foreground text-xl sm:text-3xl md:text-4xl font-normal block mt-2">
                Full Stack Developer
              </span>
            </h1>
          </div>
          <div
            className={`transition-all duration-700 delay-150 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Creating high-performance digital products and elegant web applications with modern web standards.
            </p>
          </div>
          <div
            className={`flex flex-col sm:flex-row justify-center items-center transition-all duration-700 delay-300 space-y-3 sm:space-y-0 sm:space-x-4 ${
              visibleSections.has("home")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              See Portfolio
            </button>

            <a
              href="/assets/pdf/cv.pdf"
              className="w-full sm:w-auto border border-border bg-background text-foreground hover:bg-muted px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs"
              download={true}
            >
              Download CV
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-60">
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has("about")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              About Me
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              I am a Full-Stack Developer with over 4 years of experience,
              skilled in building responsive, SEO-friendly interfaces and writing clean, maintainable code.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div
              className={`transition-all duration-700 delay-150 ${
                visibleSections.has("about")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
            >
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
            </div>

            <div
              className={`transition-all duration-700 delay-300 ${
                visibleSections.has("about")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-6"
              }`}
            >
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-5 hover:border-foreground/20 transition-all"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full mr-3"
                        style={{ backgroundColor: skill.color }}
                      ></div>
                      <h4 className="text-base font-semibold text-foreground">{skill.name}</h4>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has("projects")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              A collection of digital products, applications, and web services I've engineered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`bg-card text-card-foreground border border-border shadow-xs rounded-xl overflow-hidden hover:border-foreground/20 transition-all ${
                  visibleSections.has("projects")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image Section */}
                <div className="h-44 bg-muted relative border-b border-border overflow-hidden">
                  <img
                    src={
                      project.image ||
                      `https://picsum.photos/400/200?random=${index}`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "0% 5%" }}
                  />
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
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
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link !== "#" && project.link && (
                    <button
                      className="text-xs font-semibold text-foreground hover:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        window.open(project.link, "_blank");
                      }}
                    >
                      View Project <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has("certificates")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Licenses & Certificates
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Verified certifications and industry credentials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert.title}
                className={`bg-card text-card-foreground border border-border shadow-xs rounded-xl p-5 hover:border-foreground/20 transition-all ${
                  visibleSections.has("certificates")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-muted border border-border">
                    <Award className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border">
                    {cert.date}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-base font-semibold tracking-tight text-foreground mb-1">
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

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border"
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
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      onClick={() => window.open(cert.link)}
                    >
                      <ExternalLink className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Summary */}
          <div
            className={`mt-12 text-center transition-all duration-700 delay-300 ${
              visibleSections.has("certificates")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
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
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has("contact")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Get In Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              Let's connect and collaborate on your next project.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div
                className={`transition-all duration-700 delay-150 ${
                  visibleSections.has("contact")
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-6"
                }`}
              >
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
              </div>

              <div
                className={`transition-all duration-700 delay-300 ${
                  visibleSections.has("contact")
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
              >
                <div className="bg-card text-card-foreground border border-border shadow-xs rounded-xl p-6 space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground transition-colors"
                      onInput={(e) => setName(e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground transition-colors"
                      onInput={(e) => setEmail(e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Pesan Anda"
                      rows={4}
                      className="w-full px-3.5 py-2.5 bg-background border border-input text-foreground text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground transition-colors resize-none"
                      onInput={(e) => setMessage(e.currentTarget.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendToWhatsApp}
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-2.5 rounded-lg font-medium text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2025 Rangga Arsy Prawira. All rights reserved.</p>
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
    </div>
  );
};

export default Portfolio;
