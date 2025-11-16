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

  useEffect(() => {
    const currentDate = gameState.currentDate;
    const currentMonthYearKey = getMonthYearKey(currentDate);
    
    // Check if current month and year matches any trigger month
    const matchesTrigger = triggerMonths.some(trigger => {
      return currentDate.getFullYear() === trigger.year &&
             currentDate.getMonth() + 1 === trigger.month;
    });

    // Show modal if it matches a trigger month and hasn't been shown for this month yet
    if (matchesTrigger && !shownMonths.has(currentMonthYearKey) && activeModal === null) {
      openModal('decision');
      setShownMonths(prev => new Set([...prev, currentMonthYearKey]));
    }
  }, [gameState.currentDate, shownMonths, activeModal]);

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
