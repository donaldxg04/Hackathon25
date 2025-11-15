import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const ASSET_LABELS = {
  realEstate: 'Real Estate',
  checking: 'Checking Account',
  investments: 'Investments',
  crypto: 'Crypto',
  other: 'Other Assets'
};

const AssetAllocationModal = ({ onClose }) => {
  const { gameState, formatCurrency, transferFunds } = useGame();
  const [fromAccount, setFromAccount] = useState('realEstate');
  const [toAccount, setToAccount] = useState('checking');
  const [transferAmount, setTransferAmount] = useState('');
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

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    
    if (!amount || amount <= 0) {
      setMessage({ text: 'Amount must be greater than zero.', type: 'error' });
      return;
    }

    if (gameState.finance.assetAllocation[fromAccount] < amount) {
      setMessage({ text: 'Insufficient funds in source account.', type: 'error' });
      return;
    }

    const result = transferFunds(fromAccount, toAccount, amount);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });

    if (result.success) {
      setTransferAmount('');
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Asset Management</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Transfer funds between your asset accounts:</p>

          <div className="asset-transfer-form">
            <div className="form-group">
              <label htmlFor="fromAccount">From Account:</label>
              <select
                id="fromAccount"
                className="form-control"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              >
                {Object.keys(ASSET_LABELS).map(key => (
                  <option key={key} value={key}>{ASSET_LABELS[key]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="toAccount">To Account:</label>
              <select
                id="toAccount"
                className="form-control"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              >
                {Object.keys(ASSET_LABELS).map(key => (
                  <option key={key} value={key}>{ASSET_LABELS[key]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transferAmount">Amount:</label>
              <input
                type="number"
                id="transferAmount"
                className="form-control"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={handleTransfer}>Transfer</button>
          </div>

          {message.text && (
            <div className={`transfer-message ${message.type}`}>{message.text}</div>
          )}

          <div className="current-balances">
            <h3>Current Balances:</h3>
            <div id="assetBalances">
              {Object.entries(gameState.finance.assetAllocation).map(([key, value]) => (
                <div key={key} className="balance-item">
                  <span className="balance-label">{ASSET_LABELS[key]}:</span>
                  <span className="balance-value">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationModal;

