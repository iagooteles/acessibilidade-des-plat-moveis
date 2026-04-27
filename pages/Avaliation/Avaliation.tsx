import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
  
} from "react-native";
import {styles} from './styles';
import { Ionicons } from "@expo/vector-icons";

type AvaliationProps = {
  onVoltar?: () => void;
};

export default function AddLocationPage({ onVoltar }: Readonly<AvaliationProps>) {
  const [modalVisible, setModalVisible] = useState(false);

  const [annotations, setAnnotations] = useState([
    { text: "Possui rampa de acesso", type: "positive" },
    { text: "Não possui piso tátil", type: "negative" },
  ]);

  const options = [
    "Rampa de acesso",
    "Piso tátil",
    "Estacionamento prioritário",
    "Sinalização correta",
    "Trajetória adequada",
    "Exemplo de outro",
  ];

  const addAnnotation = (text: string, positive: boolean) => {
    setAnnotations((prev) => [
      ...prev,
      {
        text: positive ? `Possui ${text}` : `Não possui ${text}`,
        type: positive ? "positive" : "negative",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onVoltar ? (
          <TouchableOpacity onPress={onVoltar} accessibilityRole="button" accessibilityLabel="Voltar">
            <Text style={styles.back}>Voltar</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.back}>Voltar</Text>
        )}
        <Text style={styles.title}>Adicionar</Text>
      </View>

      {/* Input */}
      <TextInput
        style={styles.input}
        value="Prédio Exemplo 3381"
        editable={false}
      />

      {/* Images */}
      <View style={styles.imageRow}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500",
          }}
          style={styles.image}
        />

        <TouchableOpacity style={styles.addImageBox}>
          <Ionicons name="add" size={38} color="#AFAFAF" />
        </TouchableOpacity>
      </View>

      {/* Notes */}
      <Text style={styles.section}>Anotações</Text>
          
      <ScrollView>
      {annotations.map((item, index) => (
        <View key={index} style={styles.noteRow}>
          <Ionicons
            name={item.type === "positive" ? "checkmark-circle" : "close-circle"}
            size={24}
            color={item.type === "positive" ? "#35C759" : "#FF3B30"}
          />
          <Text style={styles.noteText}>{item.text}</Text>
        </View>
      ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.noteRow}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#BDBDBD" />
        <Text style={[styles.noteText, { color: "#BDBDBD" }]}>
          Adicionar...
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TextInput placeholder="Buscar" style={styles.search} />

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((item, index) => (
                <View key={index} style={styles.optionRow}>
                  <Text style={styles.optionText}>{item}</Text>

                  <View style={styles.iconRow}>
                    <TouchableOpacity
                      onPress={() => addAnnotation(item, true)}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={28}
                        color="#35C759"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => addAnnotation(item, false)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={26}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={{ marginTop: 12 }}>
                <Text style={styles.other}>Outro: Digite aqui...</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
