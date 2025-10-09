// Profit Tracker Dashboard - Main Page

class ProfitTracker {
    constructor() {
        this.currentDate = new Date();
        this.savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        this.journalEmployees = []; // Track employees in daily journal
        this.journalCustomers = []; // Track customers in daily journal
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
        this.checkDailyWorkflowPreference();
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

        // Smart Scheduler dropdown
        document.getElementById('smart-scheduler-btn').addEventListener('click', () => {
            this.toggleSchedulerDropdown();
        });

        // Scheduler dropdown items
        document.getElementById('macro-scheduler-btn').addEventListener('click', () => {
            this.openSmartScheduler();
            this.hideSchedulerDropdown();
        });

        document.getElementById('micro-scheduler-btn').addEventListener('click', () => {
            this.openDailyLogging();
            this.hideSchedulerDropdown();
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

        // Add customer button
        document.getElementById('add-customer-btn').addEventListener('click', () => {
            this.openAddCustomerModal();
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

        // Daily Logging modal events
        document.getElementById('close-daily-logging').addEventListener('click', () => {
            this.closeDailyLogging();
        });

        // Date selection
        document.getElementById('today-logging-btn').addEventListener('click', () => {
            this.setTodayForLogging();
        });

        document.getElementById('yesterday-logging-btn').addEventListener('click', () => {
            this.setYesterdayForLogging();
        });

        document.getElementById('logging-date').addEventListener('change', () => {
            this.startServiceEntry();
        });

        // Logging wizard navigation
        document.getElementById('logging-next').addEventListener('click', () => {
            this.nextLoggingStep();
        });

        document.getElementById('logging-back').addEventListener('click', () => {
            this.previousLoggingStep();
        });

        document.getElementById('logging-save').addEventListener('click', () => {
            this.saveServiceEntry();
        });

        // Service summary actions
        document.getElementById('add-another-service').addEventListener('click', () => {
            this.addAnotherService();
        });

        document.getElementById('finish-logging').addEventListener('click', () => {
            this.finishLogging();
        });

        // Customer search
        document.getElementById('customer-search').addEventListener('input', () => {
            this.filterCustomers();
        });

        // Add employee
        document.getElementById('add-employee-btn').addEventListener('click', () => {
            this.addEmployee();
        });

        // Add task modal events
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.openAddTaskModal();
        });

        document.getElementById('close-add-task').addEventListener('click', () => {
            this.closeAddTaskModal();
        });

        document.getElementById('cancel-add-task').addEventListener('click', () => {
            this.closeAddTaskModal();
        });

        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewTask();
        });

        // Task form calculations
        document.getElementById('task-duration').addEventListener('input', () => {
            this.calculateTaskTotal();
        });

        document.getElementById('task-rate').addEventListener('input', () => {
            this.calculateTaskTotal();
        });

        // Add customer modal events
        document.getElementById('close-add-customer').addEventListener('click', () => {
            this.closeAddCustomerModal();
        });

        document.getElementById('cancel-add-customer').addEventListener('click', () => {
            this.closeAddCustomerModal();
        });

        document.getElementById('add-customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewCustomer();
        });

        // Tab switching events
        document.getElementById('clients-tab').addEventListener('click', () => {
            this.switchTab('clients');
        });

        document.getElementById('jobs-tab').addEventListener('click', () => {
            this.switchTab('jobs');
        });

        // Add job button
        document.getElementById('add-job-btn').addEventListener('click', () => {
            this.openAddJobModal();
        });

        // Add job modal events
        document.getElementById('close-add-job').addEventListener('click', () => {
            this.closeAddJobModal();
        });

        document.getElementById('cancel-add-job').addEventListener('click', () => {
            this.closeAddJobModal();
        });

        document.getElementById('add-job-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewJob();
        });

        // Job filtering events
        document.getElementById('job-search').addEventListener('input', () => {
            this.filterJobs();
        });

        document.getElementById('job-status-filter').addEventListener('change', () => {
            this.filterJobs();
        });

        document.getElementById('job-client-filter').addEventListener('change', () => {
            this.filterJobs();
        });

        // Workflow guide button
        document.getElementById('workflow-guide-btn').addEventListener('click', () => {
            this.openWorkflowGuide();
        });

        // Daily workflow button
        document.getElementById('daily-workflow-btn').addEventListener('click', () => {
            this.startDailyWorkflow();
        });

        // Workflow guide modal events
        document.getElementById('close-workflow-guide').addEventListener('click', () => {
            this.closeWorkflowGuide();
        });

        document.getElementById('workflow-next').addEventListener('click', () => {
            this.nextWorkflowStep();
        });

        document.getElementById('workflow-prev').addEventListener('click', () => {
            this.prevWorkflowStep();
        });

        document.getElementById('workflow-finish').addEventListener('click', () => {
            this.closeWorkflowGuide();
        });

        // Step indicator clicks
        document.querySelectorAll('.step-indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const step = parseInt(e.target.dataset.step);
                this.goToWorkflowStep(step);
            });
        });

        // Daily workflow toggle
        document.getElementById('daily-workflow-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('useDailyWorkflow', 'true');
                this.showMessage('✅ Daily workflow enabled! The guide will open automatically each day.', 'success');
            } else {
                localStorage.setItem('useDailyWorkflow', 'false');
                this.showMessage('❌ Daily workflow disabled. You can still access it manually.', 'info');
            }
        });

        // Daily Business Journal button
        document.getElementById('daily-journal-btn').addEventListener('click', () => {
            this.openDailyJournal();
        });

        // Daily Business Journal modal events
        document.getElementById('close-daily-journal').addEventListener('click', () => {
            this.closeDailyJournal();
        });

        document.getElementById('cancel-daily-journal').addEventListener('click', () => {
            this.closeDailyJournal();
        });

        document.getElementById('daily-journal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDailyJournal();
        });

        // Number of employees input
        document.getElementById('num-employees').addEventListener('change', (e) => {
            this.createEmployeeFields(parseInt(e.target.value) || 0);
        });

        // Number of customers input
        document.getElementById('num-customers').addEventListener('change', (e) => {
            this.createCustomerFields(parseInt(e.target.value) || 0);
        });

        // Manage Employees button
        document.getElementById('manage-employees-btn').addEventListener('click', () => {
            this.openEmployeeManagement();
        });

        // Employee Management modal events
        document.getElementById('close-employee-management').addEventListener('click', () => {
            this.closeEmployeeManagement();
        });

        document.getElementById('save-new-employee').addEventListener('click', () => {
            this.saveNewEmployee();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.scheduler-dropdown')) {
                this.hideSchedulerDropdown();
            }
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
            case 6:
                if (!document.querySelector('input[name="schedule-duration"]:checked')) {
                    this.showMessage('Please select schedule duration', 'error');
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
            case 6:
                this.wizardData.scheduleDuration = parseInt(document.querySelector('input[name="schedule-duration"]:checked').value);
                break;
        }
    }

    updateWizardDisplay() {
        // Update progress bar
        const progress = (this.currentWizardStep / 6) * 100;
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
        
        if (this.currentWizardStep === 6) {
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
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start from Sunday
        
        const dailyRevenueTarget = this.wizardData.profitGoal / this.wizardData.workDays;
        const duration = this.wizardData.scheduleDuration || 7;
        
        // Get working hours
        const workHours = this.parseWorkHours(this.wizardData.workHours);
        
        // Generate schedule for the specified duration
        for (let i = 0; i < duration; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
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
        // dayIndex: 0=Sunday, 1=Monday, ..., 6=Saturday, 7=Sunday, 8=Monday, etc.
        const dayOfWeek = dayIndex % 7;
        
        if (workDays === 5) {
            return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
        } else if (workDays === 6) {
            return dayOfWeek >= 1 && dayOfWeek <= 6; // Monday-Saturday
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
        // Get the current generated schedule
        const scheduleWeek = document.getElementById('schedule-week');
        const scheduleDays = scheduleWeek.querySelectorAll('.schedule-day');
        
        // Load existing appointments
        let appointments = JSON.parse(localStorage.getItem('appointments')) || {};
        
        // Save each day's appointments
        scheduleDays.forEach(dayElement => {
            const dayHeader = dayElement.querySelector('.day-header .day-date').textContent;
            const dayName = dayElement.querySelector('.day-header .day-name').textContent;
            
            // Parse the date from the day header
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            
            // Find the date for this day
            const dayIndex = Array.from(scheduleDays).indexOf(dayElement);
            const appointmentDate = new Date(startOfWeek);
            appointmentDate.setDate(startOfWeek.getDate() + dayIndex);
            const dateStr = appointmentDate.toISOString().split('T')[0];
            
            // Get appointments for this day
            const timeBlocks = dayElement.querySelectorAll('.time-block');
            const dayAppointments = [];
            
            timeBlocks.forEach(block => {
                // Skip "Day Off" blocks
                if (block.textContent.includes('Day Off')) return;
                
                const timeText = block.querySelector('.block-time').textContent;
                const activity = block.querySelector('.block-activity').textContent;
                const client = block.querySelector('.block-client').textContent;
                const revenueText = block.querySelector('.block-revenue');
                const revenue = revenueText ? parseFloat(revenueText.textContent.replace('+$', '')) : 0;
                const color = Array.from(block.classList).find(cls => ['blue', 'green', 'orange', 'purple'].includes(cls));
                
                // Parse start and end times
                const [startTime, endTime] = timeText.split(' - ');
                
                const appointment = {
                    id: Date.now() + Math.random(),
                    date: dateStr,
                    client: client,
                    startTime: startTime,
                    endTime: endTime,
                    color: color,
                    notes: `Smart Scheduled: ${activity}`,
                    revenue: revenue,
                    type: 'smart-generated'
                };
                
                dayAppointments.push(appointment);
            });
            
            if (dayAppointments.length > 0) {
                appointments[dateStr] = appointments[dateStr] || [];
                appointments[dateStr] = appointments[dateStr].concat(dayAppointments);
                
                // Sort appointments by start time
                appointments[dateStr].sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
        });
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
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

    // Scheduler Dropdown Methods
    toggleSchedulerDropdown() {
        const dropdown = document.getElementById('scheduler-dropdown-menu');
        dropdown.classList.toggle('show');
    }

    hideSchedulerDropdown() {
        const dropdown = document.getElementById('scheduler-dropdown-menu');
        dropdown.classList.remove('show');
    }

    // Daily Logging Methods
    openDailyLogging() {
        document.getElementById('daily-logging-modal').style.display = 'flex';
        this.resetDailyLogging();
    }

    closeDailyLogging() {
        document.getElementById('daily-logging-modal').style.display = 'none';
        this.resetDailyLogging();
    }

    resetDailyLogging() {
        this.currentLoggingStep = 1;
        this.loggingData = {};
        this.loggedServices = [];
        this.updateLoggingDisplay();
        
        // Hide service entry wizard and summary
        document.getElementById('service-entry-wizard').style.display = 'none';
        document.getElementById('service-summary').style.display = 'none';
        
        // Reset date to today
        this.setTodayForLogging();
    }

    setTodayForLogging() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('logging-date').value = today;
        this.startServiceEntry();
    }

    setYesterdayForLogging() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        document.getElementById('logging-date').value = yesterday.toISOString().split('T')[0];
        this.startServiceEntry();
    }

    startServiceEntry() {
        const date = document.getElementById('logging-date').value;
        if (date) {
            document.getElementById('service-entry-wizard').style.display = 'block';
            this.loadCustomers();
            this.resetLoggingWizard();
        }
    }

    resetLoggingWizard() {
        this.currentLoggingStep = 1;
        this.loggingData = {};
        this.updateLoggingDisplay();
        
        // Reset all form inputs
        document.querySelectorAll('#service-entry-wizard input, #service-entry-wizard textarea').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        // Check "Myself" by default
        document.querySelector('input[name="employees"][value="self"]').checked = true;
        
        // Set default times
        document.getElementById('start-time-logging').value = '09:00';
        document.getElementById('end-time-logging').value = '17:00';
    }

    nextLoggingStep() {
        if (!this.validateLoggingStep()) {
            return;
        }

        this.saveLoggingStepData();
        this.currentLoggingStep++;
        this.updateLoggingDisplay();
    }

    previousLoggingStep() {
        this.currentLoggingStep--;
        this.updateLoggingDisplay();
    }

    validateLoggingStep() {
        switch (this.currentLoggingStep) {
            case 1:
                if (!this.selectedCustomer) {
                    this.showMessage('Please select a customer', 'error');
                    return false;
                }
                break;
            case 2:
                if (!document.querySelector('input[name="service-type"]:checked')) {
                    this.showMessage('Please select a service type', 'error');
                    return false;
                }
                break;
            case 3:
                if (!document.querySelector('input[name="employees"]:checked')) {
                    this.showMessage('Please select at least one team member', 'error');
                    return false;
                }
                break;
            case 4:
                const startTime = document.getElementById('start-time-logging').value;
                const endTime = document.getElementById('end-time-logging').value;
                if (!startTime || !endTime) {
                    this.showMessage('Please enter start and end times', 'error');
                    return false;
                }
                if (startTime >= endTime) {
                    this.showMessage('End time must be after start time', 'error');
                    return false;
                }
                break;
        }
        return true;
    }

    saveLoggingStepData() {
        switch (this.currentLoggingStep) {
            case 1:
                this.loggingData.customer = this.selectedCustomer;
                break;
            case 2:
                this.loggingData.serviceType = document.querySelector('input[name="service-type"]:checked').value;
                break;
            case 3:
                this.loggingData.employees = Array.from(document.querySelectorAll('input[name="employees"]:checked'))
                    .map(input => input.value);
                break;
            case 4:
                this.loggingData.startTime = document.getElementById('start-time-logging').value;
                this.loggingData.endTime = document.getElementById('end-time-logging').value;
                this.loggingData.description = document.getElementById('service-description').value;
                this.loggingData.amount = parseFloat(document.getElementById('service-amount').value) || 0;
                break;
        }
    }

    updateLoggingDisplay() {
        // Update progress bar
        const progress = (this.currentLoggingStep / 4) * 100;
        document.getElementById('logging-progress').style.width = `${progress}%`;
        document.getElementById('logging-step').textContent = this.currentLoggingStep;

        // Show/hide steps
        document.querySelectorAll('#service-entry-wizard .wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentLoggingStep);
        });

        // Update buttons
        const backBtn = document.getElementById('logging-back');
        const nextBtn = document.getElementById('logging-next');
        const saveBtn = document.getElementById('logging-save');

        backBtn.style.display = this.currentLoggingStep > 1 ? 'block' : 'none';
        
        if (this.currentLoggingStep === 4) {
            nextBtn.style.display = 'none';
            saveBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            saveBtn.style.display = 'none';
        }
    }

    loadCustomers() {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        const customerList = document.getElementById('customer-list');
        customerList.innerHTML = '';

        customers.forEach(customer => {
            const customerItem = document.createElement('div');
            customerItem.className = 'customer-item';
            customerItem.innerHTML = `
                <div class="customer-name">${customer.name}</div>
                ${customer.company ? `<div class="customer-company">${customer.company}</div>` : ''}
            `;
            customerItem.addEventListener('click', () => {
                this.selectCustomer(customer);
            });
            customerList.appendChild(customerItem);
        });
    }

    selectCustomer(customer) {
        this.selectedCustomer = customer;
        
        // Highlight selected customer
        document.querySelectorAll('.customer-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.closest('.customer-item').classList.add('selected');
        
        this.nextLoggingStep();
    }

    filterCustomers() {
        const searchTerm = document.getElementById('customer-search').value.toLowerCase();
        const customerItems = document.querySelectorAll('.customer-item');
        
        customerItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    addEmployee() {
        const employeeName = prompt('Enter employee name:');
        if (employeeName) {
            const employeeList = document.querySelector('.employee-list');
            const employeeOption = document.createElement('div');
            employeeOption.className = 'employee-option';
            employeeOption.innerHTML = `
                <label class="checkbox-label">
                    <input type="checkbox" name="employees" value="${employeeName}">
                    <span class="employee-name">${employeeName}</span>
                </label>
            `;
            employeeList.appendChild(employeeOption);
        }
    }

    saveServiceEntry() {
        if (!this.validateLoggingStep()) {
            return;
        }

        this.saveLoggingStepData();
        
        // Create service entry
        const serviceEntry = {
            id: Date.now(),
            date: document.getElementById('logging-date').value,
            customer: this.loggingData.customer,
            serviceType: this.loggingData.serviceType,
            employees: this.loggingData.employees,
            startTime: this.loggingData.startTime,
            endTime: this.loggingData.endTime,
            description: this.loggingData.description,
            amount: this.loggingData.amount
        };

        this.loggedServices.push(serviceEntry);
        this.showServiceSummary();
    }

    showServiceSummary() {
        const summary = document.getElementById('service-summary');
        const loggedServices = document.getElementById('logged-services');
        
        loggedServices.innerHTML = '';
        
        this.loggedServices.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'logged-service-item';
            serviceItem.innerHTML = `
                <div class="service-header">
                    <div class="service-customer">${service.customer.name}</div>
                    <div class="service-type">${service.serviceType}</div>
                </div>
                <div class="service-time">${service.startTime} - ${service.endTime}</div>
                <div class="service-description">${service.description}</div>
                <div class="service-amount">$${service.amount.toFixed(2)}</div>
            `;
            loggedServices.appendChild(serviceItem);
        });

        summary.style.display = 'block';
        document.getElementById('service-entry-wizard').style.display = 'none';
    }

    addAnotherService() {
        document.getElementById('service-summary').style.display = 'none';
        document.getElementById('service-entry-wizard').style.display = 'block';
        this.resetLoggingWizard();
    }

    finishLogging() {
        // Save services to localStorage
        const date = document.getElementById('logging-date').value;
        const dailyServices = JSON.parse(localStorage.getItem('dailyServices')) || {};
        dailyServices[date] = this.loggedServices;
        localStorage.setItem('dailyServices', JSON.stringify(dailyServices));

        // Also save as appointments for calendar display
        const appointments = JSON.parse(localStorage.getItem('appointments')) || {};
        if (!appointments[date]) {
            appointments[date] = [];
        }

        this.loggedServices.forEach(service => {
            const appointment = {
                id: service.id,
                date: date,
                client: service.customer.name,
                startTime: service.startTime,
                endTime: service.endTime,
                color: 'green', // Field work color
                notes: `${service.serviceType}: ${service.description}`,
                revenue: service.amount,
                type: 'field-service'
            };
            appointments[date].push(appointment);
        });

        localStorage.setItem('appointments', JSON.stringify(appointments));

        this.showMessage('Services logged successfully!', 'success');
        this.closeDailyLogging();
        this.renderCalendarHero();
    }

    // Add Customer Methods
    openAddCustomerModal() {
        document.getElementById('add-customer-modal').style.display = 'flex';
        this.clearAddCustomerForm();
    }

    closeAddCustomerModal() {
        document.getElementById('add-customer-modal').style.display = 'none';
        this.clearAddCustomerForm();
    }

    clearAddCustomerForm() {
        document.getElementById('add-customer-form').reset();
        // Set default warmth score
        document.getElementById('customer-warmth').value = '5';
        // Set default status
        document.getElementById('customer-status').value = 'prospect';
    }

    saveNewCustomer() {
        const customerData = {
            id: Date.now().toString(),
            name: document.getElementById('customer-name').value.trim(),
            company: document.getElementById('customer-company').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            address: document.getElementById('customer-address').value.trim(),
            warmthScore: parseInt(document.getElementById('customer-warmth').value),
            status: document.getElementById('customer-status').value,
            notes: document.getElementById('customer-notes').value.trim(),
            lastContact: new Date().toISOString().split('T')[0],
            totalInvoices: 0,
            totalAmount: 0
        };

        // Validate required fields
        if (!customerData.name) {
            this.showMessage('Please enter customer name', 'error');
            return;
        }

        // Load existing customers
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        // Check for duplicate email if provided
        if (customerData.email) {
            const existingCustomer = customers.find(c => c.email === customerData.email);
            if (existingCustomer) {
                this.showMessage('A customer with this email already exists', 'error');
                return;
            }
        }

        // Add new customer
        customers.push(customerData);
        localStorage.setItem('customers', JSON.stringify(customers));

        // Update client tracker if it's open
        if (document.getElementById('client-tracker-modal').style.display === 'flex') {
            this.loadClients();
            this.updateClientStats();
        }

        this.showMessage('Customer added successfully!', 'success');
        this.closeAddCustomerModal();
    }

    // Tab Management Methods
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-content`).classList.add('active');
        
        // Load appropriate data
        if (tabName === 'jobs') {
            this.loadJobs();
            this.updateJobStats();
            this.populateJobClientFilter();
        }
    }

    // Job Management Methods
    openAddJobModal() {
        document.getElementById('add-job-modal').style.display = 'flex';
        this.clearAddJobForm();
        this.populateJobClientDropdown();
    }

    closeAddJobModal() {
        document.getElementById('add-job-modal').style.display = 'none';
        this.clearAddJobForm();
    }

    clearAddJobForm() {
        document.getElementById('add-job-form').reset();
        // Set default values
        document.getElementById('job-status').value = 'active';
        document.getElementById('job-priority').value = 'medium';
    }

    populateJobClientDropdown() {
        const select = document.getElementById('job-client');
        select.innerHTML = '<option value="">Select a client</option>';
        
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.company ? `${customer.name} (${customer.company})` : customer.name;
            select.appendChild(option);
        });
    }

    saveNewJob() {
        const jobData = {
            id: Date.now().toString(),
            name: document.getElementById('job-name').value.trim(),
            clientId: document.getElementById('job-client').value,
            description: document.getElementById('job-description').value.trim(),
            status: document.getElementById('job-status').value,
            priority: document.getElementById('job-priority').value,
            startDate: document.getElementById('job-start-date').value,
            endDate: document.getElementById('job-end-date').value,
            estimatedHours: parseFloat(document.getElementById('job-estimated-hours').value) || 0,
            hourlyRate: parseFloat(document.getElementById('job-hourly-rate').value) || 0,
            notes: document.getElementById('job-notes').value.trim(),
            created: new Date().toISOString(),
            progress: 0,
            completedHours: 0
        };

        // Validate required fields
        if (!jobData.name) {
            this.showMessage('Please enter job name', 'error');
            return;
        }

        if (!jobData.clientId) {
            this.showMessage('Please select a client', 'error');
            return;
        }

        // Load existing jobs
        let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        
        // Add new job
        jobs.push(jobData);
        localStorage.setItem('jobs', JSON.stringify(jobs));

        // Refresh job list if modal is open
        if (document.getElementById('client-tracker-modal').style.display === 'flex') {
            this.loadJobs();
            this.updateJobStats();
        }

        this.showMessage('Job added successfully!', 'success');
        this.closeAddJobModal();
    }

    loadJobs() {
        this.jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        this.renderJobList();
    }

    renderJobList() {
        const tbody = document.getElementById('job-list-tbody');
        tbody.innerHTML = '';

        this.jobs.forEach(job => {
            const row = document.createElement('tr');
            const client = this.getClientById(job.clientId);
            const clientName = client ? (client.company ? `${client.name} (${client.company})` : client.name) : 'Unknown Client';
            const createdDate = new Date(job.created).toLocaleDateString();
            
            row.innerHTML = `
                <td>${job.name}</td>
                <td>${clientName}</td>
                <td><span class="job-status ${job.status}">${job.status}</span></td>
                <td>${createdDate}</td>
                <td>
                    <div class="job-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${job.progress}%"></div>
                        </div>
                        <span class="progress-text">${job.progress}%</span>
                    </div>
                </td>
                <td>
                    <button class="btn-small" onclick="profitTracker.viewJobDetails('${job.id}')">View</button>
                    <button class="btn-small" onclick="profitTracker.editJob('${job.id}')">Edit</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updateJobStats() {
        const totalJobs = this.jobs.length;
        const activeJobs = this.jobs.filter(j => j.status === 'active').length;
        const completedJobs = this.jobs.filter(j => j.status === 'completed').length;

        document.getElementById('total-jobs').textContent = totalJobs;
        document.getElementById('active-jobs').textContent = activeJobs;
        document.getElementById('completed-jobs').textContent = completedJobs;
    }

    populateJobClientFilter() {
        const select = document.getElementById('job-client-filter');
        select.innerHTML = '<option value="">All Clients</option>';
        
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.company ? `${customer.name} (${customer.company})` : customer.name;
            select.appendChild(option);
        });
    }

    filterJobs() {
        const searchTerm = document.getElementById('job-search').value.toLowerCase();
        const statusFilter = document.getElementById('job-status-filter').value;
        const clientFilter = document.getElementById('job-client-filter').value;
        const rows = document.querySelectorAll('#job-list-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const statusMatch = !statusFilter || row.querySelector('.job-status').textContent === statusFilter;
            const clientMatch = !clientFilter || row.cells[1].textContent.includes(clientFilter);
            const searchMatch = !searchTerm || text.includes(searchTerm);
            
            if (statusMatch && clientMatch && searchMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    getClientById(clientId) {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        return customers.find(c => c.id === clientId);
    }

    getClientNameById(clientId) {
        const client = this.getClientById(clientId);
        return client ? (client.company ? `${client.name} (${client.company})` : client.name) : '';
    }

    getJobNameById(jobId) {
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const job = jobs.find(j => j.id === jobId);
        return job ? job.name : '';
    }

    viewJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            const client = this.getClientById(job.clientId);
            const clientName = client ? (client.company ? `${client.name} (${client.company})` : client.name) : 'Unknown Client';
            
            alert(`Job Details:\n\nName: ${job.name}\nClient: ${clientName}\nStatus: ${job.status}\nPriority: ${job.priority}\nStart Date: ${job.startDate || 'Not set'}\nEnd Date: ${job.endDate || 'Not set'}\nEstimated Hours: ${job.estimatedHours}\nHourly Rate: $${job.hourlyRate}\nProgress: ${job.progress}%\nDescription: ${job.description || 'None'}\nNotes: ${job.notes || 'None'}`);
        }
    }

    editJob(jobId) {
        // For now, just show details - can be extended to open edit modal
        this.viewJobDetails(jobId);
    }

    // Workflow Guide Methods
    openWorkflowGuide() {
        document.getElementById('workflow-guide-modal').style.display = 'flex';
        this.currentWorkflowStep = 1;
        this.updateWorkflowDisplay();
        this.loadWorkflowSettings();
    }

    closeWorkflowGuide() {
        document.getElementById('workflow-guide-modal').style.display = 'none';
        this.currentWorkflowStep = 1;
        this.updateWorkflowDisplay();
    }

    nextWorkflowStep() {
        if (this.currentWorkflowStep < 6) {
            this.currentWorkflowStep++;
            this.updateWorkflowDisplay();
        }
    }

    prevWorkflowStep() {
        if (this.currentWorkflowStep > 1) {
            this.currentWorkflowStep--;
            this.updateWorkflowDisplay();
        }
    }

    goToWorkflowStep(step) {
        this.currentWorkflowStep = step;
        this.updateWorkflowDisplay();
    }

    updateWorkflowDisplay() {
        // Update step visibility
        document.querySelectorAll('.workflow-step').forEach((step, index) => {
            if (index + 1 === this.currentWorkflowStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index + 1 === this.currentWorkflowStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update progress bar
        const progress = (this.currentWorkflowStep / 6) * 100;
        document.getElementById('workflow-progress-fill').style.width = `${progress}%`;

        // Update progress text
        document.getElementById('current-workflow-step').textContent = this.currentWorkflowStep;

        // Update navigation buttons
        const prevBtn = document.getElementById('workflow-prev');
        const nextBtn = document.getElementById('workflow-next');
        const finishBtn = document.getElementById('workflow-finish');

        prevBtn.style.display = this.currentWorkflowStep > 1 ? 'block' : 'none';
        
        if (this.currentWorkflowStep === 6) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            finishBtn.style.display = 'none';
        }
    }

    openWorkflowAction(action) {
        // Close the workflow guide first
        this.closeWorkflowGuide();
        
        // Small delay to allow modal to close
        setTimeout(() => {
            switch(action) {
                case 'add-client':
                    this.openClientTracker();
                    setTimeout(() => this.openAddCustomerModal(), 100);
                    break;
                    
                case 'add-job':
                    this.openClientTracker();
                    setTimeout(() => {
                        this.switchTab('jobs');
                        setTimeout(() => this.openAddJobModal(), 100);
                    }, 100);
                    break;
                    
                case 'add-task':
                    this.openAddTaskModal();
                    break;
                    
                case 'daily-logging':
                    this.openDailyLogging();
                    break;
                    
                case 'profit-tracker':
                    this.openProfitTracker();
                    break;
                    
                case 'smart-scheduler':
                    this.openSmartScheduler();
                    break;
                    
                case 'create-invoice':
                    window.open('invoice.html', '_blank');
                    break;
                    
                default:
                    console.log('Unknown workflow action:', action);
            }
        }, 200);
    }

    startDailyWorkflow() {
        // Open workflow guide and set preference for daily use
        localStorage.setItem('useDailyWorkflow', 'true');
        this.openWorkflowGuide();
        
        // Show a helpful message
        this.showMessage('🚀 Starting your daily workflow! Use the buttons in each step to navigate efficiently.', 'success');
    }

    checkDailyWorkflowPreference() {
        // Check if user wants to auto-open workflow guide
        const useDailyWorkflow = localStorage.getItem('useDailyWorkflow');
        const lastWorkflowDate = localStorage.getItem('lastWorkflowDate');
        const today = new Date().toDateString();
        
        // Auto-open workflow guide if:
        // 1. User has enabled daily workflow preference
        // 2. It's a new day (not already opened today)
        if (useDailyWorkflow === 'true' && lastWorkflowDate !== today) {
            setTimeout(() => {
                this.openWorkflowGuide();
                localStorage.setItem('lastWorkflowDate', today);
            }, 1000); // Small delay to let page load
        }
    }

    loadWorkflowSettings() {
        // Load the current state of daily workflow toggle
        const useDailyWorkflow = localStorage.getItem('useDailyWorkflow');
        const toggle = document.getElementById('daily-workflow-toggle');
        
        if (toggle) {
            toggle.checked = useDailyWorkflow === 'true';
        }
    }

    // Task Management Methods
    openAddTaskModal() {
        document.getElementById('add-task-modal').style.display = 'flex';
        this.clearAddTaskForm();
        this.populateTaskClientDropdown();
        this.populateTaskJobDropdown();
    }

    closeAddTaskModal() {
        document.getElementById('add-task-modal').style.display = 'none';
        this.clearAddTaskForm();
    }

    clearAddTaskForm() {
        document.getElementById('add-task-form').reset();
        // Set default values
        document.getElementById('task-category').value = 'billable';
        document.getElementById('task-duration').value = '2';
        document.getElementById('task-rate').value = '75';
        this.calculateTaskTotal();
    }

    calculateTaskTotal() {
        const duration = parseFloat(document.getElementById('task-duration').value) || 0;
        const rate = parseFloat(document.getElementById('task-rate').value) || 0;
        const total = duration * rate;
        document.getElementById('task-total').value = total.toFixed(2);
    }

    saveNewTask() {
        const taskData = {
            id: Date.now().toString(),
            title: document.getElementById('task-title').value.trim(),
            clientId: document.getElementById('task-client').value,
            jobId: document.getElementById('task-job').value,
            category: document.getElementById('task-category').value,
            duration: parseFloat(document.getElementById('task-duration').value),
            rate: parseFloat(document.getElementById('task-rate').value),
            total: parseFloat(document.getElementById('task-total').value),
            description: document.getElementById('task-description').value.trim(),
            createdAt: new Date().toISOString(),
            scheduled: false,
            scheduledDate: null,
            scheduledTime: null
        };

        // Validate required fields
        if (!taskData.title) {
            this.showMessage('Please enter task title', 'error');
            return;
        }

        if (!taskData.duration || taskData.duration <= 0) {
            this.showMessage('Please enter valid duration', 'error');
            return;
        }

        // Load existing tasks
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Add new task
        tasks.push(taskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Update task display
        this.loadTasks();

        this.showMessage('Task added successfully!', 'success');
        this.closeAddTaskModal();
    }

    populateTaskClientDropdown() {
        const select = document.getElementById('task-client');
        select.innerHTML = '<option value="">Select a client</option>';
        
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.company ? `${customer.name} (${customer.company})` : customer.name;
            select.appendChild(option);
        });
    }

    populateTaskJobDropdown() {
        const select = document.getElementById('task-job');
        select.innerHTML = '<option value="">Select a job (optional)</option>';
        
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        jobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.name;
            select.appendChild(option);
        });
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Clear existing tasks
        document.querySelectorAll('.task-list').forEach(list => {
            list.innerHTML = '';
        });

        // Group tasks by category
        const billableTasks = tasks.filter(task => task.category === 'billable' && !task.scheduled);
        const salesTasks = tasks.filter(task => task.category === 'sales' && !task.scheduled);
        const adminTasks = tasks.filter(task => task.category === 'admin' && !task.scheduled);

        // Render tasks
        this.renderTaskList('billable-tasks', billableTasks);
        this.renderTaskList('sales-tasks', salesTasks);
        this.renderTaskList('admin-tasks', adminTasks);
    }

    renderTaskList(containerId, tasks) {
        const container = document.getElementById(containerId);
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.draggable = true;
            taskElement.dataset.taskId = task.id;
            
            // Get client and job names
            const clientName = task.clientId ? this.getClientNameById(task.clientId) : '';
            const jobName = task.jobId ? this.getJobNameById(task.jobId) : '';
            
            taskElement.innerHTML = `
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <span class="task-drag-handle">⋮⋮</span>
                </div>
                <div class="task-details">
                    ${clientName ? `<div class="task-detail"><strong>Client:</strong> ${clientName}</div>` : ''}
                    ${jobName ? `<div class="task-detail"><strong>Job:</strong> ${jobName}</div>` : ''}
                    <div class="task-detail"><strong>Duration:</strong> ${task.duration}h</div>
                    <div class="task-detail"><strong>Rate:</strong> $${task.rate}/h</div>
                    <div class="task-detail"><strong>Total:</strong> $${task.total.toFixed(2)}</div>
                </div>
            `;

            // Add drag event listeners
            taskElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
                taskElement.classList.add('dragging');
            });

            taskElement.addEventListener('dragend', () => {
                taskElement.classList.remove('dragging');
            });

            container.appendChild(taskElement);
        });
    }

    initializeDragAndDrop() {
        // Make calendar days droppable
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('dragover', (e) => {
                e.preventDefault();
                day.classList.add('drag-over');
            });

            day.addEventListener('dragleave', () => {
                day.classList.remove('drag-over');
            });

            day.addEventListener('drop', (e) => {
                e.preventDefault();
                day.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const dateStr = day.dataset.date;
                
                if (taskId && dateStr) {
                    this.scheduleTask(taskId, dateStr);
                }
            });
        });

        // Make trash bin droppable
        const trashBin = document.getElementById('trash-bin');
        trashBin.addEventListener('dragover', (e) => {
            e.preventDefault();
            trashBin.classList.add('drag-over');
        });

        trashBin.addEventListener('dragleave', () => {
            trashBin.classList.remove('drag-over');
        });

        trashBin.addEventListener('drop', (e) => {
            e.preventDefault();
            trashBin.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            if (taskId) {
                this.moveTaskToTrash(taskId);
            }
        });
    }

    scheduleTask(taskId, dateStr) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].scheduled = true;
            tasks[taskIndex].scheduledDate = dateStr;
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Update task display
            this.loadTasks();
            
            // Update calendar
            this.renderCalendarHero();
            
            // Update stats
            this.updateCalendarStats();
            
            this.showMessage('Task scheduled successfully!', 'success');
        }
    }

    moveTaskToTrash(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].trashed = true;
            tasks[taskIndex].trashedAt = new Date().toISOString();
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Update task display
            this.loadTasks();
            
            // Update trash count
            this.updateTrashCount();
            
            this.showMessage('Task moved to trash', 'info');
        }
    }

    updateTrashCount() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const trashedCount = tasks.filter(task => task.trashed).length;
        document.getElementById('trash-count').textContent = trashedCount;
    }

    updateCalendarStats() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const scheduledTasks = tasks.filter(task => task.scheduled && !task.trashed);
        
        const totalTasks = scheduledTasks.length;
        const totalHours = scheduledTasks.reduce((sum, task) => sum + task.duration, 0);
        const totalRevenue = scheduledTasks.reduce((sum, task) => sum + task.total, 0);
        
        document.getElementById('scheduled-count').textContent = totalTasks;
        document.getElementById('total-hours').textContent = totalHours.toFixed(1);
        document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
    }

    // Game Mechanics
    initializeGame() {
        this.playerData = JSON.parse(localStorage.getItem('playerData')) || {
            level: 1,
            xp: 0,
            totalXp: 0,
            title: 'Startup Founder',
            completedTasks: 0,
            totalRevenue: 0,
            achievements: []
        };
        
        this.updatePlayerProfile();
        this.updateBusinessStats();
        this.updateAchievements();
    }

    updatePlayerProfile() {
        document.getElementById('player-level').textContent = this.playerData.level;
        document.getElementById('player-title').textContent = this.playerData.title;
        
        // Calculate XP for current level
        const xpNeeded = this.playerData.level * 100;
        const currentLevelXp = this.playerData.xp % 100;
        const progress = (currentLevelXp / 100) * 100;
        
        document.getElementById('xp-fill').style.width = `${progress}%`;
        document.getElementById('xp-text').textContent = `${currentLevelXp}/${100} XP`;
    }

    updateBusinessStats() {
        document.getElementById('empire-revenue').textContent = `$${this.playerData.totalRevenue.toLocaleString()}`;
        document.getElementById('tasks-completed').textContent = this.playerData.completedTasks;
        document.getElementById('achievement-count').textContent = this.playerData.achievements.length;
        
        // Calculate growth rate (simplified)
        const growthRate = this.playerData.completedTasks > 0 ? Math.min(100, (this.playerData.totalRevenue / 1000) * 10) : 0;
        document.getElementById('empire-growth').textContent = `${growthRate.toFixed(1)}%`;
    }

    addXP(amount, source = 'task') {
        this.playerData.xp += amount;
        this.playerData.totalXp += amount;
        
        // Check for level up
        const newLevel = Math.floor(this.playerData.totalXp / 100) + 1;
        if (newLevel > this.playerData.level) {
            this.levelUp(newLevel);
        }
        
        this.updatePlayerProfile();
        this.savePlayerData();
        
        // Show XP notification
        this.showXPNotification(amount, source);
    }

    levelUp(newLevel) {
        this.playerData.level = newLevel;
        
        // Update title based on level
        const titles = [
            'Startup Founder',
            'Business Builder',
            'Revenue Generator',
            'Task Master',
            'Scheduling Pro',
            'Business Tycoon',
            'Empire Builder',
            'Master CEO'
        ];
        
        this.playerData.title = titles[Math.min(newLevel - 1, titles.length - 1)];
        
        // Show level up notification
        this.showLevelUpNotification(newLevel);
        
        // Check for level-based achievements
        this.checkAchievements();
    }

    showXPNotification(amount, source) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-icon">+${amount} XP</div>
            <div class="xp-source">${source}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
        }, 100);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <div class="level-up-text">
                    <h3>LEVEL UP!</h3>
                    <p>You reached Level ${level}</p>
                    <p class="new-title">${this.playerData.title}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 4000);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first-task',
                condition: () => this.playerData.completedTasks >= 1,
                xp: 50
            },
            {
                id: 'revenue-milestone',
                condition: () => this.playerData.totalRevenue >= 1000,
                xp: 100
            },
            {
                id: 'task-master',
                condition: () => this.playerData.completedTasks >= 10,
                xp: 200
            },
            {
                id: 'scheduling-pro',
                condition: () => this.playerData.completedTasks >= 5,
                xp: 150
            }
        ];

        achievements.forEach(achievement => {
            if (achievement.condition() && !this.playerData.achievements.includes(achievement.id)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.playerData.achievements.push(achievement.id);
        this.addXP(achievement.xp, 'achievement');
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        // Update achievements display
        this.updateAchievements();
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.id.replace('-', ' ').toUpperCase()}</p>
                    <span class="achievement-xp">+${achievement.xp} XP</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 4000);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }

    updateAchievements() {
        const achievementElements = {
            'first-task': {
                progress: Math.min(100, (this.playerData.completedTasks / 1) * 100),
                text: `${Math.min(this.playerData.completedTasks, 1)}/1`
            },
            'revenue-milestone': {
                progress: Math.min(100, (this.playerData.totalRevenue / 1000) * 100),
                text: `$${Math.min(this.playerData.totalRevenue, 1000)}/$1,000`
            },
            'task-master': {
                progress: Math.min(100, (this.playerData.completedTasks / 10) * 100),
                text: `${Math.min(this.playerData.completedTasks, 10)}/10`
            },
            'scheduling-pro': {
                progress: Math.min(100, (this.playerData.completedTasks / 5) * 100),
                text: `${Math.min(this.playerData.completedTasks, 5)}/5`
            }
        };

        Object.keys(achievementElements).forEach(id => {
            const element = document.getElementById(id);
            const progress = achievementElements[id].progress;
            const text = achievementElements[id].text;
            
            if (element) {
                const progressFill = element.querySelector('.progress-fill');
                const progressText = element.querySelector('.progress-text');
                
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }
                
                if (progressText) {
                    progressText.textContent = text;
                }
                
                // Add completed class if 100%
                if (progress >= 100) {
                    element.classList.add('completed');
                }
            }
        });
    }

    completeTask(taskValue = 0) {
        this.playerData.completedTasks++;
        this.playerData.totalRevenue += taskValue;
        
        // Award XP based on task value
        const baseXP = 10;
        const valueXP = Math.floor(taskValue / 10);
        const totalXP = baseXP + valueXP;
        
        this.addXP(totalXP, 'task completion');
        this.updateBusinessStats();
        this.checkAchievements();
        this.savePlayerData();
    }

    savePlayerData() {
        localStorage.setItem('playerData', JSON.stringify(this.playerData));
    }

    // Employee Management Methods
    openEmployeeManagement() {
        const modal = document.getElementById('employee-management-modal');
        modal.style.display = 'flex';
        this.displayEmployeesList();
    }

    closeEmployeeManagement() {
        const modal = document.getElementById('employee-management-modal');
        modal.style.display = 'none';
    }

    saveNewEmployee() {
        const name = document.getElementById('new-employee-name').value.trim();
        const rate = parseFloat(document.getElementById('new-employee-rate').value);

        if (!name) {
            this.showMessage('⚠️ Please enter employee name', 'warning');
            return;
        }

        if (!rate || rate <= 0) {
            this.showMessage('⚠️ Please enter valid hourly rate', 'warning');
            return;
        }

        // Load existing employees
        let employees = JSON.parse(localStorage.getItem('employees')) || [];

        // Check for duplicate
        const exists = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            this.showMessage('⚠️ Employee already exists', 'warning');
            return;
        }

        // Add new employee
        const newEmployee = {
            id: Date.now().toString(),
            name: name,
            hourlyRate: rate,
            createdAt: new Date().toISOString()
        };

        employees.push(newEmployee);
        localStorage.setItem('employees', JSON.stringify(employees));

        // Clear form
        document.getElementById('new-employee-name').value = '';
        document.getElementById('new-employee-rate').value = '';

        // Refresh display
        this.displayEmployeesList();
        this.showMessage('✅ Employee added successfully!', 'success');
    }

    displayEmployeesList() {
        const listContainer = document.getElementById('employees-list-display');
        const employees = JSON.parse(localStorage.getItem('employees')) || [];

        if (employees.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No employees added yet. Add your first employee above.</p>';
            return;
        }

        listContainer.innerHTML = employees.map(emp => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: white; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px;">
                <div>
                    <strong style="font-size: 15px;">${emp.name}</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 2px;">$${emp.hourlyRate.toFixed(2)}/hour</div>
                </div>
                <div>
                    <button class="btn-small" onclick="profitTracker.editEmployee('${emp.id}')" style="margin-right: 5px; background: #2196F3;">Edit</button>
                    <button class="btn-small" onclick="profitTracker.deleteEmployee('${emp.id}')" style="background: #ff4444; color: white;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    editEmployee(employeeId) {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const employee = employees.find(e => e.id === employeeId);
        
        if (!employee) return;

        const newRate = prompt(`Update hourly rate for ${employee.name}:`, employee.hourlyRate);
        
        if (newRate === null) return; // Cancelled
        
        const rate = parseFloat(newRate);
        if (isNaN(rate) || rate <= 0) {
            this.showMessage('⚠️ Invalid rate', 'warning');
            return;
        }

        employee.hourlyRate = rate;
        localStorage.setItem('employees', JSON.stringify(employees));
        this.displayEmployeesList();
        this.showMessage('✅ Employee rate updated!', 'success');
    }

    deleteEmployee(employeeId) {
        if (!confirm('Are you sure you want to delete this employee?')) return;

        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        employees = employees.filter(e => e.id !== employeeId);
        localStorage.setItem('employees', JSON.stringify(employees));
        this.displayEmployeesList();
        this.showMessage('🗑️ Employee deleted', 'info');
    }

    // Daily Business Journal Methods
    openDailyJournal() {
        const modal = document.getElementById('daily-journal-modal');
        modal.style.display = 'flex';
        
        // Set today's date by default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('journal-date').value = today;
        
        // Clear form fields
        document.getElementById('num-customers').value = '';
        document.getElementById('num-employees').value = '';
        document.getElementById('journal-description').value = '';
        
        // Hide and clear customer/employee fields
        document.getElementById('customer-fields-container').style.display = 'none';
        document.getElementById('employee-fields-container').style.display = 'none';
        document.getElementById('customers-list').innerHTML = '';
        document.getElementById('onsite-employees-list').innerHTML = '';
        
        // Reset arrays
        this.journalCustomers = [];
        this.journalEmployees = [];
        
        // Display recent journal entries
        this.displayJournalEntries();
    }

    createCustomerFields(numCustomers) {
        const container = document.getElementById('customers-list');
        const fieldsContainer = document.getElementById('customer-fields-container');
        
        if (numCustomers <= 0) {
            fieldsContainer.style.display = 'none';
            this.journalCustomers = [];
            return;
        }
        
        fieldsContainer.style.display = 'block';
        
        // Create customer objects
        this.journalCustomers = [];
        for (let i = 0; i < numCustomers; i++) {
            this.journalCustomers.push({ id: Date.now() + i, name: '' });
        }
        
        // Render customer fields
        this.renderCustomerFields();
    }

    renderCustomerFields() {
        const container = document.getElementById('customers-list');
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        container.innerHTML = this.journalCustomers.map((jc, index) => {
            return `
                <div class="employee-row" style="margin-bottom: 10px;">
                    <div style="position: relative; grid-column: span 3;">
                        <input type="text" 
                               id="customer-name-${index}"
                               value="${jc.name}" 
                               placeholder="Customer ${index + 1} name..."
                               oninput="profitTracker.updateJournalCustomer(${index}, this.value)"
                               onfocus="profitTracker.showCustomerFieldSuggestions(${index})"
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        <div id="customer-field-suggestions-${index}" class="employee-suggestions-dropdown" style="display: none;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showCustomerFieldSuggestions(index) {
        const input = document.getElementById(`customer-name-${index}`);
        const dropdown = document.getElementById(`customer-field-suggestions-${index}`);
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        if (customers.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        const searchTerm = input.value.toLowerCase().trim();
        
        // Filter customers
        const matches = customers.filter(c => 
            searchTerm === '' || 
            c.name.toLowerCase().includes(searchTerm) || 
            (c.company && c.company.toLowerCase().includes(searchTerm))
        ).slice(0, 8);

        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(customer => {
                const lastContact = customer.lastContact ? 
                    new Date(customer.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                    'Never';
                    
                return `
                    <div class="suggestion-item" 
                         onclick="profitTracker.selectCustomerField(${index}, '${customer.name.replace(/'/g, "\\'")}')"
                         style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;"
                         onmouseover="this.style.background='#f0f0f0'"
                         onmouseout="this.style.background='white'">
                        <strong>${customer.name}</strong>
                        ${customer.company ? `<br><small style="color: #666;">${customer.company}</small>` : ''}
                        <small style="float: right; color: #999;">Last: ${lastContact}</small>
                    </div>
                `;
            }).join('');
            dropdown.style.display = 'block';
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.left = '0';
            dropdown.style.right = '0';
            dropdown.style.background = 'white';
            dropdown.style.border = '1px solid #ddd';
            dropdown.style.borderRadius = '4px';
            dropdown.style.maxHeight = '200px';
            dropdown.style.overflowY = 'auto';
            dropdown.style.zIndex = '1000';
            dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
            dropdown.style.display = 'none';
        }
    }

    selectCustomerField(index, name) {
        this.journalCustomers[index].name = name;
        const input = document.getElementById(`customer-name-${index}`);
        if (input) input.value = name;
        
        const dropdown = document.getElementById(`customer-field-suggestions-${index}`);
        if (dropdown) dropdown.style.display = 'none';
    }

    updateJournalCustomer(index, value) {
        console.log('Updating customer', index, 'with value:', value);
        if (this.journalCustomers[index]) {
            this.journalCustomers[index].name = value;
            console.log('Customer updated. Array:', this.journalCustomers);
        } else {
            console.warn('Customer index', index, 'does not exist in array');
        }
        this.showCustomerFieldSuggestions(index);
    }

    createEmployeeFields(numEmployees) {
        const container = document.getElementById('onsite-employees-list');
        const fieldsContainer = document.getElementById('employee-fields-container');
        
        if (numEmployees <= 0) {
            fieldsContainer.style.display = 'none';
            this.journalEmployees = [];
            return;
        }
        
        fieldsContainer.style.display = 'block';
        
        // Create employee objects
        this.journalEmployees = [];
        for (let i = 0; i < numEmployees; i++) {
            this.journalEmployees.push({ 
                id: Date.now() + i, 
                name: '', 
                hours: 0 
            });
        }
        
        // Render employee fields
        this.renderJournalEmployees();
    }

    setupCustomerAutocomplete() {
        const customerInput = document.getElementById('journal-customer');
        const dropdown = document.getElementById('customer-dropdown');

        // Show dropdown when user focuses (even if empty)
        customerInput.addEventListener('focus', () => {
            this.showCustomerSuggestions();
        });

        // Show dropdown when user types
        customerInput.addEventListener('input', () => {
            this.showCustomerSuggestions();
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== customerInput && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    showCustomerSuggestions() {
        const customerInput = document.getElementById('journal-customer');
        const dropdown = document.getElementById('customer-dropdown');
        const searchTerm = customerInput.value.toLowerCase().trim();
        
        // Get customers from database
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        if (customers.length === 0) {
            dropdown.innerHTML = `
                <div style="padding: 15px; text-align: center; color: #888;">
                    <p>No customers yet.</p>
                    <small>Type a new customer name to create one automatically.</small>
                </div>
            `;
            dropdown.style.display = 'block';
            return;
        }
        
        // Filter customers by search term, or show all if search is empty
        let matches = customers;
        if (searchTerm.length > 0) {
            matches = customers.filter(c => 
                c.name.toLowerCase().includes(searchTerm) || 
                (c.company && c.company.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort by most recent contact
        matches.sort((a, b) => {
            const dateA = new Date(a.lastContact || 0);
            const dateB = new Date(b.lastContact || 0);
            return dateB - dateA;
        });
        
        // Limit to top 8 results
        matches = matches.slice(0, 8);

        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(customer => {
                const lastContact = customer.lastContact ? 
                    new Date(customer.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                    'Never';
                
                return `
                    <div class="customer-suggestion" 
                         style="padding: 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                         onmouseover="this.style.background='#f0f0f0'"
                         onmouseout="this.style.background='white'"
                         onclick="profitTracker.selectCustomer('${customer.name.replace(/'/g, "\\'")}')">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="font-size: 15px;">${customer.name}</strong>
                                ${customer.company ? `<br><small style="color: #666;">${customer.company}</small>` : ''}
                            </div>
                            <small style="color: #999;">Last: ${lastContact}</small>
                        </div>
                    </div>
                `;
            }).join('');
            dropdown.style.display = 'block';
        } else if (searchTerm.length > 0) {
            dropdown.innerHTML = `
                <div style="padding: 15px; text-align: center; color: #888;">
                    <p>No matching customers found.</p>
                    <small>Press Save to create "${searchTerm}" as a new customer.</small>
                </div>
            `;
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    selectCustomer(customerName) {
        document.getElementById('journal-customer').value = customerName;
        document.getElementById('customer-dropdown').style.display = 'none';
        
        // Show message that customer was auto-selected
        this.showMessage(`✅ Customer "${customerName}" selected`, 'success');
    }

    renderJournalEmployees() {
        const container = document.getElementById('onsite-employees-list');
        const employees = JSON.parse(localStorage.getItem('employees')) || [];

        // Debug: Log current state
        console.log('Rendering employees. Count:', this.journalEmployees.length, 'Data:', this.journalEmployees);

        // Always ensure there's at least one empty row
        if (this.journalEmployees.length === 0) {
            this.journalEmployees.push({ id: Date.now(), name: '', hours: 0 });
        }

        container.innerHTML = this.journalEmployees.map((je, index) => {
            // Find matching employee by name to get rate
            const matchedEmployee = employees.find(e => 
                e.name.toLowerCase().trim() === je.name.toLowerCase().trim()
            );
            const cost = matchedEmployee ? (matchedEmployee.hourlyRate * je.hours) : 0;
            const rateDisplay = matchedEmployee ? ` @ $${matchedEmployee.hourlyRate.toFixed(2)}/hr` : '';

            return `
                <div class="employee-row">
                    <div style="position: relative;">
                        <input type="text" 
                               id="employee-name-${index}"
                               value="${je.name}" 
                               placeholder="Start typing employee name..."
                               oninput="profitTracker.updateJournalEmployee(${index}, 'name', this.value)"
                               onfocus="profitTracker.showEmployeeSuggestions(${index})"
                               style="width: 100%;">
                        <div id="employee-suggestions-${index}" class="employee-suggestions-dropdown" style="display: none;"></div>
                    </div>
                    <input type="number" 
                           value="${je.hours || ''}" 
                           step="0.5" 
                           min="0" 
                           placeholder="Hours"
                           oninput="profitTracker.updateJournalEmployee(${index}, 'hours', this.value)">
                    <div class="cost-display">
                        ${cost > 0 ? `$${cost.toFixed(2)}${rateDisplay}` : ''}
                    </div>
                </div>
            `;
        }).join('');

        this.updateLaborCostSummary();
    }

    showEmployeeSuggestions(index) {
        const input = document.getElementById(`employee-name-${index}`);
        const dropdown = document.getElementById(`employee-suggestions-${index}`);
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        
        if (employees.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        const searchTerm = input.value.toLowerCase().trim();
        
        // Filter employees
        const matches = employees.filter(e => 
            e.name.toLowerCase().includes(searchTerm)
        );

        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(emp => `
                <div class="suggestion-item" 
                     onclick="profitTracker.selectEmployeeSuggestion(${index}, '${emp.name.replace(/'/g, "\\'")}', ${emp.hourlyRate})"
                     style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'">
                    <strong>${emp.name}</strong><br>
                    <small style="color: #666;">$${emp.hourlyRate.toFixed(2)}/hr</small>
                </div>
            `).join('');
            dropdown.style.display = 'block';
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.left = '0';
            dropdown.style.right = '0';
            dropdown.style.background = 'white';
            dropdown.style.border = '1px solid #ddd';
            dropdown.style.borderRadius = '4px';
            dropdown.style.maxHeight = '200px';
            dropdown.style.overflowY = 'auto';
            dropdown.style.zIndex = '1000';
            dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
            dropdown.style.display = 'none';
        }
    }

    selectEmployeeSuggestion(index, name, rate) {
        // Set the employee name
        this.journalEmployees[index].name = name;
        
        // Auto-fill hours with default 8 if empty
        if (!this.journalEmployees[index].hours || this.journalEmployees[index].hours === 0) {
            this.journalEmployees[index].hours = 8;
        }
        
        // Hide dropdown
        const dropdown = document.getElementById(`employee-suggestions-${index}`);
        if (dropdown) dropdown.style.display = 'none';
        
        // IF: This is the last row (which it usually is)
        // THEN: Auto-create new empty row below
        const isLastRow = index === this.journalEmployees.length - 1;
        if (isLastRow) {
            this.journalEmployees.push({ 
                id: Date.now() + Math.random(), 
                name: '', 
                hours: 0 
            });
        }
        
        // Re-render to show the new row
        this.renderJournalEmployees();
    }

    updateJournalEmployee(index, field, value) {
        const previousRowCount = this.journalEmployees.length;
        
        // Update the field value
        if (field === 'hours') {
            this.journalEmployees[index][field] = parseFloat(value) || 0;
        } else {
            this.journalEmployees[index][field] = value;
            // Show suggestions as user types (without re-rendering)
            this.showEmployeeSuggestions(index);
        }
        
        // Check if we need to add a new row
        // IF: This is the last row AND it has ANY content
        // THEN: Add a new empty row below it
        const isLastRow = index === this.journalEmployees.length - 1;
        const currentRow = this.journalEmployees[index];
        const hasContent = currentRow.name.trim() !== '' || currentRow.hours > 0;
        
        let rowWasAdded = false;
        if (isLastRow && hasContent) {
            console.log('AUTO-CREATING NEW ROW - Last row has content:', currentRow);
            // Add new empty row
            this.journalEmployees.push({ 
                id: Date.now() + Math.random(), 
                name: '', 
                hours: 0 
            });
            rowWasAdded = true;
        }
        
        // Clean up: Remove any empty rows that are NOT the last row
        const totalRows = this.journalEmployees.length;
        const beforeFilter = [...this.journalEmployees];
        this.journalEmployees = this.journalEmployees.filter((je, i) => {
            // Always keep the last row
            if (i === totalRows - 1) return true;
            // Keep rows that have content
            return je.name.trim() !== '' || je.hours > 0;
        });
        
        const rowCountChanged = this.journalEmployees.length !== previousRowCount;
        const rowWasRemoved = this.journalEmployees.length < beforeFilter.length;
        
        // Only re-render if rows were added or removed, not on every keystroke
        if (rowWasAdded || rowWasRemoved || rowCountChanged || field === 'hours') {
            console.log('RE-RENDERING - Row count changed from', previousRowCount, 'to', this.journalEmployees.length);
            this.renderJournalEmployees();
        } else {
            // Just update the cost display without full re-render
            this.updateEmployeeCostDisplay(index);
        }
    }
    
    updateEmployeeCostDisplay(index) {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const je = this.journalEmployees[index];
        const matchedEmployee = employees.find(e => 
            e.name.toLowerCase().trim() === je.name.toLowerCase().trim()
        );
        const cost = matchedEmployee ? (matchedEmployee.hourlyRate * je.hours) : 0;
        const rateDisplay = matchedEmployee ? ` @ $${matchedEmployee.hourlyRate.toFixed(2)}/hr` : '';
        
        // Update just the cost display element if it exists
        const costElement = document.querySelector(`.employee-row:nth-child(${index + 1}) .cost-display`);
        if (costElement) {
            costElement.textContent = cost > 0 ? `$${cost.toFixed(2)}${rateDisplay}` : '';
        }
    }

    updateLaborCostSummary() {
        // Labor costs are now only displayed on the calendar, not in the form
        // This function is kept for compatibility but doesn't update any UI elements
        return;
    }

    closeDailyJournal() {
        const modal = document.getElementById('daily-journal-modal');
        modal.style.display = 'none';
    }

    saveDailyJournal() {
        // Get form values
        const date = document.getElementById('journal-date').value;
        const description = document.getElementById('journal-description').value.trim();

        // Validate inputs
        if (!date || !description) {
            this.showMessage('⚠️ Please fill in date and description', 'warning');
            return;
        }

        // Debug: Check customer data
        console.log('Journal Customers Array:', this.journalCustomers);
        
        // Collect customer data from input fields (in case journalCustomers array isn't updated)
        const customerInputs = document.querySelectorAll('[id^="customer-name-"]');
        console.log('Customer Input Fields:', customerInputs);
        
        // Update journalCustomers from actual input values
        customerInputs.forEach((input, index) => {
            if (this.journalCustomers[index]) {
                this.journalCustomers[index].name = input.value.trim();
            }
        });
        
        console.log('Updated Journal Customers:', this.journalCustomers);
        
        // Validate customers
        const validCustomers = this.journalCustomers.filter(jc => jc.name && jc.name.trim() !== '');
        console.log('Valid Customers:', validCustomers);
        
        if (validCustomers.length === 0) {
            this.showMessage('⚠️ Please enter at least one customer name', 'warning');
            return;
        }

        // Update employee data from input fields
        const employeeNameInputs = document.querySelectorAll('[id^="employee-name-"]');
        employeeNameInputs.forEach((input, index) => {
            if (this.journalEmployees[index]) {
                this.journalEmployees[index].name = input.value.trim();
                // Get hours from the corresponding hours input
                const hoursInput = input.closest('.employee-row').querySelector('input[type="number"]');
                if (hoursInput) {
                    this.journalEmployees[index].hours = parseFloat(hoursInput.value) || 0;
                }
            }
        });
        
        console.log('Updated Journal Employees:', this.journalEmployees);
        
        // Filter out empty employee rows
        const validEmployees = this.journalEmployees.filter(je => je.name && je.hours > 0);
        console.log('Valid Employees:', validEmployees);
        
        // Validate employees
        if (validEmployees.length === 0) {
            this.showMessage('⚠️ Please add at least one employee with hours worked', 'warning');
            return;
        }

        // Get employee database
        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        
        // Calculate labor costs and auto-create employees if needed
        let totalLaborHours = 0;
        let totalLaborCost = 0;
        let employeeDetails;
        
        try {
            employeeDetails = validEmployees.map(je => {
                // Find or create employee
                let employee = employees.find(e => 
                    e.name.toLowerCase() === je.name.toLowerCase()
                );
                
                // If employee doesn't exist, prompt for rate and create
                if (!employee) {
                    const rate = prompt(`"${je.name}" is not in the employee database.\n\nEnter hourly rate for ${je.name}:`, '20.00');
                    if (rate === null) {
                        throw new Error('Cancelled'); // User cancelled
                    }
                    const hourlyRate = parseFloat(rate);
                    if (isNaN(hourlyRate) || hourlyRate <= 0) {
                        throw new Error(`Invalid rate for ${je.name}`);
                    }
                    
                    // Create new employee
                    employee = {
                        id: Date.now().toString() + Math.random(),
                        name: je.name,
                        hourlyRate: hourlyRate,
                        createdAt: new Date().toISOString()
                    };
                    employees.push(employee);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
                
                const cost = employee.hourlyRate * je.hours;
                totalLaborHours += je.hours;
                totalLaborCost += cost;
                
                return {
                    employeeId: employee.id,
                    employeeName: employee.name,
                    hours: je.hours,
                    rate: employee.hourlyRate,
                    cost: cost
                };
            });
        } catch (error) {
            if (error.message === 'Cancelled') {
                this.showMessage('⚠️ Journal entry cancelled', 'info');
            } else {
                this.showMessage('⚠️ ' + error.message, 'warning');
            }
            return;
        }

        // Step 1: Create or find customers in client database
        const customerDetails = validCustomers.map(jc => {
            const customerId = this.createOrUpdateCustomer(jc.name);
            return {
                customerId: customerId,
                customerName: jc.name
            };
        });

        // Step 2: Create journal entry object
        const entry = {
            id: Date.now(),
            date: date,
            customers: customerDetails,
            employees: employeeDetails,
            totalLaborHours: totalLaborHours,
            totalLaborCost: totalLaborCost,
            description: description,
            timestamp: new Date().toISOString()
        };

        // Step 3: Save journal entry to localStorage
        let journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];
        journalEntries.unshift(entry);
        localStorage.setItem('dailyJournalEntries', JSON.stringify(journalEntries));

        // Step 4: Track labor as an expense
        this.trackLaborExpense(date, totalLaborCost, employeeDetails);

        // Step 5: Create a calendar task for this journal entry
        this.createCalendarTaskFromJournal(entry);

        // Show success message
        this.showMessage(`✅ Journal saved! Labor cost: $${totalLaborCost.toFixed(2)} tracked as expense!`, 'success');

        // Clear form
        document.getElementById('num-customers').value = '';
        document.getElementById('num-employees').value = '';
        document.getElementById('journal-description').value = '';
        document.getElementById('customer-fields-container').style.display = 'none';
        document.getElementById('employee-fields-container').style.display = 'none';
        this.journalCustomers = [];
        this.journalEmployees = [];

        // Refresh displays
        this.displayJournalEntries();
        this.renderCalendarHero();
        this.updateCalendarStats();

        // Award XP for completing journal entry
        if (this.playerData) {
            this.addXP(20, 'daily journal entry with labor tracking');
        }
    }

    trackLaborExpense(date, totalCost, employeeDetails) {
        // Get existing daily profit entries
        let dailyProfitEntries = JSON.parse(localStorage.getItem('dailyProfitEntries')) || [];
        
        // Find or create entry for this date
        let dateEntry = dailyProfitEntries.find(entry => entry.date === date);
        
        if (!dateEntry) {
            dateEntry = {
                date: date,
                revenue: [],
                expenses: [],
                notes: '',
                timestamp: new Date().toISOString()
            };
            dailyProfitEntries.push(dateEntry);
        }

        // Add labor expense
        const laborExpense = {
            id: Date.now().toString(),
            description: `Labor: ${employeeDetails.map(e => `${e.employeeName} (${e.hours}h)`).join(', ')}`,
            amount: totalCost,
            category: 'labor',
            timestamp: new Date().toISOString()
        };

        dateEntry.expenses.push(laborExpense);
        
        // Save back to localStorage
        localStorage.setItem('dailyProfitEntries', JSON.stringify(dailyProfitEntries));
    }

    createOrUpdateCustomer(customerName) {
        // Load existing customers
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        // Check if customer already exists (case-insensitive)
        const existingCustomer = customers.find(c => 
            c.name.toLowerCase() === customerName.toLowerCase()
        );

        if (existingCustomer) {
            // Update last contact date
            existingCustomer.lastContact = new Date().toISOString().split('T')[0];
            localStorage.setItem('customers', JSON.stringify(customers));
            return existingCustomer.id;
        }

        // Create new customer
        const newCustomer = {
            id: Date.now().toString(),
            name: customerName,
            company: '',
            email: '',
            phone: '',
            address: '',
            warmthScore: 7, // Default to warm
            status: 'client', // Assume they're a client since work was done
            notes: 'Created automatically from Daily Business Journal',
            lastContact: new Date().toISOString().split('T')[0],
            totalInvoices: 0,
            totalAmount: 0
        };

        customers.push(newCustomer);
        localStorage.setItem('customers', JSON.stringify(customers));

        // Reload clients if tracker is open
        if (this.clients) {
            this.loadClients();
        }

        return newCustomer.id;
    }

    createCalendarTaskFromJournal(journalEntry) {
        // Load existing tasks
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Create employee details string
        const employeeInfo = journalEntry.employees.map(e => 
            `${e.employeeName}: ${e.hours}h @ $${e.rate.toFixed(2)}/hr = $${e.cost.toFixed(2)}`
        ).join('\n');

        // Create customer list string
        const customerInfo = journalEntry.customers ? 
            journalEntry.customers.map(c => c.customerName).join(', ') : 
            (journalEntry.customer || 'Unknown');

        // Create a new task for the calendar
        const calendarTask = {
            id: `journal-${journalEntry.id}`,
            title: `${customerInfo} - ${journalEntry.description}`,
            clientId: journalEntry.customers ? journalEntry.customers[0].customerId : journalEntry.customerId,
            jobId: '',
            category: 'billable',
            duration: journalEntry.totalLaborHours,
            rate: 0, // Can be filled in later
            total: 0,
            description: `Customers: ${customerInfo}\n\nEmployees On Site:\n${employeeInfo}\n\nTotal Labor Cost: $${journalEntry.totalLaborCost.toFixed(2)}\n\n${journalEntry.description}`,
            createdAt: journalEntry.timestamp,
            scheduled: true,
            scheduledDate: journalEntry.date,
            scheduledTime: '09:00', // Default time
            completed: true, // Mark as completed since work is already done
            journalEntry: true, // Flag to identify this came from journal
            laborCost: journalEntry.totalLaborCost
        };

        // Check if task already exists for this journal entry
        const existingTaskIndex = tasks.findIndex(t => t.id === calendarTask.id);
        
        if (existingTaskIndex >= 0) {
            // Update existing task
            tasks[existingTaskIndex] = calendarTask;
        } else {
            // Add new task
            tasks.push(calendarTask);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Reload tasks display
        if (this.loadTasks) {
            this.loadTasks();
        }
    }

    displayJournalEntries() {
        const entriesList = document.getElementById('journal-entries-list');
        const journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];

        if (journalEntries.length === 0) {
            entriesList.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No journal entries yet. Create your first entry!</p>';
            return;
        }

        // Display the most recent 10 entries
        const recentEntries = journalEntries.slice(0, 10);
        
        entriesList.innerHTML = recentEntries.map(entry => {
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            // Handle both old and new format
            let employeeInfo = '';
            if (entry.employees && entry.employees.length > 0) {
                employeeInfo = entry.employees.map(e => 
                    `<div style="margin-left: 15px; color: #666; font-size: 13px;">• ${e.employeeName}: ${e.hours}h @ $${e.rate.toFixed(2)}/hr = $${e.cost.toFixed(2)}</div>`
                ).join('');
            } else if (entry.onsite) {
                // Old format support
                employeeInfo = `<div style="margin-left: 15px; color: #666; font-size: 13px;">${entry.onsite} - ${entry.hours} hours</div>`;
            }

            // Handle customers (new multi-customer format or old single customer format)
            let customerDisplay = '';
            if (entry.customers && entry.customers.length > 0) {
                customerDisplay = entry.customers.map(c => c.customerName).join(', ');
            } else if (entry.customer) {
                customerDisplay = entry.customer;
            }

            return `
                <div class="journal-entry-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: #f9f9f9;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <strong style="color: #333; font-size: 16px;">${formattedDate}</strong>
                            <span style="margin-left: 10px; padding: 2px 8px; background: #4CAF50; color: white; border-radius: 4px; font-size: 11px;">📅 On Calendar</span>
                            <span style="margin-left: 5px; padding: 2px 8px; background: #2196F3; color: white; border-radius: 4px; font-size: 11px;">👤 In Client DB</span>
                            ${entry.totalLaborCost ? `<span style="margin-left: 5px; padding: 2px 8px; background: #dc3545; color: white; border-radius: 4px; font-size: 11px;">💰 Expense Tracked</span>` : ''}
                        </div>
                        <button class="btn-small" onclick="profitTracker.deleteJournalEntry(${entry.id})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>Customer${entry.customers && entry.customers.length > 1 ? 's' : ''}:</strong> ${customerDisplay}
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>Employees On Site:</strong>
                        ${employeeInfo}
                    </div>
                    ${entry.totalLaborHours ? `
                        <div style="margin-bottom: 8px; background: white; padding: 8px; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span><strong>Total Labor Hours:</strong></span>
                                <span>${entry.totalLaborHours.toFixed(1)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                                <span><strong>Total Labor Cost:</strong></span>
                                <span style="color: #dc3545; font-weight: bold;">$${entry.totalLaborCost.toFixed(2)}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div style="margin-bottom: 8px;">
                        <strong>Description:</strong> ${entry.description}
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteJournalEntry(entryId) {
        if (confirm('Are you sure you want to delete this journal entry? This will also remove it from the calendar and update the client database.')) {
            // Delete journal entry
            let journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];
            journalEntries = journalEntries.filter(entry => entry.id !== entryId);
            localStorage.setItem('dailyJournalEntries', JSON.stringify(journalEntries));

            // Delete associated calendar task
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks = tasks.filter(task => task.id !== `journal-${entryId}`);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Refresh all displays
            this.displayJournalEntries();
            this.renderCalendarHero();
            this.updateCalendarStats();
            
            if (this.loadTasks) {
                this.loadTasks();
            }

            this.showMessage('🗑️ Journal entry, calendar event, and client link removed', 'info');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profitTracker = new ProfitTracker();
    
    // Initialize the dashboard
    window.profitTracker.init();
    window.profitTracker.renderCalendarHero();
    window.profitTracker.loadInvoices();
    window.profitTracker.updateSummaryStats();
    
    // Initialize task management
    window.profitTracker.loadTasks();
    window.profitTracker.updateTrashCount();
    window.profitTracker.updateCalendarStats();
    window.profitTracker.initializeDragAndDrop();
    
    // Initialize game mechanics
    window.profitTracker.initializeGame();
    
    // Refresh data when returning from invoice page
    window.addEventListener('focus', () => {
        window.profitTracker.refreshData();
    });
});

