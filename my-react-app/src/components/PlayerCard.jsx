import { useGame } from '../context/GameContext';

const PlayerCard = () => {
  const { gameState, updateStats } = useGame();

  const triggerRandomEvent = () => {
    const healthChange = Math.floor(Math.random() * 31) - 15;
    const stressChange = Math.floor(Math.random() * 31) - 15;
    const happinessChange = Math.floor(Math.random() * 31) - 15;
    updateStats(healthChange, stressChange, happinessChange);
  };

  return (
    <div className="card player-card">
      <div className="player-info">
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{gameState.player.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Age:</span>
          <span className="info-value">{gameState.player.age}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Occupation:</span>
          <span className="info-value">{gameState.player.occupation}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Location:</span>
          <span className="info-value">{gameState.player.location}</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-bar">
          <div className="stat-label">
            <span>Health Bar</span>
            <span className="stat-value">{gameState.stats.health}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill health-bar" style={{ width: `${gameState.stats.health}%` }}></div>
          </div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">
            <span>Stress Bar</span>
            <span className="stat-value">{gameState.stats.stress}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill stress-bar" style={{ width: `${gameState.stats.stress}%` }}></div>
          </div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">
            <span>Happiness Bar</span>
            <span className="stat-value">{gameState.stats.happiness}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill happiness-bar" style={{ width: `${gameState.stats.happiness}%` }}></div>
          </div>
        </div>
      </div>

      <div className="test-controls">
        <button className="btn-primary" onClick={triggerRandomEvent}>Random Day Event</button>
      </div>
    </div>
  );
};

export default PlayerCard;

