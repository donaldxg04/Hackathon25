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
import RandomEventModal from './RandomEventModal';
import LedgerModal from './LedgerModal';
import LedgerCard from './LedgerCard';
import { getNextStoryEvent } from '../data/storyEvents';
import { getRandomEvent } from '../data/randomEvents';



const Dashboard = () => {
  const { gameState, formatDate, advanceDay, gameSpeed, setGameSpeed } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [currentStoryEvent, setCurrentStoryEvent] = useState(null);
  const [currentRandomEvent, setCurrentRandomEvent] = useState(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentStoryEvent(null);
    setCurrentRandomEvent(null);
    document.body.style.overflow = '';
  };

  const [decisionJustCompleted, setDecisionJustCompleted] = useState(false);

  const handleDecisionComplete = () => {
    // Mark that a decision was just completed
    setDecisionJustCompleted(true);
  };

  // Watch for when decision modal closes and trigger random event
  useEffect(() => {
    if (decisionJustCompleted && activeModal !== 'decision' && activeModal !== 'randomEvent') {
      // Decision modal has closed, now check stats for random event
      // Use a small delay to ensure state has fully updated
      const timer = setTimeout(() => {
        const currentStress = gameState.stats.stress;
        const currentHappiness = gameState.stats.happiness;
        const randomEvent = getRandomEvent(currentStress, currentHappiness);
        
        if (randomEvent) {
          setCurrentRandomEvent(randomEvent);
          setGameSpeed(0); // Pause game for random event
          openModal('randomEvent');
        }
        setDecisionJustCompleted(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [decisionJustCompleted, activeModal, gameState.stats.stress, gameState.stats.happiness, setGameSpeed]);

  // Helper function to create a month-year string key for comparison
  const getMonthYearKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  // Auto-advance timeline based on game speed (paused when decision or random event modal is open)
  useEffect(() => {
    if (gameSpeed === 0 || activeModal === 'decision' || activeModal === 'randomEvent') return; // Paused or modals open

    // Calculate interval: 1000ms for 1x speed, 200ms for 5x speed, 100ms for 10x speed
    const interval = gameSpeed === 1 ? 1000 : gameSpeed === 5 ? 200 : gameSpeed === 10 ? 100 : 1000;

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
  }, [gameState.currentDate, gameState.player?.age, gameState.storyProgress, activeModal, setGameSpeed, gameState.stats]);

  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-column">
        <NetWorthCard onClick={() => openModal('netWorth')} />
        <AssetAllocationCard onClick={() => openModal('assetAllocation')} />
        <LedgerCard onClick={() => openModal('ledger')} />
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
              disabled={activeModal === 'decision' || activeModal === 'randomEvent'}
              title="Pause"
            >
              ⏸
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 1 ? 'active' : ''}`}
              onClick={() => setGameSpeed(1)}
              disabled={activeModal === 'decision' || activeModal === 'randomEvent'}
              title="Normal Speed (1 day/sec)"
            >
              ▶ 1x
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 5 ? 'active' : ''}`}
              onClick={() => setGameSpeed(5)}
              disabled={activeModal === 'decision' || activeModal === 'randomEvent'}
              title="Fast Speed (5 days/sec)"
            >
              ⏩ 5x
            </button>
            <button
              className={`btn-timeline ${gameSpeed === 10 ? 'active' : ''}`}
              onClick={() => setGameSpeed(10)}
              disabled={activeModal === 'decision' || activeModal === 'randomEvent'}
              title="Very Fast Speed (10 days/sec)"
            >
              ⏩⏩ 10x
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
          onDecisionComplete={handleDecisionComplete}
        />
      )}
      {activeModal === 'randomEvent' && currentRandomEvent && (
        <RandomEventModal
          event={currentRandomEvent}
          onClose={closeModal}
        />
      )}
      {activeModal === 'netWorth' && <NetWorthModal onClose={closeModal} />}
      {activeModal === 'assetAllocation' && <AssetAllocationModal onClose={closeModal} />}
      {activeModal === 'investing' && <InvestingModal onClose={closeModal} />}
      {activeModal === 'ledger' && <LedgerModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
