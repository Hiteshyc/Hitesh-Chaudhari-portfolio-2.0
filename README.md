<<<<<<< HEAD
<div align="center">
=======
# Developer Portfolio 2.0 (VS Code / IDE Theme)

An interactive developer portfolio styled as a modern IDE (VS Code) interface, showcasing software engineering skills, experiences, and projects. Visitors can explore the portfolio through a folder structure, open multiple active tabs, toggle themes, and discover hidden features.

## Key Features

- **IDE-Style Layout**: Includes a Title Bar, Activity Bar, Sidebar, Tab Bar, Breadcrumbs, Editor Shell, Minimap, and Status Bar.
- **Multi-Tab Navigation**: Open, switch between, and close multiple sections (`about.tsx`, `projects.json`, `experience.md`, etc.) simultaneously.
- **File Tree Sidebar**: Interactive file explorer mapping routes to simulated code files.
- **Dynamic Content Engine**: Fully configurable portfolio content powered by a single Markdown file (`content/info.md`) with metadata and frontmatter parser.
- **Developer Theme & Toggle**: Integrated dark and light themes customized for comfortable code-reading and presentation.
- **Easter Eggs & Modals**: Immersive elements and interactions for visitors to discover.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Markdown Parsing**: Remark, Remark HTML, Gray-matter

---

## Project Structure

```text
├── content/
│   └── info.md                  # Single source of truth for portfolio data
├── src/
│   ├── app/                     # Next.js pages and routing
│   │   ├── about/
│   │   ├── contact/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # React Components
│   │   ├── ide/                 # IDE workspace elements (Sidebar, ActivityBar, TabBar, etc.)
│   │   ├── sections/            # Portfolio page content panels (Home, About, Projects, etc.)
│   │   └── ui/                  # Reusable UI elements (Badge, ThemeToggle, StatCard)
│   └── lib/                     # Helper utilities (state management, content parsers, fonts)
```

---
>>>>>>> cf81f3f (Added terminal section)

# ✦ Hitesh Chaudhari — Portfolio 2.0

<<<<<<< HEAD
**A modern, performant personal portfolio built with Next.js 16 & React 19**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-hiteshchauhdari.vercel.app-black?style=for-the-badge&logo=vercel)](https://hiteshchauhdari.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

This is the second iteration of my personal portfolio — a clean, fast, and fully responsive site showcasing my projects, skills, and writing. Content is authored in Markdown and rendered at build time using Remark, keeping everything lightning-fast with zero client-side fetching.

---

## ✨ Features

- **⚡ App Router** — Built on Next.js 16 with the latest App Router architecture
- **📝 Markdown Blog** — Articles written in `.md` with frontmatter powered by `gray-matter` and rendered via `remark`
- **🎨 Tailwind CSS v4** — Utility-first styling with a consistent design system
- **🔒 Fully Type-Safe** — End-to-end TypeScript with strict mode
- **📱 Responsive** — Mobile-first layout that looks great on any screen
- **🚀 Deployed on Vercel** — Automatic CI/CD on every push to `main`

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Icons | Lucide React |
| Content | Markdown (`gray-matter` + `remark`) |
| Runtime | React 19 |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- npm / yarn / pnpm / bun

### Installation
=======
### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hiteshyc/Hitesh-Chaudhari-portfolio-2.0.git
   cd Hitesh-Chaudhari-portfolio-2.0
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run the development server:
>>>>>>> cf81f3f (Added terminal section)

```bash
# 1. Clone the repository
git clone https://github.com/Hiteshyc/Hitesh-Chaudhari-portfolio-2.0.git
cd Hitesh-Chaudhari-portfolio-2.0

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

<<<<<<< HEAD
Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

---

## 📁 Project Structure

```
├── content/          # Markdown files for blog posts / pages
├── public/           # Static assets (images, fonts, icons)
├── src/
│   ├── app/          # Next.js App Router pages & layouts
│   ├── components/   # Reusable UI components
│   └── lib/          # Utility functions, content helpers
├── next.config.ts    # Next.js configuration
├── tailwind.config   # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
=======
Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### Building for Production

To create a production build:

```bash
npm run build
npm run start
>>>>>>> cf81f3f (Added terminal section)
```

---

<<<<<<< HEAD
## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint the codebase with ESLint |

---

## ☁️ Deployment

This project is deployed on **Vercel**. Every push to the `main` branch triggers an automatic production deployment.

To deploy your own instance:

1. Fork this repository
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — click **Deploy**

---

## 🤝 Contributing

Feedback and suggestions are welcome! Feel free to open an [issue](https://github.com/Hiteshyc/Hitesh-Chaudhari-portfolio-2.0/issues) or submit a pull request.

---

## 📬 Contact

**Hitesh Chaudhari**

[![Portfolio](https://img.shields.io/badge/Portfolio-hiteshchauhdari.vercel.app-black?style=flat-square&logo=vercel)](https://hiteshchauhdari.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Hiteshyc-181717?style=flat-square&logo=github)](https://github.com/Hiteshyc)

---

<div align="center">
  <sub>Built with ❤️ by Hitesh Chaudhari</sub>
</div>
=======
## Customization

You can update the portfolio data by editing the `content/info.md` file. The application parses the frontmatter and markdown body to update all details including:

- Name, tagline, roles, and statistics
- Social links (GitHub, LinkedIn, Email, Phone)
- Projects list (title, description, tags, image, repository link)
- Tech skills categorized by domain
- Work history and experiences
- Detailed "About Me" bio

---

## Deployment

Deploying the Next.js portfolio is simple. You can import the repository directly into [Vercel](https://vercel.com).

1. Push your changes to your GitHub repository.
2. Link the repository to your Vercel account.
3. Vercel will automatically detect Next.js and deploy the application.

---

## License

This project is licensed under the MIT License. Feel free to use and adapt this portfolio to showcase your own developer journey.
>>>>>>> cf81f3f (Added terminal section)
