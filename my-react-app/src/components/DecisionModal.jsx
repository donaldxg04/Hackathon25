import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const DecisionModal = ({ event, onClose }) => {
  const { updateStats, completeStoryEvent } = useGame();

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

  const handleAccept = () => {
    const { health, stress, happiness } = event.accept;
    updateStats(health, stress, happiness);
    completeStoryEvent(event.id);
    onClose();
  };

  const handleDecline = () => {
    const { health, stress, happiness } = event.decline;
    updateStats(health, stress, happiness);
    completeStoryEvent(event.id);
    onClose();
  };

  return (
    <div className="decision-modal-container">
      <div className="decision-modal-content">
        <div className="decision-modal-header">
          <h2>Decision Time</h2>
          <button className="decision-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="decision-modal-body">
          {event.title && (
            <h3 className="decision-title">{event.title}</h3>
          )}
          <p className="decision-prompt">{event.text}</p>
          <div className="decision-buttons">
            <button className="btn-decision btn-accept" onClick={handleAccept}>Accept</button>
            <button className="btn-decision btn-decline" onClick={handleDecline}>Decline</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;