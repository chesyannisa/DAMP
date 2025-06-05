// Data Management
class MoneyTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.categories = {
            income: [
                { name: "Gaji", color: "#ec4899" },
                { name: "Freelance", color: "#f472b6" },
                { name: "Investasi", color: "#f9a8d4" }
            ],
            expense: [
                { name: "Makanan", color: "#be185d" },
                { name: "Transportasi", color: "#9d174d" },
                { name: "Belanja", color: "#831843" },
                { name: "Hiburan", color: "#be123c" },
                { name: "Kesehatan", color: "#e11d48" },
                { name: "Pendidikan", color: "#f43f5e" }
            ]
        };
        this.currentView = 'dashboard';
        this.currentTransactionType = 'expense';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCategories();
        this.setCurrentDate();
        this.updateDashboard();
        this.updateReports();
        
        // Add some sample data if no transactions exist
        if (this.transactions.length === 0) {
            this.addSampleData();
        }
    }

    addSampleData() {
        const sampleTransactions = [
            {
                id: Date.now() + 1,
                type: 'income',
                amount: 5000000,
                category: 'Gaji',
                description: 'Gaji bulan ini',
                date: new Date().toISOString().split('T')[0],
                attachment: ''
            },
            {
                id: Date.now() + 2,
                type: 'expense',
                amount: 150000,
                category: 'Makanan',
                description: 'Makan siang',
                date: new Date().toISOString().split('T')[0],
                attachment: ''
            },
            {
                id: Date.now() + 3,
                type: 'expense',
                amount: 50000,
                category: 'Transportasi',
                description: 'Bensin motor',
                date: new Date().toISOString().split('T')[0],
                attachment: ''
            },
            {
                id: Date.now() + 4,
                type: 'expense',
                amount: 100000,
                category: 'Hiburan',
                description: 'Nonton film',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                attachment: ''
            },
            {
                id: Date.now() + 5,
                type: 'income',
                amount: 1000000,
                category: 'Freelance',
                description: 'Proyek desain website',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                attachment: ''
            }
        ];
        
        this.transactions = sampleTransactions;
        this.saveTransactions();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.getElementById('openSidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('open');
            document.getElementById('overlay').classList.add('active');
        });

        document.getElementById('closeSidebar').addEventListener('click', () => {
            this.closeSidebar();
        });

        document.getElementById('overlay').addEventListener('click', () => {
            this.closeSidebar();
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
                this.closeSidebar();
            });
        });

        // Transaction type buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.currentTarget.dataset.type;
                this.switchTransactionType(type);
            });
        });

        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Amount input formatting
        document.getElementById('amount').addEventListener('input', (e) => {
            this.formatAmountInput(e.target);
        });
        
        // Reset data button
        document.getElementById("resetData").addEventListener("click", () => {
            if (confirm("Apakah Anda yakin ingin menghapus semua data transaksi?")) {
                localStorage.removeItem("moneyTrackerTransactions");
                this.transactions = [];
                this.updateDashboard();
                this.updateReports();
                alert("Semua data transaksi berhasil direset.");
            }
        });
    }

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        this.currentView = view;

        // Update data based on view
        if (view === 'dashboard') {
            this.updateDashboard();
        } else if (view === 'reports') {
            this.updateReports();
        }
    }

    switchTransactionType(type) {
        this.currentTransactionType = type;
        
        // Update button states
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        // Update categories
        this.populateCategories();
    }

    populateCategories() {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Pilih kategori</option>';
        
        this.categories[this.currentTransactionType].forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    formatAmountInput(input) {
        let value = input.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('id-ID');
        }
        input.value = value;
    }

    addTransaction() {
        const form = document.getElementById('transactionForm');
        const formData = new FormData(form);
        
        const amount = document.getElementById('amount').value.replace(/\D/g, '');
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const attachment = document.getElementById('attachment').value;

        if (!amount || !category || !description) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        const transaction = {
            id: Date.now(),
            type: this.currentTransactionType,
            amount: parseInt(amount),
            category: category,
            description: description,
            date: date,
            attachment: attachment
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        
        // Reset form
        form.reset();
        this.setCurrentDate();
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-type="expense"]').classList.add('active');
        this.currentTransactionType = 'expense';
        this.populateCategories();

        // Update displays
        this.updateDashboard();
        this.updateReports();

        alert('Transaksi berhasil ditambahkan!');
    }

    updateDashboard() {
        const stats = this.calculateStats();
        
        // Update stat cards
        document.getElementById('totalBalance').textContent = this.formatCurrency(stats.balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(stats.totalIncome);
        document.getElementById('totalExpense').textContent = this.formatCurrency(stats.totalExpense);
        document.getElementById('savingRatio').textContent = `${stats.savingRatio}%`;
        
        document.getElementById('balanceStatus').textContent = stats.balance >= 0 ? 'Keuangan sehat' : 'Perlu perhatian';
        document.getElementById('incomeCount').textContent = `${stats.incomeCount} transaksi`;
        document.getElementById('expenseCount').textContent = `${stats.expenseCount} transaksi`;

        // Update recent transactions
        this.updateRecentTransactions();
        
        // Update charts
        this.updateDashboardCharts();
    }

    updateReports() {
        const stats = this.calculateStats();
        
        // Update report stats
        document.getElementById('reportIncome').textContent = this.formatCurrency(stats.totalIncome);
        document.getElementById('reportExpense').textContent = this.formatCurrency(stats.totalExpense);
        document.getElementById('reportBalance').textContent = this.formatCurrency(stats.balance);
        document.getElementById('reportRatio').textContent = `${stats.expenseRatio}%`;
        
        document.getElementById('reportIncomeCount').textContent = `${stats.incomeCount} transaksi`;
        document.getElementById('reportExpenseCount').textContent = `${stats.expenseCount} transaksi`;
        document.getElementById('reportBalanceStatus').textContent = stats.balance >= 0 ? 'Surplus' : 'Defisit';

        // Update charts
        this.updateExpensePieChart();
        this.updateTrendChart();
        
        // Update recent transactions
        this.updateRecentTransactions();
    }

    calculateStats() {
        const incomeTransactions = this.transactions.filter(t => t.type === 'income');
        const expenseTransactions = this.transactions.filter(t => t.type === 'expense');
        
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        
        const savingRatio = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
        const expenseRatio = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

        return {
            totalIncome,
            totalExpense,
            balance,
            savingRatio,
            expenseRatio,
            incomeCount: incomeTransactions.length,
            expenseCount: expenseTransactions.length
        };
    }

    updateRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        const recentTransactions = this.transactions.slice(0, 5);
        
        container.innerHTML = '';
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state">Belum ada transaksi. Mulai tambahkan transaksi Anda!</div>';
            return;
        }
        
        recentTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            
            item.innerHTML = `
                <div class="transaction-left">
                    <div class="transaction-indicator ${transaction.type}"></div>
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.category}</p>
                    </div>
                </div>
                <div class="transaction-right">
                    <p class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </p>
                    <p class="transaction-date">${this.formatDate(transaction.date)}</p>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    updateDashboardCharts() {
        this.updateExpensePieChart();
        this.updateTrendChart();
    }

    // Updated function to create a pie chart for expense categories
    updateExpensePieChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        if (window.expenseChart) {
            window.expenseChart.destroy();
        }
        
        const expenseData = this.getExpenseByCategory();
        
        if (expenseData.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Tidak ada data pengeluaran', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Animation configuration
        const animationOptions = {
            animateRotate: true,
            animateScale: true
        };
        
        window.expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: expenseData.map(item => item.category),
                datasets: [{
                    data: expenseData.map(item => item.amount),
                    backgroundColor: expenseData.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: animationOptions,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(1);
                                const formattedValue = new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(value);
                                return `${context.label}: ${formattedValue} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Updated function to ensure the trend chart displays income vs expense data correctly
    updateTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        if (window.trendChart) {
            window.trendChart.destroy();
        }
        
        const weeklyData = this.getWeeklyData();
        
        window.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.map(item => item.day),
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: weeklyData.map(item => item.income),
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#ec4899',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Pengeluaran',
                        data: weeklyData.map(item => item.expense),
                        borderColor: '#be185d',
                        backgroundColor: 'rgba(190, 24, 93, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#be185d',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw;
                                const formattedValue = new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(value * 1000); // Convert back from thousands
                                return `${label}: ${formattedValue}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(236, 72, 153, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + value + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    getExpenseByCategory() {
        const expenseTransactions = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        
        expenseTransactions.forEach(transaction => {
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        });
        
        return Object.entries(categoryTotals)
            .map(([category, amount]) => {
                const categoryData = this.categories.expense.find(c => c.name === category);
                return {
                    category,
                    amount,
                    color: categoryData ? categoryData.color : '#be185d'
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }

    getIncomeByCategory() {
        const incomeTransactions = this.transactions.filter(t => t.type === 'income');
        const categoryTotals = {};
        
        incomeTransactions.forEach(transaction => {
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        });
        
        return Object.entries(categoryTotals)
            .map(([category, amount]) => {
                const categoryData = this.categories.income.find(c => c.name === category);
                return {
                    category,
                    amount,
                    color: categoryData ? categoryData.color : '#ec4899'
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }

    getWeeklyData() {
        const weeklyData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            const dayTransactions = this.transactions.filter(t => t.date === dateString);
            const income = dayTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0) / 1000;
            const expense = dayTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0) / 1000;
            
            weeklyData.push({
                day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                income,
                expense
            });
        }
        
        return weeklyData;
    }

    getCategoryReport() {
        const allCategories = [...this.categories.income, ...this.categories.expense];
        const stats = this.calculateStats();
        
        return allCategories
            .map(category => {
                const categoryTransactions = this.transactions.filter(t => t.category === category.name);
                const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                const count = categoryTransactions.length;
                const average = count > 0 ? total / count : 0;
                
                if (total === 0) return null;
                
                const type = this.categories.income.find(c => c.name === category.name) ? 'income' : 'expense';
                const totalForType = type === 'income' ? stats.totalIncome : stats.totalExpense;
                const percentage = totalForType > 0 ? ((total / totalForType) * 100).toFixed(1) : '0';
                
                return {
                    category: category.name,
                    type,
                    color: category.color,
                    total,
                    count,
                    average,
                    percentage
                };
            })
            .filter(item => item !== null)
            .sort((a, b) => b.total - a.total);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    loadTransactions() {
        const stored = localStorage.getItem('moneyTrackerTransactions');
        return stored ? JSON.parse(stored) : [];
    }

    saveTransactions() {
        localStorage.setItem('moneyTrackerTransactions', JSON.stringify(this.transactions));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moneyTracker = new MoneyTracker();
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.moneyTracker) {
        setTimeout(() => {
            if (window.moneyTracker.currentView === 'dashboard') {
                window.moneyTracker.updateDashboardCharts();
            } else if (window.moneyTracker.currentView === 'reports') {
                window.moneyTracker.updateExpensePieChart();
                window.moneyTracker.updateTrendChart();
            }
        }, 100);
    }
});