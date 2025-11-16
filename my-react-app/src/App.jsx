import { GameProvider, useGame } from './context/GameContext';
import Dashboard from './components/Dashboard';
import StartMenu from './components/StartMenu';
import './App.css';

// Inner component that uses the GameContext
function GameContent() {
  const { hasStarted } = useGame();

  return (
    <>
      {hasStarted && <Dashboard />}
      {!hasStarted && <StartMenu />}
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
