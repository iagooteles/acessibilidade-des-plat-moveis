import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../components/AuthProvider';
import { Profile } from '../Profile/Profile';
import { styles } from './styles';

export function Home() {
  const { user, logout } = useAuth();
  const [verProfile, setVerProfile] = useState(false);

  if (verProfile) {
    return <Profile onVoltar={() => setVerProfile(false)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Olá!</Text>

      <Text style={styles.email}>
        {user?.email}
      </Text>

      <Button
        title="Ir para Perfil"
        onPress={() => setVerProfile(true)}
        style={{ marginBottom: 10 }}
      />

      <Button
        title="Sair"
        variant="secondary"
        onPress={logout}
      />

      
    </View>
  );
}