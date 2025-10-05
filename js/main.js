// Profit Tracker Dashboard - Main Page

class ProfitTracker {
    constructor() {
        this.currentDate = new Date();
        this.savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentMonthDisplay();
        this.renderProfitChart();
        this.updateSummaryCards();
        this.renderInvoiceList();
        this.checkForSuccessMessage();
    }

    setupEventListeners() {
        // Month navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateCurrentMonthDisplay();
            this.renderProfitChart();
            this.updateSummaryCards();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateCurrentMonthDisplay();
            this.renderProfitChart();
            this.updateSummaryCards();
        });

        // Invoice list controls
        document.getElementById('invoice-search').addEventListener('input', (e) => {
            this.filterInvoices();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.filterInvoices();
        });

        document.getElementById('sort-by').addEventListener('change', () => {
            this.renderInvoiceList();
        });

        // Client tracker button
        document.getElementById('client-tracker-btn').addEventListener('click', () => {
            this.openClientTracker();
        });

        // Client tracker modal events
        document.getElementById('close-client-tracker').addEventListener('click', () => {
            this.closeClientTracker();
        });

        // Client tracker filters
        document.getElementById('client-search').addEventListener('input', () => {
            this.filterClients();
        });

        document.getElementById('warmth-filter').addEventListener('change', () => {
            this.filterClients();
        });

        document.getElementById('status-filter-clients').addEventListener('change', () => {
            this.filterClients();
        });

        // Profit tracker button
        document.getElementById('profit-tracker-btn').addEventListener('click', () => {
            this.openProfitTracker();
        });

        // Profit tracker modal events
        document.getElementById('close-profit-tracker').addEventListener('click', () => {
            this.closeProfitTracker();
        });

        // Date selector events
        document.getElementById('today-btn').addEventListener('click', () => {
            this.setTodayDate();
        });

        document.getElementById('add-entry-btn').addEventListener('click', () => {
            this.showDailyEntryForm();
        });

        document.getElementById('tracker-date').addEventListener('change', () => {
            this.loadDayData();
        });

        // Entry form events
        document.getElementById('add-revenue-btn').addEventListener('click', () => {
            this.addRevenueEntry();
        });

        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.addExpenseEntry();
        });

        document.getElementById('save-daily-entry').addEventListener('click', () => {
            this.saveDailyEntry();
        });

        document.getElementById('cancel-daily-entry').addEventListener('click', () => {
            this.hideDailyEntryForm();
        });

        // Chart events
        document.getElementById('chart-period').addEventListener('change', () => {
            this.renderProfitChart();
        });

        document.getElementById('refresh-chart').addEventListener('click', () => {
            this.renderProfitChart();
        });
    }

    updateCurrentMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const month = monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        
        document.getElementById('current-month-year').textContent = `${month} ${year}`;
    }

    renderProfitChart() {
        const canvas = document.getElementById('profit-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get data for the last 12 months
        const chartData = this.getChartData();
        
        if (chartData.length === 0) {
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No invoice data available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Chart dimensions
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const maxValue = Math.max(...chartData.map(d => d.amount), 1000); // Minimum scale
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw bars
        const barWidth = chartWidth / chartData.length * 0.8;
        const barSpacing = chartWidth / chartData.length * 0.2;
        
        chartData.forEach((data, index) => {
            const barHeight = (data.amount / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = canvas.height - padding - barHeight;
            
            // Color based on whether it's the current month
            ctx.fillStyle = data.isCurrentMonth ? '#0077c5' : '#28a745';
            
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw month labels
            ctx.fillStyle = '#495057';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.month, x + barWidth / 2, canvas.height - padding + 20);
            
            // Draw value labels on bars
            if (data.amount > 0) {
                ctx.fillStyle = '#0077c5';
                ctx.font = '10px Arial';
                ctx.fillText('$' + data.amount.toFixed(0), x + barWidth / 2, y - 5);
            }
        });
    }

    getChartData() {
        const data = [];
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        // Get data for the last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            // Calculate total for this month based on service dates
            const monthTotal = this.savedInvoices.reduce((total, invoice) => {
                // Group by service date from line items
                const monthInvoices = invoice.lineItems.filter(item => {
                    const serviceDate = new Date(item.serviceDate);
                    return serviceDate.getMonth() === date.getMonth() && 
                           serviceDate.getFullYear() === date.getFullYear();
                });
                
                return total + monthInvoices.reduce((sum, item) => sum + item.amount, 0);
            }, 0);
            
            data.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                amount: monthTotal,
                isCurrentMonth: date.getMonth() === currentMonth && date.getFullYear() === currentYear
            });
        }
        
        return data;
    }

    updateSummaryCards() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        // This Month
        const thisMonthData = this.getChartData().find(d => d.isCurrentMonth);
        document.getElementById('this-month-total').textContent = `$${thisMonthData ? thisMonthData.amount.toFixed(2) : '0.00'}`;
        
        // Last Month
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthTotal = this.getMonthTotal(lastMonth);
        document.getElementById('last-month-total').textContent = `$${lastMonthTotal.toFixed(2)}`;
        
        // This Year
        const thisYearTotal = this.savedInvoices.reduce((total, invoice) => {
            const yearInvoices = invoice.lineItems.filter(item => {
                const serviceDate = new Date(item.serviceDate);
                return serviceDate.getFullYear() === currentYear;
            });
            return total + yearInvoices.reduce((sum, item) => sum + item.amount, 0);
        }, 0);
        document.getElementById('this-year-total').textContent = `$${thisYearTotal.toFixed(2)}`;
        
        // Total Invoices
        document.getElementById('total-invoices').textContent = this.savedInvoices.length;
    }

    getMonthTotal(date) {
        return this.savedInvoices.reduce((total, invoice) => {
            const monthInvoices = invoice.lineItems.filter(item => {
                const serviceDate = new Date(item.serviceDate);
                return serviceDate.getMonth() === date.getMonth() && 
                       serviceDate.getFullYear() === date.getFullYear();
            });
            return total + monthInvoices.reduce((sum, item) => sum + item.amount, 0);
        }, 0);
    }

    renderInvoiceList() {
        const tbody = document.getElementById('invoice-list-tbody');
        const emptyState = document.getElementById('empty-state');
        
        if (this.savedInvoices.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Sort invoices
        const sortedInvoices = [...this.savedInvoices].sort((a, b) => {
            const sortBy = document.getElementById('sort-by').value;
            
            switch (sortBy) {
                case 'service-date':
                    const aDate = new Date(a.lineItems[0]?.serviceDate || a.invoiceDate);
                    const bDate = new Date(b.lineItems[0]?.serviceDate || b.invoiceDate);
                    return bDate - aDate; // Newest first
                case 'invoice-date':
                    return new Date(b.invoiceDate) - new Date(a.invoiceDate);
                case 'amount':
                    return b.total - a.total;
                case 'customer':
                    return a.customer.localeCompare(b.customer);
                default:
                    return 0;
            }
        });
        
        tbody.innerHTML = '';
        
        sortedInvoices.forEach(invoice => {
            const row = document.createElement('tr');
            const serviceDate = invoice.lineItems[0]?.serviceDate || invoice.invoiceDate;
            const dueDate = new Date(invoice.dueDate);
            const isOverdue = dueDate < new Date() && invoice.status !== 'paid';
            
            row.innerHTML = `
                <td>#${invoice.number}</td>
                <td>${this.getCustomerName(invoice.customer)}</td>
                <td>${this.formatDate(serviceDate)}</td>
                <td>${this.formatDate(invoice.invoiceDate)}</td>
                <td class="${isOverdue ? 'overdue' : ''}">${this.formatDate(invoice.dueDate)}</td>
                <td>$${invoice.total.toFixed(2)}</td>
                <td><span class="status ${invoice.status}">${invoice.status}</span></td>
                <td>
                    <button class="btn-small" onclick="profitTracker.viewInvoice(${invoice.number})">View</button>
                    <button class="btn-small" onclick="profitTracker.editInvoice(${invoice.number})">Edit</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        this.filterInvoices(); // Apply current filters
    }

    getCustomerName(customerId) {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            return customer.company ? `${customer.name} (${customer.company})` : customer.name;
        }
        return customerId;
    }

    filterInvoices() {
        const searchTerm = document.getElementById('invoice-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const rows = document.querySelectorAll('#invoice-list-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const statusElement = row.querySelector('.status');
            const status = statusElement ? statusElement.textContent : '';
            
            const matchesSearch = text.includes(searchTerm);
            const matchesStatus = !statusFilter || status === statusFilter;
            
            row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    viewInvoice(invoiceNumber) {
        const invoice = this.savedInvoices.find(inv => inv.number === invoiceNumber);
        if (invoice) {
            // Open invoice in new tab/window for viewing
            const invoiceWindow = window.open('', '_blank');
            invoiceWindow.document.write(this.generateInvoiceHTML(invoice));
        }
    }

    editInvoice(invoiceNumber) {
        // Redirect to invoice page with invoice data
        localStorage.setItem('editingInvoice', JSON.stringify(
            this.savedInvoices.find(inv => inv.number === invoiceNumber)
        ));
        window.location.href = 'invoice.html';
    }

    generateInvoiceHTML(invoice) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${invoice.number}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { margin-bottom: 20px; }
                    .line-items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .line-items th, .line-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .line-items th { background-color: #f2f2f2; }
                    .totals { text-align: right; margin-top: 20px; }
                    .total-row { margin: 5px 0; }
                    .balance-due { font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>INVOICE #${invoice.number}</h1>
                </div>
                
                <div class="invoice-details">
                    <p><strong>Customer:</strong> ${this.getCustomerName(invoice.customer)}</p>
                    <p><strong>Invoice Date:</strong> ${this.formatDate(invoice.invoiceDate)}</p>
                    <p><strong>Due Date:</strong> ${this.formatDate(invoice.dueDate)}</p>
                    <p><strong>Status:</strong> ${invoice.status}</p>
                </div>
                
                <table class="line-items">
                    <thead>
                        <tr>
                            <th>Service Date</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.lineItems.map(item => `
                            <tr>
                                <td>${this.formatDate(item.serviceDate)}</td>
                                <td>${item.productService} - ${item.description}</td>
                                <td>${item.qty}</td>
                                <td>$${item.rate.toFixed(2)}</td>
                                <td>$${item.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="total-row">Total: $${invoice.total.toFixed(2)}</div>
                    <div class="total-row balance-due">Balance Due: $${invoice.balanceDue.toFixed(2)}</div>
                </div>
                
                ${invoice.message ? `<div style="margin-top: 30px;"><strong>Message:</strong><br>${invoice.message}</div>` : ''}
            </body>
            </html>
        `;
    }

    checkForSuccessMessage() {
        // Check if we came from invoice creation
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            this.showSuccessMessage();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    openClientTracker() {
        document.getElementById('client-tracker-modal').style.display = 'flex';
        this.loadClients();
        this.updateClientStats();
    }

    closeClientTracker() {
        document.getElementById('client-tracker-modal').style.display = 'none';
    }

    loadClients() {
        this.clients = JSON.parse(localStorage.getItem('customers')) || [];
        this.renderClientList();
    }

    renderClientList() {
        const tbody = document.getElementById('client-list-tbody');
        tbody.innerHTML = '';

        this.clients.forEach(client => {
            const row = document.createElement('tr');
            const recommendation = this.getRecommendation(client);
            const lastContact = new Date(client.lastContact);
            const daysSinceContact = Math.floor((new Date() - lastContact) / (1000 * 60 * 60 * 24));
            
            row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.company || '-'}</td>
                <td>
                    <div class="warmth-score">
                        <span>${client.warmthScore}/10</span>
                        <div class="warmth-bar">
                            <div class="warmth-fill ${this.getWarmthClass(client.warmthScore)}" 
                                 style="width: ${(client.warmthScore / 10) * 100}%"></div>
                        </div>
                    </div>
                </td>
                <td>${daysSinceContact === 0 ? 'Today' : `${daysSinceContact} days ago`}</td>
                <td><span class="recommendation ${recommendation.type}">${recommendation.text}</span></td>
                <td>
                    <button class="btn-small" onclick="profitTracker.viewClientDetails('${client.id}')">View</button>
                    <button class="btn-small" onclick="profitTracker.markInteraction('${client.id}', 'follow_up')">Follow-up</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });

        this.filterClients(); // Apply current filters
    }

    getWarmthClass(score) {
        if (score >= 8) return 'hot';
        if (score >= 5) return 'warm';
        return 'cold';
    }

    getRecommendation(client) {
        const daysSinceContact = Math.floor((new Date() - new Date(client.lastContact)) / (1000 * 60 * 60 * 24));
        
        // Hot prospects (8-10) - gift recommendation
        if (client.warmthScore >= 8 && daysSinceContact > 30) {
            return { type: 'gift', text: 'Send Gift' };
        }
        
        // Warm prospects (5-7) - follow-up needed
        if (client.warmthScore >= 5 && client.warmthScore < 8 && daysSinceContact > 14) {
            return { type: 'follow-up', text: 'Follow-up' };
        }
        
        // Cold prospects (1-4) - follow-up needed
        if (client.warmthScore < 5 && daysSinceContact > 7) {
            return { type: 'follow-up', text: 'Follow-up' };
        }
        
        return { type: 'none', text: 'Good' };
    }

    updateClientStats() {
        const totalClients = this.clients.length;
        const hotProspects = this.clients.filter(c => c.warmthScore >= 8).length;
        const needsFollowup = this.clients.filter(c => {
            const recommendation = this.getRecommendation(c);
            return recommendation.type === 'follow-up';
        }).length;

        document.getElementById('total-clients').textContent = totalClients;
        document.getElementById('hot-prospects').textContent = hotProspects;
        document.getElementById('needs-followup').textContent = needsFollowup;
    }

    filterClients() {
        const searchTerm = document.getElementById('client-search').value.toLowerCase();
        const warmthFilter = document.getElementById('warmth-filter').value;
        const statusFilter = document.getElementById('status-filter-clients').value;
        const rows = document.querySelectorAll('#client-list-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const warmthScore = parseInt(row.querySelector('.warmth-score span').textContent);
            const status = row.cells[0].textContent.toLowerCase(); // Using name as proxy for status for now
            
            const matchesSearch = text.includes(searchTerm);
            const matchesWarmth = !warmthFilter || 
                (warmthFilter === 'hot' && warmthScore >= 8) ||
                (warmthFilter === 'warm' && warmthScore >= 5 && warmthScore < 8) ||
                (warmthFilter === 'cold' && warmthScore < 5);
            const matchesStatus = !statusFilter; // Simplified for now
            
            row.style.display = (matchesSearch && matchesWarmth && matchesStatus) ? '' : 'none';
        });
    }

    viewClientDetails(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            alert(`Client Details:\n\nName: ${client.name}\nCompany: ${client.company || 'N/A'}\nEmail: ${client.email}\nPhone: ${client.phone || 'N/A'}\nWarmth Score: ${client.warmthScore}/10\nLast Contact: ${client.lastContact}\nTotal Invoices: ${client.totalInvoices}\nTotal Amount: $${client.totalAmount}\nNotes: ${client.notes || 'None'}`);
        }
    }

    markInteraction(clientId, interactionType) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        // Update warmth score
        let scoreChange = 0;
        switch (interactionType) {
            case 'follow_up':
                scoreChange = 1;
                break;
            case 'gift_sent':
                scoreChange = 1;
                break;
        }

        client.warmthScore = Math.max(1, Math.min(10, client.warmthScore + scoreChange));
        client.lastContact = new Date().toISOString().split('T')[0];
        
        // Save updated clients
        localStorage.setItem('customers', JSON.stringify(this.clients));
        
        // Refresh display
        this.renderClientList();
        this.updateClientStats();
        
        this.showMessage(`${interactionType.replace('_', ' ')} recorded!`, 'success');
    }

    // Profit Tracker Methods
    openProfitTracker() {
        document.getElementById('profit-tracker-modal').style.display = 'flex';
        this.setTodayDate();
        this.loadDayData();
        this.renderProfitChart();
        this.renderEntriesList();
    }

    closeProfitTracker() {
        document.getElementById('profit-tracker-modal').style.display = 'none';
        this.hideDailyEntryForm();
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tracker-date').value = today;
        this.loadDayData();
    }

    showDailyEntryForm() {
        document.getElementById('daily-entry-form').style.display = 'block';
        this.clearEntryForm();
    }

    hideDailyEntryForm() {
        document.getElementById('daily-entry-form').style.display = 'none';
        this.clearEntryForm();
    }

    clearEntryForm() {
        document.getElementById('revenue-entries').innerHTML = '';
        document.getElementById('expense-entries').innerHTML = '';
        document.getElementById('daily-notes').value = '';
        this.updateDailySummary();
    }

    loadDayData() {
        const selectedDate = document.getElementById('tracker-date').value;
        const dailyEntries = JSON.parse(localStorage.getItem('dailyEntries')) || {};
        const dayData = dailyEntries[selectedDate];

        if (dayData) {
            // Load existing data
            this.loadRevenueEntries(dayData.revenue || []);
            this.loadExpenseEntries(dayData.expenses || []);
            document.getElementById('daily-notes').value = dayData.notes || '';
        } else {
            // Clear form for new day
            this.clearEntryForm();
        }
        
        this.updateDailySummary();
    }

    loadRevenueEntries(revenueData) {
        const container = document.getElementById('revenue-entries');
        container.innerHTML = '';
        revenueData.forEach(entry => {
            this.addRevenueEntry(entry.description, entry.amount);
        });
    }

    loadExpenseEntries(expenseData) {
        const container = document.getElementById('expense-entries');
        container.innerHTML = '';
        expenseData.forEach(entry => {
            this.addExpenseEntry(entry.description, entry.amount);
        });
    }

    addRevenueEntry(description = '', amount = '') {
        const container = document.getElementById('revenue-entries');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.innerHTML = `
            <input type="text" placeholder="Revenue description" value="${description}">
            <input type="number" class="amount-input" placeholder="0.00" value="${amount}" step="0.01" min="0">
            <button type="button" class="remove-entry" onclick="this.parentElement.remove(); profitTracker.updateDailySummary();">×</button>
        `;
        container.appendChild(entryDiv);
        
        // Add event listeners
        const inputs = entryDiv.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateDailySummary());
        });
        
        this.updateDailySummary();
    }

    addExpenseEntry(description = '', amount = '') {
        const container = document.getElementById('expense-entries');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.innerHTML = `
            <input type="text" placeholder="Expense description" value="${description}">
            <input type="number" class="amount-input" placeholder="0.00" value="${amount}" step="0.01" min="0">
            <button type="button" class="remove-entry" onclick="this.parentElement.remove(); profitTracker.updateDailySummary();">×</button>
        `;
        container.appendChild(entryDiv);
        
        // Add event listeners
        const inputs = entryDiv.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateDailySummary());
        });
        
        this.updateDailySummary();
    }

    updateDailySummary() {
        let totalRevenue = 0;
        let totalExpenses = 0;

        // Calculate revenue total
        document.querySelectorAll('#revenue-entries .entry-item').forEach(entry => {
            const amount = parseFloat(entry.querySelector('.amount-input').value) || 0;
            totalRevenue += amount;
        });

        // Calculate expense total
        document.querySelectorAll('#expense-entries .entry-item').forEach(entry => {
            const amount = parseFloat(entry.querySelector('.amount-input').value) || 0;
            totalExpenses += amount;
        });

        const profit = totalRevenue - totalExpenses;

        // Update display
        document.getElementById('daily-revenue-total').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('daily-expense-total').textContent = `$${totalExpenses.toFixed(2)}`;
        
        const profitElement = document.getElementById('daily-profit');
        profitElement.textContent = `$${profit.toFixed(2)}`;
        profitElement.parentElement.className = profit >= 0 ? 'summary-row profit-row positive' : 'summary-row profit-row negative';
    }

    saveDailyEntry() {
        const selectedDate = document.getElementById('tracker-date').value;
        if (!selectedDate) {
            this.showMessage('Please select a date', 'error');
            return;
        }

        // Collect revenue entries
        const revenue = [];
        document.querySelectorAll('#revenue-entries .entry-item').forEach(entry => {
            const description = entry.querySelector('input[type="text"]').value.trim();
            const amount = parseFloat(entry.querySelector('.amount-input').value) || 0;
            if (description && amount > 0) {
                revenue.push({ description, amount });
            }
        });

        // Collect expense entries
        const expenses = [];
        document.querySelectorAll('#expense-entries .entry-item').forEach(entry => {
            const description = entry.querySelector('input[type="text"]').value.trim();
            const amount = parseFloat(entry.querySelector('.amount-input').value) || 0;
            if (description && amount > 0) {
                expenses.push({ description, amount });
            }
        });

        // Save to localStorage
        const dailyEntries = JSON.parse(localStorage.getItem('dailyEntries')) || {};
        dailyEntries[selectedDate] = {
            date: selectedDate,
            revenue,
            expenses,
            notes: document.getElementById('daily-notes').value.trim(),
            totalRevenue: revenue.reduce((sum, item) => sum + item.amount, 0),
            totalExpenses: expenses.reduce((sum, item) => sum + item.amount, 0),
            profit: revenue.reduce((sum, item) => sum + item.amount, 0) - expenses.reduce((sum, item) => sum + item.amount, 0)
        };
        
        localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries));
        
        this.showMessage('Daily entry saved successfully!', 'success');
        this.hideDailyEntryForm();
        this.renderEntriesList();
        this.renderProfitChart();
    }

    renderEntriesList() {
        const tbody = document.getElementById('entries-list-tbody');
        const dailyEntries = JSON.parse(localStorage.getItem('dailyEntries')) || {};
        
        // Sort entries by date (newest first)
        const sortedEntries = Object.values(dailyEntries).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = '';
        
        sortedEntries.slice(0, 20).forEach(entry => {
            const row = document.createElement('tr');
            const profitClass = entry.profit >= 0 ? 'profit-positive' : 'profit-negative';
            const notesPreview = entry.notes.length > 50 ? entry.notes.substring(0, 50) + '...' : entry.notes;
            
            row.innerHTML = `
                <td>${new Date(entry.date).toLocaleDateString()}</td>
                <td>$${entry.totalRevenue.toFixed(2)}</td>
                <td>$${entry.totalExpenses.toFixed(2)}</td>
                <td class="${profitClass}">$${entry.profit.toFixed(2)}</td>
                <td class="notes-preview" title="${entry.notes}">${notesPreview || '-'}</td>
                <td>
                    <button class="btn-small" onclick="profitTracker.editDay('${entry.date}')">Edit</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    editDay(date) {
        document.getElementById('tracker-date').value = date;
        this.loadDayData();
        this.showDailyEntryForm();
    }

    renderProfitChart() {
        const canvas = document.getElementById('profit-chart');
        const ctx = canvas.getContext('2d');
        const period = document.getElementById('chart-period').value;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const dailyEntries = JSON.parse(localStorage.getItem('dailyEntries')) || {};
        const chartData = this.getChartData(dailyEntries, period);
        
        if (chartData.length === 0) {
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No profit data available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        this.drawProfitChart(ctx, chartData);
    }

    getChartData(entries, period) {
        const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
        const data = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const entry = entries[dateStr];
            
            data.push({
                date: dateStr,
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: entry ? entry.totalRevenue : 0,
                expenses: entry ? entry.totalExpenses : 0,
                profit: entry ? entry.profit : 0
            });
        }
        
        return data;
    }

    drawProfitChart(ctx, data) {
        const canvas = ctx.canvas;
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const maxValue = Math.max(
            Math.max(...data.map(d => d.revenue)),
            Math.max(...data.map(d => d.expenses)),
            Math.abs(Math.max(...data.map(d => d.profit))),
            Math.abs(Math.min(...data.map(d => d.profit)))
        );
        
        const scale = chartHeight / (maxValue * 2); // Double scale for positive/negative
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height / 2);
        ctx.lineTo(canvas.width - padding, canvas.height / 2);
        ctx.stroke();
        
        // Draw revenue line (green)
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 3;
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = canvas.height / 2 - point.revenue * scale;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw expense line (red)
        ctx.strokeStyle = '#dc3545';
        ctx.lineWidth = 3;
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = canvas.height / 2 + point.expenses * scale;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw profit line (blue)
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = canvas.height / 2 - point.profit * scale;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw labels
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            ctx.fillText(point.label, x, canvas.height - padding + 20);
        });
        
        // Draw legend
        ctx.fillStyle = '#28a745';
        ctx.fillRect(padding, padding + 10, 15, 3);
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Revenue', padding + 20, padding + 15);
        
        ctx.fillStyle = '#dc3545';
        ctx.fillRect(padding + 80, padding + 10, 15, 3);
        ctx.fillStyle = '#495057';
        ctx.fillText('Expenses', padding + 100, padding + 15);
        
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding + 180, padding + 11);
        ctx.lineTo(padding + 195, padding + 11);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText('Profit', padding + 200, padding + 15);
    }

    showSuccessMessage() {
        const messageDiv = document.getElementById('success-message');
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    refreshData() {
        this.savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        this.renderProfitChart();
        this.updateSummaryCards();
        this.renderInvoiceList();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profitTracker = new ProfitTracker();
    
    // Refresh data when returning from invoice page
    window.addEventListener('focus', () => {
        window.profitTracker.refreshData();
    });
});

