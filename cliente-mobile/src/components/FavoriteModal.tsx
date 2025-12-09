import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Country } from "../types/Country";

type FavoriteModalProps = {
  visible: boolean;
  country: (Country & { comment?: string }) | null;
  initialComment?: string;
  isEdit?: boolean;              // ← modo edição
  onClose: () => void;
  onSave: (comment: string) => void;
};

export function FavoriteModal({
  visible,
  country,
  initialComment = "",
  isEdit = false,
  onClose,
  onSave,
}: FavoriteModalProps) {
  
  const [comment, setComment] = useState(initialComment);

  // Quando o modal abrir, recarregar o comentário inicial (edição)
  useEffect(() => {
    if (visible) {
      setComment(initialComment);
    }
  }, [visible, initialComment]);

  if (!country) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          
          {/* TITULO */}
          <Text style={styles.title}>
            {isEdit ? "Editar Comentário" : "Adicionar aos Favoritos"}
          </Text>

          {/* NOME DO PAÍS */}
          <Text style={styles.countryName}>{country.name}</Text>

          {/* BANDEIRA */}
          <Image
            source={{ uri: country.flag }}
            style={styles.flag}
            resizeMode="contain"
          />

          {/* CAMPO DE COMENTÁRIO */}
          <TextInput
            style={styles.input}
            placeholder="Digite um comentário"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {/* BOTÃO PRINCIPAL */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(comment)}
          >
            <Text style={styles.saveButtonText}>
              {isEdit ? "Salvar Alterações" : "Adicionar"}
            </Text>
          </TouchableOpacity>

          {/* BOTÃO FECHAR */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

// ============================
// ESTILOS
// ============================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  countryName: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  flag: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    backgroundColor: "#fafafa",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#1877f2",
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});