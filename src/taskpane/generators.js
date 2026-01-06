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

        /* === VISUAL PRECISION & FIXED CONTROLS (v6.0) === */
        .dv-table-wrapper {
            width: 100%;
            margin-bottom: 2rem;
            position: relative;
        }

        /* Buttons & Search Row */
        .dv-controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 10px;
        }

        /* Teal Advanced Filters Button */
        .btn-advanced-filters {
            background-color: #00bcd4 !important;
            color: white !important;
            border: none !important;
            font-weight: 600 !important;
            padding: 6px 16px !important;
            border-radius: 4px !important;
            transition: opacity 0.2s;
        }
        .btn-advanced-filters:hover { opacity: 0.9; }

        /* Gray Export Buttons */
        .dt-button {
            background-color: #6c757d !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 5px 12px !important;
            font-size: 0.8rem !important;
            margin-right: 4px !important;
        }
        .dt-button:hover { background-color: #5a6268 !important; }

        .dataTables_scrollBody { border: 1px solid var(--bs-border-color); border-radius: 0 0 8px 8px; }
        .dataTables_scrollHead { border: 1px solid var(--bs-border-color); border-bottom: none; border-radius: 8px 8px 0 0; background: var(--bs-secondary-bg); }

        table.dataTable { width: 100% !important; margin: 0 !important; table-layout: auto !important; border-collapse: collapse !important; }
        table.dataTable th, table.dataTable td { 
            white-space: nowrap !important; 
            vertical-align: middle; 
            padding: 12px 15px !important; 
            font-size: inherit; 
            min-width: 120px; 
        }

        /* RICH FORMATTING */
        .dv-neg { color: #dc3545 !important; font-weight: 500; }
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
            <div class="dv-meta">Generated: ${timestamp} &bull; v6.0 (Visual Precision)</div>
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
        const body = hasHeader ? rows.slice(1) : [];
        const colCount = header.length;

        // Dynamic Font Scaling Logic
        // Baseline: 0.9rem for < 6 cols
        // Reduce by 0.05rem for each col above 6
        // Min: 0.5rem
        let fontSizeVal = 0.9;
        if (colCount > 6) {
            fontSizeVal = Math.max(0.5, 0.9 - ((colCount - 6) * 0.05));
        }
        const fontSizeStr = fontSizeVal.toFixed(2) + "rem";

        parts.push(`<div class="dv-sheet-section"><div class="dv-card">`);
        parts.push(`<div class="dv-table-wrapper">`); // Main wrapper for DataTables

        // Explicit style injection for font size
        parts.push(`<table class="table table-hover display table-bordered" style="width:100% !important; font-size:${fontSizeStr};">`);
        parts.push(`<thead><tr>`);
        header.forEach((h) => parts.push(`<th>${h}</th>`));
        parts.push(`</tr></thead><tbody>`);

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
                dom: '<"dv-controls-row"Bf>t<"row mt-3"<"col-md-6"i><"col-md-6"p>>',
                autoWidth: false,
                scrollX: true,
                scrollCollapse: true,
                paging: true,
                pageLength: 20,
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
                    $(api.table().header()).find('th').each(function (colIdx) {
                        var title = $(this).text();
                        $(this).empty().append('<div style="margin-bottom:5px;font-weight:600;font-size:0.75rem;">'+title+'</div>');
                        $('<input type="text" class="filter-input" placeholder="Filter..." style="width:100%; border:1px solid #ddd; padding:2px; font-size:0.75rem;" />')
                            .appendTo(this)
                            .on('keyup change', function (e) { 
                                e.stopPropagation();
                                api.column(colIdx).search(this.value).draw(); 
                            });
                    });
                    setTimeout(function() { api.columns.adjust(); }, 100);
                }
            });
        });
    });
    </script>`);

    parts.push("</body></html>");
    return new Blob(parts, { type: "text/html" });
}
