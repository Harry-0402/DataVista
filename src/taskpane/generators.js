/* global Blob, window */
// generators.js

window.LIB_URLS = {
    bootstrap_css: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css",
    datatables_css: "https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css",
    buttons_css: "https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css",

    // SearchBuilder & DateTime
    searchbuilder_css: "https://cdn.datatables.net/searchbuilder/1.5.0/css/searchBuilder.bootstrap5.min.css",
    dateTime_css: "https://cdn.datatables.net/datetime/1.5.1/css/dataTables.dateTime.min.css",

    // JS Dependencies
    jquery: "https://code.jquery.com/jquery-3.7.0.min.js",
    bootstrap_js: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js",

    // DataTables Core & BS5
    datatables_js: "https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js",
    datatables_bs5_js: "https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js",

    // Export Dependencies
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    pdfmake: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js",
    vfs_fonts: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js",

    // Extensions
    buttons_js: "https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js",
    buttons_bs5_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js",
    buttons_colvis_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.colVis.min.js",
    buttons_html5_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js",
    buttons_print_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js",

    dateTime_js: "https://cdn.datatables.net/datetime/1.5.1/js/dataTables.dateTime.min.js",
    searchbuilder_js: "https://cdn.datatables.net/searchbuilder/1.5.0/js/dataTables.searchBuilder.min.js",
    searchbuilder_bs5_js: "https://cdn.datatables.net/searchbuilder/1.5.0/js/searchBuilder.bootstrap5.min.js"
};

/**
 * Main Generator Function
 * @param {Object} data - { "Sheet1": [[header, val], [val, val]] }
 * @param {string[]} sheetNames
 * @param {Object} options - { stats: bool, info: bool, desc: bool, rich: bool, workbookName: string }
 * @param {Object} libs - { css: string, js: string }
 */
function generateHTML(data, sheetNames, options, libs) {
    const parts = [];
    parts.push(`<!DOCTYPE html><html lang='en' data-bs-theme='light'>`);
    parts.push("<head><meta charset='UTF-8'><title>DataVista Report</title>");

    // 1. CSS
    parts.push(`<style>${libs.css || ""}</style>`);

    // 2. Custom CSS
    parts.push(`<style>
        :root { --header-bg: #3c6ea9; --header-text: white; }
        [data-bs-theme="dark"] { --header-bg: #1f2937; }

        html { scroll-behavior: smooth; }
        body { background-color: var(--bs-body-bg); color: var(--bs-body-color); font-family: 'Segoe UI', sans-serif; zoom: 0.9; }
        
        .dv-header {
            background-color: var(--header-bg); color: var(--header-text);
            padding: 12px 2rem; display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem; gap: 2rem;
        }
        [data-bs-theme="dark"] .dv-header { background-color: var(--header-bg-dark); }

        .header-content { display: flex; flex-direction: column; }
        .dv-brand { font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .dv-meta { font-size: 0.75rem; opacity: 0.7; margin-top: 2px; }
        
        /* Header Tabs */
        .dv-header-tabs { 
            border: none; margin: 0; display: flex; gap: 4px; flex: 1; justify-content: center;
        }
        .dv-header-tabs .nav-link { 
            border: none; color: rgba(255,255,255,0.7); background: transparent;
            padding: 8px 16px; font-weight: 500; border-radius: 20px;
            transition: all 0.2s; font-size: 0.85rem;
        }
        .dv-header-tabs .nav-link:hover { 
            color: white; background: rgba(255,255,255,0.1);
        }
        .dv-header-tabs .nav-link.active { 
            color: white; background: rgba(255,255,255,0.2);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .theme-toggler { cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 16px; transition: all 0.2s; }
        .theme-toggler:hover { background-color: rgba(255,255,255,0.1); }

        .dv-container { padding: 0 2rem 3rem 2rem; }
        .dv-tab-content { padding-top: 0; }
        .nav-link { 
            border: none; color: var(--bs-body-color); opacity: 0.6; padding: 10px 20px; font-weight: 500; border-radius: 30px !important; transition: all 0.2s; 
        }
        .nav-link:hover { background: rgba(0,0,0,0.05); opacity: 1; }
        .nav-link.active { background-color: var(--header-bg) !important; color: white !important; opacity: 1; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

        /* Card */
        .dv-card { background: var(--bs-card-bg); border: 1px solid var(--bs-border-color); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 2rem; }

        /* Sheet Sections */
        .dv-sheet-section { margin-bottom: 3rem; }

        /* DataTable Overrides */
        table.dataTable { border-collapse: collapse !important; border: 1px solid var(--bs-border-color) !important; font-size: 0.8rem; }
        table.dataTable thead th { 
            border: 1px solid var(--bs-border-color) !important; 
            border-bottom: 2px solid var(--bs-border-color) !important; 
            font-weight: 600; 
            vertical-align: middle; 
            padding: 6px 8px !important;
            text-align: left;
        }
        table.dataTable tbody td { 
            vertical-align: middle; 
            padding: 4px 8px !important; 
            border: 1px solid var(--bs-border-color) !important;
            text-align: left;
        }
        table.dataTable tfoot th {
            border: 1px solid var(--bs-border-color) !important;
            padding: 6px 8px !important;
            font-size: 0.8rem;
        }
        
        /* Filter Inputs */
        .filter-input { width: 100%; border: 1px solid var(--bs-border-color); background: var(--bs-body-bg); color: var(--bs-body-color); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; margin-top: 5px; }
        
        /* Stats Footer */
        tfoot th { font-size: 0.9rem; background: var(--bs-tertiary-bg); }

        /* RICH FORMATTING */
        .dv-neg { color: #dc3545 !important; font-weight: 500; }
        .dv-bar-cell { position: relative; z-index: 1; }
        .dv-bar {
            position: absolute; top: 2px; bottom: 2px; left: 0; 
            background: linear-gradient(90deg, rgba(60, 110, 169, 0.15), rgba(60, 110, 169, 0.05));
            z-index: -1; border-radius: 0 4px 4px 0; transition: width 0.3s;
        }
        [data-bs-theme="dark"] .dv-bar { background: linear-gradient(90deg, rgba(60, 110, 169, 0.4), rgba(60, 110, 169, 0.1)); }
        
        /* Modal Tweaks */
        .modal-backdrop.show { opacity: 0; position: fixed; width: 100vw; height: 100vh; top: 0; left: 0; } /* Transparent backdrop */
        .modal-content { box-shadow: none; border: 1px solid var(--bs-border-color); }
    </style>`);

    parts.push("</head><body>");

    // 3. Header with integrated tabs
    const timestamp = new Date().toLocaleString();
    const sheetName = sheetNames.length > 0 ? sheetNames[0] : "Report";
    parts.push(`
    <div class="dv-header">
        <div>
            <div class="dv-brand">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                DataVista <span style="opacity: 0.6; margin: 0 8px;">|</span> ${sheetName}
            </div>
            <div class="dv-meta">Generated: ${timestamp}</div>
        </div>
        <ul class="nav nav-tabs dv-header-tabs" role="tablist">
            <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#page-data">Data</a></li>
            ${options.info ? '<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#page-info">Dataset Info</a></li>' : ''}
            ${options.stats ? '<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#page-stats">Summary Statistics</a></li>' : ''}
        </ul>
        <div class="theme-toggler" onclick="document.documentElement.setAttribute('data-bs-theme', document.documentElement.getAttribute('data-bs-theme')==='dark'?'light':'dark')">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/></svg>
            <span>Theme</span>
        </div>
    </div>
    `);

    parts.push(`<div class="container-fluid mt-3 mb-5">`);

    // Tab Content Container (tabs are now in header)
    parts.push(`<div class="tab-content dv-tab-content">`);

    // DATA PAGE
    parts.push(`<div id="page-data" class="tab-pane fade show active">`);

    sheetNames.forEach((name, i) => {
        const rows = data[name];
        const hasHeader = rows.length > 0;
        const header = hasHeader ? rows[0] : [];
        const body = hasHeader ? rows.slice(1) : [];

        // Pre-calculate Column Max for Data Bars
        const colMax = [];
        if (options.rich) {
            for (let c = 0; c < header.length; c++) {
                let max = 0;
                let isNum = true;
                for (let r = 0; r < body.length; r++) {
                    const v = Number(body[r][c]);
                    if (isNaN(v)) { isNum = false; break; }
                    if (Math.abs(v) > max) max = Math.abs(v);
                }
                colMax[c] = (isNum && max > 0) ? max : 0;
            }
        }

        parts.push(`<div class="dv-sheet-section" id="data-section">`);
        parts.push(`<div class="dv-card">`);

        parts.push(`<table class="table table-hover display nowrap" style="width:100%">`);
        parts.push(`<thead><tr>`);
        header.forEach(h => parts.push(`<th>${h}</th>`));
        parts.push(`</tr></thead>`);

        parts.push(`<tbody>`);
        body.forEach(row => {
            parts.push(`<tr>`);
            row.forEach((cell, cIdx) => {
                let content = cell;
                let classes = "";
                let addons = "";

                // Rich Formatting Logic
                if (options.rich) {
                    const num = Number(cell);
                    if (!isNaN(num)) {
                        // Negative Red
                        if (num < 0) classes += " dv-neg";

                        // Data Bar
                        if (colMax[cIdx] > 0) {
                            classes += " dv-bar-cell";
                            const pct = Math.min(100, (Math.abs(num) / colMax[cIdx]) * 100);
                            addons = `<div class="dv-bar" style="width:${pct}%"></div>`;
                        }
                    }
                }

                parts.push(`<td class="${classes}">${content}${addons}</td>`);
            });
            parts.push(`</tr>`);
        });
        parts.push(`</tbody>`);

        parts.push(`</table></div>`); // End Card

        parts.push(`</div>`); // End Sheet Section
    });

    parts.push(`</div>`); // End Data Page

    // INFO PAGE
    if (options.info) {
        parts.push(`<div id="page-info" class="tab-pane fade">`);
        sheetNames.forEach((name, i) => {
            const rows = data[name];
            const header = rows.length > 0 ? rows[0] : [];
            const body = rows.length > 0 ? rows.slice(1) : [];
            parts.push(`<div class="dv-card"><h5>Dataset Info: ${name}</h5>${generateInfo(header, body)}</div>`);
        });
        parts.push(`</div>`); // End Info Page
    }

    // STATS PAGE
    if (options.stats) {
        parts.push(`<div id="page-stats" class="tab-pane fade">`);
        sheetNames.forEach((name, i) => {
            const rows = data[name];
            const header = rows.length > 0 ? rows[0] : [];
            const body = rows.length > 0 ? rows.slice(1) : [];
            parts.push(`<div class="dv-card"><h5>Statistics: ${name}</h5>${generateDesc(header, body)}</div>`);
        });
        parts.push(`</div>`); // End Stats Page
    }

    parts.push(`</div>`); // End Tab Content
    // Modals
    parts.push(`
    <div class="modal fade" id="searchBuilderModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content" style="background-color: var(--bs-body-bg); color: var(--bs-body-color);">
                <div class="modal-header">
                    <h5 class="modal-title">Advanced Filters</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="sb-modal-body">
                    <!-- SearchBuilder will be appended here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `);

    parts.push(`</div>`); // End Main Container

    // 5. Scripts: Injected Libs + Init Code
    parts.push(`<script>${libs.js || ""}</script>`);

    parts.push(`<script>
    $(document).ready(function() {
        $('table.display').each(function() {
            var table = $(this);
            
            var dt = table.DataTable({
                dom: '<"row mb-3"<"col-md-6"B><"col-md-6"f>>rt<"row mt-3"<"col-md-6"i><"col-md-6"p>>',
                initComplete: function () {
                    var api = this.api();
                    
                    // 1. Move SearchBuilder to Modal
                    // We manually create the SearchBuilder instance and append to modal
                    var sb = new $.fn.dataTable.SearchBuilder(api, {});
                    $('#sb-modal-body').append(sb.getNode());

                    // 2. Add Filter Inputs to Header
                    api.columns().eq(0).each(function (colIdx) {
                        var header = $(api.column(colIdx).header());
                        var title = header.text();
                        var input = $('<input type="text" class="filter-input" placeholder="Filter..." />')
                            .appendTo(header.empty())
                            .on('keyup change', function () {
                                api.column(colIdx).search(this.value).draw();
                            });
                        header.prepend('<div style="margin-bottom: 5px; font-weight: 600;">' + title + '</div>');
                    });
                },
                buttons: [
                    {
                        text: 'Advanced Filters',
                        className: 'btn-info me-3', // Added margin-end for spacing
                        action: function (e, dt, node, config) {
                            $('#searchBuilderModal').modal('show');
                        }
                    },
                    'copy', 
                    'csv', 
                    'excel', 
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        pageSize: 'A4',
                        customize: function(doc) {
                            doc.pageMargins = [10, 10, 10, 10];
                            var colCount = doc.content[1].table.body[0].length;
                            var fontSize = 8;
                            if (colCount > 10) fontSize = 7;
                            if (colCount > 15) fontSize = 6;
                            if (colCount > 20) fontSize = 5;
                            doc.defaultStyle.fontSize = fontSize;
                            doc.styles.tableHeader.fontSize = fontSize + 1;
                            doc.styles.title.fontSize = 12;
                            doc.content[1].table.widths = Array(colCount + 1).join('*').split('');
                            var rowCount = doc.content[1].table.body.length;
                            for (var i = 1; i < rowCount; i++) {
                                doc.content[1].table.body[i].forEach(function(cell) {
                                    if(!isNaN(Number(cell.text)) && cell.text !== "") {
                                        cell.alignment = 'right';
                                    }
                                    cell.margin = [0, 2, 0, 2];
                                });
                            }
                        }
                    },
                    'print', 
                    'colvis'
                ],
                pageLength: 15
            });
        });
    });
    </script>`);

    parts.push("</body></html>");
    return new Blob(parts, { type: "text/html" });
}

// Helpers
function calculateBasicStats(rows, colCount) {
    // Calculates Count (all non-null), Sum, Mean (numeric only)
    const sums = new Array(colCount).fill(0);
    const numericCounts = new Array(colCount).fill(0);
    const totalCounts = new Array(colCount).fill(0);
    const isNum = new Array(colCount).fill(true);

    rows.forEach(r => {
        r.forEach((v, i) => {
            // Count all non-null entries
            if (v !== "" && v !== null && v !== undefined) {
                totalCounts[i]++;
            }

            // Track numeric values for sum/average
            const n = Number(v);
            if (isNaN(n) || v === "") {
                isNum[i] = false;
            } else {
                sums[i] += n;
                numericCounts[i]++;
            }
        });
    });

    const format = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const res = [
        { name: "Count", values: totalCounts.map(c => c) },  // All non-null entries
        { name: "Sum", values: sums.map((s, i) => isNum[i] && numericCounts[i] > 0 ? format(s) : "-") },
        { name: "Average", values: sums.map((s, i) => isNum[i] && numericCounts[i] > 0 ? format(s / numericCounts[i]) : "-") }
    ];
    return res;
}

function generateInfo(header, rows) {
    let html = "<table class='table table-sm'><thead><tr><th>Col</th><th>Type</th><th>Non-Null</th></tr></thead><tbody>";
    header.forEach((h, i) => {
        let nn = 0, numeric = 0;
        rows.forEach(r => {
            if (r[i] !== "" && r[i] !== null) nn++;
            if (!isNaN(Number(r[i]))) numeric++;
        });
        const type = (numeric === nn && nn > 0) ? "Numeric" : "Object";
        html += `<tr><td>${h}</td><td>${type}</td><td>${nn}</td></tr>`;
    });
    return html + "</tbody></table>";
}

function generateDesc(header, rows) {
    if (rows.length === 0) return "<p class='small text-muted'>No data available.</p>";

    // Calculate statistics for numeric columns
    const stats = [];
    const statNames = ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'];

    header.forEach((colName, colIdx) => {
        // Count ALL non-null entries (text or numeric)
        let totalCount = 0;
        const numericValues = [];

        rows.forEach(row => {
            const cellValue = row[colIdx];
            // Count non-null, non-empty entries
            if (cellValue !== "" && cellValue !== null && cellValue !== undefined) {
                totalCount++;
            }

            // Collect numeric values for other stats
            const val = Number(cellValue);
            if (!isNaN(val) && cellValue !== "") {
                numericValues.push(val);
            }
        });

        // If no numeric values, show count only
        if (numericValues.length === 0) {
            stats.push({ col: colName, count: totalCount, mean: '-', std: '-', min: '-', q25: '-', q50: '-', q75: '-', max: '-' });
            return;
        }

        numericValues.sort((a, b) => a - b);
        const count = numericValues.length;
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const mean = sum / count;

        // Standard deviation
        const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const std = Math.sqrt(variance);

        // Percentiles
        const percentile = (p) => {
            const idx = (p / 100) * (count - 1);
            const lower = Math.floor(idx);
            const upper = Math.ceil(idx);
            const weight = idx % 1;
            return numericValues[lower] * (1 - weight) + numericValues[upper] * weight;
        };

        const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        stats.push({
            col: colName,
            count: totalCount,  // Total non-null count (includes text)
            mean: fmt(mean),
            std: fmt(std),
            min: fmt(numericValues[0]),
            q25: fmt(percentile(25)),
            q50: fmt(percentile(50)),
            q75: fmt(percentile(75)),
            max: fmt(numericValues[count - 1])
        });
    });

    // Build HTML table
    let html = "<table class='table table-sm table-bordered'><thead><tr><th>Statistic</th>";
    stats.forEach(s => html += `<th>${s.col}</th>`);
    html += "</tr></thead><tbody>";

    statNames.forEach(statName => {
        html += `<tr><th>${statName}</th>`;
        stats.forEach(s => {
            const val = s[statName === '25%' ? 'q25' : statName === '50%' ? 'q50' : statName === '75%' ? 'q75' : statName];
            html += `<td>${val}</td>`;
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    return html;
}

/**
 * Trims empty rows and columns from a 2D array.
 * @param {any[][]} data 
 * @returns {any[][] | null} Trimmed data or null if empty
 */
function trimEmptyGrid(data) {
    if (!data || data.length === 0) return null;

    let minRow = data.length;
    let maxRow = -1;
    let minCol = data[0].length;
    let maxCol = -1;

    // 1. Find Bounds
    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
            const val = data[r][c];
            if (val !== "" && val !== null && val !== undefined) {
                if (r < minRow) minRow = r;
                if (r > maxRow) maxRow = r;
                if (c < minCol) minCol = c;
                if (c > maxCol) maxCol = c;
            }
        }
    }

    // 2. Check if empty
    if (maxRow === -1) return null;

    // 3. Slice
    const trimmed = [];
    for (let r = minRow; r <= maxRow; r++) {
        trimmed.push(data[r].slice(minCol, maxCol + 1));
    }

    return trimmed;
}
