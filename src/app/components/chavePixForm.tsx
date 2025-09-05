import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React from 'react';

const { width, height } = Dimensions.get("window");

interface PixComponentValeuProps {
    nome: string;
    chavePix: string;
    onContinuar: () => void;
}

export const PixComponent: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name='chevron-back' size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Transferir</Text>
            </View>

            <View style={styles.formArea}>
                <TextInput
                    style={styles.inputChavePix}
                    placeholder='Digite a chave Pix'
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.buttonConfirm}>
                    <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const PixComponentValor: React.FC<PixComponentValeuProps> = ({ nome, chavePix, onContinuar }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name='chevron-back' size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.formArea}>
                <Text style={styles.subText}>Transferir para</Text>
                <Text style={styles.nomeTransferir}>{nome}</Text>

                <View style={styles.valorContainer}>
                    <Text style={styles.moeda}>$</Text>
                    <Text style={styles.valorPix}>0,00</Text>
                    <TouchableOpacity>
                        <Image
                            source={require('../../assets/pincel.png')}
                            style={styles.pencilImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.chaveContainer}>
                    <Text style={styles.subText}>Chave Pix</Text>
                    <Text style={styles.chaveTexto}>{chavePix}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.buttonContinuar} onPress={onContinuar}>
                <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    headerText: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        marginLeft: 12,
    },

    formArea: {
        marginTop: 10,
    },

    inputChavePix: {
        backgroundColor: "#F9F9F9",
        width: "100%",
        height: 55,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        elevation: 1,
    },

    buttonConfirm: {
        width: "100%",
        height: 50,
        backgroundColor: "#1B98E0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    subText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 6,
    },

    nomeTransferir: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 25,
    },

    valorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    valorPix: {
        fontSize: 28,
        fontWeight: "600",
        color: "#333",
        marginLeft: 8,
    },

    pencilImage: {
        width: 22,
        height: 22,
        marginLeft: 10,
        tintColor: "#666",
    },
    moeda: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
    buttonContinuar: {
        width: "100%",
        height: 50,
        backgroundColor: "#1B98E0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },

    chaveContainer: {
        marginTop: 10,
    },

    chaveTexto: {
        fontSize: 16,
        color: "#222",
        fontWeight: "500",
    },
});
