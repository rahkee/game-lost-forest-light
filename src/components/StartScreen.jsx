import React from 'react';
import gameData from '../data.json';
import './StartScreen.css';

const StartScreen = ({ onStartGame }) => {
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
        >
          Play
        </button>
      </div>

      {/* Companion character (fox) */}
      <div className="companion-container">
        <div
          className="companion-fox"
          style={{
            backgroundImage: `url(${gameData.assets.images.fox.default})`
          }}
        />
      </div>
    </div>
  );
};

export default StartScreen; 