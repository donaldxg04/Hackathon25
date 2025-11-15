import { useGame } from '../context/GameContext';

const ASSET_LABELS = {
  realEstate: 'Real Estate',
  checking: 'Checking Account',
  investments: 'Investments',
  crypto: 'Crypto',
  other: 'Other Assets'
};

const ASSET_COLORS = {
  realEstate: '#3b82f6',
  checking: '#22c55e',
  investments: '#f59e0b',
  crypto: '#ec4899',
  other: '#8b5cf6'
};

const AssetAllocationCard = ({ onClick }) => {
  const { gameState } = useGame();
  const allocation = gameState.finance.assetAllocation;
  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);

  const segments = [];
  for (const key in allocation) {
    if (allocation[key] > 0) {
      segments.push({
        label: ASSET_LABELS[key],
        value: allocation[key],
        percentage: (allocation[key] / total) * 100,
        color: ASSET_COLORS[key],
        key
      });
    }
  }

  let currentAngle = -90;
  const paths = segments.map(segment => {
    const percentage = segment.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M 100 100`,
      `L ${x1} ${y1}`,
      `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');

    currentAngle = endAngle;

    return { ...segment, pathData };
  });

  return (
    <div className="card asset-allocation-card" onClick={onClick}>
      <h3>Asset Allocation</h3>
      <div className="circular-chart-container">
        <svg className="circular-chart" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#2a2a2a" strokeWidth="2"/>
          <g>
            {paths.map((segment, idx) => (
              <path
                key={segment.key}
                d={segment.pathData}
                fill={segment.color}
                stroke="#2a2a2a"
                strokeWidth="2"
              />
            ))}
          </g>
        </svg>
        <div className="chart-legend">
          {segments.map(segment => (
            <div key={segment.key} className="legend-item">
              <div className="legend-color" style={{ background: segment.color }}></div>
              <span>{segment.label}: {segment.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationCard;

