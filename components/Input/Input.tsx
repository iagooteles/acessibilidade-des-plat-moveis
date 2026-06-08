import { useId } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { styles } from './styles';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, accessibilityLabel, ...rest }: Props) {
  const genId = useId();
  const inputId = id ?? `input-${genId}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <View style={styles.wrapper}>
      <Text
        accessibilityRole="header"
        nativeID={`${inputId}-label`}
        style={styles.label}
      >
        {label}
      </Text>
      <TextInput
        nativeID={inputId}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={rest.placeholder}
        accessibilityInvalid={!!error}
        accessibilityDescribedBy={errorId}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#9ca3af"
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
