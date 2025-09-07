import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  sucesso?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ComprovanteFull({ sucesso = true }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Ionicons
            name={sucesso ? "checkmark-circle-outline" : "close-circle-outline"}
            size={SCREEN_WIDTH * 0.15}
            color={sucesso ? "#4CAF50" : "#E53935"}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: sucesso ? "#4CAF50" : "#E53935", fontSize: SCREEN_WIDTH * 0.05 }]}>
            {sucesso ? "Transação concluída" : "Falha na transação"}
          </Text>

          <Text style={[styles.amount, { fontSize: SCREEN_WIDTH * 0.08 }]}>R$ 1.250,00</Text>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Destinatário</Text>

            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>João Silva</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Agência 9876 | Conta 12345-6</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Remetente</Text>

            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Faricia Autista</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Agência 1234 | Conta 56789-0</Text>
            </View>
          </View>



          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Detalhes da Transferência</Text>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Data e Hora</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>06/09/2025 - 14:30</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Código da Transação</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>#TX123456789BR</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Banco de Origem</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Banco Viper</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Banco Destino</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Banco Digital 360</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={SCREEN_WIDTH * 0.05} color="#FFF" />
            <Text style={[styles.shareText, { fontSize: SCREEN_WIDTH * 0.038 }]}>Compartilhar Comprovante</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  icon: {
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  amount: {
    fontWeight: "700",
    color: "#1B98E0",
    textAlign: "center",
    marginVertical: 16,
  },
  section: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  label: {
    flex: 1,
    color: "#777",
  },
  value: {
    flex: 2,
    color: "#222",
    fontWeight: "500",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B98E0",
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
    marginTop: 10,
  },
  shareText: {
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
});
