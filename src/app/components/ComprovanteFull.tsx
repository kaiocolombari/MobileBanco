import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { fetchTransacaoByIdMock } from "../api/fetchTransacoes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

interface Props {
  sucesso?: boolean;
  id?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ComprovanteFull({ sucesso = true, id }: Props) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [transacao, setTransacao] = useState<any>(null);
  const [sucessoState, setSucessoState] = useState(sucesso);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);

      const data = await fetchTransacaoByIdMock(id);
      setTransacao(data);
      if (data) {
        setSucessoState(data.status === 'aprovada');
      }
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!transacao) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Não foi possível carregar a transação.</Text>
      </View>
    );
  }

  const { valor, descricao, id_transacao, status, conta_origem, conta_destino, tipoTransacao } = transacao;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Ionicons
            name={sucessoState ? "checkmark-circle-outline" : "close-circle-outline"}
            size={SCREEN_WIDTH * 0.15}
            color={sucessoState ? "#4CAF50" : "#E53935"}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: sucessoState ? "#4CAF50" : "#E53935", fontSize: SCREEN_WIDTH * 0.05 }]}>
            {sucessoState ? "Transação concluída" : "Falha na transação"}
          </Text>

          <Text style={[styles.amount, { color: theme.text, fontSize: SCREEN_WIDTH * 0.08 }]}>
            R$ {valor.toFixed(2).replace(".", ",")}
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: SCREEN_WIDTH * 0.04 }]}>Destinatário</Text>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color={theme.textSecondary} />
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>{transacao.destinatario?.full_name || "Destinatário"}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color={theme.textSecondary} />
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>Conta {conta_destino?.id_conta}</Text>
            </View>
          </View>

          {/* Remetente */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: SCREEN_WIDTH * 0.04 }]}>Remetente</Text>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={SCREEN_WIDTH * 0.05} color={theme.textSecondary} />
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>{transacao.remetente?.full_name || "Remetente"}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={SCREEN_WIDTH * 0.05} color={theme.textSecondary} />
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>Conta {conta_origem?.id_conta}</Text>
            </View>
          </View>

          {/* Detalhes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: SCREEN_WIDTH * 0.04 }]}>Detalhes da Transferência</Text>

            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textSecondary, fontSize: SCREEN_WIDTH * 0.035 }]}>Descrição:</Text>
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>{descricao}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textSecondary, fontSize: SCREEN_WIDTH * 0.035 }]}>Tipo da transação:</Text>
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>{tipoTransacao}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textSecondary, fontSize: SCREEN_WIDTH * 0.035 }]}>Código da Transação:</Text>
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>#{id_transacao}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textSecondary, fontSize: SCREEN_WIDTH * 0.035 }]}>Status:</Text>
              <Text style={[styles.value, { color: theme.text, fontSize: SCREEN_WIDTH * 0.038 }]}>{status}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.shareButton, { backgroundColor: theme.button }]}>
            <Ionicons name="share-social-outline" size={SCREEN_WIDTH * 0.05} color="white" />
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
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
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    marginRight: 8,
  },
  value: {
    flexShrink: 1,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
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
