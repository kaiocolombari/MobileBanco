import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ValidatedInput from "../ValidatedInput";
import { RegisterFormData, FormErrors } from "../../hooks/useRegisterForm";

const { width } = Dimensions.get("window");

interface Step3EmailVerificationProps {
  formData: RegisterFormData;
  errors: FormErrors;
  loading: boolean;
  onUpdateField: (field: keyof RegisterFormData, value: string) => void;
  onResendCode: () => void;
}

export default function Step3EmailVerification({
  formData,
  errors,
  loading,
  onUpdateField,
  onResendCode,
}: Step3EmailVerificationProps) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendCode = () => {
    if (canResend) {
      onResendCode();
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verificação de E-mail</Text>
      <Text style={styles.stepSubtitle}>
        Digite o código de 6 dígitos enviado para {formData.email}
      </Text>

      <ValidatedInput
        placeholder="Código de verificação (6 dígitos)"
        value={formData.codigoVerificacao}
        onChangeText={(text) => onUpdateField("codigoVerificacao", text)}
        error={errors.codigoVerificacao}
        keyboardType="numeric"
        maxLength={6}
        editable={!loading}
      />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Não recebeu o código?</Text>
        <TouchableOpacity
          style={[styles.resendButton, (!canResend || loading) && styles.resendButtonDisabled]}
          onPress={handleResendCode}
          disabled={!canResend || loading}
        >
          <Text style={[styles.resendButtonText, (!canResend || loading) && styles.resendButtonTextDisabled]}>
            {canResend ? "Reenviar código" : `Reenviar em ${countdown}s`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Verifique sua caixa de entrada e spam
        </Text>
        <Text style={styles.infoText}>
          • O código expira em 10 minutos
        </Text>
        <Text style={styles.infoText}>
          • Aguarde 1 minuto para reenviar
        </Text>
      </View>
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
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 12,
  },
  resendText: {
    color: "#666",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1B98E0",
  },
  resendButtonDisabled: {
    backgroundColor: "#E8F1F2",
  },
  resendButtonText: {
    color: "white",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    fontWeight: "500",
  },
  resendButtonTextDisabled: {
    color: "#999",
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  infoText: {
    color: "#666",
    fontSize: width * 0.032,
    fontFamily: "Roboto_400Regular",
    marginBottom: 5,
  },
});
