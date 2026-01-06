# Sideloading DataVista into Desktop Excel (Windows)

Since DataVista is a custom add-in, it does not appear in the Office Store. You need to "sideload" it to use it in Desktop Excel.

## Method 1: The "Shared Folder" Way (Most Reliable)

1.  **Locate your Project Folder**: `C:\Users\javis\OneDrive\Desktop\Tools\Excel Add-Ins`.
2.  **Share the Folder (CRITICAL STEP)**:
    *   Right-click the folder `Excel Add-Ins`.
    *   Select **Properties** -> **Sharing** tab.
    *   Click the **Share...** button.
    *   In the dropdown, select **Everyone** (or your name `javis`).
    *   Click **Add**, then click **Share** at the bottom.
    *   Click **Done**.
    *   **Verify**: You should now see "Network Path: `\\Zero\Excel Add-Ins`" in the Properties window.
3.  **Add to Excel Trust Center**:
    *   In the **Catalog Url** box, paste: `\\Zero\Excel Add-Ins`
    *   Click **Add Catalog**.
    *   Check the **Show in Menu** box that appears in the list.
    *   Click **OK** and **Restart Excel**.
4.  **Insert the Add-in**:
    *   Go to **Insert** -> **Add-ins** -> **My Add-ins**.
    *   Select the **Shared Folder** tab at the top.
    *   Click on **DataVista Premium Export** and click **Add**.

## Method 2: The "Upload My Add-in" Way (Easiest)

1.  Open Excel Desktop.
2.  Go to **Insert** -> **Add-ins** (or click the **Add-ins** button on the Home tab).
3.  Click **More Add-ins** at the bottom (as seen in your screenshot).
4.  In the Office Add-ins window, go to the **My Add-ins** tab.
5.  Look for a link in the corner: **Manage My Add-ins** -> **Upload My Add-in**.
6.  Browse and select your `manifest.xml` file.

> [!TIP]
> If you are working on the code and want to see changes instantly, running `npm start` in your terminal will attempt to automatically sideload the add-in for you.
