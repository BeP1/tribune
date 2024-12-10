const base_url = 'http://localhost:5000/api';

class LeagueService {
  async League(id) {
    try {
      const response = await fetch(`${base_url}/league/${id}`).then((res) =>
        res.json()
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async ClubDetails(club_id, league_id) {
    try {
      return await fetch(
        `${base_url}/club-details/${club_id}/${league_id}`
      ).then((res) => res.json());
    } catch (error) {
      console.log(error);
    }
  }
  async PlayerDetails(player_id) {
    try {
      return await fetch(`${base_url}/player-details/${player_id}`).then(
        (res) => res.json()
      );
    } catch (error) {
      console.log(error);
    }
  }
}
export default new LeagueService();
