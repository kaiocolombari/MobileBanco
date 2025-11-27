import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { transferir } from '../api/fetchTransacoes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function PaymentConfirm() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const { amount, recipient, recipientName, description } = params;

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      Alert.alert('Erro', 'Digite sua senha');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await transferir(token, password, parseFloat(amount as string), recipient as string, description as string);

      if (response.status >= 200 && response.status < 300) {
        const transactionId = response.data?.transactionId;
        if (transactionId) {
          router.push(`/comprovante/${transactionId}`);
        } else {
          Alert.alert('Sucesso', 'Pagamento realizado com sucesso!', [
            { text: 'OK', onPress: () => router.push('/screen/pixScreen') }
          ]);
        }
      } else {
        Alert.alert('Erro', response.data.msg || 'Falha no pagamento');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.msg || 'Falha no pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Confirmar Pagamento</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Valor:</Text>
        <Text style={[styles.value, { color: theme.imageTintColor }]}>R$ {parseFloat(amount as string).toFixed(2)}</Text>

        <Text style={[styles.label, { color: theme.text }]}>Destinatário:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{recipientName || recipient}</Text>

        <Text style={[styles.label, { color: theme.text }]}>Descrição:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{description}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Senha:</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          placeholder="Digite sua senha"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, { backgroundColor: theme.button }]}
        onPress={handleConfirm}
        disabled={loading}
      >
        <Text style={[styles.confirmText, { color: '#FFFFFF' }]}>
          {loading ? 'Processando...' : 'Confirmar Pagamento'}
        </Text>
      </TouchableOpacity>
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
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});