import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, RefreshControl } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import Rotas from '../../types/types.route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function Config() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const { toggleTheme, isDark, theme } = useTheme();

    const options = [
        { label: isDark ? "Tema Claro" : "Tema Escuro", action: toggleTheme },
        { label: "Mudar senha", action: () => { } },
        { label: "Acessibilidade", action: () => { } },
        { label: "Assistência", action: () => { } },
    ];

    const handleRefresh = () => {
        setRefreshing(true);
        router.push(Rotas.HOME);
        setRefreshing(false);
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            router.replace(Rotas.LOGIN); 
        } catch (error) {
            console.log('Erro ao desconectar:', error);
            Alert.alert('Erro ao desconectar');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.header }]}>
                <Image
                    source={require("../../assets/avatar.png")}
                    style={{
                        width: 70,
                        height: 70,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                    }}
                />
                <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity>
                        <Text style={[styles.hello, { color: "#FFFFFF" }]}>Mudar Avatar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => router.push(Rotas.HOME)}>
                        <Ionicons
                            name="arrow-back"
                            size={25}
                            color="white"
                            style={{ marginLeft: 15 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#1B98E0"
                        colors={['#1B98E0']}
                    />
                }
            >
                {options.map((opt, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, { borderBottomColor: theme.border }]}
                        onPress={opt.action}
                    >
                        <Text style={[styles.optionText, { color: theme.text }]}>{opt.label}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.logoutButton} onPress={() => { handleLogout(); }}>
                    <Text style={styles.logoutText}>Desconectar</Text>
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
        alignItems: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 18,
    },
    hello: {
        fontSize: 20,
        fontFamily: "Roboto_500Medium",
    },
    headerIcons: {
        flexDirection: "row",
        position: "absolute",
        right: 15,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    optionButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 16,
        fontFamily: "Roboto_400Regular",
    },
    logoutButton: {
        marginTop: 30,
        paddingVertical: 15,
        alignItems: "center",
    },
    logoutText: {
        fontSize: 16,
        color: "#FF4D4D",
        fontFamily: "Roboto_500Medium",
    },
});
