import { useEffect, useState } from "react";
import client from "./client";
import { fetchUser, fetchUserByAccountId } from "./user";
import {
    mockUsers,
    mockTransactions,
    getMockUserByCpf,
    updateUserBalance,
    addMockTransaction,
    getNextTransactionId,
    MockTransaction
} from "./mockData";

export interface Transacao {
    id_transacao: number;
    valor: number;
    tipo: 'transferência' | string;
    descricao: string;
    status: string;
    date: string,
    hora: string,
    tipoTransacao: 'enviado' | 'recebido' | 'boleto';
    conta_origem?: {
        id_conta: number;
        tipo_conta: string;
    };
    conta_destino?: {
        id_conta: number;
        tipo_conta: string;
    };
    remetente?: {
        full_name: string;
    };
    destinatario?: {
        full_name: string;
    };
}

export async function fetchTransacoes(token: string): Promise<Transacao[]> {
  try {
    const response = await client.get("/transacao/");
    if (response.data.status === "success") {
      return response.data.data.transacoesEnviadas.concat(response.data.data.transacoesRecebidas).map((t: any) => ({
        id_transacao: t.id_transacao,
        valor: t.valor,
        tipo: t.tipo,
        descricao: t.descricao,
        status: t.status,
        date: new Date(t.createdAt).toLocaleDateString('pt-BR'),
        hora: new Date(t.createdAt).toLocaleTimeString('pt-BR'),
        tipoTransacao: t.tipo === 'transferência' ? (t.conta_origem ? 'enviado' : 'recebido') : 'boleto',
        conta_origem: t.conta_origem,
        conta_destino: t.conta_destino,
        remetente: t.usuario_origem ? { full_name: t.usuario_origem.full_name } : undefined,
        destinatario: t.usuario_destino ? { full_name: t.usuario_destino.full_name } : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
}


export async function fetchTransacoesMock(): Promise<Transacao[]> {
    // Use the dynamic mockTransactions array
    const transacoesEnviadas = mockTransactions
        .filter(t => t.tipoTransacao === 'enviado')
        .map(t => ({ ...t }));

    const transacoesRecebidas = mockTransactions
        .filter(t => t.tipoTransacao === 'recebido')
        .map(t => ({ ...t }));

    const transacoesBoletos = mockTransactions
        .filter(t => t.tipoTransacao === 'boleto')
        .map(t => ({ ...t }));

    return [...transacoesEnviadas, ...transacoesRecebidas, ...transacoesBoletos].sort(
        (a, b) => b.id_transacao - a.id_transacao
    );
}

export async function fetchTransacaoById(id: number, token: string) {
    try {
        const response = await client.get(`/transacao/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const transacao = response.data.data;
        if (!transacao) return null;

        // Fetch logged user
        const loggedUser = await fetchUser();
        const loggedUserName = loggedUser?.usuario?.full_name || "Usuário";

        let remetente, destinatario;

        if (transacao.tipoTransacao === 'enviado') {
            remetente = { full_name: loggedUserName };
            if (transacao.conta_destino) {
                const destUser = await fetchUserByAccountId(transacao.conta_destino.id_conta, token);
                destinatario = { full_name: destUser?.full_name || "Destinatário" };
            }
        } else if (transacao.tipoTransacao === 'recebido') {
            destinatario = { full_name: loggedUserName };
            if (transacao.conta_origem) {
                const origUser = await fetchUserByAccountId(transacao.conta_origem.id_conta, token);
                remetente = { full_name: origUser?.full_name || "Remetente" };
            }
        } else if (transacao.tipoTransacao === 'boleto') {
            destinatario = { full_name: loggedUserName };
            if (transacao.conta_origem) {
                const origUser = await fetchUserByAccountId(transacao.conta_origem.id_conta, token);
                remetente = { full_name: origUser?.full_name || "Boleto" };
            }
        }

        return {
            ...transacao,
            tipoTransacao: transacao.tipoTransacao as 'enviado' | 'recebido' | 'boleto',
            remetente,
            destinatario,
        };
    } catch (error) {
        console.error("Erro ao buscar transação por id:", error);
        return null;
    }
}

export async function transferir(token: string, password: string, value: number, cpf_destinatario: string, descricao: string) {
  const response = await client.post("/transacao/", { password, value, cpf_destinatario, descricao });
  return response;
}

export async function transferirMock(password: string, value: number, cpf_destinatario: string, descricao: string, mockData?: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (password !== '123456') {
        throw new Error('Senha inválida');
    }
    if (value <= 0) {
        throw new Error('Valor deve ser maior que zero');
    }
    if (!cpf_destinatario || cpf_destinatario.length !== 11) {
        throw new Error('CPF inválido');
    }

    // Find sender (assuming logged user is the first one - Faricio)
    const sender = mockUsers[0]; // Faricio Autista
    if (sender.conta.saldo < value) {
        throw new Error('Saldo insuficiente');
    }

    // Find recipient
    const recipient = getMockUserByCpf(cpf_destinatario);
    if (!recipient) {
        throw new Error('Destinatário não encontrado');
    }

    // Perform transfer
    const newSenderBalance = sender.conta.saldo - value;
    const newRecipientBalance = recipient.conta.saldo + value;

    updateUserBalance(sender.conta.id_conta, newSenderBalance);
    updateUserBalance(recipient.conta.id_conta, newRecipientBalance);

    // Create transaction record
    const transactionId = getNextTransactionId();
    const now = new Date();
    const newTransaction: MockTransaction = {
        id_transacao: transactionId,
        valor: value,
        tipo: "transferência",
        descricao: descricao || "Transferência via app",
        status: "aprovada",
        date: now.toLocaleDateString('pt-BR'),
        hora: now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        tipoTransacao: 'enviado',
        conta_origem: {
            id_conta: sender.conta.id_conta,
            tipo_conta: sender.conta.tipo_conta
        },
        conta_destino: {
            id_conta: recipient.conta.id_conta,
            tipo_conta: recipient.conta.tipo_conta
        },
        remetente: { full_name: sender.full_name },
        destinatario: { full_name: recipient.full_name }
    };

    addMockTransaction(newTransaction);

    // Use provided mock data or default
    const defaultMock = {
        status: "success",
        statusCode: 200,
        msg: "Saldo enviado com sucesso",
        transactionId: transactionId
    };

    return mockData || defaultMock;
}

export async function fetchTransacaoByIdMock(id: number): Promise<Transacao | null> {
    const transacao = mockTransactions.find(t => t.id_transacao === id);

    if (!transacao) {
        return null;
    }

    return transacao;
}
