/* global console */

// Function to generate the HTML content for the Entire Workbook (Dashboard/Index Style)
export function generateWorkbookHTML(data, sheetNames, options, libs) {
    const timestamp = new Date().toLocaleString();
    const workbookName = options.workbookName || "Workbook";

    // 1. CSS & Styles (Reusing core styles + New Dashboard Styles)
    const styles = `
    <style>
        :root {
            --bs-body-bg: #ffffff;
            --bs-body-color: #212529;
            --bs-primary: #0d6efd;
            --bs-secondary: #6c757d;
            --bs-light: #f8f9fa;
            --bs-dark: #212529;
            --bs-border-color: #dee2e6;
            --dv-header-bg: #f8f9fa;
            --dv-header-color: #333;
        }
        [data-bs-theme="dark"] {
            --bs-body-bg: #212529;
            --bs-body-color: #f8f9fa;
            --bs-border-color: #495057;
            --dv-header-bg: #2c3034;
            --dv-header-color: #fff;
        }
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 0.9rem; margin: 0; padding: 0; background-color: var(--bs-body-bg); color: var(--bs-body-color); zoom: 0.9; }
        
        /* Dashboard / Index Styles */
        .dashboard-container { max-width: 1200px; margin: 50px auto; text-align: center; }
        .dashboard-header { margin-bottom: 50px; }
        .dashboard-title { font-size: 2.5rem; font-weight: 300; margin-bottom: 10px; }
        .dashboard-meta { color: var(--bs-secondary); }
        
        .sheet-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px; }
        .sheet-card {
            background: var(--bs-body-bg);
            border: 1px solid var(--bs-border-color);
            border-radius: 8px;
            padding: 30px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 150px;
            width: 280px;
        }
        .sheet-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-color: var(--bs-primary); }
        .sheet-icon { width: 40px; height: 40px; margin-bottom: 15px; color: var(--bs-primary); }
        .sheet-name { font-size: 1.2rem; font-weight: 500; }

        /* Sheet View Styles (Initially Hidden) */
        .view-section { display: none; padding-top: 20px; }
        .view-section.active { display: block; }

        /* Back Button Header */
        .sheet-header {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--dv-header-bg); color: var(--dv-header-color);
            padding: 10px 20px;
            border-bottom: 1px solid var(--bs-border-color);
            margin-bottom: 20px;
        }
        .btn-back { display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: 600; text-decoration: none; color: inherit; }
        .btn-back:hover { text-decoration: underline; }

        /* Table Styles (Compact) */
        table.dataTable { border-collapse: collapse !important; border: 1px solid var(--bs-border-color) !important; font-size: 0.8rem; width: 100% !important; table-layout: fixed; word-wrap: break-word; }
        table.dataTable thead th { border: 1px solid var(--bs-border-color); padding: 6px 8px; background: var(--bs-light); color: var(--bs-dark); }
        [data-bs-theme="dark"] table.dataTable thead th { background: #343a40; color: #fff; }
        table.dataTable tbody td { border: 1px solid var(--bs-border-color); padding: 4px 8px; }

        /* Modal Tweaks */
        .modal-backdrop.show { opacity: 0 !important; position: fixed; width: 100vw; height: 100vh; top: 0; left: 0; }
        .modal-content { box-shadow: none !important; border: 1px solid var(--bs-border-color); }
    </style>
    <style>${libs.css || ""}</style>
    `;

    const parts = [];
    parts.push(`<!DOCTYPE html><html lang="en" data-bs-theme="light"><head><meta charset="UTF-8"><title>${workbookName}</title>${styles}</head><body>`);

    // --- 1. DASHBOARD OVERVIEW (HOME) ---
    parts.push(`
    <div id="dashboard-view" class="view-section active">
        <div class="dashboard-container">
            <div class="dashboard-header">
                <div class="dv-brand" style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.5rem; font-weight: bold;">
                    <img src="https://Harry-0402.github.io/DataVista/assets/icon-32.png" width="32" height="32" style="margin-right: 10px;" alt="Logo">
                    DataVista Report
                </div>
                <h1 class="dashboard-title">${workbookName}</h1>
                <p class="dashboard-meta">Generated on ${timestamp} &bull; ${sheetNames.length} Sheets &bull; v2.1 (Fit-Screen)</p>
            </div>
            
            <div class="sheet-grid">
    `);

    // Render Buttons for each Sheet
    sheetNames.forEach((name, index) => {
        parts.push(`
        <div class="sheet-card" onclick="showSheet('${index}')">
            <svg class="sheet-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <div class="sheet-name">${name}</div>
        </div>
        `);
    });

    parts.push(`    </div></div></div>`);
    // End Dashboard View

    // --- 2. INDIVIDUAL SHEET VIEWS ---
    sheetNames.forEach((name, index) => {
        const rows = data[name];
        const header = rows.length > 0 ? rows[0] : [];
        const body = rows.length > 0 ? rows.slice(1) : [];

        parts.push(`
        <div id="sheet-view-${index}" class="view-section">
            <!-- Sheet Header -->
            <div class="sheet-header">
                <a class="btn-back" onclick="showDashboard()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Dashboard
                </a>
                <div style="font-size: 1.2rem; font-weight: bold;">${name}</div>
                <div class="theme-toggler" style="cursor: pointer;" onclick="toggleTheme()">
                     <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/></svg>
                </div>
            </div>

            <div class="container-fluid">
        `);

        // TABLE
        // We reuse the basic table generation but wrap it ensuring it has a unique ID if needed, 
        // though strictly they are in separate divs.
        parts.push(`<table class="table table-striped table-hover display" style="width:100%">`);

        // Thead
        parts.push(`<thead><tr>`);
        header.forEach(h => parts.push(`<th>${h || ""}</th>`));
        parts.push(`</tr></thead>`);

        // Tbody
        parts.push(`<tbody>`);
        body.forEach(r => {
            parts.push(`<tr>`);
            r.forEach(c => {
                const val = (c === null || c === undefined) ? "" : c;
                parts.push(`<td>${val}</td>`);
            });
            parts.push(`</tr>`);
        });
        parts.push(`</tbody>`);

        parts.push(`</table>`);

        parts.push(`</div></div>`); // End Container, End Sheet View
    });

    // --- 3. MODAL FOR ADVANCED FILTERS (Reusable) ---
    parts.push(`
    <div class="modal fade" id="searchBuilderModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content" style="background-color: var(--bs-body-bg); color: var(--bs-body-color);">
                <div class="modal-header">
                    <h5 class="modal-title">Advanced Filters</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="sb-modal-body"></div>
                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>
            </div>
        </div>
    </div>
    `);

    // --- 4. SCRIPTS ---
    parts.push(`<script>${libs.js || ""}</script>`);
    parts.push(`<script>
    // Navigation Logic
    function showDashboard() {
        $('.view-section').removeClass('active');
        $('#dashboard-view').addClass('active');
        document.title = "${workbookName}";
    }

    function showSheet(index) {
        $('.view-section').removeClass('active');
        $('#sheet-view-' + index).addClass('active');
        // We might want to trigger a redraw of DataTable if it was hidden
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    }

    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-bs-theme');
        html.setAttribute('data-bs-theme', current === 'dark' ? 'light' : 'dark');
    }

    $(document).ready(function() {
        // Initialize ALL tables
        $('table.display').each(function() {
            var table = $(this);
            var dt = table.DataTable({
                dom: '<"row mb-3"<"col-md-6"B><"col-md-6"f>>rt<"row mt-3"<"col-md-6"i><"col-md-6"p>>',
                pageLength: 15,
                autoWidth: false,
                scrollX: false,
                buttons: [
                    {
                         text: 'Advanced Filters',
                         className: 'btn-info me-3',
                         action: function (e, dt, node, config) {
                             // Clear previous SB
                             $('#sb-modal-body').empty();
                             var sb = new $.fn.dataTable.SearchBuilder(dt, {}); // Create for current table
                             $('#sb-modal-body').append(sb.getNode());
                             $('#searchBuilderModal').modal('show');
                         }
                    },
                    'copy', 'csv', 'excel',
                    {
                        extend: 'pdfHtml5',
                        orientation: 'landscape',
                        pageSize: 'A4',
                        customize: function(doc) {
                            // 1. Optimize Margins
                            doc.pageMargins = [10, 10, 10, 10];
                            
                            // 2. robust column count
                            var table = doc.content[1].table;
                            var colCount = table.body[0].length;
                            
                            // 3. Dynamic Font Scaling (More granular)
                            // Base 9, reduced by 0.2 for every column over 5, min 4
                            var fontSize = 9;
                            if(colCount > 5) {
                                fontSize = Math.max(4, 9 - ((colCount - 5) * 0.3)); 
                            }
                            
                            doc.defaultStyle.fontSize = fontSize;
                            doc.styles.tableHeader.fontSize = fontSize + 1;
                            doc.styles.title.fontSize = 12;

                            // 4. Force Fit Page Width
                            table.widths = new Array(colCount).fill('*');

                            // 5. Condensed margins & alignment
                            var rowCount = table.body.length;
                            for (var i = 1; i < rowCount; i++) {
                                table.body[i].forEach(function(cell) {
                                    if(!isNaN(Number(cell.text)) && cell.text !== "") {
                                        cell.alignment = 'right';
                                    }
                                    cell.margin = [1, 2, 1, 2];
                                });
                            }
                        }
                    },
                    'print', 'colvis'
                ],
                initComplete: function() {
                    var api = this.api();
                    api.columns().eq(0).each(function (colIdx) {
                        var header = $(api.column(colIdx).header());
                        var title = header.text();
                        var input = $('<input type="text" class="filter-input" placeholder="Filter..." style="width:100%; border:1px solid #ddd; border-radius:4px; padding:2px 4px; font-weight:normal;" />')
                            .appendTo(header.empty())
                            .on('keyup change', function () { api.column(colIdx).search(this.value).draw(); });
                        header.prepend('<div style="margin-bottom: 5px; font-weight: 600;">' + title + '</div>');
                    });
                }
            });
        });
    });
    </script></body></html>`);

    return new Blob([parts.join("")], { type: "text/html" });
}


