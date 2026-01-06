/* global console */

// Function to generate the HTML content for the Entire Workbook (Dashboard/Index Style)
export function generateWorkbookHTML(data, sheetNames, options, libs) {
    const timestamp = new Date().toLocaleString();
    const workbookName = options.workbookName || "Workbook";

    // 1. CSS & Styles (Reusing Strict Core Styles)
    const styles = `
    <style>
        :root {
            --bs-body-bg: #ffffff;
            --bs-body-color: #212529;
            --bs-primary: #0d6efd;
            --bs-border-color: #dee2e6;
            --dv-header-bg: #f8f9fa;
        }
        [data-bs-theme="dark"] {
            --bs-body-bg: #212529;
            --bs-body-color: #f8f9fa;
            --bs-border-color: #495057;
            --dv-header-bg: #2c3034;
        }
        body { 
            font-family: 'Segoe UI', sans-serif; 
            margin: 0; padding: 0; 
            background-color: var(--bs-body-bg); color: var(--bs-body-color);
            overflow-x: hidden; 
            width: 100vw;
        }
        
        /* Dashboard Styles */
        .dashboard-container { max-width: 1200px; margin: 50px auto; text-align: center; }
        .dashboard-title { font-size: 2.5rem; font-weight: 300; margin-bottom: 10px; }
        .dashboard-meta { color: gray; }
        
        .sheet-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px; }
        .sheet-card {
            background: var(--bs-body-bg);
            border: 1px solid var(--bs-border-color);
            border-radius: 8px;
            padding: 30px;
            cursor: pointer;
            transition: transform 0.2s;
            width: 280px;
        }
        .sheet-card:hover { transform: translateY(-5px); border-color: var(--bs-primary); }
        .sheet-name { font-size: 1.2rem; font-weight: 500; margin-top: 15px; }

        /* Sheet View Styles */
        .view-section { display: none; padding-top: 0; }
        .view-section.active { display: block; }

        .sheet-header {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--dv-header-bg); padding: 10px 20px;
            border-bottom: 1px solid var(--bs-border-color); margin-bottom: 20px;
        }
        .btn-back { cursor: pointer; font-weight: 600; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 5px; }

        /* === VISUAL PRECISION & FIXED CONTROLS (v8.0) === */
        .dv-table-wrapper { width: 100%; margin-bottom: 2rem; position: relative; }
        .dv-controls-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 12px; }
        
        .dv-search-group { display: flex; align-items: center; gap: 15px; }
        .dv-summary-stats { display: flex; gap: 10px; font-size: 0.85rem; color: var(--bs-secondary-color); border-right: 1px solid var(--bs-border-color); padding-right: 15px; }
        .dv-stat-badge { background: var(--bs-secondary-bg); padding: 2px 8px; border-radius: 4px; font-weight: 600; color: var(--dv-primary); }

        .btn-advanced-filters { background-color: #00bcd4 !important; color: white !important; border: none !important; font-weight: 600 !important; padding: 7px 18px !important; border-radius: 6px !important; transition: opacity 0.2s, transform 0.1s; }
        .btn-advanced-filters:hover { opacity: 0.95; transform: translateY(-1px); }

        .dt-button { background-color: #6c757d !important; color: white !important; border: none !important; border-radius: 6px !important; padding: 6px 14px !important; font-size: 0.85rem !important; margin-right: 4px !important; transition: background 0.2s; }
        .dt-button:hover { background-color: #5a6268 !important; }

        .dataTables_scrollBody { border: 1px solid var(--bs-border-color); border-radius: 0 0 8px 8px; }
        .dataTables_scrollHead { border: 1px solid var(--bs-border-color); border-bottom: none; border-radius: 8px 8px 0 0; background: var(--dv-header-bg); }

        table.dataTable { width: 100% !important; margin: 0 !important; table-layout: auto !important; border-collapse: collapse !important; }
        table.dataTable th, table.dataTable td { white-space: nowrap !important; vertical-align: middle; padding: 12px 18px !important; border: 1px solid var(--bs-border-color); min-width: 120px; }

        .filter-input { width: 100%; border: 1px solid var(--bs-border-color); padding: 2px; font-size: 0.75rem; border-radius: 3px; }
        .dataTables_paginate { display: flex; justify-content: flex-end; margin-top: 10px; font-size: 0.8rem; }
    </style>
    <style>${libs.css || ""}</style>
    `;

    const parts = [];
    parts.push(`<!DOCTYPE html><html lang="en" data-bs-theme="light"><head><meta charset="UTF-8"><title>${workbookName}</title>${styles}</head><body>`);

    // --- 1. DASHBOARD OVERVIEW ---
    parts.push(`
    <div id="dashboard-view" class="view-section active">
        <div class="dashboard-container">
            <div class="dashboard-header">
                <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 20px;">
                    <img src="https://Harry-0402.github.io/DataVista/assets/icon-32.png" width="32" height="32" style="margin-right: 10px;">
                    DataVista Report
                </div>
                <h1 class="dashboard-title">${workbookName}</h1>
                <p class="dashboard-meta">Generated on ${timestamp} &bull; ${sheetNames.length} Sheets &bull; v8.0 (Enhanced UI)</p>
            </div>
            <div class="sheet-grid">
    `);

    sheetNames.forEach((name, index) => {
        parts.push(`
        <div class="sheet-card" onclick="showSheet('${index}')">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <div class="sheet-name">${name}</div>
        </div>
        `);
    });
    parts.push(`</div></div></div>`);

    // --- 2. INDIVIDUAL SHEET VIEWS ---
    sheetNames.forEach((name, index) => {
        const rows = data[name];
        const header = rows.length > 0 ? rows[0] : [];
        const body = rows.length > 0 ? rows.slice(1) : [];

        // Dynamic Font Scaling
        const colCount = header.length;
        let fontSizeVal = 0.9;
        if (colCount > 6) {
            fontSizeVal = Math.max(0.5, 0.9 - ((colCount - 6) * 0.05));
        }
        const fontSizeStr = fontSizeVal.toFixed(2) + "rem";

        parts.push(`
        <div id="sheet-view-${index}" class="view-section">
            <div class="sheet-header">
                <a class="btn-back" onclick="showDashboard()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Dashboard
                </a>
                <div style="font-weight: bold;">${name}</div>
                <div onclick="document.documentElement.setAttribute('data-bs-theme', document.documentElement.getAttribute('data-bs-theme')==='dark'?'light':'dark')" style="cursor: pointer;">Theme</div>
            </div>
            <div class="container-fluid" style="padding: 0 20px;">
                <div class="dv-table-wrapper">
                    <table class="table table-striped table-hover display table-bordered" style="width:100% !important; font-size:${fontSizeStr};">
                        <thead><tr>${header.map(h => `<th>${h || ""}</th>`).join('')}</tr></thead>
                        <tbody>
                            ${body.map(r => `<tr>${r.map(c => `<td>${c || ""}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `);
    });

    parts.push(`
    <div class="modal fade" id="searchBuilderModal" tabindex="-1"><div class="modal-dialog modal-xl"><div class="modal-content"><div class="modal-body" id="sb-modal-body"></div></div></div></div>
    `);

    // --- 3. SCRIPTS ---
    parts.push(`<script>${libs.js || ""}</script>`);
    parts.push(`<script>
    function showDashboard() { $('.view-section').removeClass('active'); $('#dashboard-view').addClass('active'); }
    function showSheet(index) { 
        $('.view-section').removeClass('active'); 
        $('#sheet-view-' + index).addClass('active'); 
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    }

    $(document).ready(function() {
        $('table.display').each(function() {
            var table = $(this);
            table.DataTable({
                dom: '<"dv-controls-row"B<"dv-search-group"f>>t<"row mt-3"<"col-md-6"i><"col-md-6"p>>',
                autoWidth: false,
                scrollX: true,
                scrollCollapse: true,
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
                initComplete: function() {
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
                    $(this).closest('.dv-table-wrapper').find('.dv-search-group').prepend(statsHtml);

                    $(api.table().header()).find('th').each(function (colIdx) {
                        var title = $(this).text();
                        $(this).empty().append('<div style="margin-bottom:5px;font-weight:600;font-size:0.75rem;">'+title+'</div>');
                        $('<input type="text" class="filter-input" placeholder="Filter..." style="width:100%; border:1px solid var(--bs-border-color); padding:4px; font-size:0.75rem; border-radius:4px; outline:none;" />')
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
    </script></body></html>`);

    return new Blob([parts.join("")], { type: "text/html" });
}
