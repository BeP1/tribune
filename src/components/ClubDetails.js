import React, { useEffect, useState } from 'react';
import '../styles/ClubDetails.css';
import { useParams } from 'react-router-dom';
import LeagueService from '../Services/LeagueService';
import Squad from './Squad';
import Transfers from './Transfers';

const ClubDetails = () => {
  const [club, setClub] = useState();
  const [activeTab, setActiveTab] = useState('squad');
  const [squad, setSquad] = useState();
  const [transfers, setTransfers] = useState([]);
  const { club_id, league_id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    LeagueService.ClubDetails(club_id, league_id).then((data) => {
      setClub(data[0]);
      setSquad(data[1][0]);
      setTransfers(data[2]);
      setLoading(false);
    });
  }, [club_id, league_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const { team, form, fixtures, goals, clean_sheet, failed_to_score } = club;

  return (
    <div className="club-details-container">
      <div className="club-header">
        <img src={team.logo} alt={team.name} className="club-logo" />
        <h1>{team.name}</h1>
      </div>

      <div className="club-info">
        <div className="section form-section">
          <h2>Form</h2>
          <div className="form-display">
            {form.split('').map((result, index) => (
              <span key={index} className={`form-result ${result}`}>
                {result}
              </span>
            ))}
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Matches Played</h3>
            <p>{fixtures.played.total}</p>
          </div>
          <div className="stat-card">
            <h3>Goals Scored</h3>
            <p>{goals.for.total.total}</p>
          </div>
          <div className="stat-card">
            <h3>Goals Conceded</h3>
            <p>{goals.against.total.total}</p>
          </div>
          <div className="stat-card">
            <h3>Clean Sheets</h3>
            <p>{clean_sheet.total}</p>
          </div>
          <div className="stat-card">
            <h3>Failed to Score</h3>
            <p>{failed_to_score.total}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'squad' ? 'active' : ''}`}
            onClick={() => setActiveTab('squad')}
          >
            Squad
          </button>
          <button
            className={`tab-button ${activeTab === 'transfers' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfers')}
          >
            Transfers
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'squad' && <Squad squad={squad} />}

          {activeTab === 'transfers' && <Transfers transfers={transfers} />}
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
