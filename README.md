<div align="center">

# 🚀 GeeksforGeeks SRMIST Chapter

[![Netlify Status](https://api.netlify.com/api/v1/badges/815be4ff-7e8a-4752-8325-a81373c7a947/deploy-status)](https://app.netlify.com/projects/gfg-srmncr/deploys)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

*The official community website for the SRMIST chapter of GeeksforGeeks*

[🌐 Live Demo](https://gfg-srmncr.netlify.app) • [📖 Documentation](docs/) • [🐛 Report Bug](https://github.com/GEEKSFORGEEKS-SRMIST/issues) • [💡 Request Feature](https://github.com/GEEKSFORGEEKS-SRMIST/issues)

</div>

---

## 🌟 Overview

A modern, feature-rich community platform built with **Next.js 16** and the **App Router**. This website serves as the digital hub for the SRMIST GeeksforGeeks chapter, providing seamless event management, team showcases, recruitment portals, and coding challenges with a comprehensive admin dashboard.

## ✨ Key Features

<table>
  <tr>
    <td>🎯</td>
    <td><strong>Modern Architecture</strong></td>
    <td>Built with Next.js App Router for optimal performance</td>
  </tr>
  <tr>
    <td>🔐</td>
    <td><strong>Secure Backend</strong></td>
    <td>Supabase integration for authentication & database operations</td>
  </tr>
  <tr>
    <td>📝</td>
    <td><strong>Content Management</strong></td>
    <td>Contentful CMS for dynamic content delivery</td>
  </tr>
  <tr>
    <td>🎨</td>
    <td><strong>Beautiful UI/UX</strong></td>
    <td>Tailwind CSS with custom animations & Three.js interactions</td>
  </tr>
  <tr>
    <td>⚡</td>
    <td><strong>Interactive Elements</strong></td>
    <td>GSAP animations and react-three-fiber 3D components</td>
  </tr>
  <tr>
    <td>🛠️</td>
    <td><strong>Admin Dashboard</strong></td>
    <td>Complete event, gallery, and recruitment management system</td>
  </tr>
</table>

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Styling | Animation | Database |
|----------|---------|---------|-----------|----------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white) | ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) | ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white) | ![Three.js](https://img.shields.io/badge/-Three.js-000000?logo=three.js&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white) |
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) | ![Contentful](https://img.shields.io/badge/-Contentful-2478CC?logo=contentful&logoColor=white) | ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?logo=postcss&logoColor=white) | ![GSAP](https://img.shields.io/badge/-GSAP-88CE02?logo=greensock&logoColor=white) | |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) | | | | |

</div>

## 📁 Project Structure

```
📦 GEEKSFORGEEKS-SRMIST/
├── 🎯 app/                    # Next.js App Router
│   ├── 🧩 components/        # Reusable UI components
│   ├── 👑 admin/             # Admin dashboard pages
│   ├── 🌐 (public)/          # Public pages (events, team, etc.)
│   └── 📄 layout.tsx         # Root layout
├── 📚 lib/                   # Utility libraries
│   ├── 🗄️ supabase/         # Database helpers
│   └── 📝 contentful/       # CMS helpers
├── 🎨 public/               # Static assets
├── 📋 components.json       # shadcn/ui configuration
└── ⚙️ next.config.ts        # Next.js configuration
```

## 🚀 Quick Start

### Prerequisites

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-9+-CB3837?logo=npm&logoColor=white)

</div>

### Installation

1. **📥 Clone the repository**
   ```bash
   git clone https://github.com/your-org/GEEKSFORGEEKS-SRMIST.git
   cd GEEKSFORGEEKS-SRMIST
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   ```

3. **🔧 Environment Setup**
   
   Create a `.env.local` file in the root directory:
   
   ```env
   # 🔐 Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # 📝 Contentful Configuration
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

4. **🏃‍♂️ Start development server**
   ```bash
   npm run dev
   ```

5. **🌐 Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description | Usage |
|---------|-------------|--------|
| `dev` | 🔧 Start development server | `npm run dev` |
| `build` | 📦 Build for production | `npm run build` |
| `start` | 🚀 Start production server | `npm run start` |
| `lint` | 🔍 Run ESLint checks | `npm run lint` |

## 🏗️ Development Guide

### 🧭 Navigation Structure

- **Public Pages**: Events, Team, Recruitment, Challenges
- **Admin Dashboard**: Event management, Gallery management, Recruitment oversight
- **Authentication**: Secure admin access via Supabase Auth

### 🎨 Styling Guidelines

- **Tailwind CSS** for utility-first styling
- **Custom components** in `app/components/`
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support

### 🔄 State Management

- **Server Components** for data fetching
- **Client Components** for interactivity
- **Supabase** for real-time data
- **Contentful** for static content

## 🚀 Deployment

### Recommended Platforms

<div align="center">

[![Vercel](https://img.shields.io/badge/Vercel-Recommended-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Netlify](https://img.shields.io/badge/Netlify-Active-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)

</div>

### Deployment Steps

1. **Fork** this repository
2. **Connect** to your preferred platform
3. **Configure** environment variables
4. **Deploy** with one click!

> **⚠️ Important**: Ensure all environment variables are properly configured in your hosting platform.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 📋 Contribution Workflow

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

### 📝 Guidelines

- ✅ Keep commits **small and focused**
- ✅ Run **linting** before submitting
- ✅ Write **clear commit messages**
- ✅ Update **documentation** if needed

## 📞 Support

<div align="center">

Need help? Reach out to us!

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-181717?logo=github&logoColor=white)](https://github.com/your-org/GEEKSFORGEEKS-SRMIST/issues)
[![Discord](https://img.shields.io/badge/Discord-Community-7289DA?logo=discord&logoColor=white)](#)

</div>

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the GeeksforGeeks SRMIST Chapter**

[![GitHub stars](https://img.shields.io/github/stars/your-org/GEEKSFORGEEKS-SRMIST?style=social)](https://github.com/your-org/GEEKSFORGEEKS-SRMIST/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-org/GEEKSFORGEEKS-SRMIST?style=social)](https://github.com/your-org/GEEKSFORGEEKS-SRMIST/network/members)

</div>

