import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ValidatedInput from "../ValidatedInput";
import AccountTypeSelector from "../AccountTypeSelector";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step4AccountProps {
  formData: RegisterFormData;
  errors: FormErrors;
  loading: boolean;
  onUpdateField: (
    field: keyof RegisterFormData,
    value: string | "corrente" | "poupanca"
  ) => void;
}

export default function Step4Account({
  formData,
  errors,
  loading,
  onUpdateField,
}: Step4AccountProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Conta Bancária</Text>
      <Text style={styles.stepSubtitle}>Configure sua conta</Text>

      <AccountTypeSelector
        selectedType={formData.tipoConta}
        onSelectType={(type) => onUpdateField("tipoConta", type)}
        disabled={loading}
      />

      <ValidatedInput
        placeholder="Senha da conta (6 dígitos)"
        value={formData.senhaConta}
        onChangeText={(text) => onUpdateField("senhaConta", text)}
        error={errors.senhaConta}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Confirmar senha da conta"
        value={formData.confirmarSenhaConta}
        onChangeText={(text) => onUpdateField("confirmarSenhaConta", text)}
        error={errors.confirmarSenhaConta}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
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
