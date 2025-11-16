import { useGame } from '../context/GameContext';

const PlayerCard = () => {
  const { gameState } = useGame();

  // Safety checks
  if (!gameState?.player || !gameState?.stats) {
    return (
      <div className="card player-card">
        <p>Loading player data...</p>
      </div>
    );
  }

  const player = gameState.player || {};
  const stats = gameState.stats || { health: 0, stress: 0, happiness: 0 };

  return (
    <div className="card player-card">
      <div className="player-info">
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{player.name || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Age:</span>
          <span className="info-value">{player.age ?? 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Occupation:</span>
          <span className="info-value">{player.occupation || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Location:</span>
          <span className="info-value">{player.location || 'N/A'}</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-bar">
          <div className="stat-label">
            <span>Health Bar</span>
            <span className="stat-value">{stats.health ?? 0}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill health-bar" style={{ width: `${stats.health ?? 0}%` }}></div>
          </div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">
            <span>Stress Bar</span>
            <span className="stat-value">{stats.stress ?? 0}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill stress-bar" style={{ width: `${stats.stress ?? 0}%` }}></div>
          </div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">
            <span>Happiness Bar</span>
            <span className="stat-value">{stats.happiness ?? 0}%</span>
          </div>
          <div className="bar-background">
            <div className="bar-fill happiness-bar" style={{ width: `${stats.happiness ?? 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

