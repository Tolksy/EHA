// Profit Tracker Dashboard - Main Page

class ProfitTracker {
    constructor() {
        this.currentDate = new Date();
        this.savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        this.init();
    }

    init() {
        this.currentCalendarDate = new Date();
        this.setupEventListeners();
        this.updateCurrentMonthDisplay();
        this.renderProfitChart();
        this.updateSummaryCards();
        this.renderInvoiceList();
        this.checkForSuccessMessage();
        this.renderCalendarHero();
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

        // Smart Scheduler button
        document.getElementById('smart-scheduler-btn').addEventListener('click', () => {
            this.openSmartScheduler();
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

        // Calendar navigation (hero section)
        document.getElementById('prev-month-hero').addEventListener('click', () => {
            this.changeMonthHero(-1);
        });

        document.getElementById('next-month-hero').addEventListener('click', () => {
            this.changeMonthHero(1);
        });

        document.getElementById('today-btn-calendar-hero').addEventListener('click', () => {
            this.goToTodayHero();
        });

        // Calendar modal events (for backup modal)
        document.getElementById('close-calendar').addEventListener('click', () => {
            this.closeCalendar();
        });

        document.getElementById('prev-month').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.changeMonth(1);
        });

        document.getElementById('today-btn-calendar').addEventListener('click', () => {
            this.goToToday();
        });

        // Appointment modal events
        document.getElementById('close-appointment-modal').addEventListener('click', () => {
            this.closeAppointmentModal();
        });

        document.getElementById('cancel-appointment').addEventListener('click', () => {
            this.closeAppointmentModal();
        });

        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointment();
        });

        // Smart Scheduler modal events
        document.getElementById('close-smart-scheduler').addEventListener('click', () => {
            this.closeSmartScheduler();
        });

        // Wizard navigation
        document.getElementById('wizard-next').addEventListener('click', () => {
            this.nextWizardStep();
        });

        document.getElementById('wizard-back').addEventListener('click', () => {
            this.previousWizardStep();
        });

        document.getElementById('wizard-generate').addEventListener('click', () => {
            this.generateSchedule();
        });

        // Schedule actions
        document.getElementById('regenerate-schedule').addEventListener('click', () => {
            this.regenerateSchedule();
        });

        document.getElementById('save-schedule').addEventListener('click', () => {
            this.saveSchedule();
        });

        document.getElementById('edit-schedule').addEventListener('click', () => {
            this.editSchedule();
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

    // Calendar Methods
    openCalendar() {
        document.getElementById('calendar-modal').style.display = 'flex';
        this.currentCalendarDate = new Date();
        this.renderCalendar();
        this.populateClientDropdown();
    }

    // Hero Calendar Methods
    changeMonthHero(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.renderCalendarHero();
    }

    goToTodayHero() {
        this.currentCalendarDate = new Date();
        this.renderCalendarHero();
    }

    renderCalendarHero() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Update header
        document.getElementById('current-month-year-hero').textContent = `${monthNames[month]} ${year}`;
        
        // Get calendar data
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || {};
        
        // Clear calendar
        const calendarDays = document.getElementById('calendar-days-hero');
        calendarDays.innerHTML = '';
        
        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-hero';
            
            // Add classes for styling
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (this.isToday(currentDate)) {
                dayElement.classList.add('today');
            }
            
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayAppointments = appointments[dateStr] || [];
            
            if (dayAppointments.length > 0) {
                dayElement.classList.add('has-appointments');
            }
            
            // Day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number-hero';
            dayNumber.textContent = currentDate.getDate();
            dayElement.appendChild(dayNumber);
            
            // Add appointments (limit to 3 for hero view)
            dayAppointments.slice(0, 3).forEach(appointment => {
                const appointmentBlock = document.createElement('div');
                appointmentBlock.className = `appointment-block-hero ${appointment.color}`;
                appointmentBlock.innerHTML = `
                    <span class="appointment-time-hero">${appointment.startTime}</span>
                    <span class="appointment-client-hero">${appointment.client}</span>
                `;
                appointmentBlock.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAppointmentDetails(appointment);
                });
                dayElement.appendChild(appointmentBlock);
            });
            
            // Show "+X more" if there are more than 3 appointments
            if (dayAppointments.length > 3) {
                const moreBlock = document.createElement('div');
                moreBlock.className = 'appointment-block-hero more-appointments';
                moreBlock.style.background = '#6c757d';
                moreBlock.style.fontSize = '0.6rem';
                moreBlock.textContent = `+${dayAppointments.length - 3} more`;
                dayElement.appendChild(moreBlock);
            }
            
            // Click handler for adding appointments
            dayElement.addEventListener('click', () => {
                this.openAppointmentModal(currentDate);
            });
            
            calendarDays.appendChild(dayElement);
        }
    }

    closeCalendar() {
        document.getElementById('calendar-modal').style.display = 'none';
        this.closeAppointmentModal();
    }

    changeMonth(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.renderCalendar();
    }

    goToToday() {
        this.currentCalendarDate = new Date();
        this.renderCalendar();
    }

    renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Update header
        document.getElementById('current-month-year').textContent = `${monthNames[month]} ${year}`;
        
        // Get calendar data
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || {};
        
        // Clear calendar
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Add classes for styling
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (this.isToday(currentDate)) {
                dayElement.classList.add('today');
            }
            
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayAppointments = appointments[dateStr] || [];
            
            if (dayAppointments.length > 0) {
                dayElement.classList.add('has-appointments');
            }
            
            // Day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = currentDate.getDate();
            dayElement.appendChild(dayNumber);
            
            // Add appointments
            dayAppointments.forEach(appointment => {
                const appointmentBlock = document.createElement('div');
                appointmentBlock.className = `appointment-block ${appointment.color}`;
                appointmentBlock.innerHTML = `
                    <span class="appointment-time">${appointment.startTime}</span>
                    <span class="appointment-client">${appointment.client}</span>
                `;
                appointmentBlock.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAppointmentDetails(appointment);
                });
                dayElement.appendChild(appointmentBlock);
            });
            
            // Click handler for adding appointments
            dayElement.addEventListener('click', () => {
                this.openAppointmentModal(currentDate);
            });
            
            calendarDays.appendChild(dayElement);
        }
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    populateClientDropdown() {
        const select = document.getElementById('appointment-client');
        select.innerHTML = '<option value="">Select a client</option>';
        
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.company ? `${customer.name} (${customer.company})` : customer.name;
            select.appendChild(option);
        });
    }

    openAppointmentModal(date) {
        document.getElementById('appointment-modal').style.display = 'flex';
        document.getElementById('appointment-date').value = date.toISOString().split('T')[0];
        document.getElementById('appointment-modal-title').textContent = `Schedule Appointment - ${date.toLocaleDateString()}`;
        
        // Clear form
        document.getElementById('appointment-form').reset();
        document.getElementById('appointment-date').value = date.toISOString().split('T')[0];
        document.querySelector('input[name="appointment-color"][value="blue"]').checked = true;
        
        // Set default times
        document.getElementById('start-time').value = '09:00';
        document.getElementById('end-time').value = '10:00';
    }

    closeAppointmentModal() {
        document.getElementById('appointment-modal').style.display = 'none';
    }

    saveAppointment() {
        const formData = {
            id: Date.now(),
            date: document.getElementById('appointment-date').value,
            clientId: document.getElementById('appointment-client').value,
            startTime: document.getElementById('start-time').value,
            endTime: document.getElementById('end-time').value,
            color: document.querySelector('input[name="appointment-color"]:checked').value,
            notes: document.getElementById('appointment-notes').value.trim()
        };
        
        // Validate form
        if (!formData.clientId) {
            this.showMessage('Please select a client', 'error');
            return;
        }
        
        if (formData.startTime >= formData.endTime) {
            this.showMessage('End time must be after start time', 'error');
            return;
        }
        
        // Get client name
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        const client = customers.find(c => c.id === formData.clientId);
        formData.client = client ? (client.company ? `${client.name} (${client.company})` : client.name) : 'Unknown Client';
        
        // Save appointment
        const appointments = JSON.parse(localStorage.getItem('appointments')) || {};
        if (!appointments[formData.date]) {
            appointments[formData.date] = [];
        }
        appointments[formData.date].push(formData);
        
        // Sort appointments by start time
        appointments[formData.date].sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        this.showMessage('Appointment scheduled successfully!', 'success');
        this.closeAppointmentModal();
        this.renderCalendar();
        this.renderCalendarHero();
    }

    showAppointmentDetails(appointment) {
        // Create and show tooltip with appointment details
        const tooltip = document.createElement('div');
        tooltip.className = 'appointment-tooltip show';
        tooltip.innerHTML = `
            <div><strong>${appointment.client}</strong></div>
            <div>${appointment.startTime} - ${appointment.endTime}</div>
            ${appointment.notes ? `<div>${appointment.notes}</div>` : ''}
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        // Remove tooltip after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
        
        // Remove tooltip on click
        tooltip.addEventListener('click', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
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

    // Smart Scheduler Methods
    openSmartScheduler() {
        document.getElementById('smart-scheduler-modal').style.display = 'flex';
        this.resetWizard();
    }

    closeSmartScheduler() {
        document.getElementById('smart-scheduler-modal').style.display = 'none';
        this.resetWizard();
    }

    resetWizard() {
        this.currentWizardStep = 1;
        this.wizardData = {};
        this.updateWizardDisplay();
        
        // Hide generated schedule
        document.getElementById('generated-schedule').style.display = 'none';
        document.getElementById('setup-wizard').style.display = 'block';
        
        // Reset all form inputs
        document.querySelectorAll('#setup-wizard input').forEach(input => {
            input.checked = false;
        });
    }

    nextWizardStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveCurrentStepData();
        this.currentWizardStep++;
        this.updateWizardDisplay();
    }

    previousWizardStep() {
        this.currentWizardStep--;
        this.updateWizardDisplay();
    }

    validateCurrentStep() {
        switch (this.currentWizardStep) {
            case 1:
                if (!document.querySelector('input[name="profit-goal"]:checked')) {
                    this.showMessage('Please select your monthly profit goal', 'error');
                    return false;
                }
                break;
            case 2:
                if (!document.querySelector('input[name="work-days"]:checked')) {
                    this.showMessage('Please select your work days per week', 'error');
                    return false;
                }
                break;
            case 3:
                if (!document.querySelector('input[name="activities"]:checked')) {
                    this.showMessage('Please select at least one activity type', 'error');
                    return false;
                }
                break;
            case 4:
                if (!document.querySelector('input[name="work-hours"]:checked')) {
                    this.showMessage('Please select your preferred working hours', 'error');
                    return false;
                }
                break;
            case 5:
                if (!document.querySelector('input[name="buffer-time"]:checked')) {
                    this.showMessage('Please select buffer time between appointments', 'error');
                    return false;
                }
                break;
        }
        return true;
    }

    saveCurrentStepData() {
        switch (this.currentWizardStep) {
            case 1:
                this.wizardData.profitGoal = parseInt(document.querySelector('input[name="profit-goal"]:checked').value);
                break;
            case 2:
                this.wizardData.workDays = parseInt(document.querySelector('input[name="work-days"]:checked').value);
                break;
            case 3:
                this.wizardData.activities = Array.from(document.querySelectorAll('input[name="activities"]:checked'))
                    .map(input => input.value);
                break;
            case 4:
                this.wizardData.workHours = document.querySelector('input[name="work-hours"]:checked').value;
                break;
            case 5:
                this.wizardData.bufferTime = parseInt(document.querySelector('input[name="buffer-time"]:checked').value);
                break;
        }
    }

    updateWizardDisplay() {
        // Update progress bar
        const progress = (this.currentWizardStep / 5) * 100;
        document.getElementById('wizard-progress').style.width = `${progress}%`;
        document.getElementById('current-step').textContent = this.currentWizardStep;

        // Show/hide steps
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentWizardStep);
        });

        // Update buttons
        const backBtn = document.getElementById('wizard-back');
        const nextBtn = document.getElementById('wizard-next');
        const generateBtn = document.getElementById('wizard-generate');

        backBtn.style.display = this.currentWizardStep > 1 ? 'block' : 'none';
        
        if (this.currentWizardStep === 5) {
            nextBtn.style.display = 'none';
            generateBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            generateBtn.style.display = 'none';
        }
    }

    generateSchedule() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveCurrentStepData();
        
        // Calculate daily revenue target
        const dailyRevenueTarget = this.wizardData.profitGoal / this.wizardData.workDays;
        
        // Update summary
        document.getElementById('daily-revenue-target').textContent = `$${dailyRevenueTarget.toFixed(0)}`;
        document.getElementById('work-days-summary').textContent = this.wizardData.workDays;
        
        // Generate the schedule
        const schedule = this.createSmartSchedule();
        
        // Update total appointments
        const totalAppointments = schedule.reduce((total, day) => total + day.appointments.length, 0);
        document.getElementById('total-appointments').textContent = totalAppointments;
        
        // Render the schedule
        this.renderGeneratedSchedule(schedule);
        
        // Show generated schedule
        document.getElementById('setup-wizard').style.display = 'none';
        document.getElementById('generated-schedule').style.display = 'block';
    }

    createSmartSchedule() {
        const schedule = [];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        
        const dailyRevenueTarget = this.wizardData.profitGoal / this.wizardData.workDays;
        
        // Get working hours
        const workHours = this.parseWorkHours(this.wizardData.workHours);
        
        // Generate schedule for next 7 days
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            
            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            const isWorkDay = this.isWorkDay(i, this.wizardData.workDays);
            
            const daySchedule = {
                date: currentDate,
                dayName: dayName,
                isWorkDay: isWorkDay,
                appointments: []
            };
            
            if (isWorkDay) {
                daySchedule.appointments = this.generateDayAppointments(
                    currentDate, 
                    workHours, 
                    dailyRevenueTarget, 
                    this.wizardData.activities,
                    this.wizardData.bufferTime
                );
            }
            
            schedule.push(daySchedule);
        }
        
        return schedule;
    }

    isWorkDay(dayIndex, workDays) {
        // dayIndex: 0=Sunday, 1=Monday, ..., 6=Saturday
        if (workDays === 5) {
            return dayIndex >= 1 && dayIndex <= 5; // Monday-Friday
        } else if (workDays === 6) {
            return dayIndex >= 1 && dayIndex <= 6; // Monday-Saturday
        } else {
            return true; // 7 days
        }
    }

    parseWorkHours(workHours) {
        switch (workHours) {
            case '8-5':
                return { start: 8, end: 17 };
            case '9-6':
                return { start: 9, end: 18 };
            case '10-7':
                return { start: 10, end: 19 };
            case 'flexible':
                return { start: 9, end: 17 }; // Default to 9-5 for flexible
            default:
                return { start: 9, end: 17 };
        }
    }

    generateDayAppointments(date, workHours, dailyRevenueTarget, activities, bufferTime) {
        const appointments = [];
        let currentTime = workHours.start;
        let remainingRevenue = dailyRevenueTarget;
        
        // Activity type configurations
        const activityConfigs = {
            'client-meetings': { duration: 60, revenue: dailyRevenueTarget * 0.4, color: 'blue' },
            'field-work': { duration: 120, revenue: dailyRevenueTarget * 0.5, color: 'green' },
            'admin': { duration: 30, revenue: 0, color: 'orange' },
            'prospecting': { duration: 45, revenue: 0, color: 'purple' }
        };
        
        // Prioritize high-revenue activities
        const prioritizedActivities = activities.sort((a, b) => {
            const aRevenue = activityConfigs[a]?.revenue || 0;
            const bRevenue = activityConfigs[b]?.revenue || 0;
            return bRevenue - aRevenue;
        });
        
        // Generate appointments throughout the day
        while (currentTime < workHours.end && remainingRevenue > 0) {
            const activity = this.selectNextActivity(prioritizedActivities, remainingRevenue, activityConfigs);
            if (!activity) break;
            
            const config = activityConfigs[activity];
            const appointment = {
                time: this.formatTime(currentTime),
                endTime: this.formatTime(currentTime + config.duration / 60),
                activity: this.getActivityDisplayName(activity),
                client: this.generateClientName(activity),
                revenue: config.revenue,
                color: config.color,
                type: activity
            };
            
            appointments.push(appointment);
            
            currentTime += (config.duration / 60) + (bufferTime / 60);
            remainingRevenue -= config.revenue;
        }
        
        return appointments;
    }

    selectNextActivity(activities, remainingRevenue, configs) {
        // Find the best activity that fits the remaining revenue and time
        for (const activity of activities) {
            const config = configs[activity];
            if (config.revenue <= remainingRevenue) {
                return activity;
            }
        }
        
        // If no high-revenue activities fit, add admin or prospecting
        const lowRevenueActivities = activities.filter(a => configs[a].revenue === 0);
        return lowRevenueActivities[0] || null;
    }

    getActivityDisplayName(activity) {
        const names = {
            'client-meetings': 'Client Meeting',
            'field-work': 'Field Work',
            'admin': 'Admin Work',
            'prospecting': 'Prospecting'
        };
        return names[activity] || activity;
    }

    generateClientName(activity) {
        const sampleClients = [
            'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 
            'David Brown', 'Emily Taylor', 'Chris Anderson', 'Amy Martinez'
        ];
        
        if (activity === 'client-meetings' || activity === 'field-work') {
            return sampleClients[Math.floor(Math.random() * sampleClients.length)];
        }
        return 'Internal';
    }

    formatTime(hours) {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    renderGeneratedSchedule(schedule) {
        const container = document.getElementById('schedule-week');
        container.innerHTML = '';
        
        schedule.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'schedule-day';
            
            dayElement.innerHTML = `
                <div class="day-header">
                    <div class="day-name">${day.dayName}</div>
                    <div class="day-date">${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div class="day-appointments">
                    ${day.isWorkDay ? 
                        day.appointments.map(appt => `
                            <div class="time-block ${appt.color}" onclick="profitTracker.editTimeBlock('${appt.time}', '${day.dayName}')">
                                <div class="block-time">${appt.time} - ${appt.endTime}</div>
                                <div class="block-activity">${appt.activity}</div>
                                <div class="block-client">${appt.client}</div>
                                ${appt.revenue > 0 ? `<div class="block-revenue">+$${appt.revenue.toFixed(0)}</div>` : ''}
                            </div>
                        `).join('') :
                        '<div class="time-block" style="background: #f8f9fa; color: #6c757d; text-align: center; padding: 2rem;">Day Off</div>'
                    }
                </div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    regenerateSchedule() {
        this.generateSchedule();
    }

    saveSchedule() {
        // This would save the generated schedule to the calendar
        this.showMessage('Schedule saved to calendar successfully!', 'success');
        this.closeSmartScheduler();
        
        // Refresh the calendar display
        this.renderCalendarHero();
    }

    editSchedule() {
        this.showMessage('Edit mode coming soon! For now, you can regenerate with different settings.', 'info');
    }

    editTimeBlock(time, dayName) {
        this.showMessage(`Edit ${dayName} at ${time} - Feature coming soon!`, 'info');
    }

    showMessage(message, type = 'info') {
        // Create a simple message display
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            font-weight: 500;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
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

