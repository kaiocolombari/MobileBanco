import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    ActivityIndicator,
    ScrollView
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
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

    const getFilteredTransactions = () => {
        if (!activeFilter) return transactions;

        switch (activeFilter) {
            case 'Enviados':
                return transactions.filter(t => t.tipoTransacao === 'enviado');
            case 'Recebidos':
                return transactions.filter(t => t.tipoTransacao === 'recebido');
            case 'Antigos':
                return [...transactions].sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.hora}`);
                    const dateB = new Date(`${b.date} ${b.hora}`);
                    return dateA.getTime() - dateB.getTime();
                });
            case 'Boletos':
                return transactions.filter(t => t.tipoTransacao === 'boleto');
            case 'Recentes':
                return [...transactions].sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.hora}`);
                    const dateB = new Date(`${b.date} ${b.hora}`);
                    return dateB.getTime() - dateA.getTime();
                });

            default:
                return transactions;
        }
    };

    const handleFilterPress = (filter: string) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={{ padding: height * 0.01, backgroundColor: theme.background }}></View>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.headerText, { color: theme.text }]}>Extrato</Text>

            <View style={styles.transactionsContainer}>
                {!loading && getFilteredTransactions().length === 0 ? (
                    <Text style={[styles.noTransactionsText, { color: theme.text }]}>Nenhuma transação encontrada.</Text>
                ) : (
                    <Text style={[styles.transactionsHeader, { color: theme.text }]}>Histórico de Transações</Text>
                )}
                <View style={[styles.filterExtrato]}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={{ gap: 16, paddingRight: 16, paddingBottom: 12 }}
                    >
                        <TouchableOpacity
                            style={[styles.botaoFilter, activeFilter === 'Recentes' && { backgroundColor: theme.filtroButtonColorActi, borderColor: theme.filtroborderColorActi }, activeFilter === null && { backgroundColor: theme.background, borderColor: theme.filtroborderColor }]}
                            onPress={() => handleFilterPress('Recentes')}
                        >
                            <Text style={[styles.botaoFilterText, activeFilter === 'Recentes' && { color: theme.filterTextActi }, activeFilter === null && { color: theme.filterText }]}>Recentes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoFilter, activeFilter === 'Enviados' && { backgroundColor: theme.filtroButtonColorActi, borderColor: theme.filtroborderColorActi }, activeFilter === null && { backgroundColor: theme.background, borderColor: theme.filtroborderColor }]}
                            onPress={() => handleFilterPress('Enviados')}
                        >
                            <Text style={[styles.botaoFilterText, activeFilter === 'Enviados' && { color: theme.filterTextActi }, activeFilter === null && { color: theme.filterText }]}>Enviados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoFilter, activeFilter === 'Recebidos' && { backgroundColor: theme.filtroButtonColorActi, borderColor: theme.filtroborderColorActi }, activeFilter === null && { backgroundColor: theme.background, borderColor: theme.filtroborderColor }]}
                            onPress={() => handleFilterPress('Recebidos')}
                        >
                            <Text style={[styles.botaoFilterText, activeFilter === 'Recebidos' && { color: theme.filterTextActi }, activeFilter === null && { color: theme.filterText }]}>Recebidos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoFilter, activeFilter === 'Antigos' && { backgroundColor: theme.filtroButtonColorActi, borderColor: theme.filtroborderColorActi }, activeFilter === null && { backgroundColor: theme.background, borderColor: theme.filtroborderColor }]}
                            onPress={() => handleFilterPress('Antigos')}
                        >
                            <Text style={[styles.botaoFilterText, activeFilter === 'Antigos' && { color: theme.filterTextActi }, activeFilter === null && { color: theme.filterText }]}>Antigos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoFilter, activeFilter === 'Boletos' && { backgroundColor: theme.filtroButtonColorActi, borderColor: theme.filtroborderColorActi }, activeFilter === null && { backgroundColor: theme.background, borderColor: theme.filtroborderColor }]}
                            onPress={() => handleFilterPress('Boletos')}
                        >
                            <Text style={[styles.botaoFilterText, activeFilter === 'Boletos' && { color: theme.filterTextActi }, activeFilter === null && { color: theme.filterText }]}>Boletos</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={getFilteredTransactions()}
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
        height: height * 0.07,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    botaoFilter: {
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 12,
        textAlign: "center",
        borderStyle: "solid",
        borderWidth: 2,
    },
    botaoFilterActive: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    botaoFilterText: {
        color: "black",
        fontSize: width / 28,
        fontWeight: "500"
    },
    botaoFilterTextActive: {
        color: "white"
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
