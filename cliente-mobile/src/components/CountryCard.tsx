import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  name: string;
  code: string;
  region: string;
  flag: string;
  onFavorite: () => void;
  onVote: () => void;
};

export function CountryCard({ name, code, region, flag, onFavorite, onVote }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: flag }} style={styles.flag} />

      <Text style={styles.name}>{name} ({code})</Text>
      <Text style={styles.region}>{region}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.favoriteBtn} onPress={onFavorite}>
          <Text style={styles.btnText}>Favoritar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voteBtn} onPress={onVote}>
          <Text style={styles.btnText}>Votar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  flag: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  region: {
    color: "#555",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteBtn: {
    backgroundColor: "#1e88e5",
    padding: 10,
    borderRadius: 6,
    width: "48%",
  },
  voteBtn: {
    backgroundColor: "#43a047",
    padding: 10,
    borderRadius: 6,
    width: "48%",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
