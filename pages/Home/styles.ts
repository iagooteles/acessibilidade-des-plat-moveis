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
  },

  searchInput: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    zIndex: 1,
  },

  mapImage: {
    width: '100%',
    height: '100%',
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
});