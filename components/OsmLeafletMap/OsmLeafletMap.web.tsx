import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PontoMapa } from '../../services/locaisFirebase';
import {
  buildLeafletEmbedHtml,
  mapCommandFlyTo,
  mapCommandMarcacao,
  mapCommandPontos,
} from './leafletEmbed';

export type OsmLeafletMapHandle = {
  flyTo(lat: number, long: number, zoom?: number): void;
};

type OsmLeafletMapProps = {
  style?: StyleProp<ViewStyle>;
  onMapReady?: () => void;
  marcacaoAtiva?: boolean;
  onMarcacaoNoMapa?: (lat: number, long: number) => void;
  pontosNoMapa?: PontoMapa[];
};

export const OsmLeafletMap = forwardRef<
  OsmLeafletMapHandle,
  Readonly<OsmLeafletMapProps>
>(function OsmLeafletMap(
  {
    style,
    onMapReady,
    marcacaoAtiva = false,
    onMarcacaoNoMapa,
    pontosNoMapa = [],
  },
  ref
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mapCarregado, setMapCarregado] = useState(false);

  const html = useMemo(() => buildLeafletEmbedHtml(), []);

  const postParaMapa = (cmd: Record<string, unknown>) => {
    const origem = typeof window !== 'undefined' ? window.location.origin : '*';
    iframeRef.current?.contentWindow?.postMessage(cmd, origem);
  };

  useImperativeHandle(ref, () => ({
    flyTo(lat: number, long: number, zoom = 16) {
      postParaMapa(mapCommandFlyTo(lat, long, zoom));
    },
  }));

  useEffect(() => {
    if (!mapCarregado) {
      return;
    }
    postParaMapa(mapCommandMarcacao(marcacaoAtiva));
  }, [marcacaoAtiva, mapCarregado]);

  useEffect(() => {
    if (!mapCarregado) {
      return;
    }
    postParaMapa(mapCommandPontos(pontosNoMapa));
  }, [pontosNoMapa, mapCarregado]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) {
        return;
      }
      const msg = e.data as {
        type?: string;
        lat?: number;
        long?: number;
      };
      if (!msg || typeof msg !== 'object') {
        return;
      }
      if (msg.type === 'mapReady') {
        setMapCarregado(true);
        onMapReady?.();
      }
      if (
        msg.type === 'mapTap' &&
        typeof msg.lat === 'number' &&
        typeof msg.long === 'number'
      ) {
        onMarcacaoNoMapa?.(msg.lat, msg.long);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMarcacaoNoMapa, onMapReady]);

  return (
    <View style={[styles.wrap, style]} accessibilityLabel="Mapa OpenStreetMap">
      <iframe
        ref={iframeRef}
        srcDoc={html}
        title="Mapa OpenStreetMap"
        style={styles.iframe}
        sandbox="allow-scripts allow-same-origin"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    flex: 1,
    minHeight: 200,
  } as const,
});
