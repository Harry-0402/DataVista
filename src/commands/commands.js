/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// Define library URLs for offline bundling (Same as taskpane.js)
import { trimEmptyGrid } from "../utils/grid";
import { getSettings, toggleSetting, updateSetting } from "../utils/settings";

const LIB_URLS = {
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

Office.onReady(() => {
    // If needed, Office.js is ready to be called
});

/**
 * Toggle Commands
 */
function toggleStats(event) {
    toggleSetting('stats');
    event.completed();
}
function toggleInfo(event) {
    toggleSetting('info');
    event.completed();
}
function toggleDesc(event) {
    toggleSetting('desc');
    event.completed();
}
function toggleRich(event) {
    toggleSetting('rich');
    event.completed();
}
function toggleDark(event) {
    const s = getSettings();
    const newTheme = s.theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', newTheme);
    event.completed();
}

/**
 * Exports the currently selected range.
 * @param event {Office.AddinCommands.Event}
 */
async function exportSelection(event) {
    await runHeadlessExport("selection", event);
}

/**
 * Exports the entire workbook.
 * @param event {Office.AddinCommands.Event}
 */
async function exportWorkbook(event) {
    await runHeadlessExport("workbook", event);
}

async function runHeadlessExport(source, event) {
    try {
        // Load Settings
        const settings = getSettings();

        const options = {
            stats: settings.stats,
            info: settings.info,
            desc: settings.desc,
            rich: settings.rich,
            workbookName: "Report",
            theme: settings.theme // Pass theme to generator
        };

        let data = {};
        let sheetNames = [];

        await Excel.run(async (context) => {
            const workbook = context.workbook;
            workbook.load("name");
            await context.sync();
            options.workbookName = workbook.name || "Report";

            if (source === "selection") {
                const range = context.workbook.getSelectedRange();
                range.load("values");
                await context.sync();

                // Trim empty
                const trimmed = trimEmptyGrid(range.values);
                if (!trimmed) throw new Error("Selection is empty");

                data["Selection"] = trimmed;
                sheetNames.push("Selection");
            } else {
                const sheets = context.workbook.worksheets;
                sheets.load("items/name");
                await context.sync();

                const sheetRanges = sheets.items.map(sheet => {
                    const rng = sheet.getUsedRangeOrNullObject();
                    rng.load("values, rowCount");
                    return { name: sheet.name, rng: rng };
                });
                await context.sync();

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

        if (sheetNames.length === 0) throw new Error("No data found.");

        // Fetch Libs
        const libs = await fetchOfflineLibs();

        let blob;
        if (source === "workbook") {
            blob = generateWorkbookHTML(data, sheetNames, options, libs); // From workbook_generators.js
        } else {
            blob = generateHTML(data, sheetNames, options, libs); // From generators.js
        }

        // Trigger Download
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `DataVista_${options.workbookName}_${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        console.error(error);
    } finally {
        event.completed();
    }
}

async function fetchOfflineLibs() {
    const urls = LIB_URLS;
    const load = async (url) => {
        try {
            const r = await fetch(url);
            if (!r.ok) throw new Error(url);
            return await r.text();
        } catch (e) {
            return `/* Failed: ${url} */`;
        }
    };

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

const g = getGlobal();
g.exportSelection = exportSelection;
g.exportWorkbook = exportWorkbook;
g.toggleStats = toggleStats;
g.toggleInfo = toggleInfo;
g.toggleDesc = toggleDesc;
g.toggleRich = toggleRich;
g.toggleDark = toggleDark;

function getGlobal() {
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : undefined;
}
