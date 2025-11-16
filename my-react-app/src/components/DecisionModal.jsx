import { useEffect, useState } from 'react';

const DecisionModal = ({ onClose }) => {
  const prompts = [
    "A friend asks you to invest $10,000 in their startup. What do you do?",
    "You receive an unexpected bonus of $5,000. How will you use it?",
    "The housing market is crashing. Should you sell your property now?",
    "A family member needs a loan of $20,000. Do you help them?",
    "You discover a new cryptocurrency that's gaining popularity. Invest?",
    "Your job offers early retirement with a reduced pension. Accept?",
    "A once-in-a-lifetime investment opportunity requires all your savings. Take the risk?",
    "The stock market just dropped 20%. Time to buy or sell?",
    "You inherit $100,000. What's your first move?",
    "A major expense is coming up, but you're not fully prepared. How do you handle it?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(() => 
    prompts[Math.floor(Math.random() * prompts.length)]
  );

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
    <div className="decision-modal-container">
      <div className="decision-modal-content">
        <div className="decision-modal-header">
          <h2>Decision Time</h2>
          <button className="decision-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="decision-modal-body">
          <p className="decision-prompt">{currentPrompt}</p>
          <div className="decision-buttons">
            <button className="btn-decision btn-accept" onClick={onClose}>Accept</button>
            <button className="btn-decision btn-decline" onClick={onClose}>Decline</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;