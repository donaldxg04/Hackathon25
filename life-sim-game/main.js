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
            ]
        },
        lifeBalance: {
            work: 65,
            social: 45,
            growth: 70,
            recreation: 55
        }
    };

    // TODO: Load gameState from localStorage on init
    // TODO: Save gameState to localStorage on changes
    // TODO: Implement daily tick / time progression system
    // TODO: Connect events system to modify stats and finances
    // TODO: Add more screens (career, relationships, assets, etc.)

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
        lifeBalanceCard: document.getElementById('lifeBalanceCard'),
        financeChartsCard: document.getElementById('financeChartsCard'),

        // Test controls
        randomEventBtn: document.getElementById('randomEventBtn'),

        // Charts
        netWorthChartCanvas: document.getElementById('netWorthChart'),
        pieSegments: document.getElementById('pieSegments'),
        chartLegend: document.getElementById('chartLegend')
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

        // Update net worth display
        updateNetWorthDisplay();

        // Update stat bars
        updateStatsUI();

        // Initialize charts
        initNetWorthChart();
        initLifeBalanceChart();
    }

    function updateNetWorthDisplay() {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(gameState.finance.netWorth);

        DOM.netWorthDisplay.textContent = `Net Worth: ${formatted}`;
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
                                return new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0
                                }).format(context.parsed.y);
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

    // ===================================
    // Life Balance Circular Chart
    // ===================================
    function initLifeBalanceChart() {
        const segments = [
            { label: 'Work', value: gameState.lifeBalance.work, color: '#3b82f6' },
            { label: 'Social', value: gameState.lifeBalance.social, color: '#f59e0b' },
            { label: 'Growth', value: gameState.lifeBalance.growth, color: '#22c55e' },
            { label: 'Recreation', value: gameState.lifeBalance.recreation, color: '#ec4899' }
        ];

        const total = segments.reduce((sum, seg) => sum + seg.value, 0);
        let currentAngle = -90; // Start at top

        // Clear existing segments
        DOM.pieSegments.innerHTML = '';
        DOM.chartLegend.innerHTML = '';

        segments.forEach(segment => {
            const percentage = segment.value / total;
            const angle = percentage * 360;

            // Create pie slice using path
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

            // Create legend item
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${segment.color}"></div>
                <span>${segment.label} (${segment.value}%)</span>
            `;
            DOM.chartLegend.appendChild(legendItem);

            currentAngle = endAngle;
        });
    }

    // ===================================
    // Modal Handling
    // ===================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
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

        // Initialize modal handlers
        initModalHandlers();
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

})();
