import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

export const fetchUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await client.get("/usuario", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return response.data
    }
    else {
      console.log("Erro:", response.status);
    }
  } catch (error) {
    console.log(error);
  }
}

export const fetchUserMock = async () => {
  return {
    usuario: {
      full_name: "Faricio Autista",
      email: "usuario@exemplo.com"
    },
    conta_bancaria: {
      saldo: -10000
    }
  };
};

export const getDadosDestinatarioByCpf = async (cpf: string) => {
  const response = await client.get(`/usuario/cpf/${cpf}`)

  return response;
}

export const getDadosDestinatarioByPhone = async (phone: string) => {
  const response = await client.get(`/usuario/phone/${phone}`)

  return response;
}

export const getDadosDestinatarioByChavePix = async (chavePix: string) => {
  const response = await client.get(`/usuario/chave-pix/${chavePix}`)

  return response;
} 