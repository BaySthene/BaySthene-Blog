// Utility functions for image optimization

/**
 * Generate a shimmer SVG for blur placeholder
 * Creates a gradient animation while image loads
 */
export function shimmer(w: number, h: number): string {
    return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#2a2a3e" offset="20%" />
      <stop stop-color="#3a3a4e" offset="50%" />
      <stop stop-color="#2a2a3e" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#2a2a3e" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;
}

/**
 * Convert SVG to base64 data URL
 */
function toBase64(str: string): string {
    return typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);
}

/**
 * Generate a data URL for shimmer placeholder
 */
export function getShimmerPlaceholder(w: number = 700, h: number = 475): `data:image/${string}` {
    return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}

/**
 * Generate a solid color blur placeholder
 * More lightweight than shimmer for small images
 */
export function getColorPlaceholder(color: string = '#2a2a3e'): `data:image/${string}` {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="${color}" width="1" height="1"/></svg>`;
    return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

/**
 * Dominant color placeholders for common scenarios
 */
export const placeholders = {
    dark: getColorPlaceholder('#1a1a2e'),
    light: getColorPlaceholder('#f0f0f0'),
    primary: getColorPlaceholder('#6750a4'),
    surface: getColorPlaceholder('#2a2a3e'),
} as const;
