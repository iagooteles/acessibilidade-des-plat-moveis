import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { useAuth } from '../../components/AuthProvider';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export function Profile({ onVoltar }: { onVoltar: () => void }) {
  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('User');
  const [bio, setBio] = useState('');
  const [birth, setBirth] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  //CARREGAR DADOS
  useEffect(() => {
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
      } catch (error) {
        console.log('Erro ao carregar:', error);
      }
    }

    loadData();
  }, [user]);

  function handleEdit() {
    setEditing(true);
  }

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

  //ESCOLHER FOTO
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Libere acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhoto(base64Image);
    }
  }

  //SALVAR
  async function handleSave() {
    if (!user) return;

    try {
      await AsyncStorage.setItem(`name_${user.uid}`, name);
      await AsyncStorage.setItem(`bio_${user.uid}`, bio);
      await AsyncStorage.setItem(`birth_${user.uid}`, birth);

      if (photo) {
        await AsyncStorage.setItem(`photo_${user.uid}`, photo);
      }

      setEditing(false);
    } catch (error) {
      console.log('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  //LOGOUT 
  async function handleLogout() {
    await logout();
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={onVoltar}>
          <Text style={styles.headerText}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Perfil</Text>

        {editing ? (
          <Pressable onPress={handleSave}>
            <Text style={styles.headerText}>Concluir</Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleEdit}>
            <Text style={styles.headerText}>Editar</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* FOTO */}
        <Pressable
          onPress={editing ? pickImage : undefined}
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
        </Pressable>

        {/* NOME */}
        {editing ? (
          <TextInput value={name} onChangeText={setName} style={styles.input} />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}

        {/* BIO */}
        <Text style={styles.label}>Bio</Text>
        {editing ? (
          <TextInput value={bio} onChangeText={setBio} style={styles.input} />
        ) : (
          <Text>{bio || '-'}</Text>
        )}

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <Text>{user?.email ?? ''}</Text>

        {/* DATA */}
        <Text style={styles.label}>Data de Nascimento</Text>
        {editing ? (
          <TextInput
            value={birth}
            onChangeText={(text) => setBirth(formatBirth(text))}
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
          />
        ) : (
          <Text>{birth || '-'}</Text>
        )}

        {/* LOGOUT */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>

      {/* FOOTER — mesmo padrão da Home: mapa volta ao mapa (home) */}
      <View style={styles.footer}>
        <Pressable
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Ir para o mapa"
        >
          <View style={styles.icon}>
            <Image
              source={require('../../components/Imagens/icon-map.png')}
              style={styles.iconImage}
            />
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" accessibilityLabel="Anotações">
          <View style={styles.icon}>
            <Image
              source={require('../../components/Imagens/lapis.png')}
              style={styles.iconImage}
            />
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" accessibilityLabel="Perfil, tela atual">
          <View style={[styles.icon, styles.active]}>
            <Image
              source={require('../../assets/avatar.png')}
              style={styles.iconImage}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
