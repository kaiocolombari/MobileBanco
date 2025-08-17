import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ValidatedInput from "../ValidatedInput";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step1PersonalDataProps {
  formData: RegisterFormData;
  errors: FormErrors;
  cpfChecked: boolean;
  loading: boolean;
  onUpdateField: (field: keyof RegisterFormData, value: string) => void;
  onCpfChange: (text: string) => void;
  onTelefoneChange: (text: string) => void;
}

export default function Step1PersonalData({
  formData,
  errors,
  cpfChecked,
  loading,
  onUpdateField,
  onCpfChange,
  onTelefoneChange,
}: Step1PersonalDataProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dados Pessoais</Text>
      <Text style={styles.stepSubtitle}>Informe seus dados básicos</Text>

      <ValidatedInput
        placeholder="CPF"
        value={formData.cpf}
        onChangeText={onCpfChange}
        error={errors.cpf}
        isValidated={cpfChecked}
        isLoading={loading}
        keyboardType="numeric"
        maxLength={14}
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Nome completo"
        value={formData.nome}
        onChangeText={(text) => onUpdateField("nome", text)}
        error={errors.nome}
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Telefone"
        value={formData.telefone}
        onChangeText={onTelefoneChange}
        error={errors.telefone}
        keyboardType="numeric"
        maxLength={13}
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
