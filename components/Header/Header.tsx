import {
  View,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
import { styles } from './styles';
import { PropsWithChildren } from 'react';

type HeaderProps = PropsWithChildren & PressableProps & {
  type?: '1' | '2' | '3',
  themed?: boolean,
  text?: String,
}

export function Header({
  themed,
  children,
}: HeaderProps) {
  return (
    <View style={[styles.header, themed ? styles.headerTheme : null]}>
      {children}
    </View>
  )
}

export function HeaderElement({
  themed,
  type,
  text,
  ...pressableProps
}: HeaderProps) {

  if (type == '2') {
    return (<Text style={themed ? [styles.title, styles.titleTheme] : styles.title}>{text}</Text>)
  }

  return (
      <Pressable {...pressableProps} style={styles.pressableTextView}>
        <Text style={[
          type == '1' ? styles.pressableLeft : styles.pressableRight,
          themed ? styles.pressableTheme : null]}
        >
          {text}
        </Text>
      </Pressable>
  )
}