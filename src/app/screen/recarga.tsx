import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

const { width, height } = Dimensions.get("window");

const operators = [
    { name: 'Vivo', color: '#8B2BF3' },
    { name: 'Claro', color: '#FF6B35' },
    { name: 'Tim', color: '#00B894' },
    { name: 'Oi', color: '#FD79A8' },
];

const amounts = [10, 20, 30, 50, 100];

export default function recargaScreen() {
    const { theme } = useTheme();
    const [phone, setPhone] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');

        const limited = cleaned.substring(0, 11);

        let formatted = limited;
        if (limited.length >= 3) {
            formatted = `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
        }
        if (limited.length >= 7) {
            formatted = `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
        }
        if (limited.length >= 8) {
            formatted = `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`;
        }

        return formatted;
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);
    };

    const handleConfirm = () => {
        if (!phone || !selectedOperator || !selectedAmount) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        Alert.alert('Sucesso', `Recarga de R$${selectedAmount} para ${phone} (${selectedOperator}) solicitada`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.header }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textTitle }]}>Recarga</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>Recarregue seu celular</Text>
                    <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>Escolha a operadora e o valor desejado</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="call" size={20} color={theme.primary} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Número do telefone</Text>
                    </View>
                    <TextInput
                        style={[styles.phoneInput, { borderColor: theme.border, color: theme.text }]}
                        placeholder="(11) 99999-9999"
                        placeholderTextColor={theme.textSecondary}
                        value={phone}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={15}
                    />
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="radio" size={20} color={theme.primary} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Operadora</Text>
                    </View>
                    <View style={styles.operatorsGrid}>
                        {operators.map((op) => (
                            <TouchableOpacity
                                key={op.name}
                                style={[
                                    styles.operatorCard,
                                    {
                                        backgroundColor: selectedOperator === op.name ? op.color : theme.surface,
                                        borderColor: selectedOperator === op.name ? op.color : theme.border
                                    }
                                ]}
                                onPress={() => setSelectedOperator(op.name)}
                            >
                                <Text style={[
                                    styles.operatorName,
                                    { color: selectedOperator === op.name ? 'white' : theme.text }
                                ]}>
                                    {op.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="cash" size={20} color={theme.primary} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Valor da recarga</Text>
                    </View>
                    <View style={styles.amountsGrid}>
                        {amounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                style={[
                                    styles.amountCard,
                                    {
                                        backgroundColor: selectedAmount === amt ? theme.primary : theme.surface,
                                        borderColor: selectedAmount === amt ? theme.primary : theme.border
                                    }
                                ]}
                                onPress={() => setSelectedAmount(amt)}
                            >
                                <Text style={[
                                    styles.amountValue,
                                    { color: selectedAmount === amt ? 'white' : theme.text }
                                ]}>
                                    R$ {amt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        {
                            backgroundColor: (!phone || !selectedOperator || !selectedAmount) ? theme.textSecondary : theme.button,
                            opacity: (!phone || !selectedOperator || !selectedAmount) ? 0.6 : 1
                        }
                    ]}
                    onPress={handleConfirm}
                    disabled={!phone || !selectedOperator || !selectedAmount}
                >
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={styles.confirmText}>Confirmar Recarga</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        paddingVertical: 18,
        paddingHorizontal: 15,
        elevation: 4,
    },
    backButton: {
        paddingRight: 10,
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: width * 0.06,
        fontFamily: 'Roboto_400Regular',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heroImage: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: 15,
        resizeMode: 'contain',
    },
    heroTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: width * 0.04,
        textAlign: 'center',
        opacity: 0.8,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    phoneInput: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 14,
        fontSize: width * 0.04,
        fontWeight: '600',
    },
    operatorsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    operatorCard: {
        width: '48%',
        height: width * 0.18,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    operatorName: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
    },
    amountsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    amountCard: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    amountValue: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    confirmText: {
        color: 'white',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginLeft: 10,
    },
})

