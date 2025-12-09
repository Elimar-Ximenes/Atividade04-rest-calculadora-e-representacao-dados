import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Country } from "../types/Country";

type Props = {
  visible: boolean;
  country: Country | null;
  onClose: () => void;
  onConfirm: (code: string) => void;   // AGORA ACEITA O CÓDIGO
};

export function VoteModal({ visible, country, onClose, onConfirm }: Props) {
  if (!country) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>

          <Text style={styles.title}>Confirmar Voto</Text>

          <Text style={styles.countryName}>{country.name}</Text>

          <Image
            source={{ uri: country.flag }}
            style={styles.flag}
            resizeMode="contain"
          />

          <TouchableOpacity style={styles.confirmBtn} onPress={() => country && onConfirm(country.code)}>
            <Text style={styles.confirmText}>Confirmar voto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

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
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  countryName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  flag: {
    width: "100%",
    height: 110,
    borderRadius: 6,
    marginBottom: 20,
  },
  confirmBtn: {
    backgroundColor: "#2E8B57",
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeBtn: {
    backgroundColor: "#666",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  closeText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
