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
        onEditarLocal={(
          local: LocalFirebase
        ) => {
          setLocalEditando(local);
        }}
      />
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateX }], },]}>
      {/* HEADER */}
      <Header themed>
        <HeaderElement
          themed
          type='1'
          text='Voltar'
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
              style={
                styles.cameraButton
              }
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
            style={styles.input}
          />
        ) : (
          <Text style={styles.name}>
            {name}
          </Text>
        )}

        <View style={styles.levelCard}>
          {perfilCompleto ? (
            <Text
              style={
                styles.completeText
              }
            >
              Usuário pronto para
              explorar 🚀
            </Text>
          ) : (
            <>
              <View
                style={
                  styles.levelHeader
                }
              >
                <Text
                  style={
                    styles.levelTitle
                  }
                >
                  Nível {nivel}
                </Text>

                <Text
                  style={
                    styles.levelXp
                  }
                >
                  {nivel}/4
                </Text>
              </View>

              <View
                style={
                  styles.progressBarBackground
                }
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${porcentagemXp}%`,
                    },
                  ]}
                />
              </View>
            </>
          )}
        </View>

        <Text style={styles.label}>
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
          />
        ) : (
          <Text
            style={styles.infoText}
          >
            {bio || '-'}
          </Text>
        )}

        <Text style={styles.label}>
          Email
        </Text>

        {editing ? (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
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
                },
              ]}
              placeholder='Confirme sua senha'
              secureTextEntry
            />
          </>
        ) : (
          <Text
            style={styles.infoText}
          >
            {email || '-'}
          </Text>
        )}

        <Text style={styles.label}>
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
            style={styles.input}
            keyboardType='numeric'
            maxLength={10}
          />
        ) : (
          <Text
            style={styles.infoText}
          >
            {birth || '-'}
          </Text>
        )}

        <Pressable
          style={styles.meusLocaisBtn}
          onPress={() =>
            setVerMeusLocais(true)
          }
        >
          <Text
            style={
              styles.meusLocaisText
            }
          >
            Meus Locais
          </Text>
        </Pressable>

        <Pressable
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text
            style={styles.logoutText}
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
          active
          type='3'
        />
      </Footer>
    </Animated.View>
  );
}