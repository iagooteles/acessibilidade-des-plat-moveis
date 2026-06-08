import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { styles } from './styles';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: Props) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      style={(state) => {
        const pressed = state.pressed;
        const hovered = 'hovered' in state ? Boolean((state as { hovered?: boolean }).hovered) : false;
        const styleFromProps = typeof style === 'function' ? style(state) : style;

        return [
          styles.base,
          Platform.OS === 'web' && styles.webPointer,
          variant === 'primary'
            ? [styles.primary, { backgroundColor: theme.primary }]
            : [styles.secondary, { borderColor: theme.primary }],
          styleFromProps,
          hovered &&
            !isDisabled &&
            (variant === 'primary'
              ? styles.primaryHovered
              : styles.secondaryHovered),
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.textOnPrimary : theme.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary'
              ? [styles.labelPrimary, { color: theme.textOnPrimary }]
              : [styles.labelSecondary, { color: theme.primary }],
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
