import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';

const AddTransaction = ({ onNavigate }) => {
  const { state, addTransaction, getTodayDate } = useBudget();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: Object.keys(state.categories)[0] || '',
    date: getTodayDate(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const transaction = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    addTransaction(transaction);
    setFormData({
      title: '',
      amount: '',
      category: Object.keys(state.categories)[0] || '',
      date: getTodayDate(),
    });
    onNavigate('dashboard');
  };

  return (
    <section className="tab-content active">
      <div className="form-container">
        <button className="back-button" onClick={() => onNavigate('dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="transaction-name">Title</label>
          <input
            type="text"
            id="transaction-name"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <label htmlFor="transaction-date">Date</label>
          <input
            type="date"
            id="transaction-date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <label htmlFor="transaction-amount">Amount</label>
          <input
            type="number"
            step="0.01"
            id="transaction-amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {Object.keys(state.categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary">Save Transaction</button>
        </form>
      </div>
    </section>
  );
};

export default AddTransaction;
