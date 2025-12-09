import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

import { Header } from "../../src/components/Header";
import { SearchBar } from "../../src/components/SearchBar";
import { CountryCard } from "../../src/components/CountryCard";
import {
  getCountries,
  getFavorites,
  addFavorite,
  updateFavorite,
  deleteFavorite,
} from "../../src/services/api";

import { Country } from "../../src/types/Country";
import { FavoriteModal } from "../../src/components/FavoriteModal";
import { FavoriteCard } from "@/src/components/FavoriteCard";
import { VoteModal } from "../../src/components/VoteModal";
import { voteCountry, getVoteRanking } from "../../src/services/api";
import { RankingCard } from "@/src/components/RankingCard";

export default function HomeScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filtered, setFiltered] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);

  const [showVoteModal, setShowVoteModal] = useState(false);
  const [countryToVote, setCountryToVote] = useState<Country | null>(null);

  const [ranking, setRanking] = useState<any[]>([]);

  // Estados dos modais
  const [showFavModal, setShowFavModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [countryToFavorite, setCountryToFavorite] = useState<Country | null>(null);
  const [editingFavorite, setEditingFavorite] = useState<any | null>(null);

  // Carregar países
  useEffect(() => {
    async function load() {
      const data = await getCountries();
      setCountries(data.countries);
      setFiltered(data.countries);
      setLoading(false);
    }
    load();
  }, []);

  // Carregar favoritos
  useEffect(() => {
    async function loadFavs() {
      const data = await getFavorites();
      setFavorites(data.favorites);
    }
    loadFavs();
  }, []);

   useEffect(() => {
  async function loadRanking() {
    const data = await getVoteRanking();
    setRanking(data.ranking);
    }
    loadRanking();
  }, []);

  // Filtro de busca
  useEffect(() => {
    const text = search.toLowerCase();

    if (!text.trim()) {
      setFiltered(countries);
      return;
    }

    const result = countries.filter((c) =>
      c.name.toLowerCase().includes(text)
    );

    setFiltered(result);
  }, [search, countries]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Header title="Selecione o País" />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

        <SearchBar value={search} onChange={setSearch} />

        {/* LISTA COM SCROLL INTERNO */}
        <View style={styles.listBox}>
          <ScrollView>
            {filtered.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={styles.countryItem}
                onPress={() => setSelected(c)}
              >
                <Text style={styles.countryItemText}>
                  {c.name} ({c.code})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CARD DO PAÍS SELECIONADO */}
        {selected && (
          <View style={{ marginTop: 20 }}>
            <CountryCard
              name={selected.name}
              code={selected.code}
              region={selected.region}
              flag={selected.flag}
              onFavorite={() => {
                setCountryToFavorite(selected);
                setShowFavModal(true);
              }}
              onVote={() => {
                setCountryToVote(selected);
                setShowVoteModal(true);
              }}
            />
          </View>
        )}

        {/* LISTAGEM DE FAVORITOS */}
        {favorites.length > 0 && (
          <View style={styles.favSection}>
            <Text style={styles.favTitle}>⭐ Favoritos</Text>

            {favorites.map((fav) => (
            <FavoriteCard
              key={fav.code}
              fav={fav}
              onEdit={(f) => {
                setEditingFavorite(f);
                setShowEditModal(true);
              }}
              onDelete={async (code: string) => {
                await deleteFavorite(code);              
                const f = await getFavorites();          
                setFavorites(f.favorites);
              }}
            />
          ))}
          </View>
        )}

        {/* RANKING DOS MAIS VOTADOS */}
        {ranking.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.rankTitle}>🔥 Top 10 Mais Votados</Text>

            <View style={styles.rankGrid}>
              {ranking.map((item) => (
                <RankingCard key={item.code} item={item} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL DE ADICIONAR FAVORITO */}
      <FavoriteModal
        visible={showFavModal}
        country={countryToFavorite}
        isEdit={false}
        onClose={() => setShowFavModal(false)}
        onSave={async (comment) => {
          if (!countryToFavorite) return;

          await addFavorite(countryToFavorite.code, comment);

          const f = await getFavorites();
          setFavorites(f.favorites);

          setShowFavModal(false);
        }}
      />

      {/* MODAL DE EDITAR FAVORITO */}
      <FavoriteModal
        visible={showEditModal}
        country={editingFavorite}
        isEdit={true}
        onClose={() => setShowEditModal(false)}
        onSave={async (newComment) => {
          if (!editingFavorite) return;

          await updateFavorite(editingFavorite.code, newComment);

          const f = await getFavorites();
          setFavorites(f.favorites);

          setShowEditModal(false);
        }}
      />

      <VoteModal
        visible={showVoteModal}
        country={countryToVote}
        onClose={() => setShowVoteModal(false)}
        onConfirm={async (code) => {
          await voteCountry(code);

          const r = await getVoteRanking();
          setRanking(r.ranking);

          setShowVoteModal(false);
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listBox: {
    maxHeight: 260,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 3,
  },
  countryItem: {
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    elevation: 1,
  },
  countryItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  favSection: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  favTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  rankTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  rankGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});


