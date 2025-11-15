const About = ({ onNavigate }) => {
  return (
    <section className="tab-content active">
      <button className="back-button" onClick={() => onNavigate('settings')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        Back
      </button>
      <div className="page-details">
        <h2>About This App</h2>
        <p>
          This budgeting app helps you take control of your finances by tracking your income,
          savings, and spending across custom categories. You can plan budgets for each month,
          visualize your allocation through interactive charts, and review your transaction
          history over time. Designed with simplicity and clarity in mind, it empowers you to
          make smarter financial decisions and stay on top of your goals.
        </p>

        <h2>How to Use</h2>
        <p>
          Start by entering your income and savings under the Budget tab.
          Then, create spending categories to allocate your funds. As you
          add transactions, your charts and "Left to Budget" number update
          automatically — helping you stay within your financial goals.
        </p>
        <h5>Version: 1.0.0</h5>
        <h5>Last Updated: November 2025</h5>
      </div>
    </section>
  );
};

export default About;
