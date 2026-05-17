import { useState, useEffect, useRef  } from 'react';
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
import {screenSlideAnimation,fadeInAnimation,
} from '../../components/Animations/animations';

import { Ionicons } from '@expo/vector-icons';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';

import { useAuth } from '../../components/AuthProvider';
import { styles } from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { Footer, FooterButton } from '../../components/Footer/Footer';
import { Header, HeaderElement } from '../../components/Header/Header';

type ProfileProps = {
  onVoltar: () => void;
};

function formatBirth(text: string) {
  const cleaned = text.replace(/\D/g, '');

  let formatted = cleaned;

  if (cleaned.length > 2) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
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

export function Profile({ onVoltar }: Readonly<ProfileProps>) {
  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('User');
  const [bio, setBio] = useState('');
  const [birth, setBirth] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  // EMAIL
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // CARREGAR DADOS
  useEffect(() => {
    screenSlideAnimation(translateX,'right').start();
    fadeInAnimation(opacity).start();

    async function loadData() {
      if (!user) return;

      try {
        const savedName = await AsyncStorage.getItem(`name_${user.uid}`);
        const savedBio = await AsyncStorage.getItem(`bio_${user.uid}`);
        const savedBirth = await AsyncStorage.getItem(`birth_${user.uid}`);
        const savedPhoto = await AsyncStorage.getItem(`photo_${user.uid}`);

        if (savedName !== null) setName(savedName);
        if (savedBio !== null) setBio(savedBio);
        if (savedBirth !== null) setBirth(savedBirth);
        if (savedPhoto !== null) setPhoto(savedPhoto);

        if (user.email) {
          setEmail(user.email);
        }
      } catch (error) {
        console.log('Erro ao carregar:', error);
      }
    }

    loadData();
  }, [user]);

  // NÍVEL DINÂMICO
  const infosPreenchidas = [
    name.trim() !== '' && name !== 'User',
    bio.trim() !== '',
    birth.trim() !== '',
    photo !== null,
  ];

  const nivel = infosPreenchidas.filter(Boolean).length;

  const porcentagemXp = (nivel / 4) * 100;

  const perfilCompleto = nivel === 4;

  function handleEdit() {
    setEditing(true);
  }

  // ESCOLHER FOTO
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image =
        `data:image/jpeg;base64,${result.assets[0].base64}`;

      setPhoto(base64Image);
    }
  }

  // SALVAR
async function handleSave() {
  if (!user) return;

  try {
    // VERIFICA SE EMAIL FOI ALTERADO
    const emailAlterado = email !== user.email;

    // ALTERAR EMAIL FIREBASE
    if (emailAlterado) {
      if (!passwordConfirm) {
        Alert.alert(
          'Confirmação necessária',
          'Digite sua senha para alterar o email.'
        );
        return;
      }

      const credential =
        EmailAuthProvider.credential(
          user.email || '',
          passwordConfirm
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await verifyBeforeUpdateEmail(
        user,
        email
      );
    }

    // SALVAR DADOS
    await AsyncStorage.setItem(
      `name_${user.uid}`,
      name
    );

    await AsyncStorage.setItem(
      `bio_${user.uid}`,
      bio
    );

    await AsyncStorage.setItem(
      `birth_${user.uid}`,
      birth
    );

    if (photo) {
      await AsyncStorage.setItem(
        `photo_${user.uid}`,
        photo
      );
    }

    setPasswordConfirm('');

    setEditing(false);

    // ALERTA SOMENTE SE ALTERAR EMAIL
    if (emailAlterado) {
      Alert.alert(
        'Email atualizado',
        'Enviamos um email de confirmação para o novo endereço. Verifique sua caixa de entrada ou spam para concluir a alteração.'
      );
    }

  } catch (error: any) {
    console.log(error);

    Alert.alert(
      'Erro',
      error.message || 'Não foi possível atualizar.'
    );
  }
}

  // LOGOUT
  async function handleLogout() {
    await logout();
  }

  return (
    <Animated.View style={[styles.container,{opacity,transform: [{ translateX }],},]}>
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* FOTO */}
        <View style={styles.avatarWrapper}>
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

        {/* NOME */}
        {editing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}

        {/* CARD NÍVEL */}
        <View style={styles.levelCard}>
          {perfilCompleto ? (
            <Text style={styles.completeText}>
              Usuário pronto para explorar 🚀
            </Text>
          ) : (
            <>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>
                  Nível {nivel}
                </Text>

                <Text style={styles.levelXp}>
                  {nivel}/4
                </Text>
              </View>

              <View style={styles.progressBarBackground}>
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

        {/* BIO */}
        <Text style={styles.label}>Bio</Text>

        {editing ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.bioInput]}
            multiline
          />
        ) : (
          <Text style={styles.infoText}>
            {bio || '-'}
          </Text>
        )}

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>

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
              onChangeText={setPasswordConfirm}
              style={[
                styles.input,
                { marginTop: 10 },
              ]}
              placeholder='Confirme sua senha'
              secureTextEntry
            />
          </>
        ) : (
          <Text style={styles.infoText}>
            {email || '-'}
          </Text>
        )}

        {/* DATA */}
        <Text style={styles.label}>
          Data de Nascimento
        </Text>

        {editing ? (
          <TextInput
            value={birth}
            onChangeText={(text) =>
              setBirth(formatBirth(text))
            }
            style={styles.input}
            keyboardType='numeric'
            maxLength={10}
          />
        ) : (
          <Text style={styles.infoText}>
            {birth || '-'}
          </Text>
        )}

        {/* LOGOUT */}
        <Pressable
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Sair
          </Text>
        </Pressable>
      </ScrollView>

      {/* FOOTER */}
      <Footer>
        <FooterButton
          type='1'
          onPress={onVoltar}
        />

        <FooterButton type='2' />

        <FooterButton
          active
          type='3'
        />
      </Footer>
    </Animated.View>
  );
}