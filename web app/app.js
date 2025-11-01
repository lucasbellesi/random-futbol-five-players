// Claves de localStorage
const LS_PLAYERS_KEY = "equiposFifa_players";
const LS_TEAMS_KEY = "equiposFifa_lastTeams";

// Jugadores por defecto
const defaultPlayers = [
  { name: "Messi", rating: 95, pos: "DEL" },
  { name: "Cristiano", rating: 93, pos: "DEL" },
  { name: "De Bruyne", rating: 91, pos: "MC" },
  { name: "Mbappé", rating: 92, pos: "DEL" },
  { name: "Van Dijk", rating: 90, pos: "DFC" },
  { name: "Modric", rating: 89, pos: "MC" },
  { name: "Haaland", rating: 91, pos: "DEL" },
  { name: "Alisson", rating: 88, pos: "ARQ" },
  { name: "Rodri", rating: 90, pos: "MC" },
  { name: "Valverde", rating: 86, pos: "MC" },
];

const tbody = document.querySelector("#players-table tbody");
const teamsContainer = document.getElementById("teams-container");

// ======== STORAGE HELPERS ========
function savePlayersToLS(players) {
  localStorage.setItem(LS_PLAYERS_KEY, JSON.stringify(players));
}

function loadPlayersFromLS() {
  const data = localStorage.getItem(LS_PLAYERS_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function saveTeamsToLS(teams) {
  localStorage.setItem(LS_TEAMS_KEY, JSON.stringify(teams));
}

function loadTeamsFromLS() {
  const data = localStorage.getItem(LS_TEAMS_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

// ======== RENDERIZAR TABLA ========
function renderTable(players) {
  tbody.innerHTML = "";
  players.forEach((p, i) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = i + 1;
    tr.appendChild(tdIndex);

    const tdName = document.createElement("td");
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.value = p.name;
    inputName.setAttribute("data-idx", i);
    inputName.setAttribute("data-field", "name");
    inputName.setAttribute("aria-label", `Nombre jugador ${i + 1}`);
    tdName.appendChild(inputName);
    tr.appendChild(tdName);

    const tdRating = document.createElement("td");
    const inputRating = document.createElement("input");
    inputRating.type = "number";
    inputRating.min = 1;
    inputRating.max = 100;
    inputRating.value = p.rating;
    inputRating.setAttribute("data-idx", i);
    inputRating.setAttribute("data-field", "rating");
    inputRating.setAttribute("aria-label", `Puntaje jugador ${i + 1}`);
    tdRating.appendChild(inputRating);
    tr.appendChild(tdRating);

    const tdPos = document.createElement("td");
    const inputPos = document.createElement("input");
    inputPos.type = "text";
    inputPos.value = p.pos;
    inputPos.setAttribute("data-idx", i);
    inputPos.setAttribute("data-field", "pos");
    inputPos.setAttribute("aria-label", `Posición jugador ${i + 1}`);
    tdPos.appendChild(inputPos);
    tr.appendChild(tdPos);

    tbody.appendChild(tr);

    // attach listeners directly
    inputName.addEventListener("input", handlePlayerInputChange);
    inputRating.addEventListener("input", handlePlayerInputChange);
    inputPos.addEventListener("input", handlePlayerInputChange);
  });

  const heading = document.getElementById("players-heading");
  if (heading) heading.textContent = `Jugadores (${players.length})`;
}

function handlePlayerInputChange() {
  const players = getPlayersFromTable();
  savePlayersToLS(players);
}

function getPlayersFromTable() {
  const rows = tbody.querySelectorAll("tr");
  const players = [];
  rows.forEach((row, idx) => {
    const name = row.querySelector('input[data-field="name"]').value.trim() || `Jugador ${idx+1}`;
    const rating = parseInt(row.querySelector('input[data-field="rating"]').value, 10) || 1;
    const pos = row.querySelector('input[data-field="pos"]').value.trim() || "-";
    players.push({ name, rating, pos });
  });
  return players;
}

// ======== LÓGICA DE EQUIPOS ========
function splitIntoTeams(players) {
  const sorted = [...players].sort((a,b) => b.rating - a.rating);
  const pattern = ["dark","light","light","dark","dark","light","light","dark","dark","light"];
  const dark = [];
  const light = [];
  sorted.forEach((p, i) => {
    if (pattern[i] === "dark") dark.push(p);
    else light.push(p);
  });
  return { dark, light };
}

function renderTeams(teams) {
  teamsContainer.innerHTML = "";
  if (!teams || !teams.dark || !teams.light) {
    const p = document.createElement("p");
    p.textContent = "No hay equipos generados.";
    teamsContainer.appendChild(p);
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "teams";

  const darkDiv = document.createElement("div");
  darkDiv.className = "team dark";
  const h3dark = document.createElement("h3");
  h3dark.textContent = "Camiseta Oscura";
  darkDiv.appendChild(h3dark);
  teams.dark.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const span = document.createElement("span");
    span.textContent = `${p.name} (${p.pos})`;
    const strong = document.createElement("strong");
    strong.textContent = p.rating;
    card.appendChild(span);
    card.appendChild(strong);
    darkDiv.appendChild(card);
  });

  const lightDiv = document.createElement("div");
  lightDiv.className = "team light";
  const h3light = document.createElement("h3");
  h3light.textContent = "Camiseta Clara";
  lightDiv.appendChild(h3light);
  teams.light.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const span = document.createElement("span");
    span.textContent = `${p.name} (${p.pos})`;
    const strong = document.createElement("strong");
    strong.textContent = p.rating;
    card.appendChild(span);
    card.appendChild(strong);
    lightDiv.appendChild(card);
  });

  wrapper.appendChild(darkDiv);
  wrapper.appendChild(lightDiv);
  teamsContainer.appendChild(wrapper);
}

// ======== INICIALIZACIÓN ========
function init() {
  // 1. Intentar cargar jugadores guardados
  const storedPlayers = loadPlayersFromLS();
  if (storedPlayers && Array.isArray(storedPlayers) && storedPlayers.length === 10) {
    renderTable(storedPlayers);
  } else {
    // si no hay, usar los default
    renderTable(defaultPlayers);
    // y guardarlos para la próxima
    savePlayersToLS(defaultPlayers);
  }

  // 2. Intentar cargar equipos guardados
  const storedTeams = loadTeamsFromLS();
  if (storedTeams) {
    renderTeams(storedTeams);
  }
}

init();

// ======== EVENTOS DE BOTONES ========
document.getElementById("generate-btn").addEventListener("click", () => {
  const players = getPlayersFromTable();
  if (players.length !== 10) {
    alert("Tienen que ser exactamente 10 jugadores.");
    return;
  }
  const teams = splitIntoTeams(players);
  renderTeams(teams);
  saveTeamsToLS(teams);
  // también actualizamos la lista de jugadores (por si alguno estaba sin guardar)
  savePlayersToLS(players);
});

document.getElementById("clear-storage").addEventListener("click", () => {
  localStorage.removeItem(LS_PLAYERS_KEY);
  localStorage.removeItem(LS_TEAMS_KEY);
  renderTable(defaultPlayers);
  renderTeams(null);
});
