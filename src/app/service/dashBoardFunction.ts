import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTransacoesMock, Transacao, fetchTransacoes } from "../api/fetchTransacoes";
import { fetchUser, withdrawFromCofrinho } from "../api/user";

async function open(action: string, params?: any) {
    try {
        switch (action) {
            case 'navegar':
                if (params === undefined) throw new Error('Navegação sem parâmetro');
                else {
                    router.push(params);
                }
                break;
            case 'limpar':
                router.replace(params);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    }

}

export type Goal = {
    id: string;
    name: string;
    target: number;
    current: number;
    status: 'in_progress' | 'completed';
    createdAt: Date;
    completedAt?: Date;
};

export type DashboardData = {
    totalIncome: number;
    totalExpenses: number;
    totalPiggyBank: number;
    balance: number;
    monthlyData: { month: string; income: number; expenses: number }[];
    piggyBankGoals: { name: string; current: number; target: number; progress: number }[];
    transactionCategories: { category: string; amount: number; type: 'income' | 'expense' }[];
};

async function getDashboardAnalytics(): Promise<DashboardData> {
    try {
        const token = await AsyncStorage.getItem('token');
        const transactions: Transacao[] = token ? await fetchTransacoes(token) : [];
        const usuario = await fetchUser();

        const storedGoals = await AsyncStorage.getItem('goals');
        const goals: Goal[] = storedGoals ? JSON.parse(storedGoals).map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        })) : [];

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(trans => {
            if (trans.tipoTransacao === 'recebido') {
                totalIncome += trans.valor;
            } else if (trans.tipoTransacao === 'enviado') {
                totalExpenses += trans.valor;
            }
        });

        const totalPiggyBank = usuario.conta_bancaria.cofrinho || 0;
        const balance = totalIncome - totalExpenses - totalPiggyBank;

        const monthlyMap = new Map<string, { income: number; expenses: number }>();

        transactions.forEach(trans => {
            const date = new Date(trans.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { income: 0, expenses: 0 });
            }

            const monthData = monthlyMap.get(monthKey)!;
            if (trans.tipoTransacao === 'recebido') {
                monthData.income += trans.valor;
            } else if (trans.tipoTransacao === 'enviado') {
                monthData.expenses += trans.valor;
            }
        });

        const monthlyData = Array.from(monthlyMap.entries())
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month));

        // Check for completed goals and auto-withdraw
        for (let i = 0; i < goals.length; i++) {
            const goal = goals[i];
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            if (progress >= 100 && goal.current > 0) {
                // Auto-withdraw
                try {
                    await withdrawFromCofrinho(goal.current);
                    goals[i].current = 0;
                    goals[i].status = 'completed';
                } catch (error) {
                    console.error('Erro ao retirar meta concluída:', error);
                }
            }
        }

        // Save updated goals
        await AsyncStorage.setItem('goals', JSON.stringify(goals));

        const piggyBankGoals = goals.map(goal => ({
            name: goal.name,
            current: goal.current,
            target: goal.target,
            progress: goal.target > 0 ? (goal.current / goal.target) * 100 : 0,
        }));

        const transactionCategories = [
            { category: 'Transferências Recebidas', amount: totalIncome, type: 'income' as const },
            { category: 'Transferências Enviadas', amount: totalExpenses, type: 'expense' as const },
            { category: 'Cofrinho', amount: totalPiggyBank, type: 'expense' as const },
        ];

        return {
            totalIncome,
            totalExpenses,
            totalPiggyBank,
            balance,
            monthlyData,
            piggyBankGoals,
            transactionCategories,
        };
    } catch (error) {
        console.error('Errorrr ', error);
        return {
            totalIncome: 0,
            totalExpenses: 0,
            totalPiggyBank: 0,
            balance: 0,
            monthlyData: [],
            piggyBankGoals: [],
            transactionCategories: [],
        };
    }
}

export { getDashboardAnalytics };