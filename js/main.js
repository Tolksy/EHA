// QuickBooks-style Invoice & Profit Tracker
class InvoiceManager {
    constructor() {
        this.invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.schedule = JSON.parse(localStorage.getItem('schedule')) || [];
        this.nextInvoiceNumber = parseInt(localStorage.getItem('nextInvoiceNumber')) || 1001;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderInvoices();
        this.setupCalendar();
        this.updateDashboard();
        this.setDefaultDates();
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoice-search').value = '';
        document.getElementById('start-date').value = this.getFirstDayOfMonth();
        document.getElementById('end-date').value = today;
        document.getElementById('schedule-date').value = today;
    }

    getFirstDayOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Invoice management
        document.getElementById('new-invoice-btn').addEventListener('click', () => this.openInvoiceDialog());
        document.getElementById('invoice-search').addEventListener('input', (e) => this.filterInvoices(e.target.value));
        document.getElementById('invoice-status-filter').addEventListener('change', (e) => this.filterByStatus(e.target.value));
        
        // Invoice dialog
        document.getElementById('add-item-btn').addEventListener('click', () => this.addInvoiceItem());
        document.getElementById('save-invoice').addEventListener('click', () => this.saveInvoice());
        document.getElementById('cancel-invoice').addEventListener('click', () => this.closeInvoiceDialog());

        // Calendar controls
        document.getElementById('today-btn').addEventListener('click', () => this.goToToday());
        document.getElementById('week-btn').addEventListener('click', () => this.showWeekView());
        document.getElementById('month-btn').addEventListener('click', () => this.showMonthView());

        // Reports
        document.getElementById('run-report-btn').addEventListener('click', () => this.generateReport());
        document.getElementById('basis-select').addEventListener('change', () => this.generateReport());
        document.getElementById('interval-select').addEventListener('change', () => this.generateReport());
        document.getElementById('start-date').addEventListener('change', () => this.generateReport());
        document.getElementById('end-date').addEventListener('change', () => this.generateReport());
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show corresponding panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Load tab-specific content
        switch(tabName) {
            case 'invoices':
                this.renderInvoices();
                break;
            case 'schedule':
                this.renderCalendar();
                break;
            case 'reports':
                this.generateReport();
                break;
        }
    }

    openInvoiceDialog(invoice = null) {
        const dialog = document.getElementById('invoice-dialog');
        const form = document.getElementById('invoice-form');
        
        if (invoice) {
            this.populateInvoiceForm(invoice);
        } else {
            form.reset();
            document.getElementById('inv-number').value = this.nextInvoiceNumber;
            document.getElementById('inv-issue').value = new Date().toISOString().split('T')[0];
            document.getElementById('inv-due').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            document.getElementById('inv-service-date').value = new Date().toISOString().split('T')[0];
            this.clearInvoiceItems();
        }
        
        dialog.showModal();
        this.updateInvoiceTotals();
    }

    populateInvoiceForm(invoice) {
        document.getElementById('inv-number').value = invoice.number;
        document.getElementById('inv-customer').value = invoice.customer;
        document.getElementById('inv-issue').value = invoice.issueDate;
        document.getElementById('inv-due').value = invoice.dueDate;
        document.getElementById('inv-service-date').value = invoice.serviceDate;
        document.getElementById('inv-service-start').value = invoice.serviceStartTime || '';
        document.getElementById('inv-service-end').value = invoice.serviceEndTime || '';
        document.getElementById('inv-status').value = invoice.status;
        
        this.clearInvoiceItems();
        invoice.items.forEach(item => {
            this.addInvoiceItem(item);
        });
    }

    addInvoiceItem(item = null) {
        const tbody = document.getElementById('item-rows');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><input type="text" class="item-description" value="${item?.description || ''}" placeholder="Service description"></td>
            <td><input type="number" class="item-qty" value="${item?.qty || 1}" min="0" step="0.01"></td>
            <td><input type="number" class="item-rate" value="${item?.rate || 0}" min="0" step="0.01" placeholder="0.00"></td>
            <td><input type="number" class="item-total" value="${item?.total || 0}" readonly></td>
            <td><button type="button" class="action-btn delete-btn remove-item">Remove</button></td>
        `;
        
        tbody.appendChild(row);
        
        // Add event listeners
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateInvoiceTotals());
        });
        
        row.querySelector('.remove-item').addEventListener('click', () => {
            row.remove();
            this.updateInvoiceTotals();
        });
        
        this.updateInvoiceTotals();
    }

    clearInvoiceItems() {
        document.getElementById('item-rows').innerHTML = '';
    }

    updateInvoiceTotals() {
        const rows = document.querySelectorAll('#item-rows tr');
        let subtotal = 0;
        
        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            const total = qty * rate;
            
            row.querySelector('.item-total').value = total.toFixed(2);
            subtotal += total;
        });
        
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('tax').textContent = tax.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
        document.getElementById('balance').textContent = total.toFixed(2);
    }

    saveInvoice() {
        const form = document.getElementById('invoice-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const invoiceData = {
            number: document.getElementById('inv-number').value,
            customer: document.getElementById('inv-customer').value,
            issueDate: document.getElementById('inv-issue').value,
            dueDate: document.getElementById('inv-due').value,
            serviceDate: document.getElementById('inv-service-date').value,
            serviceStartTime: document.getElementById('inv-service-start').value,
            serviceEndTime: document.getElementById('inv-service-end').value,
            status: document.getElementById('inv-status').value,
            items: [],
            subtotal: parseFloat(document.getElementById('subtotal').textContent),
            tax: parseFloat(document.getElementById('tax').textContent),
            total: parseFloat(document.getElementById('total').textContent),
            balance: parseFloat(document.getElementById('balance').textContent),
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Collect items
        document.querySelectorAll('#item-rows tr').forEach(row => {
            invoiceData.items.push({
                description: row.querySelector('.item-description').value,
                qty: parseFloat(row.querySelector('.item-qty').value),
                rate: parseFloat(row.querySelector('.item-rate').value),
                total: parseFloat(row.querySelector('.item-total').value)
            });
        });
        
        // Check if editing existing invoice
        const existingIndex = this.invoices.findIndex(inv => inv.number === invoiceData.number);
        
        if (existingIndex >= 0) {
            this.invoices[existingIndex] = invoiceData;
        } else {
            this.invoices.push(invoiceData);
            this.nextInvoiceNumber++;
            localStorage.setItem('nextInvoiceNumber', this.nextInvoiceNumber.toString());
        }
        
        this.saveData();
        this.closeInvoiceDialog();
        this.renderInvoices();
        this.showMessage('Invoice saved successfully!', 'success');
    }

    closeInvoiceDialog() {
        document.getElementById('invoice-dialog').close();
    }

    renderInvoices() {
        const tbody = document.querySelector('#invoice-table tbody');
        tbody.innerHTML = '';
        
        this.invoices.forEach(invoice => {
            const row = document.createElement('tr');
            const dueDate = new Date(invoice.dueDate);
            const isOverdue = dueDate < new Date() && invoice.status !== 'paid';
            
            row.innerHTML = `
                <td>${invoice.number}</td>
                <td>${invoice.customer}</td>
                <td>${this.formatDate(invoice.serviceDate)}</td>
                <td class="${isOverdue ? 'text-danger' : ''}">${this.formatDate(invoice.dueDate)}</td>
                <td>$${invoice.total.toFixed(2)}</td>
                <td>$${invoice.balance.toFixed(2)}</td>
                <td><span class="status ${invoice.status}">${invoice.status.replace('_', ' ')}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="invoiceManager.viewInvoice('${invoice.number}')">View</button>
                    <button class="action-btn edit-btn" onclick="invoiceManager.openInvoiceDialog(invoiceManager.invoices.find(inv => inv.number === '${invoice.number}'))">Edit</button>
                    <button class="action-btn delete-btn" onclick="invoiceManager.deleteInvoice('${invoice.number}')">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    filterInvoices(searchTerm) {
        const rows = document.querySelectorAll('#invoice-table tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    filterByStatus(status) {
        const rows = document.querySelectorAll('#invoice-table tbody tr');
        
        rows.forEach(row => {
            if (!status) {
                row.style.display = '';
            return;
            }
            
            const statusElement = row.querySelector('.status');
            const rowStatus = statusElement ? statusElement.classList.contains(status) : false;
            row.style.display = rowStatus ? '' : 'none';
        });
    }

    viewInvoice(invoiceNumber) {
        const invoice = this.invoices.find(inv => inv.number === invoiceNumber);
        if (invoice) {
            this.openInvoiceDialog(invoice);
            // Make form read-only for viewing
            document.querySelectorAll('#invoice-form input, #invoice-form select, #invoice-form button').forEach(el => {
                if (el.id !== 'cancel-invoice') el.disabled = true;
            });
        }
    }

    deleteInvoice(invoiceNumber) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            this.invoices = this.invoices.filter(inv => inv.number !== invoiceNumber);
            this.saveData();
            this.renderInvoices();
            this.showMessage('Invoice deleted successfully!', 'success');
        }
    }

    setupCalendar() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            calendar.appendChild(header);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendar.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dayDate = new Date(year, month, day);
            const today = new Date();
            
            if (this.isSameDate(dayDate, today)) {
                dayElement.classList.add('today');
            }
            
            // Check for appointments
            const hasAppointment = this.schedule.some(appointment => 
                this.isSameDate(new Date(appointment.date), dayDate)
            );
            
            if (hasAppointment) {
                dayElement.classList.add('has-appointment');
                const appointments = this.schedule.filter(appointment => 
                    this.isSameDate(new Date(appointment.date), dayDate)
                );
                dayElement.title = appointments.map(app => `${app.time}: ${app.description}`).join('\n');
            }
            
            dayElement.addEventListener('click', () => this.openScheduleModal(dayDate));
            calendar.appendChild(dayElement);
        }
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    showWeekView() {
        this.renderCalendar();
    }

    showMonthView() {
        this.renderCalendar();
    }

    openScheduleModal(date) {
        const description = prompt('Enter appointment description:');
        if (description) {
            const time = prompt('Enter time (HH:MM):') || '09:00';
            const appointment = {
                id: Date.now(),
                date: date.toISOString().split('T')[0],
                time: time,
                description: description
            };
            this.schedule.push(appointment);
            this.saveData();
            this.renderCalendar();
            this.showMessage('Appointment added!', 'success');
        }
    }

    generateReport() {
        const basis = document.getElementById('basis-select').value;
        const interval = document.getElementById('interval-select').value;
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        
        let filteredInvoices = this.invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.serviceDate);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });
        
        if (basis === 'cash') {
            filteredInvoices = filteredInvoices.filter(invoice => invoice.status === 'paid');
        }
        
        this.renderReportChart(filteredInvoices, interval);
        this.renderReportTable(filteredInvoices, interval);
    }

    renderReportChart(invoices, interval) {
        const canvas = document.getElementById('income-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Group data by interval
        const data = this.groupDataByInterval(invoices, interval);
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        if (labels.length === 0) {
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available for selected period', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const maxValue = Math.max(...values);
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        
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
        const barWidth = chartWidth / labels.length * 0.8;
        const barSpacing = chartWidth / labels.length * 0.2;
        
        ctx.fillStyle = '#007bff';
        values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = canvas.height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
        
        // Draw labels
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        labels.forEach((label, index) => {
            const x = padding + index * (barWidth + barSpacing) + barWidth / 2;
            ctx.fillText(label, x, canvas.height - padding + 20);
        });
        
        // Draw value labels on bars
        ctx.fillStyle = '#007bff';
        ctx.font = '10px Arial';
        values.forEach((value, index) => {
            const x = padding + index * (barWidth + barSpacing) + barWidth / 2;
            const y = canvas.height - padding - (value / maxValue) * chartHeight - 5;
            ctx.fillText('$' + value.toFixed(0), x, y);
        });
    }

    groupDataByInterval(invoices, interval) {
        const groups = {};
        
        invoices.forEach(invoice => {
            const date = new Date(invoice.serviceDate);
            let key;
            
            switch (interval) {
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'quarter':
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    key = `Q${quarter} ${date.getFullYear()}`;
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }
            
            groups[key] = (groups[key] || 0) + invoice.total;
        });
        
        return groups;
    }

    renderReportTable(invoices, interval) {
        const tbody = document.querySelector('#income-table tbody');
        tbody.innerHTML = '';
        
        const data = this.groupDataByInterval(invoices, interval);
        const sortedEntries = Object.entries(data).sort();
        
        let total = 0;
        sortedEntries.forEach(([period, income]) => {
            total += income;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${period}</td>
                <td>$${income.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
        
        // Add total row
        if (sortedEntries.length > 0) {
            const totalRow = document.createElement('tr');
            totalRow.style.fontWeight = 'bold';
            totalRow.style.backgroundColor = '#f8f9fa';
            totalRow.innerHTML = `
                <td>Total</td>
                <td>$${total.toFixed(2)}</td>
            `;
            tbody.appendChild(totalRow);
        }
    }

    updateDashboard() {
        // Update dashboard metrics
        const totalInvoices = this.invoices.length;
        const totalRevenue = this.invoices.reduce((sum, inv) => sum + inv.total, 0);
        const paidRevenue = this.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
        const outstandingBalance = this.invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.balance, 0);
        
        console.log('Dashboard Updated:', { totalInvoices, totalRevenue, paidRevenue, outstandingBalance });
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.querySelector('main').insertBefore(messageDiv, document.querySelector('.tab-panel.active'));
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    saveData() {
        localStorage.setItem('invoices', JSON.stringify(this.invoices));
        localStorage.setItem('customers', JSON.stringify(this.customers));
        localStorage.setItem('schedule', JSON.stringify(this.schedule));
    }
}

// Initialize the application
let invoiceManager;

document.addEventListener('DOMContentLoaded', () => {
    invoiceManager = new InvoiceManager();
});

// Add some sample data if none exists
if (!localStorage.getItem('invoices') || JSON.parse(localStorage.getItem('invoices')).length === 0) {
    const sampleInvoices = [
        {
            number: 1001,
            customer: "John Smith",
            issueDate: "2024-01-15",
            dueDate: "2024-02-14",
            serviceDate: "2024-01-15",
            serviceStartTime: "09:00",
            serviceEndTime: "17:00",
            status: "paid",
            items: [
                { description: "Website Development", qty: 40, rate: 75, total: 3000 },
                { description: "Domain Setup", qty: 1, rate: 15, total: 15 }
            ],
            subtotal: 3015,
            tax: 241.20,
            total: 3256.20,
            balance: 0,
            created: "2024-01-15T10:00:00.000Z",
            updated: "2024-01-15T10:00:00.000Z"
        },
        {
            number: 1002,
            customer: "ABC Corporation",
            issueDate: "2024-01-20",
            dueDate: "2024-02-19",
            serviceDate: "2024-01-20",
            serviceStartTime: "10:00",
            serviceEndTime: "16:00",
            status: "sent",
            items: [
                { description: "Consulting Services", qty: 8, rate: 150, total: 1200 },
                { description: "Report Generation", qty: 1, rate: 500, total: 500 }
            ],
            subtotal: 1700,
            tax: 136,
            total: 1836,
            balance: 1836,
            created: "2024-01-20T14:30:00.000Z",
            updated: "2024-01-20T14:30:00.000Z"
        }
    ];
    
    localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
    localStorage.setItem('nextInvoiceNumber', '1003');
}
