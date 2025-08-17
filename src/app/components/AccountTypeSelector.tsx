import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AccountTypeSelectorProps {
  selectedType: "corrente" | "poupanca";
  onSelectType: (type: "corrente" | "poupanca") => void;
  disabled?: boolean;
}

export default function AccountTypeSelector({
  selectedType,
  onSelectType,
  disabled = false,
}: AccountTypeSelectorProps) {
  return (
    <View style={styles.accountTypeContainer}>
      <TouchableOpacity
        style={[
          styles.accountTypeButton,
          selectedType === "corrente" && styles.accountTypeButtonActive,
        ]}
        onPress={() => onSelectType("corrente")}
        disabled={disabled}
      >
        <Text
          style={[
            styles.accountTypeText,
            selectedType === "corrente" && styles.accountTypeTextActive,
          ]}
        >
          Conta Corrente
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.accountTypeButton,
          selectedType === "poupanca" && styles.accountTypeButtonActive,
        ]}
        onPress={() => onSelectType("poupanca")}
        disabled={disabled}
      >
        <Text
          style={[
            styles.accountTypeText,
            selectedType === "poupanca" && styles.accountTypeTextActive,
          ]}
        >
          Conta Poupança
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  accountTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  accountTypeButton: {
    width: "48%",
    height: height * 0.06,
    backgroundColor: "#E8F1F2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  accountTypeButtonActive: {
    borderColor: "#1B98E0",
    backgroundColor: "#F0F8FF",
  },
  accountTypeText: {
    color: "#666",
    fontSize: width * 0.04,
    fontFamily: "Roboto_400Regular",
  },
  accountTypeTextActive: {
    color: "#1B98E0",
    fontWeight: "bold",
  },
});
