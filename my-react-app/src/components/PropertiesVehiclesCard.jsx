import { useGame } from '../context/GameContext';

const UNLOCK_NETWORTH = 150000;

const PropertiesVehiclesCard = ({ onClick }) => {
  const { gameState, formatCurrency } = useGame();
  const netWorth = gameState.finance.netWorth;
  const isUnlocked = netWorth >= UNLOCK_NETWORTH;
  const ownedProperties = gameState.properties || [];
  const ownedVehicles = gameState.vehicles || [];

  return (
    <div className={`card properties-vehicles-card ${!isUnlocked ? 'locked' : ''}`} onClick={onClick}>
      <div className="card-header-with-icon">
        <h3>Properties & Vehicles</h3>
        {!isUnlocked && <span className="lock-icon-small">🔒</span>}
      </div>
      {isUnlocked ? (
        <div className="pv-card-content">
          <div className="pv-card-stats">
            <div className="pv-stat">
              <span className="pv-stat-label">Properties:</span>
              <span className="pv-stat-value">{ownedProperties.length}</span>
            </div>
            <div className="pv-stat">
              <span className="pv-stat-label">Vehicles:</span>
              <span className="pv-stat-value">{ownedVehicles.length}</span>
            </div>
          </div>
          <div className="pv-card-hint">Click to manage</div>
        </div>
      ) : (
        <div className="pv-card-locked">
          <p>Unlock at {formatCurrency(UNLOCK_NETWORTH)}</p>
          <p className="pv-card-progress">
            {formatCurrency(netWorth)} / {formatCurrency(UNLOCK_NETWORTH)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertiesVehiclesCard;

