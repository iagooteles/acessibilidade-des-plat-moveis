import {
  View,
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
} from 'react-native';

import { styles } from './styles';
import { useTheme } from '../ThemeProvider';
import { PropsWithChildren } from 'react';

type HeaderProps = PropsWithChildren &
  PressableProps & {
    type?: '1' | '2' | '3';
    themed?: boolean;
    text?: string;
    textStyle?: TextStyle;
  };

export function Header({
  themed,
  children,
}: HeaderProps) {
  const { theme, isDark } = useTheme();
  const backgroundColor = themed
    ? isDark
      ? theme.card
      : theme.primary
    : theme.background;

  return (
    <View
      style={[
        styles.header,
        themed && {
          backgroundColor,
          borderBottomWidth: 1,
          borderBottomColor: isDark
            ? '#1f2937'
            : '#4d9266',
        },
      ]}
    >
      {children}
    </View>
  );
}

export function HeaderElement({
  themed,
  type,
  text,
  textStyle,
  ...pressableProps
}: HeaderProps) {
  const { theme, isDark } = useTheme();
  const textColor = themed
    ? isDark
      ? theme.text
      : theme.textOnPrimary
    : theme.text;

  // TÍTULO
  if (type === '2') {
    return (
      <View style={styles.centerContainer}>
        <Text
          style={[
            styles.title,
            themed && { color: textColor },
            textStyle,
          ]}
        >
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
              themed && { color: textColor },
              textStyle,
            ]}
          >
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