// Script to replace the boring task modal with the game-style version

// Read the new game-style modal content
const fs = require('fs');
const path = require('path');

// Read the new modal content
const newModalContent = fs.readFileSync(path.join(__dirname, 'add-task-modal.html'), 'utf8');

// Read the main HTML file
const mainHtmlPath = path.join(__dirname, 'index.html');
let mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');

// Find the start and end of the current task modal
const modalStart = '    <!-- Add Task Modal -->';
const modalEnd = '    </div>';

const startIndex = mainHtml.indexOf(modalStart);
const endIndex = mainHtml.indexOf(modalEnd, startIndex) + modalEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    // Replace the modal content
    const beforeModal = mainHtml.substring(0, startIndex);
    const afterModal = mainHtml.substring(endIndex);
    
    const newHtml = beforeModal + newModalContent + afterModal;
    
    // Write back to file
    fs.writeFileSync(mainHtmlPath, newHtml);
    console.log('✅ Task modal replaced with game-style version!');
} else {
    console.log('❌ Could not find task modal to replace');
}
