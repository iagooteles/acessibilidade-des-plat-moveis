import { StyleSheet } from 'react-native';

export const PAGE_PADDING_HORIZONTAL = 24;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  voltarButton: {
    position: 'absolute',
    left: 32,
    top: 42,
    paddingVertical: 8,
    paddingRight: 16,
  },
  voltar: {
    color: '#59B36B',
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: PAGE_PADDING_HORIZONTAL,
    marginBottom: 16,
  },
  lista: {
    paddingHorizontal: PAGE_PADDING_HORIZONTAL,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  cardTop3: {
    backgroundColor: '#F0F8F2',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  posicaoWrap: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posicaoTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
  },
  foto: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  fotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardConteudo: {
    flex: 1,
    minWidth: 0,
  },
  nomeLocal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  upvotesLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upvotesTexto: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  erro: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#5db075',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
