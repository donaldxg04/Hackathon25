import { useGame } from '../context/GameContext';

const LedgerCard = ({ onClick }) => {
  const { gameState } = useGame();
  
  const ledgerEntries = gameState?.ledger || [];
  const recentEntries = ledgerEntries.slice(-3).reverse(); // Show last 3, most recent first
  
  return (
    <div className="card ledger-card" onClick={onClick}>
      <div className="card-header-with-icon">
        <h3>Game Ledger</h3>
      </div>
      <div className="ledger-card-content">
        {ledgerEntries.length === 0 ? (
          <p className="ledger-empty">No entries yet. Your decisions and events will appear here.</p>
        ) : (
          <div className="ledger-preview">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="ledger-preview-item">
                <div className="ledger-preview-type">
                  <span className="ledger-type-label">
                    {entry.type === 'decision' ? 'DECISION' : entry.type === 'randomEvent' ? 'EVENT' : 'ENTRY'}
                  </span>
                </div>
                <div className="ledger-preview-text">
                  <div className="ledger-preview-title">{entry.title}</div>
                  <div className="ledger-preview-date">{entry.date}</div>
                </div>
              </div>
            ))}
            {ledgerEntries.length > 3 && (
              <div className="ledger-preview-more">
                +{ledgerEntries.length - 3} more entries
              </div>
            )}
          </div>
        )}
        <p className="ledger-card-hint">Click to view full history</p>
      </div>
    </div>
  );
};

export default LedgerCard;

