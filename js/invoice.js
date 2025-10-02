// QuickBooks Invoice Page - Standalone Invoice Creation

class QuickBooksInvoice {
    constructor() {
        this.currentInvoice = {
            number: this.getNextInvoiceNumber(),
            customer: '',
            customerEmail: '',
            billingAddress: '',
            terms: 'net-30',
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: this.calculateDueDate(new Date(), 30),
            message: '',
            lineItems: [],
            total: 0,
            balanceDue: 0,
            status: 'draft'
        };
        this.lineItemCounter = 0;
        this.init();
    }

    getNextInvoiceNumber() {
        const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        if (savedInvoices.length === 0) return 1001;
        const lastInvoice = savedInvoices[savedInvoices.length - 1];
        return lastInvoice.number + 1;
    }

    calculateDueDate(invoiceDate, days) {
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(invoiceDate.getDate() + days);
        return dueDate.toISOString().split('T')[0];
    }

    init() {
        this.setupEventListeners();
        this.initializeLineItems();
        this.updateTotals();
        this.setDefaultDates();
        this.updateInvoiceNumber();
    }

    setDefaultDates() {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 30); // Default Net 30

        document.getElementById('invoice-date').value = today.toISOString().split('T')[0];
        document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];
    }

    updateInvoiceNumber() {
        document.querySelector('h1').textContent = `Invoice no. ${this.currentInvoice.number}`;
        document.getElementById('invoice-number').value = this.currentInvoice.number;
        document.title = `Invoice no. ${this.currentInvoice.number}`;
    }

    setupEventListeners() {
        // Customer selection
        document.getElementById('customer-select').addEventListener('change', (e) => {
            this.handleCustomerChange(e.target.value);
        });

        // Customer email
        document.getElementById('customer-email').addEventListener('input', (e) => {
            this.currentInvoice.customerEmail = e.target.value;
        });

        // Billing address
        document.getElementById('billing-address').addEventListener('input', (e) => {
            this.currentInvoice.billingAddress = e.target.value;
        });

        // Terms
        document.getElementById('terms').addEventListener('change', (e) => {
            this.currentInvoice.terms = e.target.value;
            this.updateDueDate();
        });

        // Invoice date
        document.getElementById('invoice-date').addEventListener('change', (e) => {
            this.currentInvoice.invoiceDate = e.target.value;
            this.updateDueDate();
        });

        // Due date
        document.getElementById('due-date').addEventListener('change', (e) => {
            this.currentInvoice.dueDate = e.target.value;
        });

        // Invoice message
        document.getElementById('invoice-message').addEventListener('input', (e) => {
            this.currentInvoice.message = e.target.value;
        });

        // Line item actions
        document.getElementById('add-lines').addEventListener('click', () => {
            this.addLineItem();
        });

        document.getElementById('clear-all-lines').addEventListener('click', () => {
            this.clearAllLines();
        });

        document.getElementById('add-subtotal').addEventListener('click', () => {
            this.addSubtotalLine();
        });

        // Footer actions
        document.querySelector('.btn-cancel').addEventListener('click', () => {
            this.cancelInvoice();
        });

        document.querySelector('.btn-save').addEventListener('click', () => {
            this.saveInvoice();
        });

        document.getElementById('save-and-send').addEventListener('click', () => {
            this.saveAndSendInvoice();
        });

        // Header actions
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeInvoice();
        });

        // Utility buttons
        document.querySelectorAll('.utility-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.closest('.close-btn')) {
                    this.showMessage('Feature coming soon!', 'info');
                }
            });
        });

        // Footer links
        document.querySelectorAll('.footer-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMessage('Feature coming soon!', 'info');
            });
        });
    }

    handleCustomerChange(customerId) {
        this.currentInvoice.customer = customerId;
        
        // Simulate customer data loading
        const customerData = {
            'john-smith': {
                name: 'John Smith',
                email: 'john@example.com',
                address: '123 Main St\nAnytown, ST 12345'
            },
            'abc-corp': {
                name: 'ABC Corporation',
                email: 'billing@abc-corp.com',
                address: '456 Business Ave\nCorporate City, ST 67890'
            },
            'jane-doe': {
                name: 'Jane Doe',
                email: 'jane@example.com',
                address: '789 Residential Rd\nHome Town, ST 54321'
            }
        };

        if (customerData[customerId]) {
            const customer = customerData[customerId];
            document.getElementById('customer-email').value = customer.email;
            document.getElementById('billing-address').value = customer.address;
            this.currentInvoice.customerEmail = customer.email;
            this.currentInvoice.billingAddress = customer.address;
        } else {
            document.getElementById('customer-email').value = '';
            document.getElementById('billing-address').value = '';
            this.currentInvoice.customerEmail = '';
            this.currentInvoice.billingAddress = '';
        }
    }

    updateDueDate() {
        const invoiceDate = new Date(this.currentInvoice.invoiceDate);
        const terms = this.currentInvoice.terms;
        
        let daysToAdd = 30; // Default Net 30
        
        switch (terms) {
            case 'net-15':
                daysToAdd = 15;
                break;
            case 'net-30':
                daysToAdd = 30;
                break;
            case 'net-60':
                daysToAdd = 60;
                break;
            case 'due-on-receipt':
                daysToAdd = 0;
                break;
        }
        
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(invoiceDate.getDate() + daysToAdd);
        
        document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];
        this.currentInvoice.dueDate = dueDate.toISOString().split('T')[0];
    }

    initializeLineItems() {
        const tbody = document.getElementById('line-items-tbody');
        tbody.innerHTML = '';
        
        // Add two initial empty rows
        this.addLineItem();
        this.addLineItem();
    }

    addLineItem() {
        this.lineItemCounter++;
        const tbody = document.getElementById('line-items-tbody');
        const row = document.createElement('tr');
        row.className = 'line-item-row';
        row.dataset.lineId = this.lineItemCounter;
        
        row.innerHTML = `
            <td class="drag-handle">⋮⋮</td>
            <td class="line-number">${this.lineItemCounter}</td>
            <td><input type="date" class="service-date" value="${new Date().toISOString().split('T')[0]}"></td>
            <td><input type="text" class="product-service" placeholder="Product or service"></td>
            <td><input type="text" class="description" placeholder="Description"></td>
            <td><input type="number" class="qty" value="1" min="0" step="0.01"></td>
            <td><input type="number" class="rate" value="0" min="0" step="0.01" placeholder="0.00"></td>
            <td><input type="number" class="amount" value="0" readonly></td>
            <td><button class="delete-line" title="Delete line">🗑️</button></td>
        `;
        
        tbody.appendChild(row);
        
        // Add event listeners for this row
        this.setupLineItemListeners(row);
        
        // Update line numbers
        this.updateLineNumbers();
        
        return row;
    }

    setupLineItemListeners(row) {
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateLineItemTotal(row);
                this.updateTotals();
            });
        });
        
        const deleteBtn = row.querySelector('.delete-line');
        deleteBtn.addEventListener('click', () => {
            row.remove();
            this.updateLineNumbers();
            this.updateTotals();
        });
        
        // Drag handle functionality (basic implementation)
        const dragHandle = row.querySelector('.drag-handle');
        dragHandle.addEventListener('mousedown', (e) => {
            this.startDrag(row, e);
        });
    }

    updateLineItemTotal(row) {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const amount = qty * rate;
        
        row.querySelector('.amount').value = amount.toFixed(2);
        
        // Update line item data
        const lineId = row.dataset.lineId;
        const lineItem = {
            id: lineId,
            serviceDate: row.querySelector('.service-date').value,
            productService: row.querySelector('.product-service').value,
            description: row.querySelector('.description').value,
            qty: qty,
            rate: rate,
            amount: amount
        };
        
        // Update or add line item
        const existingIndex = this.currentInvoice.lineItems.findIndex(item => item.id === lineId);
        if (existingIndex >= 0) {
            this.currentInvoice.lineItems[existingIndex] = lineItem;
        } else {
            this.currentInvoice.lineItems.push(lineItem);
        }
    }

    updateLineNumbers() {
        const rows = document.querySelectorAll('.line-item-row');
        rows.forEach((row, index) => {
            row.querySelector('.line-number').textContent = index + 1;
        });
    }

    updateTotals() {
        let total = 0;
        
        this.currentInvoice.lineItems.forEach(item => {
            total += item.amount;
        });
        
        this.currentInvoice.total = total;
        this.currentInvoice.balanceDue = total;
        
        // Update UI
        document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
        document.getElementById('balance-due').textContent = `$${total.toFixed(2)}`;
        document.getElementById('balance-due-bottom').textContent = `$${total.toFixed(2)}`;
    }

    clearAllLines() {
        if (confirm('Are you sure you want to clear all line items?')) {
            const tbody = document.getElementById('line-items-tbody');
            tbody.innerHTML = '';
            this.currentInvoice.lineItems = [];
            this.lineItemCounter = 0;
            this.updateTotals();
            this.showMessage('All line items cleared', 'success');
        }
    }

    addSubtotalLine() {
        // Add a subtotal line (non-editable)
        const tbody = document.getElementById('line-items-tbody');
        const row = document.createElement('tr');
        row.className = 'subtotal-row';
        row.style.backgroundColor = '#f8f9fa';
        
        const currentTotal = this.currentInvoice.total;
        
        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Subtotal</strong></td>
            <td></td>
            <td></td>
            <td><strong>$${currentTotal.toFixed(2)}</strong></td>
            <td></td>
        `;
        
        tbody.appendChild(row);
        this.showMessage('Subtotal line added', 'success');
    }

    startDrag(row, e) {
        // Basic drag functionality placeholder
        e.preventDefault();
        this.showMessage('Drag functionality coming soon!', 'info');
    }

    saveInvoice() {
        this.collectInvoiceData();
        
        // Save to localStorage
        const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        savedInvoices.push(this.currentInvoice);
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        
        this.showMessage('Invoice saved successfully!', 'success');
        console.log('Invoice saved:', this.currentInvoice);
    }

    saveAndSendInvoice() {
        if (!this.currentInvoice.customer) {
            this.showMessage('Please select a customer first', 'error');
            return;
        }
        
        if (this.currentInvoice.lineItems.length === 0) {
            this.showMessage('Please add at least one line item', 'error');
            return;
        }
        
        this.collectInvoiceData();
        
        // Save to localStorage
        const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        this.currentInvoice.status = 'sent';
        savedInvoices.push(this.currentInvoice);
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        
        this.showMessage('Invoice saved and sent successfully!', 'success');
        console.log('Invoice saved and sent:', this.currentInvoice);
        
        // Redirect back to main page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    collectInvoiceData() {
        this.currentInvoice.customer = document.getElementById('customer-select').value;
        this.currentInvoice.customerEmail = document.getElementById('customer-email').value;
        this.currentInvoice.billingAddress = document.getElementById('billing-address').value;
        this.currentInvoice.terms = document.getElementById('terms').value;
        this.currentInvoice.invoiceDate = document.getElementById('invoice-date').value;
        this.currentInvoice.dueDate = document.getElementById('due-date').value;
        this.currentInvoice.message = document.getElementById('invoice-message').value;
        
        // Collect line items
        this.currentInvoice.lineItems = [];
        document.querySelectorAll('.line-item-row').forEach(row => {
            const lineItem = {
                id: row.dataset.lineId,
                serviceDate: row.querySelector('.service-date').value,
                productService: row.querySelector('.product-service').value,
                description: row.querySelector('.description').value,
                qty: parseFloat(row.querySelector('.qty').value) || 0,
                rate: parseFloat(row.querySelector('.rate').value) || 0,
                amount: parseFloat(row.querySelector('.amount').value) || 0
            };
            this.currentInvoice.lineItems.push(lineItem);
        });
    }

    cancelInvoice() {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            this.showMessage('Invoice cancelled', 'info');
            // Redirect back to main page
            window.location.href = 'index.html';
        }
    }

    closeInvoice() {
        if (confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
            this.showMessage('Invoice closed', 'info');
            // Redirect back to main page
            window.location.href = 'index.html';
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        switch (type) {
            case 'success':
                messageDiv.style.backgroundColor = '#28a745';
                break;
            case 'error':
                messageDiv.style.backgroundColor = '#dc3545';
                break;
            case 'info':
                messageDiv.style.backgroundColor = '#17a2b8';
                break;
            default:
                messageDiv.style.backgroundColor = '#6c757d';
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quickBooksInvoice = new QuickBooksInvoice();
});
