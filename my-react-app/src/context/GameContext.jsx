import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// Helper function to parse CSV date string
const parseCSVDate = (dateString) => {
  try {
    if (typeof dateString === 'string') {
      // Handle ISO format (YYYY-MM-DD)
      if (dateString.includes('-') && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        return new Date(dateString);
      }
      // Handle M/D/YYYY format
      if (dateString.includes('/')) {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
      }
    }
    return new Date(dateString);
  } catch (error) {
    return null;
  }
};

// Helper function to get price for a specific date (or previous available date)
const getPriceForDate = (symbolData, targetDate) => {
  if (!symbolData || !Array.isArray(symbolData) || symbolData.length === 0) return null;
  if (!targetDate) return null;
  
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
  if (isNaN(target.getTime())) return null;
  
  // Normalize target date to start of day for comparison
  const targetStart = new Date(target);
  targetStart.setHours(0, 0, 0, 0);
  
  // Find the price for the exact date, or the most recent previous date
  let bestMatch = null;
  let bestDate = null;
  
  for (const item of symbolData) {
    if (!item.dateString) continue;
    const itemDate = parseCSVDate(item.dateString);
    if (!itemDate || isNaN(itemDate.getTime())) continue;
    
    const itemDateStart = new Date(itemDate);
    itemDateStart.setHours(0, 0, 0, 0);
    
    // If exact match, return immediately
    if (itemDateStart.getTime() === targetStart.getTime()) {
      return item.value;
    }
    
    // Track the most recent date that's before or equal to target
    if (itemDateStart <= targetStart) {
      if (!bestDate || itemDateStart > bestDate) {
        bestDate = itemDateStart;
        bestMatch = item.value;
      }
    }
  }
  
  return bestMatch;
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
    salary: 4000,        // Large firm DS role, monthly
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
    netWorth: 5000,         // Starts with small savings
    netWorthHistory: [
      { month: "Jan 2009", value: 0 }
    ],
    assetAllocation: {
      checking: 0,
      investments: 0,
      emergencyFund: 0,
      retirement401k: 0,
      savings: 0,           // General savings account
      realEstate: 0         // Home equity
    },
    retirement401k: {
      contributionPercent: 0,
      strategy: 'IVV',  // S&P 500 ETF (matches CSV data)
      balance: 0,
      shares: 0
    }
  },
  markets: {
    positions: [
      { symbol: "VNQ", shares: 0, price: 30.05999947 },      // Real Estate REIT - from CSV 1/1/2009
      { symbol: "IVV", shares: 0, price: 82.97000122 },      // S&P 500 ETF - from CSV 1/1/2009
      { symbol: "VTI", shares: 0, price: 41.13999939 },      // Total Market ETF - from CSV 1/1/2009
      { symbol: "NVDA", shares: 100, price: 0.198750004 },   // NVIDIA - Stock grant from CSV 1/1/2009
      { symbol: "LMT", shares: 0, price: 82.04000092 },      // Lockheed Martin - from CSV 1/1/2009
      { symbol: "PFE", shares: 0, price: 13.83301735 }       // Pfizer - from CSV 1/1/2009
    ],
    priceHistory: {
      VNQ: [
        { month: "Jan 2009", value: 30.05999947 }
      ],
      IVV: [
        { month: "Jan 2009", value: 82.97000122 }
      ],
      VTI: [
        { month: "Jan 2009", value: 41.13999939 }
      ],
      NVDA: [
        { month: "Jan 2009", value: 0.198750004 }
      ],
      LMT: [
        { month: "Jan 2009", value: 82.04000092 }
      ],
      PFE: [
        { month: "Jan 2009", value: 13.83301735 }
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

  // Load CSV stock data
  const [csvStockData, setCsvStockData] = useState(null);

  useEffect(() => {
    async function loadStockData() {
      try {
        const response = await fetch('/stock_watch_data.csv');
        if (!response.ok) {
          console.warn('CSV not available');
          return;
        }
        
        const csvText = await response.text();
        if (!csvText || csvText.length === 0) return;
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length >= 4) {
            data.push({
              symbol: values[1],
              date: values[2],
              price: parseFloat(values[3]) || 0
            });
          }
        }
        
        // Group by symbol
        const grouped = {};
        data.forEach(item => {
          if (!grouped[item.symbol]) {
            grouped[item.symbol] = [];
          }
          const dateObj = parseCSVDate(item.date);
          grouped[item.symbol].push({
            dateString: item.date,
            date: dateObj,
            value: item.price
          });
        });
        
        // Sort each symbol's data by date
        Object.keys(grouped).forEach(symbol => {
          grouped[symbol].sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return a.date - b.date;
          });
        });
        
        setCsvStockData(grouped);
        window.stockDataFromCSV = grouped;
        console.log('CSV stock data loaded in GameContext');
      } catch (error) {
        console.warn('CSV load failed:', error);
      }
    }

    loadStockData();
  }, []);

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
    if (!date) return 'Invalid Date';
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  };

  const formatMonthYear = (date) => {
    if (!date) return 'Invalid Date';
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  const advanceDay = useCallback(() => {
    setGameState(prev => {
      // Safety check: ensure currentDate exists and is valid
      if (!prev?.currentDate) {
        console.warn('advanceDay: currentDate is invalid');
        return prev; // Don't advance if date is invalid
      }
      
      // Create new date (next day) - ALWAYS advance by 1 day
      const currentDate = prev.currentDate instanceof Date 
        ? prev.currentDate 
        : new Date(prev.currentDate);
      
      if (isNaN(currentDate.getTime())) {
        console.warn('advanceDay: currentDate cannot be parsed');
        return prev; // Don't advance if date is invalid
      }
      
      // Create a NEW Date object and advance by 1 day - this happens EVERY time advanceDay is called
      // Use getTime() and create new Date to ensure React detects the change
      const currentTime = currentDate.getTime();
      const newDate = new Date(currentTime + 24 * 60 * 60 * 1000); // Add 1 day in milliseconds
      
      // Ensure we have a valid new date
      if (isNaN(newDate.getTime())) {
        console.warn('advanceDay: newDate is invalid');
        return prev; // Don't advance if new date is invalid
      }
      
      // Log date advancement for debugging (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`📅 Day advanced: ${formatDate(currentDate)} → ${formatDate(newDate)}`);
      }

      const dayOfMonth = newDate.getDate();
      const isFirstOfMonth = dayOfMonth === 1;
      const isFourteenthOfMonth = dayOfMonth === 14;

      // Check if year changed to increment age
      const ageIncrement = newDate.getFullYear() > prev.currentDate.getFullYear() ? 1 : 0;

      let newAllocation = { ...prev.finance.assetAllocation };
      let newPositions = [...prev.markets.positions];
      let newPriceHistory = { ...prev.markets.priceHistory };
      let new401kShares = prev.finance.retirement401k.shares || 0;
      let new401kBalance = prev.finance.retirement401k.balance || 0;

      // Calculate 401k contribution (pre-tax, deducted from salary)
      const salary = prev.income.salary;
      const contributionPercent = prev.finance.retirement401k.contributionPercent / 100;
      const monthly401kContribution = salary * contributionPercent;

      // Salary payments: 1/2 of monthly salary on 1st and 14th (after 401k deduction)
      if (isFirstOfMonth || isFourteenthOfMonth) {
        const halfNetSalary = (salary - monthly401kContribution) / 2;
        newAllocation.checking += halfNetSalary;
        
        // Add 401k contribution for this pay period (half month)
        const half401kContribution = monthly401kContribution / 2;
        const strategy = prev.finance.retirement401k.strategy;
        if (half401kContribution > 0 && strategy) {
          const strategyPosition = newPositions.find(p => p.symbol === strategy);
          if (strategyPosition) {
            const sharesToAdd = half401kContribution / strategyPosition.price;
            new401kShares += sharesToAdd;
          }
        }
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
      }

      // Update stock prices EVERY DAY using CSV data (or keep current price if CSV not available)
      const stockData = csvStockData || window.stockDataFromCSV;
      if (stockData) {
        newPositions = prev.markets.positions.map(position => {
          const symbolData = stockData[position.symbol];
          if (symbolData) {
            // Get price for newDate, or use most recent previous date if missing
            const newPrice = getPriceForDate(symbolData, newDate);
            if (newPrice !== null && newPrice > 0) {
              // Log price updates for debugging
              if (process.env.NODE_ENV === 'development' && position.price !== newPrice) {
                console.log(`💰 ${position.symbol}: $${position.price.toFixed(2)} → $${newPrice.toFixed(2)}`);
              }
              return {
                ...position,
                price: newPrice
              };
            }
          }
          // If no CSV data for this symbol/date, keep current price (reusing previous)
          return position;
        });
      } else {
        // If CSV not loaded yet, keep current prices
        console.warn('Stock data not loaded yet, keeping current prices');
        newPositions = prev.markets.positions;
      }

      // Update price history for each stock on 1st of month only
      if (isFirstOfMonth) {
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
        // Keep same price history if not 1st of month
        newPriceHistory = prev.markets.priceHistory;
      }

      // Update 401k balance based on current value of holdings (every day)
      const strategy = prev.finance.retirement401k.strategy;
      const strategyPosition = newPositions.find(p => p.symbol === strategy);
      if (strategyPosition && new401kShares > 0) {
        new401kBalance = new401kShares * strategyPosition.price;
      } else {
        new401kBalance = 0;
      }
      newAllocation.retirement401k = new401kBalance;
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
  }, [csvStockData]);

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

  const updateExpense = useCallback((expenseKey, amount) => {
    setGameState(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [expenseKey]: Math.max(0, amount || 0)
      }
    }));
  }, []);

  const addExpense = useCallback((expenseKey, amount) => {
    setGameState(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [expenseKey]: Math.max(0, amount || 0)
      }
    }));
  }, []);

  const removeExpense = useCallback((expenseKey) => {
    setGameState(prev => {
      const newExpenses = { ...prev.expenses };
      // Don't allow removing rent/mortgage as they're tied to housing status
      if (expenseKey !== 'rent' && expenseKey !== 'mortgage') {
        delete newExpenses[expenseKey];
      }
      return {
        ...prev,
        expenses: newExpenses
      };
    });
  }, []);

  // Initialize game with Choice B (Big Tech Data Science role) and player name
  const startGameWithChoiceB = useCallback((playerName) => {
    // Ensure Date object is properly created (not just copied)
    const initialState = {
      ...choiceBState,
      currentDate: new Date(choiceBState.currentDate),
      player: {
        ...choiceBState.player,
        name: playerName || "John Doe"
      }
    };
    setGameState(initialState);
    setHasStarted(true);
  }, []);

  // Apply state changes from storyline events
  const applyEventStateChanges = useCallback((stateChanges) => {
    if (!stateChanges) return;

    setGameState(prev => {
      let newState = { ...prev };
      const newAllocation = { ...prev.finance.assetAllocation };

      // Initialize savings and realEstate if they don't exist
      if (newAllocation.savings === undefined) {
        newAllocation.savings = 0;
      }
      if (newAllocation.realEstate === undefined) {
        newAllocation.realEstate = 0;
      }

      // Apply financial account changes
      if (stateChanges.checking !== undefined) {
        newAllocation.checking = (newAllocation.checking || 0) + stateChanges.checking;
      }
      if (stateChanges.emergencyFund !== undefined) {
        newAllocation.emergencyFund = (newAllocation.emergencyFund || 0) + stateChanges.emergencyFund;
      }
      if (stateChanges.savings !== undefined) {
        newAllocation.savings = (newAllocation.savings || 0) + stateChanges.savings;
      }
      if (stateChanges.investments !== undefined) {
        newAllocation.investments = (newAllocation.investments || 0) + stateChanges.investments;
      }
      if (stateChanges.realEstate !== undefined) {
        newAllocation.realEstate = (newAllocation.realEstate || 0) + stateChanges.realEstate;
      }

      // Apply percentage change to investments
      if (stateChanges.investmentsPercent !== undefined) {
        const currentInvestments = newAllocation.investments || 0;
        const percentChange = stateChanges.investmentsPercent / 100;
        newAllocation.investments = currentInvestments * (1 + percentChange);
      }

      // Update asset allocation
      newState.finance = {
        ...newState.finance,
        assetAllocation: newAllocation
      };

      // Apply salary changes
      if (stateChanges.salaryPercent !== undefined) {
        const currentSalary = newState.income.salary;
        const percentIncrease = stateChanges.salaryPercent / 100;
        newState.income = {
          ...newState.income,
          salary: currentSalary * (1 + percentIncrease)
        };
      }
      if (stateChanges.salaryFlat !== undefined) {
        newState.income = {
          ...newState.income,
          salary: newState.income.salary + stateChanges.salaryFlat
        };
      }

      // Apply rent changes
      if (stateChanges.rent !== undefined) {
        newState.expenses = {
          ...newState.expenses,
          rent: newState.expenses.rent + stateChanges.rent
        };
      }

      // Apply stat changes (health, stress, happiness)
      const newStats = { ...newState.stats };
      if (stateChanges.health !== undefined) {
        newStats.health = clampStat(newStats.health + stateChanges.health);
      }
      if (stateChanges.stress !== undefined) {
        newStats.stress = clampStat(newStats.stress + stateChanges.stress);
      }
      if (stateChanges.happiness !== undefined) {
        newStats.happiness = clampStat(newStats.happiness + stateChanges.happiness);
      }
      newState.stats = newStats;

      return newState;
    });

    // Recalculate net worth after all changes
    recalculateNetWorth();
  }, [recalculateNetWorth]);

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
    update401kSettings,
    updateExpense,
    addExpense,
    removeExpense,
    hasStarted,
    startGameWithChoiceB,
    applyEventStateChanges
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

