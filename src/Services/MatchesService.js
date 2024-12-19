const base_url = 'http://localhost:5000/api';

class MatchesService {
  async todayMatches(date) {
    try {
      return await fetch(`${base_url}/matches/${date}`).then((res) =>
        res.json()
      );
    } catch (error) {
      return [];
    }
  }
  async MatchDetails(fixture_id) {
    try {
      const res = await fetch(`${base_url}/match-details/${fixture_id}`).then(
        (res) => res.json()
      );
      return [res[0], this.calculateH2H(res[1]), res[2]];
    } catch (error) {
      console.log(error);
    }
  }

  calculateH2H(data) {
    if (data.length === 0) {
      return [0, 0, 0];
    }
    let home = 0;
    let away = 0;
    let draw = 0;

    data.forEach((fixture) => {
      if (fixture.teams.home.winner) {
        home++;
      } else if (fixture.teams.away.winner) {
        away++;
      } else {
        draw++;
      }
    });

    return [home, draw, away];
  }
}
export default new MatchesService();
