import { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, Pressable } from 'react-native';
import { useAuth } from '../../components/AuthProvider';
import Avaliation from '../Avaliation/Avaliation';
import { Profile } from '../Profile/Profile';
import { Detalhes } from '../Detalhes/Detalhes';
import { styles } from './styles';
import { Footer, FooterButton } from '../../components/Footer/Footer';

type HomeProps = {
  onPrecisaLogin: () => void;
};

export function Home({ onPrecisaLogin }: Readonly<HomeProps>) {
  const { user } = useAuth();
  const [verProfile, setVerProfile] = useState(false);
  const [verAvaliation, setVerAvaliation] = useState(false);
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [rampa, setRampa] = useState(false);
  const [piso, setPiso] = useState(true);
  const [estacionamento, setEstacionamento] = useState(false);
  const [sinalizacao, setSinalizacao] = useState(false);

  useEffect(() => {
    if (!user && verProfile) {
      setVerProfile(false);
    }
  }, [user, verProfile]);

  if (verProfile) {
    return <Profile onVoltar={() => setVerProfile(false)} />;
  }

  if (verAvaliation) {
    return <Avaliation onVoltar={() => setVerAvaliation(false)} />;
  }

  if (verDetalhes) {
    return <Detalhes onVoltar={() => setVerDetalhes(false)} />
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Mapa</Text>
        </View>
        <View style={styles.headerSideRight}>
          <Pressable
            onPress={() => setMostrarFiltro(!mostrarFiltro)}
            accessibilityRole="button"
            accessibilityLabel="Filtrar mapa"
          >
            <Text style={styles.filterText}>Filtrar</Text>
          </Pressable>
        </View>
      </View>

      {/* MAPA */}
      <View style={styles.mapContainer}>
        {mostrarFiltro && (
          <View style={styles.filtroCard}>
            <Pressable onPress={() => setRampa(!rampa)}>
              <Text>{rampa ? '☑' : '☐'} Rampa de acesso</Text>
            </Pressable>

            <Pressable onPress={() => setPiso(!piso)}>
              <Text>{piso ? '☑' : '☐'} Piso tátil</Text>
            </Pressable>

            <Pressable onPress={() => setEstacionamento(!estacionamento)}>
              <Text>{estacionamento ? '☑' : '☐'} Estacionamento prioritário</Text>
            </Pressable>

            <Pressable onPress={() => setSinalizacao(!sinalizacao)}>
              <Text>{sinalizacao ? '☑' : '☐'} Sinalização adequada</Text>
            </Pressable>
          </View>
        )}

        {/* BUSCA */}
        <TextInput
          placeholder="Buscar"
          style={styles.searchInput}
        />

        {/* IMAGEM DO MAPA */}
        <Image
          source={require('../../components/Imagens/mapa.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* BOTÃO + */}
        <Pressable
          style={styles.fab}
          onPress={() => setVerAvaliation(true)}
          accessibilityRole="button"
          accessibilityLabel="Nova avaliação"
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>

      </View>

      {/* FOOTER */}

<Footer>
  <FooterButton
  active
  type='1'
  />
  <FooterButton
  type='2'
          onPress={() => {setVerDetalhes(true)}}
  />
  <FooterButton
  type='3'
          onPress={() => {
            if (user) {
              setVerProfile(true);
            } else {
              onPrecisaLogin();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={user ? 'Abrir perfil' : 'Entrar para ver o perfil'}
  />
</Footer>
    </View>
  );
}