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
  const { gameState, formatDate, advanceMonth } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [shownDates, setShownDates] = useState(new Set()); // Track which dates have triggered

  // Define trigger dates: {month: 1-12, day: 1-31, year: YYYY}
  const triggerDates = [
    { month: 2, day: 6, year: 2009 },
    { month: 5, day: 19, year: 2009 },
    { month: 9, day: 2, year: 2009 },
    { month: 12, day: 11, year: 2009 },
    { month: 1, day: 28, year: 2010},
    { month: 6, day: 9, year: 2010 },
    { month: 10, day: 20, year: 2010 },
    { month: 3, day: 3, year: 2011 },
    { month: 4, day: 27, year: 2011 },
    { month: 7, day: 14, year: 2011 },
    { month: 9, day: 6, year: 2011 },
    { month: 11, day: 22, year: 2011 },
    { month: 2, day: 13, year: 2012 },
    { month: 4, day: 30, year: 2012 },
    { month: 8, day: 18, year: 2012 },
    { month: 1, day: 8, year: 2012 },
    { month: 4, day: 21, year: 2013 },
    { month: 7, day: 16, year: 2013},
    { month: 9, day: 29, year: 2013 },
    { month: 12, day: 12, year: 2013 },
    { month: 3, day: 11, year: 2014},
    { month: 8, day: 7, year: 2014 },
    { month: 10, day: 25, year: 2014 },
    { month: 1, day: 20, year: 2015 },
    { month: 5, day: 3, year: 2015 },
    { month: 7, day: 11, year: 2015 },
    { month: 9, day: 14, year: 2015 },
    { month: 12, day: 19, year: 2015 },
    { month: 2, day: 28, year: 2016 },
    { month: 6, day: 16, year: 2016 },
    { month: 9, day: 4, year: 2016 },
    { month: 11, day: 27, year: 2016 },
    { month: 3, day: 22, year: 2017 },
    { month: 7, day: 9, year: 2017 },
    { month: 11, day: 1, year: 2017 },
    { month: 1, day: 4, year: 2018 },
    { month: 4, day: 18, year: 2018 },
    { month: 6, day: 30, year: 2018 },
    { month: 9, day: 13, year: 2018 },
    { month: 12, day: 8, year: 2018 },
    { month: 2, day: 1, year: 2019 },
    { month: 5, day: 24, year: 2019 },
    { month: 8, day: 5, year: 2019 },
    { month: 10, day: 28, year: 2019 }
  ];

  const openModal = (modalId) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  // Helper function to create a date string key for comparison
  const getDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  useEffect(() => {
    const currentDate = gameState.currentDate;
    const currentDateKey = getDateKey(currentDate);
    
    // Check if current date matches any trigger date
    const matchesTrigger = triggerDates.some(trigger => {
      return currentDate.getFullYear() === trigger.year &&
             currentDate.getMonth() + 1 === trigger.month &&
             currentDate.getDate() === trigger.day;
    });

    // Show modal if it matches a trigger date and hasn't been shown for this date yet
    if (matchesTrigger && !shownDates.has(currentDateKey) && activeModal === null) {
      openModal('decision');
      setShownDates(prev => new Set([...prev, currentDateKey]));
    }
  }, [gameState.currentDate, shownDates, activeModal]);

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
          <button className="btn-next-month" onClick={advanceMonth}>Next Month →</button>
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
