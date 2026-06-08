import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import {
  screenSlideAnimation, fadeInAnimation,
} from '../../components/Animations/animations';

import { Ionicons } from '@expo/vector-icons';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updateProfile,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../../components/AuthProvider';
import { buscarPerfilFirestore, salvarPerfilFirestore } from '../../services/usuariosFirebase';

import { Footer, FooterButton } from '../../components/Footer/Footer';
import Locais from '../Locais/Locais';

import {
  Header,
  HeaderElement,
} from '../../components/Header/Header';

import MeusLocais from '../MeusLocais/MeusLocais';

import Avaliation from '../Avaliation/Avaliation';

import {
  type LocalFirebase,
} from '../../services/locaisFirebase';

import { styles } from './styles';
import { useTheme } from '../../components/ThemeProvider';

type ProfileProps = {
  onVoltar: () => void;
};

function formatBirth(text: string) {
  const cleaned = text.replace(/\D/g, '');

  let formatted = cleaned;

  if (cleaned.length > 2) {
    formatted =
      cleaned.slice(0, 2) +
      '/' +
      cleaned.slice(2);
  }

  if (cleaned.length > 4) {
    formatted =
      cleaned.slice(0, 2) +
      '/' +
      cleaned.slice(2, 4) +
      '/' +
      cleaned.slice(4, 8);
  }

  return formatted;
}

export function Profile({
  onVoltar,
}: Readonly<ProfileProps>) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark, highContrast, toggleHighContrast } = useTheme();

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState('User');

  const [bio, setBio] =
    useState('');

  const [birth, setBirth] =
    useState('');

  const [photo, setPhoto] =
    useState<string | null>(null);

  const [email, setEmail] =
    useState('');

  const [
    passwordConfirm,
    setPasswordConfirm,
  ] = useState('');

  const [
    verMeusLocais,
    setVerMeusLocais,
  ] = useState(false);

  const [
    localEditando,
    setLocalEditando,
  ] = useState<LocalFirebase | null>(
    null
  );
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [verLocais, setVerLocais] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // CARREGAR DADOS
  useEffect(() => {
    screenSlideAnimation(translateX, 'right').start();
    fadeInAnimation(opacity).start();

    async function loadData() {
      if (!user) return;

      try {
        const userProfile = await buscarPerfilFirestore(user.uid);

        if (userProfile) {
          if (userProfile.name) setName(userProfile.name);
          if (userProfile.bio) setBio(userProfile.bio);
          if (userProfile.birth) setBirth(userProfile.birth);
          if (userProfile.photo) setPhoto(userProfile.photo);
        }

        if (user.email) {
          setEmail(user.email);
        }
      } catch (error) {
        console.log('Erro ao carregar do Firestore:', error);
      }
    }

    loadData();
  }, [user]);

  const infosPreenchidas = [
    name.trim() !== '' &&
    name !== 'User',

    bio.trim() !== '',

    birth.trim() !== '',

    photo !== null,
  ];

  const nivel =
    infosPreenchidas.filter(Boolean)
      .length;

  const porcentagemXp =
    (nivel / 4) * 100;

  const perfilCompleto =
    nivel === 4;

  function handleEdit() {
    setEditing(true);
  }

  if (verLocais) {
    return <Locais onVoltar={() => setVerLocais(false)} />;
  }

  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão negada',
        'Libere acesso à galeria'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.5,
          base64: true,
        }
      );

    if (
      !result.canceled &&
      result.assets[0].base64
    ) {
      const base64Image =
        `data:image/jpeg;base64,${result.assets[0].base64}`;

      setPhoto(base64Image);
    }
  }

  async function handleSave() {
    if (!user) return;

    try {
      const emailAlterado = email !== user.email;

      if (emailAlterado) {
        if (!passwordConfirm) {
          Alert.alert('Confirmação necessária', 'Digite sua senha para alterar o email.');
          return;
        }


        const credential = EmailAuthProvider.credential(user.email || '', passwordConfirm);
        await reauthenticateWithCredential(user, credential);
        await verifyBeforeUpdateEmail(user, email);
      }

      await salvarPerfilFirestore(user.uid, {
        name: name,
        bio: bio,
        birth: birth,
        photo: photo, // Base64
        email: email,
      });

      setPasswordConfirm('');
      setEditing(false);

      if (emailAlterado) {
        Alert.alert('Email atualizado', 'Enviamos um email de confirmação para o novo endereço.');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar.');
    }
  }

  async function handleLogout() {
    await logout();
  }

  if (localEditando) {
    return (
      <Avaliation
        local={localEditando}
        coordenadas={{
          lat: localEditando.lat,
          long: localEditando.long,
        }}
        onVoltar={() =>
          setLocalEditando(null)
        }
        onSalvo={() => {
          setLocalEditando(null);
        }}
        onExcluido={() => {
          setLocalEditando(null);
        }}
      />
    );
  }

  if (verMeusLocais) {
    return (
      <MeusLocais
        onVoltar={() =>
          setVerMeusLocais(false)
        }
        onHome={() => {
          setVerMeusLocais(false);
          onVoltar();
        }}
        onLocais={() => {
          setVerMeusLocais(false);
          setVerLocais(true);
        }}
        onProfile={() => {
          setVerMeusLocais(false);
        }}
        onEditarLocal={(
          local: LocalFirebase
        ) => {
          setLocalEditando(local);
        }}
      />
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateX }], backgroundColor: theme.background },]}>
      {/* HEADER */}
      <Header themed>
        <HeaderElement
          themed
          type='1'
          text='Voltar'
          textStyle={isDark ? { color: theme.primary } : undefined}
          onPress={onVoltar}
        />

        <HeaderElement
          themed
          type='2'
          text='Perfil'
        />

        {editing ? (
          <HeaderElement
            themed
            type='3'
            text='Concluir'
            onPress={handleSave}
          />
        ) : (
          <HeaderElement
            themed
            type='3'
            text='Editar'
            textStyle={isDark ? { color: theme.primary } : undefined}
            onPress={handleEdit}
          />
        )}
      </Header>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={styles.avatarWrapper}
        >
          <Image
            source={
              photo
                ? { uri: photo }
                : require('../../assets/avatar.png')
            }
            style={styles.avatar}
          />

          {editing && (
            <Pressable
              style={styles.cameraButton}
              onPress={pickImage}
            >
              <Ionicons
                name='camera'
                size={18}
                color='#fff'
              />
            </Pressable>
          )}
        </View>

        {editing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.card }]}
            placeholderTextColor={theme.text}
          />
        ) : (
          <Text style={[styles.name, { color: highContrast ? '#FFD600' : theme.text }]}> 
            {name}
          </Text>
        )}

        <View style={highContrast ? [styles.levelCard, { backgroundColor: '#000000',borderWidth: 1, borderColor: '#FFD600' }] : isDark ? [styles.levelCard, { backgroundColor: theme.card }] : styles.levelCard}>
          {perfilCompleto ? (
            <Text style={[styles.completeText, { color: highContrast ? '#FFD600' : theme.primary }]}>Usuário pronto para explorar 🚀</Text>
          ) : (
            <>
              <View style={styles.levelHeader}>
                <Text
                  style={highContrast ? [styles.levelTitle, { color: '#FFD600', fontWeight: '700' }] : isDark ? [styles.levelTitle, { color: theme.primary, fontWeight: '700' }] : styles.levelTitle}
                >
                  Nível {nivel}
                </Text>

                <Text
                  style={highContrast ? [styles.levelXp, { color: '#FFD600' }] : isDark ? [styles.levelXp, { color: theme.muted }] : styles.levelXp}
                >
                  {nivel}/4
                </Text>
              </View>

              <View style={[styles.progressBarBackground, { backgroundColor: highContrast ? '#333333' : theme.card }]}> 
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${porcentagemXp}%`,
                      backgroundColor: highContrast ? '#FFD600' : theme.primary,
                    },
                  ]}
                />
              </View>
            </>
          )}
        </View>

        <Text style={isDark ? [styles.label, { color: theme.titulo }] : [styles.label, { color: theme.titulo }] }> 
          Bio
        </Text>

        {editing ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[
              styles.input,
              styles.bioInput,
            ]}
            multiline
            placeholderTextColor={theme.text}
          />
        ) : (
          <Text
            style={[styles.infoText, { color: highContrast ? theme.campo : theme.primary }]}
          >
            {bio || '-'}
          </Text>
        )}

        <Text style={isDark ? [styles.label, { color: theme.titulo }] : [styles.label, { color: theme.titulo }] }> 
          Email
        </Text>

        {editing ? (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.card }]}
              placeholderTextColor={theme.text}
              keyboardType='email-address'
              autoCapitalize='none'
            />

            <TextInput
              value={passwordConfirm}
              onChangeText={
                setPasswordConfirm
              }
              style={[
                styles.input,
                {
                  marginTop: 10,
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.card,
                },
              ]}
              placeholder='Confirme sua senha'
              placeholderTextColor={theme.text}
              secureTextEntry
            />
          </>
        ) : (
          <Text
            style={[styles.infoText, { color: highContrast ? theme.campo  : theme.campo, fontWeight: '700', opacity: 1 }]}
          >
            {email || '-'}
          </Text>
        )}

        <Text style={isDark ? [styles.label, { color: theme.titulo }] : [styles.label, { color: theme.titulo }] }> 
          Data de Nascimento
        </Text>

        {editing ? (
            <TextInput
              value={birth}
              onChangeText={(text) =>
                setBirth(
                  formatBirth(text)
                )
              }
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.card }]}
              placeholderTextColor={theme.text}
              keyboardType='numeric'
              maxLength={10}
            />
        ) : (
          <Text
            style={[styles.infoText, { color: highContrast ? '#FFD600' : theme.campo }]}
          >
            {birth || '-'}
          </Text>
        )}

        <Pressable
          style={[
            styles.themeToggle,
            { backgroundColor: theme.card, borderColor: isDark ? theme.primary : '#c4c4c4' },
          ]}
          onPress={() => {
            void toggleTheme();
          }}
        >
          <Text style={[styles.themeToggleText, { color:isDark ? theme.primary : theme.titulo }]}> 
            {isDark ? 'Modo Claro' : 'Modo Noturno'}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.contrastBtn,
            { backgroundColor: theme.card, borderColor: highContrast ? theme.primary : '#c4c4c4' },
          ]}
          onPress={async () => {
            try {
              await toggleHighContrast();
            } catch (e) {
              console.log('Erro ao alternar highContrast:', e);
            }
          }}
        >
          <Text style={[styles.contrastText, { color: highContrast ? '#FFD600' : theme.text }]}>Alto contraste</Text>
        </Pressable>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: theme.card, borderWidth: 1, borderColor: '#E53935' }]}
          onPress={handleLogout}
        >
          <Text
            style={[styles.logoutText, { color: '#E53935' }]}
          >
            Sair
          </Text>
        </Pressable>
      </ScrollView>

      <Footer>
        <FooterButton
          type='1'
          onPress={onVoltar}
        />

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
          active
          type='3'
        />
      </Footer>
    </Animated.View>
  );
}