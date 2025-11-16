import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const DecisionModal = ({ onClose, event }) => {
  const { applyEventStateChanges, addLedgerEntry, gameState, formatDate } = useGame();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Apply the hardcoded state changes and close modal
  // This is called regardless of which choice the user clicks
  const handleChoice = (choiceType) => {
    if (event && event.stateChanges) {
      applyEventStateChanges(event.stateChanges);
    }
    
    // Log decision to ledger
    if (event) {
      const choice = event.hasChoice 
        ? (choiceType === 'accept' ? event.choices.accept : event.choices.decline)
        : 'Continue';
      
      // Extract stat changes from stateChanges
      const effects = {
        health: event.stateChanges?.health || 0,
        stress: event.stateChanges?.stress || 0,
        happiness: event.stateChanges?.happiness || 0
      };
      
      // Extract financial changes (exclude stat changes)
      const financialChanges = { ...event.stateChanges };
      delete financialChanges.health;
      delete financialChanges.stress;
      delete financialChanges.happiness;
      
      addLedgerEntry({
        type: 'decision',
        title: event.title || 'Decision',
        description: event.description || '',
        choice: choice,
        effects: effects,
        financialChanges: Object.keys(financialChanges).length > 0 ? financialChanges : null,
        date: gameState.currentDate ? formatDate(gameState.currentDate) : formatDate(new Date())
      });
    }
    
    onClose();
  };

  // If no event is provided, fallback to closing
  if (!event) {
    return null;
  }

  return (
    <div className="decision-modal-container">
      <div className="decision-modal-content">
        <div className="decision-modal-header">
          <h2>{event.title}</h2>
          <button className="decision-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="decision-modal-body">
          <p className="decision-prompt">{event.description}</p>
          <div className="decision-buttons">
            {event.hasChoice ? (
              <>
                <button className="btn-decision btn-accept" onClick={() => handleChoice('accept')}>
                  {event.choices.accept}
                </button>
                <button className="btn-decision btn-decline" onClick={() => handleChoice('decline')}>
                  {event.choices.decline}
                </button>
              </>
            ) : (
              <button className="btn-decision btn-accept" onClick={() => handleChoice('continue')}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;