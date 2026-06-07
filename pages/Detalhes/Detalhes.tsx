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

import { db } from '../../config/firebase';
import { Footer, FooterButton } from '../../components/Footer/Footer';
import { Header, HeaderElement } from '../../components/Header/Header';
import { Profile } from '../Profile/Profile';
import Locais from '../Locais/Locais';
import { ComentarioLocal, criarComentarioNoLocal, type LocalFirebase } from '../../services/locaisFirebase';
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
import { AnotacaoUpvote } from '../../components/AnotacaoUpvote/AnotacaoUpvote';

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

  if (!local) {

    return (
      <View style={styles.loading}>
        <Text>Carregando...</Text>
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
    <View style={styles.container}>

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
              <Text style={styles.nome}>
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
            <Text style={styles.numero}>
              {local.numero}
            </Text>
          ) : null}

          {local.descricao ? (
            <Text style={styles.descricao}>
              {local.descricao}
            </Text>
          ) : null}
        </View>

        {/* Coordenadas */}
        {/* 
        {local.lat != null && local.long != null ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Coordenadas
            </Text>
            <Text style={styles.coordenadas}>
              {local.lat.toFixed(5)}, {local.long.toFixed(5)}
            </Text>
          </View>
        ) : null}

        {local.lat != null && local.long != null ? (
          <View style={styles.hr} />
        ) : null} */}

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Fotos
          </Text>

          <FlatList
            horizontal
            data={
              local.fotoBase64 || local.fotoUrl
                ? [
                  local.fotoBase64 ??
                  local.fotoUrl ??
                  ''
                ]
                : []
            }
            keyExtractor={(item, index) => String(index)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesList}
            ListEmptyComponent={
              <Text style={styles.semFoto}>
                Sem foto cadastrada.
              </Text>
            }
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
              />
            )}
          />
        </View>

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Anotações por usuários
          </Text>

          <View style={styles.anotacoesLista}>
            {(local.anotacoes ?? []).map((item, index) => (

              <View
                key={index}
                style={styles.anotacaoItem}
              >

                <View style={styles.anotacaoLeft}>

                  <Icon
                    name={
                      item.type === 'positive'
                        ? 'check-circle'
                        : 'close-circle'
                    }
                    size={22}
                    color={
                      item.type === 'positive'
                        ? '#31C451'
                        : '#FF3B30'
                    }
                  />

                  <View style={styles.anotacaoConteudo}>
                    <Text style={styles.anotacaoTexto}>
                      {item.text}
                    </Text>

                    {
                      denunciaPorAnotacao[item.text] >= 3 && (
                        <Text style={styles.alertaAnotacao}>
                          ⚠ Possível informação incorreta
                        </Text>
                      )
                    }
                  </View>
                </View>

                <View style={styles.anotacaoAcoes}>
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
                      color="#B0B0B0"
                    />
                  </Pressable>
                </View>

              </View>

            ))}
          </View>

          {/* Botão de adicionar Anotação */}
          <Pressable style={styles.addButton}>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#BDBDBD"
            />
            <Text style={styles.addText}>
              Adicionar...
            </Text>
          </Pressable>
        </View>

        <View style={styles.hr} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
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

                    <Text style={styles.commentUser}>
                      {item.nomeAutor}
                    </Text>

                    <Text style={styles.commentDate}>
                      {item.createdAt
                        ?.toDate()
                        .toLocaleDateString('pt-BR')
                      }
                    </Text>

                  </View>

                  <Text style={styles.commentText}>
                    {item.texto}
                  </Text>

                </View>

              </View>

            </View>

          ))}

          {(local.comentarios ?? []).length === 0 && (
            <Text style={styles.semComentarios}>
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
            <View style={styles.modalContainer}>

              <Text style={styles.modalTitulo}>
                Novo comentário
              </Text>

              <TextInput
                style={styles.modalInput}
                value={novoComentario}
                onChangeText={setNovoComentario}
                placeholder="Digite seu comentário"
                multiline
              />

              <Pressable
                style={styles.modalBotao}
                onPress={() => {
                  void handleAddComentario();
                  setMostrarModalComentario(false);
                }}
              >
                <Text style={styles.modalBotaoTexto}>
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
          <View style={styles.modalReport}>

            <Text style={styles.modalTituloReport}>
              Há algum problema com esta anotação?
            </Text>

            <Text style={styles.modalDescricao}>
              "{AnotacaoSelecionada?.text}"
            </Text>

            {
              AnotacaoSelecionada &&
              denunciaPorAnotacao[
              AnotacaoSelecionada.text
              ] > 0 && (
                <Text style={styles.modalDescricao}>
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
                style={styles.botaoConfirmar}
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
                style={styles.botaoCancelar}
                onPress={() =>
                  setModalReportarAnotacao(false)
                }
              >
                <Text style={styles.textoBotaoCancelar}>
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

    </View >
  );

}

