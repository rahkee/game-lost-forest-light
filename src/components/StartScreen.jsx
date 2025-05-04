import { useState } from 'react';
import gameData from '../data.json';
import './StartScreen.css';

const StartScreen = ({ onStartGame }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="start-screen">
      {/* Dark forest background */}
      <div
        className="forest-background"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_start})`
        }}
      />

      {/* Content container */}
      <div className="content-container">
        {/* Title */}
        <h1 className="game-title">
          {gameData.title}
        </h1>

        {/* Game description */}
        <p className="game-description">
          {gameData.description}
        </p>

        {/* Play button */}
        <button
          className="play-button"
          onClick={onStartGame}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            backgroundColor: isButtonHovered ? '#22c55e' : '#16a34a',
            boxShadow: isButtonHovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
            transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          Play
        </button>
      </div>

      {/* Companion character (fox) */}
      <div className="companion-container">
        <div
          className="companion-fox"
          style={{
            backgroundImage: `url(${gameData.assets.images.companion_fox})`
          }}
        />
      </div>
    </div>
  );
};

export default StartScreen; 