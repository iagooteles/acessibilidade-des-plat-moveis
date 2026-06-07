import { useId } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { styles } from './styles';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, accessibilityLabel, ...rest }: Props) {
  const genId = useId();
  const inputId = id ?? `input-${genId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text
        accessibilityRole="header"
        nativeID={`${inputId}-label`}
        style={[styles.label, { color: theme.text }]}
      >
        {label}
      </Text>
      <TextInput
        nativeID={inputId}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={rest.placeholder}
        accessibilityInvalid={!!error}
        accessibilityDescribedBy={errorId}
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: isDark ? '#334155' : '#d1d5db',
          },
          error && styles.inputError,
        ]}
        placeholderTextColor={theme.muted}
        {...rest}
      />
      {error ? (
        <Text
          nativeID={errorId}
          accessibilityLiveRegion="polite"
          style={styles.error}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
