
/**
 * Trims empty rows and columns from a 2D array.
 * @param {any[][]} data 
 * @returns {any[][] | null} Trimmed data or null if empty
 */
export function trimEmptyGrid(data) {
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
