export const BASE_URL = "http://192.168.1.3:8000";

// -------------------------------
// FAVORITES
// -------------------------------

export async function getFavorites() {
  const resp = await fetch(`${BASE_URL}/favorites`);
  return resp.json();
}

export async function addFavorite(code: string, comment?: string) {
  const resp = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, comment }),
  });
  return resp.json();
}

export async function updateFavorite(code: string, comment: string) {
  const resp = await fetch(`${BASE_URL}/favorites/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  return resp.json();
}

export async function deleteFavorite(code: string) {
  const resp = await fetch(`${BASE_URL}/favorites/${code}`, {
    method: "DELETE",
  });
  return resp.json();
}

// -------------------------------
// VOTES
// -------------------------------

export async function voteCountry(code: string) {
  const resp = await fetch(`${BASE_URL}/votes/${code}`, {
    method: "POST",
  });
  return resp.json();
}

export async function getVoteRanking() {
  const resp = await fetch(`${BASE_URL}/votes/ranking`);
  return resp.json();
}

// -------------------------------
// COUNTRIES
// -------------------------------

export async function getCountries() {
  const resp = await fetch(`${BASE_URL}/countries`);
  return resp.json();
}
