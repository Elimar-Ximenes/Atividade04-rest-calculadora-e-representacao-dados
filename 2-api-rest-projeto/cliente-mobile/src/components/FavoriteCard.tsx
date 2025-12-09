import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Country } from "../types/Country";

type FavoriteCardProps = {
  fav: Country & { comment?: string };
  onEdit: (fav: Country & { comment?: string }) => void;
  onDelete: (code: string) => void;
};

export function FavoriteCard({ fav, onEdit, onDelete }: FavoriteCardProps) {
  return (
    <View style={styles.card}>

      {/* Bandeira */}
      <Image source={{ uri: fav.flag }} style={styles.flag} />

      {/* Nome */}
      <Text style={styles.name}>
        {fav.name} ({fav.code})
      </Text>

      <Text style={styles.region}>{fav.region}</Text>

      {/* Comentário */}
      <Text style={styles.commentLabel}>Comentário:</Text>
      <Text style={styles.commentText}>
        {fav.comment ? fav.comment : "Sem comentário"}
      </Text>

      {/* Botões */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(fav)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeBtn} onPress={() => onDelete(fav.code)}>
          <Text style={styles.btnText}>Remover</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  width: "100%",            
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 14,
  marginBottom: 15,
  elevation: 3,
  },


  flag: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  region: {
    color: "#666",
    marginBottom: 8,
  },

  commentLabel: {
    fontWeight: "700",
  },

  commentText: {
    fontStyle: "italic",
    color: "#444",
    marginBottom: 10,
  },

  buttonsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
  width: "100%",
  },


  editBtn: {
  backgroundColor: "#ffaa00",
  paddingVertical: 10,
  borderRadius: 6,
  width: "48%",
  alignItems: "center",
},

  removeBtn: {
  backgroundColor: "#ff4444",
  paddingVertical: 10,
  borderRadius: 6,
  width: "48%",
  alignItems: "center",
},


  btnText: {
    fontWeight: "600",
    color: "#fff",
  },
});
