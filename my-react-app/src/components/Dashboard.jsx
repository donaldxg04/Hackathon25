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



const Dashboard = () => {
  const { gameState, formatDate, advanceDay, gameSpeed, setGameSpeed } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [shownMonths, setShownMonths] = useState(new Set()); // Track which month-years have triggered

  // Define trigger months: {month: 1-12, year: YYYY}
  const triggerMonths = [
    { month: 2, year: 2009 },
    { month: 5, year: 2009 },
    { month: 9, year: 2009 },
    { month: 12, year: 2009 },
    { month: 1, year: 2010 },
    { month: 6, year: 2010 },
    { month: 10, year: 2010 },
    { month: 3, year: 2011 },
    { month: 4, year: 2011 },
    { month: 7, year: 2011 },
    { month: 9, year: 2011 },
    { month: 11, year: 2011 },
    { month: 1, year: 2012 },
    { month: 2, year: 2012 },
    { month: 4, year: 2012 },
    { month: 8, year: 2012 },
    { month: 4, year: 2013 },
    { month: 7, year: 2013 },
    { month: 9, year: 2013 },
    { month: 12, year: 2013 },
    { month: 3, year: 2014 },
    { month: 8, year: 2014 },
    { month: 10, year: 2014 },
    { month: 1, year: 2015 },
    { month: 5, year: 2015 },
    { month: 7, year: 2015 },
    { month: 9, year: 2015 },
    { month: 12, year: 2015 },
    { month: 2, year: 2016 },
    { month: 6, year: 2016 },
    { month: 9, year: 2016 },
    { month: 11, year: 2016 },
    { month: 3, year: 2017 },
    { month: 7, year: 2017 },
    { month: 11, year: 2017 },
    { month: 1, year: 2018 },
    { month: 4, year: 2018 },
    { month: 6, year: 2018 },
    { month: 9, year: 2018 },
    { month: 12, year: 2018 },
    { month: 2, year: 2019 },
    { month: 5, year: 2019 },
    { month: 8, year: 2019 },
    { month: 10, year: 2019 }
  ];

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  // Helper function to create a month-year string key for comparison
  const getMonthYearKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  // Auto-advance timeline based on game speed (paused when decision modal is open)
  useEffect(() => {
    if (gameSpeed === 0 || activeModal === 'decision') return; // Paused or decision modal open

    // Calculate interval: 1000ms for 1x speed, 200ms for 5x speed (5 days/sec)
    const interval = gameSpeed === 1 ? 1000 : 200;

    // Log game speed for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Game speed set to: ${gameSpeed}x (interval: ${interval}ms per day)`);
    }

    const timer = setInterval(() => {
      advanceDay(); // Advances currentDate by 1 day and updates all stock prices
    }, interval);

    return () => clearInterval(timer);
  }, [gameSpeed, advanceDay, activeModal]);

  // Check for decision modal triggers
  useEffect(() => {
    if (!gameState?.currentDate) return; // Safety check
    
    const currentDate = gameState.currentDate;
    // Ensure currentDate is a valid Date object
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) return;
    
    const currentMonthYearKey = getMonthYearKey(currentDate);
    
    // Check if current month and year matches any trigger month
    const matchesTrigger = triggerMonths.some(trigger => {
      return currentDate.getFullYear() === trigger.year &&
             currentDate.getMonth() + 1 === trigger.month;
    });

    // Show modal if it matches a trigger month and hasn't been shown for this month yet
    if (matchesTrigger && !shownMonths.has(currentMonthYearKey) && activeModal === null) {
      // Pause the game when decision modal opens
      setGameSpeed(0);
      openModal('decision');
      setShownMonths(prev => new Set([...prev, currentMonthYearKey]));
    }
  }, [gameState.currentDate, shownMonths, activeModal, setGameSpeed]);

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
          </div>
        </div>
        <PlayerCard />
        <MarketWatchCard onClick={() => openModal('investing')} />
      </div>

      {/* Modals */}
      {activeModal === 'decision' && <DecisionModal onClose={closeModal} />}
      {activeModal === 'netWorth' && <NetWorthModal onClose={closeModal} />}
      {activeModal === 'assetAllocation' && <AssetAllocationModal onClose={closeModal} />}
      {activeModal === 'investing' && <InvestingModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
