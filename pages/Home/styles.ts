import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: '#5FA777',
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
  width: 220,
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 15,
  zIndex: 10,
  elevation: 10, 
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: '#5FA777',
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
    color: '#5FA777',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5FA777',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 12,
  },

  fabText: {
    color: '#fff',
    fontSize: 30,
  },

  footer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
  },

  icon: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
},

  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
},

  active: {
    backgroundColor: '#5FA777',
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
    backgroundColor: '#5FA777',
  },

  loginMapaBtnPrimarioTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});