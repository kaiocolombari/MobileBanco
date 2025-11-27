import client from "./client";

export interface Emprestimo {
  id_emprestimo: number;
  id_conta: number;
  valor: number;
  taxa_juros: number;
  prazo_meses: number;
  saldo_devedor: number;
  status: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  parcelas?: Parcela[];
}

export interface Parcela {
  id_parcela: number;
  id_emprestimo: number;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: string;
  status: string;
  data_pagamento?: string;
}

export const solicitarEmprestimo = async (valor: number, prazo_meses: number, password: string) => {
  try {
    const response = await client.post("/emprestimo", {
      valor,
      prazo_meses,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.msg || "Erro ao solicitar empréstimo");
  }
};

export const listarEmprestimos = async () => {
  try {
    const response = await client.get("/emprestimo");
    return response.data.emprestimos as Emprestimo[];
  } catch (error: any) {
    throw new Error(error.response?.data?.msg || "Erro ao listar empréstimos");
  }
};

export const listarParcelas = async (id_emprestimo: number) => {
  try {
    const emprestimos = await listarEmprestimos();
    const emprestimo = emprestimos.find(e => e.id_emprestimo === id_emprestimo);
    return emprestimo?.parcelas || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.msg || "Erro ao listar parcelas");
  }
};

export const pagarParcela = async (id_parcela: number, password: string) => {
  try {
    const response = await client.post(`/emprestimo/pay/${id_parcela}`, {
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.msg || "Erro ao pagar parcela");
  }
};