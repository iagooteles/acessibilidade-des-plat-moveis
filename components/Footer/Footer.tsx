import {
  View,
  Pressable,
  type PressableProps,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { styles } from './styles';
import { useTheme } from '../ThemeProvider';

type Props = PressableProps & {
  active?: boolean;
  type: '1' | '2' | '3' | '4';
};

type IconName = ComponentProps<typeof Icon>['name'];

export function FooterButton({
  active,
  type,
  style,
  ...rest
}: Props) {
  const { theme, isDark, highContrast } = useTheme();
  const activeStyle = active ? { backgroundColor: theme.primary } : undefined;
  const inactiveStyle = !active
    ? {
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.muted,
      }
    : undefined;
  const icon: Record<Props['type'], IconName> = {
    1: 'map-outline',
    2: 'pencil',
    3: 'account',
    4: 'map-marker-multiple',
  };
  const iconColor = active
    ? theme.textOnPrimary
    : highContrast
    ? theme.text
    : isDark
    ? theme.primary
    : '#000000';

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, activeStyle, inactiveStyle, style]}
      {...rest}
    >
      <Icon name={icon[type]} size={28} color={iconColor} />
    </Pressable>
  );
}

export function Footer({ children }: Readonly<PropsWithChildren>) {
  const { theme } = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: theme.background }]}> 
      {children}
    </View>
  );
}