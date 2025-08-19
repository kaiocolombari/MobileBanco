import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.0.6:3000/api/v1", // URL base da API
  timeout: 10000,
  withCredentials: true,
});

/* client.interceptors.request.use(
  (config) => {
    // Aqui podemos pegar o token do Zustand/SecureStore e inserir
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
); */

export default client;
