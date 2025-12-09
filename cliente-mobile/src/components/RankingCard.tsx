import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  item: {
    name: string;
    code: string;
    flag: string;
    votes: number;
  };
};

export function RankingCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.flag }} style={styles.flag} />

      <Text style={styles.name}>
        {item.name} ({item.code})
      </Text>

      <View style={styles.voteBadge}>
        <Text style={styles.voteText}>⭐ {item.votes} votos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 8,
    elevation: 3,
  },
  flag: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  voteBadge: {
    backgroundColor: "#1976D2",
    paddingVertical: 4,
    borderRadius: 6,
  },
  voteText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
