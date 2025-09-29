import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CancelarTransferenciaModal from "../components/CancelarTransferenciaModal";
import { transferir } from '../api/fetchTransacoes';
import Rotas from "../../types/types.route";

export default function ConfirmarSenhaScreen() {
    const [senha, setSenha] = useState("");
    const inputRef = useRef<TextInput>(null);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [transferData, setTransferData] = useState<any>(null);

    useEffect(() => {
        const loadTransferData = async () => {
            const data = await AsyncStorage.getItem('transferData');
            if (data) {
                setTransferData(JSON.parse(data));
            }
        };
        loadTransferData();
    }, []);

    const handleChange = (text: string) => {
        if (text.length <= 6) {
            setSenha(text);
        }
    };

    const handleTransferir = async () => {
        if (senha.length === 6 && transferData) {
            Keyboard.dismiss();
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
                    return;
                }

                const cpf_destinatario = transferData.cpfDestinatario || transferData.chavePix.replace(/\D/g, '');

                const response = await transferir(token, senha, transferData.valor, cpf_destinatario, 'Transferência via app');

                if (response.status === 'success') {
                    await AsyncStorage.removeItem('transferData');
                    const transactionId = response.transactionId;
                    if (transactionId) {
                        router.replace(`/comprovante/${transactionId}`);
                    } else {
                        Alert.alert('Sucesso', 'Transferência realizada com sucesso!', [
                            { text: 'OK', onPress: () => router.replace(Rotas.HOME) }
                        ]);
                    }
                } else {
                    Alert.alert('Erro', response.msg || 'Erro na transferência');
                }
            } catch (error: any) {
                console.log('Erro na transferência:', error);
                Alert.alert('Erro', error.message || 'Erro na transferência');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmar com sua senha de 6 dígitos</Text>

            <View style={styles.secureBadge}>
                <Ionicons name="lock-closed-outline" size={16} color="#4CAF50" />
                <Text style={styles.secureText}>Conexão segura</Text>
            </View>

            <TextInput
                ref={inputRef}
                value={senha}
                onChangeText={handleChange}
                style={styles.hiddenInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                autoFocus
            />

            <View style={styles.digitsContainer}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={styles.digitBox}>
                        <Text style={styles.digitText}>{senha[i] ? "•" : ""}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => {
                    setSenha("")
                    setModalVisivel(true)
                }}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <CancelarTransferenciaModal
                    visible={modalVisivel}
                    onFechar={() => setModalVisivel(false)}
                    onConfirmar={() => {
                        setModalVisivel(false);
                        router.back()
                    }}
                />

                <TouchableOpacity
                    style={[styles.transferButton, senha.length < 6 && { opacity: 0.6 }]}
                    disabled={senha.length < 6}
                    onPress={handleTransferir}
                >
                    <Text style={styles.transferText}>Transferir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#999" />
                <Text style={styles.footerText}>Dados protegidos por criptografia</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 12,
        color: "#222",
    },
    secureBadge: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "#E8F5E9",
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginBottom: 28,
        alignItems: "center",
    },
    secureText: {
        color: "#4CAF50",
        fontSize: 13,
        marginLeft: 6,
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
    },
    digitsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 40,
    },
    digitBox: {
        width: 45,
        height: 55,
        borderWidth: 2,
        borderColor: "#DDD",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
    },
    digitText: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        alignItems: "center",
    },
    cancelText: {
        fontSize: 16,
        color: "#E53935",
        fontWeight: "500",
    },
    transferButton: {
        backgroundColor: "#1B98E0",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 28,
        elevation: 2,
    },
    transferText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFF",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 35,
        alignItems: "center",
    },
    footerText: {
        fontSize: 13,
        color: "#999",
        marginLeft: 6,
    },
});