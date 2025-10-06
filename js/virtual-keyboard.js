// Virtual Keyboard + Auto-Save System
// No typing required - everything is clickable!

class VirtualKeyboard {
    constructor() {
        this.activeInput = null;
        this.customerDatabase = this.loadCustomers();
        this.init();
    }
    
    init() {
        this.createKeyboard();
        this.setupInputListeners();
        this.setupAutoSave();
    }
    
    createKeyboard() {
        // Create virtual keyboard HTML
        const keyboardHTML = `
            <div id="virtual-keyboard" class="virtual-keyboard" style="display: none;">
                <div class="keyboard-header">
                    <span class="keyboard-title">Virtual Keyboard</span>
                    <button class="keyboard-close" onclick="virtualKeyboard.hide()">✕</button>
                </div>
                
                <div class="keyboard-layout">
                    <!-- First row -->
                    <div class="keyboard-row">
                        <button class="key-btn" data-key="q">Q</button>
                        <button class="key-btn" data-key="w">W</button>
                        <button class="key-btn" data-key="e">E</button>
                        <button class="key-btn" data-key="r">R</button>
                        <button class="key-btn" data-key="t">T</button>
                        <button class="key-btn" data-key="y">Y</button>
                        <button class="key-btn" data-key="u">U</button>
                        <button class="key-btn" data-key="i">I</button>
                        <button class="key-btn" data-key="o">O</button>
                        <button class="key-btn" data-key="p">P</button>
                    </div>
                    
                    <!-- Second row -->
                    <div class="keyboard-row">
                        <button class="key-btn" data-key="a">A</button>
                        <button class="key-btn" data-key="s">S</button>
                        <button class="key-btn" data-key="d">D</button>
                        <button class="key-btn" data-key="f">F</button>
                        <button class="key-btn" data-key="g">G</button>
                        <button class="key-btn" data-key="h">H</button>
                        <button class="key-btn" data-key="j">J</button>
                        <button class="key-btn" data-key="k">K</button>
                        <button class="key-btn" data-key="l">L</button>
                    </div>
                    
                    <!-- Third row -->
                    <div class="keyboard-row">
                        <button class="key-btn" data-key="z">Z</button>
                        <button class="key-btn" data-key="x">X</button>
                        <button class="key-btn" data-key="c">C</button>
                        <button class="key-btn" data-key="v">V</button>
                        <button class="key-btn" data-key="b">B</button>
                        <button class="key-btn" data-key="n">N</button>
                        <button class="key-btn" data-key="m">M</button>
                    </div>
                    
                    <!-- Fourth row - Numbers and special -->
                    <div class="keyboard-row">
                        <button class="key-btn" data-key="1">1</button>
                        <button class="key-btn" data-key="2">2</button>
                        <button class="key-btn" data-key="3">3</button>
                        <button class="key-btn" data-key="4">4</button>
                        <button class="key-btn" data-key="5">5</button>
                        <button class="key-btn" data-key="6">6</button>
                        <button class="key-btn" data-key="7">7</button>
                        <button class="key-btn" data-key="8">8</button>
                        <button class="key-btn" data-key="9">9</button>
                        <button class="key-btn" data-key="0">0</button>
                    </div>
                    
                    <!-- Fifth row - Special keys -->
                    <div class="keyboard-row">
                        <button class="key-btn special" data-key=" ">SPACE</button>
                        <button class="key-btn special" data-key=".">.</button>
                        <button class="key-btn special" data-key=",">,</button>
                        <button class="key-btn special" data-key="@">@</button>
                        <button class="key-btn special" data-key="backspace">⌫</button>
                    </div>
                </div>
                
                <!-- Customer Suggestions -->
                <div class="customer-suggestions" id="customer-suggestions" style="display: none;">
                    <div class="suggestions-header">Saved Customers:</div>
                    <div class="suggestions-list" id="suggestions-list">
                        <!-- Dynamic suggestions will appear here -->
                    </div>
                </div>
            </div>
        `;
        
        // Add keyboard to page
        document.body.insertAdjacentHTML('beforeend', keyboardHTML);
        
        // Setup keyboard click handlers
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = e.target.dataset.key;
                this.handleKeyPress(key);
            });
        });
    }
    
    setupInputListeners() {
        // Find all text inputs and add virtual keyboard triggers
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
                this.showForInput(e.target);
            }
            if (e.target.tagName === 'TEXTAREA') {
                this.showForInput(e.target);
            }
        });
        
        // Also trigger on focus
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
                this.showForInput(e.target);
            }
            if (e.target.tagName === 'TEXTAREA') {
                this.showForInput(e.target);
            }
        }, true);
    }
    
    setupAutoSave() {
        // Auto-save customers when they're entered anywhere
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const value = e.target.value.trim();
                
                // Check if this looks like a customer name (simple heuristic)
                if (this.looksLikeCustomerName(value) && value.length > 2) {
                    this.saveCustomer(value);
                    this.updateSuggestions();
                }
            }
        });
    }
    
    showForInput(input) {
        this.activeInput = input;
        const keyboard = document.getElementById('virtual-keyboard');
        
        // Position keyboard near the input
        const rect = input.getBoundingClientRect();
        keyboard.style.top = (rect.bottom + 10) + 'px';
        keyboard.style.left = rect.left + 'px';
        keyboard.style.display = 'block';
        
        // Show customer suggestions if this looks like a customer field
        if (this.isCustomerField(input)) {
            this.showCustomerSuggestions();
        } else {
            this.hideCustomerSuggestions();
        }
    }
    
    hide() {
        document.getElementById('virtual-keyboard').style.display = 'none';
        this.activeInput = null;
    }
    
    handleKeyPress(key) {
        if (!this.activeInput) return;
        
        if (key === 'backspace') {
            const currentValue = this.activeInput.value;
            this.activeInput.value = currentValue.slice(0, -1);
        } else {
            this.activeInput.value += key;
        }
        
        // Trigger input event for auto-save
        this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Add visual feedback
        this.addKeyPressFeedback(key);
    }
    
    addKeyPressFeedback(key) {
        const btn = document.querySelector(`[data-key="${key}"]`);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            btn.style.backgroundColor = '#667eea';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                btn.style.backgroundColor = '';
            }, 150);
        }
    }
    
    isCustomerField(input) {
        const name = input.name ? input.name.toLowerCase() : '';
        const id = input.id ? input.id.toLowerCase() : '';
        const placeholder = input.placeholder ? input.placeholder.toLowerCase() : '';
        
        return name.includes('customer') || name.includes('client') || 
               id.includes('customer') || id.includes('client') ||
               placeholder.includes('customer') || placeholder.includes('client') ||
               placeholder.includes('who') || placeholder.includes('name');
    }
    
    looksLikeCustomerName(text) {
        // Simple heuristic: contains letters and possibly spaces, not just numbers
        return /^[a-zA-Z\s\-\.]+$/.test(text) && text.length > 2;
    }
    
    showCustomerSuggestions() {
        const suggestions = document.getElementById('customer-suggestions');
        const suggestionsList = document.getElementById('suggestions-list');
        
        if (this.customerDatabase.length > 0) {
            suggestionsList.innerHTML = this.customerDatabase.map(customer => 
                `<button class="suggestion-btn" onclick="virtualKeyboard.insertSuggestion('${customer}')">${customer}</button>`
            ).join('');
            suggestions.style.display = 'block';
        }
    }
    
    hideCustomerSuggestions() {
        document.getElementById('customer-suggestions').style.display = 'none';
    }
    
    insertSuggestion(customer) {
        if (this.activeInput) {
            this.activeInput.value = customer;
            this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    
    saveCustomer(customerName) {
        if (!this.customerDatabase.includes(customerName)) {
            this.customerDatabase.push(customerName);
            this.saveCustomers();
        }
    }
    
    updateSuggestions() {
        if (this.activeInput && this.isCustomerField(this.activeInput)) {
            this.showCustomerSuggestions();
        }
    }
    
    loadCustomers() {
        const saved = localStorage.getItem('savedCustomers');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveCustomers() {
        localStorage.setItem('savedCustomers', JSON.stringify(this.customerDatabase));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.virtualKeyboard = new VirtualKeyboard();
});

// Add CSS for virtual keyboard
const style = document.createElement('style');
style.textContent = `
    .virtual-keyboard {
        position: fixed;
        background: white;
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        padding: 1rem;
        max-width: 600px;
        font-family: 'Inter', sans-serif;
    }
    
    .keyboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e5e5;
    }
    
    .keyboard-title {
        font-weight: 600;
        color: #1a1a1a;
    }
    
    .keyboard-close {
        background: #f5f5f5;
        border: none;
        border-radius: 4px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .keyboard-layout {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .keyboard-row {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
    }
    
    .key-btn {
        background: #f8f9fa;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-weight: 600;
        color: #1a1a1a;
        transition: all 0.2s ease;
        min-width: 40px;
        text-align: center;
    }
    
    .key-btn:hover {
        background: #e9ecef;
        transform: translateY(-1px);
    }
    
    .key-btn.special {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .key-btn.special:hover {
        background: #5a6fd8;
    }
    
    .customer-suggestions {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e5e5;
    }
    
    .suggestions-header {
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .suggestions-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .suggestion-btn {
        background: #f0f4ff;
        border: 1px solid #667eea;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 0.875rem;
        color: #667eea;
        transition: all 0.2s ease;
    }
    
    .suggestion-btn:hover {
        background: #667eea;
        color: white;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);
