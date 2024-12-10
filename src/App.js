import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Matches from './components/Matches';
import MatchDetails from './components/MatchDetails';
import Home from "./components/Home";
import LeagueStanding from "./components/LeagueStanding";
import ClubDetails from "./components/ClubDetails";
import Squad from "./components/Squad";
import Transfers from "./components/Transfers";
import Player from "./components/Player";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/match/:id" element={<MatchDetails />} />
                <Route path="/club/:club_id/:league_id" element={<ClubDetails />} />
                <Route path="/player/:id" element={<Player />} />
            </Routes>
        </div>
    );
}

export default App;
