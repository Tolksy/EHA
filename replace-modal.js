// Simple script to replace the boring task modal with the game-style version

const fs = require('fs');
const path = require('path');

try {
    // Read the main HTML file
    const htmlPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Read the new game-style modal
    const modalPath = path.join(__dirname, 'update-task-modal.html');
    const newModalContent = fs.readFileSync(modalPath, 'utf8');
    
    // Find the start and end of the current task modal
    const startMarker = '    <!-- Add Task Modal -->';
    const endMarker = '    </div>';
    
    const startIndex = htmlContent.indexOf(startMarker);
    
    if (startIndex === -1) {
        console.log('❌ Could not find task modal start marker');
        process.exit(1);
    }
    
    // Find the matching end div for the modal
    let braceCount = 0;
    let endIndex = startIndex;
    let inModal = false;
    
    for (let i = startIndex; i < htmlContent.length; i++) {
        const char = htmlContent[i];
        const nextTwoChars = htmlContent.substr(i, 2);
        
        if (nextTwoChars === '<!--' && htmlContent.substr(i, 20).includes('Add Task Modal')) {
            inModal = true;
            continue;
        }
        
        if (inModal) {
            if (char === '<' && htmlContent.substr(i, 5).includes('<div')) {
                braceCount++;
            } else if (char === '<' && htmlContent.substr(i, 6).includes('</div')) {
                braceCount--;
                if (braceCount === 0) {
                    // Find the end of this div tag
                    endIndex = htmlContent.indexOf('>', i) + 1;
                    break;
                }
            }
        }
    }
    
    if (endIndex === startIndex) {
        console.log('❌ Could not find matching end div for modal');
        process.exit(1);
    }
    
    // Replace the modal content
    const beforeModal = htmlContent.substring(0, startIndex);
    const afterModal = htmlContent.substring(endIndex);
    
    const newHtmlContent = beforeModal + newModalContent + afterModal;
    
    // Write back to file
    fs.writeFileSync(htmlPath, newHtmlContent);
    
    console.log('✅ Task modal successfully replaced with game-style version!');
    console.log('🎮 Your task input is now addictive and fun!');
    
} catch (error) {
    console.log('❌ Error replacing modal:', error.message);
    process.exit(1);
}
