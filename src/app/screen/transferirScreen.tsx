import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import PixComponent from '../components/chavePixForm';

const { width } = Dimensions.get("window");

export default function TransferirScreen() {
    const [tipoChave, setTipoChave] = useState<string | null>(null);

    const handleSelecionarChave = (tipo: 'cpf' | 'telefone') => {
        setTipoChave(tipo);
    };

    return (
        <View style={styles.container}>
            {!tipoChave ? (
                <View style={styles.opcoesContainer}>
                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('cpf')}>
                        <Ionicons name="person-outline" size={22} color="#333" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar CPF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('telefone')}>
                        <Ionicons name="call-outline" size={22} color="#333" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar Telefone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('telefone')}>
                        <Ionicons name="key-outline" size={22} color="#333" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar Chave Pix</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <PixComponent />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F9FF",
        padding: 20,
        justifyContent: "center",
    },
    opcoesContainer: {
        width: "100%",
    },
    opcao: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F9FF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    icone: {
        marginRight: 12,
    },
    opcaoTexto: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
});
