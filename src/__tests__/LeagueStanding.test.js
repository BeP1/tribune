import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeagueStandings from '../components/LeagueStanding';
import LeagueService from '../Services/LeagueService';

jest.mock('../Services/LeagueService');

describe('LeagueStandings Component', () => {
  const mockLeagueData = [
    {
      league: {
        standings: [
          [
            {
              rank: 1,
              team: { id: 101, name: 'Team A', logo: 'team-a-logo.png' },
              all: { played: 10 },
              goalsDiff: 15,
              points: 25,
              form: 'WWDLW',
            },
            {
              rank: 2,
              team: { id: 102, name: 'Team B', logo: 'team-b-logo.png' },
              all: { played: 10 },
              goalsDiff: 10,
              points: 22,
              form: 'LWWDD',
            },
          ],
        ],
      },
    },
  ];

  it('renders loading state initially', () => {
    LeagueService.League.mockResolvedValueOnce(mockLeagueData);

    render(
      <MemoryRouter>
        <LeagueStandings />
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders league standings correctly after loading', async () => {
    LeagueService.League.mockResolvedValueOnce(mockLeagueData);

    render(
      <MemoryRouter>
        <LeagueStandings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
    });

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
  });

  it('handles league switching correctly', async () => {
    LeagueService.League.mockResolvedValueOnce(mockLeagueData);

    render(
      <MemoryRouter>
        <LeagueStandings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });

    const laLigaButton = screen.getByText('La Liga');

    LeagueService.League.mockResolvedValueOnce([
      {
        league: {
          standings: [
            [
              {
                rank: 1,
                team: { id: 201, name: 'Team C', logo: 'team-c-logo.png' },
                all: { played: 12 },
                goalsDiff: 20,
                points: 30,
                form: 'WWWWW',
              },
            ],
          ],
        },
      },
    ]);

    fireEvent.click(laLigaButton);

    await waitFor(() => {
      expect(screen.getByText('Team C')).toBeInTheDocument();
    });

    expect(screen.queryByText('Team A')).not.toBeInTheDocument();
  });
});
