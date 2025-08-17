import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ValidatedInput from "../ValidatedInput";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step2CredentialsProps {
  formData: RegisterFormData;
  errors: FormErrors;
  emailChecked: boolean;
  loading: boolean;
  onUpdateField: (field: keyof RegisterFormData, value: string) => void;
}

export default function Step2Credentials({
  formData,
  errors,
  emailChecked,
  loading,
  onUpdateField,
}: Step2CredentialsProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Credenciais</Text>
      <Text style={styles.stepSubtitle}>Crie seu acesso</Text>

      <ValidatedInput
        placeholder="E-mail"
        value={formData.email}
        onChangeText={(text) => onUpdateField("email", text)}
        error={errors.email}
        isValidated={emailChecked}
        isLoading={loading}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Senha"
        value={formData.senha}
        onChangeText={(text) => onUpdateField("senha", text)}
        error={errors.senha}
        secureTextEntry
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Confirmar senha"
        value={formData.confirmarSenha}
        onChangeText={(text) => onUpdateField("confirmarSenha", text)}
        error={errors.confirmarSenha}
        secureTextEntry
        editable={!loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: width * 0.06,
    color: "black",
    fontFamily: "Roboto_400Regular",
    marginBottom: 5,
  },
  stepSubtitle: {
    fontSize: width * 0.04,
    color: "#666",
    fontFamily: "Roboto_400Regular",
    marginBottom: 20,
  },
});
