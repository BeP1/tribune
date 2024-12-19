import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Player from '../components/Player';
import LeagueService from '../Services/LeagueService';

jest.mock('../Services/LeagueService');

describe('Player Component', () => {
  const mockPlayerData = [
    {
      player: {
        name: 'Mock Player',
        firstname: 'Mock',
        lastname: 'Player',
        age: 28,
        nationality: 'Country',
        height: '180 cm',
        weight: '75 kg',
        photo: 'mock-photo-url',
      },
      statistics: [
        {
          team: { name: 'Mock Team' },
          league: { name: 'Mock League' },
          games: { appearences: 20 },
          goals: { total: 10, assists: 5 },
        },
      ],
    },
  ];

  it('renders loading state initially', () => {
    LeagueService.PlayerDetails.mockResolvedValueOnce(mockPlayerData);

    render(
      <MemoryRouter initialEntries={['/player/1']}>
        <Routes>
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders player details after data is loaded', async () => {
    LeagueService.PlayerDetails.mockResolvedValueOnce(mockPlayerData);

    render(
      <MemoryRouter initialEntries={['/player/1']}>
        <Routes>
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const formResults = screen.getAllByText('Mock Player');
      expect(formResults).toHaveLength(2);
    });

    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText(/Nationality:/)).toBeInTheDocument();
    expect(screen.getByText(/Height:/)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/)).toBeInTheDocument();
  });

  it('renders player statistics correctly', async () => {
    LeagueService.PlayerDetails.mockResolvedValueOnce(mockPlayerData);

    render(
      <MemoryRouter initialEntries={['/player/1']}>
        <Routes>
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const formResults = screen.getAllByText('Mock Player');
      expect(formResults).toHaveLength(2);
    });
    expect(screen.getByText(/Mock Team \(Mock League\)/)).toBeInTheDocument();
    expect(screen.getByText(/Appearances: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Goals: 10/)).toBeInTheDocument();
    expect(screen.getByText(/Assists: 5/)).toBeInTheDocument();
  });
});
