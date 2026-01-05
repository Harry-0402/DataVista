
window.LIB_URLS = {
    jquery: "https://code.jquery.com/jquery-3.7.0.min.js",
    bootstrap_css: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css",
    bootstrap_js: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js",
    datatables_css: "https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css",
    datatables_js: "https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js",
    datatables_bs5_js: "https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js",
    buttons_css: "https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css",
    buttons_js: "https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js",
    buttons_bs5_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js",
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    pdfmake: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js",
    vfs_fonts: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js",
    buttons_html5_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js",
    buttons_print_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js",
    buttons_colvis_js: "https://cdn.datatables.net/buttons/2.4.1/js/buttons.colVis.min.js",
    searchbuilder_css: "https://cdn.datatables.net/searchbuilder/1.5.0/css/searchBuilder.bootstrap5.min.css",
    searchbuilder_js: "https://cdn.datatables.net/searchbuilder/1.5.0/js/dataTables.searchBuilder.min.js",
    searchbuilder_bs5_js: "https://cdn.datatables.net/searchbuilder/1.5.0/js/searchBuilder.bootstrap5.min.js",
    dateTime_css: "https://cdn.datatables.net/datetime/1.5.1/css/dataTables.dateTime.min.css",
    dateTime_js: "https://cdn.datatables.net/datetime/1.5.1/js/dataTables.dateTime.min.js"
};

Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {
        document.getElementById("run-btn").onclick = runAnalysis;
    }
});

async function runAnalysis() {
    try {
        updateStatus("Reading Excel Data...", "text-info");

        const source = document.querySelector('input[name="source"]:checked').value;
        const options = {
            stats: document.getElementById("opt-stats").checked,
            info: document.getElementById("opt-info").checked,
            desc: document.getElementById("opt-desc").checked,
            rich: document.getElementById("opt-formatting").checked
        };
        const format = document.querySelector('input[name="format"]:checked').value; // html only for now

        let data = {};
        let sheetNames = [];
        let workbookName = "Report";

        await Excel.run(async (context) => {
            // Get workbook name
            const workbook = context.workbook;
            workbook.load("name");
            await context.sync();
            workbookName = workbook.name || "Report";

            if (source === "selection") {
                const range = context.workbook.getSelectedRange();
                range.load("values");
                await context.sync();

                // Trim empty rows/cols
                const trimmed = trimEmptyGrid(range.values);

                if (!trimmed) throw new Error("Selection is empty");

                data["Selection"] = trimmed;
                sheetNames.push("Selection");
            } else {
                const sheets = context.workbook.worksheets;
                sheets.load("items/name");
                await context.sync();

                // 1. Queue all Range logic
                const sheetRanges = sheets.items.map(sheet => {
                    const rng = sheet.getUsedRangeOrNullObject();
                    rng.load("values, rowCount");
                    return { name: sheet.name, rng: rng };
                });

                // 2. Single Sync to fetch all data
                await context.sync();

                // 3. Process Data
                for (let item of sheetRanges) {
                    if (!item.rng.isNullObject && item.rng.rowCount > 0) {
                        const trimmed = trimEmptyGrid(item.rng.values);
                        if (trimmed) {
                            data[item.name] = trimmed;
                            sheetNames.push(item.name);
                        }
                    }
                }
            }
        });

        if (sheetNames.length === 0) throw new Error("No data found to export.");

        // Add workbook name to options
        options.workbookName = workbookName;

        // OFFLINE LIBRARY FETCHING
        updateStatus("Bundling Premium Libraries (Offline Mode)...", "text-warning");

        const libs = await fetchOfflineLibs();

        updateStatus("Generating Report...", "text-primary");

        let blob;
        if (source === "workbook") {
            // Use the new Dashboard Generator
            blob = generateWorkbookHTML(data, sheetNames, options, libs);
        } else {
            // Use the standard single-page Generator
            blob = generateHTML(data, sheetNames, options, libs);
        }

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `DataVista_Report_${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        updateStatus("Done! File downloaded.", "text-success");

    } catch (error) {
        console.error(error);
        updateStatus("Error: " + error.message, "text-danger");
    }
}

async function fetchOfflineLibs() {
    // 1. Get List from generators.js
    const urls = window.LIB_URLS;

    // 2. Fetch Helper
    const load = async (url) => {
        try {
            const r = await fetch(url);
            if (!r.ok) throw new Error(url);
            return await r.text();
        } catch (e) {
            console.warn("Failed to load lib: " + url);
            return `/* Failed: ${url} */`;
        }
    };

    // 3. Parallel Fetching for Speed
    // We strictly order the output concatenation
    const cssKeys = ['bootstrap_css', 'datatables_css', 'buttons_css', 'searchbuilder_css', 'dateTime_css'];
    const jsKeys = [
        'jquery', 'bootstrap_js', 'datatables_js', 'datatables_bs5_js',
        'jszip', 'pdfmake', 'vfs_fonts',
        'buttons_js', 'buttons_bs5_js', 'buttons_colvis_js', 'buttons_html5_js', 'buttons_print_js',
        'dateTime_js', 'searchbuilder_js', 'searchbuilder_bs5_js'
    ];

    const [cssArr, jsArr] = await Promise.all([
        Promise.all(cssKeys.map(k => load(urls[k]))),
        Promise.all(jsKeys.map(k => load(urls[k])))
    ]);

    return {
        css: cssArr.join("\n"),
        js: jsArr.join("\n")
    };
}

function updateStatus(msg, cls) {
    const el = document.getElementById("status");
    el.textContent = msg;
    el.className = "footer-status " + (cls || "text-muted");
}
