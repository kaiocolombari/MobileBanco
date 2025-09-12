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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={25} color="grey" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cofrinho</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>
                    Guarde dinheiro para seus objetivos e realize seus sonhos!
                </Text>
                <View style={styles.line}></View>

                <Text style={{ marginTop: 10, fontSize: width * 0.05, marginLeft: 20 }}>Metas</Text>

                {goals.map((goal) => {
                    const percent = (goal.current / goal.target) * 100;
                    const now = new Date();
                    const endDate = goal.status === 'completed' && goal.completedAt ? goal.completedAt : now;

                    const days = Math.floor((endDate.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <View key={goal.id} style={styles.goalCard}>
                            <View style={styles.statusContainer}>
                                <Ionicons name={goal.status === 'completed' ? 'checkmark-circle' : 'time-outline'} size={20} color={goal.status === 'completed' ? '#4CAF50' : '#FF9800'} />
                                <Text style={[styles.statusText, { color: goal.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                                    {goal.status === 'completed' ? 'Concluído' : 'Em andamento'}
                                </Text>
                            </View>
                            <View style={styles.goalNameContainer}>
                                <Text style={styles.goalName}>{goal.name}</Text>

                            </View>
                            <Text style={styles.daysText}>Dias: {days}</Text>
                            <Text style={styles.goalAmount}>
                                R$ {goal.current.toFixed(2)} / R$ {goal.target.toFixed(2)}
                            </Text>
                            <View style={styles.progressBar}>
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
                    style={styles.newGoalButton}
                    onPress={() => setNewGoalModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    <Text style={styles.newGoalButtonText}>Criar novo cofrinho</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={isAddMoneyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAddMoneyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Adicionar a {selectedGoal?.name}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Valor (R$)"
                            keyboardType="numeric"
                            value={addAmount}
                            onChangeText={setAddAmount}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setAddMoneyModalVisible(false);
                                    setAddAmount("");
                                    setSelectedGoal(null);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleAddMoney}>
                                <Text style={styles.confirmButtonText}>Adicionar</Text>
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
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Novo Cofrinho</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do objetivo"
                            value={newGoalName}
                            onChangeText={setNewGoalName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Meta (R$)"
                            keyboardType="numeric"
                            value={newGoalTarget}
                            onChangeText={setNewGoalTarget}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setNewGoalModalVisible(false);
                                    setNewGoalName("");
                                    setNewGoalTarget("");
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleCreateGoal}>
                                <Text style={styles.confirmButtonText}>Criar</Text>
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
                    <View style={styles.modalContent}>
                        {selectedGoal && (
                            <>
                                <Text style={styles.modalTitle}>Excluir Cofrinho</Text>
                                <Text style={styles.deleteText}>
                                    Você guardou{" "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        {((selectedGoal.current / selectedGoal.target) * 100).toFixed(1)}%
                                    </Text>{" "}
                                    da meta de <Text style={{ fontWeight: "bold" }}>{selectedGoal.name}</Text>.
                                </Text>
                                <Text style={styles.deleteText}>
                                    Ainda faltam R$ {(selectedGoal.target - selectedGoal.current).toFixed(2)}.
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setDeleteGoalModalVisible(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
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
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Meta</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nova meta (R$)"
                            keyboardType="numeric"
                            value={editTarget}
                            onChangeText={setEditTarget}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setEditGoalModalVisible(false);
                                    setEditTarget("");
                                    setSelectedGoal(null);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleEditGoal}>
                                <Text style={styles.confirmButtonText}>Salvar</Text>
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
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Parabéns! 🎉</Text>
                        <Text style={styles.congratulatoryText}>
                            Você concluiu a meta de <Text style={{ fontWeight: "bold" }}>{selectedGoal?.name}</Text>!
                        </Text>
                        <Text style={styles.congratulatoryText}>
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
    container: { flex: 1, backgroundColor: "#F9FBFF" },

    header: {
        flexDirection: "row",
        paddingVertical: 18,
        paddingHorizontal: 15,
        elevation: 4,
        marginLeft: 15
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
        backgroundColor: "#E8F1F2",
        marginBottom: height * 0.02,
        marginTop: height * 0.04
    },

    goalCard: {
        backgroundColor: "white",
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
        color: "#222",
        flex: 1,
    },

    goalAmount: {
        fontSize: 15,
        fontWeight: "500",
        color: "#1B98E0",
        marginVertical: 6,
    },

    progressBar: {
        height: 10,
        backgroundColor: "#E6E6E6",
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
        backgroundColor: "#4CAF50",
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
        color: "white",
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
        backgroundColor: "white",
        padding: 22,
        borderRadius: 14,
        width: width * 0.85,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
        marginBottom: 15,
        textAlign: "center",
    },

    input: {
        borderWidth: 1.2,
        borderColor: "#1B98E0",
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
        fontSize: 15,
        color: "#333",
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    cancelButton: {
        backgroundColor: "#E0E0E0",
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
    },

    cancelButtonText: {
        color: "#555",
        fontWeight: "600"
    },

    confirmButton: {
        backgroundColor: "#1B98E0",
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
    },

    confirmButtonText: {
        color: "white",
        fontWeight: "600"
    },

    deleteText: {
        fontSize: 15,
        color: "#444",
        marginBottom: 10,
        textAlign: "center",
    },

    congratulatoryText: {
        fontSize: 16,
        color: "#222",
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
        color: '#666',
        marginTop: 4,
    },
});
