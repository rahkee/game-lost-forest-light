import { useState } from 'react';
import gameData from '../data.json';

const StartScreen = ({ onStartGame }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 relative overflow-hidden">
      {/* Dark forest background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 z-0"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_start})`,
          // Fallback until we have actual assets
          backgroundColor: '#0a1929'
        }}
      />

      {/* Content container */}
      <div className="flex flex-col items-center z-10 p-8 max-w-2xl text-white">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white drop-shadow-lg">
          {gameData.title}
        </h1>

        {/* Game description */}
        <p className="text-lg sm:text-xl text-center mt-8">
          {gameData.description}
        </p>

        {/* Play button */}
        <button
          className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 mt-12 ${isButtonHovered
            ? 'bg-green-500 shadow-lg transform scale-105'
            : 'bg-green-600'
            }`}
          onClick={onStartGame}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Play
        </button>
      </div>

      {/* Companion character (fox) */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10">
        <div
          className="w-20 h-20 sm:w-32 sm:h-32 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${gameData.assets.images.companion_fox})`,
            // Fallback color for the fox silhouette until we have the asset
            backgroundColor: 'rgba(255, 150, 60, 0.8)',
            borderRadius: '50%'
          }}
        />
      </div>
    </div>
  );
};

export default StartScreen; 