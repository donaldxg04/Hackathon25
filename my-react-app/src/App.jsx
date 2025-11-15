import { GameProvider } from './context/GameContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Dashboard />
    </GameProvider>
  );
}

export default App;
