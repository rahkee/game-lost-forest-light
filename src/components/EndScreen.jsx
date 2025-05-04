import React from 'react';
import gameData from '../data.json';

const EndScreen = ({ onPlayAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 relative overflow-hidden">
      {/* Bright forest background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_end})`,
          // Fallback until we have actual assets
          backgroundColor: '#0c4a1d'
        }}
      />

      {/* Animated overlay - light particles or forest elements */}
      <div className="absolute inset-0 bg-yellow-400/10 z-0"></div>

      {/* Content container */}
      <div className="flex flex-col items-center z-10 p-8 max-w-2xl text-white bg-black/20 backdrop-blur-sm rounded-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-white drop-shadow-lg">
          You did it!
        </h1>

        <p className="text-xl text-center mt-6">
          The words are strong again, and the Forest Light has returned.
        </p>

        {/* Word Power Summary */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {gameData.words.map((word) => (
            <div
              key={word.word}
              className="flex items-center justify-center p-3 rounded-full w-16 h-16"
              style={{
                backgroundColor: word.color,
                boxShadow: `0 0 15px 5px ${word.color}`
              }}
            >
              <span className="text-lg font-bold text-white">{word.word[0]}</span>
            </div>
          ))}
        </div>

        {/* Companion message */}
        <div className="flex items-center justify-center mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <div
            className="w-12 h-12 bg-contain bg-no-repeat bg-center mr-3"
            style={{
              backgroundImage: `url(${gameData.assets.images.companion_fox})`,
              // Fallback until we have the asset
              backgroundColor: 'rgba(255, 150, 60, 0.8)',
              borderRadius: '50%'
            }}
          />
          <p className="text-lg italic flex-1">
            "Well done! Your vocabulary knowledge has restored the magic to our forest!"
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            className="px-6 py-3 rounded-full text-lg font-bold bg-green-600 hover:bg-green-500 transition-colors"
            onClick={onPlayAgain}
          >
            Play Again
          </button>

          <button
            className="px-6 py-3 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Explore Words
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen; 