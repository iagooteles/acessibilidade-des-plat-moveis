import { StyleSheet } from 'react-native';

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

  nome: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },

  numero: {
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
    marginBottom: 20,
  },

  imagesList: {
    paddingLeft: 18,
    paddingRight: 8,
  },
  voltarButton: {
    position: "absolute",
    left: 32,
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
    marginTop: 26,
    marginBottom: 16,
    marginHorizontal: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  anotacaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 16,
  },

  anotacaoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  anotacaoTexto: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 4,
  },

  addText: {
    marginLeft: 8,
    color: '#9C9C9C',
  },

  commentContainer: {
    marginHorizontal: 18,
    marginBottom: 18,
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