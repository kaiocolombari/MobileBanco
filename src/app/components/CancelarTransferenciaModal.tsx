import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

interface CancelarTransferenciaModalProps {
  visible: boolean;
  onConfirmar: () => void;
  onFechar: () => void;
}

const CancelarTransferenciaModal: React.FC<CancelarTransferenciaModalProps> = ({
  visible,
  onConfirmar,
  onFechar,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onFechar}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.titulo}>Cancelar transferência?</Text>
          <Text style={styles.mensagem}>
            Se você sair agora, a transferência não será concluída.
          </Text>

          <View style={styles.botoesContainer}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={onFechar}>
              <Text style={styles.textoCancelar}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoConfirmar} onPress={onConfirmar}>
              <Text style={styles.textoConfirmar}>Sim, cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
  },
  mensagem: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  textoCancelar: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
  },
  botaoConfirmar: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#E63946",
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  textoConfirmar: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default CancelarTransferenciaModal;
