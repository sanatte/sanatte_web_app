type Rgb = readonly [number, number, number];

const FALLBACK: Rgb = [27, 38, 86];

function themeRgb(role: string): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${role}`).trim();
  const channels = raw.split(/\s+/).map(Number);
  return channels.length === 3 && channels.every(Number.isFinite) ? [channels[0], channels[1], channels[2]] : FALLBACK;
}

export function themeHex(role: string): string {
  return `#${themeRgb(role).map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function themeRgba(role: string, alpha: number): string {
  return `rgba(${themeRgb(role).join(', ')}, ${alpha})`;
}
