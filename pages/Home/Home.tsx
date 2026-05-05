import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  OsmLeafletMap,
  type OsmLeafletMapHandle,
} from '../../components/OsmLeafletMap/OsmLeafletMap';
import { nominatimSearch } from '../../services/nominatimGeocode';
import {
  listarLocaisParaMapa,
  type PontoMapa,
} from '../../services/locaisFirebase';
import { useAuth } from '../../components/AuthProvider';
import Avaliation from '../Avaliation/Avaliation';
import { Profile } from '../Profile/Profile';
import { Detalhes } from '../Detalhes/Detalhes';
import { styles } from './styles';
import { Footer, FooterButton } from '../../components/Footer/Footer';

type HomeProps = {
  onPrecisaLogin: () => void;
};

export function Home({ onPrecisaLogin }: Readonly<HomeProps>) {
  const { user } = useAuth();
  const [verProfile, setVerProfile] = useState(false);
  const [verAvaliation, setVerAvaliation] = useState(false);
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [rampa, setRampa] = useState(false);
  const [piso, setPiso] = useState(true);
  const [estacionamento, setEstacionamento] = useState(false);
  const [sinalizacao, setSinalizacao] = useState(false);
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const mapRef = useRef<OsmLeafletMapHandle>(null);
  const [marcandoLocal, setMarcandoLocal] = useState(false);
  const [coordsNovoLocal, setCoordsNovoLocal] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [locaisMapa, setLocaisMapa] = useState<PontoMapa[]>([]);
  const [avisarLoginParaMapa, setAvisarLoginParaMapa] = useState(false);

  const refetchLocais = useCallback(async () => {
    try {
      if (!user) {
        setLocaisMapa([]);
        return;
      }
      const lista = await listarLocaisParaMapa();
      setLocaisMapa(lista);
    } catch {
      setLocaisMapa([]);
    }
  }, [user]);

  const executarBuscaNoMapa = useCallback(async () => {
    const q = busca.trim();
    if (!q) {
      return;
    }
    Keyboard.dismiss();
    setBuscando(true);
    try {
      const hit = await nominatimSearch(q);
      if (!hit) {
        Alert.alert(
          'Busca',
          'Não encontramos esse lugar. Tente outra rua, bairro ou cidade.'
        );
        return;
      }
      mapRef.current?.flyTo(hit.lat, hit.lon, 16);
    } catch {
      Alert.alert(
        'Busca',
        'Não foi possível buscar agora. Verifique a internet e tente de novo.'
      );
    } finally {
      setBuscando(false);
    }
  }, [busca]);

  useEffect(() => {
    if (!user && verProfile) {
      setVerProfile(false);
    }
  }, [user, verProfile]);

  useEffect(() => {
    void refetchLocais();
  }, [refetchLocais]);

  if (verProfile) {
    return <Profile onVoltar={() => setVerProfile(false)} />;
  }

  if (verAvaliation && coordsNovoLocal) {
    return (
      <Avaliation
        coordenadas={coordsNovoLocal}
        onVoltar={() => {
          setVerAvaliation(false);
          setCoordsNovoLocal(null);
        }}
        onSalvo={() => {
          mapRef.current?.flyTo(
            coordsNovoLocal.lat,
            coordsNovoLocal.long,
            17
          );
          void refetchLocais();
        }}
      />
    );
  }

  if (verDetalhes) {
    return <Detalhes onVoltar={() => setVerDetalhes(false)} />
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Mapa</Text>
        </View>
        <View style={styles.headerSideRight}>
          <Pressable
            onPress={() => setMostrarFiltro(!mostrarFiltro)}
            accessibilityRole="button"
            accessibilityLabel="Filtrar mapa"
          >
            <Text style={styles.filterText}>Filtrar</Text>
          </Pressable>
        </View>
      </View>

      {/* MAPA */}
      <View style={styles.mapContainer}>
        {mostrarFiltro && (
          <View style={styles.filtroCard}>
            <Pressable onPress={() => setRampa(!rampa)}>
              <Text>{rampa ? '☑' : '☐'} Rampa de acesso</Text>
            </Pressable>

            <Pressable onPress={() => setPiso(!piso)}>
              <Text>{piso ? '☑' : '☐'} Piso tátil</Text>
            </Pressable>

            <Pressable onPress={() => setEstacionamento(!estacionamento)}>
              <Text>{estacionamento ? '☑' : '☐'} Estacionamento prioritário</Text>
            </Pressable>

            <Pressable onPress={() => setSinalizacao(!sinalizacao)}>
              <Text>{sinalizacao ? '☑' : '☐'} Sinalização adequada</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.searchRow} pointerEvents="box-none">
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Rua, bairro ou cidade"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => void executarBuscaNoMapa()}
            editable={!buscando}
            accessibilityLabel="Buscar lugar no mapa"
          />
          {buscando ? (
            <View style={styles.searchSpinner} accessibilityLabel="Buscando">
              <ActivityIndicator color="#5FA777" />
            </View>
          ) : (
            <Pressable
              style={styles.searchButton}
              onPress={() => void executarBuscaNoMapa()}
              accessibilityRole="button"
              accessibilityLabel="Buscar no mapa"
            >
              <Text style={styles.searchButtonText}>Buscar</Text>
            </Pressable>
          )}
        </View>

        <OsmLeafletMap
          ref={mapRef}
          style={styles.mapLeaflet}
          marcacaoAtiva={marcandoLocal}
          onMarcacaoNoMapa={(lat, long) => {
            setMarcandoLocal(false);
            setCoordsNovoLocal({ lat, long });
            setVerAvaliation(true);
          }}
          pontosNoMapa={locaisMapa}
        />

        {marcandoLocal ? (
          <View style={styles.marcacaoBanner}>
            <Text style={styles.marcacaoBannerText}>
              Toque no mapa para marcar o ponto do novo local.
            </Text>
            <Pressable
              onPress={() => setMarcandoLocal(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancelar marcação no mapa"
            >
              <Text style={styles.marcacaoCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          style={styles.fab}
          onPress={() => {
            if (!user) {
              setAvisarLoginParaMapa(true);
              return;
            }
            setMarcandoLocal(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Adicionar local no mapa"
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>

      </View>

      <Modal
        visible={avisarLoginParaMapa}
        transparent
        animationType="fade"
        onRequestClose={() => setAvisarLoginParaMapa(false)}
        accessibilityViewIsModal
      >
        <View style={styles.loginMapaOverlay}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setAvisarLoginParaMapa(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar aviso"
          />
          <View style={styles.loginMapaCard}>
            <Text style={styles.loginMapaTitulo}>Conta necessária</Text>
            <Text style={styles.loginMapaTexto}>
              Entre com sua conta para cadastrar um local no mapa.
            </Text>
            <View style={styles.loginMapaBotoes}>
              <Pressable
                style={[styles.loginMapaBtn, styles.loginMapaBtnSecundario]}
                onPress={() => setAvisarLoginParaMapa(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancelar"
              >
                <Text style={styles.loginMapaBtnSecundarioTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.loginMapaBtn, styles.loginMapaBtnPrimario]}
                onPress={() => {
                  setAvisarLoginParaMapa(false);
                  onPrecisaLogin();
                }}
                accessibilityRole="button"
                accessibilityLabel="Ir para login"
              >
                <Text style={styles.loginMapaBtnPrimarioTexto}>Entrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* FOOTER */}

<Footer>
  <FooterButton
  active
  type='1'
  />
  <FooterButton
  type='2'
          onPress={() => {setVerDetalhes(true)}}
  />
  <FooterButton
  type='3'
          onPress={() => {
            if (user) {
              setVerProfile(true);
            } else {
              onPrecisaLogin();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={user ? 'Abrir perfil' : 'Entrar para ver o perfil'}
  />
</Footer>
    </View>
  );
}