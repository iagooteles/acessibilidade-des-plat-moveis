import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  containerAtivo: {
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  contador: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 16,
    textAlign: 'center',
  },
  contadorAtivo: {
    color: '#2E7D32',
  },
});
