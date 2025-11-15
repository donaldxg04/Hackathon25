import { useBudget } from '../context/BudgetContext';

const Insights = () => {
  const { state } = useBudget();
  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentMonthDate = new Date(`${currentMonthKey}-01T00:00:00`);
  const monthLabel = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const budgetKey = `budget-v2:${currentMonthKey}`;
  let budgetData = { income: [], savings: [], custom: [] };
  try {
    const stored = localStorage.getItem(budgetKey);
    if (stored) budgetData = JSON.parse(stored);
  } catch (_) {
    budgetData = { income: [], savings: [], custom: [] };
  }

  const plannedByCategory = {};
  (budgetData.custom || []).forEach(item => {
    const cat = (item.category || 'Uncategorized').trim() || 'Uncategorized';
    plannedByCategory[cat] = (plannedByCategory[cat] || 0) + Number(item.amount || 0);
  });

  const spentByCategory = {};
  state.transactions.forEach(tx => {
    if (tx.date.startsWith(currentMonthKey)) {
      const cat = tx.category || 'Uncategorized';
      spentByCategory[cat] = (spentByCategory[cat] || 0) + tx.amount;
    }
  });

  const categories = Array.from(
    new Set([...Object.keys(plannedByCategory), ...Object.keys(spentByCategory)])
  ).sort((a, b) => a.localeCompare(b));

  return (
    <section className="tab-content active">
      <div className="category-insights">
        <div className="category-insights-header">
          <div>
            <p>Track how much you have spent.</p>
          </div>
          <p className="selected-month-label">
            Current month: <span>{monthLabel}</span>
          </p>
        </div>
        <div className="category-insight-list">
          {categories.length === 0 ? (
            <div className="category-insight-empty">Add a budget category to see insights.</div>
          ) : (
            categories.map(cat => {
              const planned = plannedByCategory[cat] || 0;
              const spent = spentByCategory[cat] || 0;
              const percentOfPlan = planned > 0 ? (spent / planned) * 100 : 0;
              const overBudget = planned > 0 && spent > planned;
              const fillPct = (planned > 0 && !overBudget) ? Math.min(percentOfPlan, 100) : 0;
              const status =
                planned === 0
                  ? 'No plan set'
                  : `${Math.round((spent / planned) * 100)}% of plan`;

              return (
                <div key={cat} className="category-insight-card">
                  <header>
                    <span>{cat}</span>
                    <span>{fmt(spent)} / {fmt(planned)}</span>
                  </header>
                  <div className="category-insight-bar">
                    <div className="category-insight-fill" style={{ width: `${fillPct}%` }}></div>
                  </div>
                  <div className="category-insight-meta">
                    <span>Spent</span>
                    <span>{status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Insights;
