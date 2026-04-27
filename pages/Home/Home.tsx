import { useState } from 'react';
import { Profile } from '../Profile/Profile';
import { styles } from './styles';
import { View, Text, TextInput, Image, Pressable } from 'react-native';

export function Home() {
  const [verProfile, setVerProfile] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [rampa, setRampa] = useState(false);
  const [piso, setPiso] = useState(true);
  const [estacionamento, setEstacionamento] = useState(false);
  const [sinalizacao, setSinalizacao] = useState(false);

  if (verProfile) {
    return <Profile onVoltar={() => setVerProfile(false)} />;
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>

        <Text style={styles.title}>Mapa</Text>

        <Pressable onPress={() => setMostrarFiltro(!mostrarFiltro)}>
          <Text style={styles.filterText}>Filtrar</Text>
        </Pressable>
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
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable>
          <View style={[styles.icon, styles.active]}>
            <Image 
              source={require('../../components/Imagens/icon-map.png')} 
              style={styles.iconImage}/>
          </View>
        </Pressable>
        
        <Pressable>
          <View style={styles.icon}>
            <Image 
              source={require('../../components/Imagens/lapis.png')} 
              style={styles.iconImage}/>
          </View>
        </Pressable>

        <Pressable onPress={() => setVerProfile(true)}>
          <View style={styles.icon}>
            <Image 
              source={require('../../components/Imagens/usuario.png')} 
              style={styles.iconImage}/>
          </View>
        </Pressable>
      </View>
    </View>
  );
}