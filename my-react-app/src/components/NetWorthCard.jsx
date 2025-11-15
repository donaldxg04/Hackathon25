import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const NetWorthCard = ({ onClick }) => {
  const { gameState, formatCurrency } = useGame();

  const chartData = {
    labels: gameState.finance.netWorthHistory.map(item => item.month),
    datasets: [{
      label: 'Net Worth',
      data: gameState.finance.netWorthHistory.map(item => item.value),
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#4ade80',
      pointBorderColor: '#fff',
      pointBorderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(42, 42, 42, 0.95)',
        titleColor: '#4ade80',
        bodyColor: '#fff',
        borderColor: '#4ade80',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
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
            size: 11
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
            size: 11
          },
          callback: function(value) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  return (
    <div className="card net-worth-card" onClick={onClick}>
      <div className="net-worth-amount">
        Net Worth: {formatCurrency(gameState.finance.netWorth)}
      </div>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default NetWorthCard;

