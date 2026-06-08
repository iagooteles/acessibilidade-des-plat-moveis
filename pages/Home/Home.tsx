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
import { useTheme } from '../../components/ThemeProvider';

import {
  screenSlideAnimation,
  fadeInAnimation,
  fadeOutAnimation,
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
import Locais from '../Locais/Locais';
import MeusLocais from '../MeusLocais/MeusLocais';

import { styles } from './styles';

import { Footer, FooterButton } from '../../components/Footer/Footer';
import { HeaderElement, Header } from '../../components/Header/Header';
import { Detalhes } from '../Detalhes/Detalhes';
import Ranking from '../Ranking/Ranking';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type HomeProps = {
  onPrecisaLogin: () => void;
};

export function Home({ onPrecisaLogin }: Readonly<HomeProps>) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();

  const [verProfile, setVerProfile] = useState(false);
  const [verAvaliation, setVerAvaliation] = useState(false);
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [verLocais, setVerLocais] = useState(false);
  const [verRanking, setVerRanking] = useState(false);
  const [verMeusLocais, setVerMeusLocais] = useState(false);
  const [localEditando, setLocalEditando] = useState<LocalFirebase | null>(null);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [renderizarFiltro, setRenderizarFiltro] = useState(false);

  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);


  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [verDetalhesLocal, setVerDetalhesLocal] = useState(false);
  const [localSelecionadoId, setLocalSelecionadoId] = useState<string | null>(null);
  const [localPopup, setLocalPopup] = useState<LocalFirebase | null>(null);

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
  const filtroTranslateX = useRef(
    new Animated.Value(80)
  ).current;

  const filtroOpacity = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    translateX.setValue(-400);
    opacity.setValue(0);

    screenSlideAnimation(translateX, 'left').start();

    fadeInAnimation(opacity).start();
  }, [verProfile, verAvaliation, verDetalhes]);

  useEffect(() => {
    if (mostrarFiltro) {
      setRenderizarFiltro(true);

      screenSlideAnimation(
        filtroTranslateX,
        'right',
        220
      ).start();

      fadeInAnimation(
        filtroOpacity,
        220
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(filtroTranslateX, {
          toValue: 80,
          duration: 180,
          useNativeDriver: true,
        }),

        fadeOutAnimation(
          filtroOpacity,
          180
        ),
      ]).start(() => {
        setRenderizarFiltro(false);
      });
    }
  }, [mostrarFiltro]);

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
      nome: local.nome,
      anotacoes: local.anotacoes,
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

  if (verDetalhesLocal && localSelecionadoId) {
    return (
      <Detalhes
        localId={localSelecionadoId}
        onVoltar={() => {
          setVerDetalhesLocal(false);
          setLocalSelecionadoId(null);
        }}
      />
    );
  }

  if (verLocais) {
    return <Locais onVoltar={() => setVerLocais(false)} />;
  }

  if (verRanking) {
    return (
      <Ranking
        onVoltar={() => setVerRanking(false)}
        onAbrirLocal={(id) => {
          setVerRanking(false);
          setLocalSelecionadoId(id);
          setVerDetalhesLocal(true);
        }}
      />
    );
  }

  if (localEditando) {
  return (
    <Avaliation
      local={localEditando}
      iniciarEditando={true}
      coordenadas={{
        lat: localEditando.lat,
        long: localEditando.long,
      }}
      onVoltar={() => setLocalEditando(null)}
      onSalvo={() => {
        setLocalEditando(null);
        void refetchLocais();
      }}
      onExcluido={() => {
        setLocalEditando(null);
        void refetchLocais();
      }}
    />
  );
}

if (verMeusLocais) {
  return (
    <MeusLocais
      onVoltar={() => setVerMeusLocais(false)}
      onHome={() => setVerMeusLocais(false)}
      onLocais={() => {
        setVerMeusLocais(false);
        setVerLocais(true);
      }}
      onProfile={() => {
        setVerMeusLocais(false);
        setVerProfile(true);
      }}
      onEditarLocal={(local) => {
        setLocalEditando(local);
      }}
    />
  );
}

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity,
          transform: [{ translateX }],
        },
      ]}
    >
      <Header themed>
        <HeaderElement
          themed
          type="2"
          text="Mapa"
        />

        <HeaderElement
          themed
          type="3"
          text="Filtrar"
          textStyle={isDark ? { color: theme.primary } : undefined}
          onPress={() => setMostrarFiltro(!mostrarFiltro)}
          accessibilityRole="button"
          accessibilityLabel="Filtrar mapa"
        />
      </Header>

      <View style={styles.mapContainer}>
        {renderizarFiltro && (
          <>
            <Pressable
              style={styles.overlayFiltro}
              onPress={() => setMostrarFiltro(false)}
            />
<Animated.View
              style={[
                styles.filtroCard,
                {
                  backgroundColor: theme.card,
                  opacity: filtroOpacity,
                  transform: [{ translateX: filtroTranslateX }],
                },
              ]}
            >
              <Text style={[styles.filtroTitulo, { color: theme.text }]}> 
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
            </Animated.View>
          </>
        )}

        <View style={styles.searchRow} pointerEvents="box-none">
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Rua, bairro ou cidade"
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.background,
              },
            ]}
            placeholderTextColor={theme.muted}
            returnKeyType="search"
            onSubmitEditing={() => void executarBuscaNoMapa()}
            editable={!buscando}
            accessibilityLabel="Buscar lugar no mapa"
          />

          {buscando ? (
            <View
              style={[styles.searchSpinner, { backgroundColor: theme.card }]}
              accessibilityLabel="Buscando"
            >
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <Pressable
              style={[styles.searchButton, { backgroundColor: theme.primary }]}
              onPress={() => void executarBuscaNoMapa()}
              accessibilityRole="button"
              accessibilityLabel="Buscar no mapa"
            >
              <Text style={[styles.searchButtonText, { color: theme.textOnPrimary }]}> 
                Buscar
              </Text>
            </Pressable>
          )}
        </View>

        <OsmLeafletMap
          ref={mapRef}
          style={styles.mapLeaflet}
          marcacaoAtiva={marcandoLocal}

          onMarkerTap={(id) => {
            const local = locaisMapa.find((item) => item.id === id);
            setLocalSelecionadoId(id);
            setVerDetalhesLocal(true);

            if (!local) {
              return;
            }

            setLocalPopup(local);
          }}

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
          <View style={[styles.marcacaoBanner, { backgroundColor: theme.card }]}> 
            <Text style={[styles.marcacaoBannerText, { color: theme.text }]}> 
              Toque no mapa para marcar o ponto do novo local.
            </Text>

            <Pressable
              onPress={() => setMarcandoLocal(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancelar marcação no mapa"
            >
              <Text style={[styles.marcacaoCancelText, { color: theme.primary }]}> 
                Cancelar
              </Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          style={styles.fabRanking}
          onPress={() => setVerRanking(true)}
          accessibilityRole="button"
          accessibilityLabel="Ranking de locais"
        >
          <Icon name="crown" size={36} color="white" />
        </Pressable>

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
            setVerMeusLocais(true);
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