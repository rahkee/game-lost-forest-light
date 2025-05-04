import { useState, useEffect } from 'react';
import gameData from '../data.json';

// Placeholder component for word runes
const WordRune = ({ word, onClick, isSelected }) => {
  const { color, power_level } = word;

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${isSelected ? 'transform scale-110 shadow-lg' : ''
        }`}
      style={{
        backgroundColor: `${color}33`, // Add transparency to the color
        borderColor: color,
        borderWidth: '2px',
        borderStyle: 'solid'
      }}
      onClick={onClick}
    >
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2"
        style={{
          background: `${color}99`, // Slightly more opaque than the container
          boxShadow: `0 0 ${5 + power_level * 2}px ${power_level * 3}px ${color}`
        }}
      >
        <span className="text-xl font-bold text-white drop-shadow-md">{word.word[0]}</span>
      </div>
      <h3 className="text-lg font-semibold">{word.word}</h3>
      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${power_level}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

// Fully implemented challenge screen
const ChallengeScreen = ({ word, onComplete, onBack }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const currentChallenge = word.challenges[currentChallengeIndex];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    // For hard challenges, the correct answer is always the word itself
    // For easy/medium, the correct answer is the second option (index 1)
    const correctIndex = currentChallenge.difficulty === 'hard'
      ? word.challenges[currentChallengeIndex].choices.findIndex(choice => choice.toLowerCase() === word.word.toLowerCase())
      : 1;

    const correct = answerIndex === correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setFeedback(currentChallenge.feedback);
      setEarnedPoints(currentChallenge.points);
    } else {
      setFeedback(currentChallenge.feedback_negative);
      setEarnedPoints(0);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < word.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      // All challenges completed
      onComplete(word.word, earnedPoints);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-lg">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: word.color,
          boxShadow: `0 0 10px 2px ${word.color}`
        }}
      >
        <span className="text-2xl font-bold text-white">{word.word[0]}</span>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">{word.word}</h2>
      <p className="mb-6 text-center text-white/90">{word.definition}</p>

      <div className="bg-white/20 p-4 rounded-lg mb-6 w-full">
        <h3 className="text-xl font-semibold mb-4 text-white">{currentChallenge.prompt}</h3>

        <div className="flex flex-col gap-2 w-full">
          {currentChallenge.choices.map((choice, index) => (
            <button
              key={index}
              className={`flex p-3 rounded-lg text-left transition-all ${selectedAnswer === index
                ? isCorrect
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg mb-6 w-full ${isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
          <p className="text-white">{feedback}</p>
        </div>
      )}

      <div className="flex gap-4">
        {selectedAnswer !== null && (
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
            onClick={handleNextChallenge}
          >
            {currentChallengeIndex < word.challenges.length - 1 ? 'Next Challenge' : 'Complete'}
          </button>
        )}

        <button
          className="text-white underline px-6 py-2"
          onClick={onBack}
        >
          Back to Words
        </button>
      </div>
    </div>
  );
};

const GameScreen = ({ onGameComplete }) => {
  const [words, setWords] = useState(gameData.words);
  const [selectedWord, setSelectedWord] = useState(null);
  const [forestBrightness, setForestBrightness] = useState(20); // 0-100 scale

  // Calculate overall progress
  const totalPowerLevel = words.reduce((total, word) => total + word.power_level, 0);
  const maxPowerLevel = words.length * 100;
  const overallProgress = (totalPowerLevel / maxPowerLevel) * 100;

  // Update forest brightness based on progress
  useEffect(() => {
    setForestBrightness(20 + overallProgress * 0.8);
  }, [overallProgress]);

  // If all words are at 100%, game is complete
  useEffect(() => {
    if (overallProgress >= 100 && onGameComplete) {
      onGameComplete();
    }
  }, [overallProgress, onGameComplete]);

  const handleChallengeComplete = (wordName, pointsEarned) => {
    setWords(prevWords => {
      return prevWords.map(word => {
        if (word.word === wordName) {
          const newPowerLevel = Math.min(100, word.power_level + 33); // Each challenge increases power by ~33%
          const newCorrectUses = word.correct_uses + (pointsEarned > 0 ? 1 : 0);
          return {
            ...word,
            power_level: newPowerLevel,
            correct_uses: newCorrectUses
          };
        }
        return word;
      });
    });

    setSelectedWord(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-slate-900 relative overflow-hidden">
      {/* Forest background with brightness based on progress */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_progress})`,
          // Fallback until we have actual assets
          backgroundColor: '#0a1929',
          filter: `brightness(${20 + forestBrightness * 0.8}%)`
        }}
      />

      {/* Header */}
      <header className="flex w-full px-6 py-4 z-10 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1">
          {gameData.title}
        </h1>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center w-full p-4 z-10">
        {!selectedWord ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Choose a Word to Grow</h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {words.map((word) => (
                <WordRune
                  key={word.word}
                  word={word}
                  onClick={() => setSelectedWord(word)}
                  isSelected={false}
                />
              ))}
            </div>
          </>
        ) : (
          <ChallengeScreen
            word={selectedWord}
            onComplete={handleChallengeComplete}
            onBack={() => setSelectedWord(null)}
          />
        )}
      </main>

      {/* Footer with progress */}
      <footer className="flex w-full p-4 z-10 text-white">
        <div className="flex flex-col items-center flex-1">
          <p className="mb-2">Forest Light: {Math.round(overallProgress)}%</p>
          <div className="w-full max-w-lg bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-amber-400"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameScreen; 