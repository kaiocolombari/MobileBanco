import { useEffect, useState } from "react";
import client from "./client";
import { fetchUser, fetchUserByAccountId } from "./user";

export interface Transacao {
    id_transacao: number;
    valor: number;
    tipo: 'transferência' | string;
    descricao: string;
    status: string;
    date: string,
    hora: string,
    tipoTransacao: 'enviado' | 'recebido';
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
        const response = await client.get('/transacao', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = response.data.data;
        if (!data) return [];
        else {
            const transacoesEnviadas = data.transacoesEnviadas.map((t: any) => ({
                ...t,
                tipoTransacao: 'enviado' as 'enviado'
            }));

            const transacoesRecebidas = data.transacoesRecebidas.map((t: any) => ({
                ...t,
                tipoTransacao: 'recebido' as 'recebido'
            }));

            return [...transacoesEnviadas, ...transacoesRecebidas].sort(
                (a, b) => b.id_transacao - a.id_transacao
            );
        }
    } catch (error) {
        console.log('Erro ao buscar transações:', error);
        return [];
    }
}


export async function fetchTransacoesMock(): Promise<Transacao[]> {
    const mockData = {
        transacoesEnviadas: [
            {
                id_transacao: 1,
                valor: 100.50,
                tipo: "transferência",
                descricao: "Transferência para amigo",
                date: new Date('2025-09-10').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                status: "aprovada",
                conta_destino: {
                    id_conta: 2,
                    tipo_conta: "corrente"
                }
            },
            {
                id_transacao: 3,
                valor: 0.50,
                tipo: "transferência",
                descricao: "Faricio",
                date: new Date('2025-09-08').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                status: "aprovada",
                conta_destino: {
                    id_conta: 2,
                    tipo_conta: "corrente"
                }
            }
        ],
        transacoesRecebidas: [
            {
                id_transacao: 2,
                valor: 200.75,
                tipo: "transferência",
                descricao: "Pagamento de serviço",
                status: "aprovada",
                date: new Date('2025-09-09').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                conta_origem: {
                    id_conta: 3,
                    tipo_conta: "poupanca"
                }
            }
        ]
    };

    if (!mockData) return [];
    else {
        const transacoesEnviadas = mockData.transacoesEnviadas.map(t => ({
            ...t,
            tipoTransacao: 'enviado' as 'enviado'
        }));

        const transacoesRecebidas = mockData.transacoesRecebidas.map(t => ({
            ...t,
            tipoTransacao: 'recebido' as 'recebido'
        }));

        return [...transacoesEnviadas, ...transacoesRecebidas].sort(
            (a, b) => b.id_transacao - a.id_transacao
        );
    }
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
        }

        return {
            ...transacao,
            tipoTransacao: transacao.tipoTransacao as 'enviado' | 'recebido',
            remetente,
            destinatario,
        };
    } catch (error) {
        console.error("Erro ao buscar transação por id:", error);
        return null;
    }
}

export async function transferir(token: string, password: string, value: number, cpf_destinatario: string, descricao: string) {
    try {
        const response = await client.post('/transacao', {
            password,
            value,
            cpf_destinatario,
            descricao
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Erro ao realizar transferência:', error);
        throw error;
    }
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

    // Use provided mock data or default
    const defaultMock = {
        status: "success",
        statusCode: 200,
        msg: "Saldo enviado com sucesso"
    };

    return mockData || defaultMock;
}

export async function fetchTransacaoByIdMock(id: number): Promise<Transacao | null> {
    const mockData = {
        transacoesEnviadas: [
            {
                id_transacao: 1,
                valor: 100.50,
                tipo: "transferência",
                descricao: "Transferência para amigo",
                date: new Date('2025-09-10').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                status: "aprovada",
                conta_destino: {
                    id_conta: 2,
                    tipo_conta: "corrente"
                }
            },
            {
                id_transacao: 3,
                valor: 0.50,
                tipo: "transferência",
                descricao: "Faricio",
                date: new Date('2025-09-08').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                status: "aprovada",
                conta_destino: {
                    id_conta: 2,
                    tipo_conta: "corrente"
                }
            }
        ],
        transacoesRecebidas: [
            {
                id_transacao: 2,
                valor: 200.75,
                tipo: "transferência",
                descricao: "Pagamento de serviço",
                status: "aprovada",
                date: new Date('2025-09-09').toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                conta_origem: {
                    id_conta: 3,
                    tipo_conta: "poupanca"
                }
            }
        ]
    };

    const allTransacoes = [
        ...mockData.transacoesEnviadas.map(t => ({
            ...t,
            tipoTransacao: 'enviado' as 'enviado'
        })),
        ...mockData.transacoesRecebidas.map(t => ({
            ...t,
            tipoTransacao: 'recebido' as 'recebido'
        }))
    ];

    const transacao = allTransacoes.find(t => t.id_transacao === id);

    if (!transacao) {
        return null;
    }

    // Add mock user data
    let remetente, destinatario;

    if (transacao.tipoTransacao === 'enviado') {
        remetente = { full_name: "Faricio Autista" }; // Mock logged user
        if (transacao.conta_destino) {
            const destUser = { full_name: "Maria Oliveira" }; // Mock for id 2
            destinatario = destUser;
        }
    } else if (transacao.tipoTransacao === 'recebido') {
        destinatario = { full_name: "Faricio Autista" };
        if (transacao.conta_origem) {
            const origUser = { full_name: "Pedro Santos" }; // Mock for id 3
            remetente = origUser;
        }
    }

    return {
        ...transacao,
        remetente,
        destinatario,
    };
}
