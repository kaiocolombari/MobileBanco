import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Rotas from "../../types/types.route";
import ComprovanteFull from "../components/ComprovanteFull";

interface Props {
    sucesso?: boolean;
}

export default function TransacaoResultadoScreen({ sucesso = true }: Props) {
    const [modalVisivel, setModalVisivel] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Ionicons
                    name={sucesso ? "checkmark-circle-outline" : "close-circle-outline"}
                    size={72}
                    color={sucesso ? "#4CAF50" : "#E53935"}
                    style={styles.icon}
                />
                <Text style={[styles.title, { color: sucesso ? "#4CAF50" : "#E53935" }]}>
                    {sucesso ? "Transação concluída!" : "Falha na transação"}
                </Text>
                <Text style={styles.subtitle}>
                    {sucesso
                        ? "Seu dinheiro foi enviado com sucesso."
                        : "Não foi possível concluir sua transferência."}
                </Text>

                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-circle-outline" size={22} color="#555" />
                        <Text style={styles.infoText}>Enviado para: João Silva</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={22} color="#555" />
                        <Text style={styles.infoText}>Valor: R$ 100,00</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={22} color="#555" />
                        <Text style={styles.infoText}>Enviado em: 06/09/2025 - 14:30</Text>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.homeButton} onPress={() => { router.push(Rotas.HOME) }}>
                        <Ionicons name="home-outline" size={18} color="#FFF" />
                        <Text style={styles.homeText}>Voltar para Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.receiptButton} onPress={() => setModalVisivel(true)}>
                        <Ionicons name="receipt-outline" size={18} color="#1B98E0" />
                        <Text style={styles.receiptText}>Ver Comprovante</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ComprovanteFull sucesso={sucesso} />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Ionicons name="close-circle-outline" size={28} color="#E53935" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 28,
        alignItems: "center",
        width: "100%",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 6,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        marginBottom: 22,
    },
    infoBox: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        width: "100%",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#EEE",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    infoText: {
        fontSize: 15,
        color: "#333",
        marginLeft: 8,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1B98E0",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        flex: 1,
        justifyContent: "center",
        marginRight: 8,
    },
    homeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFF",
        marginLeft: 6,
    },
    receiptButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5FE",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        flex: 1,
        justifyContent: "center",
        marginLeft: 8,
    },
    receiptText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1B98E0",
        marginLeft: 6,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        maxHeight: "90%",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 16,
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: 12,
    },
});
