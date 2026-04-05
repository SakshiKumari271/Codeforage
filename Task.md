# CodeForage - Future Roadmap & Ideas

This document tracks features, improvements, and experimental ideas to be implemented in the CodeForage outreach suite.

## ⚡ Immediate Focus (Next Steps)
- [ ] **Docs Page:** Build a comprehensive documentation page for users to understand how to use the suite.
- [ ] **About Page:** Create a page detailing the mission, tech stack, and team behind CodeForage.

## 🚀 Premium Features (High Priority)
- [x] **CSV Permutator Upload:** Support bulk email generation via CSV file uploads.
- [x] **Results Export:** Add CSV download functionality for verified permutator results.
- [ ] **Automated Mail Sending:** Integrate SMTP/API (Resend/SendGrid) for direct email dispatch from the dashboard.
- [ ] **User Authentication:** Implement secure login using Clerk or NextAuth.js.
- [ ] **Data Persistence:** Add a database (PostgreSQL/MongoDB) to save generated permutations and email drafts.


## ✨ Feature Enhancements
- [ ] **LinkedIn Integration:** Tools for LinkedIn profile research and automated connection request drafting.
- [x] **Bulk Processing UI:** Improve the UI for handling 1000+ email permutations with better progress tracking.
- [ ] **Advanced AI Context:** Allow users to provide their portfolio website or GitHub for more personalized email drafting.

## 🛠️ Technical Debt & Optimization
- [ ] **Server-Side Verification:** Move core SMTP logic to a more robust background worker (Redis/Celery).
- [ ] **Unit Testing:** Implement Jest/React Testing Library for frontend components.

## 💡 Blue Sky Ideas
- [ ] **Chrome Extension:** A "CodeForage" helper that pops up on LinkedIn or Gmail.
- [ ] **Outreach Analytics:** Track open rates and reply rates for emails generated via the platform.
- [ ] **Team Collaboration:** Shared workspaces for sales and outreach teams.

---
*Created on: 2026-04-03*
