import { useState, useEffect } from 'react';
import gameData from '../data.json';
import './GameScreen.css';

// Word rune component
const WordRune = ({ word, onClick, isSelected }) => {
  const { power_level } = word;
  const isComplete = word.completed;

  // Convert color names to CSS classes
  const colorClass = `color-${word.word.toLowerCase()}`;
  const powerClass = `power-${Math.floor(power_level / 25)}`;

  return (
    <div
      className={`word-rune ${colorClass} ${powerClass} ${isSelected ? 'selected' : ''} ${isComplete ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="rune-circle">
        <span className="rune-word-inside">{word.word}</span>
        {isComplete && <span className="completion-mark">✓</span>}
      </div>
      <h3 className="power-percentage">{Math.round(power_level)}%</h3>
      <div className="power-bar-container">
        <div
          className={`power-bar ${colorClass}`}
          style={{
            width: `${power_level}%`
          }}
        />
      </div>
    </div>
  );
};

// Challenge screen component
const ChallengeScreen = ({ word, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [advancementMessage, setAdvancementMessage] = useState('');

  // Get color class
  const colorClass = `color-${word.word.toLowerCase()}`;

  // Find the challenge that matches the current difficulty level
  const currentChallenge = word.challenges.find(challenge =>
    challenge.difficulty === word.current_difficulty
  );

  // Helper function to get a random message from an array
  const getRandomMessage = (messages) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    // For hard challenges, the correct answer is always the word itself
    // For easy/medium, the correct answer is the second option (index 1)
    const correctIndex = currentChallenge.difficulty === 'hard'
      ? currentChallenge.choices.findIndex(choice => choice.toLowerCase() === word.word.toLowerCase())
      : 1;

    const correct = answerIndex === correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setFeedback(currentChallenge.feedback);
      setEarnedPoints(currentChallenge.points);

      // Set advancement message
      if (currentChallenge.difficulty === 'hard') {
        setAdvancementMessage(getRandomMessage(gameData.assets.mastery_messages));
      } else {
        setAdvancementMessage(getRandomMessage(gameData.assets.advancement_messages));
      }
    } else {
      setFeedback(currentChallenge.feedback_negative);
      setEarnedPoints(0);
      setAdvancementMessage('');
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
      onComplete(word.word, earnedPoints, true);
    } else {
      // Just go back to word selection without updating power level
      onComplete(word.word, 0, false);
    }
  };

  return (
    <div className="challenge-container">
      <div className={`challenge-rune ${colorClass}`}>
        <span className="rune-word-inside">{word.word}</span>
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
          {advancementMessage && isCorrect && (
            <p className="advancement-message">{advancementMessage}</p>
          )}
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
    const allWordsComplete = words.every(word => word.completed);
    if (allWordsComplete && onGameComplete) {
      // Give a short delay for celebration before moving to the end screen
      setTimeout(() => {
        onGameComplete();
      }, 3000);
    }
  }, [words, onGameComplete]);

  // Function to advance difficulty based on current difficulty
  const getNextDifficulty = (currentDifficulty) => {
    switch (currentDifficulty) {
      case 'easy':
        return 'medium';
      case 'medium':
        return 'hard';
      case 'hard':
      default:
        return 'hard'; // Already at maximum difficulty
    }
  };

  const handleChallengeComplete = (wordName, pointsEarned, isCorrect) => {
    setWords(prevWords => {
      return prevWords.map(word => {
        if (word.word === wordName && isCorrect) {
          // Calculate new power level based on challenge difficulty
          const difficultyBoost = word.current_difficulty === 'hard' ? 34 : 33;
          const newPowerLevel = Math.min(100, word.power_level + difficultyBoost);
          const newCorrectUses = word.correct_uses + 1;

          // Determine if we should advance to the next difficulty
          const nextDifficulty = getNextDifficulty(word.current_difficulty);
          const isWordComplete = nextDifficulty === 'hard' && word.current_difficulty === 'hard';

          return {
            ...word,
            power_level: newPowerLevel,
            correct_uses: newCorrectUses,
            current_difficulty: nextDifficulty,
            completed: isWordComplete || newPowerLevel >= 100
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

      {/* Header with title and progress bar */}
      <header className="game-header">
        <h1 className="game-title">
          {gameData.title}
        </h1>
        <div className="progress-container">
          <p className="progress-text">Forest Light: {Math.round(overallProgress)}%</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="game-main">
        {!selectedWord ? (
          <>
            <div className="content-area">
              <h2 className="word-selection-title">Choose a Word to Grow</h2>

              {words.filter(word => word.completed).length > 0 && words.filter(word => !word.completed).length > 0 && (
                <div className="word-selection-hint">
                  <p>Click on an incomplete word to continue your progress</p>
                </div>
              )}

              {words.filter(word => !word.completed).length === 0 && (
                <div className="completion-message">
                  <p>Congratulations! You've mastered all the words!</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ChallengeScreen
            word={selectedWord}
            onComplete={handleChallengeComplete}
          />
        )}
      </main>

      {/* Footer with word runes for easy thumb access */}
      <footer className="game-footer">
        {!selectedWord && (
          <div className="word-runes-container">
            {words.map((word) => (
              <WordRune
                key={word.word}
                word={word}
                onClick={() => !word.completed && setSelectedWord(word)}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};

export default GameScreen; 