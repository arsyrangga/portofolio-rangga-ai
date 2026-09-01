# Dedicated Skills Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dedicated Skills & Expertise section (`#skills`) on the portfolio website organizing 8 categories and 70+ skills with real-time search, category filter tabs, responsive badge grid, and navigation integration.

**Architecture:** Update `src/data/skills.js` with structured category data and skills arrays. In `src/app/page.tsx`, introduce search and category filter states, render the dedicated `#skills` section between `#about` and `#projects`, update navbar links and intersection observer, and refine the `#about` section profile highlights.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React icons, TypeScript.

## Global Constraints
- Preserve existing styling conventions (shadcn-compatible CSS variables: `bg-card`, `text-card-foreground`, `border-border`, etc.).
- Maintain responsive behavior across mobile, tablet, and desktop viewports.
- All 8 categories and 70+ skills must be accurately included.
- No TypeScript or build errors.

---

### Task 1: Update Skills Data Model

**Files:**
- Modify: `src/data/skills.js`

**Interfaces:**
- Produces: `skills` array containing 8 category objects `{ id, name, icon, desc, color, items: string[] }`.

- [ ] **Step 1: Write updated `src/data/skills.js`**

```javascript
export const skills = [
  {
    id: "programming-languages",
    name: "Programming Languages",
    icon: "Code2",
    desc: "Core languages used for systems, applications, and scripting",
    color: "#3b82f6",
    items: [
      "JavaScript",
      "TypeScript",
      "Kotlin",
      "Go (Golang)",
      "Swift",
      "C++",
    ],
  },
  {
    id: "frameworks-libraries",
    name: "Frameworks & Libraries",
    icon: "Boxes",
    desc: "Modern frameworks and UI/State management libraries",
    color: "#8b5cf6",
    items: [
      "React.js",
      "Next.js",
      "React Native",
      "Node.js",
      "Express.js",
      "Vue.js",
      "AngularJS",
      "Ionic Framework",
      "Jetpack Compose",
      "SwiftUI",
      "CodeIgniter",
      "Quasar Framework",
      "Vuex",
      "Redux",
      "Zustand",
      "Material-UI",
      "Ant Design",
      "Bootstrap",
      "CocoaPods",
    ],
  },
  {
    id: "web-mobile",
    name: "Web & Mobile Development",
    icon: "Smartphone",
    desc: "Cross-platform mobile and responsive frontend engineering",
    color: "#06b6d4",
    items: [
      "HTML5",
      "CSS",
      "Responsive Web Design",
      "Android Development",
      "Android",
      "iOS Development",
      "UIKit",
      "Android Studio",
      "Xcode",
    ],
  },
  {
    id: "backend-cloud",
    name: "Backend, Database & Cloud",
    icon: "Server",
    desc: "Scalable backend architecture, databases, and cloud infrastructure",
    color: "#10b981",
    items: [
      "Back-End Web Development",
      "Microservices",
      "Micro Frontend",
      "MySQL",
      "SQLite",
      "SQL",
      "Google Cloud Platform (GCP)",
      "Google Cloud Run",
      "Cloud Computing",
      "Cloud Firestore",
    ],
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    icon: "Cpu",
    desc: "Architecture principles, code quality, and testing methodologies",
    color: "#f59e0b",
    items: [
      "Algorithms",
      "Unit Testing",
      "Jest",
      "Debugging",
      "SonarQube",
      "State Management",
    ],
  },
  {
    id: "security",
    name: "Security",
    icon: "ShieldCheck",
    desc: "Information security, risk assessment, and incident handling",
    color: "#ef4444",
    items: [
      "Cybersecurity",
      "Information Security",
      "Data Security",
      "Cyber Security Risk",
      "Cyber Risk Management",
      "Cybersecurity Incident Response",
      "Information Security Management",
    ],
  },
  {
    id: "tools",
    name: "Development & Productivity Tools",
    icon: "Wrench",
    desc: "Version control, design tools, and system environments",
    color: "#ec4899",
    items: [
      "Git",
      "Jira",
      "Figma",
      "Adobe Illustrator",
      "Windows",
      "LAN-WAN",
      "Active Directory",
      "Computer Hardware",
      "Software Installation",
    ],
  },
  {
    id: "management",
    name: "Management & Soft Skills",
    icon: "Users",
    desc: "Team leadership, strategic planning, and interpersonal skills",
    color: "#14b8a6",
    items: [
      "Agile",
      "Project Planning",
      "Task Management",
      "Workload Prioritization",
      "Mentoring",
      "Communication",
      "English",
      "Business English",
      "Data Analysis",
      "Digital Marketing",
      "Wirausaha",
    ],
  },
];
```

- [x] **Step 1: Write updated `src/data/skills.js`**
- [x] **Step 2: Commit data changes**

---

### Task 2: Implement Dedicated Skills UI in `src/app/page.tsx`

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Imports: `skills` from `@/data/skills`
- Lucide Icons: `Code2`, `Boxes`, `Smartphone`, `Server`, `Cpu`, `ShieldCheck`, `Wrench`, `Users`, `Search`, `Sparkles`, `ArrowRight`

- [x] **Step 1: Update navigation items and state**
- [x] **Step 2: Refine About Section**
- [x] **Step 3: Render Dedicated Skills Section (`#skills`)**
- [x] **Step 4: Verify in Browser & Test Responsiveness**
- [x] **Step 5: Run build verification**
- [x] **Step 6: Commit changes**

