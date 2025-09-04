import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import ImageButton from '../components/ImageButton';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

const { width, height } = Dimensions.get("window");


export default function pixScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity>
          <Ionicons name='chevron-back' size={26} color="grey" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.headerText}>Área Pix</Text>
      </View>
      <View style={styles.iconesPix}>
        <ImageButton image={require("../../assets/trans2.png")} label="Transferir" onPress={() => { }} />
        <ImageButton image={require("../../assets/copiaCola.png")} label="Pix Copia e Cola" onPress={() => { }} />
        <ImageButton image={require("../../assets/Qr_Code.png")} label="Ler QR Code" onPress={() => { }} />
      </View>
      <View style={styles.line}></View>
    </View>
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  backButton: {
    marginTop: 20,
    marginLeft: 16,
  },

  headerText: {
    fontSize: 26,
    fontFamily: 'Roboto_400Regular',
    padding: 16
  },

  iconesPix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },

  line: { 
    width: "100%", 
    height: 5, 
    backgroundColor: "#E8F1F2",
    marginTop: "50%"
  }
})