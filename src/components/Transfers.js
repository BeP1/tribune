import React from 'react';
import '../styles/Transfers.css';

const currentDate = new Date();

const Transfers = ({ transfers }) => {
    // Фільтруємо трансфери за останні два роки та сортуємо за датою проведення трансферу
    const recentTransfers = transfers
        .map(player => ({
            ...player,
            transfers: player.transfers.filter(transfer => {
                const transferDate = new Date(transfer.date);
                const timeDifference = currentDate - transferDate;
                const twoYearsInMilliseconds = 2 * 365 * 24 * 60 * 60 * 1000;
                return timeDifference <= twoYearsInMilliseconds;
            })
        }))
        .filter(player => player.transfers.length > 0) // Відфільтровуємо гравців без трансферів за останні два роки
        .map(player => ({
            ...player,
            transfers: player.transfers.sort((a, b) => new Date(b.date) - new Date(a.date)) // Сортуємо трансфери за датою проведення
        }));

    return (
        <div className="transfers-list">
            {recentTransfers.map((player, index) => (
                <div key={index} className="player-transfer">
                    <h3>{player.player.name}</h3>
                    <p>Updated: {new Date(player.update).toLocaleDateString()}</p>
                    {player.transfers.map((transfer, idx) => (
                        <div key={idx} className="transfer">
                            <p>Date: {new Date(transfer.date).toLocaleDateString()}</p>
                            <p>Type: {transfer.type}</p>
                            <div className="teams">
                                <div className="team-in">
                                    <img src={transfer.teams.in.logo} alt={transfer.teams.in.name} />
                                    <span>{transfer.teams.in.name}</span>
                                </div>
                                <span>→</span>
                                <div className="team-out">
                                    <img src={transfer.teams.out.logo} alt={transfer.teams.out.name} />
                                    <span>{transfer.teams.out.name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Transfers;
