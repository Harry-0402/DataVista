/* global Blob, window */
// generators.js

window.LIB_URLS = {
    bootstrap_css: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css",
    datatables_css: "https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css",
    buttons_css: "https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css",

    // SearchBuilder & DateTime
    searchbuilder_css: "https://cdn.datatables.net/searchbuilder/1.5.0/css/searchBuilder.bootstrap5.min.css",
    dateTime_css: "https://cdn.datatables.net/datetime/1.5.1/css/dataTables.dateTime.min.css",
    searchpanes_css: "https://cdn.datatables.net/searchpanes/2.2.0/css/searchPanes.bootstrap5.min.css",
    select_css: "https://cdn.datatables.net/select/1.7.0/css/select.bootstrap5.min.css",

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
    searchbuilder_bs5_js: "https://cdn.datatables.net/searchbuilder/1.5.0/js/searchBuilder.bootstrap5.min.js",
    searchpanes_js: "https://cdn.datatables.net/searchpanes/2.2.0/js/dataTables.searchPanes.min.js",
    searchpanes_bs5_js: "https://cdn.datatables.net/searchpanes/2.2.0/js/searchPanes.bootstrap5.min.js",
    select_js: "https://cdn.datatables.net/select/1.7.0/js/dataTables.select.min.js"
};

/**
 * Main Generator Function
 * @param {Object} data - { "Sheet1": [[header, val], [val, val]] }
 * @param {string[]} sheetNames
 * @param {Object} options - { stats: bool, info: bool, desc: bool, rich: bool, workbookName: string }
 * @param {Object} libs - { css: string, js: string }
 */
export function generateHTML(data, sheetNames, options, libs) {
    const parts = [];
    parts.push(`<!DOCTYPE html><html lang='en' data-bs-theme='light'>`);
    parts.push("<head><meta charset='UTF-8'><title>DataVista Report</title>");

    // 1. CSS
    parts.push(`<style>${libs.css || ""}</style>`);

    // 2. Custom CSS - STRICT FIT TO SCREEN
    parts.push(`<style>
        :root { --header-bg: #3c6ea9; --header-text: white; }
        [data-bs-theme="dark"] { --header-bg: #1f2937; }

        html { scroll-behavior: smooth; }
        body { 
            background-color: var(--bs-body-bg); 
            color: var(--bs-body-color); 
            font-family: 'Segoe UI', sans-serif; 
            overflow-x: hidden; /* Prevent body scroll */
            width: 100vw;
        }
        
        /* Header Container */
        .dv-header {
            background-color: var(--header-bg); color: var(--header-text);
            padding: 12px 2rem; display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem; gap: 2rem;
        }
        [data-bs-theme="dark"] .dv-header { background-color: var(--header-bg-dark); }

        .dv-brand { font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .dv-meta { font-size: 0.75rem; opacity: 0.7; margin-top: 2px; }
        
        /* Navigation */
        .dv-header-tabs .nav-link { 
            border: none; color: rgba(255,255,255,0.7); background: transparent;
            padding: 8px 16px; font-weight: 500; border-radius: 20px; transition: all 0.2s; font-size: 0.85rem;
        }
        .dv-header-tabs .nav-link.active { color: white; background: rgba(255,255,255,0.2); }
        .theme-toggler { cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 16px; }

        .dv-container { padding: 0 20px 3rem 20px; max-width: 100vw; overflow-x: hidden; }

        /* Card */
        .dv-card { background: var(--bs-card-bg); border: 1px solid var(--bs-border-color); border-radius: 12px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 2rem; }

        /* === PRECISION HEADER & FILTERS (v9.0) === */
        .dv-table-wrapper { width: 100%; margin-bottom: 2rem; position: relative; }
        
        /* Header Styling */
        table.dataTable thead tr:first-child th {
            background: var(--bs-secondary-bg) !important;
            padding: 12px 18px !important;
            font-weight: 700 !important;
            border-bottom: 2px solid var(--bs-border-color) !important;
            vertical-align: middle !important;
        }
        
        /* Filter Row Styling */
        .filter-row th {
            padding: 4px 10px !important;
            background: var(--bs-body-bg) !important;
            border-bottom: 1px solid var(--bs-border-color) !important;
            line-height: 1 !important;
        }
        .filter-input {
            width: 100%;
            border: 1px solid var(--bs-border-color);
            padding: 5px 10px;
            font-size: 0.75rem;
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s;
        }
        .filter-input:focus { border-color: #00bcd4; box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.1); }

        /* SearchPanes Styling */
        .dtsp-searchPanes { margin-bottom: 1.5rem; border: 1px solid var(--bs-border-color); border-radius: 8px; padding: 15px; background: var(--bs-body-bg); }
        .dtsp-pane { border: none !important; }

        /* Controls Row */
        .dv-controls-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 12px; }
        .dv-search-group { display: flex; align-items: center; gap: 15px; }
        .dv-summary-stats { display: flex; gap: 10px; font-size: 0.85rem; color: var(--bs-secondary-color); border-right: 1px solid var(--bs-border-color); padding-right: 15px; }
        .dv-stat-badge { background: var(--bs-secondary-bg); padding: 2px 8px; border-radius: 4px; font-weight: 600; color: var(--bs-primary); }

        /* Navigator Bar Refinement */
        .dv-header-tabs {
            border-bottom: none !important;
            justify-content: center;
            gap: 5px;
        }
        .dv-header-tabs .nav-link {
            border: none !important;
            color: rgba(255,255,255,0.7) !important;
            padding: 8px 20px !important;
            border-radius: 20px !important;
            font-weight: 500;
            transition: all 0.3s;
        }
        .dv-header-tabs .nav-link:hover {
            color: white !important;
            background: rgba(255,255,255,0.1) !important;
        }
        .dv-header-tabs .nav-link.active {
            color: white !important;
            background: rgba(255,255,255,0.2) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Teal Advanced Filters Button */
        .btn-advanced-filters {
            background-color: #00bcd4 !important;
            color: white !important;
            border: none !important;
            font-weight: 600 !important;
            padding: 7px 18px !important;
            border-radius: 6px !important;
            transition: transform 0.1s, opacity 0.2s;
        }
        .btn-advanced-filters:hover { opacity: 0.95; transform: translateY(-1px); }
        .btn-advanced-filters:active { transform: translateY(0); }

        /* Gray Export Buttons */
        .dt-button {
            background-color: #6c757d !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 6px 14px !important;
            font-size: 0.85rem !important;
            margin-right: 4px !important;
            transition: background 0.2s;
        }
        .dt-button:hover { background-color: #5a6268 !important; }

        .dataTables_scrollBody { border: 1px solid var(--bs-border-color); border-radius: 0 0 8px 8px; }
        .dataTables_scrollHead { border: 1px solid var(--bs-border-color); border-bottom: none; border-radius: 8px 8px 0 0; background: var(--bs-secondary-bg); }

        table.dataTable { width: 100% !important; margin: 0 !important; table-layout: auto !important; border-collapse: collapse !important; }
        table.dataTable th, table.dataTable td { 
            white-space: nowrap !important; 
            vertical-align: middle; 
            padding: 12px 18px !important; 
            font-size: inherit; 
            min-width: 120px; 
        }

        /* RICH FORMATTING */
        .dv-pos { color: #28a745 !important; font-weight: 600; }
        .dv-neg { color: #dc3545 !important; font-weight: 600; }
        .dv-bar-cell { position: relative; z-index: 1; }
        .dv-bar { position: absolute; top: 2px; bottom: 2px; left: 0; background: rgba(0, 188, 212, 0.15); z-index: -1; }
    </style>`);

    parts.push("</head><body>");

    const timestamp = new Date().toLocaleString();
    const sheetName = sheetNames.length > 0 ? sheetNames[0] : "Report";
    parts.push(`
    <div class="dv-header">
        <div>
            <div class="dv-brand">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                DataVista <span style="opacity: 0.6; margin: 0 8px;">|</span> ${sheetName}
            </div>
            <div class="dv-meta">Generated: ${timestamp} &bull; v10.0 (UX Refined & Colored)</div>
        </div>
        <ul class="nav nav-tabs dv-header-tabs" role="tablist">
            <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#page-data">Data</a></li>
            ${options.info ? '<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#page-info">Info</a></li>' : ''}
            ${options.stats ? '<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#page-stats">Stats</a></li>' : ''}
        </ul>
        <div class="theme-toggler" onclick="document.documentElement.setAttribute('data-bs-theme', document.documentElement.getAttribute('data-bs-theme')==='dark'?'light':'dark')">
            <span>Theme</span>
        </div>
    </div>
    `);

    parts.push(`<div class="container-fluid dv-container">`);
    parts.push(`<div class="tab-content dv-tab-content">`);

    // --- DATA PAGE ---
    parts.push(`<div id="page-data" class="tab-pane fade show active">`);
    sheetNames.forEach((name, i) => {
        const rows = data[name];
        const hasHeader = rows.length > 0;
        const header = hasHeader ? rows[0] : [];
        // v10.0: Remove blank rows (rows that are all empty)
        const body = hasHeader ? rows.slice(1).filter(r => r.some(c => c && c.toString().trim() !== "")) : [];
        const colCount = header.length;

        // Dynamic Font Scaling Logic (v10.0 Refined)
        // Baseline: 1.0rem for < 6 cols
        // Reduce by 0.04rem for each col above 6
        // Min: 0.75rem (Improved readability)
        let fontSizeVal = 1.0;
        if (colCount > 6) {
            fontSizeVal = Math.max(0.75, 1.0 - ((colCount - 6) * 0.04));
        }
        const fontSizeStr = fontSizeVal.toFixed(2) + "rem";

        parts.push(`<div class="dv-sheet-section"><div class="dv-card">`);
        parts.push(`<div class="dv-table-wrapper">`); // Main wrapper for DataTables

        // Explicit style injection for font size
        parts.push(`<table class="table table-hover display table-bordered" style="width:100% !important; font-size:${fontSizeStr};">`);
        parts.push(`<thead>`);

        // Row 1: Titles
        parts.push(`<tr>`);
        header.forEach((h) => parts.push(`<th>${h}</th>`));
        parts.push(`</tr>`);

        // Row 2: Filters
        parts.push(`<tr class="filter-row">`);
        header.forEach(() => parts.push(`<th></th>`));
        parts.push(`</tr>`);

        parts.push(`</thead><tbody>`);

        body.forEach(row => {
            parts.push(`<tr>`);
            row.forEach((cell) => {
                parts.push(`<td>${cell || ""}</td>`);
            });
            parts.push(`</tr>`);
        });
        parts.push(`</tbody></table></div></div></div>`);
    });
    parts.push(`</div>`); // End Data Page

    // --- INFO & STATS PAGES (Simplified) ---
    if (options.info) {
        parts.push(`<div id="page-info" class="tab-pane fade"><div class="dv-card"><h5>Dataset Info</h5><div class="alert alert-info">Generated via DataVista Engine v3.0</div></div></div>`);
    }
    if (options.stats) {
        parts.push(`<div id="page-stats" class="tab-pane fade"><div class="dv-card"><h5>Statistics</h5><p>Statistics module initialized.</p></div></div>`);
    }

    parts.push(`</div></div>`); // End Container

    // SearchBuilder Modal
    parts.push(`
    <div class="modal fade" id="searchBuilderModal" tabindex="-1"><div class="modal-dialog modal-xl"><div class="modal-content"><div class="modal-body" id="sb-modal-body"></div></div></div></div>
    `);

    // Scripts
    parts.push(`<script>${libs.js || ""}</script>`);
    parts.push(`<script>
    $(document).ready(function() {
        $('table.display').each(function() {
            var table = $(this);
            // Initialize DataTable with STRICT options
            table.DataTable({
                dom: 'P<"dv-controls-row"B<"dv-search-group"f>>t<"row mt-3"<"col-md-6"i><"col-md-6"p>>',
                orderCellsTop: true, // Use first row for sorting
                searchPanes: {
                    cascadePanes: true,
                    viewTotal: true,
                    layout: 'columns-3'
                },
                autoWidth: false,
                scrollX: true,
                scrollCollapse: true,
                paging: true,
                pageLength: 20,
                rowCallback: function(row, data) {
                    // v10.0: Numeric Conditional Coloring
                    $('td', row).each(function() {
                        var text = $(this).text().trim();
                        var val = parseFloat(text.replace(/[^0-9.-]+/g, ""));
                        if (!isNaN(val) && !text.includes('/') && !text.includes('-20') && text.length < 15) {
                            if (val > 0) $(this).addClass('dv-pos');
                            else if (val < 0) $(this).addClass('dv-neg');
                        }
                    });
                },
                buttons: [
                    {
                        text: 'Advanced Filters',
                        className: 'btn-advanced-filters',
                        action: function (e, dt) {
                            $('#sb-modal-body').empty();
                            var sb = new $.fn.dataTable.SearchBuilder(dt, {});
                            $('#sb-modal-body').append(sb.getNode());
                            $('#searchBuilderModal').modal('show');
                        }
                    },
                    'copy', 'csv', 'excel', 'pdf', 'print', 'colvis'
                ],
                initComplete: function () {
                    var api = this.api();
                    
                    // Add Row/Col Counts
                    var rowCount = api.rows().count();
                    var colCount = api.columns().count();
                    var statsHtml = \`
                        <div class="dv-summary-stats">
                            <span>Total Rows: <span class="dv-stat-badge">\${rowCount}</span></span>
                            <span>Total Columns: <span class="dv-stat-badge">\${colCount}</span></span>
                        </div>
                    \`;
                    $('.dv-search-group').prepend(statsHtml);

                    // Inject filters into the SECOND header row
                    $(api.table().header()).find('tr.filter-row th').each(function (colIdx) {
                        $('<input type="text" class="filter-input" placeholder="Filter..." />')
                            .appendTo(this)
                            .on('keyup change', function (e) { 
                                e.stopPropagation();
                                api.column(colIdx).search(this.value).draw(); 
                            });
                    });
                    
                    setTimeout(function() { api.columns.adjust(); }, 150);
                }
            });
        });
    });
    </script>`);

    parts.push("</body></html>");
    return new Blob(parts, { type: "text/html" });
}
