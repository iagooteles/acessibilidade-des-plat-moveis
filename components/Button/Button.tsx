import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
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
          variant === 'primary' ? styles.primary : styles.secondary,
          styleFromProps,
          hovered &&
            !isDisabled &&
            (variant === 'primary' ? styles.primaryHovered : styles.secondaryHovered),
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
