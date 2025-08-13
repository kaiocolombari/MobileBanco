import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useState, useRef, useMemo } from 'react';
import { router } from 'expo-router';
import Rotas from '../../types/types.route';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const { width, height } = Dimensions.get('window');

export default function Register() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');

  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const snapPoints = useMemo(() => ['30%', '95%'], []);

  const handleOpen = () => bottomSheetRef.current?.expand();

  function formatarCPF(cpf: string) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  const handleCpfChange = (text: string) => setCpf(formatarCPF(text));

  const handleTelefoneChange = (text: string) => {
    const telLimpo = text.replace(/\D/g, '');
    let formatado = telLimpo;

    if (telLimpo.length <= 2) {
      formatado = `(${telLimpo}`;
    } else if (telLimpo.length <= 7) {
      formatado = `(${telLimpo.slice(0, 2)}) ${telLimpo.slice(2)}`;
    } else {
      formatado = `(${telLimpo.slice(0, 2)}) ${telLimpo.slice(2, 7)}-${telLimpo.slice(7, 11)}`;
    }

    setTelefone(formatado);
  };

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const telLimpo = telefone.replace(/\D/g, '');

    if (!cpf || !senha || !confirmarSenha || !email || !telefone || !nome) {
      alert('Preencha todos os campos.');
      return;
    }

    if (cpfLimpo.length !== 11) {
      alert('CPF inválido. Digite um CPF com 11 números.');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    if (!validarEmail(email)) {
      alert('E-mail inválido.');
      return;
    }

    if (telLimpo.length < 10 || telLimpo.length > 11) {
      alert('Telefone inválido.');
      return;
    }

    router.push(Rotas.DIGITAL_REGISTER);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIPER</Text>

      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Seja Bem-vindo!</Text>
        <Text style={styles.loginSubtitle}>Vamos começar registrando sua conta</Text>

        <TextInput
          placeholder="CPF"
          style={styles.loginInput}
          value={cpf}
          keyboardType="numeric"
          onChangeText={handleCpfChange}
          maxLength={14}
        />
        <TextInput
          placeholder="Senha"
          style={styles.loginInput}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirmar senha"
          style={styles.loginInput}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginBackButton} onPress={() => router.push(Rotas.LOGIN)}>
          <Text style={styles.loginBackText}>Já tem uma conta?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleOpen}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      {/* BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        keyboardBehavior="interactive"
      >
        <BottomSheetScrollView contentContainerStyle={styles.bottomContainer}>
          <Text style={styles.bottomTitle}>Dados adicionais</Text>
          <TextInput placeholder="Email" style={styles.loginInput} value={email} onChangeText={setEmail} />
          <TextInput placeholder="Telefone" style={styles.loginInput} keyboardType="numeric" value={telefone} onChangeText={handleTelefoneChange} />
          <TextInput placeholder="Nome completo" style={styles.loginInput} value={nome} onChangeText={setNome} />
          <TouchableOpacity style={styles.loginButtonB} onPress={()=>{router.push(Rotas.DIGITAL_REGISTER)}}>
            <Text style={styles.buttonText}>Prosseguir</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B98E0',
    flex: 1,
  },
  title: {
    fontSize: width * 0.15,
    color: 'white',
    textAlign: 'center',
    marginTop: height * 0.05,
    fontFamily: 'Sanchez_400Regular',
    marginBottom: height * 0.05,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: '8%',
    paddingVertical: '6%',
    flexGrow: 1,
  },
  loginTitle: {
    fontSize: width * 0.08,
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 5,
  },
  loginSubtitle: {
    fontSize: width * 0.045,
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 20,
  },
  loginInput: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#E8F1F2',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 12,
  },
  loginButton: {
    width: '50%',
    height: height * 0.06,
    backgroundColor: '#1B98E0',
    borderRadius: 20,
    marginTop: 15,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonB: {
    width: '50%',
    height: height * 0.06,
    backgroundColor: '#1B98E0',
    borderRadius: 20,
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontFamily: 'Roboto_400Regular',
  },
  loginBackButton: {
    marginTop: 8,
  },
  loginBackText: {
    color: 'blue',
    fontSize: width * 0.04,
  },
  bottomContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  bottomTitle: {
    fontSize: width * 0.08,
    color: 'black',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 20,
  },
});
