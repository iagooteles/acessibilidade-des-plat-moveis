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
  onVoltarLogin: () => void;
};

export function Register({ onVoltarLogin }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleCadastrar() {
    setErro(null);
    if (!email.trim() || !senha || !confirmar) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setCarregando(true);
    try {
      await register(email, senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao cadastrar.');
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
            Criar conta
          </Text>
          <Text style={styles.subtitulo}>
            Cadastre-se com e-mail e senha.
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
            autoComplete="password-new"
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
          />
          <Input
            label="Confirmar senha"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repita a senha"
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
            title="Cadastrar"
            loading={carregando}
            onPress={handleCadastrar}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para login"
            onPress={onVoltarLogin}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>Já tem conta? Entrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
