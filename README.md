# DataVista Premium Export (v1.2.1)

![DataVista Banner](https://Harry-0402.github.io/DataVista/assets/icon-80.png)

**A professional, offline-first Excel Add-in for generating interactive HTML reports with advanced analytics and responsive data visualization.**

---

## 📑 Table of Contents
- [🏢 Why DataVista? (Business Value)](#why-datavista-business-value)
- [📖 How to Use](#how-to-use)
- [✨ Key Features](#key-features)
- [📊 Analytics Module](#analytics-module)
- [📂 Repository Structure](#repository-structure)
- [🚀 Quick Start](#quick-start)
- [🛠️ Development](#development)
- [⚖️ License](#license)

---

## <a name="why-datavista-business-value"></a>🏢 Why DataVista? (Business Value)

DataVista is designed for managers and business analysts who need to share complex data without the overhead of heavy BI tools or compromising security.

### 🛡️ 100% Privacy & Compliance
DataVista runs entirely on the client side. Your sensitive business data **never leaves your local environment**. It is perfect for industries with strict data residency requirements (Finance, Healthcare, Legal).

### 📦 Zero Dependency Distribution
Generate a single, lightweight HTML file that contains your entire report. Your team can view it on any device (laptop, tablet, phone) without needing Excel, PowerBI, or an internet connection.

### ⚡ Instant Decision-Making
Don't wait for IT to build a dashboard. Convert any Excel selection into a professional analytical report in **one click**.

### 📉 Automated Low-End Analytics
Managers get instant access to Sum, Average, Min, and Max statistics for their datasets without writing a single formula.

---

## <a name="how-to-use"></a>📖 How to Use

### Step 1: Data Preparation
Select the range of data in your Excel sheet. Ensure you include the header row for the best experience.

### Step 2: One-Click Export
Go to the **DataVista** tab in the Ribbon and click **Export Selection** (for your current view) or **Export Workbook** (to create a multi-tab dashboard).

### Step 3: Interactive Exploration
A new browser tab will open with your report:
- **SearchPanes**: Filter by categories visually at the top.
- **SearchBuilder**: Click "Advanced Filters" to build complex queries.
- **Analytics Pill**: Toggle the "Analytics" tab to see instant summary statistics.

### Step 4: Share
Save the browser page (Ctrl+S) or print it to PDF. The resulting file is completely portable and can be emailed or shared via SharePoint.

---

## <a name="key-features"></a>✨ Key Features

- **Offline-First Privacy**: No data ever leaves your computer.
- **Precision Layout**: Unified button groups and perfectly aligned toolbars.
- **Multi-Dimensional Filtering**: SearchPanes, SearchBuilder, and real-time column filters.
- **Smart Data Presentation**: Conditional coloring and dynamic font scaling.
- **Clean Export Engine**: Aggressive "Ghost Row" removal for professional results.

## <a name="analytics-module"></a>📊 Analytics Module

The **Analytics Edition** handles the heavy lifting for you:
- **Automatic Numeric Detection**: Identifies and analyzes numeric columns instantly.
- **Summary Statistics**: Sum, Average, Min, Max, and Count calculations.
- **Metadata Inspection**: Source verification and row/column audit logs.

---

## <a name="repository-structure"></a>📂 Repository Structure

```text
DataVista/
├── assets/             # Extension icons and UI assets
├── docs/               # Production Build (GitHub Pages Root)
│   ├── index.html      # Landing Page & Installer
│   └── manifest.xml    # Final Production Manifest
├── src/                # Source Code
│   ├── taskpane/       # Add-in UI logic
│   └── index.html      # Landing page source
├── manifest.xml        # Development Manifest
├── package.json        # Build scripts
└── webpack.config.js   # Production bundling
```

---

## <a name="quick-start"></a>🚀 Quick Start

### For End Users
1. Visit the [DataVista Landing Page](https://Harry-0402.github.io/DataVista/).
2. Download the `manifest.xml`.
3. Sideload into Excel via **Insert > Add-ins > Manage My Add-ins > Upload My Add-in**.

### For Developers
1. Clone the repo and run `npm install`.
2. Run `npm start` for development or `npm run build` for production.

---

## <a name="license"></a>⚖️ License

Distributed under the **Apache License 2.0**. See `LICENSE` for more information.

---

**Built with Precision by Harish Chavan & DataVista Engine.**  
[Live Preview](https://Harry-0402.github.io/DataVista/test_preview.html) &bull; [Official Site](https://Harry-0402.github.io/DataVista/)
