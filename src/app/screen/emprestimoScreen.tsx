import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { router } from 'expo-router';
import ValidatedInput from '../components/ValidatedInput';

const { width, height } = Dimensions.get('window');

export default function EmprestimoScreen() {
  const { theme } = useTheme();
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [interestRate] = useState(0.009);

  const calculatePayment = (principal: number, rate: number, months: number) => {
    if (principal <= 0 || months <= 0) return { monthly: 0, total: 0 };
    const monthlyRate = rate;
    const pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const total = pmt * months;
    return { monthly: pmt, total };
  };

  useEffect(() => {
    const amount = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0;
    const { monthly, total } = calculatePayment(amount, interestRate, loanTerm);
    setMonthlyPayment(monthly);
    setTotalPayment(total);
  }, [loanAmount, loanTerm, interestRate]);

  const handleApply = () => {
    const amount = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0;
    if (amount < 1000) {
      Alert.alert('Erro', 'O valor mínimo do empréstimo é R$ 1.000,00');
      return;
    }
    if (amount > 50000) {
      Alert.alert('Erro', 'O valor máximo do empréstimo é R$ 50.000,00');
      return;
    }
    Alert.alert(
      'Solicitação Enviada',
      'Sua solicitação de empréstimo foi enviada para análise. Você será notificado em breve.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ padding: height * 0.01, backgroundColor: theme.header }}></View>
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTitle }]}>Empréstimo</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Valor do Empréstimo</Text>
          <ValidatedInput
            placeholder="R$ 0,00"
            value={loanAmount}
            onChangeText={(text) => setLoanAmount(text)}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Mínimo: R$ 1.000,00 | Máximo: R$ 50.000,00
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Prazo</Text>
          <View style={styles.termSelector}>
            <TouchableOpacity
              style={[styles.termButton, { backgroundColor: theme.button }]}
              onPress={() => setLoanTerm(Math.max(6, loanTerm - 6))}
            >
              <Ionicons name="remove" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.termValue, { color: theme.primary }]}>
              {loanTerm} meses
            </Text>
            <TouchableOpacity
              style={[styles.termButton, { backgroundColor: theme.button }]}
              onPress={() => setLoanTerm(Math.min(60, loanTerm + 6))}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Prazo de 6 a 60 meses (incrementos de 6 meses)
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Taxa de Juros</Text>
          <Text style={[styles.rateValue, { color: theme.primary }]}>
            {(interestRate * 100).toFixed(2)}% ao mês
          </Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Taxa anual aproximada: {(interestRate * 12 * 100).toFixed(2)}%
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Resumo do Pagamento</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Parcela mensal:</Text>
            <Text style={[styles.summaryValue, { color: theme.primary }]}>
              {formatCurrency(monthlyPayment)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Valor total:</Text>
            <Text style={[styles.summaryValue, { color: theme.primary }]}>
              {formatCurrency(totalPayment)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Juros totais:</Text>
            <Text style={[styles.summaryValue, { color: theme.primary }]}>
              {formatCurrency(totalPayment - (parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0))}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Condições Gerais</Text>
          <Text style={[styles.termsText, { color: theme.textSecondary }]}>
            • O empréstimo está sujeito à análise de crédito.{'\n'}
            • Parcelas fixas durante todo o período.{'\n'}
            • Possibilidade de quitação antecipada sem multas.{'\n'}
            • Em caso de inadimplência, juros de mora de 2% ao mês.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: theme.button }]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Solicitar Empréstimo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
  card: {
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    marginTop: 5,
  },
  termValue: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
  },
  termSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  termButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  rateValue: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
  },
  applyButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});