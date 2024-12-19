const express = require('express');

const app = express();
const PORT = 5000;

const LEAGUES = [
  39, // EPL
  140, // La Liga
  78, // Bundesliga
  135, // Serie A
  61, // Ligue 1
  2, // Champions League
  3, // Europa League
];
const BASE_URL = 'https://v3.football.api-sports.io/';
const API_HEADERS = {
  'x-rapidapi-key': '3fba493d1da5a58ca00eed0c1d52557d',
  'x-rapidapi-host': 'v3.football.api-sports.io',
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url, { headers: API_HEADERS });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw error;
  }
};

// ---- Match Service ----
app.get('/api/matches/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const promises = LEAGUES.map((leagueId) =>
      fetchData(
        `${BASE_URL}fixtures?league=${leagueId}&season=2024&timezone=Europe/Kiev&date=${date}`
      )
    );
    const results = await Promise.all(promises);
    res.json(results.flat());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.get('/api/match-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const matchData = await fetchData(`${BASE_URL}fixtures?id=${id}`);
    const h2hData = await fetchData(
      `${BASE_URL}fixtures/headtohead?h2h=${matchData[0].teams.home.id}-${matchData[0].teams.away.id}`
    );
    const response = [matchData, h2hData];

    if (matchData[0].fixture.status.short === 'NS') {
      const oddsData = await fetchData(`${BASE_URL}odds?fixture=${id}`);
      response.push(oddsData);
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
});

// ---- League Service ----
app.get('/api/league/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetchData(
      `${BASE_URL}standings?season=2024&league=${id}`
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch league data' });
  }
});

// ---- Club Service ----
app.get('/api/club-details/:clubId/:leagueId', async (req, res) => {
  const { clubId, leagueId } = req.params;
  try {
    const clubDetails = await fetchData(
      `${BASE_URL}teams/statistics?season=2024&team=${clubId}&league=${leagueId}`
    );
    const squad = await fetchData(`${BASE_URL}players/squads?team=${clubId}`);
    const transfers = await fetchData(`${BASE_URL}transfers?team=${clubId}`);
    const data = [clubDetails, squad, transfers];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club details' });
  }
});

// ---- Player Service ----

app.get('/api/player-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const playerDetails = await fetchData(
      `${BASE_URL}players?season=2024&id=${id}`
    );
    res.json(playerDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player details' });
  }
});

// ---- Start the server ----
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
