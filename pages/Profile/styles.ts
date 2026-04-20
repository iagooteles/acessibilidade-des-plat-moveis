import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
  backgroundColor: '#5FA777',
  height: 110,
  paddingTop: 20,
  paddingHorizontal: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

  headerText: {
    color: '#fff',
    fontSize: 16,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  content: {
    alignItems: 'center',
    padding: 20,
  },

  avatarWrapper: {
  marginTop: -40,
  marginBottom: 10,
},

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  label: {
    marginTop: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },

  input: {
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 8,
  },

  saveBtn: {
    backgroundColor: '#5FA777',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },

  saveText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },

  active: {
    backgroundColor: '#5FA777',
  },

  logoutBtn: {
  marginTop: 30,
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

logoutText: {
  color: 'red',
  fontWeight: 'bold',
},

});