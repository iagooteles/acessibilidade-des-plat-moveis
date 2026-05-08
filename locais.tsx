import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function Locais() {
  // Estados
  const [nome, setNome] = useState("");
  const [locais, setLocais] = useState<string[]>([]);
  const [editando, setEditando] = useState<number | null>(null);

  // Adicionar ou editar local
  function salvarLocal() {
    if (nome.trim() === "") return;

    // Editar
    if (editando !== null) {
      const listaAtualizada = [...locais];
      listaAtualizada[editando] = nome;

      setLocais(listaAtualizada);
      setEditando(null);
    } else {
      // Adicionar
      setLocais([...locais, nome]);
    }

    setNome("");
  }

  // Selecionar local para edição
  function editarLocal(index: number) {
    setNome(locais[index]);
    setEditando(index);
  }

  // Excluir local
  function excluirLocal(index: number) {
    const novaLista = locais.filter((_, i) => i !== index);
    setLocais(novaLista);
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.titulo}>Gerenciamento de Locais</Text>

      {/* Campo de texto */}
      <TextInput
        placeholder="Digite o nome do local"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      {/* Botão adicionar/editar */}
      <TouchableOpacity style={styles.botao} onPress={salvarLocal}>
        <Text style={styles.textoBotao}>
          {editando !== null ? "Salvar Edição" : "Adicionar Local"}
        </Text>
      </TouchableOpacity>

      {/* Lista de locais */}
      <FlatList
        data={locais}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.nomeLocal}>{item}</Text>

            <View style={styles.botoesContainer}>
              {/* Botão editar */}
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => editarLocal(index)}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </TouchableOpacity>

              {/* Botão excluir */}
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirLocal(index)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },

  nomeLocal: {
    fontSize: 18,
    marginBottom: 10,
  },

  botoesContainer: {
    flexDirection: "row",
    gap: 10,
  },

  botaoEditar: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },

  botaoExcluir: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 8,
  },
});

