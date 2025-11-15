import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const InvestingModal = ({ onClose }) => {
  const { gameState, formatCurrency, buyStock, sellStock, getStockPrice } = useGame();
  const [stockSymbol, setStockSymbol] = useState('ACME');
  const [shareAmount, setShareAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

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

    if (gameState.markets.cash < cost) {
      setMessage({ 
        text: `Insufficient cash. Need ${formatCurrency(cost)}, have ${formatCurrency(gameState.markets.cash)}.`, 
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

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>Investing Portfolio</h2>
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
              <span className="value-highlight">{formatCurrency(gameState.markets.cash)}</span>
            </div>
          </div>

          <div className="positions-table-container">
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

          <div className="trading-interface">
            <h3>Buy / Sell Stocks</h3>
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

