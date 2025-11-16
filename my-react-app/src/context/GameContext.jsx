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
      emergencyFund: 0,
      retirement401k: 0
    },
    retirement401k: {
      contributionPercent: 0,
      strategy: 'VOO',
      balance: 0,
      shares: 0
    }
  },
  markets: {
    positions: [
      { symbol: "ACME", shares: 0, price: 100 },
      { symbol: "TECH", shares: 100, price: 250 },   // Stock grant
      { symbol: "CRYPTO_ETF", shares: 0, price: 50 },
      { symbol: "VOO", shares: 0, price: 100 },
      { symbol: "VTI", shares: 0, price: 80 },
      { symbol: "VXUS", shares: 0, price: 60 }
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
      ],
      VOO: [
        { month: "Jan 2009", value: 100 }
      ],
      VTI: [
        { month: "Jan 2009", value: 80 }
      ],
      VXUS: [
        { month: "Jan 2009", value: 60 }
      ]
    }
  }
};

export const GameProvider = ({ children }) => {
  // Track whether the game has been started via the start menu
  const [hasStarted, setHasStarted] = useState(false);

  const [gameState, setGameState] = useState({
    currentDate: new Date(2009, 0, 1), // January 1, 2009
    player: {
      name: "John Doe",
      age: 25,
      occupation: "Software Developer",
      location: "San Francisco, CA",
      housingStatus: "renting" // "renting" or "owner"
    },
    income: {
      salary: 8000,
      investments: 0,
      other: 0
    },
    expenses: {
      rent: 1500, // Only applicable when renting
      mortgage: 0, // Only applicable when owning
      utilities: 200,
      food: 600,
      transportation: 300,
      insurance: 250,
      entertainment: 300,
      other: 350
    },
    stats: {
      health: 80,
      stress: 30,
      happiness: 65
    },
    finance: {
      netWorth: 50000,
      netWorthHistory: [
        { month: 'Jan 2009', value: 50000 }
      ],
      assetAllocation: {
        checking: 50000,
        investments: 0,
        emergencyFund: 0,
        retirement401k: 0
      },
      retirement401k: {
        contributionPercent: 0, // 0-20% of salary
        strategy: 'VOO', // VOO, VTI, or other index funds
        balance: 0,
        shares: 0 // Track 401k-specific shares separately
      }
    },
    markets: {
      positions: [
        { symbol: 'ACME', shares: 0, price: 100 },
        { symbol: 'TECH', shares: 0, price: 250 },
        { symbol: 'CRYPTO_ETF', shares: 0, price: 50 },
        { symbol: 'VOO', shares: 0, price: 100 }, // S&P 500 ETF
        { symbol: 'VTI', shares: 0, price: 80 },    // Total Stock Market ETF
        { symbol: 'VXUS', shares: 0, price: 60 }    // International Stock ETF
      ],
      priceHistory: {
        ACME: [
          { month: 'Jan 2009', value: 100 }
        ],
        TECH: [
          { month: 'Jan 2009', value: 250 }
        ],
        CRYPTO_ETF: [
          { month: 'Jan 2009', value: 50 }
        ],
        VOO: [
          { month: 'Jan 2009', value: 100 }
        ],
        VTI: [
          { month: 'Jan 2009', value: 80 }
        ],
        VXUS: [
          { month: 'Jan 2009', value: 60 }
        ]
      }
    }
  });

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
      
      // Add asset allocation categories (401k is already included in assetAllocation)
      for (const key in prev.finance.assetAllocation) {
        total += prev.finance.assetAllocation[key];
      }
      
      // Add market positions at current prices (excluding 401k holdings which are tracked separately)
      prev.markets.positions.forEach(position => {
        // Only count non-401k positions (401k shares are tracked but not double-counted)
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

  const update401kSettings = useCallback((contributionPercent, strategy) => {
    setGameState(prev => ({
      ...prev,
      finance: {
        ...prev.finance,
        retirement401k: {
          ...prev.finance.retirement401k,
          contributionPercent: Math.max(0, Math.min(20, contributionPercent)), // Clamp 0-20%
          strategy: strategy || prev.finance.retirement401k.strategy
        }
      }
    }));
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

  const advanceMonth = useCallback(() => {
    setGameState(prev => {
      // Create new date (next month)
      const newDate = new Date(prev.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);

      // Check if year changed to increment age
      const ageIncrement = newDate.getFullYear() > prev.currentDate.getFullYear() ? 1 : 0;

      // Calculate total income
      const totalIncome = Object.values(prev.income).reduce((sum, val) => sum + val, 0);

      // Calculate 401k contribution (pre-tax, deducted from salary)
      const salary = prev.income.salary;
      const contributionPercent = prev.finance.retirement401k.contributionPercent / 100;
      const monthly401kContribution = salary * contributionPercent;
      const netSalary = salary - monthly401kContribution; // Salary after 401k deduction

      // Calculate total expenses (use rent if renting, mortgage if owner)
      let totalExpenses = 0;
      for (const [key, value] of Object.entries(prev.expenses)) {
        if (key === 'rent' && prev.player.housingStatus === 'renting') {
          totalExpenses += value;
        } else if (key === 'mortgage' && prev.player.housingStatus === 'owner') {
          totalExpenses += value;
        } else if (key !== 'rent' && key !== 'mortgage') {
          totalExpenses += value;
        }
      }

      // Process checking account: income first (after 401k), then expenses
      let newChecking = prev.finance.assetAllocation.checking;

      // Add income to checking (salary after 401k + other income)
      newChecking += netSalary + (totalIncome - salary);

      // Subtract expenses from checking
      newChecking -= totalExpenses;

      // Apply overdraft fee if checking went negative
      const OVERDRAFT_FEE = 35;
      let overdraftFeeApplied = false;
      if (newChecking < 0 && prev.finance.assetAllocation.checking >= 0) {
        // Just went into overdraft this month
        newChecking -= OVERDRAFT_FEE;
        overdraftFeeApplied = true;
      } else if (newChecking < 0 && prev.finance.assetAllocation.checking < 0) {
        // Already in overdraft, apply fee again
        newChecking -= OVERDRAFT_FEE;
        overdraftFeeApplied = true;
      }

      // Apply 2% monthly interest to emergency fund
      const EMERGENCY_FUND_INTEREST_RATE = 0.02 / 12; // 2% annual = ~0.167% monthly
      const emergencyFundInterest = prev.finance.assetAllocation.emergencyFund * EMERGENCY_FUND_INTEREST_RATE;

      // Update stock prices with some random variation (-5% to +5%)
      let newPositions = prev.markets.positions.map(position => ({
        ...position,
        price: Math.max(1, position.price * (1 + (Math.random() * 0.1 - 0.05)))
      }));

      // Process 401k contribution - invest in selected strategy
      const strategy = prev.finance.retirement401k.strategy;
      let new401kShares = prev.finance.retirement401k.shares || 0;
      
      // If 401k has a strategy selected, invest the contribution in that fund
      if (monthly401kContribution > 0 && strategy) {
        const strategyPosition = newPositions.find(p => p.symbol === strategy);
        if (strategyPosition) {
          const sharesToAdd = monthly401kContribution / strategyPosition.price;
          new401kShares += sharesToAdd;
        }
      }

      // Update 401k balance based on current value of holdings
      let new401kBalance = 0;
      const strategyPosition = newPositions.find(p => p.symbol === strategy);
      if (strategyPosition && new401kShares > 0) {
        new401kBalance = new401kShares * strategyPosition.price;
      }

      const newAllocation = {
        ...prev.finance.assetAllocation,
        checking: newChecking,
        emergencyFund: prev.finance.assetAllocation.emergencyFund + emergencyFundInterest,
        retirement401k: new401kBalance
      };

      // Calculate new net worth
      let newNetWorth = 0;
      for (const key in newAllocation) {
        newNetWorth += newAllocation[key];
      }
      newPositions.forEach(position => {
        newNetWorth += position.shares * position.price;
      });

      // Add to history (keep last 12 months)
      const newHistory = [...prev.finance.netWorthHistory, {
        month: formatMonthYear(newDate),
        value: newNetWorth
      }];
      if (newHistory.length > 12) {
        newHistory.shift();
      }

      // Update price history for each stock
      const newPriceHistory = {};
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
          assetAllocation: newAllocation,
          retirement401k: {
            ...prev.finance.retirement401k,
            balance: new401kBalance,
            shares: new401kShares
          }
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
    formatCurrency,
    formatDate,
    recalculateNetWorth,
    updateStats,
    transferFunds,
    buyStock,
    sellStock,
    getStockPrice,
    advanceMonth,
    getTotalIncome,
    getTotalExpenses,
    update401kSettings,
    hasStarted,
    startGameWithChoiceB
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

