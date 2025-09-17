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
import ComprovanteFull from '../components/ComprovanteFull';
import Rotas from '../../types/types.route';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get("window");

export default function ExtratoScreen() {
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
            <TouchableOpacity onPress={() => router.push(`/comprovante/${item.id_transacao}`)}>
                <View style={[styles.transactionItem, { backgroundColor: theme.card }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isReceived ? '#DFF7E1' : '#FDDCDC' }]}>
                        <MaterialIcons
                            name={isReceived ? "arrow-downward" : "arrow-upward"}
                            size={width / 18}
                            color={isReceived ? 'green' : 'red'}
                            onPress={() => { router.back(); }}
                        />
                    </View>

                    <View style={styles.transactionInfo}>
                        <Text style={[styles.transactionDesc, { color: theme.text }]}>{item.descricao}</Text>
                        <Text style={[styles.transactionId, { color: theme.textSecondary }]}>ID: {item.id_transacao}</Text>

                        <View style={styles.transactionDetails}>
                            <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Data: {item.date}</Text>
                            <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>Hora: {item.hora}</Text>
                        </View>
                        <View style={styles.transactionDetails}>
                            <Text style={[styles.transactionStatus, { color: isReceived ? 'green' : 'red' }]}>
                                {isReceived ? "Recebido" : "Enviado"}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.transactionAmount, { color: isReceived ? 'green' : 'red' }]}>
                        {isReceived ? `+ R$${item.valor.toFixed(2)}` : `- R$${item.valor.toFixed(2)}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.headerText, { color: theme.text }]}>Extrato</Text>

            <View style={styles.transactionsContainer}>
                {!loading && transactions.length === 0 ? (
                    <Text style={[styles.noTransactionsText, { color: theme.text }]}>Nenhuma transação encontrada.</Text>
                ) : (
                    <Text style={[styles.transactionsHeader, { color: theme.text }]}>Histórico de Transações</Text>
                )}
                <View style={[styles.filterExtrato, {}]}>
                    <TouchableOpacity>
                        <Text>Recentes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Enviados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Recebidos</Text>
                    </TouchableOpacity>
                </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginTop: 20,
        marginLeft: 16,
    },
    filterExtrato: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: "space-around",
        padding: 8
    },
    iconBack: {
        marginBottom: 12,
        marginLeft: 2
    },
    headerText: {
        fontSize: width / 14,
        fontWeight: "bold",
        padding: 16,
    },
    transactionsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    transactionsHeader: {
        fontSize: width / 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    noTransactionsText: {
        fontSize: width / 25,
        marginTop: 20,
        textAlign: "center"
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
    transactionBank: {
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
