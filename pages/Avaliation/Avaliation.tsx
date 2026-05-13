import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
} from 'react-native';
import { useAuth } from '../../components/AuthProvider';
import {
  criarLocalNoFirebase,
  editarLocalNoFirebase,
  excluirLocalNoFirebase,
  type AnotacaoLocal,
  type LocalFirebase,
} from '../../services/locaisFirebase';
import { styles } from './styles';

export type CoordenadasLocal = { lat: number; long: number };

const MAX_FOTO_BASE64_CHARS = 900000;

function getTituloAvaliation(ehDetalhe: boolean, editando: boolean) {
  if (!ehDetalhe) {
    return 'Novo local';
  }

  return editando ? 'Editar local' : 'Detalhes do local';
}

function getTextoBotaoSalvar(ehDetalhe: boolean) {
  return ehDetalhe ? 'Salvar alterações' : 'Salvar local';
}

type AvaliationProps = {
  coordenadas: CoordenadasLocal;
  local?: LocalFirebase;
  onVoltar: () => void;
  onSalvo?: () => void;
  onExcluido?: () => void;
};

export default function Avaliation({
  coordenadas,
  local,
  onVoltar,
  onSalvo,
  onExcluido,
}: Readonly<AvaliationProps>) {
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
  const [editando, setEditando] = useState(!local);
  const [salvando, setSalvando] = useState(false);
  const ehDetalhe = Boolean(local);
  const usuarioCriador = Boolean(local?.criadoPor && user?.uid === local.criadoPor);
  const podeAlterar = !ehDetalhe || (usuarioCriador && editando);

  const options = [
    'Rampa de acesso',
    'Piso tátil',
    'Estacionamento prioritário',
    'Sinalização correta',
    'Trajetória adequada',
    'Exemplo de outro',
  ];

  const addAnnotation = (text: string, positive: boolean) => {
    if (!podeAlterar) {
      return;
    }

    setAnnotations((prev) => [
      ...prev,
      {
        text: positive ? `Possui ${text}` : `Não possui ${text}`,
        type: positive ? 'positive' : 'negative',
      },
    ]);
    setModalVisible(false);
  };

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
        await criarLocalNoFirebase({
          nome: nomeLimpo,
          lat: coordenadas.lat,
          long: coordenadas.long,
          anotacoes: annotations,
          fotoBase64,
          criadoPor: user.uid,
        });
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
    <View style={styles.container}>
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
            <Text style={styles.back}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{titulo}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.fieldLabel}>Nome do local</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Entrada principal da biblioteca"
            placeholderTextColor="#999"
            editable={podeAlterar && !salvando}
          />

          <Text style={styles.fieldLabel}>Coordenadas</Text>
          <Text style={styles.coordsText}>{textoCoordenadas}</Text>

          <Text style={styles.fieldLabel}>Foto</Text>
          <View style={styles.imageRow}>
            {fotoSource ? (
              <Image source={fotoSource} style={styles.image} />
            ) : null}

            {mostrarSemFoto ? (
              <Text style={styles.semFoto}>Sem foto cadastrada.</Text>
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

          <Text style={styles.section}>Anotações</Text>

          {annotations.map((item, index) => (
            <View key={`${item.text}-${index}`} style={styles.noteRow}>
              <Ionicons
                name={
                  item.type === 'positive' ? 'checkmark-circle' : 'close-circle'
                }
                size={24}
                color={item.type === 'positive' ? '#35C759' : '#FF3B30'}
              />
              <Text style={styles.noteText}>{item.text}</Text>
            </View>
          ))}

          {podeAlterar ? (
            <TouchableOpacity
              style={styles.noteRow}
              onPress={() => setModalVisible(true)}
              disabled={salvando}
            >
              <Ionicons name="add-circle-outline" size={24} color="#BDBDBD" />
              <Text style={[styles.noteText, { color: '#BDBDBD' }]}>
                Adicionar…
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.scrollSpacer} />
        </ScrollView>

        {podeAlterar && (
          <TouchableOpacity
            style={[styles.button, salvando && styles.buttonDisabled]}
            onPress={() => void salvarLocal()}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{textoBotaoSalvar}</Text>
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
          <View style={styles.modal}>
            <TextInput placeholder="Buscar" style={styles.search} />

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((item, index) => (
                <View key={index} style={styles.optionRow}>
                  <Text style={styles.optionText}>{item}</Text>

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

              <View style={{ marginTop: 12 }}>
                <Text style={styles.other}>Outro: Digite aqui…</Text>
              </View>
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
    </View>
  );
}
