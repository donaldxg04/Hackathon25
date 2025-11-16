import { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InvestingModal = ({ onClose }) => {
  const { gameState, formatCurrency, buyStock, sellStock, getStockPrice } = useGame();
  const [stockSymbol, setStockSymbol] = useState('');
  const [shareAmount, setShareAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [technicalInsights, setTechnicalInsights] = useState({});
  const [selectedStockInsights, setSelectedStockInsights] = useState(null);
  const [showInfoChart, setShowInfoChart] = useState(false);
  const [showInfoTechnical, setShowInfoTechnical] = useState(false);
  const [showInfoTrading, setShowInfoTrading] = useState(false);

  // Get current game date month
  const getCurrentMonth = () => {
    if (!gameState?.currentDate) return null;
    const date = gameState.currentDate;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Parse CSV date string (handles both "1/1/2008" and "2008-01-02" formats)
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
    
    // Set time to start of day for accurate comparison
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
        if (!item.date) return false;
        const itemDate = parseCSVDate(item.date);
        if (!itemDate || isNaN(itemDate.getTime())) return false;
        
        // Set time to start of day for comparison
        const itemDateStart = new Date(itemDate);
        itemDateStart.setHours(0, 0, 0, 0);
        
        return itemDateStart >= oneYearAgo && itemDateStart <= currentDateStart;
      });
    });
    
    return filtered;
  };

  // Calculate technical indicators
  const calculateTechnicalIndicators = (prices) => {
    if (!prices || prices.length < 2) return null;

    const priceValues = prices.map(p => p.value);
    const currentPrice = priceValues[priceValues.length - 1];
    const firstPrice = priceValues[0];

    // Simple Moving Average (SMA) - 50 period
    const sma50 = prices.length >= 50
      ? priceValues.slice(-50).reduce((a, b) => a + b, 0) / 50
      : priceValues.reduce((a, b) => a + b, 0) / priceValues.length;

    // Simple Moving Average (SMA) - 200 period
    const sma200 = prices.length >= 200
      ? priceValues.slice(-200).reduce((a, b) => a + b, 0) / 200
      : sma50;

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

    // Calculate volatility (standard deviation of returns)
    const returns = [];
    for (let i = 1; i < priceValues.length; i++) {
      returns.push((priceValues[i] - priceValues[i - 1]) / priceValues[i - 1]);
    }
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * 100 * Math.sqrt(12); // Annualized volatility

    // Price change
    const priceChange = currentPrice - firstPrice;
    const percentChange = ((priceChange / firstPrice) * 100);

    // Support and Resistance (simplified - using recent min/max)
    const recentPrices = priceValues.slice(-30);
    const support = Math.min(...recentPrices);
    const resistance = Math.max(...recentPrices);

    // Trend analysis
    const shortTermTrend = currentPrice > sma50 ? 'Bullish' : 'Bearish';
    const longTermTrend = currentPrice > sma200 ? 'Bullish' : 'Bearish';
    const overallTrend = shortTermTrend === 'Bullish' && longTermTrend === 'Bullish' 
      ? 'Strong Bullish' 
      : shortTermTrend === 'Bearish' && longTermTrend === 'Bearish'
      ? 'Strong Bearish'
      : 'Mixed';

    // Momentum (rate of change)
    const momentum = priceValues.length >= 10
      ? ((currentPrice - priceValues[priceValues.length - 10]) / priceValues[priceValues.length - 10]) * 100
      : percentChange;

    return {
      currentPrice,
      firstPrice,
      priceChange,
      percentChange: percentChange.toFixed(2),
      sma50: sma50.toFixed(2),
      sma200: sma200.toFixed(2),
      rsi: rsi.toFixed(2),
      volatility: volatility.toFixed(2),
      support: support.toFixed(2),
      resistance: resistance.toFixed(2),
      shortTermTrend,
      longTermTrend,
      overallTrend,
      momentum: momentum.toFixed(2),
      maxPrice: Math.max(...priceValues).toFixed(2),
      minPrice: Math.min(...priceValues).toFixed(2)
    };
  };

  // Load technical insights from CSV data, filtered by game date
  useEffect(() => {
    if (window.stockDataFromCSV && gameState?.currentDate) {
      // Filter data to only include entries up to one year before current game date
      const filteredData = filterDataByGameDate(window.stockDataFromCSV, gameState.currentDate);
      
      const insights = {};
      Object.keys(filteredData).forEach(symbol => {
        const prices = filteredData[symbol];
        if (prices && prices.length > 0) {
          const indicators = calculateTechnicalIndicators(prices);
          if (indicators) {
            insights[symbol] = indicators;
          }
        }
      });
      setTechnicalInsights(insights);
    }
  }, [gameState?.currentDate]);

  // Update selected stock insights when symbol changes
  useEffect(() => {
    if (stockSymbol && technicalInsights[stockSymbol]) {
      setSelectedStockInsights(technicalInsights[stockSymbol]);
    } else if (gameState.markets.positions.length > 0 && !stockSymbol) {
      const firstSymbol = gameState.markets.positions[0].symbol;
      setStockSymbol(firstSymbol);
      if (technicalInsights[firstSymbol]) {
        setSelectedStockInsights(technicalInsights[firstSymbol]);
      }
    }
  }, [stockSymbol, technicalInsights, gameState.markets.positions]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const portfolioValue = gameState.markets.positions.reduce(
    (sum, pos) => sum + (pos.shares * pos.price),
    0
  );

  const handleBuy = () => {
    const shares = parseInt(shareAmount);
    const price = getStockPrice(stockSymbol);
    const cost = price * shares;

    if (!shares || shares <= 0) {
      setMessage({ text: 'Number of shares must be greater than zero.', type: 'error' });
      return;
    }

    const availableCash = gameState.finance.assetAllocation.investments;
    if (availableCash < cost) {
      setMessage({
        text: `Insufficient cash. Need ${formatCurrency(cost)}, have ${formatCurrency(availableCash)}.`,
        type: 'error'
      });
      return;
    }

    const result = buyStock(stockSymbol, shares);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });

    if (result.success) {
      setShareAmount('');
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleSell = () => {
    const shares = parseInt(shareAmount);
    const position = gameState.markets.positions.find(p => p.symbol === stockSymbol);

    if (!shares || shares <= 0) {
      setMessage({ text: 'Number of shares must be greater than zero.', type: 'error' });
      return;
    }

    if (!position || position.shares < shares) {
      setMessage({ 
        text: `Insufficient shares. You only have ${position ? position.shares : 0} shares of ${stockSymbol}.`, 
        type: 'error' 
      });
      return;
    }

    const result = sellStock(stockSymbol, shares);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });

    if (result.success) {
      setShareAmount('');
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getRSIColor = (rsi) => {
    if (rsi > 70) return '#ef4444'; // Overbought (red)
    if (rsi < 30) return '#22c55e'; // Oversold (green)
    return '#a8d8ea'; // Neutral
  };

  const getTrendColor = (trend) => {
    if (trend.includes('Bullish')) return '#22c55e';
    if (trend.includes('Bearish')) return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content modal-fullscreen">
        <div className="modal-header">
          <h2>Investing Portfolio & Technical Analysis</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="portfolio-summary">
            <h3>Your Portfolio</h3>
            <div className="portfolio-value">
              <span>Total Portfolio Value:</span>
              <span className="value-highlight">{formatCurrency(portfolioValue)}</span>
            </div>
            <div className="cash-balance">
              <span>Available Cash:</span>
              <span className="value-highlight">{formatCurrency(gameState.finance.assetAllocation.investments)}</span>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#a8d8ea' }}>
              Current Date: {getCurrentMonth() || 'N/A'}
              {gameState?.currentDate && (
                <div style={{ marginTop: '5px', fontSize: '11px', opacity: 0.7 }}>
                  Insights based on data from {(() => {
                    const oneYearAgo = new Date(gameState.currentDate);
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${monthNames[oneYearAgo.getMonth()]} ${oneYearAgo.getFullYear()}`;
                  })()} to {getCurrentMonth()}
                </div>
              )}
            </div>
          </div>

          {/* Stock Price Chart */}
          {(() => {
            // Chart preparation logic
            const formatDateToString = (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            };

            const formatDateForDisplay = (dateInput) => {
              try {
                let date;
                if (typeof dateInput === 'string') {
                  date = parseCSVDate(dateInput);
                  if (!date || isNaN(date.getTime())) {
                    return dateInput;
                  }
                } else {
                  date = new Date(dateInput);
                }
                
                if (isNaN(date.getTime())) return dateInput;
                
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
              } catch (error) {
                return dateInput;
              }
            };

            const formatDateToMonthYear = (dateInput) => {
              try {
                let date;
                if (typeof dateInput === 'string') {
                  date = parseCSVDate(dateInput);
                  if (!date || isNaN(date.getTime())) {
                    return dateInput;
                  }
                } else {
                  date = new Date(dateInput);
                }
                
                if (isNaN(date.getTime())) return dateInput;
                
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
              } catch (error) {
                return dateInput;
              }
            };

            const generateDailyTimeline = (startDate, endDate) => {
              const dates = [];
              const current = new Date(startDate);
              current.setHours(0, 0, 0, 0);
              const end = new Date(endDate);
              end.setHours(0, 0, 0, 0);
              
              while (current <= end) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
              }
              
              return dates;
            };

            const forwardFillPrices = (symbolData, timelineDates) => {
              const priceMap = new Map();
              const result = [];
              let lastPrice = null;
              
              symbolData.forEach(item => {
                if (item.dateString && item.value !== null && item.value !== undefined) {
                  const dateObj = parseCSVDate(item.dateString);
                  if (dateObj && !isNaN(dateObj.getTime())) {
                    const normalizedDateStr = formatDateToString(dateObj);
                    priceMap.set(normalizedDateStr, item.value);
                  }
                }
              });
              
              timelineDates.forEach(date => {
                const dateStr = formatDateToString(date);
                const availablePrice = priceMap.get(dateStr);
                
                if (availablePrice !== undefined) {
                  lastPrice = availablePrice;
                }
                
                result.push({
                  date: date,
                  dateString: dateStr,
                  value: lastPrice,
                  displayLabel: formatDateForDisplay(dateStr)
                });
              });
              
              return result;
            };

            const prepareDailyStockData = (stockData, currentGameDate) => {
              if (!currentGameDate || !stockData) return { timeline: [], data: {} };
              
              const gameDate = currentGameDate instanceof Date 
                ? currentGameDate 
                : new Date(currentGameDate);
              
              if (isNaN(gameDate.getTime())) return { timeline: [], data: {} };
              
              const oneYearAgo = new Date(gameDate);
              oneYearAgo.setFullYear(gameDate.getFullYear() - 1);
              oneYearAgo.setHours(0, 0, 0, 0);
              const currentDateStart = new Date(gameDate);
              currentDateStart.setHours(0, 0, 0, 0);
              
              const timelineDates = generateDailyTimeline(oneYearAgo, currentDateStart);
              const preparedData = {};
              
              Object.keys(stockData).forEach(symbol => {
                const symbolData = stockData[symbol];
                if (!Array.isArray(symbolData)) {
                  preparedData[symbol] = [];
                  return;
                }
                
                const availableData = symbolData.filter(item => {
                  if (!item.dateString) return false;
                  const itemDate = parseCSVDate(item.dateString);
                  if (!itemDate || isNaN(itemDate.getTime())) return false;
                  
                  const itemDateStart = new Date(itemDate);
                  itemDateStart.setHours(0, 0, 0, 0);
                  
                  return itemDateStart >= oneYearAgo && itemDateStart <= currentDateStart;
                });
                
                preparedData[symbol] = forwardFillPrices(availableData, timelineDates);
              });
              
              return {
                timeline: timelineDates,
                data: preparedData
              };
            };

            // Generate monthly labels dynamically based on visible data range
            const generateMonthlyLabels = (startDate, endDate) => {
              const labels = [];
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              const start = new Date(startDate);
              start.setDate(1); // Start from first day of month
              const end = new Date(endDate);
              
              const current = new Date(start);
              while (current <= end) {
                labels.push({
                  date: new Date(current),
                  label: `${monthNames[current.getMonth()]} ${current.getFullYear()}`
                });
                current.setMonth(current.getMonth() + 1);
              }
              
              return labels;
            };

            // Calculate the visible date range based on current game date
            const oneYearAgo = gameState?.currentDate 
              ? (() => {
                  const date = new Date(gameState.currentDate);
                  date.setFullYear(date.getFullYear() - 1);
                  date.setDate(1); // First day of month
                  date.setHours(0, 0, 0, 0);
                  return date;
                })()
              : null;
            
            const currentDate = gameState?.currentDate 
              ? (() => {
                  const date = new Date(gameState.currentDate);
                  date.setHours(0, 0, 0, 0);
                  return date;
                })()
              : new Date();
            
            // Only generate labels for the visible range (one year ago to current date)
            const allMonthlyLabels = oneYearAgo ? generateMonthlyLabels(oneYearAgo, currentDate) : [];
            
            // Find indices in timeline that correspond to each month start
            // Only keep labels that have corresponding data points in the timeline
            const getMonthStartIndices = (timelineDates, monthlyLabels) => {
              const indices = [];
              const labelMap = new Map(); // Map from index to label
              let firstLabelIndex = null; // Track the first label's index
              
              // Process all monthly labels and find their corresponding indices
              for (let labelIndex = 0; labelIndex < monthlyLabels.length; labelIndex++) {
                const labelInfo = monthlyLabels[labelIndex];
                const labelDate = new Date(labelInfo.date);
                labelDate.setHours(0, 0, 0, 0);
                
                // Find the closest date in timeline to this month start
                let closestIndex = -1;
                let closestDiff = Infinity;
                
                for (let i = 0; i < timelineDates.length; i++) {
                  const date = timelineDates[i];
                  const diff = Math.abs(date.getTime() - labelDate.getTime());
                  
                  // Prefer exact matches or dates within the same month
                  if (date.getFullYear() === labelDate.getFullYear() && 
                      date.getMonth() === labelDate.getMonth()) {
                    if (diff < closestDiff) {
                      closestDiff = diff;
                      closestIndex = i;
                    }
                  }
                }
                
                // If no exact match in same month, find closest overall (within reasonable range)
                if (closestIndex === -1) {
                  for (let i = 0; i < timelineDates.length; i++) {
                    const date = timelineDates[i];
                    const diff = Math.abs(date.getTime() - labelDate.getTime());
                    // Accept dates within 15 days of the month start
                    if (diff < closestDiff && diff < 15 * 24 * 60 * 60 * 1000) {
                      closestDiff = diff;
                      closestIndex = i;
                    }
                  }
                }
                
                if (closestIndex !== -1) {
                  // Only add if this index isn't already used (avoid duplicates)
                  if (!labelMap.has(closestIndex)) {
                    indices.push(closestIndex);
                    labelMap.set(closestIndex, labelInfo.label);
                    // Track the first label's index
                    if (firstLabelIndex === null) {
                      firstLabelIndex = closestIndex;
                    }
                  }
                }
              }
              
              return { indices: indices.sort((a, b) => a - b), labelMap, firstLabelIndex };
            };

            const rawStockData = window.stockDataFromCSV || {};
            const prepared = gameState?.currentDate 
              ? prepareDailyStockData(rawStockData, gameState.currentDate)
              : { timeline: [], data: {} };
            
            const { timeline: timelineDates, data: preparedStockData } = prepared;
            const symbols = Object.keys(preparedStockData);
            
            if (symbols.length === 0 || timelineDates.length === 0) {
              return null;
            }

            const { indices: monthStartIndices, labelMap, firstLabelIndex } = getMonthStartIndices(
              timelineDates, 
              allMonthlyLabels
            );
            
            // Use daily labels for data points, but we'll show monthly labels on x-axis
            const labels = timelineDates.map(date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            });
            
            const colors = ['#3b82f6', '#22c55e', '#ec4899', '#f59e0b', '#8b5cf6', '#ef4444'];
            const datasets = symbols.map((symbol, index) => {
              const symbolData = preparedStockData[symbol] || [];
              const data = symbolData.map(item => item.value);
              
              return {
                label: symbol,
                data: data,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                borderWidth: 2.5,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 5,
                fill: false,
                spanGaps: false
              };
            }).filter(Boolean);

            const chartData = {
              labels: labels,
              datasets: datasets
            };

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
              },
              animation: {
                duration: 0
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#a8d8ea',
                    font: {
                      size: 11
                    },
                    boxWidth: 12,
                    padding: 8
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(42, 42, 42, 0.95)',
                  titleColor: '#4ade80',
                  bodyColor: '#fff',
                  borderColor: '#4ade80',
                  borderWidth: 1,
                  padding: 12,
                  callbacks: {
                    title: function(context) {
                      const index = context[0].dataIndex;
                      const date = timelineDates[index];
                      if (date) {
                        return formatDateForDisplay(formatDateToString(date));
                      }
                      return '';
                    },
                    label: function(context) {
                      const value = context.parsed.y;
                      if (value === null || value === undefined) {
                        return context.dataset.label + ': No data';
                      }
                      return context.dataset.label + ': $' + value.toFixed(2);
                    }
                  }
                },
                title: {
                  display: true,
                  text: (() => {
                    const currentDate = gameState?.currentDate;
                    if (currentDate) {
                      const oneYearAgo = new Date(currentDate);
                      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                      return `Stock Price Trends (${formatDateToMonthYear(oneYearAgo)} - ${formatDateToMonthYear(currentDate)})`;
                    }
                    return 'Stock Price Trends';
                  })(),
                  color: '#a8d8ea',
                  font: {
                    size: 14
                  }
                }
              },
              scales: {
                x: {
                  type: 'category',
                  grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                  },
                  ticks: {
                    color: function(context) {
                      // Make first label invisible using opacity
                      if (context.index === firstLabelIndex) {
                        return 'rgba(168, 216, 234, 0)'; // Fully transparent
                      }
                      return '#a8d8ea';
                    },
                    font: {
                      size: 10
                    },
                    maxRotation: 45,
                    minRotation: 45,
                    maxTicksLimit: 12,
                    autoSkip: false,
                    callback: function(value, index) {
                      // Show monthly labels at the month start indices
                      // labelMap is in closure scope
                      if (labelMap && labelMap.has(index)) {
                        return labelMap.get(index);
                      }
                      return '';
                    }
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                  },
                  ticks: {
                    color: '#a8d8ea',
                    font: {
                      size: 10
                    },
                    callback: function(value) {
                      return '$' + value.toFixed(0);
                    }
                  }
                }
              }
            };

            return (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <h3 style={{ color: '#a8d8ea', margin: 0, fontSize: '14px' }}>Stock Price Chart</h3>
                  <button 
                    className="info-button"
                    onClick={() => setShowInfoChart(!showInfoChart)}
                    title="Learn about stock charts"
                    style={{
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                  >
                    i
                  </button>
                </div>
                
                {showInfoChart && (
                  <div style={{
                    marginBottom: '15px',
                    padding: '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: '6px'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', lineHeight: '1.6', color: '#a8d8ea' }}>
                      Stock price charts show historical price movements over time. They help you identify trends, patterns, 
                      and price levels that can inform your investment decisions. Look for upward trends (bullish) or downward 
                      trends (bearish) to understand market sentiment.
                    </p>
                    <a 
                      href="https://www.troweprice.com/personal-investing/resources/insights/market-volatility-explained-five-charts-for-better-insight.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#4ade80',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      Learn more at T. Rowe Price →
                    </a>
                  </div>
                )}
                
                <div style={{ 
                  height: '500px', 
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Line 
                    data={chartData} 
                    options={chartOptions}
                    updateMode="none"
                    redraw={false}
                  />
                </div>
              </div>
            );
          })()}

          {/* Technical Insights Section */}
          {selectedStockInsights && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(74, 222, 128, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <h3 style={{ color: '#4ade80', margin: 0 }}>Technical Analysis: {stockSymbol}</h3>
                <button 
                  className="info-button"
                  onClick={() => setShowInfoTechnical(!showInfoTechnical)}
                  title="Learn about technical analysis"
                  style={{
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                >
                  i
                </button>
              </div>
              
              {showInfoTechnical && (
                <div style={{
                  marginBottom: '15px',
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderLeft: '3px solid #3b82f6',
                  borderRadius: '6px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', lineHeight: '1.6', color: '#a8d8ea' }}>
                    Technical analysis uses statistical indicators like RSI (Relative Strength Index), moving averages, 
                    and momentum to evaluate securities. RSI above 70 suggests overbought conditions, while below 30 suggests 
                    oversold. SMA (Simple Moving Average) helps identify trends and potential support/resistance levels.
                  </p>
                  <a 
                    href="https://www.investopedia.com/articles/active-trading/102914/technical-analysis-strategies-beginners.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4ade80',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Learn more at Investopedia →
                  </a>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {/* Price Information */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>Current Price</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4ade80', marginTop: '5px' }}>
                    ${selectedStockInsights.currentPrice.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '5px', color: selectedStockInsights.percentChange >= 0 ? '#22c55e' : '#ef4444' }}>
                    {selectedStockInsights.percentChange >= 0 ? '+' : ''}{selectedStockInsights.percentChange}%
                  </div>
                </div>

                {/* Moving Averages */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>SMA 50</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a8d8ea', marginTop: '5px' }}>
                    ${selectedStockInsights.sma50}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7, marginTop: '10px' }}>SMA 200</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a8d8ea' }}>
                    ${selectedStockInsights.sma200}
                  </div>
                </div>

                {/* RSI */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>RSI (14)</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: getRSIColor(parseFloat(selectedStockInsights.rsi)),
                    marginTop: '5px'
                  }}>
                    {selectedStockInsights.rsi}
                  </div>
                  <div style={{ fontSize: '10px', marginTop: '5px', color: '#a8d8ea' }}>
                    {parseFloat(selectedStockInsights.rsi) > 70 ? 'Overbought' : 
                     parseFloat(selectedStockInsights.rsi) < 30 ? 'Oversold' : 'Neutral'}
                  </div>
                </div>

                {/* Trend */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>Trend</div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: getTrendColor(selectedStockInsights.overallTrend),
                    marginTop: '5px'
                  }}>
                    {selectedStockInsights.overallTrend}
                  </div>
                  <div style={{ fontSize: '10px', marginTop: '5px', color: '#a8d8ea' }}>
                    ST: {selectedStockInsights.shortTermTrend} | LT: {selectedStockInsights.longTermTrend}
                  </div>
                </div>

                {/* Volatility */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>Volatility (Annual)</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', marginTop: '5px' }}>
                    {selectedStockInsights.volatility}%
                  </div>
                </div>

                {/* Support/Resistance */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>Support / Resistance</div>
                  <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '5px' }}>
                    Support: ${selectedStockInsights.support}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>
                    Resistance: ${selectedStockInsights.resistance}
                  </div>
                </div>

                {/* Momentum */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>Momentum (10M)</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: parseFloat(selectedStockInsights.momentum) >= 0 ? '#22c55e' : '#ef4444',
                    marginTop: '5px'
                  }}>
                    {selectedStockInsights.momentum >= 0 ? '+' : ''}{selectedStockInsights.momentum}%
                  </div>
                </div>

                {/* Price Range */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a8d8ea', opacity: 0.7 }}>52-Week Range</div>
                  <div style={{ fontSize: '12px', color: '#a8d8ea', marginTop: '5px' }}>
                    High: ${selectedStockInsights.maxPrice}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a8d8ea', marginTop: '5px' }}>
                    Low: ${selectedStockInsights.minPrice}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Stocks Technical Summary */}
          {Object.keys(technicalInsights).length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#a8d8ea', marginBottom: '15px', fontSize: '14px' }}>Market Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                {Object.keys(technicalInsights).map(symbol => {
                  const insight = technicalInsights[symbol];
                  return (
                    <div 
                      key={symbol} 
                      style={{ 
                        padding: '10px', 
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: stockSymbol === symbol ? '2px solid #4ade80' : '1px solid transparent'
                      }}
                      onClick={() => setStockSymbol(symbol)}
                    >
                      <div style={{ fontWeight: 'bold', color: '#a8d8ea', marginBottom: '5px' }}>{symbol}</div>
                      <div style={{ fontSize: '14px', color: '#4ade80' }}>
                        ${insight.currentPrice.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '10px', color: insight.percentChange >= 0 ? '#22c55e' : '#ef4444', marginTop: '3px' }}>
                        {insight.percentChange >= 0 ? '+' : ''}{insight.percentChange}%
                      </div>
                      <div style={{ fontSize: '9px', color: getTrendColor(insight.overallTrend), marginTop: '5px' }}>
                        {insight.overallTrend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="positions-table-container" style={{ marginTop: '20px' }}>
            <h3>Current Positions</h3>
            <table className="positions-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {gameState.markets.positions.map((position, idx) => {
                  const value = position.shares * position.price;
                  return (
                    <tr key={idx}>
                      <td>{position.symbol}</td>
                      <td>{position.shares}</td>
                      <td>{formatCurrency(position.price)}</td>
                      <td>{formatCurrency(value)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="trading-interface" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Buy / Sell Stocks</h3>
              <button 
                className="info-button"
                onClick={() => setShowInfoTrading(!showInfoTrading)}
                title="Learn about buying and selling stocks"
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                i
              </button>
            </div>
            
            {showInfoTrading && (
              <div style={{
                marginBottom: '15px',
                padding: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderLeft: '3px solid #3b82f6',
                borderRadius: '6px'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', lineHeight: '1.6', color: '#a8d8ea' }}>
                  When you buy stocks, you're purchasing ownership shares in a company. The stock price fluctuates based on 
                  supply and demand. Buy low and sell high to make a profit. Consider diversifying your portfolio across 
                  different sectors to manage risk. Always research before investing and never invest more than you can afford to lose.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a 
                    href="https://www.troweprice.com/personal-investing/resources/insights/smart-steps-when-saving-for-short-and-long-term-financial-goals.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4ade80',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    📊 Smart steps when saving for short- and long-term financial goals →
                  </a>
                  <a 
                    href="https://www.troweprice.com/personal-investing/resources/insights/is-it-smart-to-keep-money-invested-in-equities-during-market-volatility.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4ade80',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    📈 Is it smart to keep money invested during market volatility? →
                  </a>
                </div>
              </div>
            )}
            
            <div className="trading-form">
              <div className="form-group">
                <label htmlFor="stockSymbol">Stock Symbol:</label>
                <select
                  id="stockSymbol"
                  className="form-control"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                >
                  {gameState.markets.positions.map(pos => (
                    <option key={pos.symbol} value={pos.symbol}>
                      {pos.symbol} - {formatCurrency(pos.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shareAmount">Number of Shares:</label>
                <input
                  type="number"
                  id="shareAmount"
                  className="form-control"
                  placeholder="Enter shares"
                  min="1"
                  step="1"
                  value={shareAmount}
                  onChange={(e) => setShareAmount(e.target.value)}
                />
              </div>

              <div className="trading-buttons">
                <button className="btn-success" onClick={handleBuy}>Buy</button>
                <button className="btn-danger" onClick={handleSell}>Sell</button>
              </div>
            </div>

            {message.text && (
              <div className={`trading-message ${message.type}`}>{message.text}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestingModal;