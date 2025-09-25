import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get("window");

export default function recargaScreen() {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.header }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textTitle }]}>Recarga</Text>
            </View>

            <ScrollView>
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },

    header: {
        flexDirection: "row",
        paddingVertical: 18,
        paddingHorizontal: 15,
        elevation: 4,
    },
    backButton: {
        paddingRight: 10,
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: width * 0.06,
        fontFamily: 'Roboto_400Regular',
    },
})

