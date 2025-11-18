import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1", // URL base da API
  timeout: 100000,
  withCredentials: true,
});

client.interceptors.request.use(
  async (config) => {
    // Pegar o token do AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
