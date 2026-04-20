import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../components/AuthProvider';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { styles } from './styles';

function AppContent() {
  const { user, initializing } = useAuth();
  const [fluxo, setFluxo] = useState<'login' | 'register'>('login');

  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando" />
      </View>
    );
  }

  if (user) {
    return <Home />;
  }

  if (fluxo === 'register') {
    return (
      <Register onVoltarLogin={() => setFluxo('login')} />
    );
  }

  return (
    <Login onIrParaRegister={() => setFluxo('register')} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.root}>
        <AppContent />
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}