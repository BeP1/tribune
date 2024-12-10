import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/MatchDetails.css';
import MatchesService from '../Services/MatchesService';

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState();
  const [H2H, setH2H] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preMatchOdds, setPreMatchOdds] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    MatchesService.MatchDetails(id).then((data) => {
      setMatch(data[0][0]);
      setH2H(data[1]);
      if (data[2] && data[2].length > 0) {
        const oddsData = data[2][0].bookmakers.find(
          (bm) => bm.name === 'Bet365'
        );
        if (oddsData) {
          const odds = {
            matchWinner: oddsData.bets.find(
              (bet) => bet.name === 'Match Winner'
            ),
            goalsOverUnder: oddsData.bets.find(
              (bet) => bet.name === 'Goals Over/Under'
            ),
            bothTeamsToScore: oddsData.bets.find(
              (bet) => bet.name === 'Both Teams Score'
            ),
          };
          setPreMatchOdds(odds);
        }
      }
      setLoading(false);
    });
  }, [id]);

  const goClubDetails = (club_id, league_id) => {
    navigate(`/club/${club_id}/${league_id}`);
  };
  const goToPlayerDetails = (id) => {
    navigate(`/player/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  console.log(match);
  const { fixture, teams, goals, events, statistics, league, lineups } = match;
  const date = new Date(fixture.date);

  return (
    <div className="fixture-container">
      <div className="fixture-details">
        <div
          className="home"
          onClick={() => goClubDetails(teams.home.id, league.id)}
        >
          <img src={teams.home.logo} alt={teams.home.name} />
          <p>{teams.home.name}</p>
        </div>
        <div>
          <div className="fixture-status">
            <p className="goal">
              {(() => {
                if (fixture.status.short === 'NS') {
                  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                } else if (fixture.status.short === 'FT') {
                  return `${goals.home} - ${goals.away}`;
                }
              })()}
            </p>
            <div className="goal-events">
              {events.map((event, index) => {
                if (event.type === 'Goal') {
                  return (
                    <p
                      key={index}
                      className={`goal-event ${event.team.id === teams.home.id ? 'home-goal' : 'away-goal'}`}
                    >
                      {event.player.name} - {event.time.elapsed}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="aditional-details">
            <p>
              {date.getDate()}.{date.getMonth() + 1}.{date.getFullYear()}
            </p>
            <p>
              {league.name}, {league.country}, {league.round}
            </p>
            <p>Referee: {fixture.referee === null ? 'TBD' : fixture.referee}</p>
            <p>
              Venue: {fixture.venue.name}, {fixture.venue.city}
            </p>
          </div>
        </div>
        <div
          className="away"
          onClick={() => goClubDetails(teams.away.id, league.id)}
        >
          <img src={teams.away.logo} alt={teams.away.name} />
          <p>{teams.away.name}</p>
        </div>
      </div>
      <div className="fixture-H2H">
        <h3>Head-to-Head</h3>
        <div className="H2H-content">
          <div className="H2H-team">
            <img
              src={match.teams.home.logo}
              alt={match.teams.home.name}
              className="team-logo"
            />
            <p>{H2H[0]} Wins</p>
          </div>
          <div className="H2H-draws">
            <p>{H2H[1]} Draws</p>
          </div>
          <div className="H2H-team">
            <img
              src={match.teams.away.logo}
              alt={match.teams.away.name}
              className="team-logo"
            />
            <p>{H2H[2]} Wins</p>
          </div>
        </div>
      </div>
      {statistics && statistics.length > 1 && (
        <div className="fixture-statistics">
          <div className="teams-header">
            <div className="team">
              <img
                src={statistics[0].team.logo}
                alt={statistics[0].team.name}
              />
              <p>{statistics[0].team.name}</p>
            </div>
            <div className="team">
              <img
                src={statistics[1].team.logo}
                alt={statistics[1].team.name}
              />
              <p>{statistics[1].team.name}</p>
            </div>
          </div>
          <div className="statistics-list">
            {statistics[0].statistics.map((stat, index) => {
              const team1Value = stat.value || 0;
              const team2Value = statistics[1].statistics[index]?.value || 0;

              const isPercentage =
                typeof team1Value === 'string' && team1Value.includes('%');

              const team1ValueNumeric = isPercentage
                ? parseFloat(team1Value)
                : parseFloat(team1Value) || 0;
              const team2ValueNumeric = isPercentage
                ? parseFloat(team2Value)
                : parseFloat(team2Value) || 0;

              const total = team1ValueNumeric + team2ValueNumeric;

              const team1Width =
                total > 0 ? (team1ValueNumeric / total) * 100 : 50;
              const team2Width =
                total > 0 ? (team2ValueNumeric / total) * 100 : 50;

              return (
                <div className="stat-row" key={index}>
                  <p className="stat-type">{stat.type}</p>
                  <div className="stat-row-content">
                    <div className="team-value">{team1Value}</div>
                    <div className="stat-bar">
                      <div
                        className="team1-bar"
                        style={{ width: `${team1Width}%` }}
                      ></div>
                      <div
                        className="team2-bar"
                        style={{ width: `${team2Width}%` }}
                      ></div>
                    </div>
                    <div className="team-value">{team2Value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="lineups-section">
        <h3>Lineups</h3>
        <div className="lineups-container">
          {(() => {
            if (lineups.length === 0) {
              return <p className="no-lineups">No lineups yet</p>;
            }
          })()}
          {lineups.map((teamLineup, index) => (
            <div
              key={index}
              className={`team-lineup ${index === 0 ? 'left-team' : 'right-team'}`}
            >
              <div className="team-header">
                <img
                  src={teamLineup.team.logo}
                  alt={teamLineup.team.name}
                  className="team-logo"
                />
                <div>
                  <h4>{teamLineup.team.name}</h4>
                  <p>Formation: {teamLineup.formation}</p>
                </div>
                <div className="coach-info">
                  <img
                    src={teamLineup.coach.photo}
                    alt={teamLineup.coach.name}
                    className="coach-photo"
                  />
                  <p>Coach: {teamLineup.coach.name}</p>
                </div>
              </div>
              <div className="players-section">
                <h5>Starting XI</h5>
                <ul className="starting-xi">
                  {teamLineup.startXI.map((player, idx) => (
                    <li
                      key={idx}
                      className="player-item"
                      onClick={() => goToPlayerDetails(player.player.id)}
                    >
                      <span className="player-number">
                        {player.player.number}
                      </span>
                      <span className="player-name">{player.player.name}</span>
                      <span className="player-pos">({player.player.pos})</span>
                    </li>
                  ))}
                </ul>
                <h5>Substitutes</h5>
                <ul className="substitutes">
                  {teamLineup.substitutes.map((sub, idx) => (
                    <li key={idx} className="player-item">
                      <span className="player-number">{sub.player.number}</span>
                      <span className="player-name">{sub.player.name}</span>
                      <span className="player-pos">({sub.player.pos})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      {(() => {
        if (preMatchOdds) {
          return (
            <div className="pre-match-odds">
              <div className="odds-bookmaker">
                <h4>Pre-match odds</h4>
                <div className="bookmaker-logo">Bet365</div>
              </div>

              <div className="odds-row">
                <div className="odds-category">
                  <h4>Match Winner</h4>
                  <div className="odds-options">
                    {preMatchOdds.matchWinner?.values.map((value, index) => (
                      <div
                        key={index}
                        className={`odds-option ${value.won ? 'highlighted' : ''}`}
                      >
                        {value.value === 'Home'
                          ? '1'
                          : value.value === 'Draw'
                            ? 'X'
                            : '2'}{' '}
                        {value.odd}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="odds-category">
                  <h4>Total Goals Over/Under 2.5</h4>
                  <div className="odds-options">
                    {preMatchOdds.goalsOverUnder?.values
                      .filter(
                        (val) =>
                          val.value === 'Over 2.5' || val.value === 'Under 2.5'
                      )
                      .map((value, index) => (
                        <div
                          key={index}
                          className={`odds-option ${value.won ? 'highlighted' : ''}`}
                        >
                          {value.value === 'Over 2.5' ? 'Over' : 'Under'}{' '}
                          {value.odd}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="odds-category">
                  <h4>Both Teams to Score</h4>
                  <div className="odds-options">
                    {preMatchOdds.bothTeamsToScore?.values.map(
                      (value, index) => (
                        <div
                          key={index}
                          className={`odds-option ${value.won ? 'highlighted' : ''}`}
                        >
                          {value.value === 'Yes' ? 'Yes' : 'No'} {value.odd}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};
export default MatchDetails;
