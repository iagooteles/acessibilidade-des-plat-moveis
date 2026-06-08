import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#5db075',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 18,
  },

  headerTheme: {
    backgroundColor: '#5db075',
  },

  leftContainer: {
    position: 'absolute',
    left: 20,
    bottom: 18,
  },

  rightContainer: {
    position: 'absolute',
    right: 20,
    bottom: 18,
  },

  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },

  titleTheme: {
    color: 'white',
  },

  pressableTheme: {
    color: 'white',
  },
});