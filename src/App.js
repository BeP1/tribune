import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MatchDetails from './components/MatchDetails';
import Home from './components/Home';
import ClubDetails from './components/ClubDetails';
import Player from './components/Player';

function App() {
  return (
    <BrowserRouter basename="/tribune">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/club/:club_id/:league_id" element={<ClubDetails />} />
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
