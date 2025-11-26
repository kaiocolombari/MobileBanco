import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import ValidatedInput from "../ValidatedInput";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step2CredentialsProps {
  formData: RegisterFormData;
  errors: FormErrors;
  emailChecked: boolean;
  loading: boolean;
  onUpdateField: (field: keyof RegisterFormData, value: string) => void;
  checkPasswordRequirements: (password: string) => {
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

export default function Step2Credentials({
  formData,
  errors,
  emailChecked,
  loading,
  onUpdateField,
  checkPasswordRequirements,
}: Step2CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordReqs = checkPasswordRequirements(formData.senha);

  const renderPasswordInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    show: boolean,
    setShow: (show: boolean) => void,
    error?: string
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        editable={!loading}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShow(!show)}
        disabled={loading}
      >
        <Image
          source={
            show
              ? require("../../../assets/view.png")
              : require("../../../assets/hide.png")
          }
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );


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

      {renderPasswordInput(
        "Senha",
        formData.senha,
        (text) => onUpdateField("senha", text),
        showPassword,
        setShowPassword,
        errors.senha
      )}

      <View style={styles.requirementsContainer}>
        <Text style={[styles.requirementText, passwordReqs.hasUppercase && styles.requirementMet]}>
          ✓ Pelo menos uma letra maiúscula
        </Text>
        <Text style={[styles.requirementText, passwordReqs.hasLowercase && styles.requirementMet]}>
          ✓ Pelo menos uma letra minúscula
        </Text>
        <Text style={[styles.requirementText, passwordReqs.hasNumbers && styles.requirementMet]}>
          ✓ Pelo menos um número
        </Text>
        <Text style={[styles.requirementText, passwordReqs.hasSpecialChars && styles.requirementMet]}>
          ✓ Pelo menos um caractere especial
        </Text>
        <Text style={[styles.requirementText, passwordReqs.hasSpecialChars && styles.requirementMet]}>
          ✓ Pelo menos 8 caracteres
        </Text>
      </View>

      {renderPasswordInput(
        "Confirmar senha",
        formData.confirmarSenha,
        (text) => onUpdateField("confirmarSenha", text),
        showConfirmPassword,
        setShowConfirmPassword,
        errors.confirmarSenha
      )}
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
  inputContainer: {
    marginTop: 15,
    position: 'relative',
  },
  input: {
    width: "100%",
    height: Dimensions.get("window").height * 0.06,
    backgroundColor: "#E8F1F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingRight: 50, // space for eye button
  },
  inputError: {
    borderColor: "#af4c4cff",
    borderWidth: 2,
    backgroundColor: "#FFF5F5",
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    color: "#af4c4cff",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    marginTop: 5,
    marginLeft: 12,
  },
  requirementsContainer: {
    marginTop: 10,
    marginLeft: 12,
  },
  requirementText: {
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    color: "#666",
    marginBottom: 2,
  },
  requirementMet: {
    color: "#4CAF50",
  },
});
