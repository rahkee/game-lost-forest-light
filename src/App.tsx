import { useState, useEffect } from 'react'
import './App.css'
import gameData from './data.json'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'

// Set this to false before production
const DEBUG_MODE = true;

function App() {
  const [gameState, setGameState] = useState<string>(gameData.state.currentScreen)
  const [gameProgress, setGameProgress] = useState<any>(gameData.state.gameProgress || {})

  // Function to switch to the game screen
  const handleStartGame = () => {
    setGameState('GameScreen')
  }

  // Function to switch to the end screen when game is complete
  const handleGameComplete = () => {
    setGameState('EndScreen')
  }

  // Function to restart the game
  const handlePlayAgain = () => {
    // Reset game progress
    setGameProgress({})
    setGameState('StartScreen')
  }

  return (
    <div className="app-container">
      {gameState === 'StartScreen' && (
        <StartScreen onStartGame={handleStartGame} />
      )}

      {gameState === 'GameScreen' && (
        <GameScreen onGameComplete={handleGameComplete} />
      )}

      {gameState === 'EndScreen' && (
        <EndScreen onPlayAgain={handlePlayAgain} />
      )}

      {/* Developer debug controls - remove before production */}
      {DEBUG_MODE && (
        <div className="debug-controls">
          <button onClick={() => setGameState('StartScreen')}>Debug: Start Screen</button>
          <button onClick={() => setGameState('GameScreen')}>Debug: Game Screen</button>
          <button onClick={() => setGameState('EndScreen')}>Debug: End Screen</button>
        </div>
      )}
    </div>
  )
}

export default App
