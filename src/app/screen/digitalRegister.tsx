import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Rotas from '../../types/types.route';
import { MaterialIcons } from '@expo/vector-icons';

export default function DigitalRegister() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkHardware();
  }, []);

  async function checkHardware() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsSupported(compatible && enrolled);
  }

  async function handleRegisterBiometric() {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua digital para configurar o desbloqueio',
      fallbackLabel: 'Usar senha',
    });

    if (result.success) {
      await AsyncStorage.setItem('biometria', 'true');
      Alert.alert('Sucesso', 'Desbloqueio por digital configurado!');
      router.push(Rotas.HOME);
    } else {
      Alert.alert('Falha', 'Não foi possível configurar sua digital.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar desbloqueio por digital?</Text>
      <MaterialIcons name="fingerprint" size={100} color="#1B98E0" />
      {isSupported ? (
        <>
          <TouchableOpacity style={styles.button} onPress={handleRegisterBiometric}>
            <Text style={styles.buttonText}>Sim, configurar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => router.push(Rotas.HOME)}
          >
            <Text style={styles.buttonText}>Não agora</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.warning}>
          Seu dispositivo não suporta biometria ou não há digitais cadastradas.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  button: {
    backgroundColor: '#1B98E0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },

  buttonCancel: {
    backgroundColor: 'gray'
  },

  buttonText: {
    color: 'white',
    fontSize: 16
  },

  warning: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16
  },
});
