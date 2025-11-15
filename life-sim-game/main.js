/**
 * Life Sim Game - Main Dashboard JavaScript
 *
 * This file contains the core game state and UI logic for the BitLife-style web game.
 * Game state is managed in memory and will be persisted to localStorage in future updates.
 */

(function() {
    'use strict';

    // ===================================
    // Game State
    // ===================================
    const gameState = {
        currentDate: "May 2nd, 2011",
        player: {
            name: "John Doe",
            age: 25,
            occupation: "Software Developer",
            location: "San Francisco, CA"
        },
        stats: {
            health: 80,
            stress: 30,
            happiness: 65
        },
        finance: {
            netWorth: 1568960.98,
            // Historical data for the net worth chart (last 12 months)
            netWorthHistory: [
                { month: 'Jun', value: 950000 },
                { month: 'Jul', value: 1020000 },
                { month: 'Aug', value: 1150000 },
                { month: 'Sep', value: 1100000 },
                { month: 'Oct', value: 1250000 },
                { month: 'Nov', value: 1320000 },
                { month: 'Dec', value: 1380000 },
                { month: 'Jan', value: 1420000 },
                { month: 'Feb', value: 1490000 },
                { month: 'Mar', value: 1530000 },
                { month: 'Apr', value: 1545000 },
                { month: 'May', value: 1568960.98 }
            ],
            // Asset allocation breakdown
            assetAllocation: {
                realEstate: 500000,
                checking: 25000,
                investments: 750000,
                crypto: 10000,
                other: 50000
            }
        },
        // Market data for stocks
        markets: {
            cash: 25000, // Available cash for trading (tied to checking)
            positions: [
                { symbol: 'ACME', shares: 50, price: 120 },
                { symbol: 'TECH', shares: 10, price: 300 },
                { symbol: 'CRYPTO_ETF', shares: 5, price: 800 }
            ],
            priceHistory: {
                ACME: [
                    { month: 'Jun', value: 95 },
                    { month: 'Jul', value: 98 },
                    { month: 'Aug', value: 102 },
                    { month: 'Sep', value: 105 },
                    { month: 'Oct', value: 110 },
                    { month: 'Nov', value: 112 },
                    { month: 'Dec', value: 115 },
                    { month: 'Jan', value: 118 },
                    { month: 'Feb', value: 116 },
                    { month: 'Mar', value: 119 },
                    { month: 'Apr', value: 121 },
                    { month: 'May', value: 120 }
                ],
                TECH: [
                    { month: 'Jun', value: 250 },
                    { month: 'Jul', value: 260 },
                    { month: 'Aug', value: 270 },
                    { month: 'Sep', value: 265 },
                    { month: 'Oct', value: 275 },
                    { month: 'Nov', value: 280 },
                    { month: 'Dec', value: 285 },
                    { month: 'Jan', value: 290 },
                    { month: 'Feb', value: 295 },
                    { month: 'Mar', value: 292 },
                    { month: 'Apr', value: 298 },
                    { month: 'May', value: 300 }
                ],
                CRYPTO_ETF: [
                    { month: 'Jun', value: 600 },
                    { month: 'Jul', value: 650 },
                    { month: 'Aug', value: 700 },
                    { month: 'Sep', value: 680 },
                    { month: 'Oct', value: 720 },
                    { month: 'Nov', value: 750 },
                    { month: 'Dec', value: 780 },
                    { month: 'Jan', value: 790 },
                    { month: 'Feb', value: 775 },
                    { month: 'Mar', value: 785 },
                    { month: 'Apr', value: 795 },
                    { month: 'May', value: 800 }
                ]
            }
        }
    };

    // TODO: Load gameState from localStorage on init
    // TODO: Save gameState to localStorage on changes
    // TODO: Implement daily tick / time progression system
    // TODO: Connect events system to modify stats and finances
    // TODO: Add more screens (career, relationships, assets, etc.)
    // TODO: Add transaction history / logs
    // TODO: Hook real market data source here

    // ===================================
    // DOM References
    // ===================================
    const DOM = {
        // Display elements
        dateDisplay: document.getElementById('dateDisplay'),
        netWorthDisplay: document.getElementById('netWorthDisplay'),
        playerName: document.getElementById('playerName'),
        playerAge: document.getElementById('playerAge'),
        playerOccupation: document.getElementById('playerOccupation'),
        playerLocation: document.getElementById('playerLocation'),

        // Stat bars
        healthBar: document.getElementById('healthBar'),
        healthValue: document.getElementById('healthValue'),
        stressBar: document.getElementById('stressBar'),
        stressValue: document.getElementById('stressValue'),
        happinessBar: document.getElementById('happinessBar'),
        happinessValue: document.getElementById('happinessValue'),

        // Interactive cards
        netWorthCard: document.getElementById('netWorthCard'),
        assetAllocationCard: document.getElementById('assetAllocationCard'),
        marketWatchCard: document.getElementById('marketWatchCard'),

        // Test controls
        randomEventBtn: document.getElementById('randomEventBtn'),

        // Charts
        netWorthChartCanvas: document.getElementById('netWorthChart'),
        marketChartCanvas: document.getElementById('marketChart'),
        pieSegments: document.getElementById('pieSegments'),
        chartLegend: document.getElementById('chartLegend'),

        // Asset allocation modal elements
        fromAccount: document.getElementById('fromAccount'),
        toAccount: document.getElementById('toAccount'),
        transferAmount: document.getElementById('transferAmount'),
        transferBtn: document.getElementById('transferBtn'),
        transferMessage: document.getElementById('transferMessage'),
        assetBalances: document.getElementById('assetBalances'),
        netWorthBreakdown: document.getElementById('netWorthBreakdown'),

        // Investing modal elements
        portfolioValue: document.getElementById('portfolioValue'),
        availableCash: document.getElementById('availableCash'),
        positionsTableBody: document.getElementById('positionsTableBody'),
        stockSymbol: document.getElementById('stockSymbol'),
        shareAmount: document.getElementById('shareAmount'),
        buyBtn: document.getElementById('buyBtn'),
        sellBtn: document.getElementById('sellBtn'),
        tradingMessage: document.getElementById('tradingMessage')
    };

    // ===================================
    // UI Initialization
    // ===================================
    function initUI() {
        // Update date
        DOM.dateDisplay.textContent = gameState.currentDate;

        // Update player info
        DOM.playerName.textContent = gameState.player.name;
        DOM.playerAge.textContent = gameState.player.age;
        DOM.playerOccupation.textContent = gameState.player.occupation;
        DOM.playerLocation.textContent = gameState.player.location;

        // Sync markets cash with checking account
        gameState.markets.cash = gameState.finance.assetAllocation.checking;

        // Calculate net worth from all sources
        recalculateNetWorth();

        // Update displays
        updateNetWorthDisplay();
        updateStatsUI();

        // Initialize charts
        initNetWorthChart();
        initAssetAllocationChart();
        initMarketCharts();
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function updateNetWorthDisplay() {
        DOM.netWorthDisplay.textContent = `Net Worth: ${formatCurrency(gameState.finance.netWorth)}`;
    }

    // ===================================
    // Net Worth Calculation
    // ===================================
    function recalculateNetWorth() {
        // Sum all assets
        let total = 0;

        // Add asset allocation categories
        for (const key in gameState.finance.assetAllocation) {
            total += gameState.finance.assetAllocation[key];
        }

        // Add market positions at current prices
        gameState.markets.positions.forEach(position => {
            total += position.shares * position.price;
        });

        gameState.finance.netWorth = total;

        // Update net worth history (replace the last entry with current)
        if (gameState.finance.netWorthHistory.length > 0) {
            gameState.finance.netWorthHistory[gameState.finance.netWorthHistory.length - 1].value = total;
        }
    }

    // ===================================
    // Stat Updates
    // ===================================
    function updateStatsUI() {
        // Health
        DOM.healthBar.style.width = `${gameState.stats.health}%`;
        DOM.healthValue.textContent = `${gameState.stats.health}%`;
        DOM.healthBar.classList.add('stat-changing');

        // Stress
        DOM.stressBar.style.width = `${gameState.stats.stress}%`;
        DOM.stressValue.textContent = `${gameState.stats.stress}%`;
        DOM.stressBar.classList.add('stat-changing');

        // Happiness
        DOM.happinessBar.style.width = `${gameState.stats.happiness}%`;
        DOM.happinessValue.textContent = `${gameState.stats.happiness}%`;
        DOM.happinessBar.classList.add('stat-changing');

        // Remove animation class after animation completes
        setTimeout(() => {
            DOM.healthBar.classList.remove('stat-changing');
            DOM.stressBar.classList.remove('stat-changing');
            DOM.happinessBar.classList.remove('stat-changing');
        }, 500);
    }

    function clampStat(value) {
        return Math.max(0, Math.min(100, value));
    }

    // ===================================
    // Demo Interactions
    // ===================================
    function triggerRandomEvent() {
        // Randomly adjust each stat by -15 to +15
        const healthChange = Math.floor(Math.random() * 31) - 15;
        const stressChange = Math.floor(Math.random() * 31) - 15;
        const happinessChange = Math.floor(Math.random() * 31) - 15;

        gameState.stats.health = clampStat(gameState.stats.health + healthChange);
        gameState.stats.stress = clampStat(gameState.stats.stress + stressChange);
        gameState.stats.happiness = clampStat(gameState.stats.happiness + happinessChange);

        updateStatsUI();

        // Log the event (for debugging)
        console.log('Random Event Triggered:', {
            health: healthChange > 0 ? `+${healthChange}` : healthChange,
            stress: stressChange > 0 ? `+${stressChange}` : stressChange,
            happiness: happinessChange > 0 ? `+${happinessChange}` : happinessChange
        });
    }

    // ===================================
    // Net Worth Line Chart
    // ===================================
    let netWorthChart = null;

    function initNetWorthChart() {
        if (!DOM.netWorthChartCanvas || !window.Chart) {
            console.warn('Chart.js not loaded or canvas not found');
            return;
        }

        const ctx = DOM.netWorthChartCanvas.getContext('2d');

        netWorthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: gameState.finance.netWorthHistory.map(item => item.month),
                datasets: [{
                    label: 'Net Worth',
                    data: gameState.finance.netWorthHistory.map(item => item.value),
                    borderColor: '#4ade80',
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointBackgroundColor: '#4ade80',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(42, 42, 42, 0.95)',
                        titleColor: '#4ade80',
                        bodyColor: '#fff',
                        borderColor: '#4ade80',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a8d8ea',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a8d8ea',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    function updateNetWorthChart() {
        if (netWorthChart) {
            netWorthChart.data.datasets[0].data = gameState.finance.netWorthHistory.map(item => item.value);
            netWorthChart.update();
        }
    }

    // ===================================
    // Asset Allocation UI and Transfers
    // ===================================
    const ASSET_LABELS = {
        realEstate: 'Real Estate',
        checking: 'Checking Account',
        investments: 'Investments',
        crypto: 'Crypto',
        other: 'Other Assets'
    };

    const ASSET_COLORS = {
        realEstate: '#3b82f6',
        checking: '#22c55e',
        investments: '#f59e0b',
        crypto: '#ec4899',
        other: '#8b5cf6'
    };

    function initAssetAllocationChart() {
        updateAssetAllocationUI();
    }

    function updateAssetAllocationUI() {
        const allocation = gameState.finance.assetAllocation;
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);

        // Create segments for pie chart
        const segments = [];
        for (const key in allocation) {
            if (allocation[key] > 0) {
                segments.push({
                    label: ASSET_LABELS[key],
                    value: allocation[key],
                    percentage: (allocation[key] / total) * 100,
                    color: ASSET_COLORS[key]
                });
            }
        }

        // Draw pie chart
        drawPieChart(segments);

        // Update balances in modal
        updateAssetBalancesDisplay();
    }

    function drawPieChart(segments) {
        if (!DOM.pieSegments || !DOM.chartLegend) return;

        const total = segments.reduce((sum, seg) => sum + seg.value, 0);
        let currentAngle = -90; // Start at top

        // Clear existing
        DOM.pieSegments.innerHTML = '';
        DOM.chartLegend.innerHTML = '';

        segments.forEach(segment => {
            const percentage = segment.value / total;
            const angle = percentage * 360;

            // Create pie slice
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
                `Z`
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', segment.color);
            path.setAttribute('stroke', '#2a2a2a');
            path.setAttribute('stroke-width', '2');

            DOM.pieSegments.appendChild(path);

            // Create legend
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${segment.color}"></div>
                <span>${segment.label}: ${segment.percentage.toFixed(1)}%</span>
            `;
            DOM.chartLegend.appendChild(legendItem);

            currentAngle = endAngle;
        });
    }

    function updateAssetBalancesDisplay() {
        if (!DOM.assetBalances) return;

        DOM.assetBalances.innerHTML = '';

        for (const key in gameState.finance.assetAllocation) {
            const item = document.createElement('div');
            item.className = 'balance-item';
            item.innerHTML = `
                <span class="balance-label">${ASSET_LABELS[key]}:</span>
                <span class="balance-value">${formatCurrency(gameState.finance.assetAllocation[key])}</span>
            `;
            DOM.assetBalances.appendChild(item);
        }
    }

    function updateNetWorthBreakdown() {
        if (!DOM.netWorthBreakdown) return;

        DOM.netWorthBreakdown.innerHTML = '';

        // Add asset allocation
        for (const key in gameState.finance.assetAllocation) {
            const item = document.createElement('div');
            item.className = 'balance-item';
            item.innerHTML = `
                <span class="balance-label">${ASSET_LABELS[key]}:</span>
                <span class="balance-value">${formatCurrency(gameState.finance.assetAllocation[key])}</span>
            `;
            DOM.netWorthBreakdown.appendChild(item);
        }

        // Add market positions
        const marketValue = gameState.markets.positions.reduce((sum, pos) => sum + (pos.shares * pos.price), 0);
        if (marketValue > 0) {
            const item = document.createElement('div');
            item.className = 'balance-item';
            item.innerHTML = `
                <span class="balance-label">Stock Portfolio:</span>
                <span class="balance-value">${formatCurrency(marketValue)}</span>
            `;
            DOM.netWorthBreakdown.appendChild(item);
        }

        // Add total
        const totalItem = document.createElement('div');
        totalItem.className = 'balance-item';
        totalItem.style.borderTop = '2px solid rgba(74, 222, 128, 0.3)';
        totalItem.style.marginTop = '8px';
        totalItem.style.paddingTop = '8px';
        totalItem.innerHTML = `
            <span class="balance-label" style="font-weight: 700;">Total Net Worth:</span>
            <span class="balance-value" style="font-size: 18px;">${formatCurrency(gameState.finance.netWorth)}</span>
        `;
        DOM.netWorthBreakdown.appendChild(totalItem);
    }

    function transferFunds(fromKey, toKey, amount) {
        // Validate
        if (!gameState.finance.assetAllocation.hasOwnProperty(fromKey)) {
            return { success: false, message: 'Invalid source account.' };
        }
        if (!gameState.finance.assetAllocation.hasOwnProperty(toKey)) {
            return { success: false, message: 'Invalid destination account.' };
        }
        if (fromKey === toKey) {
            return { success: false, message: 'Source and destination must be different.' };
        }
        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than zero.' };
        }
        if (gameState.finance.assetAllocation[fromKey] < amount) {
            return { success: false, message: 'Insufficient funds in source account.' };
        }

        // Perform transfer
        gameState.finance.assetAllocation[fromKey] -= amount;
        gameState.finance.assetAllocation[toKey] += amount;

        // Sync checking with markets cash
        gameState.markets.cash = gameState.finance.assetAllocation.checking;

        // Recalculate net worth
        recalculateNetWorth();

        return {
            success: true,
            message: `Transferred ${formatCurrency(amount)} from ${ASSET_LABELS[fromKey]} to ${ASSET_LABELS[toKey]}.`
        };
    }

    // ===================================
    // Market Charts and Investing Menu
    // ===================================
    let marketChart = null;

    function initMarketCharts() {
        if (!DOM.marketChartCanvas || !window.Chart) {
            console.warn('Chart.js not loaded or market chart canvas not found');
            return;
        }

        const ctx = DOM.marketChartCanvas.getContext('2d');

        const datasets = [];
        const colors = ['#3b82f6', '#22c55e', '#ec4899'];
        let i = 0;

        for (const symbol in gameState.markets.priceHistory) {
            datasets.push({
                label: symbol,
                data: gameState.markets.priceHistory[symbol].map(item => item.value),
                borderColor: colors[i % colors.length],
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2
            });
            i++;
        }

        marketChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: gameState.markets.priceHistory['ACME'].map(item => item.month),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#a8d8ea',
                            font: {
                                size: 11
                            },
                            boxWidth: 12,
                            padding: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(42, 42, 42, 0.95)',
                        titleColor: '#4ade80',
                        bodyColor: '#fff',
                        borderColor: '#4ade80',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a8d8ea',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a8d8ea',
                            font: {
                                size: 10
                            },
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    function updateMarketCharts() {
        if (marketChart) {
            marketChart.update();
        }
    }

    function getStockPrice(symbol) {
        const position = gameState.markets.positions.find(p => p.symbol === symbol);
        return position ? position.price : 0;
    }

    function updatePortfolioDisplay() {
        if (!DOM.positionsTableBody) return;

        // Clear table
        DOM.positionsTableBody.innerHTML = '';

        let totalValue = 0;

        // Add rows for each position
        gameState.markets.positions.forEach(position => {
            const value = position.shares * position.price;
            totalValue += value;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${position.symbol}</td>
                <td>${position.shares}</td>
                <td>${formatCurrency(position.price)}</td>
                <td>${formatCurrency(value)}</td>
            `;
            DOM.positionsTableBody.appendChild(row);
        });

        // Update summary
        if (DOM.portfolioValue) {
            DOM.portfolioValue.textContent = formatCurrency(totalValue);
        }
        if (DOM.availableCash) {
            DOM.availableCash.textContent = formatCurrency(gameState.markets.cash);
        }
    }

    function buyStock(symbol, shares) {
        const price = getStockPrice(symbol);

        if (price === 0) {
            return { success: false, message: 'Invalid stock symbol.' };
        }

        if (shares <= 0) {
            return { success: false, message: 'Number of shares must be greater than zero.' };
        }

        const cost = price * shares;

        if (gameState.markets.cash < cost) {
            return { success: false, message: `Insufficient cash. Need ${formatCurrency(cost)}, have ${formatCurrency(gameState.markets.cash)}.` };
        }

        // Deduct cash
        gameState.markets.cash -= cost;
        gameState.finance.assetAllocation.checking = gameState.markets.cash;

        // Add shares
        const position = gameState.markets.positions.find(p => p.symbol === symbol);
        if (position) {
            position.shares += shares;
        }

        // Recalculate net worth
        recalculateNetWorth();

        return {
            success: true,
            message: `Bought ${shares} shares of ${symbol} for ${formatCurrency(cost)}.`
        };
    }

    function sellStock(symbol, shares) {
        const price = getStockPrice(symbol);

        if (price === 0) {
            return { success: false, message: 'Invalid stock symbol.' };
        }

        if (shares <= 0) {
            return { success: false, message: 'Number of shares must be greater than zero.' };
        }

        const position = gameState.markets.positions.find(p => p.symbol === symbol);
        if (!position || position.shares < shares) {
            return { success: false, message: `Insufficient shares. You only have ${position ? position.shares : 0} shares of ${symbol}.` };
        }

        const proceeds = price * shares;

        // Add cash
        gameState.markets.cash += proceeds;
        gameState.finance.assetAllocation.checking = gameState.markets.cash;

        // Remove shares
        position.shares -= shares;

        // Recalculate net worth
        recalculateNetWorth();

        return {
            success: true,
            message: `Sold ${shares} shares of ${symbol} for ${formatCurrency(proceeds)}.`
        };
    }

    // ===================================
    // Modal Handling
    // ===================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Update modal content when opening
            if (modalId === 'assetAllocationModal') {
                updateAssetBalancesDisplay();
            } else if (modalId === 'investingModal') {
                updatePortfolioDisplay();
            } else if (modalId === 'netWorthModal') {
                updateNetWorthBreakdown();
            }
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function initModalHandlers() {
        // Add click handlers to all cards with data-modal attribute
        const interactiveCards = document.querySelectorAll('[data-modal]');
        interactiveCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const modalId = card.getAttribute('data-modal');
                openModal(modalId);
            });
        });

        // Add click handlers to all modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });

        // Add click handlers to modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = backdrop.closest('.modal');
                closeModal(modal);
            });
        });

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    // ===================================
    // Event Listeners
    // ===================================
    function initEventListeners() {
        // Random Event button
        DOM.randomEventBtn.addEventListener('click', triggerRandomEvent);

        // Transfer funds button
        if (DOM.transferBtn) {
            DOM.transferBtn.addEventListener('click', handleTransfer);
        }

        // Buy/Sell stock buttons
        if (DOM.buyBtn) {
            DOM.buyBtn.addEventListener('click', handleBuy);
        }
        if (DOM.sellBtn) {
            DOM.sellBtn.addEventListener('click', handleSell);
        }

        // Initialize modal handlers
        initModalHandlers();
    }

    function handleTransfer() {
        const fromKey = DOM.fromAccount.value;
        const toKey = DOM.toAccount.value;
        const amount = parseFloat(DOM.transferAmount.value);

        const result = transferFunds(fromKey, toKey, amount);

        // Show message
        DOM.transferMessage.textContent = result.message;
        DOM.transferMessage.className = 'transfer-message ' + (result.success ? 'success' : 'error');

        if (result.success) {
            // Clear input
            DOM.transferAmount.value = '';

            // Update UI
            updateAssetAllocationUI();
            updateNetWorthDisplay();
            updateNetWorthChart();

            // Hide message after 3 seconds
            setTimeout(() => {
                DOM.transferMessage.className = 'transfer-message';
            }, 3000);
        }
    }

    function handleBuy() {
        const symbol = DOM.stockSymbol.value;
        const shares = parseInt(DOM.shareAmount.value);

        const result = buyStock(symbol, shares);

        // Show message
        DOM.tradingMessage.textContent = result.message;
        DOM.tradingMessage.className = 'trading-message ' + (result.success ? 'success' : 'error');

        if (result.success) {
            // Clear input
            DOM.shareAmount.value = '';

            // Update UI
            updatePortfolioDisplay();
            updateAssetAllocationUI();
            updateNetWorthDisplay();
            updateNetWorthChart();

            // Hide message after 3 seconds
            setTimeout(() => {
                DOM.tradingMessage.className = 'trading-message';
            }, 3000);
        }
    }

    function handleSell() {
        const symbol = DOM.stockSymbol.value;
        const shares = parseInt(DOM.shareAmount.value);

        const result = sellStock(symbol, shares);

        // Show message
        DOM.tradingMessage.textContent = result.message;
        DOM.tradingMessage.className = 'trading-message ' + (result.success ? 'success' : 'error');

        if (result.success) {
            // Clear input
            DOM.shareAmount.value = '';

            // Update UI
            updatePortfolioDisplay();
            updateAssetAllocationUI();
            updateNetWorthDisplay();
            updateNetWorthChart();

            // Hide message after 3 seconds
            setTimeout(() => {
                DOM.tradingMessage.className = 'trading-message';
            }, 3000);
        }
    }

    // ===================================
    // Initialization
    // ===================================
    function init() {
        console.log('Life Sim Game Initializing...');
        console.log('Game State:', gameState);

        initUI();
        initEventListeners();

        console.log('Life Sim Game Ready!');
        console.log('TODO: Implement daily tick / time progression');
        console.log('TODO: Implement localStorage save/load');
        console.log('TODO: Connect events system');
        console.log('TODO: Add more game screens');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose gameState to window for debugging (remove in production)
    window.gameState = gameState;
    window.updateStatsUI = updateStatsUI;
    window.recalculateNetWorth = recalculateNetWorth;

})();
