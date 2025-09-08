import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { fetchTransacoesMock, Transacao } from '../api/fetchTransacoes';

const { width, height } = Dimensions.get("window");

export default function ExtratoScreen() {
    const [transactions, setTransactions] = useState<Transacao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTransactions() {
            setLoading(true);
            const data = await fetchTransacoesMock();
            setTransactions(data);
            setLoading(false);
        }
        loadTransactions();
    }, []);

    const renderTransaction = ({ item }: { item: Transacao }) => {
        const isReceived = item.tipoTransacao === 'recebido';

        return (
            <View style={styles.transactionItem}>
                <View style={[styles.iconContainer, { backgroundColor: isReceived ? '#DFF7E1' : '#FDDCDC' }]}>
                    <MaterialIcons
                        name={isReceived ? "arrow-downward" : "arrow-upward"}
                        size={width / 18}
                        color={isReceived ? 'green' : 'red'}
                        onPress={() => { router.back(); }}
                    />
                </View>

                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDesc}>{item.descricao}</Text>
                    <Text style={styles.transactionId}>ID: {item.id_transacao}</Text>

                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionDate}>Data: {item.data}</Text>
                        <Text style={styles.transactionDate}>Hora: {item.hora}</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionBank}>Banco: {item.tipoBanco || "N/A"}</Text>
                        <Text style={[styles.transactionStatus, { color: isReceived ? 'green' : 'red' }]}>
                            {isReceived ? "Recebido" : "Enviado"}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.transactionAmount, { color: isReceived ? 'green' : 'red' }]}>
                    {isReceived ? `+ R$${item.valor.toFixed(2)}` : `- R$${item.valor.toFixed(2)}`}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
                </TouchableOpacity>
            </View>

            <Text style={styles.headerText}>Extrato</Text>

            <View style={styles.transactionsContainer}>
                {!loading && transactions.length === 0 ? (
                    <Text style={styles.noTransactionsText}>Nenhuma transação encontrada.</Text>
                ) : (
                    <Text style={styles.transactionsHeader}>Histórico de Transações</Text>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F9FF",
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
        fontSize: width / 14,
        fontWeight: "bold",
        padding: 16,
        color: "#333"
    },
    transactionsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    transactionsHeader: {
        fontSize: width / 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#333'
    },
    noTransactionsText: {
        fontSize: width / 25,
        color: '#333',
        marginTop: 20,
        textAlign: "center"
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    iconContainer: {
        width: width / 10,
        height: width / 10,
        borderRadius: (width / 10) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDesc: {
        fontSize: width / 25,
        fontWeight: "600",
        color: '#333'
    },
    transactionId: {
        fontSize: width / 32,
        color: '#666',
        marginBottom: 4
    },
    transactionDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },
    transactionDate: {
        fontSize: width / 32,
        color: '#777',
    },
    transactionBank: {
        fontSize: width / 32,
        color: '#555',
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
