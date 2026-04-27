import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  // TODO transformar header em componente
  header: {
    height: 120,
    paddingTop: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // texto
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  titleVoltar: {
    color: '#8abe94',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleGhost: {
    color: '#ffffff00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  topic: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 24,
    paddingVertical: 32,
  },
  // main ScrollView componentes
  contentScrollView: {
    padding: 32,
    rowGap: 16,
  },
  contentContainer: {
    rowGap: 8,
    alignItems: 'center',
  },
  // anotações
  anotacoesContainer: { // container geral >
    width: '100%',
    paddingHorizontal: 8,
    rowGap: 24,
  },
  anotacao: { // container geral > container anotação >
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  anotacoesCheckFalse: { // container geral > container anotação > anotações check + desc + edit
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotacoesCheckTrue: { // container geral > container anotação > anotações check + desc + edit
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotacoesCheckAdd: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#cacaca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotacoesDescAdd: {
    color: 'gray',
    fontSize: 20,
    width: '100%',
  },
  anotacoesDesc: { // container geral > container anotação > anotações check + desc + edit
    fontSize: 20,
    width: '100%',
  },
  // propriedades do local
  localNome: {
    fontSize: 30,
  },
  localNum: {
    fontSize: 24,
  },
  localPicScrollView: {
    top: 16,
    padding: 10,
    height: 336,
    columnGap: 40,
    alignSelf: 'flex-start',
  },
  LocalPic: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  //comment
  commentTop: {
    flexDirection: 'row',
    height: 60,
    width: '70%',
    alignSelf: 'flex-start',
    columnGap: 12,
    alignItems: 'center',
  },
  commentTopPfp: {
    backgroundColor: '#9d9da4',
    borderRadius: 100,
    width: 40,
    height: 40,
    flexBasis: 'auto',
    flexGrow: 0,
  },
  commentTopName: {
    flexBasis: 'auto',
    flexGrow: 0,
  },
  commentTopNameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentTopDate: {
    flexBasis: 'auto',
    flexGrow: 0,
  },
  commentTopDateText: {
    color: 'gray',
  },
  commentText: {
    alignSelf: 'center',
    width: '85%',
    height: 'auto',
  },
})