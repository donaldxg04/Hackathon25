import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import NetWorthCard from './NetWorthCard';
import AssetAllocationCard from './AssetAllocationCard';
import PlayerCard from './PlayerCard';
import MarketWatchCard from './MarketWatchCard';
import NetWorthModal from './NetWorthModal';
import AssetAllocationModal from './AssetAllocationModal';
import InvestingModal from './InvestingModal';
import DecisionModal from './DecisionModal';
import PropertiesVehiclesModal from './PropertiesVehiclesModal';
import PropertiesVehiclesCard from './PropertiesVehiclesCard';
import { getNextStoryEvent } from '../data/storyEvents';



const Dashboard = () => {
  const { gameState, formatDate, advanceDay, gameSpeed, setGameSpeed } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [currentStoryEvent, setCurrentStoryEvent] = useState(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentStoryEvent(null);
    document.body.style.overflow = '';
  };

  // Helper function to create a month-year string key for comparison
  const getMonthYearKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  // Auto-advance timeline based on game speed (paused when decision modal is open)
  useEffect(() => {
    if (gameSpeed === 0 || activeModal === 'decision') return; // Paused or decision modal open

    // Calculate interval: 1000ms for 1x speed, 200ms for 5x speed
    const interval = gameSpeed === 1 ? 1000 : 200;

    const timer = setInterval(() => {
      advanceDay();
    }, interval);

    return () => clearInterval(timer);
  }, [gameSpeed, advanceDay, activeModal]);

  // Check for story event triggers based on age and month
  useEffect(() => {
    if (!gameState?.currentDate || !gameState?.player) return; // Safety check
    
    const currentDate = gameState.currentDate;
    // Ensure currentDate is a valid Date object
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) return;
    
    const currentAge = gameState.player.age;
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const completedEventIds = gameState.storyProgress?.completedEvents || [];
    
    // Get the next story event for this age and month
    const nextEvent = getNextStoryEvent(currentAge, currentMonth, completedEventIds);
    
    // Show modal if there's an event and no modal is currently open
    if (nextEvent && activeModal === null) {
      // Pause the game when decision modal opens
      setGameSpeed(0);
      setCurrentStoryEvent(nextEvent);
      openModal('decision');
    }
  }, [gameState.currentDate, gameState.player?.age, gameState.storyProgress, activeModal, setGameSpeed]);

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <NetWorthCard onClick={() => openModal('netWorth')} />
        <AssetAllocationCard onClick={() => openModal('assetAllocation')} />
        <PropertiesVehiclesCard onClick={() => openModal('propertiesVehicles')} />
      </div>

      {/* Right Column */}
      <div className="right-column">
        <div className="date-container">
          <div className="date-display">
            {gameState?.currentDate && gameState.currentDate instanceof Date && !isNaN(gameState.currentDate.getTime())
              ? formatDate(gameState.currentDate)
              : 'Loading...'}
          </div>
          <div className="timeline-controls">
            <button
              className={`btn-timeline ${gameSpeed === 0 ? 'active' : ''}`}
              onClick={() => setGameSpeed(0)}
              disabled={activeModal === 'decision'}
              title="Pause"
            >
              ⏸
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 1 ? 'active' : ''}`}
              onClick={() => setGameSpeed(1)}
              disabled={activeModal === 'decision'}
              title="Normal Speed (1 day/sec)"
            >
              ▶ 1x
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 5 ? 'active' : ''}`}
              onClick={() => setGameSpeed(5)}
              disabled={activeModal === 'decision'}
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
      {activeModal === 'decision' && currentStoryEvent && (
        <DecisionModal 
          event={currentStoryEvent} 
          onClose={closeModal} 
        />
      )}
      {activeModal === 'netWorth' && <NetWorthModal onClose={closeModal} />}
      {activeModal === 'assetAllocation' && <AssetAllocationModal onClose={closeModal} />}
      {activeModal === 'investing' && <InvestingModal onClose={closeModal} />}
      {activeModal === 'propertiesVehicles' && <PropertiesVehiclesModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
