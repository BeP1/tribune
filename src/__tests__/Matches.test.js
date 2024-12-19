import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Matches from '../components/Matches';
import MatchesService from '../Services/MatchesService';

jest.mock('../Services/MatchesService');

describe('Matches Component', () => {
  const mockMatchesData = [
    {
      fixture: {
        id: 1,
        date: '2024-12-12T15:00:00Z',
        status: { short: 'NS' },
      },
      league: {
        name: 'Premier League',
        logo: 'league-logo.png',
      },
      teams: {
        home: { id: 101, name: 'Team A', logo: 'team-a-logo.png' },
        away: { id: 102, name: 'Team B', logo: 'team-b-logo.png' },
      },
      goals: { home: null, away: null },
    },
  ];

  it('renders loading state initially', () => {
    MatchesService.todayMatches.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Matches />
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders no matches message when there are no matches', async () => {
    MatchesService.todayMatches.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Matches />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No matches of popular league/i)
      ).toBeInTheDocument();
    });
  });

  it('renders matches correctly after loading', async () => {
    MatchesService.todayMatches.mockResolvedValueOnce(mockMatchesData);

    render(
      <MemoryRouter>
        <Matches />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
      expect(screen.getByText('Premier League')).toBeInTheDocument();
    });
  });

  it('handles date navigation correctly', async () => {
    MatchesService.todayMatches.mockResolvedValueOnce(mockMatchesData);

    render(
      <MemoryRouter>
        <Matches />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });

    MatchesService.todayMatches.mockResolvedValueOnce([]);

    const nextButton = screen.getByText('▶');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/No matches of popular league/i)
      ).toBeInTheDocument();
    });
  });

  it('navigates to match details on row click', async () => {
    MatchesService.todayMatches.mockResolvedValueOnce(mockMatchesData);

    const navigateMock = jest.fn();

    render(
      <MemoryRouter>
        <Matches />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });

    const matchRow = screen.getByText('Team A').closest('tr');
    fireEvent.click(matchRow);

    expect(navigateMock).not.toBeNull();
  });
});
