import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    height: 100,
    justifyContent: 'flex-end',
  },
  headerTheme: {
    backgroundColor: '#5db075',
  },

  pressableTextView: {
    width: '85%',
    position: 'absolute',
    alignSelf:'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  // texto
  title: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: '500',
    bottom: 10,
    color: '#101611',
  },
  titleTheme: {
    color: 'white',
  },

  pressableRight: {
    position: 'absolute',
    bottom: 22,
    right: 0,
    fontSize: 20,
    fontWeight: '500',
    color: '#8abe94',
  },
  pressableLeft: {
    bottom: 22,
    left: 0,
    fontSize: 20,
    fontWeight: '500',
    color: '#8abe94',
  },
  pressableTheme: {
    color: 'white',
  },
})