import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  type PressableProps,
  Animated,
} from 'react-native';

import { styles } from './styles';
import { useScalePress } from '../Animations/animations';

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

  const scaleAnim = useScalePress();

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={scaleAnim.animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          disabled: !!isDisabled,
          busy: !!loading,
        }}

        disabled={isDisabled}

        onPressIn={scaleAnim.onPressIn}
        onPressOut={scaleAnim.onPressOut}

        style={(state) => {
          const pressed = state.pressed;

          const hovered =
            'hovered' in state
              ? Boolean((state as { hovered?: boolean }).hovered)
              : false;

          const styleFromProps =
            typeof style === 'function'
              ? style(state)
              : style;

          return [
            styles.base,

            Platform.OS === 'web' &&
              styles.webPointer,

            variant === 'primary'
              ? styles.primary
              : styles.secondary,

            styleFromProps,

            hovered &&
              !isDisabled &&
              (
                variant === 'primary'
                  ? styles.primaryHovered
                  : styles.secondaryHovered
              ),

            pressed &&
              !isDisabled &&
              styles.pressed,

            isDisabled &&
              styles.disabled,
          ];
        }}

        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'primary'
                ? '#fff'
                : '#2563eb'
            }
          />
        ) : (
          <Text
            style={[
              styles.label,

              variant === 'primary'
                ? styles.labelPrimary
                : styles.labelSecondary,
            ]}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}