import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { PixComponent, PixComponentValeu } from '../components/chavePixForm';

const { width } = Dimensions.get("window");

export default function TransferirScreen() {
    const [tipoChave, setTipoChave] = useState<string | null>(null);

    const handleSelecionarChave = (tipo: 'cpf' | 'telefone' | 'chave') => {
        setTipoChave(tipo);
    };

    return (
        <View style={styles.container}>
            {!tipoChave ? (
                <View style={styles.opcoesContainer}>
                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('cpf')}>
                        <Ionicons name="person-outline" size={22} color="#1B98E0" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar CPF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('telefone')}>
                        <Ionicons name="call-outline" size={22} color="#1B98E0" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar Telefone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.opcao} onPress={() => handleSelecionarChave('chave')}>
                        <Ionicons name="key-outline" size={22} color="#1B98E0" style={styles.icone} />
                        <Text style={styles.opcaoTexto}>Usar Chave Pix</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <PixComponent />
            )}

            {/* Exemplo para mostrar a tela de valor */}
            {/* <PixComponentValeu/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
        justifyContent: "center",
    },
    opcoesContainer: {
        width: "100%",
    },
    opcao: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 18,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    icone: {
        marginRight: 14,
    },
    opcaoTexto: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
});
