import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  topBarInner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  voltarPressable: {
    paddingVertical: 8,
    alignSelf: 'baseline',
  },
  scrollArea: {
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
  voltarText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
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
