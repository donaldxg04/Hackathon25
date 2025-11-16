import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const MarketWatchCard = ({ onClick }) => {
  const { gameState } = useGame();
  const [csvStockData, setCsvStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [technicalInsights, setTechnicalInsights] = useState({});
  
  // Get current date from gameState - this updates every day
  const currentDate = gameState?.currentDate;
  // Create a date key for dependency tracking (updates every day)
  const dateKey = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate.getTime() 
    : null;

  // Parse CSV date string (handles both "1/1/2008" and "2008-01-02" formats)
  function parseCSVDate(dateString) {
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
  }

  // Parse CSV text into array of objects
  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      if (values.length >= 4) {
        data.push({
          id: parseInt(values[0]) || 0,
          symbol: values[1],
          date: values[2],
          price: parseFloat(values[3]) || 0
        });
      }
    }
    
    return data;
  }

  // Group stock data by symbol and format for chart (daily basis)
  function groupStockDataBySymbol(stockData) {
    const grouped = {};
    
    stockData.forEach(item => {
      if (!grouped[item.symbol]) {
        grouped[item.symbol] = [];
      }
      const dateObj = parseCSVDate(item.date);
      grouped[item.symbol].push({
        dateString: item.date, // Keep original date string
        date: dateObj, // Parsed date object for sorting/comparison
        value: item.price,
        id: item.id
      });
    });

    // Sort each symbol's data by date
    Object.keys(grouped).forEach(symbol => {
      grouped[symbol].sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return a.date - b.date;
      });
    });

    return grouped;
  }

  // Calculate technical indicators (same as InvestingModal)
  const calculateTechnicalIndicators = (prices) => {
    if (!prices || prices.length < 2) return null;

    const priceValues = prices.map(p => p.value || p);
    const currentPrice = priceValues[priceValues.length - 1];
    const firstPrice = priceValues[0];

    // Simple Moving Average (SMA) - 50 period
    const sma50 = prices.length >= 50
      ? priceValues.slice(-50).reduce((a, b) => a + b, 0) / 50
      : priceValues.reduce((a, b) => a + b, 0) / priceValues.length;

    // Calculate RSI (Relative Strength Index)
    const calculateRSI = (prices, period = 14) => {
      if (prices.length < period + 1) return 50;
      
      let gains = 0;
      let losses = 0;
      
      for (let i = prices.length - period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    };

    const rsi = calculateRSI(priceValues);

    // Price change
    const priceChange = currentPrice - firstPrice;
    const percentChange = ((priceChange / firstPrice) * 100);

    // Trend analysis
    const shortTermTrend = currentPrice > sma50 ? 'Bullish' : 'Bearish';
    const overallTrend = shortTermTrend === 'Bullish' ? 'Bullish' : 'Bearish';

    return {
      currentPrice,
      percentChange: percentChange.toFixed(2),
      overallTrend
    };
  };

  // Get the price for a specific date, or the previous available date if not found
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

  // Filter stock data to include entries from one year before current game date up to current date
  const filterDataByGameDate = (stockData, currentGameDate) => {
    if (!currentGameDate || !stockData) return stockData;
    
    const gameDate = currentGameDate instanceof Date 
      ? currentGameDate 
      : new Date(currentGameDate);
    
    if (isNaN(gameDate.getTime())) return stockData;
    
    // Calculate one year before current game date
    const oneYearAgo = new Date(gameDate);
    oneYearAgo.setFullYear(gameDate.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);
    const currentDateStart = new Date(gameDate);
    currentDateStart.setHours(0, 0, 0, 0);
    
    const filtered = {};
    
    Object.keys(stockData).forEach(symbol => {
      const symbolData = stockData[symbol];
      if (!Array.isArray(symbolData)) {
        filtered[symbol] = symbolData;
        return;
      }
      
      // Filter entries where oneYearAgo <= date <= currentDate
      filtered[symbol] = symbolData.filter(item => {
        if (!item.dateString) return false;
        const itemDate = parseCSVDate(item.dateString);
        if (!itemDate || isNaN(itemDate.getTime())) return false;
        
        const itemDateStart = new Date(itemDate);
        itemDateStart.setHours(0, 0, 0, 0);
        
        return itemDateStart >= oneYearAgo && itemDateStart <= currentDateStart;
      });
    });
    
    return filtered;
  };

  // Try to load CSV data (non-blocking)
  useEffect(() => {
    async function loadStockData() {
      try {
        setLoading(true);
        const response = await fetch('/stock_watch_data.csv');
        if (!response.ok) {
          console.warn('CSV not available, using gameState data');
          return;
        }
        
        const csvText = await response.text();
        if (!csvText || csvText.length === 0) return;
        
        const data = parseCSV(csvText);
        if (data.length === 0) return;
        
        const grouped = groupStockDataBySymbol(data);
        setCsvStockData(grouped);
        window.stockDataFromCSV = grouped;
        console.log('CSV data loaded successfully');
      } catch (error) {
        console.warn('CSV load failed, using gameState data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStockData();
  }, []);

  // Load technical insights and current prices – run EVERY DAY when currentDate changes
  useEffect(() => {
    if (!currentDate) return;
    
    // Log when MarketWatchCard updates for a new date
    if (process.env.NODE_ENV === 'development') {
      console.log('MarketWatchCard: Updating stock prices for date:', currentDate.toDateString());
    }
    
    const stockData = window.stockDataFromCSV || csvStockData;
    const availableStocks = gameState?.markets?.positions || [];
    
    if (availableStocks.length === 0 && !stockData) return;
    
    const filteredData = stockData ? filterDataByGameDate(stockData, currentDate) : {};
    const insights = {};
    
    const symbolsToShow = availableStocks.length > 0
      ? availableStocks
      : Object.keys(stockData || {}).map(symbol => ({ symbol }));
    
    symbolsToShow.forEach(position => {
      const symbol = position.symbol;
      const symbolData = stockData?.[symbol];
      
      // Get price for current date, or use most recent previous date if missing
      const currentPriceFromCSV = symbolData
        ? getPriceForDate(symbolData, currentDate)
        : null;
      
      const fallbackPrice = position.price ?? 0;
      const currentPrice = currentPriceFromCSV ?? fallbackPrice;
      
      const prices = symbolData ? filteredData[symbol] : null;
      
      if (prices && prices.length > 1) {
        const indicators = calculateTechnicalIndicators(prices);
        if (indicators) {
          insights[symbol] = {
            ...indicators,
            currentPrice
          };
          return;
        }
      }
      
      insights[symbol] = {
        currentPrice,
        percentChange: '0.00',
        overallTrend: 'Neutral'
      };
    });
    
    setTechnicalInsights(insights);
  }, [dateKey, csvStockData, gameState?.markets?.positions]);

  const getTrendColor = (trend) => {
    if (trend.includes('Bullish')) return '#22c55e';
    if (trend.includes('Bearish')) return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="card market-watch-card" onClick={onClick} style={{ 
      width: '100%', 
      maxWidth: '100%', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      minWidth: 0
    }}>
      <h3>Market Watch</h3>
      {loading && (
        <div style={{ padding: '10px', fontSize: '12px', color: '#a8d8ea', opacity: 0.7 }}>
          Loading market data...
        </div>
      )}
      {Object.keys(technicalInsights).length > 0 ? (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#a8d8ea', marginBottom: '12px', fontSize: '14px' }}>Market Overview</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
            {Object.keys(technicalInsights).map(symbol => {
              const insight = technicalInsights[symbol];
              return (
                <div 
                  key={symbol} 
                  style={{ 
                    padding: '8px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#a8d8ea', marginBottom: '4px', fontSize: '13px' }}>{symbol}</div>
                  <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600' }}>
                    ${insight.currentPrice.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '9px', color: insight.percentChange >= 0 ? '#22c55e' : '#ef4444', marginTop: '3px' }}>
                    {insight.percentChange >= 0 ? '+' : ''}{insight.percentChange}%
                  </div>
                  <div style={{ fontSize: '8px', color: getTrendColor(insight.overallTrend), marginTop: '4px' }}>
                    {insight.overallTrend}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '10px', fontSize: '10px', color: '#a8d8ea', opacity: 0.7, textAlign: 'center' }}>
            Click to view detailed chart and analysis
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#a8d8ea', opacity: 0.7 }}>
          {loading ? 'Loading market data...' : 'No market data available'}
        </div>
      )}
    </div>
  );
};

export default MarketWatchCard;

