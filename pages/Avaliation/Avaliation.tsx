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
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {
  screenSlideUpAnimation,
  fadeInAnimation,
} from '../../components/Animations/animations';
import { useAuth } from '../../components/AuthProvider';
import {
  criarLocalNoFirebase,
  uploadFotoLocal,
  type AnotacaoLocal,
} from '../../services/locaisFirebase';
import { styles } from './styles';

export type CoordenadasLocal = { lat: number; long: number };

type AvaliationProps = {
  coordenadas: CoordenadasLocal;
  onVoltar: () => void;
  onSalvo?: () => void;
};

export default function Avaliation({
  coordenadas,
  onVoltar,
  onSalvo,
}: Readonly<AvaliationProps>) {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<AnotacaoLocal[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [search, setSearch] = useState('');
  const [otherText, setOtherText] = useState('');
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [customAnnotation, setCustomAnnotation] = useState('');

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [options, setOptions] = useState<string[]>([
    'Rampa de acesso',
    'Piso tátil',
    'Estacionamento prioritário',
    'Sinalização correta',
    'Trajetória adequada',

  ]);
  useEffect(() => {screenSlideUpAnimation(translateY).start();
  fadeInAnimation(opacity).start();}, []);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const addAnnotation = (text: string, positive: boolean) => {
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
  };

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
      quality: 0.75,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const salvarLocal = async () => {
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
      let fotoUrl: string | null = null;
      if (fotoUri) {
        fotoUrl = await uploadFotoLocal(fotoUri, user.uid);
      }
      await criarLocalNoFirebase({
        nome: nomeLimpo,
        lat: coordenadas.lat,
        long: coordenadas.long,
        anotacoes: annotations,
        fotoUrl,
        criadoPor: user.uid,
      });
      Alert.alert('Salvo', 'Local registrado com sucesso.');
      onSalvo?.();
      onVoltar();
    } catch {
      Alert.alert(
        'Erro ao salvar',
        'Verifique no Firebase Console se o Firestore e o Storage estão ativos e se as regras permitem escrita para usuários autenticados.'
      );
    } finally {
      setSalvando(false);
    }
  };

  const textoCoordenadas = `${coordenadas.lat.toFixed(5)}, ${coordenadas.long.toFixed(5)}`;

  return (
    <Animated.View style={[styles.container,
    {flex: 1,opacity,transform: [{ translateY }],},]}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text style={styles.back}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Novo local</Text>
        </View>

        <ScrollView
          style={styles.scroll}
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
            editable={!salvando}
          />

          <Text style={styles.fieldLabel}>Coordenadas</Text>
          <Text style={styles.coordsText}>{textoCoordenadas}</Text>

          <Text style={styles.fieldLabel}>Foto</Text>
          <View style={styles.imageRow}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.image} />
            ) : null}

            <TouchableOpacity
              style={styles.addImageBox}
              onPress={() => void escolherFoto()}
              disabled={salvando}
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto"
            >
              <Ionicons name="camera-outline" size={36} color="#AFAFAF" />
            </TouchableOpacity>
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

          <View style={styles.scrollSpacer} />
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, salvando && styles.buttonDisabled]}
          onPress={() => void salvarLocal()}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar local</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>

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
      <Modal
        transparent
        visible={otherModalVisible}
        animationType="fade"
      >
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
                <Text style={{ color: '#35C759', fontSize: 16 }}>
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