import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const YourNewModal = ({ onClose }) => {
  const { gameState } = useGame();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Popup Title</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Your popup content here */}
        </div>
      </div>
    </div>
  );
};

export default YourNewModal;