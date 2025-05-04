import React from 'react';
import gameData from '../data.json';
import './EndScreen.css';

const EndScreen = ({ onPlayAgain }) => {
  return (
    <div className="end-screen">
      {/* Bright forest background */}
      <div
        className="forest-background"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_end})`
        }}
      />

      {/* Animated overlay - light particles or forest elements */}
      <div className="light-overlay"></div>

      {/* Content container */}
      <div className="end-content">
        <h1 className="end-title">
          You did it!
        </h1>

        <p className="end-message">
          The words are strong again, and the Forest Light has returned.
        </p>

        {/* Word Power Summary */}
        <div className="word-runes">
          {gameData.words.map((word) => (
            <div
              key={word.word}
              className="word-rune"
              style={{
                backgroundColor: word.color,
                boxShadow: `0 0 15px 5px ${word.color}`
              }}
            >
              <span className="rune-initial">{word.word[0]}</span>
            </div>
          ))}
        </div>

        {/* Companion message */}
        <div className="companion-message">
          <div
            className="companion-avatar"
            style={{
              backgroundImage: `url(${gameData.assets.images.companion_fox})`,
              backgroundColor: 'rgba(255, 150, 60, 0.8)'
            }}
          />
          <p className="message-text">
            "Well done! Your vocabulary knowledge has restored the magic to our forest!"
          </p>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button
            className="action-button button-green"
            onClick={onPlayAgain}
          >
            Play Again
          </button>

          <button
            className="action-button button-blue"
          >
            Explore Words
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen; 