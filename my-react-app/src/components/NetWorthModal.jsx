import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const ASSET_LABELS = {
  realEstate: 'Real Estate',
  checking: 'Checking Account',
  investments: 'Investments',
  crypto: 'Crypto',
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

  const marketValue = gameState.markets.positions.reduce(
    (sum, pos) => sum + (pos.shares * pos.price),
    0
  );

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Net Worth Breakdown</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Your total net worth across all asset categories:</p>
          <div id="netWorthBreakdown">
            {Object.entries(gameState.finance.assetAllocation).map(([key, value]) => (
              <div key={key} className="balance-item">
                <span className="balance-label">{ASSET_LABELS[key]}:</span>
                <span className="balance-value">{formatCurrency(value)}</span>
              </div>
            ))}
            {marketValue > 0 && (
              <div className="balance-item">
                <span className="balance-label">Stock Portfolio:</span>
                <span className="balance-value">{formatCurrency(marketValue)}</span>
              </div>
            )}
            <div className="balance-item" style={{ borderTop: '2px solid rgba(74, 222, 128, 0.3)', marginTop: '8px', paddingTop: '8px' }}>
              <span className="balance-label" style={{ fontWeight: 700 }}>Total Net Worth:</span>
              <span className="balance-value" style={{ fontSize: '18px' }}>{formatCurrency(gameState.finance.netWorth)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthModal;

