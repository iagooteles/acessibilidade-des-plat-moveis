const DEFAULT_TILE_URL =
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export function getMapTileUrlTemplate(): string {
  const fromEnv = process.env.EXPO_PUBLIC_MAP_TILE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_TILE_URL;
}

export function getMapTileAttribution(): string {
  const fromEnv = process.env.EXPO_PUBLIC_MAP_TILE_ATTRIBUTION?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ATTRIBUTION;
}

/** Centro inicial (Brasil). */
export const MAP_DEFAULT_CENTER = { lat: -14.235, long: -51.9253 };
export const MAP_DEFAULT_ZOOM = 4;
