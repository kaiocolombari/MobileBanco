import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ImageButton from '../components/ImageButton';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import Rotas from '../../types/types.route';
import { router } from 'expo-router';
import { fetchTransacoesMock, Transacao } from '../api/fetchTransacoes';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get("window");

export default function pixScreen() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      const data = await fetchTransacoesMock();

      const sortedData = data.sort((a, b) => {
        const [diaA, mesA, anoA] = a.date.split('/');
        const [horaA, minA] = a.hora.split(':');

        const dateA = new Date(+anoA, +mesA - 1, +diaA, +horaA, +minA);

        const [diaB, mesB, anoB] = b.date.split('/');
        const [horaB, minB] = b.hora.split(':');

        const dateB = new Date(+anoB, +mesB - 1, +diaB, +horaB, +minB);

        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(sortedData);
      setLoading(false);
    }
    loadTransactions();
  }, []);

  const renderTransaction = ({ item }: { item: Transacao }) => {
    const isReceived = item.tipoTransacao === 'recebido';
    return (
      <View style={[styles.transactionItem, { backgroundColor: theme.card }]}>
        <View style={[styles.iconContainer, { backgroundColor: isReceived ? '#DFF7E1' : '#FDDCDC' }]}>
          <MaterialIcons
            name={isReceived ? "arrow-downward" : "arrow-upward"}
            size={width / 18}
            color={isReceived ? 'green' : 'red'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionDesc, { color: theme.text }]}>{item.descricao}</Text>
          <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Data: {item.date}</Text>
          <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Horário: {item.hora}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isReceived ? 'green' : 'red' }]}>
          {isReceived ? `+ R$${item.valor.toFixed(2)}` : `- R$${item.valor.toFixed(2)}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => { router.back() }}>
          <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={[styles.headerText, { color: theme.text }]}>Área Pix</Text>
      </View>
      <View style={styles.iconesPix}>
        <ImageButton image={require("../../assets/trans3.png")} label="Transferir" onPress={() => { router.push(Rotas.TRANSPIX) }} />
        <ImageButton image={require("../../assets/copiaCola.png")} label="Pix Copia e Cola" onPress={() => { }} />
        <ImageButton image={require("../../assets/Qr_Code.png")} label="Ler QR Code" onPress={() => { }} />
      </View>
      <View style={[styles.line, { backgroundColor: theme.imageButtonCircle }]}></View>

      <View style={styles.transactionsContainer}>
        {!loading && transactions.length === 0 ? (
          <Text style={[styles.noTransactionsText, { color: theme.text }]}>Nenhuma transação encontrada.</Text>
        ) : (
          <Text style={[styles.transactionsHeader, { color: theme.text }]}>Histórico de Transações</Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id_transacao.toString()}
            renderItem={renderTransaction}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 16,
  },
  iconBack: {
    marginBottom: 12,
    marginLeft: 2
  },
  headerText: {
    fontSize: width / 15,
    fontFamily: 'Roboto_400Regular',
    padding: 16
  },
    iconesPix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  line: {
    width: "100%",
    height: 5,
    marginBottom: 10,
    marginTop: height * 0.10
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionsHeader: {
    fontSize: width / 20,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: width / 10,
    height: width / 10,
    borderRadius: (width / 10) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: width / 25,
    fontFamily: 'Roboto_400Regular',
    marginTop: 20
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionDesc: {
    fontSize: width / 25,
    fontFamily: 'Roboto_400Regular',
  },
  transactionDate: {
    fontSize: width / 32,
  },
  transactionAmount: {
    fontSize: width / 22,
    fontWeight: 'bold',
  },
});
