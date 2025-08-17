import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ValidatedInput from "../ValidatedInput";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step3AddressProps {
  formData: RegisterFormData;
  errors: FormErrors;
  loading: boolean;
  onUpdateField: (field: keyof RegisterFormData, value: string) => void;
}

export default function Step3Address({
  formData,
  errors,
  loading,
  onUpdateField,
}: Step3AddressProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Endereço</Text>
      <Text style={styles.stepSubtitle}>Informe seu endereço</Text>

      <ValidatedInput
        placeholder="Rua"
        value={formData.rua}
        onChangeText={(text) => onUpdateField("rua", text)}
        error={errors.rua}
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Número"
        value={formData.numero}
        onChangeText={(text) => onUpdateField("numero", text)}
        error={errors.numero}
        keyboardType="numeric"
        editable={!loading}
      />

      <ValidatedInput
        placeholder="Cidade"
        value={formData.cidade}
        onChangeText={(text) => onUpdateField("cidade", text)}
        error={errors.cidade}
        editable={!loading}
      />

      <ValidatedInput
        placeholder="UF (ex: SP)"
        value={formData.uf}
        onChangeText={(text) => onUpdateField("uf", text.toUpperCase())}
        error={errors.uf}
        maxLength={2}
        autoCapitalize="characters"
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
