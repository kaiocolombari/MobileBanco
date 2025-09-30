import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";
import { getMockUserByCpf, getMockUserByPhone, getMockUserByChavePix } from "./mockData";

export const fetchUser = async () => {
  return await fetchUserMock();
}

export const fetchUserMock = async () => {
  return {
    usuario: {
      full_name: "Faricio Autista",
      email: "usuario@exemplo.com"
    },
    conta_bancaria: {
      saldo: 10.10
    }
  };
};

export const getDadosDestinatarioByCpf = async (cpf: string) => {
  return await getDadosDestinatarioByCpfMock(cpf);
}

export const getDadosDestinatarioByPhone = async (phone: string) => {
  return await getDadosDestinatarioByPhoneMock(phone);
}

export const getDadosDestinatarioByChavePix = async (chavePix: string) => {
  return await getDadosDestinatarioByChavePixMock(chavePix);
};

export const fetchUserByAccountId = async (id_conta: number, token: string) => {
  try {
    const response = await client.get(`/usuario/conta/${id_conta}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data.usuario;
    }
  } catch (error) {
    console.log("Erro ao buscar usuário por conta:", error);
    return null;
  }
};

export const fetchUserByAccountIdMock = (id_conta: number) => {
  const mockUsers = {
    1: { full_name: "João da Silva" },
    2: { full_name: "Maria Oliveira" },
    3: { full_name: "Pedro Santos" },
  };
  return mockUsers[id_conta as keyof typeof mockUsers] || { full_name: "Usuário Desconhecido" };
};

export const getDadosDestinatarioByCpfMock = async (cpf: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = getMockUserByCpf(cpf);
  if (!user) {
    return {
      status: 200,
      data: {
        conta: { id_conta: 999, saldo: 0, tipo_conta: "corrente", status_conta: "ativa" },
        usuario: {
          full_name: "Usuário Desconhecido",
          cpf: cpf
        }
      }
    };
  }
  return {
    status: 200,
    data: {
      conta: user.conta,
      usuario: {
        full_name: user.full_name,
        cpf: user.cpf
      }
    }
  };
};

export const getDadosDestinatarioByPhoneMock = async (phone: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = getMockUserByPhone(phone);
  if (!user) {
    return {
      status: 200,
      data: {
        conta: { id_conta: 999, saldo: 0, tipo_conta: "corrente", status_conta: "ativa" },
        usuario: {
          full_name: "Usuário Desconhecido",
          cpf: ""
        }
      }
    };
  }
  return {
    status: 200,
    data: {
      conta: user.conta,
      usuario: {
        full_name: user.full_name,
        cpf: user.cpf
      }
    }
  };
};

export const getDadosDestinatarioByChavePixMock = async (chavePix: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = getMockUserByChavePix(chavePix);
  if (!user) {
    return {
      status: 200,
      data: {
        conta: { id_conta: 999, saldo: 0, tipo_conta: "corrente", status_conta: "ativa" },
        usuario: {
          full_name: "Usuário Desconhecido",
          cpf: ""
        }
      }
    };
  }
  return {
    status: 200,
    data: {
      conta: user.conta,
      usuario: {
        full_name: user.full_name,
        cpf: user.cpf
      }
    }
  };
};
