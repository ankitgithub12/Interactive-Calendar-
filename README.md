# 📅 Interactive Wall Calendar - Engineering Challenge

A high-fidelity, interactive React component that translates a physical "Wall Calendar" aesthetic into a functional digital experience. Built for the Frontend Engineering Challenge.

![Calendar Preview](https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)

## 🌟 Stand-Out Features

- **Tear-off Animation**: Navigating between months triggers a physical "page-peel" animation, simulating the tearing of a calendar page.
- **3D Tactile Layout**: Implements spiral rings, a wall-pin hook, and a 3D tilt effect on hover to ground the UI in a physical metaphor.
- **Dynamic Theming**: Every month features a custom hero image and a brand palette that automatically updates across all UI elements (wave divider, progress bars, range highlights).
- **Responsive Engineering**: A mobile-first layout that stacks vertically on small screens and expands to a side-by-side "dashboard" view on desktop.
- **Persistent Seasonal Notes**: Use the "Notebook" styled section to jot down memos. Notes are saved per-month and tracked with a themed character progress bar.

## 🚀 Getting Started

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack & Choices

- **React 19 + Vite**: Chosen for ultra-fast HMR and the latest React performance features.
- **Tailwind CSS v4**: Utilized for modern design tokens and the robust `@theme` engine.
- **date-fns**: Powers the complex date-range calculations and month boundary logic.
- **LocalStorage**: Zero-config data persistence for user notes.

---

*This project was developed to showcase UI/UX precision, complex animation orchestration, and responsive architectural thinking.*
