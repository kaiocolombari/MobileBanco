import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ImageButton from '../components/ImageButton';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import Rotas from '../../types/types.route';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTransacoes, Transacao } from '../api/fetchTransacoes';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function pixScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await fetchTransacoes(token);

      setTransactions(data);
      setLoading(false);
    }
    loadTransactions();
  }, []);

  const renderTransaction = ({ item }: { item: Transacao }) => {
    const isReceived = item.tipoTransacao === 'recebido';
    const isBoleto = item.tipoTransacao === 'boleto';

    const getStatusText = () => {
      if (isReceived) return "Recebido";
      if (isBoleto) return "Boleto Pago";
      return "Enviado";
    };

    const getIconName = () => {
      if (isReceived) return "arrow-downward";
      if (isBoleto) return "receipt";
      return "arrow-upward";
    };

    const getIconColor = () => {
      if (isReceived) return 'green';
      if (isBoleto) return 'blue';
      return 'red';
    };

    const getBackgroundColor = () => {
      if (isReceived) return '#DFF7E1';
      if (isBoleto) return '#E0F2FE';
      return '#FDDCDC';
    };

    const getAmountColor = () => {
      if (isReceived) return 'green';
      return 'red';
    };

    const getAmountSign = () => {
      return isReceived ? '+' : '-';
    };

    return (
      <TouchableOpacity onPress={() => router.push(`/comprovante/${item.id_transacao}`)}>
        <View style={[styles.transactionItem, { backgroundColor: theme.card }]}>
          <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
            <MaterialIcons
              name={getIconName()}
              size={width / 18}
              color={getIconColor()}
            />
          </View>

          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionDesc, { color: theme.text }]} numberOfLines={1}>{item.descricao}</Text>
            <Text style={[styles.transactionId, { color: theme.textSecondary }]}>ID: {item.id_transacao}</Text>

            <View style={styles.transactionDetails}>
              <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Data: {item.date}</Text>
              <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Hora: {item.hora}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={[styles.transactionStatus, { color: getIconColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
          <Text style={[styles.transactionAmount, { color: getAmountColor() }]}>
            {getAmountSign()} R${item.valor.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ padding: height * 0.02, backgroundColor: theme.background }}></View>
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
        <ImageButton image={require("../../assets/Qr_Code.png")} label="Ler QR Code" onPress={() => { router.push('/qrScanner') }} />
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 0,
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
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: width * 0.08,
    height: width * 0.08,
    marginRight: 10,
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
  },
  transactionDesc: {
    fontSize: width / 25,
    fontWeight: "600",
  },
  transactionId: {
    fontSize: width / 32,
    marginBottom: 4
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  transactionDate: {
    fontSize: width / 32,
  },
  transactionStatus: {
    fontSize: width / 32,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: width / 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
