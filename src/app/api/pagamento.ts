import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

export interface Pagamento {
    id_pagamento: number;
    valor: number;
    chave_pagamento: string;
    status_pagamento: 'pendente' | 'rejeitada' | 'aceita' | 'cancelada';
    id_conta_destino: number;
}

export interface PagamentoResponse {
    id_pagamento: number;
    valor: number;
    chave_pagamento: string;
    status_pagamento: string;
    id_conta_destino: number;
}

export interface PagamentoDetalhes {
    pagamento: Pagamento;
    conta_cobrador: {
        id_conta: number;
        tipo_conta: string;
        status_conta: string;
        usuario: {
            full_name: string;
            email: string;
        };
    };
}

// POST /pagamento - Criar novo pagamento pendente
export async function criarPagamento(token: string, valor: number) {
    try {
        const response = await client.post('/pagamento', {
            valor
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Erro ao criar pagamento:', error);
        throw error;
    }
}

export async function criarPagamentoMock(valor: number, mockData?: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (valor <= 0) {
        throw new Error('Valor deve ser maior que zero');
    }

    const defaultMock: PagamentoResponse = {
        id_pagamento: Math.floor(Math.random() * 1000),
        valor,
        chave_pagamento: 'a1b2c3d4e5f6g7h8i9j0', // Mock chave
        status_pagamento: 'pendente',
        id_conta_destino: 1
    };

    return mockData || {
        status: "success",
        statusCode: 201,
        msg: "Pagamento criado com sucesso",
        pagamento: defaultMock
    };
}

// GET /pagamento/:chave_pagamento - Obter detalhes do pagamento
export async function obterPagamento(chave_pagamento: string) {
    try {
        const response = await client.get(`/pagamento/${chave_pagamento}`);
        return response.data;
    } catch (error) {
        console.log('Erro ao obter pagamento:', error);
        throw error;
    }
}

export async function obterPagamentoMock(chave_pagamento: string, mockData?: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const defaultMock: PagamentoDetalhes = {
        pagamento: {
            id_pagamento: 1,
            valor: 150.75,
            chave_pagamento,
            status_pagamento: 'pendente',
            id_conta_destino: 1
        },
        conta_cobrador: {
            id_conta: 1,
            tipo_conta: 'corrente',
            status_conta: 'ativa',
            usuario: {
                full_name: 'João da Silva',
                email: 'usuario@exemplo.com'
            }
        }
    };

    return mockData || {
        status: "success",
        statusCode: 200,
        msg: "Pagamento encontrado com sucesso",
        ...defaultMock
    };
}

// POST /pagamento/pay - Realizar pagamento
export async function pagarPagamento(token: string, password: string, chave_pagamento: string) {
    try {
        const response = await client.post('/pagamento/pay', {
            password,
            chave_pagamento
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Erro ao realizar pagamento:', error);
        throw error;
    }
}

export async function pagarPagamentoMock(password: string, chave_pagamento: string, mockData?: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password !== '123456') {
        throw new Error('Senha inválida');
    }

    const defaultMock = {
        status: "success",
        statusCode: 200,
        msg: "Pagamento realizado com sucesso"
    };

    return mockData || defaultMock;
}

// DELETE /pagamento/:chave_pagamento - Cancelar pagamento
export async function cancelarPagamento(token: string, chave_pagamento: string) {
    try {
        const response = await client.delete(`/pagamento/${chave_pagamento}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Erro ao cancelar pagamento:', error);
        throw error;
    }
}

export async function cancelarPagamentoMock(chave_pagamento: string, mockData?: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const defaultMock = {
        status: "success",
        statusCode: 200,
        msg: "Pagamento cancelado com sucesso"
    };

    return mockData || defaultMock;
}