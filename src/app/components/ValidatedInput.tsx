import React from "react";
import { TextInput, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface ValidatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isValidated?: boolean;
  isLoading?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
}

export default function ValidatedInput({
  placeholder,
  value,
  onChangeText,
  error,
  isValidated,
  isLoading,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "sentences",
  editable = true,
}: ValidatedInputProps) {
  const getInputStyle = () => {
    const baseStyle = [styles.input];

    if (error) {
      baseStyle.push(styles.inputError);
    } else if (isValidated) {
      baseStyle.push(styles.inputValidated);
    }

    if (isLoading) {
      baseStyle.push(styles.inputLoading);
    }

    return baseStyle;
  };

  return (
    <>
      <TextInput
        placeholder={placeholder}
        style={getInputStyle()}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isValidated && !isLoading && !error && (
        <Text style={styles.validationText}>✓ Disponível</Text>
      )}
      {isLoading && !error && (
        <Text style={styles.loadingText}>Verificando...</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: height * 0.06,
    backgroundColor: "#E8F1F2",
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 12,
  },
  inputValidated: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#F0F9F0",
  },
  inputLoading: {
    opacity: 0.7,
    borderColor: "#FFA726",
    borderWidth: 1,
  },
  inputError: {
    borderColor: "#af4c4cff",
    borderWidth: 2,
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#af4c4cff",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    marginTop: 5,
    marginLeft: 12,
  },
  validationText: {
    color: "#4CAF50",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    marginTop: 5,
    marginLeft: 12,
  },
  loadingText: {
    color: "#FFA726",
    fontSize: width * 0.035,
    fontFamily: "Roboto_400Regular",
    marginTop: 5,
    marginLeft: 12,
    fontStyle: "italic",
  },
});
