import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ASSET_LABELS = {
  realEstate: 'Real Estate',
  checking: 'Checking Account',
  investments: 'Investments',
  emergencyFund: 'Emergency Fund',
  retirement401k: '401k Retirement'
};

const ASSET_COLORS = {
  checking: '#22c55e',
  investments: '#f59e0b',
  emergencyFund: '#8b5cf6',
  realEstate: '#3b82f6',
  retirement401k: '#ec4899'
};

const INCOME_LABELS = {
  salary: 'Salary',
  investments: 'Investment Income',
  other: 'Other Income'
};

const EXPENSE_LABELS = {
  rent: 'Rent',
  mortgage: 'Mortgage',
  utilities: 'Utilities',
  food: 'Food & Groceries',
  transportation: 'Transportation',
  insurance: 'Insurance',
  entertainment: 'Entertainment',
  other: 'Other Expenses'
};

const AssetAllocationModal = ({ onClose }) => {
  const { gameState, formatCurrency, transferFunds, getTotalIncome, getTotalExpenses, update401kSettings } = useGame();

  // Get available accounts (exclude real estate if renting)
  const availableAccounts = Object.keys(gameState.finance.assetAllocation);
  const getAssetLabels = () => {
    const labels = {};
    availableAccounts.forEach(key => {
      labels[key] = ASSET_LABELS[key];
    });
    return labels;
  };

  const [fromAccount, setFromAccount] = useState(availableAccounts[0] || 'checking');
  const [toAccount, setToAccount] = useState(availableAccounts[1] || 'investments');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [retirement401kContribution, setRetirement401kContribution] = useState(gameState.finance.retirement401k.contributionPercent);
  const [retirement401kStrategy, setRetirement401kStrategy] = useState(gameState.finance.retirement401k.strategy);

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

  const handle401kUpdate = () => {
    update401kSettings(retirement401kContribution, retirement401kStrategy);
    setMessage({ text: '401k settings updated successfully.', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const indexFunds = [
    { symbol: 'VOO', name: 'VOO - S&P 500 ETF' },
    { symbol: 'VTI', name: 'VTI - Total Stock Market ETF' },
    { symbol: 'VXUS', name: 'VXUS - International Stock ETF' }
  ];

  const monthly401kContribution = gameState.income.salary * (retirement401kContribution / 100);

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netCashFlow = totalIncome - totalExpenses;
  const assetLabels = getAssetLabels();

  // Calculate total portfolio value (all stock positions)
  const portfolioValue = gameState.markets.positions.reduce((total, position) => {
    return total + (position.shares * position.price);
  }, 0);

  // Prepare pie chart data (only positive values)
  const assetAllocation = gameState.finance.assetAllocation;
  const chartLabels = [];
  const chartData = [];
  const chartColors = [];

  // Only include positive values in the pie chart
  Object.entries(assetAllocation).forEach(([key, value]) => {
    let displayValue = value;

    // For investments, add portfolio value to the cash
    if (key === 'investments') {
      displayValue = value + portfolioValue;
    }

    if (displayValue > 0) {
      chartLabels.push(assetLabels[key]);
      chartData.push(displayValue);
      chartColors.push(ASSET_COLORS[key]);
    }
  });

  const pieChartData = {
    labels: chartLabels,
    datasets: [{
      data: chartData,
      backgroundColor: chartColors,
      borderColor: '#2a2a2a',
      borderWidth: 2
    }]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#a8d8ea',
          padding: 15,
          font: {
            size: 12
          }
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
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content modal-fullscreen">
        <div className="modal-header">
          <h2>Financial Dashboard</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body financial-dashboard">
          {/* Top Section: Cash Flow Summary */}
          <div className="financial-summary">
            <div className="summary-row">
              <span className="summary-label">Monthly Income:</span>
              <span className="summary-value positive">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Monthly Expenses:</span>
              <span className="summary-value negative">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">Net Monthly Cash Flow:</span>
              <span className={`summary-value ${netCashFlow >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>

          {/* Middle Section: 3 Column Layout */}
          <div className="dashboard-grid">
            {/* Income Breakdown */}
            <div className="breakdown-section">
              <h3>Income Breakdown</h3>
              <div className="breakdown-list">
                {Object.entries(gameState.income).map(([key, value]) => (
                  <div key={key} className="breakdown-item">
                    <span className="breakdown-label">{INCOME_LABELS[key]}:</span>
                    <span className="breakdown-value positive">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Allocation Pie Chart */}
            <div className="breakdown-section pie-chart-section">
              <h3>Asset Allocation</h3>
              <div className="pie-chart-container">
                <Doughnut data={pieChartData} options={pieChartOptions} />
              </div>
            </div>

            {/* Expenses Breakdown */}
            <div className="breakdown-section">
              <h3>Expenses Breakdown</h3>
              <div className="breakdown-list">
                {Object.entries(gameState.expenses).map(([key, value]) => {
                  if (key === 'rent' && gameState.player.housingStatus !== 'renting') return null;
                  if (key === 'mortgage' && gameState.player.housingStatus !== 'owner') return null;
                  return (
                    <div key={key} className="breakdown-item">
                      <span className="breakdown-label">{EXPENSE_LABELS[key]}:</span>
                      <span className="breakdown-value negative">{formatCurrency(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Section: Balances and Transfer */}
          <div className="bottom-section">
            {/* Account Balances */}
            <div className="current-balances">
              <h3>Account Balances</h3>
              <div className="balance-list">
                {Object.entries(gameState.finance.assetAllocation).map(([key, value]) => {
                  // For investments, show cash + portfolio value
                  const displayValue = key === 'investments' ? value + portfolioValue : value;

                  return (
                    <div key={key} className="balance-item-horizontal">
                      <span className="balance-label">{assetLabels[key]}:</span>
                      <span className={`balance-value ${displayValue < 0 ? 'negative' : 'positive'}`}>
                        {formatCurrency(displayValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 401k Retirement Plan Section */}
            <div className="retirement-401k-section">
              <h3>401k Retirement Plan</h3>
              <div className="retirement-401k-info">
                <div className="retirement-401k-balance">
                  <span className="balance-label">Current Balance:</span>
                  <span className="balance-value positive">
                    {formatCurrency(gameState.finance.assetAllocation.retirement401k || 0)}
                  </span>
                </div>
                <div className="retirement-401k-contribution">
                  <span className="balance-label">Monthly Contribution:</span>
                  <span className="balance-value positive">
                    {formatCurrency(monthly401kContribution)}
                  </span>
                </div>
                <div className="retirement-401k-strategy">
                  <span className="balance-label">Current Strategy:</span>
                  <span className="balance-value">
                    {gameState.finance.retirement401k.strategy}
                  </span>
                </div>
              </div>
              <div className="retirement-401k-config">
                <div className="form-group">
                  <label htmlFor="retirement401kContribution">Contribution Percentage (0-20%):</label>
                  <input
                    type="number"
                    id="retirement401kContribution"
                    className="form-control"
                    min="0"
                    max="20"
                    step="0.5"
                    value={retirement401kContribution}
                    onChange={(e) => setRetirement401kContribution(parseFloat(e.target.value) || 0)}
                  />
                  <span className="form-hint">
                    {retirement401kContribution > 0 && `${formatCurrency(monthly401kContribution)} per month from salary`}
                  </span>
                </div>
                <div className="form-group">
                  <label htmlFor="retirement401kStrategy">Investment Strategy:</label>
                  <select
                    id="retirement401kStrategy"
                    className="form-control"
                    value={retirement401kStrategy}
                    onChange={(e) => setRetirement401kStrategy(e.target.value)}
                  >
                    {indexFunds.map(fund => (
                      <option key={fund.symbol} value={fund.symbol}>
                        {fund.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-success" onClick={handle401kUpdate}>Update 401k Settings</button>
              </div>
            </div>

            {/* Transfer Section */}
            <div className="asset-transfer-form">
              <h3>Transfer Funds</h3>
              <div className="transfer-inputs-compact">
                <div className="form-group">
                  <label htmlFor="fromAccount">From:</label>
                  <select
                    id="fromAccount"
                    className="form-control"
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                  >
                    {availableAccounts.map(key => (
                      <option key={key} value={key}>{assetLabels[key]}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="toAccount">To:</label>
                  <select
                    id="toAccount"
                    className="form-control"
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                  >
                    {availableAccounts.map(key => (
                      <option key={key} value={key}>{assetLabels[key]}</option>
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

                <button className="btn-success" onClick={handleTransfer}>Transfer</button>
              </div>

              {message.text && (
                <div className={`transfer-message ${message.type}`}>{message.text}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationModal;

