import { useEffect, useRef } from 'react';
import { useBudget } from '../context/BudgetContext';

const Dashboard = ({ onNavigate }) => {
  const { state } = useBudget();
  const dailyCanvasRef = useRef(null);
  const monthlyCanvasRef = useRef(null);
  const trendCanvasRef = useRef(null);

  const getProgressColor = (pct) => {
    if (pct < 0.6) return '#00875A';
    if (pct < 0.9) return '#FFD700';
    if (pct <= 1.0) return '#FF4500';
    return '#D00000';
  };

  const drawGauge = (canvas, spent, budget) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h * 1.1;
    const r = w / 2.2;
    const pct = Math.min(spent / budget, 1);
    const color = getProgressColor(pct);

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#E5E7EB';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * pct);
    ctx.strokeStyle = color;
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const getRecentDailyTotals = () => {
    const today = new Date();
    const map = {};
    const dates = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = 0;
      dates.push(key);
    }

    state.transactions.forEach(t => {
      const txDate = t.date;
      if (txDate in map) {
        map[txDate] += t.amount;
      }
    });

    return {
      dates: dates,
      values: Object.values(map)
    };
  };

  const drawTrend = (canvas) => {
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const trendData = getRecentDailyTotals();
    const data = trendData.values;
    const dates = trendData.dates;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    const nonZero = data.filter(v => v > 0);
    if (nonZero.length === 0) return;

    const maxVal = Math.max(...data, state.dailyBudget) * 1.1;
    const leftMargin = 40;
    const rightMargin = 10;
    const bottomMargin = 28;
    const topMargin = 15;
    const stepX = (containerWidth - leftMargin - rightMargin) / 6;
    const baseY = containerHeight - bottomMargin;
    const scaleY = v => baseY - (v / maxVal) * (baseY - topMargin);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(leftMargin, topMargin);
    ctx.lineTo(leftMargin, baseY);
    ctx.lineTo(containerWidth - rightMargin, baseY);
    ctx.stroke();

    ctx.fillStyle = '#6B7280';
    ctx.font = "10px 'Poppins', sans-serif";
    ctx.textAlign = 'right';
    const ySteps = 3;
    for (let i = 0; i <= ySteps; i++) {
      const value = (maxVal / ySteps) * i;
      const y = scaleY(value);
      ctx.fillText(`$${Math.round(value)}`, leftMargin - 5, y + 3);

      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(containerWidth - rightMargin, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#6B7280';
    ctx.font = "9px 'Poppins', sans-serif";
    ctx.textAlign = 'center';
    dates.forEach((date, i) => {
      const x = leftMargin + stepX * i;
      const d = new Date(date);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const label = `${month}/${day}`;
      ctx.fillText(label, x, baseY + 15);
    });

    const ceilingY = scaleY(state.dailyBudget);
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.moveTo(leftMargin, ceilingY);
    ctx.lineTo(containerWidth - rightMargin, ceilingY);
    ctx.stroke();
    ctx.setLineDash([]);

    let lastIdx = null;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0) {
        const x = leftMargin + stepX * i;
        const y = scaleY(data[i]);
        if (lastIdx !== null) {
          const prevX = leftMargin + stepX * lastIdx;
          const prevY = scaleY(data[lastIdx]);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle =
            data[i] > state.dailyBudget || data[lastIdx] > state.dailyBudget
              ? '#D00000'
              : '#00875A';
          ctx.stroke();
        }
        lastIdx = i;
      }
    }

    data.forEach((v, i) => {
      if (v > 0) {
        const x = leftMargin + stepX * i;
        const y = scaleY(v);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = v > state.dailyBudget ? 'rgba(208, 0, 0, 0.2)' : 'rgba(0, 135, 90, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = v > state.dailyBudget ? '#D00000' : '#00875A';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    });
  };

  const getTopCategories = () => {
    const monthSelect = new Date().toISOString().slice(0, 7);
    const monthlyTotals = {};

    state.transactions.forEach(tx => {
      if (tx.date.startsWith(monthSelect)) {
        const cat = tx.category || 'Uncategorized';
        if (!monthlyTotals[cat]) monthlyTotals[cat] = 0;
        monthlyTotals[cat] += tx.amount;
      }
    });

    const budgetKey = `budget-v2:${monthSelect}`;
    let plannedData = { custom: [] };
    try {
      const stored = localStorage.getItem(budgetKey);
      if (stored) plannedData = JSON.parse(stored) || { custom: [] };
    } catch (_) {
      plannedData = { custom: [] };
    }

    const plannedTotals = {};
    (plannedData.custom || []).forEach(item => {
      const cat = (item.category || 'Uncategorized').trim() || 'Uncategorized';
      plannedTotals[cat] = (plannedTotals[cat] || 0) + Number(item.amount || 0);
    });

    const categories = Array.from(new Set([...Object.keys(plannedTotals), ...Object.keys(monthlyTotals)]));

    return categories
      .map(name => {
        const spent = monthlyTotals[name] || 0;
        const planned = plannedTotals[name] || 0;
        const pct = planned > 0 ? (spent / planned) * 100 : 0;
        return { name, spent, planned, pct };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  };

  useEffect(() => {
    if (dailyCanvasRef.current) {
      drawGauge(dailyCanvasRef.current, state.dailySpent, state.dailyBudget);
    }
    if (monthlyCanvasRef.current) {
      drawGauge(monthlyCanvasRef.current, state.monthlySpent, state.monthlyBudget);
    }
    if (trendCanvasRef.current) {
      drawTrend(trendCanvasRef.current);
    }
  }, [state]);

  const topCategories = getTopCategories();

  return (
    <section className="tab-content active">
      <div className="insights-grid">
        <div className="insight-card">
          <h3>Daily Budget</h3>
          <canvas ref={dailyCanvasRef} id="dailyArc" width="250" height="120"></canvas>
          <p>${state.dailySpent.toFixed(2)} / ${state.dailyBudget} spent</p>
        </div>

        <div className="insight-card">
          <h3>Monthly Budget</h3>
          <canvas ref={monthlyCanvasRef} id="monthlyArc" width="250" height="120"></canvas>
          <p>${state.monthlySpent.toFixed(2)} / ${state.monthlyBudget} spent</p>
        </div>

        <div className="insight-card clickable" onClick={() => onNavigate('insights')}>
          <h3>Top Categories</h3>
          <div id="categoryBars">
            {topCategories.length === 0 ? (
              <p className="category-insight-empty">No spending recorded this month.</p>
            ) : (
              topCategories.map(data => {
                const displayPct = data.planned > 0 && Number.isFinite(data.pct) ? Math.min(data.pct, 250) : 0;
                const pctFraction = data.planned > 0 && Number.isFinite(data.pct) ? Math.min(data.pct / 100, 1) : 0;
                const color = getProgressColor(pctFraction);
                const safePct = Number.isFinite(data.pct) ? data.pct : 0;
                const status = data.planned > 0 ? `${Math.round(safePct)}% of plan` : 'No budget set';

                return (
                  <div key={data.name} className="category-item">
                    <div className="category-label">
                      <span>{data.name}</span>
                      <span>{status}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{width: `${Math.min(displayPct, 100)}%`, background: color}}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <p className="top-categories-cta">Click here to see all categories →</p>
        </div>

        <div className="insight-card">
          <h3>Past 7 Days</h3>
          <div className="trend-container">
            <canvas ref={trendCanvasRef} id="trendCanvas" width="250" height="220"></canvas>
          </div>
        </div>
      </div>

      <div className="button-row">
        <button onClick={() => onNavigate('add-transaction')} className="btn btn-primary">Add Transaction</button>
        <button onClick={() => onNavigate('add-income')} className="btn btn-primary">Add Income</button>
      </div>
    </section>
  );
};

export default Dashboard;
