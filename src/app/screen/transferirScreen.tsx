import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixComponentValor } from '../components/chavePixForm';
import { getDadosDestinatarioByChavePix, getDadosDestinatarioByCpf, getDadosDestinatarioByPhone } from '../api/user';
import type { AxiosResponse } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get("window");

export default function TransferirScreen() {
    const { theme } = useTheme();
    const { qrData } = useLocalSearchParams();
    const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);
    const [tipoChave, setTipoChave] = useState<'cpf' | 'phone' | 'chave' | null>(null);
    const [valorChave, setValorChave] = useState('');
    const [nomeCompletoDestinatario, setNomeCompletoDestinatario] = useState("");
    const [cpfDestinatario, setCpfDestinatario] = useState("");
    const [qrParsedData, setQrParsedData] = useState<any>(null);

    useEffect(() => {
        const handleQrData = async () => {
            if (qrData) {
                try {
                    const parsed = JSON.parse(qrData as string);
                    setQrParsedData(parsed);
                    setTipoChave(parsed.tipo || 'chave');
                    setValorChave(parsed.chave);

                    let response;
                    switch (parsed.tipo) {
                        case "chave":
                            response = await getDadosDestinatarioByChavePix(parsed.chave);
                            break;
                        case "phone":
                            response = await getDadosDestinatarioByPhone(parsed.chave);
                            break;
                        case "cpf":
                            response = await getDadosDestinatarioByCpf(parsed.chave);
                            break;
                        default:
                            throw new Error('Tipo inválido');
                    }

                    setNomeCompletoDestinatario((response as AxiosResponse).data?.conta?.usuario?.full_name || parsed.chave);
                    setCpfDestinatario((response as AxiosResponse).data?.conta?.usuario?.cpf || '');
                    setEtapa(3);
                } catch (error) {
                    console.log('Error parsing QR data:', error);
                    Alert.alert('Erro', 'Dados do QR Code inválidos');
                }
            }
        };

        handleQrData();
    }, [qrData]);

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
            setCpfDestinatario((response as AxiosResponse).data?.conta?.usuario?.cpf);

            setEtapa(3)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity style={{...styles.backButton,  position: 'absolute', top: 20, left: 20 }} onPress={() => { router.back() }}>
                <Ionicons name="chevron-back" size={28} color="grey" />
            </TouchableOpacity>
            {etapa === 1 && (
                <View style={styles.opcoesContainer}>

                    <TouchableOpacity style={[styles.opcao, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => { setTipoChave('cpf'); setEtapa(2); }}>
                        <Ionicons name="person-outline" size={22} color={theme.primary} style={styles.icone} />
                        <Text style={[styles.opcaoTexto, { color: theme.text }]}>Usar CPF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.opcao, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => { setTipoChave('phone'); setEtapa(2); }}>
                        <Ionicons name="call-outline" size={22} color={theme.primary} style={styles.icone} />
                        <Text style={[styles.opcaoTexto, { color: theme.text }]}>Usar Telefone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.opcao, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => { setTipoChave('chave'); setEtapa(2); }}>
                        <Ionicons name="key-outline" size={22} color={theme.primary} style={styles.icone} />
                        <Text style={[styles.opcaoTexto, { color: theme.text }]}>Usar Chave Pix</Text>
                    </TouchableOpacity>
                </View>
            )}

            {etapa === 2 && (
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setEtapa(1)}>
                            <Ionicons name="chevron-back" size={28} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerText, { color: theme.text }]}>Digite a chave</Text>
                    </View>

                    <TextInput
                        style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                        placeholder={tipoChave === 'cpf' ? "000.000.000-00" : tipoChave === 'phone' ? "(00) 00000-0000" : "Chave Pix"}
                        maxLength={tipoChave === 'cpf' ? 14 : tipoChave === 'phone' ? 15 : 50}
                        placeholderTextColor={theme.textSecondary}
                        keyboardType={tipoChave === 'chave' ? "default" : "numeric"}
                        value={valorChave}
                        onChangeText={handleChangeText}
                    />

                    <TouchableOpacity
                        style={[styles.botao, { backgroundColor: theme.button, opacity: valorChave ? 1 : 0.5 }]}
                        disabled={!valorChave}
                        onPress={() => setEtapa(3)}
                    >
                        <Text style={[styles.botaoTexto, { color: theme.text }]}>Próximo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {etapa === 3 && (
                <PixComponentValor
                    nome={nomeCompletoDestinatario}
                    chavePix={valorChave}
                    onContinuar={async (valor: number) => {
                        // Store transfer data
                        await AsyncStorage.setItem('transferData', JSON.stringify({
                            nome: nomeCompletoDestinatario,
                            chavePix: valorChave,
                            tipoChave,
                            cpfDestinatario,
                            valor,
                            qrParsedData
                        }));
                        router.push('/transferirConfirm');
                    }}
                    initialValue={qrParsedData?.valor ? qrParsedData.valor * 100 : undefined}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    // Etapa 1
    opcoesContainer: {
        width: "100%",
    },
    opcao: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
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

    backButton: {
        width: "100%",
        alignItems: "flex-start",
    },

    icone: {
        marginRight: 14,
    },
    opcaoTexto: {
        fontSize: 16,
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
        marginLeft: 12,
    },
    input: {
        width: "100%",
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 20,
    },
    botao: {
        width: "100%",
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    botaoTexto: {
        fontSize: 16,
        fontWeight: "600",
    },
});
