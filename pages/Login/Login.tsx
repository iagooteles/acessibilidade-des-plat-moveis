import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../components/AuthProvider';
import { styles } from './styles';

type Props = {
  onIrParaRegister: () => void;
};

export function Login({ onIrParaRegister }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    setErro(null);
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await login(email, senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.titulo}>
            Entrar
          </Text>
          <Text style={styles.subtitulo}>
            Use seu e-mail e senha para acessar.
          </Text>

          <Input
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
          />
          <Input
            label="Senha"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
          />

          {erro ? (
            <Text
              accessibilityLiveRegion="polite"
              style={styles.erroGeral}
            >
              {erro}
            </Text>
          ) : null}

          <Button
            title="Entrar"
            loading={carregando}
            onPress={handleEntrar}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir para criar conta"
            onPress={onIrParaRegister}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
