// Daily Business Journal Manager Module
// This is the CORE mycelium network - connects to everything

class JournalManager {
    constructor(profitTracker) {
        this.profitTracker = profitTracker;
        this.journalEmployees = [];
        this.journalCustomers = [];
    }

    // Open the Daily Business Journal modal
    open() {
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
        this.displayEntries();
    }

    // Close the modal
    close() {
        document.getElementById('daily-journal-modal').style.display = 'none';
    }

    // Create customer input fields based on number
    createCustomerFields(numCustomers) {
        const container = document.getElementById('customers-list');
        const fieldsContainer = document.getElementById('customer-fields-container');
        
        if (numCustomers <= 0) {
            fieldsContainer.style.display = 'none';
            this.journalCustomers = [];
            return;
        }
        
        fieldsContainer.style.display = 'block';
        
        this.journalCustomers = [];
        for (let i = 0; i < numCustomers; i++) {
            this.journalCustomers.push({ id: Date.now() + i, name: '' });
        }
        
        this.renderCustomerFields();
    }

    // Create employee input fields based on number
    createEmployeeFields(numEmployees) {
        const container = document.getElementById('onsite-employees-list');
        const fieldsContainer = document.getElementById('employee-fields-container');
        
        if (numEmployees <= 0) {
            fieldsContainer.style.display = 'none';
            this.journalEmployees = [];
            return;
        }
        
        fieldsContainer.style.display = 'block';
        
        this.journalEmployees = [];
        for (let i = 0; i < numEmployees; i++) {
            this.journalEmployees.push({ 
                id: Date.now() + i, 
                name: '', 
                hours: 0 
            });
        }
        
        this.renderEmployeeFields();
    }

    // Save journal entry and trigger mycelium network updates
    save() {
        const date = document.getElementById('journal-date').value;
        const description = document.getElementById('journal-description').value.trim();

        if (!date || !description) {
            this.profitTracker.showMessage('⚠️ Please fill in date and description', 'warning');
            return;
        }

        // Collect data from input fields
        const customerInputs = document.querySelectorAll('[id^="customer-name-"]');
        customerInputs.forEach((input, index) => {
            if (this.journalCustomers[index]) {
                this.journalCustomers[index].name = input.value.trim();
            }
        });
        
        const validCustomers = this.journalCustomers.filter(jc => jc.name && jc.name.trim() !== '');
        
        if (validCustomers.length === 0) {
            this.profitTracker.showMessage('⚠️ Please enter at least one customer name', 'warning');
            return;
        }

        // Collect employee data
        const employeeNameInputs = document.querySelectorAll('[id^="employee-name-"]');
        employeeNameInputs.forEach((input, index) => {
            if (this.journalEmployees[index]) {
                this.journalEmployees[index].name = input.value.trim();
                const hoursInput = input.closest('.employee-row').querySelector('input[type="number"]');
                if (hoursInput) {
                    this.journalEmployees[index].hours = parseFloat(hoursInput.value) || 0;
                }
            }
        });
        
        const validEmployees = this.journalEmployees.filter(je => je.name && je.hours > 0);
        
        if (validEmployees.length === 0) {
            this.profitTracker.showMessage('⚠️ Please add at least one employee with hours worked', 'warning');
            return;
        }

        // Auto-create employees and calculate costs
        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        let employeeDetails;
        
        try {
            employeeDetails = this.processEmployees(validEmployees, employees);
        } catch (error) {
            if (error.message === 'Cancelled') {
                this.profitTracker.showMessage('⚠️ Journal entry cancelled', 'info');
            } else {
                this.profitTracker.showMessage('⚠️ ' + error.message, 'warning');
            }
            return;
        }

        const totalLaborHours = employeeDetails.reduce((sum, e) => sum + e.hours, 0);
        const totalLaborCost = employeeDetails.reduce((sum, e) => sum + e.cost, 0);

        // Create customers in database
        const customerDetails = validCustomers.map(jc => ({
            customerId: this.profitTracker.createOrUpdateCustomer(jc.name),
            customerName: jc.name
        }));

        // Create journal entry
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

        // Save to localStorage
        let journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];
        journalEntries.unshift(entry);
        localStorage.setItem('dailyJournalEntries', JSON.stringify(journalEntries));

        // MYCELIUM NETWORK: Update everything
        this.profitTracker.trackLaborExpense(date, totalLaborCost, employeeDetails);
        this.profitTracker.createCalendarTaskFromJournal(entry);
        
        this.profitTracker.showMessage(`✅ Workflow saved! Updated: Calendar, Customers, Expenses, Dashboard!`, 'success');

        // Clear form
        document.getElementById('num-customers').value = '';
        document.getElementById('num-employees').value = '';
        document.getElementById('journal-description').value = '';
        document.getElementById('customer-fields-container').style.display = 'none';
        document.getElementById('employee-fields-container').style.display = 'none';
        this.journalCustomers = [];
        this.journalEmployees = [];

        // Refresh ALL displays (mycelium network)
        this.displayEntries();
        this.profitTracker.renderCalendarHero();
        this.profitTracker.updateCalendarStats();
        this.profitTracker.updateWorkflowDashboard();

        if (this.profitTracker.playerData) {
            this.profitTracker.addXP(20, 'daily journal entry with labor tracking');
        }
    }

    processEmployees(validEmployees, employees) {
        return validEmployees.map(je => {
            let employee = employees.find(e => 
                e.name.toLowerCase() === je.name.toLowerCase()
            );
            
            if (!employee) {
                const rate = prompt(`"${je.name}" is not in the employee database.\n\nEnter hourly rate for ${je.name}:`, '20.00');
                if (rate === null) throw new Error('Cancelled');
                
                const hourlyRate = parseFloat(rate);
                if (isNaN(hourlyRate) || hourlyRate <= 0) {
                    throw new Error(`Invalid rate for ${je.name}`);
                }
                
                employee = {
                    id: Date.now().toString() + Math.random(),
                    name: je.name,
                    hourlyRate: hourlyRate,
                    createdAt: new Date().toISOString()
                };
                employees.push(employee);
                localStorage.setItem('employees', JSON.stringify(employees));
            }
            
            return {
                employeeId: employee.id,
                employeeName: employee.name,
                hours: je.hours,
                rate: employee.hourlyRate,
                cost: employee.hourlyRate * je.hours
            };
        });
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
                               oninput="window.profitTracker.journalManager.updateJournalCustomer(${index}, this.value)"
                               onfocus="window.profitTracker.journalManager.showCustomerSuggestions(${index})"
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        <div id="customer-field-suggestions-${index}" class="employee-suggestions-dropdown" style="display: none;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEmployeeFields() {
        const container = document.getElementById('onsite-employees-list');
        const employees = JSON.parse(localStorage.getItem('employees')) || [];

        if (this.journalEmployees.length === 0) {
            this.journalEmployees.push({ id: Date.now(), name: '', hours: 0 });
        }

        container.innerHTML = this.journalEmployees.map((je, index) => {
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
                               placeholder="Employee ${index + 1} name..."
                               oninput="window.profitTracker.journalManager.updateJournalEmployee(${index}, 'name', this.value)"
                               onfocus="window.profitTracker.journalManager.showEmployeeSuggestions(${index})"
                               style="width: 100%;">
                        <div id="employee-suggestions-${index}" class="employee-suggestions-dropdown" style="display: none;"></div>
                    </div>
                    <input type="number" 
                           value="${je.hours || ''}" 
                           step="0.5" 
                           min="0" 
                           placeholder="Hours"
                           oninput="window.profitTracker.journalManager.updateJournalEmployee(${index}, 'hours', this.value)">
                    <div class="cost-display">
                        ${cost > 0 ? `$${cost.toFixed(2)}${rateDisplay}` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateJournalCustomer(index, value) {
        if (this.journalCustomers[index]) {
            this.journalCustomers[index].name = value;
        }
    }

    updateJournalEmployee(index, field, value) {
        if (field === 'hours') {
            this.journalEmployees[index][field] = parseFloat(value) || 0;
        } else {
            this.journalEmployees[index][field] = value;
        }
        this.renderEmployeeFields();
    }

    showCustomerSuggestions(index) {
        const input = document.getElementById(`customer-name-${index}`);
        const dropdown = document.getElementById(`customer-field-suggestions-${index}`);
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        if (customers.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        const searchTerm = input.value.toLowerCase().trim();
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
                         onclick="window.profitTracker.journalManager.selectCustomer(${index}, '${customer.name.replace(/'/g, "\\'")}')"
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

    selectCustomer(index, name) {
        this.journalCustomers[index].name = name;
        const input = document.getElementById(`customer-name-${index}`);
        if (input) input.value = name;
        
        const dropdown = document.getElementById(`customer-field-suggestions-${index}`);
        if (dropdown) dropdown.style.display = 'none';
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
        const matches = employees.filter(e => 
            e.name.toLowerCase().includes(searchTerm)
        );

        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(emp => `
                <div class="suggestion-item" 
                     onclick="window.profitTracker.journalManager.selectEmployee(${index}, '${emp.name.replace(/'/g, "\\'")}', ${emp.hourlyRate})"
                     style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;"
                     onmouseover="this.style.background='#f0f0f0'"
                     onmouseout="this.style.background='white'">
                    <strong>${emp.name}</strong><br>
                    <small style="color: #666;">$${emp.hourlyRate.toFixed(2)}/hr</small>
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    selectEmployee(index, name, rate) {
        this.journalEmployees[index].name = name;
        if (!this.journalEmployees[index].hours || this.journalEmployees[index].hours === 0) {
            this.journalEmployees[index].hours = 8;
        }
        this.renderEmployeeFields();
    }

    displayEntries() {
        const entriesList = document.getElementById('journal-entries-list');
        const journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];

        if (journalEntries.length === 0) {
            entriesList.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No journal entries yet. Create your first entry!</p>';
            return;
        }

        const recentEntries = journalEntries.slice(0, 10);
        
        entriesList.innerHTML = recentEntries.map(entry => {
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            let employeeInfo = '';
            if (entry.employees && entry.employees.length > 0) {
                employeeInfo = entry.employees.map(e => 
                    `<div style="margin-left: 15px; color: #666; font-size: 13px;">• ${e.employeeName}: ${e.hours}h @ $${e.rate.toFixed(2)}/hr = $${e.cost.toFixed(2)}</div>`
                ).join('');
            }

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
                        <button class="btn-small" onclick="window.profitTracker.journalManager.deleteEntry(${entry.id})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
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

    deleteEntry(entryId) {
        if (!confirm('Delete this journal entry? This will also remove it from the calendar and expenses.')) return;
        
        let journalEntries = JSON.parse(localStorage.getItem('dailyJournalEntries')) || [];
        journalEntries = journalEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem('dailyJournalEntries', JSON.stringify(journalEntries));

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== `journal-${entryId}`);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        this.displayEntries();
        this.profitTracker.renderCalendarHero();
        this.profitTracker.updateCalendarStats();
        this.profitTracker.updateWorkflowDashboard();
        
        this.profitTracker.showMessage('🗑️ Journal entry deleted - all connected data updated', 'info');
    }
}

