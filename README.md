# DataVista Premium Export (v1.2.1)

![DataVista Banner](https://Harry-0402.github.io/DataVista/assets/icon-80.png)

**A professional, offline-first Excel Add-in for generating interactive HTML reports with advanced analytics and responsive data visualization.**

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [📊 Analytics Module](#-analytics-module)
- [📂 Repository Structure](#-repository-structure)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Development](#️-development)
- [⚖️ License](#-license)

---

## ✨ Key Features

- **Offline-First Privacy**: No data ever leaves your computer. Reports are generated locally in your browser.
- **Precision Layout (v11.0+)**: Unified button groups and perfectly aligned toolbars.
- **Multi-Dimensional Filtering**:
  - **SearchPanes**: High-level categorical filtering.
  - **SearchBuilder**: Complex conditional logic (AND/OR).
  - **Real-time Column Filters**: Instant filtering on every column.
- **Smart Data Presentation**:
  - **Conditional Coloring**: Automatic green/red formatting for numeric trends.
  - **Dynamic Scaling**: Automatic font adjustment for wide datasets.
- **Clean Export Engine**: Aggressive "Ghost Row" removal to eliminate Excel artifacts.

## 📊 Analytics Module (v1.2.1)

The latest **Analytics Edition** automatically calculates key insights for every dataset:
- **Automatic Numeric Detection**: Identifies and analyzes numeric columns instantly.
- **Summary Statistics**: Sum, Average, Min, Max, and Count calculations.
- **Metadata Inspection**: Source verification and row/column audit logs.

---

## 📂 Repository Structure

```text
DataVista/
├── assets/             # Extension icons and UI assets
├── docs/               # Production Build (GitHub Pages Root)
│   ├── index.html      # Landing Page & Installer
│   └── manifest.xml    # Final Production Manifest
├── src/                # Source Code
│   ├── taskpane/       # Add-in UI logic
│   │   ├── taskpane.html
│   │   ├── generators.js   # Single-sheet export engine
│   │   └── workbook_generators.js # Dashboard engine
│   ├── commands/       # Ribbon command handlers
│   └── index.html      # Landing page source
├── manifest.xml        # Development Manifest
├── package.json        # Build scripts & dependencies
└── webpack.config.js   # Production bundling configuration
```

---

## 🚀 Quick Start

### For End Users
1. Visit the [DataVista Landing Page](https://Harry-0402.github.io/DataVista/).
2. Download the `manifest.xml`.
3. Sideload into Excel (Office 365 or Desktop) via **Insert > Add-ins > Manage My Add-ins > Upload My Add-in**.
4. Use the **DataVista** tab in your Ribbon!

### For Developers
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Development Tools

- **DataTables Engine**: Powered by DataTables.net with Buttons, SearchPanes, and SearchBuilder.
- **Bootstrap 5**: Responsive UI components.
- **Office.js**: Tight integration with the Excel host.
- **Webpack 5**: Production-grade bundling and optimization.

---

## ⚖️ License

Distributed under the **Apache License 2.0**. See `LICENSE` for more information.

---

**Built with Precision by Harish Chavan & DataVista Engine.**  
[Live Preview](https://Harry-0402.github.io/DataVista/test_preview.html) &bull; [Official Site](https://Harry-0402.github.io/DataVista/)
