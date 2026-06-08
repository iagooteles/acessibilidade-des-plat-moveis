import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import {
  screenSlideUpAnimation,
  fadeInAnimation,
} from '../../components/Animations/animations';
import { useAuth } from '../../components/AuthProvider';
import {
  criarLocalNoFirebase,
  editarLocalNoFirebase,
  excluirLocalNoFirebase,
  criarComentarioNoLocal,
  listarComentariosDoLocal,
  carregarUpvotesDoLocal,
  alternarUpvoteAnotacao,
  carregarUpvoteDoLocal,
  alternarUpvoteLocal,
  mensagemErroFirebase,
  type AnotacaoLocal,
  type LocalFirebase,
  type ComentarioLocal,
  type UpvoteResumo,
} from '../../services/locaisFirebase';
import { AnotacaoUpvote } from '../../components/AnotacaoUpvote/AnotacaoUpvote';
import { styles } from './styles';

export type CoordenadasLocal = { lat: number; long: number };
import { buscarPerfilFirestore } from '../../services/usuariosFirebase';
import { Timestamp } from 'firebase/firestore';

const MAX_FOTO_BASE64_CHARS = 900000;

function getTituloAvaliation(ehDetalhe: boolean, editando: boolean) {
  if (!ehDetalhe) {
    return 'Novo local';
  }

  return editando ? 'Editar local' : 'Detalhes';
}

function getTextoBotaoSalvar(ehDetalhe: boolean) {
  return ehDetalhe ? 'Salvar alterações' : 'Salvar local';
}

type AvaliationProps = {
  coordenadas: CoordenadasLocal;
  local?: LocalFirebase;
  iniciarEditando?: boolean;
  onVoltar: () => void;
  onSalvo?: () => void;
  onExcluido?: () => void;
};

export default function Avaliation({
  coordenadas,
  local,
  iniciarEditando,
  onVoltar,
  onSalvo,
  onExcluido,
}: Readonly<AvaliationProps>) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState(local?.nome ?? '');
  const [fotoUri, setFotoUri] = useState<string | null>(
    local?.fotoBase64 ?? local?.fotoUrl ?? null
  );
  const [fotoBase64, setFotoBase64] = useState<string | null>(
    local?.fotoBase64 ?? null
  );
  const [annotations, setAnnotations] = useState<AnotacaoLocal[]>(
    local?.anotacoes ?? []
  );

  // estados para os comentários
  const [comentarios, setComentarios] = useState<ComentarioLocal[]>(
    local?.comentarios ?? []
  );
  const [novoComentario, setNovoComentario] = useState('');
  const [nomeUsuarioAtual, setNomeUsuarioAtual] = useState('Usuário Anônimo');

  const [editando, setEditando] = useState(
  iniciarEditando || !local
);
  const [salvando, setSalvando] = useState(false);
  const ehDetalhe = Boolean(local);
  const usuarioCriador = Boolean(local?.criadoPor && user?.uid === local.criadoPor);
  const podeAlterar = !ehDetalhe || (usuarioCriador && editando);
  const podeComentar = Boolean(user && local?.id);
  const [search, setSearch] = useState('');
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [customAnnotation, setCustomAnnotation] = useState('');
  const [upvotePorAnotacao, setUpvotePorAnotacao] = useState<
    Record<string, UpvoteResumo>
  >({});
  const [upvoteLocal, setUpvoteLocal] = useState<UpvoteResumo>({
    total: 0,
    votouUsuario: false,
  });

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [options, setOptions] = useState<string[]>([
    'Rampa de acesso',
    'Piso tátil',
    'Estacionamento prioritário',
    'Sinalização correta',
    'Trajetória adequada',

  ]);

  useEffect(() => {
    async function carregarComentarios() {
      if (!local?.id) return;

      try {
        const comentariosSalvos = await listarComentariosDoLocal(local.id);
        setComentarios(comentariosSalvos);
      } catch (error) {
        console.log(error);
      }
    }

    void carregarComentarios();
  }, [local?.id]);

  useEffect(() => {
    async function carregarUpvotes() {
      if (!local?.id) return;

      try {
        const mapa = await carregarUpvotesDoLocal(
          local.id,
          user?.uid
        );
        setUpvotePorAnotacao(mapa);
      } catch (error) {
        console.log(error);
      }
    }

    void carregarUpvotes();
  }, [local?.id, user?.uid]);

  useEffect(() => {
    async function carregarVotoLocal() {
      if (!local?.id) return;

      try {
        const resumo = await carregarUpvoteDoLocal(
          local.id,
          user?.uid
        );
        setUpvoteLocal(resumo);
      } catch (error) {
        console.log(error);
      }
    }

    void carregarVotoLocal();
  }, [local?.id, user?.uid]);

  useEffect(() => {
    screenSlideUpAnimation(translateY).start();
    fadeInAnimation(opacity).start();
  }, []);

  useEffect(() => {
    async function carregarNomeUsuario() {
      if (user?.uid) {
        try {
          const perfil = await buscarPerfilFirestore(user.uid);
          if (perfil && perfil.name) {
            setNomeUsuarioAtual(perfil.name);
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário:", error);
        }
      }
    }

    void carregarNomeUsuario();
  }, [user]);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const addAnnotation = (text: string, positive: boolean) => {
    if (!podeAlterar) {
      return;
    }

    setAnnotations((prev) => {
      const filtered = prev.filter(
        (item) =>
          item.text !== `Possui ${text}` &&
          item.text !== `Não possui ${text}`
      );

      return [
        ...filtered,
        {
          text: positive
            ? `Possui ${text}`
            : `Não possui ${text}`,
          type: positive ? 'positive' : 'negative',
        },
      ];
    });
    setModalVisible(false);
  };

  const handleAddComentario = async () => {
    if (!novoComentario.trim()) return;

    if (!user) {
      Alert.alert('Sessão', 'Você precisa estar logado para comentar.');
      return;
    }

    if (!local?.id) {
      Alert.alert('Comentário', 'Salve o local antes de adicionar comentários.');
      return;
    }
    
    const texto = novoComentario.trim();

    try {
      const comentarioId = await criarComentarioNoLocal({
        localId: local.id,
        texto,
        nomeAutor: nomeUsuarioAtual,
        uidAutor: user.uid,
      });

      const novoComentarioObj: ComentarioLocal = {
        id: comentarioId,
        createdAt: Timestamp.now(),
        texto,
        nomeAutor: nomeUsuarioAtual,
        uidAutor: user.uid,
      };

      setComentarios((prev) => [...prev, novoComentarioObj]);
      setNovoComentario('');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o comentário.');
    }
  };

  async function handleAlternarUpvoteLocal() {
    if (!local?.id) return;

    if (!user) {
      Alert.alert(
        'Sessão',
        'Você precisa estar logado para dar upvote ao local.'
      );
      return;
    }

    try {
      const resultado = await alternarUpvoteLocal({
        localId: local.id,
        uidAutor: user.uid,
      });

      setUpvoteLocal((prev) => {
        const delta = resultado === 'adicionado' ? 1 : -1;
        return {
          total: Math.max(0, prev.total + delta),
          votouUsuario: resultado === 'adicionado',
        };
      });
    } catch (error) {
      console.error('upvote local', error);
      Alert.alert(
        'Erro',
        `Não foi possível registrar o upvote.\n\n${mensagemErroFirebase(error)}`
      );
    }
  }

  async function handleAlternarUpvote(textoAnotacao: string) {
    if (!local?.id) return;

    if (!user) {
      Alert.alert(
        'Sessão',
        'Você precisa estar logado para confirmar uma anotação.'
      );
      return;
    }

    const atual = upvotePorAnotacao[textoAnotacao] ?? {
      total: 0,
      votouUsuario: false,
    };

    try {
      const resultado = await alternarUpvoteAnotacao({
        localId: local.id,
        textoAnotacao,
        uidAutor: user.uid,
      });

      setUpvotePorAnotacao((prev) => {
        const proximo = { ...prev };
        const delta = resultado === 'adicionado' ? 1 : -1;
        proximo[textoAnotacao] = {
          total: Math.max(0, atual.total + delta),
          votouUsuario: resultado === 'adicionado',
        };
        return proximo;
      });
    } catch (error) {
      console.error('upvote', error);
      Alert.alert(
        'Erro',
        `Não foi possível registrar o upvote.\n\n${mensagemErroFirebase(error)}`
      );
    }
  }

  const escolherFoto = async () => {
    if (!podeAlterar) {
      return;
    }

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        'Permissão',
        'Precisamos de acesso às fotos para anexar uma imagem ao local.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.45,
      base64: true,
    });

    const asset = result.assets?.[0];
    if (result.canceled || !asset?.uri || !asset.base64) {
      return;
    }

    if (asset.base64.length > MAX_FOTO_BASE64_CHARS) {
      Alert.alert(
        'Imagem muito grande',
        'Escolha uma imagem menor para salvar no Firebase.'
      );
      return;
    }

    const mimeType = asset.mimeType ?? 'image/jpeg';
    setFotoUri(asset.uri);
    setFotoBase64(`data:${mimeType};base64,${asset.base64}`);
  };

  const salvarLocal = async () => {
    if (ehDetalhe && !usuarioCriador) {
      Alert.alert('Permissão', 'Apenas o usuário que criou este local pode editá-lo.');
      return;
    }

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      Alert.alert('Nome', 'Informe um nome para o local.');
      return;
    }
    if (!user) {
      Alert.alert('Sessão', 'Você precisa estar logado para salvar.');
      return;
    }
    setSalvando(true);
    try {
      if (local) {
        await editarLocalNoFirebase({
          id: local.id,
          nome: nomeLimpo,
          anotacoes: annotations,
          fotoBase64,
        });
        Alert.alert('Salvo', 'Local atualizado com sucesso.');
      } else {
        const localId = await criarLocalNoFirebase({
          nome: nomeLimpo,
          lat: coordenadas.lat,
          long: coordenadas.long,
          anotacoes: annotations,
          fotoBase64,
          criadoPor: user.uid,
        });

        if(novoComentario.trim()){
          await criarComentarioNoLocal({
            localId,
            texto: novoComentario,
            nomeAutor: nomeUsuarioAtual,
            uidAutor: user.uid,
          });
        }
        Alert.alert('Salvo', 'Local registrado com sucesso.');
      }
      onSalvo?.();
      onVoltar();
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Verifique no Firebase Console se o Firestore está ativo e se as regras permitem escrita para usuários autenticados.'
      );
    } finally {
      setSalvando(false);
    }
  };

  const executarExclusao = async () => {
    if (!local || !usuarioCriador) {
      Alert.alert('Permissão', 'Apenas o usuário que criou este local pode excluí-lo.');
      return;
    }

    setSalvando(true);
    try {
      await excluirLocalNoFirebase(local.id);
      Alert.alert('Excluído', 'Local excluído com sucesso.');
      onExcluido?.();
      onVoltar();
    } catch {
      Alert.alert(
        'Erro ao excluir',
        'Não foi possível excluir este local. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = () => {
    Alert.alert('Excluir local', 'Tem certeza que deseja excluir este local?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => void executarExclusao(),
      },
    ]);
  };

  const textoCoordenadas = `${coordenadas.lat.toFixed(5)}, ${coordenadas.long.toFixed(5)}`;
  const titulo = getTituloAvaliation(ehDetalhe, editando);
  const fotoSource = fotoUri ? { uri: fotoUri } : undefined;
  const mostrarSemFoto = !fotoUri && !podeAlterar;
  const mostrarAcoesCriador = !podeAlterar && usuarioCriador;
  const textoBotaoSalvar = getTextoBotaoSalvar(ehDetalhe);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          flex: 1,
          opacity,
          transform: [{ translateY }],
          backgroundColor: theme.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text style={[styles.back, { color: theme.primary }]}>Voltar</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>{titulo}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.nomeLinha}>
              <View style={styles.nomeLinhaConteudo}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>Nome do local</Text>
                {podeAlterar ? (
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputNomeLinha,
                      { backgroundColor: theme.card, color: theme.text, borderColor: theme.card },
                    ]}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex.: Entrada principal da biblioteca"
                    placeholderTextColor={theme.muted}
                    editable={!salvando}
                  />
                ) : (
                  <Text style={styles.nomeDetalhe}>{nome}</Text>
                )}
              </View>

              {local?.id ? (
                <AnotacaoUpvote
                  variant="local"
                  total={upvoteLocal.total}
                  votouUsuario={upvoteLocal.votouUsuario}
                  onPress={() => {
                    void handleAlternarUpvoteLocal();
                  }}
                  disabled={!user}
                />
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>Coordenadas</Text>
            <Text style={[styles.coordsText, { color: theme.muted }]}>{textoCoordenadas}</Text>
          </View>

          <View style={styles.hr} />

          <View style={styles.section}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>Foto</Text>
            <View style={styles.imageRow}>
              {fotoSource ? (
                <Image source={fotoSource} style={styles.image} />
              ) : null}

              {mostrarSemFoto ? (
                <Text style={[styles.semFoto, { color: theme.muted }]}>Sem foto cadastrada.</Text>
              ) : null}

              {podeAlterar ? (
                <TouchableOpacity
                  style={styles.addImageBox}
                  onPress={() => void escolherFoto()}
                  disabled={salvando}
                  accessibilityRole="button"
                  accessibilityLabel="Adicionar foto"
                >
                  <Ionicons name="camera-outline" size={36} color="#AFAFAF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={[styles.anotacoesSection, { backgroundColor: theme.card }]}> 
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Anotações</Text>

            <View style={styles.anotacoesLista}>
              {annotations.map((item, index) => (
                <View key={`${item.text}-${index}`} style={styles.noteRow}>
                  <View style={styles.noteRowConteudo}>
                    <Ionicons
                      name={
                        item.type === 'positive' ? 'checkmark-circle' : 'close-circle'
                      }
                      size={24}
                      color={item.type === 'positive' ? '#35C759' : '#FF3B30'}
                    />
                    <Text style={[styles.noteText, { color: theme.text }]}>{item.text}</Text>
                  </View>

                  {local?.id ? (
                    <AnotacaoUpvote
                      total={
                        upvotePorAnotacao[item.text]?.total ?? 0
                      }
                      votouUsuario={
                        upvotePorAnotacao[item.text]?.votouUsuario ?? false
                      }
                      onPress={() => {
                        void handleAlternarUpvote(item.text);
                      }}
                      disabled={!user}
                    />
                  ) : null}
                </View>
              ))}

              {podeAlterar ? (
                <TouchableOpacity
                  style={styles.noteRow}
                  activeOpacity={0.7}
                  onPress={() => setModalVisible(true)}
                  disabled={salvando}
                >
                  <Ionicons name="add-circle-outline" size={24} color={theme.muted} />
                  <Text style={[styles.noteText, { color: theme.muted }]}>
                    Adicionar…
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Comentários</Text>

            {comentarios.map((comentario) => (
              <View key={comentario.id} style={styles.commentCard}>
                <Text style={[styles.commentAuthor, { color: theme.text }]}> 
                  {comentario.nomeAutor}
                </Text>
                <Text style={[styles.commentBody, { color: theme.muted }]}> 
                  {comentario.texto}
                </Text>
              </View>
            ))}

            {comentarios.length === 0 && !podeAlterar && (
              <Text style={[styles.semComentarios, { color: theme.muted }]}> 
                Não há comentários.
              </Text>
            )}
          </View>

          {podeAlterar ? (
            <View style={styles.commentInputRow}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0, backgroundColor: theme.card, color: theme.text, borderColor: theme.card },
                ]}
                value={novoComentario}
                onChangeText={setNovoComentario}
                placeholder="Adicionar um comentário"
                placeholderTextColor={theme.muted}
                editable={!salvando}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  backgroundColor: !novoComentario.trim() ? theme.muted : theme.primary,
                  padding: 14,
                  borderRadius: 100,
                }}
                onPress={() => void handleAddComentario()}
                disabled={salvando || !novoComentario.trim()}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={!novoComentario.trim() ? theme.background : theme.textOnPrimary}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.scrollSpacer} />
        </ScrollView>

        {podeAlterar && (
          <TouchableOpacity
            style={[styles.button, salvando && styles.buttonDisabled, { backgroundColor: theme.primary }]}
            onPress={() => void salvarLocal()}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color={theme.textOnPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.textOnPrimary }]}>{textoBotaoSalvar}</Text>
            )}
          </TouchableOpacity>
        )}

        {mostrarAcoesCriador ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.buttonSecondary]}
              onPress={() => setEditando(true)}
              disabled={salvando}
              accessibilityRole="button"
              accessibilityLabel="Editar local"
            >
              <Text style={styles.buttonSecondaryText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.buttonDanger]}
              onPress={confirmarExclusao}
              disabled={salvando}
              accessibilityRole="button"
              accessibilityLabel="Excluir local"
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.card }]}> 
            <TextInput
              placeholder="Buscar"
              style={[styles.search, { backgroundColor: theme.card, color: theme.text, borderColor: theme.card }]}
              value={search}
              placeholderTextColor={theme.muted}
              onChangeText={setSearch}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredOptions.map((item, index) => (
                <View key={index} style={styles.optionRow}>
                  <Text style={[styles.optionText, { color: theme.text }]}>{item}</Text>

                  <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => addAnnotation(item, true)}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={28}
                        color="#35C759"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => addAnnotation(item, false)}>
                      <Ionicons name="close-circle" size={26} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={{ marginTop: 12, flexDirection: 'row' }}
                onPress={() => {
                  setModalVisible(false);

                  setTimeout(() => {
                    setOtherModalVisible(true);
                  }, 200);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color={theme.muted} />
                <Text style={[styles.other, { color: theme.text }]}>Adicionar anotação</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={otherModalVisible}
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={[styles.modal2, { backgroundColor: theme.card }]}> 

            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                color: theme.text,
              }}
            >
              Adicionar anotação
            </Text>

            <TextInput
              placeholder="Digite a anotação..."
              style={[styles.search, { backgroundColor: theme.card, color: theme.text, borderColor: theme.card }]}
              placeholderTextColor={theme.muted}
              value={customAnnotation}
              onChangeText={setCustomAnnotation}
              autoFocus
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setOtherModalVisible(false);
                  setCustomAnnotation('');
                }}
              >
                <Text style={{ color: '#FF3B30', fontSize: 16 }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (customAnnotation.trim().length > 0) {
                    setOptions((prev) => [
                      ...prev,
                      customAnnotation,
                    ])

                    addAnnotation(customAnnotation, true);

                    setCustomAnnotation('');
                    setOtherModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: theme.primary, fontSize: 16 }}>
                  Adicionar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}