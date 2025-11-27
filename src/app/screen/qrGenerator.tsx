import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import QRCode from 'react-native-qrcode-svg';
import { fetchUser } from '../api/user';

const { width, height } = Dimensions.get('window');

export default function QrGenerator() {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [chave, setChave] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser();
        setChave(user.conta_bancaria.chave_transferencia);
      } catch (error) {
        console.error('Erro ao carregar chave:', error);
      }
    };
    loadUser();
  }, []);

  const handleGenerate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }
    setShowQR(true);
  };

  const qrData = JSON.stringify({
    type: 'payment',
    amount: parseFloat(amount),
    recipient: chave,
    description: description || 'Pagamento via QR Code'
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Gerar QR Code</Text>
      </View>

      {!showQR ? (
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Criar QR Code de Pagamento</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Gere um código QR para receber pagamentos via Pix
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Valor (R$)</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text, backgroundColor: theme.surface }]}
                placeholder="0,00"
                placeholderTextColor={theme.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text, backgroundColor: theme.surface }]}
                placeholder="Ex: Pagamento de serviço"
                placeholderTextColor={theme.textSecondary}
                value={description}
                onChangeText={setDescription}
                maxLength={100}
              />
            </View>

            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.button }]}
              onPress={handleGenerate}
            >
              <Ionicons name="qr-code" size={20} color="#FFFFFF" />
              <Text style={[styles.generateText, { color: '#FFFFFF' }]}>Gerar QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={[styles.qrCard, { backgroundColor: theme.card }]}>
            <View style={styles.qrHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={[styles.qrTitle, { color: theme.text }]}>QR Code Gerado</Text>
            </View>

            <Text style={[styles.qrSubtitle, { color: theme.textSecondary }]}>
              Mostre este código para receber o pagamento
            </Text>

            <View style={[styles.qrCodeContainer, { backgroundColor: '#FFFFFF' }]}>
              <QRCode
                value={qrData}
                size={180}
                color="black"
                backgroundColor="white"
              />
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="cash" size={16} color={theme.imageTintColor} />
                <Text style={[styles.detailText, { color: theme.text }]}>
                  R$ {parseFloat(amount).toFixed(2)}
                </Text>
              </View>
              {description ? (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text" size={16} color={theme.imageTintColor} />
                  <Text style={[styles.detailText, { color: theme.text }]}>
                    {description}
                  </Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.newButton, { backgroundColor: theme.button }]}
              onPress={() => {
                setShowQR(false);
                setAmount('');
                setDescription('');
              }}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={[styles.newText, { color: '#FFFFFF' }]}>Gerar Novo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  qrCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  qrCodeContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  details: {
    width: '100%',
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  newText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});