import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface PixComponentValeuProps {
  nome: string;
  chavePix: string;
  onContinuar: () => void;
  initialValue?: number;
}

export const PixComponentValor: React.FC<PixComponentValeuProps> = ({
  nome,
  chavePix,
  onContinuar,
  initialValue,
}) => {
  const [valor, setValor] = useState(initialValue ? (initialValue / 100).toFixed(2).replace(".", ",") : "0,00");
  const [editando, setEditando] = useState(false);

  const formatarValor = (text: string) => {
    let numeros = text.replace(/\D/g, "");

    if (numeros === "") {
      return "0,00";
    }

    let centavos = (parseInt(numeros, 10) / 100).toFixed(2);

    return centavos.replace(".", ",");
  };

  const handleChange = (text: string) => {
    setValor(formatarValor(text));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.formArea}>
        <Text style={styles.subText}>Transferir para</Text>
        <Text style={styles.nomeTransferir}>{nome}</Text>

        <View style={styles.valorContainer}>
          <Text style={styles.moeda}>R$</Text>

          {editando ? (
            <TextInput
              style={styles.valorInput}
              value={valor}
              onChangeText={handleChange}
              keyboardType="numeric"
              autoFocus
              onBlur={() => setEditando(false)}
            />
          ) : (
            <Text style={styles.valorPix}>{valor}</Text>
          )}

          <TouchableOpacity onPress={() => setEditando(true)}>
            <Image
              source={require("../../assets/pincel.png")}
              style={styles.pencilImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.chaveContainer}>
          <Text style={styles.subText}>Chave Pix</Text>
          <Text style={styles.chaveTexto}>{chavePix}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContinuar} onPress={onContinuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  formArea: { marginTop: 10 },
  subText: { fontSize: 14, color: "#666", marginBottom: 6 },
  nomeTransferir: { fontSize: 18, fontWeight: "500", color: "#222", marginBottom: 25 },
  valorContainer: { flexDirection: "row", alignItems: "center" },
  moeda: { fontSize: 22, fontWeight: "600", color: "#333" },
  valorPix: { fontSize: 28, fontWeight: "600", color: "#333", marginLeft: 8 },
  valorInput: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    outlineColor: "transparent",
    borderBottomWidth: 1,
    borderColor: "#1B98E0",
    minWidth: 100,
  },
  pencilImage: { width: 22, height: 22, marginLeft: 10, tintColor: "#666" },
  chaveContainer: { marginTop: 10 },
  chaveTexto: { fontSize: 16, color: "#222", fontWeight: "500" },
  buttonContinuar: {
    width: "100%",
    height: 50,
    backgroundColor: "#1B98E0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
