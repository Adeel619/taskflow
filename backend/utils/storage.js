/**
 * TaskFlow - Data Storage Utility
 * Handles reading and writing JSON data files for persistent storage.
 * Windows-compatible: ensures data directory exists and uses
 * safe write patterns to avoid EPERM permission errors.
 */

const fs   = require('fs');
const path = require('path');

// Absolute path to the data directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure the data directory exists when the module loads
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Reads a JSON data file and returns its parsed contents.
 * Returns an empty array if the file doesn't exist yet.
 * @param {string} filename - e.g. 'tasks.json'
 * @returns {Array}
 */
function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`[storage] Error reading ${filename}:`, err.message);
    return [];
  }
}

/**
 * Writes data array to a JSON file.
 * Uses write-to-temp-then-rename strategy to avoid Windows EPERM
 * errors that occur when overwriting a file that is still open.
 * Falls back to a direct write if rename fails.
 * @param {string} filename - e.g. 'tasks.json'
 * @param {Array}  data     - Records to persist
 */
function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const tmpPath  = filePath + '.tmp';
  const json     = JSON.stringify(data, null, 2);

  try {
    // Step 1: Write to a temp file
    fs.writeFileSync(tmpPath, json, { encoding: 'utf-8', flag: 'w' });

    // Step 2: On Windows, delete destination before renaming (avoids EPERM)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Step 3: Rename temp → final
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Clean up temp file on failure
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch (_) {}

    // Direct fallback — works on most systems when rename fails
    try {
      fs.writeFileSync(filePath, json, 'utf-8');
    } catch (fallbackErr) {
      console.error(`[storage] Failed to write ${filename}:`, fallbackErr.message);
      throw fallbackErr;
    }
  }
}

module.exports = { readData, writeData };
