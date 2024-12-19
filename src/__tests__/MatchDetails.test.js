import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MatchDetails from '../components/MatchDetails';
import MatchesService from '../Services/MatchesService';

jest.mock('../Services/MatchesService');

describe('MatchDetails Component', () => {
  const mockMatchData = [
    [
      {
        fixture: {
          date: '2023-12-12T18:00:00Z',
          referee: 'John Doe',
          venue: { name: 'Stadium', city: 'City' },
          status: { short: 'FT' },
        },
        teams: {
          home: { id: 1, name: 'Team A', logo: 'team-a-logo.png' },
          away: { id: 2, name: 'Team B', logo: 'team-b-logo.png' },
        },
        goals: { home: 2, away: 1 },
        league: {
          id: 101,
          name: 'Premier League',
          country: 'England',
          round: 'Final',
        },
        events: [
          {
            type: 'Goal',
            team: { id: 1 },
            player: { name: 'Player 1' },
            time: { elapsed: 11 },
          },
        ],
        statistics: [
          {
            team: { name: 'Team A', logo: 'team-a-logo.png' },
            statistics: [{ type: 'Shots on Goal', value: 10 }],
          },
          {
            team: { name: 'Team B', logo: 'team-b-logo.png' },
            statistics: [{ type: 'Shots on Goal', value: 5 }],
          },
        ],
        lineups: [
          {
            team: {
              id: 1,
              name: 'Team A',
              logo: 'team-a-logo.png',
            },
            coach: { name: 'Coach A', photo: 'coach-a-photo.png' },
            formation: '4-4-2',
            startXI: [
              { player: { id: 101, name: 'Player A1', number: 16, pos: 'FW' } },
            ],
            substitutes: [
              { player: { id: 201, name: 'Sub A1', number: 12, pos: 'GK' } },
            ],
          },
          {
            team: {
              id: 2,
              name: 'Team B',
              logo: 'team-b-logo.png',
            },
            coach: { name: 'Coach B', photo: 'coach-b-photo.png' },
            formation: '4-3-3',
            startXI: [
              { player: { id: 102, name: 'Player B1', number: 9, pos: 'MF' } },
            ],
            substitutes: [
              { player: { id: 202, name: 'Sub B1', number: 15, pos: 'DF' } },
            ],
          },
        ],
      },
    ],
    [2, 1, 1], // H2H Data: [homeWins, draws, awayWins]
    [], // Odds Data
  ];

  it('renders loading state initially', () => {
    MatchesService.MatchDetails.mockResolvedValueOnce(mockMatchData);

    render(
      <MemoryRouter initialEntries={['/match/1']}>
        <Routes>
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders match details correctly after loading', async () => {
    MatchesService.MatchDetails.mockResolvedValueOnce(mockMatchData);

    render(
      <MemoryRouter initialEntries={['/match/1']}>
        <Routes>
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Team A')).toHaveLength(3);
      expect(screen.getAllByText('Team B')).toHaveLength(3);
    });

    expect(screen.getByText(/Stadium/)).toBeInTheDocument();
    expect(screen.getByText(/City/)).toBeInTheDocument();
    expect(screen.getByText(/Referee: John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/2 - 1/)).toBeInTheDocument();
  });

  it('renders H2H information', async () => {
    MatchesService.MatchDetails.mockResolvedValueOnce(mockMatchData);

    render(
      <MemoryRouter initialEntries={['/match/1']}>
        <Routes>
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Head-to-Head/)).toBeInTheDocument();
    });

    expect(screen.getByText(/2 Wins/)).toBeInTheDocument();
    expect(screen.getByText(/1 Draws/)).toBeInTheDocument();
    expect(screen.getByText(/1 Wins/)).toBeInTheDocument();
  });

  it('renders lineups and statistics', async () => {
    MatchesService.MatchDetails.mockResolvedValueOnce(mockMatchData);

    render(
      <MemoryRouter initialEntries={['/match/1']}>
        <Routes>
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const formResults = screen.getAllByText('Starting XI');
      expect(formResults).toHaveLength(2);
    });

    expect(screen.getByText(/Coach A/)).toBeInTheDocument();
    expect(screen.getByText(/Formation: 4-4-2/)).toBeInTheDocument();
    expect(screen.getByText(/Shots on Goal/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
