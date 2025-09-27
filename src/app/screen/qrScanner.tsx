import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function QrScannerScreen() {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Parse PIX QR code data
    const pixData = parsePixQrCode(data);
    if (pixData) {
      // Navigate to transfer screen with parsed data
      router.push({
        pathname: '/transferirScreen',
        params: {
          qrData: JSON.stringify(pixData)
        }
      });
    } else {
      Alert.alert('Erro', 'QR Code inválido ou não é um PIX válido.');
      setScanned(false);
    }
  };

  const parsePixQrCode = (data: string) => {
    // PIX QR code parsing - PIX codes contain specific format
    try {
      // Check if it's a PIX QR code
      if (!data.includes('BR.GOV.BCB.PIX')) {
        return null;
      }

      // Extract PIX key and amount from the data
      // PIX format: 000201...BR.GOV.BCB.PIX01XX...5802BR...
      const chaveMatch = data.match(/01(\d{2})(.+?)02/);
      const valorMatch = data.match(/54(\d{2})(.+?)58/);

      let chave = '';
      let valor = null;

      if (chaveMatch) {
        const length = parseInt(chaveMatch[1]);
        chave = chaveMatch[2].substring(0, length);
      }

      if (valorMatch) {
        const length = parseInt(valorMatch[1]);
        const valorStr = valorMatch[2].substring(0, length);
        valor = parseFloat(valorStr);
      }

      if (chave) {
        // Determine tipo based on chave format
        let tipo: 'cpf' | 'phone' | 'chave' = 'chave';
        if (/^\d{11}$/.test(chave.replace(/\D/g, ''))) {
          tipo = 'cpf';
        } else if (/^\+?\d{10,15}$/.test(chave.replace(/\D/g, ''))) {
          tipo = 'phone';
        }

        return {
          chave,
          valor,
          tipo
        };
      }
    } catch (error) {
      console.log('Error parsing QR code:', error);
    }
    return null;
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>Solicitando permissão para câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>Sem acesso à câmera</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.button }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Escaneie o QR Code PIX</Text>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Posicione o QR Code dentro da área de escaneamento
          </Text>
        </View>
      </View>

      {scanned && (
        <View style={styles.scannedOverlay}>
          <Text style={styles.scannedText}>QR Code escaneado!</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Escanear novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
    borderBottomRightRadius: 10,
  },
  instructions: {
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});