import client from "./client";

export const requestLogin = async (
  cpf: string,
  password: string
): Promise<any> => {
  const response = await client.post("/auth/login", { cpf, password });
  return response;
};
