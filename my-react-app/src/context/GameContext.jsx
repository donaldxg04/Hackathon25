import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// Choice B state template for Big Tech Data Science role
const choiceBState = {
  currentDate: new Date(2009, 0, 1),
  player: {
    name: "John Doe",
    age: 25,
    occupation: "Data Scientist",
    location: "Mountain View, CA",
    housingStatus: "renting"
  },
  income: {
    salary: 9000,        // Large firm DS role, monthly
    investments: 0,
    other: 0
  },
  expenses: {
    rent: 1700,          // Mountain View 1BR in 2009
    mortgage: 0,
    utilities: 220,
    food: 550,
    transportation: 450, // Car loan + gas + maintenance
    insurance: 120,      // Car insurance only (company covers health)
    entertainment: 250,
    other: 300
  },
  stats: {
    health: 80,
    stress: 25,          // Safer role lowers early stress
    happiness: 70
  },
  finance: {
    netWorth: 0,         // Starts with no money
    netWorthHistory: [
      { month: "Jan 2009", value: 0 }
    ],
    assetAllocation: {
      checking: 0,
      investments: 0,
      emergencyFund: 0
    }
  },
  markets: {
    positions: [
      { symbol: "ACME", shares: 0, price: 100 },
      { symbol: "TECH", shares: 100, price: 250 },   // Stock grant
      { symbol: "CRYPTO_ETF", shares: 0, price: 50 }
    ],
    priceHistory: {
      ACME: [
        { month: "Jan 2009", value: 100 }
      ],
      TECH: [
        { month: "Jan 2009", value: 250 }
      ],
      CRYPTO_ETF: [
        { month: "Jan 2009", value: 50 }
      ]
    }
  }
};

export const GameProvider = ({ children }) => {
  // Track whether the game has been started via the start menu
  const [hasStarted, setHasStarted] = useState(false);

  // Game speed: 0 = paused, 1 = normal (1 day/sec), 5 = fast (5 days/sec)
  const [gameSpeed, setGameSpeed] = useState(1);

  // Use choiceBState as the default initial state
  const [gameState, setGameState] = useState({...choiceBState});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const clampStat = (value) => {
    return Math.max(0, Math.min(100, value));
  };

  const recalculateNetWorth = useCallback(() => {
    setGameState(prev => {
      let total = 0;
      
      // Add asset allocation categories
      for (const key in prev.finance.assetAllocation) {
        total += prev.finance.assetAllocation[key];
      }
      
      // Add market positions at current prices
      prev.markets.positions.forEach(position => {
        total += position.shares * position.price;
      });
      
      const newHistory = [...prev.finance.netWorthHistory];
      if (newHistory.length > 0) {
        newHistory[newHistory.length - 1].value = total;
      }
      
      return {
        ...prev,
        finance: {
          ...prev.finance,
          netWorth: total,
          netWorthHistory: newHistory
        }
      };
    });
  }, []);

  const updateStats = useCallback((healthChange, stressChange, happinessChange) => {
    setGameState(prev => ({
      ...prev,
      stats: {
        health: clampStat(prev.stats.health + healthChange),
        stress: clampStat(prev.stats.stress + stressChange),
        happiness: clampStat(prev.stats.happiness + happinessChange)
      }
    }));
  }, []);

    const transferFunds = useCallback((fromKey, toKey, amount) => {
    if (fromKey === toKey) {
      return { success: false, message: 'Source and destination must be different.' };
    }
    if (amount <= 0) {
      return { success: false, message: 'Amount must be greater than zero.' };
    }

    setGameState(prev => {
      if (prev.finance.assetAllocation[fromKey] < amount) {
        return prev; // Will be handled by caller
      }

      const newAllocation = { ...prev.finance.assetAllocation };
      newAllocation[fromKey] -= amount;
      newAllocation[toKey] += amount;

      return {
        ...prev,
        finance: {
          ...prev.finance,
          assetAllocation: newAllocation
        }
      };
    });

    recalculateNetWorth();
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
    return { success: true, message: `Transferred ${formattedAmount} successfully.` };
  }, [recalculateNetWorth]);

  const buyStock = useCallback((symbol, shares) => {
    if (shares <= 0) {
      return { success: false, message: 'Number of shares must be greater than zero.' };
    }

    setGameState(prev => {
      const position = prev.markets.positions.find(p => p.symbol === symbol);
      if (!position) {
        return prev; // Will be handled by caller
      }

      const price = position.price;
      const cost = price * shares;

      // Check if investments allocation has enough cash
      if (prev.finance.assetAllocation.investments < cost) {
        return prev; // Will be handled by caller
      }

      // Update positions
      const newPositions = prev.markets.positions.map(p =>
        p.symbol === symbol ? { ...p, shares: p.shares + shares } : p
      );

      // Deduct from investments allocation
      const newAllocation = { ...prev.finance.assetAllocation };
      newAllocation.investments -= cost;

      return {
        ...prev,
        markets: {
          ...prev.markets,
          positions: newPositions
        },
        finance: {
          ...prev.finance,
          assetAllocation: newAllocation
        }
      };
    });

    recalculateNetWorth();
    return { success: true, message: `Bought ${shares} shares of ${symbol} successfully.` };
  }, [recalculateNetWorth]);

  const sellStock = useCallback((symbol, shares) => {
    if (shares <= 0) {
      return { success: false, message: 'Number of shares must be greater than zero.' };
    }

    setGameState(prev => {
      const position = prev.markets.positions.find(p => p.symbol === symbol);
      if (!position || position.shares < shares) {
        return prev; // Will be handled by caller
      }

      const price = position.price;
      const proceeds = price * shares;

      // Update positions (remove if shares go to 0)
      const newPositions = prev.markets.positions.map(p =>
        p.symbol === symbol ? { ...p, shares: p.shares - shares } : p
      );

      // Add proceeds to investments allocation
      const newAllocation = { ...prev.finance.assetAllocation };
      newAllocation.investments += proceeds;

      return {
        ...prev,
        markets: {
          ...prev.markets,
          positions: newPositions
        },
        finance: {
          ...prev.finance,
          assetAllocation: newAllocation
        }
      };
    });

    recalculateNetWorth();
    return { success: true, message: `Sold ${shares} shares of ${symbol} successfully.` };
  }, [recalculateNetWorth]);

  const getStockPrice = useCallback((symbol) => {
    const position = gameState.markets.positions.find(p => p.symbol === symbol);
    return position ? position.price : 0;
  }, [gameState.markets.positions]);

  const formatDate = (date) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatMonthYear = (date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const advanceDay = useCallback(() => {
    setGameState(prev => {
      // Create new date (next day)
      const newDate = new Date(prev.currentDate);
      newDate.setDate(newDate.getDate() + 1);

      const dayOfMonth = newDate.getDate();
      const isFirstOfMonth = dayOfMonth === 1;
      const isFourteenthOfMonth = dayOfMonth === 14;

      // Check if year changed to increment age
      const ageIncrement = newDate.getFullYear() > prev.currentDate.getFullYear() ? 1 : 0;

      let newAllocation = { ...prev.finance.assetAllocation };
      let newPositions = [...prev.markets.positions];
      let newPriceHistory = { ...prev.markets.priceHistory };

      // Salary payments: 1/2 of monthly salary on 1st and 14th
      if (isFirstOfMonth || isFourteenthOfMonth) {
        const halfSalary = prev.income.salary / 2;
        newAllocation.checking += halfSalary;
      }

      // Rent and utilities paid on 1st of month
      if (isFirstOfMonth) {
        // Pay rent or mortgage
        if (prev.player.housingStatus === 'renting') {
          newAllocation.checking -= prev.expenses.rent;
        } else if (prev.player.housingStatus === 'owner') {
          newAllocation.checking -= prev.expenses.mortgage;
        }

        // Pay utilities
        newAllocation.checking -= prev.expenses.utilities;

        // Apply overdraft fee if checking went negative
        const OVERDRAFT_FEE = 35;
        if (newAllocation.checking < 0 && prev.finance.assetAllocation.checking >= 0) {
          // Just went into overdraft
          newAllocation.checking -= OVERDRAFT_FEE;
        } else if (newAllocation.checking < 0 && prev.finance.assetAllocation.checking < 0) {
          // Already in overdraft, apply fee again
          newAllocation.checking -= OVERDRAFT_FEE;
        }

        // Apply monthly emergency fund interest on 1st of month
        const EMERGENCY_FUND_INTEREST_RATE = 0.02 / 12; // 2% annual = ~0.167% monthly
        const emergencyFundInterest = prev.finance.assetAllocation.emergencyFund * EMERGENCY_FUND_INTEREST_RATE;
        newAllocation.emergencyFund += emergencyFundInterest;

        // Update stock prices on 1st of month with some random variation (-5% to +5%)
        newPositions = prev.markets.positions.map(position => ({
          ...position,
          price: Math.max(1, position.price * (1 + (Math.random() * 0.1 - 0.05)))
        }));

        // Update price history for each stock on 1st of month
        newPriceHistory = {};
        for (const symbol in prev.markets.priceHistory) {
          const position = newPositions.find(p => p.symbol === symbol);
          const history = [...prev.markets.priceHistory[symbol], {
            month: formatMonthYear(newDate),
            value: position ? position.price : 0
          }];
          if (history.length > 12) {
            history.shift();
          }
          newPriceHistory[symbol] = history;
        }
      } else {
        // Keep same positions and price history if not 1st
        newPositions = prev.markets.positions;
        newPriceHistory = prev.markets.priceHistory;
      }

      // Calculate new net worth
      let newNetWorth = 0;
      for (const key in newAllocation) {
        newNetWorth += newAllocation[key];
      }
      newPositions.forEach(position => {
        newNetWorth += position.shares * position.price;
      });

      // Update net worth history only on 1st of month
      let newHistory = prev.finance.netWorthHistory;
      if (isFirstOfMonth) {
        newHistory = [...prev.finance.netWorthHistory, {
          month: formatMonthYear(newDate),
          value: newNetWorth
        }];
        if (newHistory.length > 12) {
          newHistory.shift();
        }
      } else {
        // Update the current month's value
        newHistory = [...prev.finance.netWorthHistory];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1].value = newNetWorth;
        }
      }

      return {
        ...prev,
        currentDate: newDate,
        player: {
          ...prev.player,
          age: prev.player.age + ageIncrement
        },
        finance: {
          ...prev.finance,
          netWorth: newNetWorth,
          netWorthHistory: newHistory,
          assetAllocation: newAllocation
        },
        markets: {
          ...prev.markets,
          positions: newPositions,
          priceHistory: newPriceHistory
        }
      };
    });
  }, []);

  const getTotalIncome = useCallback(() => {
    return Object.values(gameState.income).reduce((sum, val) => sum + val, 0);
  }, [gameState.income]);

  const getTotalExpenses = useCallback(() => {
    let total = 0;
    for (const [key, value] of Object.entries(gameState.expenses)) {
      if (key === 'rent' && gameState.player.housingStatus === 'renting') {
        total += value;
      } else if (key === 'mortgage' && gameState.player.housingStatus === 'owner') {
        total += value;
      } else if (key !== 'rent' && key !== 'mortgage') {
        total += value;
      }
    }
    return total;
  }, [gameState.expenses, gameState.player.housingStatus]);

  // Initialize game with Choice B (Big Tech Data Science role) and player name
  const startGameWithChoiceB = useCallback((playerName) => {
    setGameState({
      ...choiceBState,
      player: {
        ...choiceBState.player,
        name: playerName || "John Doe"
      }
    });
    setHasStarted(true);
  }, []);

  const value = {
    gameState,
    gameSpeed,
    setGameSpeed,
    formatCurrency,
    formatDate,
    recalculateNetWorth,
    updateStats,
    transferFunds,
    buyStock,
    sellStock,
    getStockPrice,
    advanceDay,
    getTotalIncome,
    getTotalExpenses,
    hasStarted,
    startGameWithChoiceB
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

