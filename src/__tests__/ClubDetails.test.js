import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClubDetails from '../components/ClubDetails';
import LeagueService from '../Services/LeagueService';

jest.mock('../Services/LeagueService');
describe('ClubDetails Component', () => {
  const mockClubData = [
    {
      team: {
        name: 'Mock Team',
        logo: 'mock-logo.png',
      },
      form: 'WWLDD',
      fixtures: {
        played: { total: 10 },
      },
      goals: {
        for: { total: { total: 25 } },
        against: { total: { total: 15 } },
      },
      clean_sheet: { total: 5 },
      failed_to_score: { total: 3 },
    },
    [
      {
        players: [
          {
            id: 1,
            name: 'Player One',
            position: 'Forward',
            photo: 'url1',
            age: 28,
          },
          {
            id: 2,
            name: 'Player Two',
            position: 'Midfielder',
            photo: 'url2',
            age: 24,
          },
        ],
      },
    ],
    [
      {
        player: { name: 'Player One' },
        update: '2023-12-10T00:00:00Z',
        transfers: [
          {
            date: '2023-01-10T00:00:00Z',
            type: 'Loan',
            teams: {
              in: { name: 'Team In', logo: 'logo_in.png' },
              out: { name: 'Team Out', logo: 'logo_out.png' },
            },
          },
        ],
      },
    ],
  ];

  it('renders loading state initially', () => {
    LeagueService.ClubDetails.mockResolvedValueOnce(mockClubData);

    render(
      <MemoryRouter initialEntries={['/club/1/2']}>
        <Routes>
          <Route path="/club/:club_id/:league_id" element={<ClubDetails />} />
        </Routes>
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('renders club details after data is loaded', async () => {
    LeagueService.ClubDetails.mockResolvedValueOnce(mockClubData);

    render(
      <MemoryRouter initialEntries={['/club/1/2']}>
        <Routes>
          <Route path="/club/:club_id/:league_id" element={<ClubDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Mock Team')).toBeInTheDocument();
    });
    expect(screen.getByText(/Form/i)).toBeInTheDocument();
    const formResults = screen.getAllByText('W');
    expect(formResults).toHaveLength(2);
  });

  it('switches tabs between Squad and Transfers', async () => {
    LeagueService.ClubDetails.mockResolvedValueOnce(mockClubData);

    render(
      <MemoryRouter initialEntries={['/club/1/2']}>
        <Routes>
          <Route path="/club/:club_id/:league_id" element={<ClubDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Mock Team')).toBeInTheDocument();
    });

    expect(screen.getByText('Player One')).toBeInTheDocument(); // Squad tab content

    fireEvent.click(screen.getByText(/Transfers/i));
    expect(screen.getByText(/Loan/i)).toBeInTheDocument(); // Transfers tab content
  });
});
