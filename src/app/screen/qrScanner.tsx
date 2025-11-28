import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function QrScanner() {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const qrData = JSON.parse(data);
      if (qrData.type === 'payment' && qrData.amount && qrData.recipient) {
        // Fetch recipient name
        try {
          const response = await fetch(`http://192.168.0.76:3000/api/v1/user/chave-pix/${qrData.recipient}`);
          let recipientName = qrData.recipient;
          if (response.ok) {
            const userData = await response.json();
            recipientName = userData.conta?.usuario?.full_name || qrData.recipient;
          }
          Alert.alert(
            'QR Code Detectado',
            `Destinatário: ${recipientName}\nValor: R$ ${qrData.amount}\nDescrição: ${qrData.description || 'Pagamento via QR Code'}`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Confirmar', onPress: () => router.push({
                pathname: '/screen/paymentConfirm',
                params: {
                  amount: qrData.amount,
                  recipient: qrData.recipient,
                  recipientName: recipientName,
                  description: qrData.description || 'Pagamento via QR Code'
                }
              }) }
            ]
          );
        } catch (fetchError) {
          Alert.alert(
            'QR Code Detectado',
            `Destinatário: ${qrData.recipient}\nValor: R$ ${qrData.amount}\nDescrição: ${qrData.description || 'Pagamento via QR Code'}`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Confirmar', onPress: () => router.push({
                pathname: '/screen/paymentConfirm',
                params: {
                  amount: qrData.amount,
                  recipient: qrData.recipient,
                  recipientName: qrData.recipient,
                  description: qrData.description || 'Pagamento via QR Code'
                }
              }) }
            ]
          );
        }
      } else {
        Alert.alert('QR Code Inválido', 'Este QR code não contém dados de pagamento válidos.');
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o QR code.');
      setScanned(false);
    }
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.buttonText, { color: theme.button }]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Escanear QR Code</Text>
      </View>

      {hasPermission ? (
        <>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={[styles.instructionText, { color: theme.text }]}>
              Posicione o QR code dentro da área de escaneamento
            </Text>
            {scanned && (
              <TouchableOpacity
                style={[styles.rescanButton, { backgroundColor: theme.button }]}
                onPress={() => setScanned(false)}
              >
                <Text style={[styles.rescanText, { color: '#FFFFFF' }]}>Escanear novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Ionicons name="camera" size={64} color={theme.textSecondary} />
          <Text style={[styles.errorText, { color: theme.text }]}>
            Scanner não disponível. Verifique as permissões e tente novamente.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.button }]}
            onPress={() => {
              setHasPermission(null);
              // Re-trigger permission request
              const getCameraPermissions = async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
              };
              getCameraPermissions();
            }}
          >
            <Text style={[styles.retryText, { color: '#FFFFFF' }]}>Tentar novamente</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    zIndex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  rescanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  rescanText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});