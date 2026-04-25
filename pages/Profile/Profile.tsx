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
import { FooterButton, Footer } from '../../components/Footer/Footer';

export function Profile({ onVoltar }: { onVoltar: () => void }) {
  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('User');
  const [bio, setBio] = useState('');
  const [birth, setBirth] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  // 🔹 Carregar dados salvos
  useEffect(() => {
    async function loadData() {
      const savedName = await AsyncStorage.getItem('name');
      const savedBio = await AsyncStorage.getItem('bio');
      const savedBirth = await AsyncStorage.getItem('birth');
      const savedPhoto = await AsyncStorage.getItem('photo');

      if (savedName) setName(savedName);
      if (savedBio) setBio(savedBio);
      if (savedBirth) setBirth(savedBirth);
      if (savedPhoto) setPhoto(savedPhoto);
    }

    loadData();
  }, []);

  function handleEdit() {
    setEditing(true);
  }

  // 🔹 Máscara de data (dd/mm/aaaa)
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

  // 🔹 Abrir galeria
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisa liberar acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  // 🔹 Salvar perfil
  async function handleSave() {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('bio', bio);
      await AsyncStorage.setItem('birth', birth);

      if (photo) {
        await AsyncStorage.setItem('photo', photo);
      }

      setEditing(false);
    } catch (error) {
      console.log('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil');
    }
  }

  // 🔹 Logout
  async function handleLogout() {
    await AsyncStorage.clear();
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

        {/* DATA NASC */}
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

      {/* FOOTER */}
      <Footer>
        <FooterButton
          type='1'
          onPress={onVoltar} // 'onVoltar' é temporário. substituir quando a tela home for feita.
        />
        <FooterButton
          type='2'
          onPress={onVoltar} // substituir 'onVoltar' quando a tela do meio for feita.
        />
        <FooterButton
          active
          type='3'
        />
      </Footer>
    </View>
  );
}