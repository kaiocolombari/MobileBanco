import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { PixComponentValor } from '../components/chavePixForm';
import { getDadosDestinatarioByChavePix, getDadosDestinatarioByCpf, getDadosDestinatarioByPhone } from '../api/user';
import type { AxiosResponse } from 'axios';
import { router } from 'expo-router';

const { width } = Dimensions.get("window");

export default function TransferirScreen() {
    const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);
    const [tipoChave, setTipoChave] = useState<'cpf' | 'phone' | 'chave' | null>(null);
    const [valorChave, setValorChave] = useState('');
    const [nomeCompletoDestinatario, setNomeCompletoDestinatario] = useState("");

    const formatarChave = (texto: string) => {
        if (tipoChave === 'cpf') {
            let cpf = texto.replace(/\D/g, '');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            return cpf;
        } else if (tipoChave === 'phone') {
            let tel = texto.replace(/\D/g, '');
            tel = tel.replace(/^(\d{2})(\d)/g, '($1) $2');
            tel = tel.replace(/(\d{5})(\d{4})$/, '$1-$2');
            return tel;
        }
        return texto;
    };

    const handleChangeText = (texto: string) => {
        setValorChave(formatarChave(texto));
    };

    const handleSubmitEtapa2 = async () => {
        try {
            switch (tipoChave) {
                case "chave":
                    var response = await getDadosDestinatarioByChavePix(valorChave);
                    break;
                case "phone":
                    var response = await getDadosDestinatarioByPhone(valorChave);
                    break;
                case "cpf":
                    var response = await getDadosDestinatarioByCpf(valorChave);
                    break;
                default:
                    throw Error();
            }

            setNomeCompletoDestinatario((response as AxiosResponse).data?.conta?.usuario?.full_name);

            setEtapa(3)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <View >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={width / 16} color="grey" style={styles.iconBack} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {etapa === 1 && (
                    <View style={styles.opcoesContainer}>
                        <TouchableOpacity style={styles.opcao} onPress={() => { setTipoChave('cpf'); setEtapa(2); }}>
                            <Ionicons name="person-outline" size={22} color="#1B98E0" style={styles.icone} />
                            <Text style={styles.opcaoTexto}>Usar CPF</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.opcao} onPress={() => { setTipoChave('phone'); setEtapa(2); }}>
                            <Ionicons name="call-outline" size={22} color="#1B98E0" style={styles.icone} />
                            <Text style={styles.opcaoTexto}>Usar Telefone</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.opcao} onPress={() => { setTipoChave('chave'); setEtapa(2); }}>
                            <Ionicons name="key-outline" size={22} color="#1B98E0" style={styles.icone} />
                            <Text style={styles.opcaoTexto}>Usar Chave Pix</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {etapa === 2 && (
                    <View>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => setEtapa(1)}>
                                <Ionicons name="chevron-back" size={28} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Digite a chave</Text>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder={tipoChave === 'cpf' ? "000.000.000-00" : tipoChave === 'phone' ? "(00) 00000-0000" : "Chave Pix"}
                            maxLength={tipoChave === 'cpf' ? 14 : tipoChave === 'phone' ? 15 : 50}
                            placeholderTextColor="#999"
                            keyboardType={tipoChave === 'chave' ? "default" : "numeric"}
                            value={valorChave}
                            onChangeText={handleChangeText}
                        />

                        <TouchableOpacity
                            style={[styles.botao, { opacity: valorChave ? 1 : 0.5 }]}
                            disabled={!valorChave}
                            onPress={() => setEtapa(3)}
                        >
                            <Text style={styles.botaoTexto}>Próximo</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {etapa === 3 && (
                    <PixComponentValor
                        nome={nomeCompletoDestinatario}
                        chavePix={valorChave}
                        onContinuar={() => console.log("Transferência confirmada!")}
                    />
                )}
            </View>
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
    backButton: {
        marginTop: 20,
        marginLeft: 16,
    },
    iconBack: {
        marginBottom: 12,
        marginLeft: 4
    },
    // Etapa 1
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
    // Etapa 2
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginLeft: 12,
    },
    input: {
        width: "100%",
        height: 55,
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#F9F9F9",
        marginBottom: 20,
    },
    botao: {
        width: "100%",
        height: 50,
        backgroundColor: "#1B98E0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    botaoTexto: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
