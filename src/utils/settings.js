
const STORAGE_KEY = "DataVista_Settings";

const DEFAULTS = {
    stats: true,
    info: true,
    desc: false,
    rich: true,
    theme: 'light'
};

/**
 * Gets the current settings, merging with defaults.
 * @returns {typeof DEFAULTS}
 */
export function getSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULTS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.warn("Failed to read settings", e);
    }
    return { ...DEFAULTS };
}

/**
 * Updates a specific setting key.
 * @param {keyof DEFAULTS} key 
 * @param {boolean|string} value 
 */
export function updateSetting(key, value) {
    const current = getSettings();
    current[key] = value;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
        console.warn("Failed to save settings", e);
    }
    return current;
}

/**
 * Toggles a boolean setting.
 * @param {keyof DEFAULTS} key 
 * @returns {boolean} The new value
 */
export function toggleSetting(key) {
    const current = getSettings();
    const newValue = !current[key];
    updateSetting(key, newValue);
    return newValue;
}
