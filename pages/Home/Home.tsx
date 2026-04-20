import { Text, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../components/AuthProvider';
import { styles } from './styles';

export function Home() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.titulo}>
        Olá!
      </Text>
      <Text style={styles.email} selectable>
        {user?.email ?? 'Usuário autenticado'}
      </Text>
      <Text style={styles.dica}>
        Conexão com Firebase Authentication feita com sucesso.
      </Text>
      <Button
        title="Sair"
        variant="secondary"
        onPress={() => logout()}
        style={styles.botao}
      />
    </View>
  );
}
