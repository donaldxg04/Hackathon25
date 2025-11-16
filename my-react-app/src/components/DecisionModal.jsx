import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const DecisionModal = ({ onClose, event }) => {
  const { applyEventStateChanges } = useGame();

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
  const handleChoice = () => {
    if (event && event.stateChanges) {
      applyEventStateChanges(event.stateChanges);
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
                <button className="btn-decision btn-accept" onClick={handleChoice}>
                  {event.choices.accept}
                </button>
                <button className="btn-decision btn-decline" onClick={handleChoice}>
                  {event.choices.decline}
                </button>
              </>
            ) : (
              <button className="btn-decision btn-accept" onClick={handleChoice}>
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