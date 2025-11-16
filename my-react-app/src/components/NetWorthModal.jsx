import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const ASSET_LABELS = {
  checking: 'Checking Account',
  emergencyFund: 'Emergency Fund',
  investments: 'Investment Account (Cash)',
  realEstate: 'Real Estate Equity',
  crypto: 'Cryptocurrency',
  other: 'Other Assets'
};

const NetWorthModal = ({ onClose }) => {
  const { gameState, formatCurrency } = useGame();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Calculate stock portfolio value (excluding 401k holdings)
  const stockPortfolioValue = gameState.markets.positions.reduce(
    (sum, pos) => {
      // Exclude 401k strategy holdings from regular portfolio
      if (pos.symbol === gameState.finance.retirement401k.strategy) {
        return sum;
      }
      return sum + (pos.shares * pos.price);
    },
    0
  );

  // Get individual stock positions for detailed breakdown
  const stockPositions = gameState.markets.positions
    .filter(pos => pos.symbol !== gameState.finance.retirement401k.strategy && pos.shares > 0)
    .map(pos => ({
      symbol: pos.symbol,
      shares: pos.shares,
      price: pos.price,
      value: pos.shares * pos.price
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Net Worth Breakdown</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div id="netWorthBreakdown">
            <div className="breakdown-section">
              <h3>Cash & Savings</h3>
              {Object.entries(gameState.finance.assetAllocation)
                .filter(([key]) => ['checking', 'emergencyFund', 'investments'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="balance-item">
                    <span className="balance-label">{ASSET_LABELS[key] || key}:</span>
                    <span className="balance-value">{formatCurrency(value)}</span>
                  </div>
                ))}
            </div>

            {stockPortfolioValue > 0 && (
              <div className="breakdown-section">
                <h3>Stock Portfolio</h3>
                <div className="balance-item">
                  <span className="balance-label">Total Portfolio Value:</span>
                  <span className="balance-value">{formatCurrency(stockPortfolioValue)}</span>
                </div>
                {stockPositions.length > 0 && (
                  <div className="stock-positions">
                    {stockPositions.map((pos) => (
                      <div key={pos.symbol} className="balance-item sub-item">
                        <span className="balance-label">{pos.symbol} ({pos.shares} shares @ {formatCurrency(pos.price)}):</span>
                        <span className="balance-value">{formatCurrency(pos.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {gameState.finance.assetAllocation.realEstate > 0 && (
              <div className="breakdown-section">
                <h3>Real Estate</h3>
                <div className="balance-item">
                  <span className="balance-label">{ASSET_LABELS.realEstate}:</span>
                  <span className="balance-value">{formatCurrency(gameState.finance.assetAllocation.realEstate)}</span>
                </div>
              </div>
            )}

            <div className="balance-item total-item" style={{ borderTop: '2px solid rgba(74, 222, 128, 0.3)', marginTop: '16px', paddingTop: '12px' }}>
              <span className="balance-label" style={{ fontWeight: 700, fontSize: '16px' }}>Total Net Worth:</span>
              <span className="balance-value" style={{ fontSize: '20px', fontWeight: 700 }}>{formatCurrency(gameState.finance.netWorth)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthModal;

