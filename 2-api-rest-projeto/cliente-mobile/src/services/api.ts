import { BASE_URL } from "../config/api";

export async function getFavorites() {
  const response = await fetch(`${BASE_URL}/favorites`);
  return response.json();
}

export async function addFavorite(code: string, comment?: string) {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, comment }),
  });
  return response.json();
}

export async function updateFavorite(code: string, comment: string) {
  const response = await fetch(`${BASE_URL}/favorites/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  return response.json();
}

export async function deleteFavorite(code: string) {
  const response = await fetch(`${BASE_URL}/favorites/${code}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function voteCountry(code: string) {
  const response = await fetch(`${BASE_URL}/votes/${code}`, {
    method: "POST",
  });
  return response.json();
}

export async function getVoteRanking() {
  const response = await fetch(`${BASE_URL}/votes/ranking`);
  return response.json();
}

export async function getCountries() {
  const response = await fetch(`${BASE_URL}/countries`);
  return response.json();
}
