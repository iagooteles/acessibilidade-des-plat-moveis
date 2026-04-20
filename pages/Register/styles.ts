import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
  },
  erroGeral: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 14,
  },
  linkWrap: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 8,
  },
  link: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
});
