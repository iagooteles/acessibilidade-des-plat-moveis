// pages/Detalhes/Detalhes.tsx

import { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';

type Props = {
  localId: string;
  onVoltar: () => void;
};

type Comentario = {
  id: string;
  usuario: string;
  comentario: string;
  data: string;
};

type Local = {
  nome: string;
  numero?: string;
  descricao?: string;

  fotoUrl?: string | null;
  fotoBase64?: string | null;

  anotacoes?: {
  text: string;
  type: 'positive' | 'negative';
  }[];

  comentarios?: Comentario[];
};

export function Detalhes({
  localId,
  onVoltar,
}: Readonly<Props>) {

  const [local, setLocal] = useState<Local | null>(null);

  useEffect(() => {
    carregarLocal();
  }, [localId]);

  async function carregarLocal() {

    try {

      const ref = doc(db, 'locais', localId);

      const snap = await getDoc(ref);

      if (snap.exists()) {

        setLocal(snap.data() as Local);

      }

    } catch (error) {

      console.log(error);

    }

  }

  if (!local) {

    return (
      <View style={styles.loading}>
        <Text>Carregando...</Text>
      </View>
    );

  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Pressable
          onPress={onVoltar}
        >
          <Text style={styles.voltar}>
            Voltar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Local
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.nome}>
          {local.nome}
        </Text>

        <Text style={styles.numero}>
          {local.numero}
        </Text>

        <FlatList
          horizontal
          data={
            local.fotoBase64 || local.fotoUrl
            ? [
            local.fotoBase64 ??
            local.fotoUrl ??
            ''
            ]
            : []
          }
          keyExtractor={(item, index) => String(index)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesList}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.image}
            />
          )}
        />

        <Text style={styles.sectionTitle}>
          Anotações por usuários
        </Text>

        {(local.anotacoes ?? []).map((item, index) => (

          <View
            key={index}
            style={styles.anotacaoItem}
          >

            <View style={styles.anotacaoLeft}>

              <Icon
                name={
                  item.type === 'positive'
                  ? 'check-circle'
                  : 'close-circle'
                }
                size={22}
                color={
                  item.type === 'positive'
                  ? '#31C451'
                  : '#FF3B30'
                }
              />

              <Text style={styles.anotacaoTexto}>
                {item.text}
              </Text>
            </View>

            <Icon
              name="pencil"
              size={18}
              color="#B0B0B0"
            />

          </View>

        ))}

        <Pressable style={styles.addButton}>

          <Icon
            name="plus-circle"
            size={22}
            color="#B0B0B0"
          />

          <Text style={styles.addText}>
            Adicionar...
          </Text>

        </Pressable>

        <Text style={styles.sectionTitle}>
          Comentários
        </Text>

        {(local.comentarios ?? []).map((item) => (

          <View
            key={item.id}
            style={styles.commentContainer}
          >

            <View style={styles.commentHeader}>

              <View style={styles.avatar} />

              <View>

                <View style={styles.commentTop}>

                  <Text style={styles.commentUser}>
                    {item.usuario}
                  </Text>

                  <Text style={styles.commentDate}>
                    {item.data}
                  </Text>

                </View>

                <Text style={styles.commentText}>
                  {item.comentario}
                </Text>

              </View>

            </View>

          </View>

        ))}

      </ScrollView>

      <Pressable style={styles.fab}>

        <Icon
          name="message-text-outline"
          size={28}
          color="#FFF"
        />

      </Pressable>

      <View style={styles.bottomBar}>

        <Icon
          name="map-marker"
          size={24}
          color="#5DB075"
        />

        <Icon
          name="pencil"
          size={24}
          color="#000"
        />

        <Icon
          name="account"
          size={24}
          color="#000"
        />

      </View>

    </View>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 48,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },

  voltar: {
    color: '#5DB075',
    fontSize: 16,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '700',
    marginRight: 50,
    color: '#000',
  },

  nome: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },

  numero: {
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
    marginBottom: 20,
  },

  imagesList: {
    paddingLeft: 18,
    paddingRight: 8,
  },

  image: {
    width: 165,
    height: 165,
    borderRadius: 22,
    marginRight: 18,
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 16,
    marginHorizontal: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  anotacaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 16,
  },

  anotacaoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  anotacaoTexto: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 4,
  },

  addText: {
    marginLeft: 8,
    color: '#9C9C9C',
  },

  commentContainer: {
    marginHorizontal: 18,
    marginBottom: 18,
  },

  commentHeader: {
    flexDirection: 'row',
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CFCFCF',
    marginRight: 10,
  },

  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentUser: {
    fontWeight: '600',
    color: '#444',
  },

  commentDate: {
    marginLeft: 8,
    fontSize: 11,
    color: '#999',
  },

  commentText: {
    marginTop: 4,
    color: '#B5B5B5',
    fontSize: 13,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 95,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  bottomBar: {
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

});