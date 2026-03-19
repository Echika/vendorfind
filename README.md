# Vendor Finding App (SDG 8 & 9 Initiative)

An innovative platform designed to bridge the gap between service providers and consumers across diverse sectors. This project supports **Decent Work and Economic Growth (SDG 8)** and **Industry, Innovation, and Infrastructure (SDG 9)** by digitizing vendor discovery.

## 🚀 Project Overview
- **Core Goal:** Enable users to find vendors by sector, price range, and real-time reviews.
- **Frontend:** React (Vite) deployed on **Vercel**.
- **Backend:** Node.js/Express deployed on **Render**.

## 🛠 Tech Stack
- **Frontend:** React, Tailwind CSS, TanStack Query.
- **Backend:** Node.js, Express, [Insert Database: e.g., PostgreSQL].
- **State Management:** React Context API / Redux Toolkit.
- **Authentication:** [Insert Choice: e.g., Clerk or JWT].

## 🌿 Branching Conventions
As per Tech Lead guidelines, please follow these naming conventions:
- `main`: Production-ready code only.
- `develop`: Main integration branch.
- `feature/feature-name`: For new functionality (e.g., `feature/search-filters`).
- `bugfix/issue-name`: For resolving reported bugs.

## 🛠 Getting Started

### 1. Clone the repository
git clone [repo-url]

### 2. Frontend Setup
cd client
npm install
npm run dev

### 3. Backend Setup
cd server
npm install
npm run start (or 'npm run dev' if using nodemon)

## 📝 Quality Standards
- **Pull Requests:** All PRs must be reviewed by the Tech Lead.
- **Linting:** Ensure `npm run lint` passes before pushing.
- **Reviews:** Use descriptive comments in code for complex logic (especially price-range filtering).
