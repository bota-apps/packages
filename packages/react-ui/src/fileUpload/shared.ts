/**
 * Private helpers shared by the upload control and its selection preview.
 * Not re-exported from `index.tsx` — internal to the module.
 */

const byteUnits = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < byteUnits.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded} ${byteUnits[unit]}`;
}

/**
 * Identity key for a selected file: two picks of the same on-disk file produce
 * equal keys (name + size + mtime + type), two different files practically
 * never do. Used to skip duplicates in multi-select and as the stable list key.
 */
export function fileKey(file: File): string {
  return [file.name, file.size, file.lastModified, file.type].join(":");
}
