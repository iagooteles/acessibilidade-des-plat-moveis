/**
 * Geocodificação via Nominatim (OpenStreetMap).
 * Uso: https://operations.osmfoundation.org/policies/nominatim/ — User-Agent identificável, uso moderado.
 */
const NOMINATIM_USER_AGENT =
  'acessibilidade-des-plat-mov/1.0 (projeto acadêmico; uso moderado de busca)';

export type NominatimHit = {
  lat: number;
  lon: number;
  displayName: string;
};

export async function nominatimSearch(termoDeBusca: string): Promise<NominatimHit | null> {
  const termoNormalizado = termoDeBusca.trim();
  if (!termoNormalizado) {
    return null;
  }

  const parametros = new URLSearchParams({
    q: termoNormalizado,
    format: 'json',
    limit: '1',
    'accept-language': 'pt-BR,pt',
    countrycodes: 'br',
  });

  const url = `https://nominatim.openstreetmap.org/search?${parametros.toString()}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': NOMINATIM_USER_AGENT,
      Accept: 'application/json',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim respondeu ${res.status}`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const item = data[0] as Record<string, unknown>;
  const lat = Number(item.lat);
  const lon = Number(item.lon);
  const displayName =
    typeof item.display_name === 'string'
      ? item.display_name
      : termoNormalizado;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon, displayName };
}
