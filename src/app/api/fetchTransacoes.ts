import { useEffect, useState } from "react";
import client from "./client";

export interface Transacao {
    id_transacao: number;
    valor: number;
    tipo: 'transferência' | string;
    descricao: string;
    status: string;
    data: "2023-07-15",
    hora: "10:30",
    tipoBanco: "itau",
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
                data: "2023-07-15",
                hora: "10:30",
                tipoBanco: "itau",
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
                data: "2023-07-15",
                hora: "10:30",
                tipoBanco: "itau",
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