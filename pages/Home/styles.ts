import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: '#5db075',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerSide: {
    flex: 1,
  },

  headerSideRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  headerTitleWrap: {
    flexShrink: 0,
  },

  filterText: {
    color: '#E6F4EA',
    fontSize: 16,
  },
  filtroCard: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    shadowRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },

  searchRow: {
    position: 'absolute',
    top: 20,
    left: '15%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 40,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
  },

  searchSpinner: {
    minWidth: 72,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
  },

  searchButton: {
    backgroundColor: '#5db075',
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
    borderRadius: 22,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  mapLeaflet: {
    flex: 1,
    width: '100%',
    zIndex: 0,
  },

  marcacaoBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 92,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    zIndex: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  marcacaoBannerText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },

  marcacaoCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5db075',
  },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#5db075',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 12,
  },

  fabRanking: {
    position: 'absolute',
    bottom: 28,
    left: 28,
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#5db075',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 12,
  },

  loginMapaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loginMapaCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    zIndex: 1,
  },

  loginMapaTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  loginMapaTexto: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 22,
  },

  loginMapaBotoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  loginMapaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },

  loginMapaBtnSecundario: {
    backgroundColor: '#eee',
  },

  loginMapaBtnSecundarioTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  loginMapaBtnPrimario: {
    backgroundColor: '#5db075',
  },

  loginMapaBtnPrimarioTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  filtroTitulo: {
  fontSize: 17,
  fontWeight: '700',
  marginBottom: 16,
  color: '#222',
},

filtrosContainer: {
  gap: 10,
},

filtroChip: {
  height: 48,
  borderRadius: 14,
  backgroundColor: '#f5f5f5',
  borderWidth: 1,
  borderColor: '#e5e5e5',
  justifyContent: 'center',
  paddingHorizontal: 14,
},

filtroChipAtivo: {
  backgroundColor: '#5db075',
  borderColor: '#5db075',
},

filtroChipConteudo: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

filtroChipTexto: {
  color: '#444',
  fontWeight: '600',
  fontSize: 14,
},

filtroChipTextoAtivo: {
  color: '#fff',
},
overlayFiltro: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5,
},
localPopup: {
  position: 'absolute',
  left: 24,
  right: 24,
  bottom: 96,
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 18,
  elevation: 6,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },
},

localPopupTitulo: {
  fontSize: 16,
  fontWeight: '700',
  color: '#222',
  marginBottom: 8,
},

localPopupAnotacoes: {
  gap: 4,
  marginBottom: 16,
},

localPopupAnotacao: {
  fontSize: 14,
  color: '#333',
},

localPopupButton: {
  alignSelf: 'center',
  backgroundColor: '#5db075',
  paddingHorizontal: 28,
  paddingVertical: 12,
  borderRadius: 24,
},

localPopupButtonText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '700',
},
});