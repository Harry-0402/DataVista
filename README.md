# DataVista Excel Add-in

**Professional Offline Reporting for Excel.**
DataVista is a modern, Ribbon-first Excel Add-in that allows you to generate beautiful, interactive HTML reports from your Excel data purely offline.

## Features

- **Ribbon-First Architecture**: All main actions are accessible directly from the "DataVista" tab in the Excel Ribbon.
- **Offline Generation**: No data is sent to any server. All processing happens locally in your browser.
- **Fit to Screen**: Generated reports automatically adjust to fit your screen width, preventing horizontal scrolling.
- **Interactive Reports**:
  - Sort, search, and filter data.
  - "Advanced Filters" via a modal dialog.
  - "Summary Statistics" and "Dataset Info" tabs (optional).
  - Dark Mode support.

## Installation

1.  **Download Manifest**: Get the [manifest.xml](https://Harry-0402.github.io/DataVista/manifest.xml) file.
2.  **Open Excel**: Use Excel on the Web or Excel for Desktop.
3.  **Insert Add-in**:
    - Go to **Insert** > **Add-ins** > **Manage My Add-ins**.
    - Select **Upload My Add-in**.
    - Choose the `manifest.xml` file you downloaded.
4.  **Ready**: You will see a new **DataVista** tab in your Ribbon.

## Usage

### 1. Export Selection
Select a range of cells in Excel and click **Export Selection** in the DataVista tab. A report will be generated for just those cells.

### 2. Export Workbook
Click **Export Workbook** to generate a dashboard-style report containing all sheets in your workbook.

### 3. About / Support
Click the **About / Support** button to open the Taskpane guide, which provides helpful instructions and version information.

## Recent Updates

- **v2.1 (Fit-Screen)**: Fixed horizontal scrolling issues; tables now wrap text and fit to the screen width.
- **v2.0**: Transitioned to Ribbon-First architecture; Taskpane is now a static guide.

## Development

To run locally:
```bash
npm install
npm run start
```
This will start the dev server on `https://localhost:3000`.

## License
MIT
