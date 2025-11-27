import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { router } from 'expo-router';
import ValidatedInput from '../components/ValidatedInput';
import { solicitarEmprestimo, listarEmprestimos, pagarParcela, Emprestimo, Parcela } from '../api/emprestimoApi';

const { width, height } = Dimensions.get('window');

export default function EmprestimoScreen() {
  const { theme } = useTheme();
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Emprestimo[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [interestRate] = useState(0.01); // Match backend rate of 1% per month

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

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const userLoans = await listarEmprestimos();
      setLoans(userLoans);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedParcela) return;

    if (!password || password.length !== 6) {
      Alert.alert('Erro', 'Digite uma senha de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await pagarParcela(selectedParcela.id_parcela, password);
      Alert.alert('Sucesso', 'Parcela paga com sucesso!');
      setSelectedParcela(null);
      setPassword('');
      loadLoans();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    const amount = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0;
    if (amount < 100) {
      Alert.alert('Erro', 'O valor mínimo do empréstimo é R$ 100,00');
      return;
    }
    if (amount > 10000) {
      Alert.alert('Erro', 'O valor máximo do empréstimo é R$ 10.000,00');
      return;
    }
    if (!password || password.length !== 6) {
      Alert.alert('Erro', 'Digite uma senha de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await solicitarEmprestimo(amount, loanTerm, password);
      Alert.alert(
        'Sucesso',
        'Empréstimo solicitado com sucesso! O valor foi creditado em sua conta.',
        [{ text: 'OK', onPress: () => {
          loadLoans();
          setLoanAmount('');
          setPassword('');
        } }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
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
            Mínimo: R$ 100,00 | Máximo: R$ 10.000,00
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Senha da Conta</Text>
          <ValidatedInput
            placeholder="Digite sua senha de 6 dígitos"
            value={password}
            onChangeText={(text) => setPassword(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Senha necessária para confirmar a solicitação
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

        {loans.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Suas Parcelas</Text>
            {loans.map((loan) =>
              loan.parcelas?.map((parcela) => (
                <View key={parcela.id_parcela} style={styles.loanItem}>
                  <View style={styles.loanInfo}>
                    <Text style={[styles.loanText, { color: theme.text }]}>
                      Parcela {parcela.numero_parcela} de {loan.prazo_meses}
                    </Text>
                    <Text style={[styles.loanText, { color: theme.text }]}>
                      Valor: {formatCurrency(parcela.valor_parcela)}
                    </Text>
                    <Text style={[styles.loanText, { color: theme.text }]}>
                      Vencimento: {new Date(parcela.data_vencimento).toLocaleDateString('pt-BR')}
                    </Text>
                    <Text style={[styles.loanText, { color: theme.text }]}>
                      Status: {parcela.status === 'pago' ? 'Pago' : parcela.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                    </Text>
                  </View>
                  {parcela.status !== 'pago' && (
                    <TouchableOpacity
                      style={[styles.payButton, { backgroundColor: theme.button }]}
                      onPress={() => setSelectedParcela(parcela)}
                    >
                      <Text style={styles.payButtonText}>Pagar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {selectedParcela && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Pagar Parcela</Text>
            <Text style={[styles.loanText, { color: theme.text }]}>
              Parcela {selectedParcela.numero_parcela}
            </Text>
            <Text style={[styles.loanText, { color: theme.text }]}>
              Valor: {formatCurrency(selectedParcela.valor_parcela)}
            </Text>
            <Text style={[styles.loanText, { color: theme.text }]}>
              Vencimento: {new Date(selectedParcela.data_vencimento).toLocaleDateString('pt-BR')}
            </Text>
            <ValidatedInput
              placeholder="Senha de 6 dígitos"
              value={password}
              onChangeText={(text) => setPassword(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
            />
            <View style={styles.paymentButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.card }]}
                onPress={() => {
                  setSelectedParcela(null);
                  setPassword('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: theme.button }]}
                onPress={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: theme.button }]}
          onPress={handleApply}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.applyButtonText}>Solicitar Empréstimo</Text>
          )}
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
  loanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  loanInfo: {
    flex: 1,
  },
  loanText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginVertical: 2,
  },
  payButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
  },
  paymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
  },
});