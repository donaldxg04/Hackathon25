import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import History from './components/History';
import Settings from './components/Settings';
import Insights from './components/Insights';
import About from './components/About';
import AddTransaction from './components/AddTransaction';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pageTitle, setPageTitle] = useState('Spending Tracker');

  const handleNavigate = (tab) => {
    setActiveTab(tab);

    const titles = {
      dashboard: 'Spending Tracker',
      budget: 'Budget',
      history: 'History',
      settings: 'Settings',
      insights: 'Spending Tracker',
      about: 'About',
      'add-transaction': 'Add Transaction',
      'add-income': 'Add Income',
    };

    setPageTitle(titles[tab] || 'Spending Tracker');
  };

  return (
    <BudgetProvider>
      <div id="app">
        <header className="topbar">
          <div className="logo"></div>
          <h1 className="app-title">{pageTitle}</h1>
        </header>

        <main id="tabs">
          {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {activeTab === 'budget' && <Budget onNavigate={handleNavigate} />}
          {activeTab === 'history' && <History onNavigate={handleNavigate} />}
          {activeTab === 'settings' && <Settings onNavigate={handleNavigate} />}
          {activeTab === 'insights' && <Insights onNavigate={handleNavigate} />}
          {activeTab === 'about' && <About onNavigate={handleNavigate} />}
          {activeTab === 'add-transaction' && <AddTransaction onNavigate={handleNavigate} />}
        </main>

        <Navbar activeTab={activeTab} onNavigate={handleNavigate} />
        {activeTab === 'newpage' && <NewPage onNavigate={handleNavigate} />}

      </div>
    </BudgetProvider>
  );
}

export default App;
