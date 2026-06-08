import { StyleSheet } from "react-native";

/** Padding horizontal único do conteúdo em relação à borda da tela */
export const PAGE_PADDING_HORIZONTAL = 24;

/** Espaço vertical entre blocos (nome, coordenadas, foto, etc.) */
export const SECTION_SPACING = 32;
export const IMAGE_BOX_SIDE = 128;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    top: 24,
  },
  scrollContent: {
    paddingHorizontal: PAGE_PADDING_HORIZONTAL,
    paddingBottom: 120,
  },

  section: {
    marginBottom: SECTION_SPACING,
  },

  hr: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 4,
    marginBottom: SECTION_SPACING,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    left: 8,
  },
  coordsText: {
    fontSize: 15,
    color: "#666",
  },

  nomeDetalhe: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },

  nomeLinha: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  nomeLinhaConteudo: {
    flex: 1,
    minWidth: 0,
  },

  inputNomeLinha: {
    marginBottom: 0,
  },
  scrollSpacer: {
    height: 24,
  },
  header: {
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  back: {
    color: "#59B36B",
    fontSize: 20,
    fontWeight: "700",
  },

  voltarButton: {
    position: "absolute",
    left: 32,
    top: 42,
    paddingVertical: 8,
    paddingRight: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 28,
    paddingHorizontal: 22,
    height: 52,
    fontSize: 20,
    marginBottom: 25,
  },

  imageRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 0,
    paddingHorizontal: 0,
  },

  image: {
    width: IMAGE_BOX_SIDE,
    height: IMAGE_BOX_SIDE,
    borderRadius: 28,
    marginTop: 8,
  },

  semFoto: {
    color: "#777",
    fontSize: 16,
    alignSelf: "center",
  },

  addImageBox: {
    marginLeft: 12,
    marginTop: 8,
    width: IMAGE_BOX_SIDE,
    height: IMAGE_BOX_SIDE,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },

  anotacoesSection: {
    marginBottom: SECTION_SPACING,
    padding: 16,
    backgroundColor: 'rgba(180, 180, 180, 0.55)',
    borderRadius: 16,
  },

  anotacoesLista: {
    marginLeft: 12,
    gap: 4,
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    gap: 12,
  },

  noteRowConteudo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 8,
  },

  commentCard: {
    paddingVertical: 8,
    marginBottom: 10,
  },

  commentAuthor: {
    fontSize: 13,
    color: "#666",
    fontWeight: "700",
    marginBottom: 4,
  },

  commentBody: {
    color: "#333",
    fontSize: 15,
  },

  semComentarios: {
    color: "#8e8e93",
    fontStyle: "italic",
    marginBottom: 8,
  },

  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  noteText: {
    fontSize: 20,
    color: "#1F1F1F",
  },

  button: {
    alignSelf: "center",
    backgroundColor: "#59B36B",
    width: "100%",
    maxWidth: 320,
    height: 58,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  actionsRow: {
    flexDirection: "row",
    alignSelf: "center",
    columnGap: 12,
    marginBottom: 28,
    marginTop: 8,
    width: "100%",
    maxWidth: 320,
  },

  actionButton: {
    flex: 1,
    height: 58,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonSecondary: {
    backgroundColor: "#F2F2F2",
  },

  buttonSecondaryText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "700",
  },

  buttonDanger: {
    backgroundColor: "#E04F4F",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.32)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "88%",
    height: "74%",
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 22,
  },

  modal2: {
    width: "88%",
    marginBottom: 50,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 22,
  },


  search: {
    backgroundColor: "#F3F3F3",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 18,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  optionText: {
    fontSize: 21,
    width: "65%",
    color: "#111",
  },

  iconRow: {
    flexDirection: "row",
    gap: 14,
  },

  other: {
    fontSize: 20,
    color: "#999",
    marginBottom: 20,
  },

  okButton: {
    alignSelf: "center",
    backgroundColor: "#59B36B",
    width: 130,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  okText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
});