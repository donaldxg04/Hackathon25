import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    currentDate: "May 2nd, 2011",
    player: {
      name: "John Doe",
      age: 25,
      occupation: "Software Developer",
      location: "San Francisco, CA"
    },
    stats: {
      health: 80,
      stress: 30,
      happiness: 65
    },
    finance: {
      netWorth: 1568960.98,
      netWorthHistory: [
        { month: 'Jun', value: 950000 },
        { month: 'Jul', value: 1020000 },
        { month: 'Aug', value: 1150000 },
        { month: 'Sep', value: 1100000 },
        { month: 'Oct', value: 1250000 },
        { month: 'Nov', value: 1320000 },
        { month: 'Dec', value: 1380000 },
        { month: 'Jan', value: 1420000 },
        { month: 'Feb', value: 1490000 },
        { month: 'Mar', value: 1530000 },
        { month: 'Apr', value: 1545000 },
        { month: 'May', value: 1568960.98 }
      ],
      assetAllocation: {
        realEstate: 500000,
        checking: 25000,
        investments: 750000,
        crypto: 10000,
        other: 50000
      }
    },
    markets: {
      cash: 25000,
      positions: [
        { symbol: 'ACME', shares: 50, price: 120 },
        { symbol: 'TECH', shares: 10, price: 300 },
        { symbol: 'CRYPTO_ETF', shares: 5, price: 800 }
      ],
      priceHistory: {
        ACME: [
          { month: 'Jun', value: 95 },
          { month: 'Jul', value: 98 },
          { month: 'Aug', value: 102 },
          { month: 'Sep', value: 105 },
          { month: 'Oct', value: 110 },
          { month: 'Nov', value: 112 },
          { month: 'Dec', value: 115 },
          { month: 'Jan', value: 118 },
          { month: 'Feb', value: 116 },
          { month: 'Mar', value: 119 },
          { month: 'Apr', value: 121 },
          { month: 'May', value: 120 }
        ],
        TECH: [
          { month: 'Jun', value: 250 },
          { month: 'Jul', value: 260 },
          { month: 'Aug', value: 270 },
          { month: 'Sep', value: 265 },
          { month: 'Oct', value: 275 },
          { month: 'Nov', value: 280 },
          { month: 'Dec', value: 285 },
          { month: 'Jan', value: 290 },
          { month: 'Feb', value: 295 },
          { month: 'Mar', value: 292 },
          { month: 'Apr', value: 298 },
          { month: 'May', value: 300 }
        ],
        CRYPTO_ETF: [
          { month: 'Jun', value: 600 },
          { month: 'Jul', value: 650 },
          { month: 'Aug', value: 700 },
          { month: 'Sep', value: 680 },
          { month: 'Oct', value: 720 },
          { month: 'Nov', value: 750 },
          { month: 'Dec', value: 780 },
          { month: 'Jan', value: 790 },
          { month: 'Feb', value: 775 },
          { month: 'Mar', value: 785 },
          { month: 'Apr', value: 795 },
          { month: 'May', value: 800 }
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
      
      const newMarkets = { ...prev.markets };
      newMarkets.cash = newAllocation.checking;

      return {
        ...prev,
        finance: {
          ...prev.finance,
          assetAllocation: newAllocation
        },
        markets: newMarkets
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

      if (prev.markets.cash < cost) {
        return prev; // Will be handled by caller
      }

      const newMarkets = { ...prev.markets };
      newMarkets.cash -= cost;
      
      const newPositions = prev.markets.positions.map(p => 
        p.symbol === symbol ? { ...p, shares: p.shares + shares } : p
      );
      newMarkets.positions = newPositions;

      const newAllocation = { ...prev.finance.assetAllocation };
      newAllocation.checking = newMarkets.cash;

      return {
        ...prev,
        markets: newMarkets,
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

      const newMarkets = { ...prev.markets };
      newMarkets.cash += proceeds;
      
      const newPositions = prev.markets.positions.map(p => 
        p.symbol === symbol ? { ...p, shares: p.shares - shares } : p
      ).filter(p => p.shares > 0);
      newMarkets.positions = newPositions;

      const newAllocation = { ...prev.finance.assetAllocation };
      newAllocation.checking = newMarkets.cash;

      return {
        ...prev,
        markets: newMarkets,
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

  const value = {
    gameState,
    formatCurrency,
    recalculateNetWorth,
    updateStats,
    transferFunds,
    buyStock,
    sellStock,
    getStockPrice
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

