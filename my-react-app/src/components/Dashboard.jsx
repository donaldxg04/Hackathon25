import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import NetWorthCard from './NetWorthCard';
import AssetAllocationCard from './AssetAllocationCard';
import PlayerCard from './PlayerCard';
import MarketWatchCard from './MarketWatchCard';
import NetWorthModal from './NetWorthModal';
import AssetAllocationModal from './AssetAllocationModal';
import InvestingModal from './InvestingModal';

const Dashboard = () => {
  const { gameState, formatDate, advanceDay, gameSpeed, setGameSpeed } = useGame();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  // Auto-advance timeline based on game speed
  useEffect(() => {
    if (gameSpeed === 0) return; // Paused

    // Calculate interval: 1000ms for 1x speed, 200ms for 5x speed
    const interval = gameSpeed === 1 ? 1000 : 200;

    const timer = setInterval(() => {
      advanceDay();
    }, interval);

    return () => clearInterval(timer);
  }, [gameSpeed, advanceDay]);

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <NetWorthCard onClick={() => openModal('netWorth')} />
        <AssetAllocationCard onClick={() => openModal('assetAllocation')} />
      </div>

      {/* Right Column */}
      <div className="right-column">
        <div className="date-container">
          <div className="date-display">{formatDate(gameState.currentDate)}</div>
          <div className="timeline-controls">
            <button
              className={`btn-timeline ${gameSpeed === 0 ? 'active' : ''}`}
              onClick={() => setGameSpeed(0)}
              title="Pause"
            >
              ⏸
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 1 ? 'active' : ''}`}
              onClick={() => setGameSpeed(1)}
              title="Normal Speed (1 day/sec)"
            >
              ▶ 1x
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 5 ? 'active' : ''}`}
              onClick={() => setGameSpeed(5)}
              title="Fast Speed (5 days/sec)"
            >
              ⏩ 5x
            </button>
          </div>
        </div>
        <PlayerCard />
        <MarketWatchCard onClick={() => openModal('investing')} />
      </div>

      {/* Modals */}
      {activeModal === 'netWorth' && <NetWorthModal onClose={closeModal} />}
      {activeModal === 'assetAllocation' && <AssetAllocationModal onClose={closeModal} />}
      {activeModal === 'investing' && <InvestingModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
