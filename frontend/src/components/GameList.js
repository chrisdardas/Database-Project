import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/GameList.css';

const GameList = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/game')
            .then((response) => {
                setGames(response.data);
            })
            .catch((error) => {
                console.error('Error fetching games:', error);
            });
    }, []);

    return (
        <div className="game-list-container">
            <h1>Games</h1>
            <ul className="game-list">
                {games.map(game => (
                    <li key={game.game_id} className="game-item">
                        <span className="game-title">{game.title}</span>
                        <span className="game-price">${game.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameList;