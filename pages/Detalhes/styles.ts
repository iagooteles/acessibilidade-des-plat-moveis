import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  address: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },

  section: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  commentCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  user: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  comment: {
    color: '#444',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#43A047',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fabText: {
    color: '#fff',
    fontSize: 24,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  sendButton: {
    backgroundColor: '#43A047',
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});