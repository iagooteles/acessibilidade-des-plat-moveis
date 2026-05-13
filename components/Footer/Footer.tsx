import {
  View,
  Pressable,
  type PressableProps,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { styles } from './styles';

type Props = PressableProps & {
  active?: boolean;
  type: '1' | '2' | '3' | '4';
};

type IconName = ComponentProps<typeof Icon>['name'];

export function FooterButton({
  // style,
  active,
  type,
  ...rest
}: Props) {
  const isActive = active ? styles.active : undefined;
  const icon: Record<Props['type'], IconName> = {
    1: 'map-outline',
    2: 'pencil',
    3: 'account',
    4: 'map-marker-multiple',
  };
  const iconColor = active ? 'white' : 'black';

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, isActive]}
      {...rest}
    >
      <Icon name={icon[type]} size={32} color={iconColor} />
    </Pressable>
  );
}

export function Footer({ children }: Readonly<PropsWithChildren>) {
  return (
    <View style={styles.footer}>
      {children}
    </View>
  );
}