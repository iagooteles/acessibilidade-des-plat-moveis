// pages/Detalhes/Detalhes.tsx

import { useEffect, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';

import { useAuth } from '../../components/AuthProvider';
import { useTheme } from '../../components/ThemeProvider';

import { db } from '../../config/firebase';
import { Footer, FooterButton } from '../../components/Footer/Footer';
import { Header, HeaderElement } from '../../components/Header/Header';
import { Profile } from '../Profile/Profile';
import Locais from '../Locais/Locais';
import { ComentarioLocal, editarLocalNoFirebase, criarComentarioNoLocal, type LocalFirebase } from '../../services/locaisFirebase';
import { buscarPerfilFirestore } from '../../services/usuariosFirebase';
import {
  reportarAnotacao,
  contarDenuncias,
  carregarUpvotesDoLocal,
  alternarUpvoteAnotacao,
  carregarUpvoteDoLocal,
  alternarUpvoteLocal,
  mensagemErroFirebase,
  type UpvoteResumo,
} from '../../services/locaisFirebase';
import { } from '../../services/locaisFirebase';
import * as ImagePicker from 'expo-image-picker';
import { AnotacaoUpvote } from '../../components/AnotacaoUpvote/AnotacaoUpvote';

const MAX_FOTO_BASE64_CHARS = 900000;

type Props = {
  localId: string;
  localFire?: LocalFirebase;
  onVoltar: () => void;
};

type Comentario = {
  id: string;
  uidAutor: string;
  nomeAutor: string;
  texto: string;
  createdAt: Timestamp;
};

type Local = {
  nome: string;
  numero?: string;
  descricao?: string;
  lat?: number;
  long?: number;

  fotoUrl?: string | null;
  fotoBase64?: string | null;

  anotacoes?: {
    text: string;
    type: 'positive' | 'negative';
  }[];

  comentarios?: Comentario[];
};

export function Detalhes({
  localFire,
  localId,
  onVoltar,
}: Readonly<Props>) {


  const [mostrarModalComentario, setMostrarModalComentario] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [nomeUsuarioAtual, setNomeUsuarioAtual] = useState('Usuário Anônimo');
  const { user } = useAuth();
  const [verProfile, setVerProfile] = useState(false);
  const [verAvaliation, setVerAvaliation] = useState(false);
  // anotações
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [customAnnotation, setCustomAnnotation] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Rampa de acesso',
    'Piso tátil',
    'Estacionamento prioritário',
    'Sinalização correta',
    'Trajetória adequada',
  ]);
  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const [verDetalhes, setVerDetalhes] = useState(false);
  const [verLocais, setVerLocais] = useState(false);
  const [comentarios, setComentarios] = useState<ComentarioLocal[]>(
    localFire?.comentarios ?? []
  );
  const [denunciaPorAnotacao, setDenunciaPorAnotacao] = useState<Record<string, number>>({});
  const [upvotePorAnotacao, setUpvotePorAnotacao] = useState<
    Record<string, UpvoteResumo>
  >({});
  const [upvoteLocal, setUpvoteLocal] = useState<UpvoteResumo>({
    total: 0,
    votouUsuario: false,
  });
  const [modalReportarAnotacao, setModalReportarAnotacao] = useState(false);
  const [AnotacaoSelecionada, setAnotacaoSelecionada] =
    useState<
      | {
        text: string;
        type: 'positive' | 'negative';
      }
      | null
    >(null);

  const [local, setLocal] = useState<Local | null>(null);

  // Foto
  const [fotoUri, setFotoUri] = useState<string | null>(
    local?.fotoBase64 ?? local?.fotoUrl ?? null
  );
  const [fotoBase64, setFotoBase64] = useState<string | null>(
    local?.fotoBase64 ?? null
  );
  const fotoSource = fotoUri ? { uri: fotoUri } : undefined;
  const mostrarSemFoto = !fotoUri

  const escolherFoto = async () => {
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

    if (!local) return;

    const mimeType = asset.mimeType ?? 'image/jpeg';
    const newFotoBase64 = `data:${mimeType};base64,${asset.base64}`;

    setFotoUri(asset.uri);
    setFotoBase64(newFotoBase64);

    setSalvando(true);
    try {
      await editarLocalNoFirebase({
        id: localId,
        nome: local.nome,
        anotacoes: local.anotacoes ?? [],
        fotoBase64: newFotoBase64,
      });
      await carregarLocal();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Erro', 'Não foi possível salvar a imagem no Firebase.');
    } finally {
      setSalvando(false);
    }
  };

  useEffect(() => {
    void carregarLocal();
  }, [localId, user?.uid]);

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

  async function carregarLocal() {
    try {
      const ref = doc(db, 'locais', localId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return;
      }

      const comentariosRef = collection(
        db,
        'locais',
        localId,
        'comentarios'
      );

      const comentariosSnap = await getDocs(
        query(comentariosRef, orderBy('createdAt', 'desc'))
      );

      const comentarios: Comentario[] = comentariosSnap.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          uidAutor:
            typeof data.uidAutor === 'string'
              ? data.uidAutor
              : '',
          nomeAutor:
            typeof data.nomeAutor === 'string'
              ? data.nomeAutor
              : 'Usuário Anônimo',
          texto:
            typeof data.texto === 'string'
              ? data.texto
              : '',

          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt
              : Timestamp.now(),
        };
      });

      const dados = snap.data() as Local;
      const lat = Number(dados.lat);
      const long = Number(dados.long);

      setLocal({
        ...dados,
        comentarios,
        ...(Number.isFinite(lat) && Number.isFinite(long)
          ? { lat, long }
          : {}),
      });

      if (dados.fotoBase64 || dados.fotoUrl) {
        setFotoUri(dados.fotoBase64 ?? dados.fotoUrl ?? null);
        setFotoBase64(dados.fotoBase64 ?? null);
      }

      const mapaDenuncias: Record<string, number> = {};

      const anotacoes = (snap.data() as Local).anotacoes ?? [];

      for (const anotacao of anotacoes) {
        const total = await contarDenuncias(
          localId,
          anotacao.text
        );

        mapaDenuncias[anotacao.text] = total;
      }

      setDenunciaPorAnotacao(
        mapaDenuncias
      );

      const mapaUpvotes = await carregarUpvotesDoLocal(
        localId,
        user?.uid
      );
      setUpvotePorAnotacao(mapaUpvotes);

      const resumoLocal = await carregarUpvoteDoLocal(
        localId,
        user?.uid
      );
      setUpvoteLocal(resumoLocal);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAlternarUpvoteLocal() {
    if (!user) {
      Alert.alert(
        'Sessão',
        'Você precisa estar logado para dar upvote ao local.'
      );
      return;
    }

    try {
      const resultado = await alternarUpvoteLocal({
        localId,
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
        localId,
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

  const handleAddComentario = async () => {
    if (!novoComentario.trim()) return;

    if (!user) {
      Alert.alert('Sessão', 'Você precisa estar logado para comentar.');
      return;
    }



    const texto = novoComentario.trim();

    try {
      const comentarioId = await criarComentarioNoLocal({

        localId,
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
      await carregarLocal();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o comentário.');
    }
  };

  const addAnnotation = async (text: string, positive: boolean) => {
    if (!user) {
      Alert.alert('Sessão', 'Você precisa estar logado para adicionar anotações.');
      return;
    }

    if (!local) return;

    // Filtra anotações existentes para evitar duplicidade (ex: ter "Possui" e "Não possui" ao mesmo tempo)
    const novasAnotacoes = (local.anotacoes ?? []).filter(
      (item) =>
        item.text !== `Possui ${text}` &&
        item.text !== `Não possui ${text}`
    );

    novasAnotacoes.push({
      text: positive ? `Possui ${text}` : `Não possui ${text}`,
      type: positive ? 'positive' : 'negative',
    });

    setLocal({ ...local, anotacoes: novasAnotacoes });
    setModalVisible(false);

    // salvar no firebase
    try {
      await editarLocalNoFirebase({
        id: localId,
        nome: local.nome,
        anotacoes: novasAnotacoes,
        fotoBase64: local.fotoBase64 ?? null,
      });
      await carregarLocal();
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a anotação no banco de dados.');
    }
  };

  if (!local) {

    return (
      <View style={styles.loading}>
        <Text style={{ color: theme.muted }}>Carregando...</Text>
      </View>
    );

  }

  if (verProfile) {
    return <Profile onVoltar={() => setVerProfile(false)} />
  }

  if (verLocais) {
    return <Locais onVoltar={() => setVerLocais(false)} />;
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 

      <Header>
        <HeaderElement
          type='1'
          text='Voltar'
          onPress={onVoltar}
        />
        <HeaderElement
          type='2'
          text='Local'
        />
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={[styles.section, { marginTop: 16 }]}>
          <View style={styles.nomeLinha}>
            <View style={styles.nomeLinhaConteudo}>
              <Text style={[styles.nome, { color: theme.text }]}> 
                {local.nome}
              </Text>
            </View>

            <AnotacaoUpvote
              variant="local"
              total={upvoteLocal.total}
              votouUsuario={upvoteLocal.votouUsuario}
              onPress={() => {
                void handleAlternarUpvoteLocal();
              }}
              disabled={!user}
            />
          </View>

          {local.numero ? (
            <Text style={[styles.numero, { color: theme.muted }]}> 
              {local.numero}
            </Text>
          ) : null}

          {local.descricao ? (
            <Text style={[styles.descricao, { color: theme.muted }]}> 
              {local.descricao}
            </Text>
          ) : null}
        </View>

        {/* Coordenadas */}
        {/* {local.lat != null && local.long != null ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}> 
              Coordenadas
            </Text>
            <Text style={[styles.coordenadas, { color: theme.muted }]}> 
              {local.lat.toFixed(5)}, {local.long.toFixed(5)}
            </Text>
          </View>
        ) : null}

        {local.lat != null && local.long != null ? (
          <View style={styles.hr} />
        ) : null} */}

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}> 
            Fotos
          </Text>

          <View style={styles.imageRow}>
            {fotoSource ? (<Image source={fotoSource} style={styles.image} />)
              : null}

            {mostrarSemFoto ?
              (<TouchableOpacity
                style={styles.addImageBox}
                onPress={() => void escolherFoto()}
                disabled={salvando}
                accessibilityRole="button"
                accessibilityLabel="Adicionar foto"
              >
                <Icon name="plus" size={36} color="#AFAFAF" />
              </TouchableOpacity>
              ) :
              <TouchableOpacity
                style={[styles.addImageBox, { marginLeft: 0, marginTop: 0, width: 170, height: 170 }]}
                onPress={() => void escolherFoto()}
                disabled={salvando}
                accessibilityRole="button"
                accessibilityLabel="Adicionar foto"
              >
                <Icon name="plus" size={36} color="#AFAFAF" />
              </TouchableOpacity>
            }

          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Anotações por usuários
          </Text>

          <View style={styles.anotacoesLista}>
            {(local.anotacoes ?? []).map((item, index) => (
              <View key={index} style={styles.anotacaoItem}>
                <View style={styles.anotacaoLeft}>
                  <Icon
                    name={item.type === 'positive' ? 'check-circle' : 'close-circle'}
                    size={22}
                    color={item.type === 'positive' ? '#31C451' : '#FF3B30'}
                  />
                  <View style={styles.anotacaoConteudo}>
                    <Text style={[styles.anotacaoTexto, { color: theme.text }]}> 
                      {item.text}
                    </Text>
                    {denunciaPorAnotacao[item.text] >= 3 && (
                      <Text style={styles.alertaAnotacao}>
                        ⚠ Possível informação incorreta
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.anotacaoAcoes}>
                  <AnotacaoUpvote
                    total={upvotePorAnotacao[item.text]?.total ?? 0}
                    votouUsuario={upvotePorAnotacao[item.text]?.votouUsuario ?? false}
                    onPress={() => { void handleAlternarUpvote(item.text) }}
                    disabled={!user}
                  />

                  <Pressable
                    onPress={() => {
                      setModalReportarAnotacao(true);
                      setAnotacaoSelecionada(item);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Reportar anotação"
                  >
                    <Icon
                      name="pencil"
                      size={18}
                      color={theme.muted}
                    />
                  </Pressable>
                </View>

              </View>

            ))}
          </View>

          {/* Botão de adicionar Anotação */}
          <TouchableOpacity
            style={[styles.anotacaoLeft, { marginTop: 8 }]}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
            disabled={salvando}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#BDBDBD"
            />
            <Text style={styles.addText}>
              Adicionar...
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}> 
            Comentários
          </Text>

          {(local.comentarios ?? []).map((item) => (

            <View
              key={item.id}
              style={styles.commentContainer}
            >

              <View style={styles.commentHeader}>

                <View style={styles.avatar} />

                <View>

                  <View style={styles.commentTop}>

                    <Text style={[styles.commentUser, { color: theme.text }]}> 
                      {item.nomeAutor}
                    </Text>

                    <Text style={[styles.commentDate, { color: theme.muted }]}> 
                      {item.createdAt
                        ?.toDate()
                        .toLocaleDateString('pt-BR')
                      }
                    </Text>

                  </View>

                  <Text style={[styles.commentText, { color: theme.text }]}> 
                    {item.texto}
                  </Text>

                </View>

              </View>

            </View>

          ))}

          {(local.comentarios ?? []).length === 0 && (
            <Text style={[styles.semComentarios, { color: theme.muted }]}> 
              Não há comentários.
            </Text>
          )}
        </View>

      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => setMostrarModalComentario(true)}
      >

        <Icon
          name="message-text-outline"
          size={28}
          color="#FFF"
        />

      </Pressable>

      <Modal
        visible={mostrarModalComentario}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModalComentario(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >

          <Pressable
            style={styles.modalOverlay}
            onPress={() => setMostrarModalComentario(false)}
          >
            <View style={[styles.modalContainer, { backgroundColor: theme.card }]}> 

              <Text style={[styles.modalTitulo, { color: theme.text }]}> 
                Novo comentário
              </Text>

              <TextInput
                style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.card }]}
                value={novoComentario}
                onChangeText={setNovoComentario}
                placeholder="Digite seu comentário"
                placeholderTextColor={theme.muted}
                multiline
              />

              <Pressable
                style={[styles.modalBotao, { backgroundColor: theme.primary }]}
                onPress={() => {
                  void handleAddComentario();
                  setMostrarModalComentario(false);
                }}
              >
                <Text style={[styles.modalBotaoTexto, { color: theme.textOnPrimary }]}> 
                  Enviar
                </Text>
              </Pressable>


            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={modalReportarAnotacao}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={[styles.modalReport, { backgroundColor: theme.card }]}> 

            <Text style={[styles.modalTituloReport, { color: theme.text }]}> 
              Há algum problema com esta anotação?
            </Text>

            <Text style={[styles.modalDescricao, { color: theme.muted }]}> 
              "{AnotacaoSelecionada?.text}"
            </Text>

            {
              AnotacaoSelecionada &&
              denunciaPorAnotacao[
              AnotacaoSelecionada.text
              ] > 0 && (
                <Text style={[styles.modalDescricao, { color: theme.muted }]}> 
                  {
                    denunciaPorAnotacao[
                    AnotacaoSelecionada.text
                    ]
                  } usuário(s) já reportaram esta anotação.
                </Text>
              )
            }

            <View style={styles.botoes}>

              <Pressable
                style={[styles.botaoConfirmar, { backgroundColor: theme.primary }]}
                onPress={async () => {
                  if (!user) return;
                  if (!AnotacaoSelecionada) return;
                  try {
                    await reportarAnotacao({
                      localId,
                      textoAnotacao: AnotacaoSelecionada.text,
                      uidAutor: user.uid,
                      nomeAutor: nomeUsuarioAtual,

                    });
                    await carregarLocal();

                    Alert.alert(
                      'Obrigado',
                      'Sua denúncia foi registrada.'
                    );
                    setModalReportarAnotacao(false);
                  } catch (error) {

                    if (error instanceof Error && error.message === 'DENUNCIA_DUPLICADA') {
                      Alert.alert(
                        'Denúncia',
                        'Você já denunciou esta anotação'
                      );
                      return;
                    }

                    Alert.alert(
                      'Erro',
                      'Não foi possível registrar a denúncia.'
                    );
                  }
                }}
              >
                <Text style={styles.textoBotaoConfirmar}>
                  Sim
                </Text>
              </Pressable>

              <Pressable
                style={[styles.botaoCancelar, { backgroundColor: isDark ? '#334155' : '#D1D1D6' }]}
                onPress={() =>
                  setModalReportarAnotacao(false)
                }
              >
                <Text style={[styles.textoBotaoCancelar, { color: theme.text }]}> 
                  Cancelar
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>

      <Footer>
        <FooterButton active type='1' />

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
            setVerProfile(true)
          }}

        />
      </Footer>

      {/* Modal normal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TextInput
              placeholder="Buscar"
              style={styles.search}
              value={search}
              onChangeText={setSearch}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredOptions.map((item, index) => (
                <View key={index} style={styles.optionRow}>
                  <Text style={styles.optionText}>{item}</Text>

                  <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => void addAnnotation(item, true)}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={28}
                        color="#35C759"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => void addAnnotation(item, false)}>
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
                <Ionicons name="add-circle-outline" size={24} color="#BDBDBD" />
                <Text style={styles.other}>Adicionar anotação</Text>
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

      {/* Modal da opção custom */}
      <Modal transparent visible={otherModalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal2}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
              }}
            >
              Adicionar anotação
            </Text>

            <TextInput
              placeholder="Digite a anotação..."
              style={styles.search}
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
                <Text style={{ color: '#FF3B30', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (customAnnotation.trim().length > 0) {
                    setOptions((prev) => [...prev, customAnnotation]);
                    void addAnnotation(customAnnotation, true);
                    setCustomAnnotation('');
                    setOtherModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: '#35C759', fontSize: 16 }}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

}

