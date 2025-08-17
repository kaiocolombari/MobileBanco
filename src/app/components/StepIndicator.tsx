import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.stepIndicator}>
      <View
        style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}
      />
      <View
        style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]}
      />
      <View
        style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}
      />
      <View
        style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]}
      />
      <View
        style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}
      />
      <View
        style={[styles.stepLine, currentStep >= 4 && styles.stepLineActive]}
      />
      <View
        style={[styles.stepDot, currentStep >= 4 && styles.stepDotActive]}
      />
      <View
        style={[styles.stepLine, currentStep >= 5 && styles.stepLineActive]}
      />
      <View
        style={[styles.stepDot, currentStep >= 5 && styles.stepDotActive]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E8F1F2",
  },
  stepDotActive: {
    backgroundColor: "#1B98E0",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E8F1F2",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#1B98E0",
  },
});
