import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Squad = ({ squad }) => {
  const navigate = useNavigate();

  const groupedSquad = squad.players.reduce((group, player) => {
    const position = player.position;
    if (!group[position]) group[position] = [];
    group[position].push(player);
    return group;
  }, {});

  const goToPlayerDetails = (id) => {
    navigate(`/player/${id}`);
  };

  return (
    <div className="squad-section">
      <h2>Squad</h2>
      {Object.keys(groupedSquad).map((position) => (
        <div key={position} className="position-group">
          <h3>{position}</h3>
          <div className="player-list">
            {groupedSquad[position].map((player) => (
              <div
                key={player.id}
                className="player-card"
                onClick={() => goToPlayerDetails(player.id)}
              >
                <img
                  src={player.photo}
                  alt={player.name}
                  className="player-photo"
                />
                <div className="player-info">
                  <p className="player-name">{player.name}</p>
                  <p>
                    #{player.number}, Age: {player.age}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
Squad.propTypes = {
  squad: PropTypes.shape({
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        number: PropTypes.number,
        age: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
export default Squad;
