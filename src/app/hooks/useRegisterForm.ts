import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import Rotas from "../../types/types.route";
import {
  RequestRegister,
  RequestEmailInUse,
  RequestCpfInUse,
  RequestSendCodeVerification,
  RequestVerifyCode,
} from "../api/registerApi";

export interface RegisterFormData {
  // Step 1: Personal data
  cpf: string;
  telefone: string;
  nome: string;

  // Step 2: Credentials
  email: string;
  senha: string;
  confirmarSenha: string;

  // Step 3: Email verification
  codigoVerificacao: string;

  // Step 4: Address data
  rua: string;
  numero: string;
  cidade: string;
  uf: string;

  // Step 5: Account data
  tipoConta: "corrente" | "poupanca";
  senhaConta: string;
  confirmarSenhaConta: string;
}

export interface FormErrors {
  cpf: string;
  telefone: string;
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  codigoVerificacao: string;
  rua: string;
  numero: string;
  cidade: string;
  uf: string;
  senhaConta: string;
  confirmarSenhaConta: string;
}

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    cpf: "",
    telefone: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    codigoVerificacao: "",
    rua: "",
    numero: "",
    cidade: "",
    uf: "",
    tipoConta: "corrente",
    senhaConta: "",
    confirmarSenhaConta: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    cpf: "",
    telefone: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    codigoVerificacao: "",
    rua: "",
    numero: "",
    cidade: "",
    uf: "",
    senhaConta: "",
    confirmarSenhaConta: "",
  });

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [cpfChecked, setCpfChecked] = useState(false);

  const updateField = (
    field: keyof RegisterFormData,
    value: string | "corrente" | "poupanca"
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const clearAllErrors = () => {
    setErrors({
      cpf: "",
      telefone: "",
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      codigoVerificacao: "",
      rua: "",
      numero: "",
      cidade: "",
      uf: "",
      senhaConta: "",
      confirmarSenhaConta: "",
    });
  };

  const setFieldError = (field: keyof FormErrors, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const formatarCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleCpfChange = (text: string) => {
    const formatted = formatarCPF(text);
    updateField("cpf", formatted);
    setCpfChecked(false);
  };

  const handleTelefoneChange = (text: string) => {
    const telLimpo = text.replace(/\D/g, "");
    let formatado = telLimpo;

    if (telLimpo.length <= 2) {
      formatado = telLimpo;
    } else if (telLimpo.length <= 6) {
      formatado = `${telLimpo.slice(0, 2)} ${telLimpo.slice(2)}`;
    } else if (telLimpo.length <= 10) {
      formatado = `${telLimpo.slice(0, 2)} ${telLimpo.slice(
        2,
        6
      )}-${telLimpo.slice(6)}`;
    } else {
      formatado = `${telLimpo.slice(0, 2)} ${telLimpo.slice(
        2,
        7
      )}-${telLimpo.slice(7, 11)}`;
    }

    updateField("telefone", formatado);
  };

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const verificarCpfExistente = async (cpf: string): Promise<boolean> => {
    try {
      setLoading(true);

      // TESTE: Simular resposta da API para debug
      if (cpf === "12345678901") {
        setLoading(false);
        return true; // CPF já existe
      }

      if (cpf === "11111111111") {
        setLoading(false);
        return false; // CPF disponível
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(console.error("Timeout: Requisição demorou muito")),
          10000
        );
      });

      const responsePromise = await RequestCpfInUse(cpf);
      const response = (await Promise.race([
        responsePromise,
        timeoutPromise,
      ])) as any;

      const cpfExiste = response.data.status !== "success";
      return cpfExiste;
    } catch (error: any) {
      console.log(error);
      if (error.message.includes("Timeout")) {
        setFieldError(
          "cpf",
          "A verificação do CPF demorou muito. Tente novamente."
        );
      } else {
        setFieldError(
          "cpf",
          "Não foi possível verificar se o CPF já existe. Tente novamente."
        );
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  const verificarEmailExistente = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await RequestEmailInUse(email);
      return response.data.status !== "success";
    } catch (error: any) {
      setFieldError(
        "email",
        "Não foi possível verificar se o email já existe. Tente novamente."
      );
      return true;
    } finally {
      setLoading(false);
    }
  };

  const enviarCodigoVerificacao = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Enviando código de verificação para:", email);

      const response = await RequestSendCodeVerification(email);

      // Log the verification code for development
      if (response.data.code) {
        console.log("Código de verificação gerado:", response.data.code);
      }

      return true;
    } catch (error: any) {
      console.log(
        "Erro ao enviar código de verificação:",
        error.response?.data?.msg,
      );
      setFieldError(
        "codigoVerificacao",
        "Não foi possível enviar o código de verificação. Tente novamente."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigoVerificacao = async (): Promise<void> => {
    if (formData.email) {
      await enviarCodigoVerificacao(formData.email);
    }
  };

  const validarStep1 = async (): Promise<boolean> => {
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    const telLimpo = formData.telefone.replace(/\D/g, "");

    clearAllErrors();
    let hasError = false;

    if (!formData.cpf || !formData.telefone || !formData.nome) {
      if (!formData.cpf) setFieldError("cpf", "CPF é obrigatório.");
      if (!formData.telefone)
        setFieldError("telefone", "Telefone é obrigatório.");
      if (!formData.nome) setFieldError("nome", "Nome é obrigatório.");
      hasError = true;
    }

    if (cpfLimpo.length !== 11) {
      setFieldError("cpf", "Digite um CPF com 11 números.");
      hasError = true;
    }

    if (telLimpo.length !== 11) {
      setFieldError(
        "telefone",
        "Digite um telefone com 11 números (incluindo o 9 do celular)."
      );
      hasError = true;
    }

    if (hasError) return false;

    console.log("CPF verificado:", cpfChecked);

    setCpfChecked(false);

    if (!cpfChecked) {
      const cpfExiste = await verificarCpfExistente(cpfLimpo);
      if (cpfExiste) {
        setFieldError("cpf", "Este CPF já está sendo usado por outra conta.");
        return false;
      }
      setCpfChecked(true);
    }

    return true;
  };

  const validarStep2 = async (): Promise<boolean> => {
    clearAllErrors();
    let hasError = false;

    if (!formData.email || !formData.senha || !formData.confirmarSenha) {
      if (!formData.email) setFieldError("email", "E-mail é obrigatório.");
      if (!formData.senha) setFieldError("senha", "Senha é obrigatória.");
      if (!formData.confirmarSenha)
        setFieldError("confirmarSenha", "Confirmação de senha é obrigatória.");
      hasError = true;
    }

    if (formData.email && !validarEmail(formData.email)) {
      setFieldError("email", "Digite um e-mail válido.");
      hasError = true;
    }

    if (formData.senha && formData.senha.length < 6) {
      setFieldError("senha", "A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    if (
      formData.senha &&
      formData.confirmarSenha &&
      formData.senha !== formData.confirmarSenha
    ) {
      setFieldError("confirmarSenha", "As senhas não coincidem.");
      hasError = true;
    }

    if (hasError) return false;

    if (!emailChecked) {
      const emailExiste = await verificarEmailExistente(formData.email);
      if (emailExiste) {
        setFieldError(
          "email",
          "Este e-mail já está sendo usado por outra conta."
        );
        return false;
      }
      setEmailChecked(true);
    }

    // Enviar código de verificação automaticamente
    await enviarCodigoVerificacao(formData.email);

    return true;
  };

  const validarStep3 = async (): Promise<boolean> => {
    clearAllErrors();
    let hasError = false;

    if (!formData.codigoVerificacao) {
      setFieldError(
        "codigoVerificacao",
        "Código de verificação é obrigatório."
      );
      hasError = true;
    }

    if (formData.codigoVerificacao.length !== 6) {
      setFieldError("codigoVerificacao", "Código deve ter 6 dígitos.");
      hasError = true;
    }

    try {
      const response = await RequestVerifyCode(
        formData.email,
        formData.codigoVerificacao
      );

      if (response.data.status !== "success") {
        setFieldError("codigoVerificacao", "Código de verificação inválido.");
        hasError = true;
      }
    } catch (error: any) {
      setFieldError(
        "codigoVerificacao",
        "Erro ao verificar código. Tente novamente."
      );
      hasError = true;
    }

    return !hasError;
  };

  const validarStep4 = (): boolean => {
    clearAllErrors();
    let hasError = false;

    if (!formData.rua || !formData.numero || !formData.cidade || !formData.uf) {
      if (!formData.rua) setFieldError("rua", "Rua é obrigatória.");
      if (!formData.numero) setFieldError("numero", "Número é obrigatório.");
      if (!formData.cidade) setFieldError("cidade", "Cidade é obrigatória.");
      if (!formData.uf) setFieldError("uf", "UF é obrigatória.");
      hasError = true;
    }

    if (formData.uf && formData.uf.length !== 2) {
      setFieldError("uf", "UF deve ter 2 caracteres.");
      hasError = true;
    }

    return !hasError;
  };

  const validarStep5 = (): boolean => {
    clearAllErrors();
    let hasError = false;

    if (!formData.senhaConta || !formData.confirmarSenhaConta) {
      if (!formData.senhaConta)
        setFieldError("senhaConta", "Senha da conta é obrigatória.");
      if (!formData.confirmarSenhaConta)
        setFieldError(
          "confirmarSenhaConta",
          "Confirmação da senha da conta é obrigatória."
        );
      hasError = true;
    }

    if (
      formData.senhaConta &&
      (formData.senhaConta.length !== 6 || !/^\d+$/.test(formData.senhaConta))
    ) {
      setFieldError(
        "senhaConta",
        "A senha da conta deve ter exatamente 6 dígitos numéricos."
      );
      hasError = true;
    }

    if (
      formData.senhaConta &&
      formData.confirmarSenhaConta &&
      formData.senhaConta !== formData.confirmarSenhaConta
    ) {
      setFieldError("confirmarSenhaConta", "As senhas da conta não coincidem.");
      hasError = true;
    }

    return !hasError;
  };

  const nextStep = async () => {
    if (step === 1 && (await validarStep1())) {
      clearAllErrors();
      setStep(2);
    } else if (step === 2 && (await validarStep2())) {
      clearAllErrors();
      setStep(3);
    } else if (step === 3 && (await validarStep3())) {
      clearAllErrors();
      setStep(4);
    } else if (step === 4 && validarStep4()) {
      clearAllErrors();
      setStep(5);
    }
  };

  const prevStep = () => {
    clearAllErrors();
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const handleRegister = async () => {
    if (!validarStep5()) return;

    try {
      setLoading(true);

      const registerData = {
        usuario: {
          email: formData.email,
          full_name: formData.nome,
          password: formData.senha,
          confirm_password: formData.confirmarSenha,
          telefone: formData.telefone,
          cpf: formData.cpf.replace(/\D/g, ""),
        },
        endereco: {
          rua: formData.rua,
          numero: parseInt(formData.numero),
          cidade: formData.cidade,
          uf: formData.uf.toUpperCase(),
        },
        conta: {
          tipo_conta: formData.tipoConta,
          password: formData.senhaConta,
        },
      };

      const response = await RequestRegister(registerData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso!", "Conta criada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.push(Rotas.LOGIN),
          },
        ]);
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
      }
    } catch (error: any) {
      console.log("Telefone:", formData.telefone);
      console.log("CPF:", formData.cpf);
      console.log("Email:", formData.email);
      console.log("Nome:", formData.nome);
      console.log("Senha:", formData.senha);
      console.log("Confirmar senha:", formData.confirmarSenha);
      console.log("Rua:", formData.rua);
      console.log("Erro no registro:", error.response.data.msg);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao criar sua conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
