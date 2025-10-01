import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Dimensions,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useTheme } from "../context/ThemeContext";
const { width, height } = Dimensions.get("window");

type Goal = {
    id: string;
    name: string;
    target: number;
    current: number;
    status: 'in_progress' | 'completed';
    createdAt: Date;
    completedAt?: Date;
};

export default function CofrinhoScreen() {
    const { theme } = useTheme();
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const stored = await AsyncStorage.getItem('goals');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const goalsWithDates = parsed.map((goal: any) => ({
                        ...goal,
                        createdAt: new Date(goal.createdAt),
                        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
                    }));
                    setGoals(goalsWithDates);
                } else {
                    setGoals([{ id: "1", name: "Dildo Gigante", target: 5000, current: 500, status: 'in_progress', createdAt: new Date() }]);
                }
            } catch (error) {
                console.error('Error loading goals:', error);
                setGoals([]);
            }
        };
        loadGoals();
    }, []);

    useEffect(() => {
        const saveGoals = async () => {
            try {
                const toSave = goals.map(goal => ({
                    ...goal,
                    createdAt: goal.createdAt.toISOString(),
                    completedAt: goal.completedAt ? goal.completedAt.toISOString() : null,
                }));
                await AsyncStorage.setItem('goals', JSON.stringify(toSave));
            } catch (error) {
                console.error('Error saving goals:', error);
            }
        };
        if (goals.length > 0) {
            saveGoals();
        }
    }, [goals]);
    const [isAddMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
    const [isNewGoalModalVisible, setNewGoalModalVisible] = useState(false);
    const [isDeleteGoalModalVisible, setDeleteGoalModalVisible] = useState(false);
    const [isEditGoalModalVisible, setEditGoalModalVisible] = useState(false);
    const [isCongratulatoryModalVisible, setCongratulatoryModalVisible] = useState(false);

    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [addAmount, setAddAmount] = useState("");
    const [newGoalName, setNewGoalName] = useState("");
    const [newGoalTarget, setNewGoalTarget] = useState("");
    const [editTarget, setEditTarget] = useState("");

    const handleAddMoney = () => {
        const amount = parseFloat(addAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert("Erro", "Digite um valor válido.");
            return;
        }
        if (selectedGoal) {
            const newCurrent = selectedGoal.current + amount;
            const isCompleted = newCurrent >= selectedGoal.target;
            setGoals((prev) =>
                prev.map((goal) =>
                    goal.id === selectedGoal.id
                        ? {
                            ...goal,
                            current: newCurrent,
                            ...(isCompleted && goal.status !== 'completed' ? { status: 'completed', completedAt: new Date() } : {})
                        }
                        : goal
                )
            );
            setAddMoneyModalVisible(false);
            setAddAmount("");
            if (isCompleted && selectedGoal.status !== 'completed') {
                setSelectedGoal({ ...selectedGoal, current: newCurrent });
                setCongratulatoryModalVisible(true);
            } else {
                setSelectedGoal(null);
            }
        }
    };

    const handleCreateGoal = () => {
        const target = parseFloat(newGoalTarget);
        if (!newGoalName.trim() || isNaN(target) || target <= 0) {
            Alert.alert("Erro", "Preencha nome e valor alvo válido.");
            return;
        }
        const newGoal: Goal = {
            id: Date.now().toString(),
            name: newGoalName,
            target,
            current: 0,
            status: 'in_progress',
            createdAt: new Date(),
        };
        setGoals((prev) => [...prev, newGoal]);
        setNewGoalModalVisible(false);
        setNewGoalName("");
        setNewGoalTarget("");
    };

    const openAddMoneyModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setAddMoneyModalVisible(true);
    };

    const openDeleteGoalModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setDeleteGoalModalVisible(true);
    };

    const handleDeleteGoal = () => {
        if (selectedGoal) {
            setGoals((prev) => prev.filter((goal) => goal.id !== selectedGoal.id));
            setDeleteGoalModalVisible(false);
            setSelectedGoal(null);
        }
    };

    const openEditGoalModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setEditTarget(goal.target.toString());
        setEditGoalModalVisible(true);
    };

    const handleEditGoal = () => {
        const target = parseFloat(editTarget);
        if (isNaN(target) || target <= 0) {
            Alert.alert("Erro", "Digite um valor alvo válido.");
            return;
        }
        if (selectedGoal) {
            const needsReset = target > selectedGoal.current && selectedGoal.status === 'completed';
            setGoals((prev) =>
                prev.map((goal) =>
                    goal.id === selectedGoal.id
                        ? {
                            ...goal,
                            target,
                            ...(needsReset ? { status: 'in_progress', completedAt: undefined } : {})
                        }
                        : goal
                )
            );
            setEditGoalModalVisible(false);
            setEditTarget("");
            setSelectedGoal(null);
        }
    };


    const getProgressColor = (percent: number) => {
        if (percent >= 80) return "#4CAF50";
        if (percent >= 40) return "#1B98E0";
        return "#FF7043";
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[{ padding: height * 0.01, backgroundColor: theme.header }]}></View>
            <View style={[styles.header, { backgroundColor: theme.header }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textTitle }]}>Cofrinho</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.subtitle, { color: theme.text }]}>
                    Guarde dinheiro para seus objetivos e realize seus sonhos!
                </Text>
                <View style={[styles.line, { backgroundColor: theme.imageButtonCircle }]}></View>

                <Text style={{ marginTop: 10, fontSize: width * 0.05, marginLeft: 20, color: theme.text }}>Metas</Text>

                {goals.map((goal) => {
                    const percent = (goal.current / goal.target) * 100;
                    const now = new Date();
                    const endDate = goal.status === 'completed' && goal.completedAt ? goal.completedAt : now;

                    const days = Math.floor((endDate.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.card }]}>
                            <View style={styles.statusContainer}>
                                <Ionicons name={goal.status === 'completed' ? 'checkmark-circle' : 'time-outline'} size={20} color={goal.status === 'completed' ? '#4CAF50' : '#FF9800'} />
                                <Text style={[styles.statusText, { color: goal.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                                    {goal.status === 'completed' ? 'Concluído' : 'Em andamento'}
                                </Text>
                            </View>
                            <View style={styles.goalNameContainer}>
                                <Text style={[styles.goalName, { color: theme.text }]}>{goal.name}</Text>

                            </View>
                            <Text style={[styles.daysText, { color: theme.textSecondary }]}>Dias: {days}</Text>
                            <Text style={[styles.goalAmount, { color: theme.accent }]}>
                                R$ {goal.current.toFixed(2)} / R$ {goal.target.toFixed(2)}
                            </Text>
                            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${Math.min(percent, 100)}%`,
                                            backgroundColor: getProgressColor(percent),
                                        },
                                    ]}
                                />
                            </View>
                            <View style={styles.goalActions}>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => openAddMoneyModal(goal)}
                                >
                                    <Ionicons name="cash-outline" size={18} color="white" />
                                    <Text style={styles.addButtonText}>Adicionar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => openDeleteGoalModal(goal)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="white" />
                                    <Text style={styles.deleteButtonText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                <TouchableOpacity
                    style={[styles.newGoalButton, { backgroundColor: theme.button }]}
                    onPress={() => setNewGoalModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    <Text style={[styles.newGoalButtonText, { color: theme.text }]}>Criar novo cofrinho</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={isAddMoneyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAddMoneyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Adicionar a {selectedGoal?.name}
                        </Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                            placeholder="Valor (R$)"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            value={addAmount}
                            onChangeText={setAddAmount}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: theme.surface }]}
                                onPress={() => {
                                    setAddMoneyModalVisible(false);
                                    setAddAmount("");
                                    setSelectedGoal(null);
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.button }]} onPress={handleAddMoney}>
                                <Text style={[styles.confirmButtonText, { color: theme.text }]}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isNewGoalModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setNewGoalModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Novo Cofrinho</Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                            placeholder="Nome do objetivo"
                            placeholderTextColor={theme.textSecondary}
                            value={newGoalName}
                            onChangeText={setNewGoalName}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                            placeholder="Meta (R$)"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            value={newGoalTarget}
                            onChangeText={setNewGoalTarget}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: theme.surface }]}
                                onPress={() => {
                                    setNewGoalModalVisible(false);
                                    setNewGoalName("");
                                    setNewGoalTarget("");
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.button }]} onPress={handleCreateGoal}>
                                <Text style={[styles.confirmButtonText, { color: theme.text }]}>Criar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isDeleteGoalModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteGoalModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        {selectedGoal && (
                            <>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Excluir Cofrinho</Text>
                                <Text style={[styles.deleteText, { color: theme.textSecondary }]}>
                                    Você guardou{" "}
                                    <Text style={{ fontWeight: "bold", color: theme.text }}>
                                        {((selectedGoal.current / selectedGoal.target) * 100).toFixed(1)}%
                                    </Text>{" "}
                                    da meta de <Text style={{ fontWeight: "bold", color: theme.text }}>{selectedGoal.name}</Text>.
                                </Text>
                                <Text style={[styles.deleteText, { color: theme.textSecondary }]}>
                                    Ainda faltam R$ {(selectedGoal.target - selectedGoal.current).toFixed(2)}.
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, { backgroundColor: theme.surface }]}
                                        onPress={() => setDeleteGoalModalVisible(false)}
                                    >
                                        <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmButton, { backgroundColor: "#E53935" }]}
                                        onPress={handleDeleteGoal}
                                    >
                                        <Text style={styles.confirmButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isEditGoalModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEditGoalModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Meta</Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                            placeholder="Nova meta (R$)"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            value={editTarget}
                            onChangeText={setEditTarget}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: theme.surface }]}
                                onPress={() => {
                                    setEditGoalModalVisible(false);
                                    setEditTarget("");
                                    setSelectedGoal(null);
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.button }]} onPress={handleEditGoal}>
                                <Text style={[styles.confirmButtonText, { color: theme.text }]}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                visible={isCongratulatoryModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCongratulatoryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Parabéns! 🎉</Text>
                        <Text style={[styles.congratulatoryText, { color: theme.textSecondary }]}>
                            Você concluiu a meta de <Text style={{ fontWeight: "bold", color: theme.text }}>{selectedGoal?.name}</Text>!
                        </Text>
                        <Text style={[styles.congratulatoryText, { color: theme.textSecondary }]}>
                            Você guardou R$ {selectedGoal?.current.toFixed(2)} dos R$ {selectedGoal?.target.toFixed(2)}.
                        </Text>
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: "#4CAF50", alignSelf: "center" }]}
                            onPress={() => {
                                setCongratulatoryModalVisible(false);
                                setSelectedGoal(null);
                            }}
                        >
                            <Text style={styles.confirmButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: "row",
        paddingVertical: 18,
        paddingHorizontal: 15,
        elevation: 4,
    },

    backButton: {
        paddingRight: 10,
        marginBottom: 15
    },

    headerTitle: {
        fontSize: width * 0.06,
        fontFamily: 'Roboto_400Regular',
    },

    scrollContent: {
        paddingBottom: 30
    },

    subtitle: {
        fontSize: width * 0.05,
        textAlign: "center",
        marginVertical: 12,
        paddingHorizontal: 20,
        fontFamily: 'Roboto_400Regular',
    },

    line: {
        width: "100%",
        height: 5,
        marginBottom: height * 0.02,
        marginTop: height * 0.04
    },

    goalCard: {
        marginHorizontal: 18,
        marginTop: 16,
        padding: 18,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    goalNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    goalName: {
        fontSize: 17,
        fontWeight: "600",
        flex: 1,
    },

    goalAmount: {
        fontSize: 15,
        fontWeight: "500",
        marginVertical: 6,
    },

    progressBar: {
        height: 10,
        borderRadius: 6,
        marginBottom: 12,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: 6
    },

    goalActions: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1B98E0",
        paddingVertical: 8,
        borderRadius: 10,
        flex: 0.48,
    },

    addButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },

    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E53935",
        paddingVertical: 8,
        borderRadius: 10,
        flex: 0.48,
    },

    deleteButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },

    goalActionsSecondary: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF9800",
        paddingVertical: 8,
        borderRadius: 10,
        flex: 0.48,
    },

    editButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },

    completeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        borderRadius: 10,
        flex: 0.48,
    },

    completeButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },

    newGoalButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        marginHorizontal: 18,
        marginTop: 22,
        borderRadius: 14,
        elevation: 4,
    },

    newGoalButtonText: {
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        padding: 22,
        borderRadius: 14,
        width: width * 0.85,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },

    input: {
        borderWidth: 1.2,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
        fontSize: 15,
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
    },

    cancelButtonText: {
        fontWeight: "600"
    },

    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
    },

    confirmButtonText: {
        fontWeight: "600"
    },

    deleteText: {
        fontSize: 15,
        marginBottom: 10,
        textAlign: "center",
    },

    congratulatoryText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },

    statusContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    statusText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },

    daysText: {
        fontSize: 14,
        marginTop: 4,
    },
});
