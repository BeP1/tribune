const { spawn } = require('child_process');
const request = require('supertest');

jest.setTimeout(20000);
const SERVER_START_TIMEOUT = 5000;
let serverProcess;

const startServer = () => {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });
    setTimeout(() => resolve(), SERVER_START_TIMEOUT);
  });
};

const stopServer = () => {
  if (serverProcess) {
    serverProcess.kill();
  }
};

describe('Integration Tests for Real Server', () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(() => {
    stopServer();
  });

  it('should fetch matches for a specific date', async () => {
    const response = await request('http://localhost:5000').get(
      '/api/matches/2024-12-19'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('should fetch match details for a given ID', async () => {
    const response = await request('http://localhost:5000').get(
      '/api/match-details/12345'
    );
    expect(response.status).toBe(200);
    expect(response.body[0][0]).toHaveProperty('events');
  });

  it('should fetch league standings for a given league ID', async () => {
    const response = await request('http://localhost:5000').get(
      '/api/league/39'
    );
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('league');
  });

  it('should fetch club details for a given club ID and league ID', async () => {
    const response = await request('http://localhost:5000').get(
      '/api/club-details/33/39'
    );
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('team');
  });

  it('should fetch player details for a given player ID', async () => {
    const response = await request('http://localhost:5000').get(
      '/api/player-details/44'
    );
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('player');
  });
});
