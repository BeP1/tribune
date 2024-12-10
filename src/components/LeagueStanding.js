import React, { useEffect, useState } from 'react';
import "../styles/LeagueStandings.css";
import LeagueService from "../Services/LeagueService";
import {useNavigate} from "react-router-dom";

const LeagueStandings = () => {
    const [teams, setTeams] = useState();
    const [id, setId] = useState(39);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 135, name: "Serie A" },
        { id: 78, name: "Bundesliga" },
        { id: 61, name: "Ligue 1" },
        {id: 2, name : "Champion League" },
        {id : 3, name: "Europe League" },
    ];

    useEffect(() => {
        setLoading(true);
        LeagueService.League(id).then((data) => {
            setTeams(data[0].league.standings[0]);
            setLoading(false);
        });
    }, [id]);

    const handleLeagueClick = (leagueId) => {
        setId(leagueId);
    };
    const goClubDetails = (club_id, league_id) => {
        navigate(`/club/${club_id}/${league_id}`);
    };
    console.log(teams)
    return (
        <div className="league-container">
            <div className="league-selector">
                {leagues.map((league) => (
                    <button
                        key={league.id}
                        onClick={() => handleLeagueClick(league.id)}
                        className={`league-button ${id === league.id ? 'active' : ''}`}>
                        {league.name}
                    </button>
                ))}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="standings-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Played</th>
                        <th>+/-</th>
                        <th>Points</th>
                        <th>Form</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team) => (
                        <tr key={team.rank} >
                            <td className={"position" + team.rank}>{team.rank}</td>
                            <td className="team-info" onClick={() => goClubDetails(team.team.id,id)}>
                                <img src={team.team.logo} alt={team.team.name} className="team-logo" />
                                <span>{team.team.name}</span>
                            </td>
                            <td>{team.all.played}</td>
                            <td>{team.goalsDiff}</td>
                            <td>{team.points}</td>
                            <td className="form">
                                {team.form.split("").map((result, index) => (
                                    <span key={index} className={`form-result ${result}`}>
                                            {result}
                                        </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LeagueStandings;
