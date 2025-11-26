import React from "react";
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import Rotas from "../../types/types.route";

// Components
import {
  StepIndicator,
  Step1PersonalData,
  Step2Credentials,
  Step3EmailVerification,
  Step4Address,
  Step5Account,
  FormNavigation,
} from "../components";

// Hook
import { useRegisterForm } from "../hooks/useRegisterForm";

// Styles
import { registerStyles } from "../styles/registerStyles";

export default function Register() {
  const {
    formData,
    errors,
    step,
    loading,
    emailChecked,
    cpfChecked,
    updateField,
    handleCpfChange,
    handleTelefoneChange,
    nextStep,
    prevStep,
    handleRegister,
    reenviarCodigoVerificacao,
    checkPasswordRequirements,
  } = useRegisterForm();

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1PersonalData
            formData={formData}
            errors={errors}
            cpfChecked={cpfChecked}
            loading={loading}
            onUpdateField={updateField}
            onCpfChange={handleCpfChange}
            onTelefoneChange={handleTelefoneChange}
          />
        );
      case 2:
        return (
          <Step2Credentials
            formData={formData}
            errors={errors}
            emailChecked={emailChecked}
            loading={loading}
            onUpdateField={updateField}
            checkPasswordRequirements={checkPasswordRequirements}
          />
        );
      case 3:
        return (
          <Step3EmailVerification
            formData={formData}
            errors={errors}
            loading={loading}
            onUpdateField={updateField}
            onResendCode={reenviarCodigoVerificacao}
          />
        );
      case 4:
        return (
          <Step4Address
            formData={formData}
            errors={errors}
            loading={loading}
            onUpdateField={updateField}
          />
        );
      case 5:
        return (
          <Step5Account
            formData={formData}
            errors={errors}
            loading={loading}
            onUpdateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>VIPER</Text>

      <View style={registerStyles.loginContainer}>
        <Text style={registerStyles.loginTitle}>Seja Bem-vindo!</Text>
        <Text style={registerStyles.loginSubtitle}>
          Vamos começar registrando sua conta
        </Text>

        <StepIndicator currentStep={step} />

        <KeyboardAvoidingView
          style={registerStyles.stepScrollView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderCurrentStep()}
            <TouchableOpacity
              style={registerStyles.loginBackButton}
              onPress={() => router.push(Rotas.LOGIN)}
              disabled={loading}>
              <Text style={registerStyles.loginBackText}>Já tem uma conta?</Text>
            </TouchableOpacity>

            <FormNavigation
              currentStep={step}
              loading={loading}
              onNext={nextStep}
              onPrev={prevStep}
              onRegister={handleRegister}
            />


          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
