import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { PontoMapa } from '../../services/locaisFirebase';
import {
  buildLeafletEmbedHtml,
  injectMapCommand,
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
  const webRef = useRef<WebView>(null);
  const [mapCarregado, setMapCarregado] = useState(false);

  const html = useMemo(() => buildLeafletEmbedHtml(), []);

  useImperativeHandle(ref, () => ({
    flyTo(lat: number, long: number, zoom = 16) {
      webRef.current?.injectJavaScript(
        injectMapCommand(mapCommandFlyTo(lat, long, zoom))
      );
    },
  }));

  useEffect(() => {
    if (!mapCarregado) {
      return;
    }
    webRef.current?.injectJavaScript(
      injectMapCommand(mapCommandMarcacao(marcacaoAtiva))
    );
  }, [marcacaoAtiva, mapCarregado]);

  useEffect(() => {
    if (!mapCarregado) {
      return;
    }
    webRef.current?.injectJavaScript(
      injectMapCommand(mapCommandPontos(pontosNoMapa))
    );
  }, [pontosNoMapa, mapCarregado]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(String(e.nativeEvent.data)) as {
        type?: string;
        lat?: number;
        long?: number;
      };
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
    } catch {
      /* ignore */
    }
  };

  return (
    <View style={[styles.wrap, style]} accessibilityLabel="Mapa OpenStreetMap">
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://unpkg.com/' }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        setBuiltInZoomControls={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        mixedContentMode="always"
        onMessage={onMessage}
        {...(Platform.OS === 'android' ? { overScrollMode: 'never' as const } : {})}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },
});
