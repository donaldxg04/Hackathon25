import { useState } from 'react';

const Settings = ({ onNavigate }) => {
  const [textSize, setTextSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('usd');
  const [hearingAid, setHearingAid] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <section className="tab-content active">
      <h2>Accessibility</h2>
      <div className="budget-section">
        <div className="section-title-row">
          <h4>Text Size</h4>
          <select id="text-size" value={textSize} onChange={(e) => setTextSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      <div className="budget-section">
        <div className="section-title-row">
          <h4>Language</h4>
          <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English (US)</option>
            <option value="en-uk">English (UK)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="it">Italian (Italiano)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="ja">Japanese (日本語)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ar">Arabic (العربية)</option>
          </select>
        </div>
      </div>

      <div className="budget-section">
        <div className="section-title-row">
          <h4>Currency</h4>
          <select id="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="usd">USD ($)</option>
            <option value="eur">Euro (€)</option>
            <option value="gbp">British Pound (£)</option>
            <option value="inr">Indian Rupee (₹)</option>
            <option value="jpy">Japanese Yen (¥)</option>
            <option value="cad">Canadian Dollar (C$)</option>
            <option value="aud">Australian Dollar (A$)</option>
            <option value="cny">Chinese Yuan (¥)</option>
            <option value="krw">South Korean Won (₩)</option>
            <option value="mxn">Mexican Peso ($)</option>
          </select>
        </div>
      </div>

      <div className="budget-section">
        <div className="section-title-row">
          <h4>Enable Hearing Aid Support</h4>
          <input
            type="checkbox"
            id="hearing-aid"
            checked={hearingAid}
            onChange={(e) => setHearingAid(e.target.checked)}
          />
        </div>
      </div>

      <div className="budget-section">
        <div className="section-title-row">
          <h4>High Contrast Mode</h4>
          <input
            type="checkbox"
            id="high-contrast"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
        </div>
      </div>

      <h3>Other</h3>

      <div className="budget-section">
        <div id="about" className="section-title-row" onClick={() => onNavigate('about')} style={{ cursor: 'pointer' }}>
          <h5>About App</h5>
        </div>
      </div>
    </section>
  );
};

export default Settings;
