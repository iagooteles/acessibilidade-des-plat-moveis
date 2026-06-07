import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import {
  listarLocaisRanking,
  type LocalRanking,
} from '../../services/locaisFirebase';
import { useTheme } from '../../components/ThemeProvider';
import { styles } from './styles';

type Props = {
  onVoltar: () => void;
  onAbrirLocal: (localId: string) => void;
};

function iconePosicao(posicao: number): 'crown' | 'medal' | 'medal-outline' | null {
  if (posicao === 1) return 'crown';
  if (posicao === 2) return 'medal';
  if (posicao === 3) return 'medal-outline';
  return null;
}

function corPosicao(posicao: number): string {
  if (posicao === 1) return '#E8A317';
  if (posicao === 2) return '#9E9E9E';
  if (posicao === 3) return '#B87333';
  return '#888';
}

export default function Ranking({
  onVoltar,
  onAbrirLocal,
}: Readonly<Props>) {
  const { theme, isDark } = useTheme();
  const [locais, setLocais] = useState<LocalRanking[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async (refresh = false) => {
    if (refresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErro(null);

    try {
      const lista = await listarLocaisRanking();
      setLocais(lista);
    } catch {
      setErro('Não foi possível carregar o ranking.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function renderItem({ item }: { item: LocalRanking }) {
    const foto = item.fotoBase64 ?? item.fotoUrl;
    const icone = iconePosicao(item.posicao);
    const top3 = item.posicao <= 3;

    return (
      <Pressable
        style={[
          styles.card,
          { backgroundColor: theme.card },
          top3 && [
            styles.cardTop3,
            {
              backgroundColor: isDark ? '#15202b' : '#F0F8F2',
              borderColor: isDark ? '#334155' : '#C8E6C9',
            },
          ],
        ]}
        onPress={() => onAbrirLocal(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.posicao}º lugar, ${item.nome}, ${item.totalUpvotes} upvotes`}
      >
        <View style={styles.posicaoWrap}>
          {icone ? (
            <Icon
              name={icone}
              size={28}
              color={corPosicao(item.posicao)}
            />
          ) : (
            <Text style={styles.posicaoTexto}>{item.posicao}º</Text>
          )}
        </View>

        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Icon name="map-marker" size={28} color="#9D9D9D" />
          </View>
        )}

        <View style={styles.cardConteudo}>
          <Text style={[styles.nomeLocal, { color: theme.text }]} numberOfLines={2}>
            {item.nome}
          </Text>
          <View style={styles.upvotesLinha}>
            <Icon name="thumb-up" size={16} color={theme.primary} />
            <Text style={[styles.upvotesTexto, { color: theme.primary }]}> 
              {item.totalUpvotes}{' '}
              {item.totalUpvotes === 1 ? 'upvote' : 'upvotes'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.header}>
        <Pressable
          style={styles.voltarButton}
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={[styles.voltar, { color: theme.primary }]}>Voltar</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Ranking</Text>
      </View>

      <Text style={[styles.subtitulo, { color: theme.muted }]}> 
        Locais mais confirmados pela comunidade
      </Text>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Text style={[styles.erro, { color: theme.muted }]}>{erro}</Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={() => void carregar()}>
            <Text style={[styles.retryText, { color: theme.textOnPrimary }]}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={locais}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => void carregar(true)}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={
            <Text style={[styles.erro, { color: theme.muted }]}> 
              Nenhum local cadastrado ainda.
            </Text>
          }
        />
      )}
    </View>
  );
}
