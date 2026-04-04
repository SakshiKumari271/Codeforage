# CodeForage Frontend Documentation

This document provides an overview of the frontend application, including its structure, key pages, components, and development guide.

## Development URL
- **Local:** `http://localhost:3000`
- **Prod (Optional):** Define deployment URL here.

---

## 1. Core Pages

### Landing Page (Home)
The main entry point of the application, showcasing the "Premium Light" aesthetic and core value propositions.
- **Path:** `/`
- **Features:** Glassmorphic Hero section, Feature grid, Interactive background.

### SMTP Verification
Technical audit tool for single email SMPT verification.
- **Path:** `/verify`
- **Integration:** Calls `/api/verify-single` on the backend.

### Email Permutator
Bulk and single email variation generator and verifier.
- **Path:** `/permutator`
- **Features:** Manual entry, CSV Bulk Import, Real-time status tracking, CSV Results Export.
- **Integration:** Calls `/api/permutator` and `/api/upload_csv` on the backend.

### AI Email Drafter
AI-powered cold email generation based on uploaded resume PDF and context.
- **Path:** `/drafter`
- **Integration:** Calls `/api/draft-email` on the backend.

### Product Documentation
Comprehensive guides and documentation for using the Codeforage suite.
- **Path:** `/docs`

---

## 2. Key Components

### Navigation (Navbar)
- **File:** `components/Navbar.tsx`
- **Features:** Floating glassmorphic design, responsive layout, dynamic routing.

### Footer
- **File:** `components/Footer.tsx`
- **Features:** Structured grid-based layout, custom social icons.

### Visual Effects
- **GridBackground:** `components/GridBackground.tsx` (Subtle grid pattern)
- **FloatingIcons:** `components/FloatingIcons.tsx` (Micro-animations for visual flair)

---

## 3. Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## Development Setup

### Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the application for production.
- `npm run start`: Starts the production build.
- `npm run lint`: Runs ESLint for code quality.

### Environment Variables
Create a `.env.local` file in the root of the `frontend` directory:
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

---

## Page Implementation Status

Last verified on: 2026-04-05

| Path | Feature | UI Implementation | Backend Integration |
| :--- | :--- | :--- | :--- |
| `/` | Landing Page | ✅ COMPLETE | N/A |
| `/verify` | SMTP Verification | ✅ COMPLETE | ✅ SUCCESS |
| `/permutator` | Email Permutator | ✅ COMPLETE | ✅ SUCCESS |
| `/drafter` | AI Email Drafter | ✅ COMPLETE | ✅ SUCCESS |
| `/docs` | Documentation | ✅ COMPLETE | N/A |

---

***By CodeForage Team***