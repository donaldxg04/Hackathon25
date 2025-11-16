import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const LedgerModal = ({ onClose }) => {
  const { gameState, formatDate } = useGame();
  const [filter, setFilter] = useState('all'); // 'all', 'decision', 'randomEvent'
  
  const ledgerEntries = gameState?.ledger || [];
  const filteredEntries = filter === 'all' 
    ? ledgerEntries 
    : ledgerEntries.filter(entry => entry.type === filter);
  
  const sortedEntries = [...filteredEntries].reverse(); // Most recent first

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getEffectDisplay = (effects) => {
    if (!effects) return null;
    const effectItems = [];
    if (effects.health !== undefined && effects.health !== 0) {
      effectItems.push(
        <span key="health" className={`effect-badge ${effects.health > 0 ? 'positive' : 'negative'}`}>
          Health: {effects.health > 0 ? '+' : ''}{effects.health}
        </span>
      );
    }
    if (effects.stress !== undefined && effects.stress !== 0) {
      effectItems.push(
        <span key="stress" className={`effect-badge ${effects.stress > 0 ? 'negative' : 'positive'}`}>
          Stress: {effects.stress > 0 ? '+' : ''}{effects.stress}
        </span>
      );
    }
    if (effects.happiness !== undefined && effects.happiness !== 0) {
      effectItems.push(
        <span key="happiness" className={`effect-badge ${effects.happiness > 0 ? 'positive' : 'negative'}`}>
          Happiness: {effects.happiness > 0 ? '+' : ''}{effects.happiness}
        </span>
      );
    }
    return effectItems.length > 0 ? <div className="ledger-effects">{effectItems}</div> : null;
  };

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content ledger-modal">
        <div className="modal-header">
          <h2>Game Ledger</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Filter Tabs */}
          <div className="ledger-filters">
            <button 
              className={`ledger-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({ledgerEntries.length})
            </button>
            <button 
              className={`ledger-filter-btn ${filter === 'decision' ? 'active' : ''}`}
              onClick={() => setFilter('decision')}
            >
              Decisions ({ledgerEntries.filter(e => e.type === 'decision').length})
            </button>
            <button 
              className={`ledger-filter-btn ${filter === 'randomEvent' ? 'active' : ''}`}
              onClick={() => setFilter('randomEvent')}
            >
              Random Events ({ledgerEntries.filter(e => e.type === 'randomEvent').length})
            </button>
          </div>

          {/* Ledger Entries */}
          <div className="ledger-entries">
            {sortedEntries.length === 0 ? (
              <div className="ledger-empty-state">
                <p>No entries found for this filter.</p>
              </div>
            ) : (
              sortedEntries.map((entry) => (
                <div key={entry.id} className={`ledger-entry ${entry.type}`}>
                  <div className="ledger-entry-header">
                    <div className="ledger-entry-icon">
                      {entry.type === 'decision' ? '🎯' : entry.type === 'randomEvent' ? '🎲' : '📝'}
                    </div>
                    <div className="ledger-entry-title-section">
                      <h3 className="ledger-entry-title">{entry.title}</h3>
                      <div className="ledger-entry-meta">
                        <span className="ledger-entry-date">{entry.date || formatDate(entry.timestamp)}</span>
                        {entry.type === 'decision' && entry.choice && (
                          <span className="ledger-entry-choice">Choice: {entry.choice}</span>
                        )}
                        {entry.type === 'randomEvent' && (
                          <span className={`ledger-entry-type ${entry.isGood ? 'good' : 'bad'}`}>
                            {entry.isGood ? 'Good Event' : 'Bad Event'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {entry.description && (
                    <div className="ledger-entry-description">
                      {entry.description}
                    </div>
                  )}
                  {entry.effects && getEffectDisplay(entry.effects)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerModal;

