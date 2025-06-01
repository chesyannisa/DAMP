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

        document.getElementById("resetData").addEventListener("click", () => {
  localStorage.removeItem("transactions");
  tracker.transactions = [];
  tracker.updateDashboard();
  tracker.updateReports();

  document.getElementById("resetData").addEventListener("click", () => {
  transactions.length = 0;
  updateUI();
});

document.getElementById("resetData").addEventListener("click", () => {
  localStorage.removeItem("transactions");
  transactions.length = 0;
  updateUI();

  alert("Semua data transaksi berhasil direset.");
});


});

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

        // Update pie charts
        this.updatePieCharts();
        
        // Update category report table
        this.updateCategoryReportTable();
        
        // Update financial insights
        this.updateFinancialInsights();
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
        this.updateExpenseBarChart();
        this.updateTrendChart();
    }

    updateExpenseBarChart() {
        const canvas = document.getElementById('expenseChart');
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        if (window.expenseChart) {
            window.expenseChart.destroy();
        }
        
        const expenseByCategory = this.getExpenseByCategory();
        
        window.expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: expenseByCategory.map(item => item.category),
                datasets: [{
                    label: 'Pengeluaran',
                    data: expenseByCategory.map(item => item.amount),
                    backgroundColor: '#ec4899',
                    borderColor: '#be185d',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + (value / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    updateTrendChart() {
        const canvas = document.getElementById('trendChart');
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
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Pengeluaran',
                        data: weeklyData.map(item => item.expense),
                        borderColor: '#be185d',
                        backgroundColor: 'rgba(190, 24, 93, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
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

    updatePieCharts() {
        this.updateExpensePieChart();
        this.updateIncomePieChart();
    }

    updateExpensePieChart() {
        const canvas = document.getElementById('expensePieChart');
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        if (window.expensePieChart) {
            window.expensePieChart.destroy();
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
        
        window.expensePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: expenseData.map(item => item.category),
                datasets: [{
                    data: expenseData.map(item => item.amount),
                    backgroundColor: expenseData.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateIncomePieChart() {
        const canvas = document.getElementById('incomePieChart');
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        if (window.incomePieChart) {
            window.incomePieChart.destroy();
        }
        
        const incomeData = this.getIncomeByCategory();
        
        if (incomeData.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Tidak ada data pemasukan', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        window.incomePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: incomeData.map(item => item.category),
                datasets: [{
                    data: incomeData.map(item => item.amount),
                    backgroundColor: incomeData.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateCategoryReportTable() {
        const tbody = document.getElementById('categoryReportTable');
        const categoryReport = this.getCategoryReport();
        
        tbody.innerHTML = '';
        
        categoryReport.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="category-indicator">
                        <div class="category-color" style="background-color: ${item.color}"></div>
                        <span>${item.category}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge ${item.type}">
                        ${item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                </td>
                <td style="text-align: right; font-weight: 600;">${this.formatCurrency(item.total)}</td>
                <td style="text-align: right;">${item.count}</td>
                <td style="text-align: right;">${this.formatCurrency(item.average)}</td>
                <td style="text-align: right;">
                    <span class="percentage-badge">${item.percentage}%</span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateFinancialInsights() {
        const container = document.getElementById('financialInsights');
        const stats = this.calculateStats();
        const expenseData = this.getExpenseByCategory();
        
        container.innerHTML = '';
        
        // Balance insight
        const balanceInsight = document.createElement('div');
        balanceInsight.className = `insight-card ${stats.balance >= 0 ? 'success' : 'danger'}`;
        balanceInsight.innerHTML = `
            <h4>${stats.balance >= 0 ? '✅ Keuangan Sehat' : '⚠️ Perlu Perhatian'}</h4>
            <p>
                ${stats.balance >= 0 
                    ? `Anda memiliki surplus sebesar ${this.formatCurrency(stats.balance)}. Pertahankan pola ini dan pertimbangkan untuk menabung atau berinvestasi.`
                    : `Anda mengalami defisit sebesar ${this.formatCurrency(Math.abs(stats.balance))}. Pertimbangkan untuk mengurangi pengeluaran atau meningkatkan pemasukan.`
                }
            </p>
        `;
        container.appendChild(balanceInsight);
        
        // Top spending category
        if (expenseData.length > 0) {
            const topSpendingInsight = document.createElement('div');
            topSpendingInsight.className = 'insight-card warning';
            const topCategory = expenseData[0];
            const percentage = ((topCategory.amount / stats.totalExpense) * 100).toFixed(1);
            
            topSpendingInsight.innerHTML = `
                <h4>📊 Kategori Pengeluaran Terbesar</h4>
                <p>
                    ${topCategory.category} adalah kategori pengeluaran terbesar Anda (${percentage}% dari total pengeluaran). 
                    Pertimbangkan untuk mengoptimalkan pengeluaran di kategori ini.
                </p>
            `;
            container.appendChild(topSpendingInsight);
        }
        
        // Savings rate insight
        const savingsInsight = document.createElement('div');
        savingsInsight.className = 'insight-card warning';
        savingsInsight.innerHTML = `
            <h4>💰 Tingkat Tabungan</h4>
            <p>
                Tingkat tabungan Anda saat ini adalah ${stats.savingRatio}%. 
                ${stats.savingRatio >= 20 
                    ? 'Excellent! Anda sudah menabung dengan baik.' 
                    : 'Cobalah untuk menabung minimal 20% dari pemasukan.'
                }
            </p>
        `;
        container.appendChild(savingsInsight);
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
                window.moneyTracker.updatePieCharts();
            }
        }, 100);
    }
});