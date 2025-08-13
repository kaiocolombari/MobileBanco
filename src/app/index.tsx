import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Rotas from '../types/types.route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const { width, height } = Dimensions.get('window');

const imageBack = require('../assets/fundoRisco.png');
const logo = require('../assets/logo.png');

export default function Home() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkBiometria();
  }, []);

  const checkBiometria = async () => {
    const bioEnabled = await AsyncStorage.getItem('biometria');
    if (bioEnabled === 'true') {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua digital para entrar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        verifyLogin();
      } else {
        Alert.alert('Atenção', 'Biometria não reconhecida.');
      }
    }
    setChecking(false);
  };

  const verifyLogin = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      router.push(Rotas.LOGIN);
    } else {
      router.push(Rotas.REGISTER);
    }
  };

  return (
    <ImageBackground source={imageBack} style={styles.background} resizeMode='cover'>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        {!checking && (
          <TouchableOpacity style={styles.buttonLogin} onPress={verifyLogin}>
            <Text style={styles.textButton}>ENTRAR</Text>
          </TouchableOpacity>
        )}
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.08,
  },
  title: {
    fontSize: width * 0.08,
    fontFamily: 'Roboto_500Medium',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#1B98E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonLogin: {
    width: '60%',
    aspectRatio: 3.5,
    backgroundColor: '#0686D0',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: height * 0.45,
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.06
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginTop: height * 0.01,
    marginRight: width * 0.7,
  },
});
