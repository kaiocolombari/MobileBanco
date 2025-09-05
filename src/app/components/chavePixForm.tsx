import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import React from 'react'

const { width, height } = Dimensions.get("window");


export default function PixComponent() {
    return (
        <View style={styles.container}>
            <View style={styles.transferir}>
                <View style={styles.backButton}>
                    <TouchableOpacity>
                        <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.headerText}>Transferir</Text>
                </View>
                <View style={styles.boxInputText}>
                    <TextInput style={styles.inputChavePix} placeholder='Chave Pix' placeholderTextColor={"#758692"} />
                    <TouchableOpacity style={styles.buttonConfirm}>
                        <Text style={styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#1B98E0"
    },

    backButton: {
        marginTop: 20,
        marginLeft: 16,
    },

    iconBack: {
        marginBottom: 12,
        marginLeft: 2
    },

    transferir: {
        width: "100%",
        height: height / 2,
        backgroundColor: "#F5F9FF",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    headerText: {
        fontSize: width / 15,
        fontFamily: 'Roboto_400Regular',
        padding: 16
    },

    boxInputText: {
        width: width,
        height: "100%",
        display: 'flex',
        alignItems: "center",
        marginTop: 30
    },

    inputChavePix: {
        backgroundColor: "#E8F1F2",
        width: "90%",
        height: 10 / 100 * width,
        borderRadius: 5,
        paddingInline: 10,
        fontSize: 14,
        outlineColor: "transparent"
    },

    buttonConfirm: {
        width: width * 0.35,
        height: height * 0.05,
        backgroundColor: "#1B98E0",
        borderRadius: 20,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        marginRight: 30
    },

    buttonText: {
        color: "white",
        fontSize: width * 0.050,
        fontFamily: "Roboto_400Regular",
    },
})