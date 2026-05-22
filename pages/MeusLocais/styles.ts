import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backText: {
    fontSize: 16,
    color: '#5FA777',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  selectText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5FA777',
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: '#F3F3F3',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardSelecionado: {
    borderWidth: 2,
    borderColor: '#5FA777',
  },

  nome: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtn: {
    marginHorizontal: 20,
    marginBottom: 16,

    backgroundColor: '#D62828',

    height: 48,

    borderRadius: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});