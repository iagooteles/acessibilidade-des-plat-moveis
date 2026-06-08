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
        style={[styles.card, top3 && styles.cardTop3]}
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
          <Text style={styles.nomeLocal} numberOfLines={2}>
            {item.nome}
          </Text>
          <View style={styles.upvotesLinha}>
            <Icon name="thumb-up" size={16} color="#2E7D32" />
            <Text style={styles.upvotesTexto}>
              {item.totalUpvotes}{' '}
              {item.totalUpvotes === 1 ? 'upvote' : 'upvotes'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.voltarButton}
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.voltar}>Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Ranking</Text>
      </View>

      <Text style={styles.subtitulo}>
        Locais mais confirmados pela comunidade
      </Text>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5db075" />
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Text style={styles.erro}>{erro}</Text>
          <Pressable style={styles.retryBtn} onPress={() => void carregar()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
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
              colors={['#5db075']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.erro}>
              Nenhum local cadastrado ainda.
            </Text>
          }
        />
      )}
    </View>
  );
}
