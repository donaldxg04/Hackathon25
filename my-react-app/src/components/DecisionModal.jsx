import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const DecisionModal = ({ onClose }) => {
  const { updateStats } = useGame();

  // Each prompt has text and stat changes for Accept/Decline
  // Stat changes: {health, stress, happiness}
  const prompts = [
    {
      text: "A friend asks you to invest $10,000 in their startup. What do you do?",
      accept: { health: 0, stress: 10, happiness: -5 }, // Risk stress, less happiness
      decline: { health: 0, stress: -5, happiness: 5 }  // Less stress, more happiness
    },
    {
      text: "You receive an unexpected bonus of $5,000. How will you use it?",
      accept: { health: 5, stress: -10, happiness: 10 }, // Spend on self - feel good
      decline: { health: 0, stress: 0, happiness: 5 }     // Save it - moderate happiness
    },
    {
      text: "The housing market is crashing. Should you sell your property now?",
      accept: { health: -5, stress: 15, happiness: -10 }, // Panic sell - high stress
      decline: { health: 0, stress: -5, happiness: 0 }    // Hold - less stress
    },
    {
      text: "A family member needs a loan of $20,000. Do you help them?",
      accept: { health: 0, stress: 5, happiness: 10 },    // Help family - happy but stressed
      decline: { health: 0, stress: -5, happiness: -5 }  // Refuse - less stress but guilt
    },
    {
      text: "You discover a new cryptocurrency that's gaining popularity. Invest?",
      accept: { health: 0, stress: 15, happiness: 5 },    // Risky investment - high stress
      decline: { health: 0, stress: -5, happiness: 0 }    // Play it safe - less stress
    },
    {
      text: "Your job offers early retirement with a reduced pension. Accept?",
      accept: { health: 10, stress: -15, happiness: 15 }, // Retire early - great for wellbeing
      decline: { health: -5, stress: 10, happiness: -5 }   // Keep working - more stress
    },
    {
      text: "A once-in-a-lifetime investment opportunity requires all your savings. Take the risk?",
      accept: { health: -10, stress: 20, happiness: -5 }, // Extreme risk - very stressful
      decline: { health: 5, stress: -10, happiness: 5 }     // Safe choice - feel secure
    },
    {
      text: "The stock market just dropped 20%. Time to buy or sell?",
      accept: { health: 0, stress: 10, happiness: 0 },    // Buy in crash - risky
      decline: { health: 0, stress: -5, happiness: 0 }     // Wait it out - less stress
    },
    {
      text: "You inherit $100,000. What's your first move?",
      accept: { health: 10, stress: -20, happiness: 20 }, // Invest wisely - very happy
      decline: { health: 5, stress: -10, happiness: 10 }    // Save it - good but less exciting
    },
    {
      text: "A major expense is coming up, but you're not fully prepared. How do you handle it?",
      accept: { health: -5, stress: 15, happiness: -10 }, // Panic and borrow - very stressful
      decline: { health: 0, stress: 5, happiness: -5 }    // Plan carefully - moderate stress
    }
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

  const handleAccept = () => {
    const { health, stress, happiness } = currentPrompt.accept;
    updateStats(health, stress, happiness);
    onClose();
  };

  const handleDecline = () => {
    const { health, stress, happiness } = currentPrompt.decline;
    updateStats(health, stress, happiness);
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
          <p className="decision-prompt">{currentPrompt.text}</p>
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