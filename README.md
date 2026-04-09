# 📅 Interactive Wall Calendar

A polished, high-fidelity React component that emulates a physical portrait wall calendar. Designed with a focus on tactile interactions, dynamic aesthetics, and a premium user experience.

![Calendar Preview](https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)

## ✨ Core Features

- **Wall Calendar Aesthetic**: Faithfully recreated from the design reference, featuring 3D spiral rings, a thematic wave chevron divider, and a wall-mounting pin.
- **Tear-off Page Animation**: Navigating between months triggers a physical "page-flipping" animation where the current page peels off to reveal the next.
- **3D Interactive Card**: The calendar card responds to cursor movement with a subtle 3D tilt effect, adding a sense of depth and physicality.
- **Date Range Selector**: Drag-and-click date selection with clear visual indicators for start, end, and the range interval.
- **Persistent Notes**: A month-specific notes area with a character counter and a themed progress bar. All notes are persisted via `localStorage`.
- **Dynamic Theming**: Every month features a unique hero image, primary color palette, and thematic labels that inject life into the UI.
- **Fully Responsive**: Adapts seamlessly from desktop layouts to mobile-optimized vertical stacks.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone or Download** the project files to your local machine.
2. **Navigate** into the project directory:
   ```bash
   cd "Interactive Calendar/client"
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build

To create an optimized production build:
```bash
npm run build
```

## 🧠 Design Choices & Technical Strategy

### Performance & Tech Stack
- **React 19 + Vite**: Chosen for near-instant HMR and a modern, lean foundation.
- **Tailwind CSS v4**: Leveraging the latest CSS-in-JS capabilities and `@theme` configuration for a robust design system.
- **date-fns**: Used for all date manipulations to ensure accuracy across timezones and month boundaries.

### Tactile UI/UX
- **Physical Metaphor**: The design avoids generic digital looks. Instead, it uses decorative elements like rings, shadows, and the "page curl" corner to ground the component in reality.
- **Micro-interactions**: The **Tear-off animation** and **3D Tilt** were implemented using raw CSS Keyframes and CSS variables to ensure high frame rates even without heavy animation libraries like Framer Motion.
- **Color Harmony**: Colors are calculated dynamically using `color-mix` and CSS variables, ensuring the range highlights and progress bars always harmonize with the current month's hero image.

### Search Engine Optimization (SEO)
- Implemented semantic HTML5 tags (headings, main, sections) and meta-descriptions to ensure the component is discoverable and accessible.

---

*Developed with ❤️ as an Interactive Frontend Portfolio Piece.*
