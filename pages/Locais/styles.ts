import { StyleSheet } from 'react-native';

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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
  },
  voltar: {
    color: '#59B36B',
    fontSize: 20,
    fontWeight: '700',
  },
  voltarButton: {
    position: 'absolute',
    left: 32,
    top: 42,
    paddingVertical: 8,
    paddingRight: 16,
  },
  lista: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    rowGap: 16,
  },
  listaVazia: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 24,
    padding: 14,
    columnGap: 14,
  },
  foto: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
  },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardConteudo: {
    flex: 1,
  },
  nomeLocal: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  coordenadas: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  anotacoesContainer: {
    rowGap: 8,
  },
  anotacao: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  anotacaoTexto: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  semAnotacoes: {
    fontSize: 15,
    color: '#888',
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  botaoTentarNovamente: {
    backgroundColor: '#59B36B',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  botaoTentarNovamenteTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
