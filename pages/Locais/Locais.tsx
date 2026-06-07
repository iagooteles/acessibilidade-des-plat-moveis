import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  listarLocais,
  type AnotacaoLocal,
  type LocalFirebase,
} from '../../services/locaisFirebase';
import { useTheme } from '../../components/ThemeProvider';
import Avaliation from '../Avaliation/Avaliation';
import { styles } from './styles';

type LocaisProps = {
  onVoltar: () => void;
};

export default function Locais({ onVoltar }: Readonly<LocaisProps>) {
  const { theme } = useTheme();
  const [locais, setLocais] = useState<LocalFirebase[]>([]);
  const [localSelecionado, setLocalSelecionado] = useState<LocalFirebase | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarLocais = useCallback(async (refresh = false) => {
    if (refresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }

    setErro(null);

    try {
      const lista = await listarLocais();
      setLocais(lista);
    } catch {
      setErro('Não foi possível carregar os locais cadastrados.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    void carregarLocais();
  }, [carregarLocais]);

  function renderAnotacao(item: AnotacaoLocal, index: number) {
    const positiva = item.type === 'positive';

    return (
      <View key={`${item.text}-${index}`} style={styles.anotacao}>
        <Ionicons
          name={positiva ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={positiva ? '#35C759' : '#FF3B30'}
        />
        <Text style={styles.anotacaoTexto}>{item.text}</Text>
      </View>
    );
  }

  function renderLocal(local: LocalFirebase) {
    const coordenadas = `${local.lat.toFixed(5)}, ${local.long.toFixed(5)}`;
    const foto = local.fotoBase64 ?? local.fotoUrl;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => setLocalSelecionado(local)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${local.nome}`}
      >
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <View style={[styles.fotoPlaceholder, { backgroundColor: theme.card }]}> 
            <Ionicons name="image-outline" size={34} color="#9D9D9D" />
          </View>
        )}

        <View style={styles.cardConteudo}>
          <Text style={[styles.nomeLocal, { color: theme.text }]}>{local.nome}</Text>
          <Text style={[styles.coordenadas, { color: theme.muted }]}>{coordenadas}</Text>

          {local.anotacoes.length > 0 ? (
            <View style={styles.anotacoesContainer}>
              {local.anotacoes.map((anotacao, index) =>
                renderAnotacao(anotacao, index)
              )}
            </View>
          ) : (
            <Text style={[styles.semAnotacoes, { color: theme.muted }]}>Sem anotações cadastradas.</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (localSelecionado) {
    return (
      <Avaliation
        local={localSelecionado}
        coordenadas={{
          lat: localSelecionado.lat,
          long: localSelecionado.long,
        }}
        onVoltar={() => setLocalSelecionado(null)}
        onSalvo={() => {
          setLocalSelecionado(null);
          void carregarLocais();
        }}
        onExcluido={() => {
          setLocalSelecionado(null);
          void carregarLocais();
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.voltarButton}
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={[styles.voltar, { color: theme.primary }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: theme.text }]}>Locais</Text>
      </View>

      {carregando ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={[styles.feedbackText, { color: theme.muted }]}>Carregando locais...</Text>
        </View>
      ) : (
        <FlatList
          data={locais}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderLocal(item)}
          contentContainerStyle={[
            styles.lista,
            locais.length === 0 && styles.listaVazia,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => void carregarLocais(true)}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.feedbackContainer}>
              <Text style={[styles.feedbackTitle, { color: theme.text }]}> 
                {erro ? 'Algo deu errado' : 'Nenhum local cadastrado'}
              </Text>
              <Text style={[styles.feedbackText, { color: theme.muted }]}> 
                {erro ?? 'Os locais salvos no Firebase aparecerão aqui.'}
              </Text>
              {erro ? (
                <TouchableOpacity
                  style={styles.botaoTentarNovamente}
                  onPress={() => void carregarLocais()}
                  accessibilityRole="button"
                  accessibilityLabel="Tentar carregar locais novamente"
                >
                  <Text style={styles.botaoTentarNovamenteTexto}>Tentar novamente</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
        />
      )}
    </View>
  );
}
