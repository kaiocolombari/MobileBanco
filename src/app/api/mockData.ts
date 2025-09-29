// Mock data for local testing
export interface MockUser {
  id: number;
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  chave_pix: string;
  conta: {
    id_conta: number;
    saldo: number;
    tipo_conta: string;
    status_conta: string;
  };
}

export interface MockTransaction {
  id_transacao: number;
  valor: number;
  tipo: string;
  descricao: string;
  status: string;
  date: string;
  hora: string;
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

export const mockUsers: MockUser[] = [
  {
    id: 1,
    full_name: "Faricio Autista",
    email: "faricio@example.com",
    cpf: "12345678901",
    phone: "11987654321",
    chave_pix: "faricio@pix",
    conta: {
      id_conta: 1,
      saldo: 10000.00,
      tipo_conta: "corrente",
      status_conta: "ativa"
    }
  },
  {
    id: 2,
    full_name: "João da Silva",
    email: "joao@example.com",
    cpf: "98765432100",
    phone: "11876543210",
    chave_pix: "joao@pix",
    conta: {
      id_conta: 2,
      saldo: 5000.00,
      tipo_conta: "corrente",
      status_conta: "ativa"
    }
  },
  {
    id: 3,
    full_name: "Maria Oliveira",
    email: "maria@example.com",
    cpf: "45678912345",
    phone: "11765432109",
    chave_pix: "maria@pix",
    conta: {
      id_conta: 3,
      saldo: 7500.00,
      tipo_conta: "poupanca",
      status_conta: "ativa"
    }
  },
  {
    id: 4,
    full_name: "Pedro Santos",
    email: "pedro@example.com",
    cpf: "32165498700",
    phone: "11654321098",
    chave_pix: "pedro@pix",
    conta: {
      id_conta: 4,
      saldo: 2500.00,
      tipo_conta: "corrente",
      status_conta: "ativa"
    }
  },
  {
    id: 5,
    full_name: "Ana Costa",
    email: "ana@example.com",
    cpf: "65432198765",
    phone: "11543210987",
    chave_pix: "ana@pix",
    conta: {
      id_conta: 5,
      saldo: 12000.00,
      tipo_conta: "corrente",
      status_conta: "ativa"
    }
  }
];

export let mockTransactions: MockTransaction[] = [
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
    tipoTransacao: 'enviado',
    conta_destino: {
      id_conta: 2,
      tipo_conta: "corrente"
    },
    remetente: { full_name: "Faricio Autista" },
    destinatario: { full_name: "João da Silva" },
  },
  {
    id_transacao: 2,
    valor: 200.75,
    tipo: "transferência",
    descricao: "Pagamento de serviço",
    status: "aprovada",
    tipoTransacao: 'recebido',
    date: new Date('2025-09-09').toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    conta_origem: {
      id_conta: 3,
      tipo_conta: "poupanca"
    },
    remetente: { full_name: "Maria Oliveira" },
    destinatario: { full_name: "Faricio Autista" }
  },
  {
    id_transacao: 3,
    valor: 550,
    tipo: "transferência",
    descricao: "Pagamento da conta de luz",
    status: "aprovada",
    tipoTransacao: 'boleto',
    date: new Date('2025-09-09').toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    conta_origem: {
      id_conta: 3,
      tipo_conta: "poupanca"
    },
    remetente: { full_name: "Carlos Luz inc." },
    destinatario: { full_name: "Faricio Autista" }
  }
];

export const getMockUserByCpf = (cpf: string): MockUser | null => {
  return mockUsers.find(user => user.cpf === cpf) || null;
};

export const getMockUserByPhone = (phone: string): MockUser | null => {
  return mockUsers.find(user => user.phone === phone) || null;
};

export const getMockUserByChavePix = (chavePix: string): MockUser | null => {
  return mockUsers.find(user => user.chave_pix === chavePix) || null;
};

export const getMockUserByAccountId = (id_conta: number): MockUser | null => {
  return mockUsers.find(user => user.conta.id_conta === id_conta) || null;
};

export const updateUserBalance = (id_conta: number, newBalance: number) => {
  const user = mockUsers.find(u => u.conta.id_conta === id_conta);
  if (user) {
    user.conta.saldo = newBalance;
  }
};

export const addMockTransaction = (transaction: MockTransaction) => {
  mockTransactions.unshift(transaction);
};

export const getNextTransactionId = (): number => {
  const maxId = Math.max(...mockTransactions.map(t => t.id_transacao));
  return maxId + 1;
};