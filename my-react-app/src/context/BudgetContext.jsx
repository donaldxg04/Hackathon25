import { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

const defaultCategories = {
  Groceries: { total: 0, transactions: [] },
  Dining: { total: 0, transactions: [] },
  Transport: { total: 0, transactions: [] },
  Entertainment: { total: 0, transactions: [] },
};

const sampleTransactions = [
  { "title": "Groceries from Lidl", "amount": 29.99, "category": "Groceries", "date": "2025-08-11" },
  { "title": "Movie night - IMAX Oppenheimer", "amount": 18.00, "category": "Entertainment", "date": "2025-09-01" },
  { "title": "Groceries from Trader Joe's", "amount": 52.30, "category": "Groceries", "date": "2025-09-02" },
  { "title": "Uber to campus", "amount": 13.45, "category": "Transport", "date": "2025-09-03" },
  { "title": "Lunch at Chipotle", "amount": 11.75, "category": "Dining", "date": "2025-09-04" },
  { "title": "Spotify Premium", "amount": 9.99, "category": "Entertainment", "date": "2025-09-06" },
  { "title": "Gas refill at Shell", "amount": 42.00, "category": "Transport", "date": "2025-09-08" },
  { "title": "Dinner with friends - Olive Garden", "amount": 36.20, "category": "Dining", "date": "2025-09-09" },
  { "title": "Gift for Sarah", "amount": 25.00, "category": "Entertainment", "date": "2025-09-10" },
  { "title": "Groceries from Safeway", "amount": 48.90, "category": "Groceries", "date": "2025-09-12" },
  { "title": "Coffee at Starbucks", "amount": 5.25, "category": "Dining", "date": "2025-09-13" },
  { "title": "Bus pass renewal", "amount": 30.00, "category": "Transport", "date": "2025-09-15" },
  { "title": "Netflix subscription", "amount": 15.49, "category": "Entertainment", "date": "2025-09-16" },
  { "title": "Dinner - Panda Express", "amount": 14.75, "category": "Dining", "date": "2025-09-18" },
  { "title": "Groceries - Whole Foods", "amount": 64.10, "category": "Groceries", "date": "2025-09-19" },
  { "title": "Arcade night", "amount": 22.00, "category": "Entertainment", "date": "2025-09-21" },
  { "title": "Gas station - Exxon", "amount": 39.85, "category": "Transport", "date": "2025-09-23" },
  { "title": "Subway lunch", "amount": 10.50, "category": "Dining", "date": "2025-09-25" },
  { "title": "Gift for Mom", "amount": 45.00, "category": "Entertainment", "date": "2025-09-27" },
  { "title": "Groceries from Aldi", "amount": 58.70, "category": "Groceries", "date": "2025-09-29" },
  { "title": "Groceries from Lidl", "amount": 47.25, "category": "Groceries", "date": "2025-10-02" },
  { "title": "Lunch at Five Guys", "amount": 16.50, "category": "Dining", "date": "2025-10-03" },
  { "title": "Lyft ride home", "amount": 14.20, "category": "Transport", "date": "2025-10-04" },
  { "title": "Concert ticket - The Weeknd", "amount": 120.00, "category": "Entertainment", "date": "2025-10-05" },
  { "title": "Groceries - Costco", "amount": 92.45, "category": "Groceries", "date": "2025-10-07" },
  { "title": "Uber to airport", "amount": 27.80, "category": "Transport", "date": "2025-10-10" },
  { "title": "Dinner at Cheesecake Factory", "amount": 42.60, "category": "Dining", "date": "2025-10-12" },
  { "title": "Movie - Dune 2", "amount": 17.50, "category": "Entertainment", "date": "2025-10-14" },
  { "title": "Gift - Cousin's birthday", "amount": 33.00, "category": "Entertainment", "date": "2025-10-16" },
  { "title": "Bus pass refill", "amount": 30.00, "category": "Transport", "date": "2025-10-18" },
  { "title": "Dinner at Nando's", "amount": 22.40, "category": "Dining", "date": "2025-10-19" },
  { "title": "Groceries from Safeway", "amount": 54.30, "category": "Groceries", "date": "2025-10-21" },
  { "title": "Bowling night", "amount": 28.50, "category": "Entertainment", "date": "2025-10-22" },
  { "title": "Gas refill at Chevron", "amount": 46.15, "category": "Transport", "date": "2025-10-23" },
  { "title": "Dinner at Panera", "amount": 15.80, "category": "Dining", "date": "2025-10-25" },
  { "title": "Halloween costume", "amount": 39.99, "category": "Entertainment", "date": "2025-10-28" },
  { "title": "Silksong", "amount": 19.99, "category": "Entertainment", "date": "2025-10-29" },
  { "title": "Groceries from Trader Joe's", "amount": 61.90, "category": "Groceries", "date": "2025-11-01" },
  { "title": "Lunch - Shake Shack", "amount": 17.20, "category": "Dining", "date": "2025-11-02" },
  { "title": "Uber to work", "amount": 12.40, "category": "Transport", "date": "2025-11-03" },
  { "title": "Dinner - Chipotle", "amount": 11.75, "category": "Dining", "date": "2025-11-04" },
  { "title": "Streaming - Hulu", "amount": 12.99, "category": "Entertainment", "date": "2025-11-05" },
  { "title": "Gift for Friend", "amount": 30.00, "category": "Entertainment", "date": "2025-11-06" },
  { "title": "Gas refill", "amount": 41.00, "category": "Transport", "date": "2025-11-07" },
  { "title": "Dinner at Panda Express", "amount": 14.25, "category": "Dining", "date": "2025-11-08" },
  { "title": "Groceries from Lidl", "amount": 50.10, "category": "Groceries", "date": "2025-11-09" },
  { "title": "Metro pass refill", "amount": 20, "category": "Transport", "date": "2025-11-10" }
];

export const BudgetProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('budgetState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      dailyBudget: 100,
      monthlyBudget: 1000,
      categories: defaultCategories,
      transactions: sampleTransactions,
      incomes: [],
      dailySpent: 0,
      monthlySpent: 0,
    };
  });

  const saveState = (newState) => {
    localStorage.setItem('budgetState', JSON.stringify(newState));
    setState(newState);
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };

  const recalcTotals = (currentState = state) => {
    const today = getTodayDate();
    const currentMonth = today.slice(0, 7);

    let daily = 0;
    let monthly = 0;

    const newCategories = { ...currentState.categories };
    Object.keys(newCategories).forEach(c => (newCategories[c].total = 0));

    currentState.transactions.forEach(tx => {
      if (tx.date === today) daily += tx.amount;
      if (tx.date.startsWith(currentMonth)) monthly += tx.amount;
      if (!newCategories[tx.category]) {
        newCategories[tx.category] = { total: 0, transactions: [] };
      }
      newCategories[tx.category].total += tx.amount;
    });

    return {
      ...currentState,
      categories: newCategories,
      dailySpent: daily,
      monthlySpent: monthly,
    };
  };

  const addTransaction = (transaction) => {
    const newState = {
      ...state,
      transactions: [...state.transactions, transaction],
    };
    const recalcState = recalcTotals(newState);
    saveState(recalcState);
  };

  const addIncome = (income) => {
    const newState = {
      ...state,
      incomes: [...state.incomes, income],
    };
    saveState(newState);
  };

  const addCategory = (categoryName) => {
    if (!state.categories[categoryName]) {
      const newState = {
        ...state,
        categories: {
          ...state.categories,
          [categoryName]: { total: 0, transactions: [] },
        },
      };
      saveState(newState);
    }
  };

  const updateBudget = (dailyBudget, monthlyBudget) => {
    const newState = {
      ...state,
      dailyBudget,
      monthlyBudget,
    };
    saveState(newState);
  };

  useEffect(() => {
    const recalcState = recalcTotals(state);
    if (recalcState.dailySpent !== state.dailySpent || recalcState.monthlySpent !== state.monthlySpent) {
      saveState(recalcState);
    }
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        state,
        addTransaction,
        addIncome,
        addCategory,
        updateBudget,
        getTodayDate,
        recalcTotals,
        saveState,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
