import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import ComprovanteFull from '../components/ComprovanteFull';
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function ComprovanteScreen() {
    const { theme } = useTheme();
    const { id } = useLocalSearchParams();

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Ionicons name='chevron-back' size={width / 16} color="grey" style={[styles.iconBack]} />
                </TouchableOpacity>
            </View>
            <ComprovanteFull id={parseInt(id as string)} sucesso={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginTop: 10,
        marginLeft: 16,
    },
    iconBack: {
        marginBottom: 12,
        marginLeft: 2
    },
});