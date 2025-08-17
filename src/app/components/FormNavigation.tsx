import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface FormNavigationProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
  onRegister: () => void;
}

export default function FormNavigation({
  currentStep,
  loading,
  onNext,
  onPrev,
  onRegister,
}: FormNavigationProps) {
  return (
    <View style={styles.buttonContainer}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onPrev}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}

      {currentStep < 5 ? (
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.buttonDisabled]}
          onPress={onNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verificando..." : "Próximo"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={onRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Criando Conta..." : "Registrar"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    width: "30%",
    height: height * 0.06,
    backgroundColor: "#E8F1F2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: width * 0.04,
    fontFamily: "Roboto_400Regular",
  },
  nextButton: {
    width: "65%",
    height: height * 0.06,
    backgroundColor: "#1B98E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    width: "70%",
    height: height * 0.06,
    backgroundColor: "#1B98E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045,
    fontFamily: "Roboto_400Regular",
  },
});
