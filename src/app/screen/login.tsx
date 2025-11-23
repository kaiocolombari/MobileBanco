import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Rotas from "../../types/types.route";
import { requestLogin } from "../api/loginApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [cpf, setCpf] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function formatarCPF(cpf: string) {
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  const handleCpfChange = (text: string) => setCpf(formatarCPF(text));

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("enviando:", cpf.replace(/\D/g, ""));
      console.log("enviando:", senha);

      const responseApi = await requestLogin(cpf.replace(/\D/g, ""), senha);
      if (responseApi?.data.status === "success" && responseApi?.data.token) {

        await AsyncStorage.setItem("token", responseApi.data.token);
        router.push(Rotas.HOME);
      } else {
        setError("Credenciais inválidas");
      }
    } catch (e: any) {
      setError(
        e.response?.data?.msg || "Erro inesperado, tente novamente mais tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>VIPER</Text>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Bem-vindo de volta!</Text>
        <Text style={styles.loginSubtitle}>Reconecte com sua conta</Text>
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

        {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

        <TouchableOpacity style={styles.loginBackButton} onPress={() => { }}>
          <Text style={styles.loginBackText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1B98E0",
    flex: 1,
  },
  title: {
    fontSize: width * 0.15,
    color: "white",
    textAlign: "center",
    marginTop: height * 0.05,
    fontFamily: "Sanchez_400Regular",
    marginBottom: height * 0.05,
  },
  loginContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "8%",
    paddingVertical: "6%",
    flexGrow: 1,
  },
  loginTitle: {
    fontSize: width * 0.08,
    color: "black",
    fontFamily: "Roboto_400Regular",
    marginBottom: 5,
  },
  loginSubtitle: {
    fontSize: width * 0.045,
    color: "black",
    fontFamily: "Roboto_400Regular",
    marginBottom: 20,
  },
  loginInput: {
    width: "100%",
    height: height * 0.06,
    backgroundColor: "#E8F1F2",
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 12,
  },
  loginButton: {
    width: "50%",
    height: height * 0.06,
    backgroundColor: "#1B98E0",
    borderRadius: 20,
    marginTop: 15,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045,
    fontFamily: "Roboto_400Regular",
  },
  loginBackButton: {
    marginTop: 8,
  },
  loginBackText: {
    color: "blue",
    fontSize: width * 0.04,
  },
});
