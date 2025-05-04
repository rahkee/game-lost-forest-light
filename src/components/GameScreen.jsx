import { useState, useEffect } from 'react';
import gameData from '../data.json';
import './GameScreen.css';

// Word rune component
const WordRune = ({ word, onClick, isSelected }) => {
  const { color, power_level } = word;
  const isComplete = power_level >= 100;

  return (
    <div
      className={`word-rune ${isSelected ? 'selected' : ''} ${isComplete ? 'completed' : ''}`}
      style={{
        backgroundColor: `${color}33`, // Add transparency to the color
        borderColor: color
      }}
      onClick={onClick}
    >
      <div
        className="rune-circle"
        style={{
          background: `${color}99`, // Slightly more opaque than the container
          boxShadow: `0 0 ${5 + power_level * 2}px ${power_level * 3}px ${color}`
        }}
      >
        <span className="rune-initial">{word.word[0]}</span>
        {isComplete && <span className="completion-mark">✓</span>}
      </div>
      <h3 className="rune-word">{word.word}</h3>
      <div className="power-bar-container">
        <div
          className="power-bar"
          style={{
            width: `${power_level}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

// Challenge screen component
const ChallengeScreen = ({ word, onComplete }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

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

    // Trigger feedback animation
    setTimeout(() => {
      setFeedbackVisible(true);
    }, 100);

    // Show the continue button after a short delay
    setTimeout(() => {
      setShowContinue(true);
    }, 1000);
  };

  const handleCloseChallenge = () => {
    // Update the word's power level if the answer was correct
    if (isCorrect) {
      onComplete(word.word, earnedPoints);
    } else {
      // Just go back to word selection without updating power level
      onComplete(word.word, 0);
    }
  };

  return (
    <div className="challenge-container">
      <div
        className="challenge-rune"
        style={{
          backgroundColor: word.color,
          boxShadow: `0 0 10px 2px ${word.color}`
        }}
      >
        <span className="rune-initial">{word.word[0]}</span>
      </div>

      <h2 className="challenge-word">{word.word}</h2>
      <p className="challenge-definition">{word.definition}</p>

      <div className="challenge-question-container">
        <h3 className="challenge-prompt">{currentChallenge.prompt}</h3>

        <div className="challenge-choices">
          {currentChallenge.choices.map((choice, index) => (
            <button
              key={index}
              className={`challenge-choice ${selectedAnswer === index
                ? isCorrect
                  ? 'correct'
                  : 'incorrect'
                : ''
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
        <div className={`feedback-container ${isCorrect ? 'correct' : 'incorrect'} ${feedbackVisible ? 'visible' : ''}`}>
          <p className="feedback-text">{feedback}</p>
        </div>
      )}

      <div className="challenge-buttons">
        {selectedAnswer !== null && showContinue && (
          <button
            className="next-button"
            onClick={handleCloseChallenge}
          >
            Continue
          </button>
        )}
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
        if (word.word === wordName && pointsEarned > 0) {
          // Calculate how much to increase the power level based on which challenge was completed
          const pointIncrease = pointsEarned === 3 ? 34 : 33; // Hard challenge gives slightly more
          const newPowerLevel = Math.min(100, word.power_level + pointIncrease);
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

    // Return to word selection screen after completing a challenge
    setSelectedWord(null);
  };

  return (
    <div className="game-screen">
      {/* Forest background with brightness based on progress */}
      <div
        className="forest-background"
        style={{
          backgroundImage: `url(${gameData.assets.images.forest_background_progress})`,
          filter: `brightness(${20 + forestBrightness * 0.8}%)`
        }}
      />

      {/* Header */}
      <header className="game-header">
        <h1 className="game-title">
          {gameData.title}
        </h1>
      </header>

      {/* Main content */}
      <main className="game-main">
        {!selectedWord ? (
          <>
            <h2 className="word-selection-title">Choose a Word to Grow</h2>

            <div className="word-runes-container">
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
          />
        )}
      </main>

      {/* Footer with progress */}
      <footer className="game-footer">
        <div className="progress-container">
          <p className="progress-text">Forest Light: {Math.round(overallProgress)}%</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameScreen; 