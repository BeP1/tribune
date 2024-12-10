import React, { useState, useEffect, useRef } from 'react';
import '../styles/Matches.css';
import { useNavigate, useLocation } from 'react-router-dom';
import MatchesService from '../Services/MatchesService';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const adjustDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

const Matches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dateInputRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const initialDate = queryParams.get('date') || getTodayDate();

  const [date, setDate] = useState(initialDate);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    MatchesService.todayMatches(date).then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, [date]);

  // Оновлення параметра дати в URL при її зміні
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('date', date);
    navigate(`?${queryParams.toString()}`, { replace: true });
  }, [date, navigate, location.search]);

  const handleDateChange = (days) => {
    setDate(adjustDate(date, days));
  };

  const toggleCalendar = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleCalendarChange = (event) => {
    setDate(event.target.value);
  };

  const goToMatchDetails = (id) => {
    navigate(`/match/${id}`);
  };

  return (
    <div className="Matches">
      <div className="DateSelector">
        <button className="nav-button" onClick={() => handleDateChange(-1)}>
          ◀
        </button>
        <p>
          {date === getTodayDate()
            ? 'Today'
            : new Date(date).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
              })}
        </p>
        <div className="calendar-container">
          <button className="calendar-toggle" onClick={toggleCalendar}>
            ⏷
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="hidden-date-picker"
            value={date}
            onChange={handleCalendarChange}
            min="2024-09-01"
            max="2025-06-30"
          />
        </div>
        <button className="nav-button" onClick={() => handleDateChange(1)}>
          ▶
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length === 0 ? (
        <div className="No-matches">
          <p>No matches of popular league</p>
        </div>
      ) : (
        <div>
          <table className="MatchesTable">
            <tbody>
              {matches.map((match) => (
                <tr
                  key={match.fixture.id}
                  onClick={() => goToMatchDetails(match.fixture.id)}
                >
                  <td className="league">
                    <img src={match.league.logo} alt={match.league.name} />
                    <p>{match.league.name}</p>
                  </td>
                  <td className="homeTeam">
                    <img
                      src={match.teams.home.logo}
                      alt={match.teams.home.name}
                    />
                    <p>{match.teams.home.name}</p>
                  </td>
                  <td className="status">
                    <p>
                      {(() => {
                        if (match.fixture.status.short === 'NS') {
                          const date = new Date(match.fixture.date);
                          const hours = date
                            .getHours()
                            .toString()
                            .padStart(2, '0');
                          const minutes = date
                            .getMinutes()
                            .toString()
                            .padStart(2, '0');
                          return `${hours}:${minutes}`;
                        } else {
                          return (
                            <p>
                              {match.goals.home} - {match.goals.away}
                            </p>
                          );
                        }
                      })()}
                    </p>
                    <p>
                      {(() => {
                        if (match.fixture.status.short === 'FT') {
                          return 'Finished';
                        } else if (match.fixture.status.short === '1H') {
                          return '1 Half';
                        } else if (match.fixture.status.short === 'HT') {
                          return 'Half Time';
                        } else if (match.fixture.status.short === '2H') {
                          return '2 Half';
                        } else if (match.fixture.status.short === 'ET') {
                          return 'Extra Time';
                        }
                      })()}
                    </p>
                  </td>
                  <td className="awayTeam">
                    <img
                      src={match.teams.away.logo}
                      alt={match.teams.away.name}
                    />
                    <p>{match.teams.away.name}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Matches;
