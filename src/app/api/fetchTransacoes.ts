import { useEffect, useState } from "react";
import client from "./client";

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
                tipoTransacao: 'enviado'
            }));

            const transacoesRecebidas = data.transacoesRecebidas.map((t: any) => ({
                ...t,
                tipoTransacao: 'recebido'
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
            tipoTransacao: 'enviado'
        }));

        const transacoesRecebidas = mockData.transacoesRecebidas.map(t => ({
            ...t,
            tipoTransacao: 'recebido'
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

        return response.data.data;
    } catch (error) {
        console.error("Erro ao buscar transação por id:", error);
        return null;
    }
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
            tipoTransacao: 'enviado'
        })),
        ...mockData.transacoesRecebidas.map(t => ({
            ...t,
            tipoTransacao: 'recebido'
        }))
    ];

    const transacao = allTransacoes.find(t => t.id_transacao === id);

    if (!transacao) {
        return null;
    }

    return transacao;
}
