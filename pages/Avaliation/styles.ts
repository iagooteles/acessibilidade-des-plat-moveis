import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 15,
  },
  keyboardWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  coordsText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  scrollSpacer: {
    height: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  back: {
    color: "#62C17A",
    fontSize: 20,
    marginRight: 35,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
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
    marginBottom: 35,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 28,
  },

  addImageBox: {
    width: 110,
    height: 110,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
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