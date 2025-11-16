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

const MarketWatchCard = ({ onClick }) => {
  const { gameState } = useGame();

  // Safety check: ensure priceHistory exists and has data
  if (!gameState?.markets?.priceHistory || Object.keys(gameState.markets.priceHistory).length === 0) {
    return (
      <div className="card market-watch-card" onClick={onClick}>
        <h3>Market Watch</h3>
        <div className="market-chart-container">
          <p>No market data available</p>
        </div>
      </div>
    );
  }

  const datasets = [];
  const colors = ['#3b82f6', '#22c55e', '#ec4899'];
  let i = 0;

  for (const symbol in gameState.markets.priceHistory) {
    const history = gameState.markets.priceHistory[symbol];
    if (history && Array.isArray(history) && history.length > 0) {
      datasets.push({
        label: symbol,
        data: history.map(item => item.value),
        borderColor: colors[i % colors.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2
      });
      i++;
    }
  }

  // Use the first available symbol's history for labels, or fallback to ACME
  const firstSymbol = Object.keys(gameState.markets.priceHistory)[0] || 'ACME';
  const labelHistory = gameState.markets.priceHistory[firstSymbol];
  const labels = labelHistory && Array.isArray(labelHistory) 
    ? labelHistory.map(item => item.month)
    : [];

  const chartData = {
    labels: labels,
    datasets: datasets
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          label: function(context) {
            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#a8d8ea',
          font: {
            size: 10
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
    <div className="card market-watch-card" onClick={onClick}>
      <h3>Market Watch</h3>
      <div className="market-chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MarketWatchCard;

