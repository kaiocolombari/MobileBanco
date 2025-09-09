import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { fetchTransacaoByIdMock } from "../api/fetchTransacoes";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

interface Props {
  sucesso?: boolean;
  id?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ComprovanteFull({ sucesso = true, id }: Props) {
  const [loading, setLoading] = useState(true);
  const [transacao, setTransacao] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);

      const data = await fetchTransacaoByIdMock(id);
      setTransacao(data);
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1B98E0" />
      </View>
    );
  }

  if (!transacao) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar a transação.</Text>
      </View>
    );
  }

  const { valor, descricao, id_transacao, status, conta_origem, conta_destino } = transacao;

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

          <Text style={[styles.amount, { fontSize: SCREEN_WIDTH * 0.08 }]}>
            R$ {valor.toFixed(2).replace(".", ",")}
          </Text>

          {/* Destinatário */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Destinatário</Text>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Destinatário Nome</Text> {/* Mock value */}
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Conta {conta_destino?.id_conta}</Text>
            </View>
          </View>

          {/* Remetente */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Remetente</Text>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Remetente Nome</Text> {/* Mock value */}
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color="#555" />
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>Conta {conta_origem?.id_conta}</Text>
            </View>
          </View>

          {/* Detalhes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: SCREEN_WIDTH * 0.04 }]}>Detalhes da Transferência</Text>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Descrição</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>{descricao}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Código da Transação</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>#{id_transacao}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: SCREEN_WIDTH * 0.035 }]}>Status</Text>
              <Text style={[styles.value, { fontSize: SCREEN_WIDTH * 0.038 }]}>{status}</Text>
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
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  amount: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#777",
    marginRight: 8,
  },
  value: {
    color: "#333",
    flexShrink: 1,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B98E0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  shareText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});
