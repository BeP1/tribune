import React from 'react';
import Matches from './Matches';
import LeagueStanding from './LeagueStanding';
import '../styles/Home.css';

const Home = () => {
    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 135, name: "Serie A" },
        { id: 78, name: "Bundesliga" },
        { id: 61, name: "Ligue 1" },
        {id: 2, name : "Champion League" },
        {id : 3, name: "Europe League" },
    ];
    return (
        <div className="Home-container">
            <div className="top-league">
                <table>
                    <tbody>
                    {leagues.map(league => (
                        <tr key={league.id}>
                            <td>{league.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="home-matches">
                <Matches/>
            </div>
            <div className="home-leagues">
                <LeagueStanding/>
            </div>

        </div>
    );
};

export default Home;
