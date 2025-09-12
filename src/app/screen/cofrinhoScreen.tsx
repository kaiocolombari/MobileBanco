import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

type Goal = {
    id: string;
    name: string;
    target: number;
    current: number;
};

export default function CofrinhoScreen() {
    const [goals, setGoals] = useState<Goal[]>([
        { id: "1", name: "Dildo Gigante", target: 5000, current: 500 },
    ]);
    const [isAddMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
    const [isNewGoalModalVisible, setNewGoalModalVisible] = useState(false);
    const [isDeleteGoalModalVisible, setDeleteGoalModalVisible] = useState(false);
    const [isEditGoalModalVisible, setEditGoalModalVisible] = useState(false);
    const [isCompleteGoalModalVisible, setCompleteGoalModalVisible] = useState(false);
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
            setGoals((prev) =>
                prev.map((goal) =>
                    goal.id === selectedGoal.id
                        ? { ...goal, current: goal.current + amount }
                        : goal
                )
            );
            setAddMoneyModalVisible(false);
            setAddAmount("");
            setSelectedGoal(null);
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
            setGoals((prev) =>
                prev.map((goal) =>
                    goal.id === selectedGoal.id
                        ? { ...goal, target }
                        : goal
                )
            );
            setEditGoalModalVisible(false);
            setEditTarget("");
            setSelectedGoal(null);
        }
    };

    const openCompleteGoalModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setCompleteGoalModalVisible(true);
    };

    const handleCompleteGoal = () => {
        if (selectedGoal && selectedGoal.current >= selectedGoal.target) {
            setCompleteGoalModalVisible(false);
            setCongratulatoryModalVisible(true);
        } else {
            Alert.alert("Erro", "A meta ainda não foi atingida.");
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
                    <Ionicons name="arrow-back" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cofrinho</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>
                    Guarde dinheiro para seus objetivos e realize seus sonhos!
                </Text>

                {goals.map((goal) => {
                    const percent = (goal.current / goal.target) * 100;
                    return (
                        <View key={goal.id} style={styles.goalCard}>
                            <Text style={styles.goalName}>{goal.name}</Text>
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
                            <View style={styles.goalActionsSecondary}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => openEditGoalModal(goal)}
                                >
                                    <Ionicons name="pencil-outline" size={18} color="white" />
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.completeButton}
                                    onPress={() => openCompleteGoalModal(goal)}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                                    <Text style={styles.completeButtonText}>Concluir</Text>
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
                visible={isCompleteGoalModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCompleteGoalModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedGoal && (
                            <>
                                <Text style={styles.modalTitle}>Concluir Meta</Text>
                                <Text style={styles.deleteText}>
                                    Você guardou{" "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        {((selectedGoal.current / selectedGoal.target) * 100).toFixed(1)}%
                                    </Text>{" "}
                                    da meta de <Text style={{ fontWeight: "bold" }}>{selectedGoal.name}</Text>.
                                </Text>
                                <Text style={styles.deleteText}>
                                    Tem certeza que deseja concluir esta meta?
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setCompleteGoalModalVisible(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmButton, { backgroundColor: "#4CAF50" }]}
                                        onPress={handleCompleteGoal}
                                    >
                                        <Text style={styles.confirmButtonText}>Concluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
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
        backgroundColor: "#1B98E0",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 15,
        elevation: 4,
    },

    backButton: {
        paddingRight: 10
    },

    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "600"
    },

    scrollContent: {
        paddingBottom: 30
    },

    subtitle: {
        fontSize: width * 0.05,
        color: "#222",
        textAlign: "center",
        marginVertical: 12,
        paddingHorizontal: 20,
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

    goalName: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222"
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
});
