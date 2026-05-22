import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';

import {
  screenSlideAnimation,
  fadeInAnimation,
} from '../../components/Animations/animations';

import {
  OsmLeafletMap,
  type OsmLeafletMapHandle,
} from '../../components/OsmLeafletMap/OsmLeafletMap';

import { nominatimSearch } from '../../services/nominatimGeocode';

import {
  listarLocais,
  type LocalFirebase,
} from '../../services/locaisFirebase';

import { useAuth } from '../../components/AuthProvider';

import Avaliation from '../Avaliation/Avaliation';
import { Profile } from '../Profile/Profile';
import { Detalhes } from '../Detalhes/Detalhes';
import Locais from '../Locais/Locais';

import { styles } from './styles';

import { Footer, FooterButton } from '../../components/Footer/Footer';
import { HeaderElement, Header } from '../../components/Header/Header';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type HomeProps = {
  onPrecisaLogin: () => void;
};

export function Home({ onPrecisaLogin }: Readonly<HomeProps>) {
  const { user } = useAuth();

  const [verProfile, setVerProfile] = useState(false);
  const [verAvaliation, setVerAvaliation] = useState(false);
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [verLocais, setVerLocais] = useState(false);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);


  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);

  const mapRef = useRef<OsmLeafletMapHandle>(null);

  const [marcandoLocal, setMarcandoLocal] = useState(false);

  const [coordsNovoLocal, setCoordsNovoLocal] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const [locaisMapa, setLocaisMapa] = useState<LocalFirebase[]>([]);

  const [avisarLoginParaMapa, setAvisarLoginParaMapa] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateX.setValue(-400);
    opacity.setValue(0);

    screenSlideAnimation(translateX, 'left').start();

    fadeInAnimation(opacity).start();
  }, [verProfile, verAvaliation, verDetalhes]);

  const toggleFiltro = (filtro: string) => {
    setFiltrosSelecionados((prev) => {
      if (prev.includes(filtro)) {
        return prev.filter((item) => item !== filtro);
      }

      return [...prev, filtro];
    });
  };

  const locaisFiltrados = locaisMapa
    .filter((local) => {
      const anotacoes = local.anotacoes ?? [];

      return filtrosSelecionados.every((filtro) =>
        anotacoes.some(
        (item) =>
        item?.type === 'positive' &&
        typeof item?.text === 'string' &&
        item.text
          .replace('Possui ', '')
          .trim()
          .includes(filtro)
      ));
    })
    .map((local) => ({
      id: local.id,
      lat: local.lat,
      long: local.long,
    }));

  const refetchLocais = useCallback(async () => {
    try {
      const lista = await listarLocais();

      setLocaisMapa(lista);
    } catch {
      setLocaisMapa([]);
    }
  }, []);

  const filtrosDisponiveis = Array.from(
  new Set(
    locaisMapa.flatMap((local) =>
      (local.anotacoes ?? [])
        .filter(
          (item) =>
            item?.type === 'positive' &&
            typeof item?.text === 'string'
        )
        .map((item) =>
          item.text.replace('Possui ', '').trim()
        )
    )
  )
  ).sort();

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
    return <Detalhes onVoltar={() => setVerDetalhes(false)} />;
  }

  if (verLocais) {
    return <Locais onVoltar={() => setVerLocais(false)} />;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateX }],
        },
      ]}
    >
      <Header>
        <HeaderElement
          type="2"
          text="Mapa"
        />

        <HeaderElement
          type="3"
          text="Filtrar"
          onPress={() => setMostrarFiltro(!mostrarFiltro)}
          accessibilityRole="button"
          accessibilityLabel="Filtrar mapa"
        />
      </Header>

      <View style={styles.mapContainer}>
        {mostrarFiltro && (
          <>
          <Pressable
          style={styles.overlayFiltro}
          onPress={() => setMostrarFiltro(false)}
        />
    <View style={styles.filtroCard}>
            <Text style={styles.filtroTitulo}>
              Filtros de acessibilidade
            </Text>

            <View style={styles.filtrosContainer}>
              {filtrosDisponiveis.map((filtro) => {
                const ativo =
                  filtrosSelecionados.includes(filtro);

                return (
                  <Pressable
                    key={`${filtro}`}
                    onPress={() => toggleFiltro(filtro)}
                    style={[
                      styles.filtroChip,
                      ativo && styles.filtroChipAtivo,
                    ]}
                  >
                    <Text
                      style={[
                      styles.filtroChipTexto,
                      ativo && styles.filtroChipTextoAtivo,]}>
                       {`${ativo ? '✓ ' : ''}${String(filtro)}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          </>
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
            <View
              style={styles.searchSpinner}
              accessibilityLabel="Buscando"
            >
              <ActivityIndicator color="#5db075" />
            </View>
          ) : (
            <Pressable
              style={styles.searchButton}
              onPress={() => void executarBuscaNoMapa()}
              accessibilityRole="button"
              accessibilityLabel="Buscar no mapa"
            >
              <Text style={styles.searchButtonText}>
                Buscar
              </Text>
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
          pontosNoMapa={
            locaisFiltrados.length > 0
            ? locaisFiltrados
            : []
      }
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
              <Text style={styles.marcacaoCancelText}>
                Cancelar
              </Text>
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
          <Icon name="plus" size={48} color="white" />
        </Pressable>
      </View>

      <Footer>
        <FooterButton active type="1" />

        <FooterButton
          type="2"
          onPress={() => {
            setVerDetalhes(true);
          }}
        />

        <FooterButton
          type="4"
          onPress={() => setVerLocais(true)}
          accessibilityRole="button"
          accessibilityLabel="Gerenciar locais"
        />

        <FooterButton
          type="3"
          onPress={() => {
            if (user) {
              setVerProfile(true);
            } else {
              onPrecisaLogin();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={
            user
              ? 'Abrir perfil'
              : 'Entrar para ver o perfil'
          }
        />
      </Footer>
    </Animated.View>
  );
}