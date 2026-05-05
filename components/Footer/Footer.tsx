import {
  View,
  Pressable,
  type PressableProps,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from './styles';

type Props = PressableProps & {
  active?: boolean;
  type: '1' | '2' | '3';
};

export function FooterButton({
  // style,
  active,
  type,
  ...rest
}: Props) {
  const isActive = active ? styles.active : ''
  const icon = {
    1: 'map-outline',
    2: 'pencil',
    3: 'account',
  };
  const iconColor = active ? 'white' : 'black'

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, isActive]}
      {...rest}
    >
      <Icon name={icon[type]} size={32} color={iconColor} />
    </Pressable>
  )
}

export function Footer({ children }: React.PropsWithChildren) {
  return (
    <View style={styles.footer}>
      {children}
    </View>
  )
}