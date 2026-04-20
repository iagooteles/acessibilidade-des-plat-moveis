import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  webPointer: {
    cursor: 'pointer',
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  primaryHovered: {
    backgroundColor: '#1d4ed8',
  },
  secondaryHovered: {
    backgroundColor: '#dbeafe',
    borderColor: '#1d4ed8',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelPrimary: {
    color: '#fff',
  },
  labelSecondary: {
    color: '#2563eb',
  },
});
