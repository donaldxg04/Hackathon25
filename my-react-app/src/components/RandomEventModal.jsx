import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const RandomEventModal = ({ event, onClose }) => {
  const { updateStats, addLedgerEntry, gameState, formatDate } = useGame();

  if (!event) {
    onClose();
    return null;
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleContinue = () => {
    // Apply the event effects
    const { health, stress, happiness } = event.effects;
    updateStats(health, stress, happiness);
    
    // Log to ledger
    addLedgerEntry({
      type: 'randomEvent',
      title: event.title,
      description: event.text,
      effects: {
        health,
        stress,
        happiness
      },
      isGood: event.id.startsWith('good_'),
      date: formatDate(gameState.currentDate)
    });
    
    onClose();
  };

  const isGoodEvent = event.id.startsWith('good_');

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={handleContinue}></div>
      <div className="modal-content random-event-modal">
        <div className={`modal-header ${isGoodEvent ? 'good-event' : 'bad-event'}`}>
          <h2>{event.title}</h2>
          <button className="modal-close" onClick={handleContinue}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="random-event-text">{event.text}</p>
          <div className="random-event-effects">
            {event.effects.health !== 0 && (
              <div className="effect-item">
                <span className="effect-label">Health:</span>
                <span className={`effect-value ${event.effects.health > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.health > 0 ? '+' : ''}{event.effects.health}
                </span>
              </div>
            )}
            {event.effects.stress !== 0 && (
              <div className="effect-item">
                <span className="effect-label">Stress:</span>
                <span className={`effect-value ${event.effects.stress > 0 ? 'negative' : 'positive'}`}>
                  {event.effects.stress > 0 ? '+' : ''}{event.effects.stress}
                </span>
              </div>
            )}
            {event.effects.happiness !== 0 && (
              <div className="effect-item">
                <span className="effect-label">Happiness:</span>
                <span className={`effect-value ${event.effects.happiness > 0 ? 'positive' : 'negative'}`}>
                  {event.effects.happiness > 0 ? '+' : ''}{event.effects.happiness}
                </span>
              </div>
            )}
          </div>
          <button className="btn-random-event-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomEventModal;

