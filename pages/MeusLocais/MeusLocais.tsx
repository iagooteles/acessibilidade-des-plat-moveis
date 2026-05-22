import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../components/AuthProvider';

import {
  excluirLocalNoFirebase,
  listarLocais,
  type LocalFirebase,
} from '../../services/locaisFirebase';

import { styles } from './styles';

type Props = {
  onVoltar: () => void;
  onEditarLocal: (local: LocalFirebase) => void;
};

export default function MeusLocais({
  onVoltar,
  onEditarLocal,
}: Readonly<Props>) {
  const { user } = useAuth();

  const [locais, setLocais] = useState<LocalFirebase[]>([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState('');

  const [modoSelecao, setModoSelecao] =
    useState(false);

  const [selecionados, setSelecionados] =
    useState<string[]>([]);

  async function carregarLocais() {
    try {
      setLoading(true);

      const lista = await listarLocais();

      const meusLocais = lista.filter(
        (local) => local.criadoPor === user?.uid
      );

      setLocais(meusLocais);
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus locais.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarLocais();
  }, []);

  const locaisFiltrados = useMemo(() => {
    return locais.filter((local) =>
      local.nome
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [locais, busca]);

  function toggleSelecionado(id: string) {
    setSelecionados((old) => {
      if (old.includes(id)) {
        return old.filter((item) => item !== id);
      }

      return [...old, id];
    });
  }

  async function excluirSelecionados() {
    if (selecionados.length === 0) {
      Alert.alert(
        'Nenhum local',
        'Selecione ao menos um local.'
      );
      return;
    }

    Alert.alert(
      'Excluir locais',
      `Deseja excluir ${selecionados.length} local(is)?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selecionados.map((id) =>
                  excluirLocalNoFirebase(id)
                )
              );

              setLocais((old) =>
                old.filter(
                  (item) =>
                    !selecionados.includes(item.id)
                )
              );

              setSelecionados([]);

              setModoSelecao(false);

              Alert.alert(
                'Sucesso',
                'Locais excluídos.'
              );
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível excluir.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onVoltar}>
          <Text style={styles.backText}>
            Voltar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Meus Locais
        </Text>

        <Pressable
          onPress={() => {
            setModoSelecao(!modoSelecao);
            setSelecionados([]);
          }}
        >
          <Text style={styles.selectText}>
            {modoSelecao
              ? 'Cancelar'
              : 'Selecionar'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name='search'
          size={18}
          color='#777'
        />

        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder='Buscar local pelo nome'
          style={styles.searchInput}
        />
      </View>

      {modoSelecao && (
        <Pressable
          style={styles.deleteBtn}
          onPress={excluirSelecionados}
        >
          <Ionicons
            name='trash'
            size={18}
            color='#fff'
          />

          <Text style={styles.deleteText}>
            Excluir selecionados
          </Text>
        </Pressable>
      )}

      {loading ? (
        <View style={styles.center}>
          <Text>Carregando...</Text>
        </View>
      ) : locaisFiltrados.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Nenhum local encontrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={locaisFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const selecionado =
              selecionados.includes(item.id);

            return (
              <Pressable
                onPress={() => {
                  if (modoSelecao) {
                    toggleSelecionado(item.id);
                  }
                }}
                style={[
                  styles.card,
                  selecionado &&
                    styles.cardSelecionado,
                ]}
              >
                <Text style={styles.nome}>
                  {item.nome}
                </Text>

                {!modoSelecao && (
                  <Pressable
                    style={styles.editBtn}
                    onPress={() =>
                      onEditarLocal(item)
                    }
                  >
                    <Ionicons
                      name='pencil'
                      size={18}
                      color='#2E7D32'
                    />
                  </Pressable>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}