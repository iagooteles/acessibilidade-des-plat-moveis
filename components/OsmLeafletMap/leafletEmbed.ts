import type { PontoMapa } from '../../services/locaisFirebase';
import {
  getMapTileAttribution,
  getMapTileUrlTemplate,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
} from '../../config/mapTiles';

/**
 * HTML único do mapa (Leaflet). Comunicação com o app:
 * - Para fora: `__postToApp` (ReactNativeWebView no nativo, `parent` na web em iframe).
 * - Para dentro: `window.postMessage({ type, ... }, '*')` (inject no nativo; postMessage do pai na web).
 *
 * No payload usamos `long` (longitude em graus). Dentro do Leaflet continua `LatLng.lng` (API da lib).
 */
export function buildLeafletEmbedHtml(): string {
  const tileUrlJs = JSON.stringify(getMapTileUrlTemplate());
  const attributionJs = JSON.stringify(getMapTileAttribution());
  const lat0 = MAP_DEFAULT_CENTER.lat;
  const long0 = MAP_DEFAULT_CENTER.long;
  const z0 = MAP_DEFAULT_ZOOM;
  const leafletCss = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const leafletJs = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="${leafletCss}" />
  <script src="${leafletJs}"></script>
  <style>
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
    .leaflet-control-attribution { font-size: 10px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      function __postToApp(payload) {
        try {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          } else if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, '*');
          }
        } catch (e) {}
      }

      function applyFlyTo(cmd) {
        var m = window.__osmMap;
        if (!m) return;
        var z = cmd.zoom != null ? Number(cmd.zoom) : 16;
        z = Math.min(19, Math.max(3, z));
        var la = Number(cmd.lat), lo = Number(cmd.long);
        m.setView([la, lo], z);
        if (window.__searchMarker) {
          try { m.removeLayer(window.__searchMarker); } catch (e) {}
        }
        window.__searchMarker = L.marker([la, lo]).addTo(m);
      }

      function applyMarcacao(active) {
        var m = window.__osmMap;
        if (!m) return;
        if (window.__tapMarcacao) {
          m.off('click', window.__tapMarcacao);
          window.__tapMarcacao = null;
        }
        if (window.__draftMarker) {
          try { m.removeLayer(window.__draftMarker); } catch (e) {}
          window.__draftMarker = null;
        }
        if (active) {
          window.__tapMarcacao = function (e) {
            var lat = e.latlng.lat, long = e.latlng.lng;
            if (window.__draftMarker) {
              try { m.removeLayer(window.__draftMarker); } catch (err) {}
            }
            window.__draftMarker = L.marker([lat, long]).addTo(m);
            __postToApp({ type: 'mapTap', lat: lat, long: long });
          };
          m.on('click', window.__tapMarcacao);
        }
      }

      function applyPontos(pts) {
        var m = window.__osmMap;
        if (!m) return;
        if (window.__locaisLayer) {
          try { m.removeLayer(window.__locaisLayer); } catch (e) {}
          window.__locaisLayer = null;
        }
        if (pts && pts.length) {
          window.__locaisLayer = L.layerGroup();
          pts.forEach(function (p) {
            L.marker([p.lat, p.long]).addTo(window.__locaisLayer);
          });
          window.__locaisLayer.addTo(m);
        }
      }

      window.addEventListener('message', function (ev) {
        var payload = ev.data;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch (e) { return; }
        }
        if (!payload || !payload.type) return;
        if (payload.type === 'flyTo') {
          applyFlyTo(payload);
          return;
        }
        if (payload.type === 'marcacao') {
          applyMarcacao(!!payload.active);
          return;
        }
        if (payload.type === 'pontos') {
          applyPontos(payload.pontos || []);
        }
      });

      var map = L.map('map', { zoomControl: true }).setView([${lat0}, ${long0}], ${z0});
      window.__osmMap = map;
      L.tileLayer(${tileUrlJs}, {
        attribution: ${attributionJs},
        maxZoom: 19,
        crossOrigin: true
      }).addTo(map);
      __postToApp({ type: 'mapReady' });
    })();
  </script>
</body>
</html>`;
}

export function mapCommandFlyTo(lat: number, long: number, zoom = 16): Record<string, unknown> {
  const z = Math.min(19, Math.max(3, zoom));
  return { type: 'flyTo', lat, long, zoom: z };
}

export function mapCommandMarcacao(ativo: boolean): Record<string, unknown> {
  return { type: 'marcacao', active: ativo };
}

export function mapCommandPontos(pontos: PontoMapa[]): Record<string, unknown> {
  return {
    type: 'pontos',
    pontos: pontos.map((p) => ({ id: p.id, lat: p.lat, long: p.long })),
  };
}

/** Script para WebView nativo: repassa comando ao listener dentro do HTML. */
export function injectMapCommand(cmd: Record<string, unknown>): string {
  const json = JSON.stringify(cmd);
  return `(function(){ try { window.postMessage(${json}, '*'); } catch (e) {} return true; })();`;
}
