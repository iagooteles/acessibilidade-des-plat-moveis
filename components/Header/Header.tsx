import {
  View,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';

import { styles } from './styles';
import { PropsWithChildren } from 'react';

type HeaderProps = PropsWithChildren &
  PressableProps & {
    type?: '1' | '2' | '3';
    themed?: boolean;
    text?: string;
  };

export function Header({ themed, children, }: HeaderProps) {
  return (
    <View
      style={[
        styles.header,
        themed ? styles.headerTheme : '',]}>
      {children}
    </View>
  );
}

export function HeaderElement({ themed, type, text, ...pressableProps }: HeaderProps) {
  // TÍTULO
  if (type === '2') {
    return (
      <View style={styles.centerContainer}>
        <Text
          style={[
            styles.title,
            themed ? styles.titleTheme : '',]}>
          {text}
        </Text>
      </View>
    );
  }

  // ESQUERDA
  if (type === '1') {
    return (
      <View style={styles.leftContainer}>
        <Pressable {...pressableProps}
          style={styles.button}
        >
          <Text
            style={[
              styles.buttonText,
              themed ? styles.pressableTheme : '',]}>
            {text}
          </Text>
        </Pressable>
      </View>
    );
  }

  // DIREITA
  return (
    <View style={styles.rightContainer}>
      <Pressable
        {...pressableProps}
        style={styles.button}
      >
        <Text
          style={[
            styles.buttonText,
            themed ? styles.pressableTheme : '',]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}