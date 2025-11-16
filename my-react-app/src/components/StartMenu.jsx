import { useState } from 'react';
import { useGame } from '../context/GameContext';
import './StartMenu.css';

const StartMenu = () => {
  const { startGameWithChoiceB } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);

  // Continue button should only be enabled when name is filled and Choice B is selected
  const canContinue = playerName.trim().length > 0 && selectedChoice === 'B';

  const handleContinue = () => {
    if (canContinue) {
      startGameWithChoiceB(playerName.trim());
    }
  };

  const handleChoiceClick = (choice) => {
    if (choice === 'A') {
      // Show unavailable message for Choice A
      setShowUnavailableMessage(true);
      setSelectedChoice('');
      setTimeout(() => setShowUnavailableMessage(false), 3000);
    } else if (choice === 'B') {
      setSelectedChoice(choice);
      setShowUnavailableMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && canContinue) {
      handleContinue();
    }
  };

  return (
    <div className="start-menu-overlay">
      <div className="start-menu-card">
        <h1 className="start-menu-title">Welcome to Your Post-Grad Life</h1>

        <p className="start-menu-intro">
          You're a newly graduated college student stepping into adult life. Your goal:
          manage your personal finances wisely, build wealth, and survive the ups and
          downs of the economy.
        </p>

        <div className="start-menu-section">
          <label htmlFor="playerName" className="start-menu-label">
            Enter your name:
          </label>
          <input
            id="playerName"
            type="text"
            className="start-menu-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your name"
            autoFocus
          />
        </div>

        <div className="start-menu-section">
          <h2 className="start-menu-subtitle">Choose Your Career Path:</h2>

          <div className="choice-cards">
            {/* Choice A - Appears available but shows message when clicked */}
            <div
              className={`choice-card choice-selectable ${selectedChoice === 'A' ? 'choice-selected' : ''}`}
              onClick={() => handleChoiceClick('A')}
            >
              <div className="choice-header">
                <h3 className="choice-title">Choice A</h3>
                <span className="choice-badge available-badge">Available</span>
              </div>
              <h4 className="choice-occupation">Software Engineering Role for a Startup</h4>
              <p className="choice-description">
                Startups offer a risky route — starting pay is low, no benefits, no stock
                options. Work is entirely remote, so you can live at home and don't need a car.
              </p>
            </div>

            {/* Choice B - Selectable */}
            <div
              className={`choice-card choice-selectable ${selectedChoice === 'B' ? 'choice-selected' : ''}`}
              onClick={() => handleChoiceClick('B')}
            >
              <div className="choice-header">
                <h3 className="choice-title">Choice B</h3>
                <span className="choice-badge available-badge">Available</span>
              </div>
              <h4 className="choice-occupation">Data Science Role for Big Tech</h4>
              <p className="choice-description">
                Big Tech offers a safer route. Healthy starting salary, including stock in the
                company (TECH). It is in Mountain View, California. You will need a car and rent
                is not super cheap. The company does offer benefits, so car insurance is the only
                insurance you will pay.
              </p>
              {selectedChoice === 'B' && (
                <div className="choice-selected-indicator">✓ Selected</div>
              )}
            </div>
          </div>

          {showUnavailableMessage && (
            <div className="unavailable-message">
              This career path is coming soon! Please select Choice B for now.
            </div>
          )}
        </div>

        <button
          className={`start-menu-continue ${canContinue ? 'continue-enabled' : 'continue-disabled'}`}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue
        </button>

        {!canContinue && (
          <p className="start-menu-hint">
            {playerName.trim().length === 0 && selectedChoice !== 'B'
              ? 'Please enter your name and select Choice B to continue'
              : playerName.trim().length === 0
              ? 'Please enter your name to continue'
              : 'Please select Choice B to continue'}
          </p>
        )}
      </div>
    </div>
  );
};

export default StartMenu;
