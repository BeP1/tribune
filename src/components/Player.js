import React, { useEffect, useState } from 'react';
import '../styles/Player.css';
import { useParams } from 'react-router-dom';
import LeagueService from '../Services/LeagueService';

const Player = () => {
  const { id } = useParams();
  const [playerInfo, setPlayerInfo] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    LeagueService.PlayerDetails(id).then((data) => {
      setPlayerInfo(data[0]);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const { player, statistics } = playerInfo;

  return (
    <div className="player-details-container">
      {/* Player Header */}
      <div className="player-header">
        <img src={player.photo} alt={player.name} className="player-photo" />
        <h1>{player.name}</h1>
        <p>
          {player.firstname} {player.lastname}
        </p>
        <p>Age: {player.age}</p>
        <p>Nationality: {player.nationality}</p>
        <p>Height: {player.height}</p>
        <p>Weight: {player.weight}</p>
      </div>

      {/* Player Statistics */}
      <div className="player-statistics">
        <h2>Statistics</h2>
        <div className="statistics-cards">
          {statistics.map((stat, index) => (
            <div key={index} className="statistics-card">
              <h3>
                {stat.team.name} ({stat.league.name})
              </h3>
              <p>Appearances: {stat.games.appearences}</p>
              <p>Goals: {stat.goals.total || 0}</p>
              <p>Assists: {stat.goals.assists || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Player;
