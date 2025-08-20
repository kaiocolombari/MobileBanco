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
      full_name: "João da Silva",
      email: "usuario@exemplo.com"
    },
    conta_bancaria: {
      saldo: 1000
    }
  };
};