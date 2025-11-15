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

  const datasets = [];
  const colors = ['#3b82f6', '#22c55e', '#ec4899'];
  let i = 0;

  for (const symbol in gameState.markets.priceHistory) {
    datasets.push({
      label: symbol,
      data: gameState.markets.priceHistory[symbol].map(item => item.value),
      borderColor: colors[i % colors.length],
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 2
    });
    i++;
  }

  const chartData = {
    labels: gameState.markets.priceHistory['ACME'].map(item => item.month),
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

