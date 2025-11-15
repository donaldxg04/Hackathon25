import { useState, useEffect, useRef } from 'react';
import { useBudget } from '../context/BudgetContext';

const Budget = () => {
  const { state, addCategory, saveState, updateBudget } = useBudget();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetData, setBudgetData] = useState({ income: [], savings: [], custom: [] });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFormData, setCustomFormData] = useState({
    category: '',
    newCategory: '',
    name: '',
    amount: '',
  });
  const chartCanvasRef = useRef(null);

  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

  useEffect(() => {
    const budgetKey = `budget-v2:${selectedMonth}`;
    const stored = localStorage.getItem(budgetKey);
    if (stored) {
      setBudgetData(JSON.parse(stored));
    } else {
      setBudgetData({ income: [], savings: [], custom: [] });
    }
  }, [selectedMonth]);

  const saveBudgetData = (data) => {
    const budgetKey = `budget-v2:${selectedMonth}`;
    localStorage.setItem(budgetKey, JSON.stringify(data));
    setBudgetData(data);

    const inc = data.income.reduce((a, x) => a + Number(x.amount || 0), 0);
    const sav = data.savings.reduce((a, x) => a + Number(x.amount || 0), 0);
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthlyBudget = Math.max(inc - sav, 0);
    const dailyBudget = Math.floor(monthlyBudget / daysInMonth);
    updateBudget(dailyBudget, monthlyBudget);
  };

  const addIncome = () => {
    const newData = {
      ...budgetData,
      income: [...budgetData.income, { name: '', amount: 0 }],
    };
    saveBudgetData(newData);
  };

  const addSavings = () => {
    const newData = {
      ...budgetData,
      savings: [...budgetData.savings, { name: '', amount: 0 }],
    };
    saveBudgetData(newData);
  };

  const removeIncome = (index) => {
    const newData = {
      ...budgetData,
      income: budgetData.income.filter((_, i) => i !== index),
    };
    saveBudgetData(newData);
  };

  const removeSavings = (index) => {
    const newData = {
      ...budgetData,
      savings: budgetData.savings.filter((_, i) => i !== index),
    };
    saveBudgetData(newData);
  };

  const removeCustom = (index) => {
    const newData = {
      ...budgetData,
      custom: budgetData.custom.filter((_, i) => i !== index),
    };
    saveBudgetData(newData);
  };

  const updateIncome = (index, field, value) => {
    const newData = { ...budgetData };
    newData.income[index][field] = field === 'amount' ? Number(value) : value;
    saveBudgetData(newData);
  };

  const updateSavings = (index, field, value) => {
    const newData = { ...budgetData };
    newData.savings[index][field] = field === 'amount' ? Number(value) : value;
    saveBudgetData(newData);
  };

  const updateCustom = (index, field, value) => {
    const newData = { ...budgetData };
    newData.custom[index][field] = field === 'amount' ? Number(value) : value;
    saveBudgetData(newData);
  };

  const handleAddCustom = () => {
    let category = customFormData.category;

    if (category === 'new') {
      const newCat = customFormData.newCategory.trim();
      if (!newCat) return;
      addCategory(newCat);
      category = newCat;
    } else if (!category) {
      return;
    }

    const newData = {
      ...budgetData,
      custom: [
        ...budgetData.custom,
        {
          name: customFormData.name.trim() || 'Item',
          amount: Number(customFormData.amount || 0),
          category: category,
        },
      ],
    };
    saveBudgetData(newData);
    setCustomFormData({ category: '', newCategory: '', name: '', amount: '' });
    setShowCustomForm(false);
  };

  const totalIncome = budgetData.income.reduce((a, x) => a + Number(x.amount || 0), 0);
  const totalSavings = budgetData.savings.reduce((a, x) => a + Number(x.amount || 0), 0);
  const totalCustom = budgetData.custom.reduce((a, x) => a + Number(x.amount || 0), 0);
  const leftToBudget = totalIncome - (totalSavings + totalCustom);

  const allocationColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
    '#00BCD4', '#8BC34A', '#FFEB3B', '#E91E63', '#607D8B',
  ];

  const buildAllocations = () => {
    const byCat = {};
    budgetData.custom.forEach(it => {
      const c = it.category || 'Uncategorized';
      byCat[c] = (byCat[c] || 0) + Number(it.amount || 0);
    });
    const labels = ['Savings', ...Object.keys(byCat)];
    const values = [totalSavings, ...Object.values(byCat)];
    const allocated = values.reduce((a, v) => a + v, 0);
    const unallocated = Math.max(0, totalIncome - allocated);
    labels.push('Unallocated');
    values.push(unallocated);
    return { labels, values };
  };

  const drawPie = () => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const size = Math.max(180, Math.min(rect.width, 320));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const { labels, values } = buildAllocations();
    const total = values.reduce((a, v) => a + v, 0);

    if (!total) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No allocations yet', size / 2, size / 2);
      return;
    }

    const radius = Math.min(size, size) / 2 - 12;
    const cx = size / 2;
    const cy = size / 2;
    let startAngle = -Math.PI / 2;
    const overBudget = leftToBudget < 0;

    values.forEach((value, idx) => {
      if (value <= 0) return;
      const slice = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = overBudget ? '#B91C1C' : allocationColors[idx % allocationColors.length];
      ctx.fill();
      startAngle += slice;
    });

    ctx.font = '16px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = overBudget ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.9)';
    ctx.strokeText(fmt(total), cx, cy);
    ctx.fillStyle = overBudget ? '#FFFFFF' : '#0D1B2A';
    ctx.fillText(fmt(total), cx, cy);
  };

  useEffect(() => {
    drawPie();
  }, [budgetData]);

  const { labels, values } = buildAllocations();

  return (
    <section className="tab-content active">
      <div className={`budget-header ${leftToBudget < 0 ? 'over-budget' : ''}`}>
        <div className="header-row">
          <div className="month-select-wrap">
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="2025-01">January 2025</option>
              <option value="2025-02">February 2025</option>
              <option value="2025-03">March 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-05">May 2025</option>
              <option value="2025-06">June 2025</option>
              <option value="2025-07">July 2025</option>
              <option value="2025-08">August 2025</option>
              <option value="2025-09">September 2025</option>
              <option value="2025-10">October 2025</option>
              <option value="2025-11">November 2025</option>
              <option value="2025-12">December 2025</option>
            </select>
          </div>
          <p className="left-to-budget">
            <strong>{fmt(leftToBudget)}</strong> left to budget
          </p>
        </div>
      </div>

      <div className="budget-grid">
        <div className="budget-card">
          <h4>Planned Income</h4>
          <p className="budget-value">{fmt(totalIncome)}</p>
        </div>
        <div className="budget-card">
          <h4>Planned Savings</h4>
          <p className="budget-value">{fmt(totalSavings)}</p>
        </div>
      </div>

      <details open>
        <summary className="section-title-row">
          <span className="chev"></span>
          <h5>Income</h5>
          <button className="mini-link" onClick={addIncome}>+ Add/Edit Income</button>
        </summary>
        <div className="editable-list">
          {budgetData.income.map((item, idx) => (
            <div key={idx} className="row">
              <input
                className="input-name"
                value={item.name}
                onChange={(e) => updateIncome(idx, 'name', e.target.value)}
                placeholder="Name"
              />
              <input
                className="input-money"
                type="number"
                step="0.01"
                value={item.amount}
                onChange={(e) => updateIncome(idx, 'amount', e.target.value)}
                placeholder="0.00"
              />
              <button className="icon-btn" onClick={() => removeIncome(idx)}>×</button>
            </div>
          ))}
        </div>
      </details>

      <details open>
        <summary className="section-title-row">
          <span className="chev"></span>
          <h5>Savings</h5>
          <button className="mini-link" onClick={addSavings}>+ Add/Edit Savings</button>
        </summary>
        <div className="editable-list">
          {budgetData.savings.map((item, idx) => (
            <div key={idx} className="row">
              <input
                className="input-name"
                value={item.name}
                onChange={(e) => updateSavings(idx, 'name', e.target.value)}
                placeholder="Name"
              />
              <input
                className="input-money"
                type="number"
                step="0.01"
                value={item.amount}
                onChange={(e) => updateSavings(idx, 'amount', e.target.value)}
                placeholder="0.00"
              />
              <button className="icon-btn" onClick={() => removeSavings(idx)}>×</button>
            </div>
          ))}
        </div>
      </details>

      <details open>
        <summary className="section-title-row">
          <span className="chev"></span>
          <h5>Categories</h5>
          <button className="mini-link" onClick={() => setShowCustomForm(!showCustomForm)}>+ Add Budget Goals</button>
        </summary>

        {showCustomForm && (
          <div className="inline-form">
            <div className="form-row">
              <label htmlFor="custom-category">Category</label>
              <select
                id="custom-category"
                value={customFormData.category}
                onChange={(e) => setCustomFormData({ ...customFormData, category: e.target.value })}
              >
                <option value="" disabled>Select or add…</option>
                {Object.keys(state.categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">+ Add new category…</option>
              </select>
              {customFormData.category === 'new' && (
                <input
                  className="input-name"
                  type="text"
                  placeholder="New category name"
                  value={customFormData.newCategory}
                  onChange={(e) => setCustomFormData({ ...customFormData, newCategory: e.target.value })}
                />
              )}
            </div>
            <div className="form-row">
              <input
                className="input-name"
                type="text"
                placeholder="Item name"
                value={customFormData.name}
                onChange={(e) => setCustomFormData({ ...customFormData, name: e.target.value })}
              />
              <input
                className="input-money"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={customFormData.amount}
                onChange={(e) => setCustomFormData({ ...customFormData, amount: e.target.value })}
              />
              <button className="mini-link save-goal-btn" onClick={handleAddCustom}>Save Goal</button>
            </div>
          </div>
        )}

        <div id="custom-list">
          {budgetData.custom.map((item, idx) => (
            <div key={idx} className="row">
              <div className="row-left">
                <input
                  className="input-name"
                  value={item.name}
                  onChange={(e) => updateCustom(idx, 'name', e.target.value)}
                  placeholder="Item"
                />
                <span className="category-tag">{item.category || 'Uncategorized'}</span>
              </div>
              <input
                className="input-money"
                type="number"
                step="0.01"
                value={item.amount}
                onChange={(e) => updateCustom(idx, 'amount', e.target.value)}
                placeholder="0.00"
              />
              <button className="icon-btn" onClick={() => removeCustom(idx)}>×</button>
            </div>
          ))}
        </div>
      </details>

      <div className="budget-section">
        <div className="section-title-row">
          <h5>Allocation</h5>
        </div>
        <canvas ref={chartCanvasRef} id="allocation-chart" height="220"></canvas>
        <div className="allocation-legend">
          {values.reduce((a, v) => a + v, 0) === 0 ? (
            <div className="legend-item">
              <div className="legend-left">
                <span>No allocations yet</span>
              </div>
            </div>
          ) : (
            labels.map((label, idx) => {
              const total = values.reduce((a, v) => a + v, 0);
              const value = values[idx];
              const pct = total ? Math.round((value / total) * 100) : 0;
              const color = leftToBudget < 0 ? '#B91C1C' : allocationColors[idx % allocationColors.length];

              return (
                <div key={idx} className="legend-item">
                  <div className="legend-left">
                    <span className="legend-swatch" style={{ background: color }}></span>
                    <span>{label}</span>
                  </div>
                  <span className="legend-value">{fmt(value)} • {pct}%</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Budget;
