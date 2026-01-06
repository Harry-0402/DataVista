/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// We don't need to import generators here anymore, as this taskpane is just a static guide.
// The commands.js handles the actual export logic from the Ribbon.

Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {
        console.log("DataVista Taskpane Guide Loaded");
        document.getElementById("status").innerText = "Add-in Ready";
    }
});
