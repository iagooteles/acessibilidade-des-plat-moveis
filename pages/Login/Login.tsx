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
import { useTheme } from '../../components/ThemeProvider';
import { styles } from './styles';

type Props = {
  onIrParaRegister: () => void;
  onVoltar?: () => void;
};

export function Login({ onIrParaRegister, onVoltar }: Readonly<Props>) {
  const { login, resetPassword } = useAuth();
  const { theme } = useTheme();
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

  async function handleResetPassword() {

    if (!email.trim()) {
      setErro('Digite seu e-mail.');
      return;
    }

    try {
      await resetPassword(email);

      setErro('E-mail de recuperação enviado!');
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : 'Erro ao enviar e-mail.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {onVoltar ? (
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.card,
            },
          ]}
        >
          <View style={styles.topBarInner}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar ao mapa"
              onPress={onVoltar}
              style={styles.voltarPressable}
              hitSlop={12}
            >
              <Text style={[styles.voltarText, { color: theme.text }]}>← Voltar ao mapa</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: theme.card }]}> 
          <Text accessibilityRole="header" style={[styles.titulo, { color: theme.text }]}> 
            Entrar
          </Text>
          <Text style={[styles.subtitulo, { color: theme.muted }]}> 
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
            <Text style={[styles.link, { color: theme.primary }]}>Não tem conta? Cadastre-se</Text>
          </Pressable>

          <Pressable
            onPress={handleResetPassword}
            style={styles.linkWrapPassword}
          >
            <Text style={[styles.password, { color: theme.muted }]}> 
              Esqueci minha senha
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
