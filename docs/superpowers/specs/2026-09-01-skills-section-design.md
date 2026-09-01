# Dedicated Skills & Expertise Section Design Specification

**Date**: 2026-09-01  
**Topic**: Dedicated Skills Section with 8 Categorized Domains, Interactive Filtering, Search, and Navigation Integration

---

## 1. Overview

This specification details creating a dedicated, high-performance **Skills & Expertise** section (`#skills`) on the portfolio website. The section structures 8 distinct technical domains comprising 70+ skills, with interactive category tabs, real-time search filtering, and modern badge cards adhering to the site's sleek minimalist design system (Tailwind CSS v4 + theme variables).

---

## 2. Data Structure (`src/data/skills.js`)

The `skills` dataset will be expanded into categorized domain objects:

```ts
export interface SkillCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  desc: string;
  color: string;
  items: string[];
}
```

### Categorized Skill Domains:
1. **Programming Languages** (`Code2`):
   - JavaScript, TypeScript, Kotlin, Go (Golang), Swift, C++
2. **Frameworks & Libraries** (`Boxes`):
   - React.js, Next.js, React Native, Node.js, Express.js, Vue.js, AngularJS, Ionic Framework, Jetpack Compose, SwiftUI, CodeIgniter, Quasar Framework, Vuex, Redux, Zustand, Material-UI, Ant Design, Bootstrap, CocoaPods
3. **Web & Mobile Development** (`Smartphone`):
   - HTML5, CSS, Responsive Web Design, Android Development, Android, iOS Development, UIKit, Android Studio, Xcode
4. **Backend, Database & Cloud** (`Server`):
   - Back-End Web Development, Microservices, Micro Frontend, MySQL, SQLite, SQL, Google Cloud Platform (GCP), Google Cloud Run, Cloud Computing, Cloud Firestore
5. **Software Engineering** (`Cpu`):
   - Algorithms, Unit Testing, Jest, Debugging, SonarQube, State Management
6. **Security** (`ShieldCheck`):
   - Cybersecurity, Information Security, Data Security, Cyber Security Risk, Cyber Risk Management, Cybersecurity Incident Response, Information Security Management
7. **Development & Productivity Tools** (`Wrench`):
   - Git, Jira, Figma, Adobe Illustrator, Windows, LAN-WAN, Active Directory, Computer Hardware, Software Installation
8. **Management & Soft Skills** (`Users`):
   - Agile, Project Planning, Task Management, Workload Prioritization, Mentoring, Communication, English, Business English, Data Analysis, Digital Marketing, Wirausaha

---

## 3. UI & Component Architecture (`src/app/page.tsx`)

### 3.1 Section Placement & Navigation
- **Placement**: Directly following the `#about` section and before the `#projects` section.
- **Navbar Integration**:
  - Add `"skills"` to the section list: `["home", "about", "skills", "projects", "certificates", "articles", "contact"]`.
  - Mobile & desktop menus smoothly scroll to `#skills`.
  - IntersectionObserver tracks `#skills` for active scroll and entrance animations.

### 3.2 Interactive Controls
- **Category Filter Tabs**:
  - "All" tab showing the aggregate skill count (~70+).
  - Individual pill buttons for each of the 8 categories.
  - Active state: `bg-primary text-primary-foreground shadow-xs`.
  - Inactive state: `bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted`.
- **Live Search Bar**:
  - Search input with `Search` and `X` (clear) icons.
  - Case-insensitive instant filtering matching both category names and individual skill items.
  - Empty state when search yields no matches with a reset button.

### 3.3 Skill Card Design
- **Grid Layout**: Responsive 1 column on mobile, 2 columns on tablet (`md`), 3/4 columns on desktop (`lg`/`xl`).
- **Card Aesthetics**:
  - `bg-card text-card-foreground border border-border shadow-xs rounded-xl p-5 hover:border-foreground/25 transition-all`.
  - Header: Category Icon badge + Category Title + Skill counter badge.
  - Skill Badges: Interactive pills (`px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border hover:bg-primary hover:text-primary-foreground transition-colors cursor-default`).
  - Search match highlight: Active border/glow when matching query.

### 3.4 About Section Adjustments
- Replaces the 3 static skill cards on the right side of `#about` with a refined "Profile Highlights & Core Focus" card displaying key career metrics (e.g. 4+ Years Experience, Full Stack & Mobile Specialist, Cloud & Security Mindset, Production Systems) and a direct button linking to the full `#skills` section.

---

## 4. Verification Plan

1. **Category Data Integrity**: Verify all 8 categories and exact skills from the user prompt are present.
2. **Filter & Search Verification**:
   - Test clicking category filter tabs to verify only selected category is displayed.
   - Test searching for specific skills (e.g., "Kotlin", "SonarQube", "Golang", "Cybersecurity") to verify instant search filtering.
3. **Responsive Design & Dark/Light Mode**: Check rendering across mobile and desktop viewports, dark and light themes.
4. **Navigation**: Verify smooth scrolling to `#skills` from desktop and mobile nav.
5. **Build Test**: Run `npm run build` or type check to ensure no lint or TS errors.
