import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 140,
  },

  avatarWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#5FA777',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },

  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#222',
  },

  levelCard: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 8,
  },

  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  levelXp: {
    fontSize: 14,
    color: '#666',
  },

  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#DDD',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#5FA777',
    borderRadius: 999,
  },

  completeText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5FA777',
  },

  label: {
    marginTop: 22,
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#444',
    alignSelf: 'flex-start',
    width: '100%',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F8F8F8',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },

  bioInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  infoText: {
    width: '100%',
    fontSize: 16,
    color: '#333',
  },

  meusLocaisBtn: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#5FA777',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  meusLocaisText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 40,
    marginBottom: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeToggle: {
    marginTop: 18,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeToggleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  
});