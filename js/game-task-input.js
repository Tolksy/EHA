// Game-Style Task Input JavaScript

class GameTaskInput {
    constructor() {
        this.currentStep = 1;
        this.taskData = {
            title: '',
            client: '',
            category: '',
            duration: 2,
            rate: 100,
            total: 0
        };
        
        this.templates = {
            'hvac-install': {
                title: 'HVAC System Installation',
                duration: 2,
                rate: 100,
                category: 'billable'
            },
            'hvac-repair': {
                title: 'HVAC System Repair',
                duration: 1.5,
                rate: 100,
                category: 'billable'
            },
            'sales-call': {
                title: 'Sales Call',
                duration: 1,
                rate: 75,
                category: 'sales'
            },
            'site-visit': {
                title: 'Site Visit',
                duration: 3,
                rate: 100,
                category: 'billable'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDurationVisual();
        this.updateRevenuePreview();
        this.updateCalendarPreview();
    }
    
    setupEventListeners() {
        // Template cards
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.loadTemplate(template);
                this.addSatisfyingAnimation(card);
            });
        });
        
        // Duration slider
        const durationSlider = document.getElementById('task-duration');
        if (durationSlider) {
            durationSlider.addEventListener('input', (e) => {
                this.taskData.duration = parseFloat(e.target.value);
                this.updateDurationVisual();
                this.updateRevenuePreview();
                this.updateCalendarPreview();
                this.addSliderAnimation();
            });
        }
        
        // Rate buttons
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rate = parseFloat(e.target.dataset.rate);
                this.taskData.rate = rate;
                
                // Update visual state
                document.querySelectorAll('.rate-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update input field
                document.getElementById('task-rate').value = rate;
                
                this.updateRevenuePreview();
                this.updateCalendarPreview();
                this.addSatisfyingAnimation(e.target);
            });
        });
        
        // Rate input field
        const rateInput = document.getElementById('task-rate');
        if (rateInput) {
            rateInput.addEventListener('input', (e) => {
                this.taskData.rate = parseFloat(e.target.value) || 0;
                
                // Update button states
                document.querySelectorAll('.rate-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (parseFloat(btn.dataset.rate) === this.taskData.rate) {
                        btn.classList.add('active');
                    }
                });
                
                this.updateRevenuePreview();
                this.updateCalendarPreview();
            });
        }
        
        // Category selection
        document.querySelectorAll('input[name="task-category"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.taskData.category = e.target.value;
                this.updateCalendarPreview();
                this.addSatisfyingAnimation(e.target.closest('.category-option'));
            });
        });
        
        // Title and client inputs
        const titleInput = document.getElementById('task-title');
        const clientInput = document.getElementById('task-client');
        
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                this.taskData.title = e.target.value;
                this.updateCalendarPreview();
                this.showSuggestions(e.target, 'title');
            });
        }
        
        if (clientInput) {
            clientInput.addEventListener('input', (e) => {
                this.taskData.client = e.target.value;
                this.updateCalendarPreview();
                this.showSuggestions(e.target, 'client');
            });
        }
        
        // Form submission
        const form = document.getElementById('add-task-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }
    }
    
    loadTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;
        
        // Fill in the form with template data
        document.getElementById('task-title').value = template.title;
        this.taskData.title = template.title;
        
        document.getElementById('task-duration').value = template.duration;
        this.taskData.duration = template.duration;
        
        document.getElementById('task-rate').value = template.rate;
        this.taskData.rate = template.rate;
        
        // Update rate button
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.rate) === template.rate) {
                btn.classList.add('active');
            }
        });
        
        // Update category
        document.querySelector(`input[name="task-category"][value="${template.category}"]`).checked = true;
        this.taskData.category = template.category;
        
        // Update all visuals
        this.updateDurationVisual();
        this.updateRevenuePreview();
        this.updateCalendarPreview();
        
        // Add success animation
        this.showSuccessMessage('Template loaded! ✨');
    }
    
    updateDurationVisual() {
        const timeBlocks = document.querySelectorAll('.time-block');
        const duration = this.taskData.duration;
        
        timeBlocks.forEach((block, index) => {
            if (index < duration * 2) { // Each block represents 30 minutes
                block.classList.add('active');
            } else {
                block.classList.remove('active');
            }
        });
        
        // Update duration display
        const durationDisplay = document.getElementById('duration-display');
        if (durationDisplay) {
            if (duration < 1) {
                durationDisplay.textContent = `${Math.round(duration * 60)}min`;
            } else {
                durationDisplay.textContent = `${duration}h`;
            }
        }
    }
    
    updateRevenuePreview() {
        this.taskData.total = this.taskData.duration * this.taskData.rate;
        
        const totalElement = document.getElementById('task-total');
        if (totalElement) {
            totalElement.textContent = `$${this.taskData.total.toFixed(2)}`;
        }
        
        const durationText = document.getElementById('duration-text');
        const rateText = document.getElementById('rate-text');
        
        if (durationText) {
            durationText.textContent = `${this.taskData.duration} hours`;
        }
        
        if (rateText) {
            rateText.textContent = `$${this.taskData.rate}/hr`;
        }
    }
    
    updateCalendarPreview() {
        const previewTask = document.getElementById('preview-task');
        if (!previewTask) return;
        
        const titleElement = previewTask.querySelector('.preview-task-title');
        const clientElement = previewTask.querySelector('.preview-task-client');
        
        if (titleElement) {
            titleElement.textContent = this.taskData.title || 'Your Task Title';
        }
        
        if (clientElement) {
            clientElement.textContent = this.taskData.client || 'Client Name';
        }
        
        // Update color based on category
        const categoryColors = {
            'billable': 'linear-gradient(135deg, #667eea, #764ba2)',
            'sales': 'linear-gradient(135deg, #f093fb, #f5576c)',
            'admin': 'linear-gradient(135deg, #4facfe, #00f2fe)'
        };
        
        previewTask.style.background = categoryColors[this.taskData.category] || categoryColors['billable'];
    }
    
    showSuggestions(input, type) {
        const suggestionsContainer = document.getElementById(`${type}-suggestions`);
        if (!suggestionsContainer) return;
        
        const value = input.value.toLowerCase();
        
        if (value.length > 0) {
            suggestionsContainer.style.display = 'block';
            
            // Add click handlers to suggestions
            const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
            suggestions.forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    input.value = suggestion.textContent;
                    this.taskData[type] = suggestion.textContent;
                    suggestionsContainer.style.display = 'none';
                    this.updateCalendarPreview();
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    addSatisfyingAnimation(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    addSliderAnimation() {
        const slider = document.getElementById('task-duration');
        if (slider) {
            slider.style.transform = 'scale(1.02)';
            setTimeout(() => {
                slider.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    showSuccessMessage(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 2000);
    }
    
    saveTask() {
        // Validate form
        if (!this.taskData.title || !this.taskData.category) {
            this.showSuccessMessage('Please fill in all required fields! ⚠️');
            return;
        }
        
        // Create task object
        const task = {
            id: Date.now(),
            title: this.taskData.title,
            client: this.taskData.client,
            category: this.taskData.category,
            duration: this.taskData.duration,
            rate: this.taskData.rate,
            total: this.taskData.total,
            created: new Date().toISOString(),
            scheduled: false
        };
        
        // Save to localStorage
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Show success animation
        this.showSuccessMessage('Mission created successfully! 🚀');
        
        // Close modal and refresh task list
        setTimeout(() => {
            const modal = document.getElementById('add-task-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Refresh the task list if the function exists
            if (window.profitTracker && window.profitTracker.loadTasks) {
                window.profitTracker.loadTasks();
            }
            
            // Reset form
            this.resetForm();
        }, 1000);
    }
    
    resetForm() {
        this.taskData = {
            title: '',
            client: '',
            category: '',
            duration: 2,
            rate: 100,
            total: 0
        };
        
        // Reset form fields
        document.getElementById('task-title').value = '';
        document.getElementById('task-client').value = '';
        document.getElementById('task-duration').value = 2;
        document.getElementById('task-rate').value = 100;
        
        // Reset radio buttons
        document.querySelectorAll('input[name="task-category"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Reset rate buttons
        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.rate-btn[data-rate="100"]').classList.add('active');
        
        // Update visuals
        this.updateDurationVisual();
        this.updateRevenuePreview();
        this.updateCalendarPreview();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the game task modal exists
    if (document.getElementById('add-task-modal')) {
        window.gameTaskInput = new GameTaskInput();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
