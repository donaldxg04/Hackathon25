import { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';

const History = () => {
  const { state } = useBudget();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const renderCalendar = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    const firstDayIndex = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      let dayNum, dateStr, isOtherMonth = false;

      if (i < firstDayIndex) {
        dayNum = prevMonthDays - firstDayIndex + i + 1;
        isOtherMonth = true;
        dateStr = new Date(currentYear, currentMonth - 1, dayNum).toISOString().split('T')[0];
      } else if (i >= firstDayIndex + daysInMonth) {
        dayNum = i - firstDayIndex - daysInMonth + 1;
        isOtherMonth = true;
        dateStr = new Date(currentYear, currentMonth + 1, dayNum).toISOString().split('T')[0];
      } else {
        dayNum = i - firstDayIndex + 1;
        dateStr = new Date(currentYear, currentMonth, dayNum).toISOString().split('T')[0];
      }

      days.push({
        dayNum,
        dateStr,
        isOtherMonth,
        isActive: selectedDate === dateStr,
      });
    }

    return days;
  };

  const getFilteredTransactions = () => {
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    return state.transactions.filter(tx => {
      const matchesCalendar = selectedDate
        ? tx.date === selectedDate
        : tx.date.slice(0, 7) === monthKey;
      const matchesCategory = !categoryFilter || tx.category === categoryFilter;
      const matchesSearch = !searchTerm || tx.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCalendar && matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleDayClick = (day) => {
    if (day.isOtherMonth) return;
    setSelectedDate(selectedDate === day.dateStr ? null : day.dateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setSelectedDate(null);
  };

  const calendarDays = renderCalendar();
  const filteredTransactions = getFilteredTransactions();
  const monthLabel = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <section className="tab-content active">
      <div id="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="calendar-nav">&lt;</button>
          <span id="month-label">{monthLabel}</span>
          <button onClick={handleNextMonth} className="calendar-nav">&gt;</button>
        </div>
        <div className="calendar-weekdays">
          <div>S</div><div>M</div><div>T</div><div>W</div><div>Th</div><div>F</div><div>Sa</div>
        </div>
        <div className="calendar-days">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`${day.isOtherMonth ? 'other-month' : ''} ${day.isActive ? 'active' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day.dayNum}
            </div>
          ))}
        </div>
      </div>

      <div className="search-filter">
        <div className="searchbar">
          <input
            id="searchbar"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-button" onClick={() => setShowFilters(!showFilters)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 1 1 1 10 12 10 20 14 22 14 12 23 1"></polygon>
          </svg>
        </div>
      </div>

      {showFilters && (
        <div id="filters">
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All</option>
                {Object.keys(state.categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button id="btn-clear-filters" onClick={handleClearFilters}>Clear</button>
          </div>
        </div>
      )}

      <div id="transaction-list">
        {filteredTransactions.length === 0 ? (
          <p className="empty-state-message">No transactions found for this period.</p>
        ) : (
          filteredTransactions.map((tx, idx) => (
            <div key={idx} className="transaction-item">
              <div className="transaction-details">
                <span className="transaction-title">{tx.title}</span>
                <span className="transaction-date">
                  {new Date(tx.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </span>
              </div>
              <div className="transaction-amount">-${tx.amount.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default History;
