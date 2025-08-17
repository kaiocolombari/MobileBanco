import client from "./client";

interface IRegisterData {
  usuario: {
    email: string;
    full_name: string;
    password: string;
    confirm_password: string;
    telefone: string; // formato: "XX 9XXXX-XXXX"
    cpf: string; // 11 dígitos
  };
  endereco: {
    rua: string;
    numero: number;
    cidade: string;
    uf: string; // sigla de estado, ex: "SP"
  };
  conta: {
    tipo_conta: "corrente" | "poupanca";
    password: string; // 6 dígitos numéricos
  };
}

export const RequestRegister = async (RegisterData: IRegisterData) => {
  const response = await client.post(`/auth/register`, RegisterData);
  return response;
};

export const RequestEmailInUse = async (email: string) => {
  const response = await client.get(`/auth/email-in-use/${email}`);
  return response;
};

export const RequestCpfInUse = async (cpf: string) => {
  const response = await client.get(`/auth/cpf-in-use/${cpf}`);
  return response;
};

export const RequestSendCodeVerification = async (email: string) => {
  const response = await client.get(`/auth/send-code-verification/${email}`);
  return response;
};

export const RequestVerifyCode = async (email: string, code: string) => {
  const response = await client.post(`/auth/verify-code/`, { email, code });

  return response;
};
