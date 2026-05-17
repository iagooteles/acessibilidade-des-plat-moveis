import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Animated,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screenSlideAnimation,fadeInAnimation,
} from '../../components/Animations/animations';

import { styles } from './styles'
import { useState, useEffect, useRef } from 'react';

export function Detalhes({ onVoltar }: { onVoltar: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {screenSlideAnimation(translateX,
    'right').start();fadeInAnimation(opacity).start();}, []);

  return (
    <Animated.View style={{flex: 1,opacity,transform: [{ translateX }],}}>
      <View style={styles.header}>
        <Pressable style={styles.voltarButton} onPress={onVoltar}>
          <Text style={styles.titleVoltar}>Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Local</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentScrollView}>
        {/* nome do local (dummy) */}
        <View style={styles.contentContainer}>
          <Text style={styles.localNome}>Nome do Local</Text>
          <Text style={styles.localNum}>1234</Text>
        </View>

        {/* fotos (dummy) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.localPicScrollView}>
          <Image source={require('../../assets/predio_placeholder.jpg')} style={styles.LocalPic} />
          <Image source={require('../../assets/predio_placeholder.jpg')} style={styles.LocalPic} />
        </ScrollView>

        <View style={styles.contentContainer}>
          {/* anotações (dummy) */}
          <Text style={styles.topic}>Anotações por usuários</Text>
          <View style={styles.anotacoesContainer}>
            <View style={styles.anotacao}>
              <View style={styles.anotacoesCheckFalse} >
                <Icon name={'close'} size={20} color={'white'} />
              </View>
              <Text style={styles.anotacoesDesc}>Não possui rampa de acesso</Text>
              <Icon name={'pencil'} size={20} color={'gray'} />
            </View>

            <View style={styles.anotacao}>
              <View style={styles.anotacoesCheckTrue} >
                <Icon name={'check'} size={20} color={'white'} />
              </View>
              <Text style={styles.anotacoesDesc}>Possui piso tátil</Text>
              <Icon name={'pencil'} size={20} color={'gray'} />
            </View>

            <View style={styles.anotacao}>
              <View style={styles.anotacoesCheckAdd} >
                <Icon name={'plus'} size={24} color={'#515151'} />
              </View>
              <Text style={styles.anotacoesDescAdd}>Adicionar...</Text>
              <Icon name={'pencil'} size={20} color={'gray'} />
            </View>
          </View>
        </View>
        {/* comentários */}
        <Text style={styles.topic}>Comentários</Text>
        <View>
          <Comment
            name='Ana C.'
            date='19/04/26'
            comment='Comentário comentário comentário comentário comentário comentário comentário '
          />
          <Comment
            name='Beto G.'
            date='23/04/26'
            comment='Comentário comentário comentário comentário comentário comentário comentário comentário comentário '
          />
          <Comment
            name='Andre T.'
            date='22/04/26'
            comment='Comentário comentário comentário comentário comentário '
          />
        </View>
      </ScrollView>
    </Animated.View>
  )
}

interface CommentProps {
  name: string;
  // pfp: Image;
  date: string; //
  comment: string;
};

function Comment({
  name,
  date,
  comment,
}: Readonly<CommentProps>) {
  return (
    <View>
      <View style={styles.commentTop}>
        <View style={styles.commentTopPfp}>
        </View>
        <View style={styles.commentTopName}>
          <Text style={styles.commentTopNameText}>{name}</Text>
        </View>
        <View style={styles.commentTopDate}>
          <Text style={styles.commentTopDateText}>{date}</Text>
        </View>
      </View>
      <View style={styles.commentText}>
        <Text style={{ fontSize: 16 }}>{comment}</Text>
      </View>
    </View>
  )
}