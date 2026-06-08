import { StyleSheet } from 'react-native';

/** Padding horizontal único do conteúdo em relação à borda da tela */
export const PAGE_PADDING_HORIZONTAL = 24;

/** Espaço vertical entre blocos (nome, coordenadas, foto, etc.) */
export const SECTION_SPACING = 28;

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF',

  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  voltar: {
    color: "#59B36B",
    fontSize: 20,
    fontWeight: "700",
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
  },

  scrollContent: {
    paddingHorizontal: PAGE_PADDING_HORIZONTAL,
    paddingBottom: 120,
  },

  section: {
    marginBottom: SECTION_SPACING,
  },

  hr: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
    marginBottom: SECTION_SPACING,
  },

  nomeLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  nomeLinhaConteudo: {
    flex: 1,
    minWidth: 0,
  },

  nome: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },

  numero: {
    color: '#555',
    marginTop: 4,
  },

  descricao: {
    color: '#666',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },

  coordenadas: {
    fontSize: 15,
    color: '#555',
    letterSpacing: 0.2,
  },

  semFoto: {
    color: '#999',
    fontSize: 15,
  },

  imagesList: {
    paddingRight: 0,
  },
  voltarButton: {
    position: "absolute",
    left: 32,
    top: 42,
    paddingVertical: 8,
    paddingRight: 16,
  },

  image: {
    width: 165,
    height: 165,
    borderRadius: 22,
    marginRight: 18,
  },

  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  anotacoesSection: {
    padding: 16,
    backgroundColor: 'rgba(245, 245, 247, 0.55)',
    borderRadius: 16,
    marginBottom: SECTION_SPACING,
  },

  anotacoesLista: {
    gap: 10,
  },

  anotacaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    marginBottom: 4,
  },

  anotacaoAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },

  anotacaoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 8,
  },

  anotacaoConteudo: {
    flex: 1,
    marginLeft: 10,
  },

  anotacaoTexto: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  addText: {
    marginLeft: 8,
    color: '#9C9C9C',
  },

  commentContainer: {
    marginBottom: 18,
    paddingVertical: 8,
  },

  semComentarios: {
    color: '#8e8e93',
    fontStyle: 'italic',
    marginBottom: 8,
  },

  commentHeader: {
    flexDirection: 'row',
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CFCFCF',
    marginRight: 10,
  },

  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentUser: {
    fontWeight: '600',
    color: '#444',
  },

  commentDate: {
    marginLeft: 8,
    fontSize: 11,
    color: '#999',
  },

  commentText: {
    marginTop: 4,
    color: '#B5B5B5',
    fontSize: 13,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 95,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  bottomBar: {
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  modalInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  modalBotao: {
    backgroundColor: '#5DB075',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  modalBotaoTexto: {
    color: '#FFF',
    fontWeight: '600',
  },

  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.35)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalReport: {
  width: '82%',
  backgroundColor: '#FFF',
  borderRadius: 24,
  paddingHorizontal: 24,
  paddingVertical: 28,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 10,
},

modalTituloReport: {
  fontSize: 20,
  fontWeight: '700',
  color: '#111',
  textAlign: 'center',
  marginBottom: 18,
},

modalDescricao: {
  fontSize: 16,
  color: '#555',
  textAlign: 'center',
  marginBottom: 28,
},

botoes: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

botaoConfirmar: {
  flex: 1,
  backgroundColor: '#FF5A5F',
  height: 48,
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},

botaoCancelar: {
  flex: 1,
  backgroundColor: '#D1D1D6',
  height: 48,
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
},

textoBotaoConfirmar: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
},

textoBotaoCancelar: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
},

alertaAnotacao: {
  color: '#FF9500',
  fontSize: 12,
  fontWeight: '600',
  marginTop: 2,
},

});