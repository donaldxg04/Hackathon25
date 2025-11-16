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
import LedgerModal from './LedgerModal';
import LedgerCard from './LedgerCard';
import { shouldTriggerEvent } from '../data/storyline';



const Dashboard = () => {
  const { gameState, formatDate, advanceDay, gameSpeed, setGameSpeed } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [shownEventKeys, setShownEventKeys] = useState(new Set()); // Track which events have been shown
  const [currentEvent, setCurrentEvent] = useState(null); // Current event to display in modal

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  // Auto-advance timeline based on game speed (paused when decision modal is open)
  useEffect(() => {
    if (gameSpeed === 0 || activeModal === 'decision') return; // Paused or decision modal open

    // Calculate interval: 1000ms for 1x speed, 200ms for 5x speed, 100ms for 10x speed
    const interval = gameSpeed === 1 ? 1000 : gameSpeed === 5 ? 200 : gameSpeed === 10 ? 100 : 1000;

    const timer = setInterval(() => {
      advanceDay(); // Advances currentDate by 1 day and updates all stock prices
    }, interval);

    return () => clearInterval(timer);
  }, [gameSpeed, advanceDay, activeModal]);

  // Check for storyline event triggers
  useEffect(() => {
    if (!gameState?.currentDate) return; // Safety check

    const currentDate = gameState.currentDate;
    // Ensure currentDate is a valid Date object
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) return;

    // Check if an event should trigger on this date
    const { shouldTrigger, event, eventKey } = shouldTriggerEvent(currentDate, shownEventKeys);

    // Show event modal even if other modals are open (events take priority)
    if (shouldTrigger && event && activeModal !== 'decision') {
      // Pause the game when decision modal opens
      setGameSpeed(0);
      setCurrentEvent(event);
      openModal('decision'); // This will close any other open modal and show the event
      setShownEventKeys(prev => new Set([...prev, eventKey]));
    }
  }, [gameState.currentDate, shownEventKeys, activeModal, setGameSpeed]);

  return (
    <div className="dashboard-container">
      {/* FinLife Logo */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
        zIndex: 100,
        border: '2px solid rgba(255, 255, 255, 0.2)',
        cursor: 'default',
        userSelect: 'none'
      }}>
        <span style={{
          fontSize: '24px',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }}>
          💰
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            FinLife
          </span>
          <span style={{
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600'
          }}>
            Financial Literacy
          </span>
        </div>
      </div>
      
      {/* Left Column */}
      <div className="left-column">
        <NetWorthCard onClick={() => openModal('netWorth')} />
        <AssetAllocationCard onClick={() => openModal('assetAllocation')} />
        <LedgerCard onClick={() => openModal('ledger')} />
      </div>

      {/* Right Column */}
      <div className="right-column">
        <div className="date-container">
          {/* Date display updates automatically as currentDate changes in GameContext */}
          <div className="date-display" key={gameState?.currentDate?.getTime()}>
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
            <button
              className={`btn-timeline ${gameSpeed === 10 ? 'active' : ''}`}
              onClick={() => setGameSpeed(10)}
              disabled={activeModal === 'decision'}
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
      {activeModal === 'decision' && <DecisionModal onClose={closeModal} event={currentEvent} />}
      {activeModal === 'netWorth' && <NetWorthModal onClose={closeModal} />}
      {activeModal === 'assetAllocation' && <AssetAllocationModal onClose={closeModal} />}
      {activeModal === 'investing' && <InvestingModal onClose={closeModal} />}
      {activeModal === 'ledger' && <LedgerModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
