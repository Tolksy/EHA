window.onload = function() {
    // --- Elements ---
    const canvas = document.getElementById('drafting-canvas');
    const connectModeBtn = document.getElementById('connect-mode-btn');
    const dimensionToolBtn = document.getElementById('dimension-tool-btn');
    const promptInput = document.getElementById('prompt-input');
    const promptDrawBtn = document.getElementById('prompt-draw-btn');

    if (!canvas || !connectModeBtn || !dimensionToolBtn || !promptInput || !promptDrawBtn) {
        console.error("Required elements not found!");
        return;
    }
    const modeButtons = [connectModeBtn, dimensionToolBtn];

    // --- Context ---
    const ctx = canvas.getContext('2d');

    // --- State & Constants ---
    const dots = [];
    const lines = [];
    const dimensions = [];
    const dotRadius = 5;
    const PIXELS_PER_FOOT = 10;
    let currentMode = 'edit';
    let firstDotForTool = null;
    let dragStartX, dragStartY;

    // --- Canvas Setup ---
    canvas.width = 800;
    canvas.height = 600;

    // --- Drawing Functions ---
    function drawGrid() {
        const gridSpacing = 20;
        ctx.beginPath(); ctx.strokeStyle = '#e0e0e0';
        for (let x = 0; x <= canvas.width; x += gridSpacing) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
        for (let y = 0; y <= canvas.height; y += gridSpacing) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
        ctx.stroke();
    }

    function drawDots() {
        dots.forEach(dot => {
            ctx.fillStyle = (dot === firstDotForTool) ? '#007bff' : '#000000';
            ctx.beginPath(); ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2); ctx.fill();
        });
    }

    function drawLines() {
        ctx.strokeStyle = '#333333'; ctx.lineWidth = 2;
        lines.forEach(line => {
            ctx.beginPath(); ctx.moveTo(line.startDot.x, line.startDot.y); ctx.lineTo(line.endDot.x, line.endDot.y); ctx.stroke();
        });
    }

    function drawDimensions() {
        ctx.strokeStyle = '#007bff'; ctx.fillStyle = '#007bff'; ctx.lineWidth = 1; ctx.font = '12px Arial';
        const offset = 20; const tickLength = 5;

        dimensions.forEach(dim => {
            const { dot1, dot2 } = dim;
            const dx = dot2.x - dot1.x;
            const dy = dot2.y - dot1.y;
            const angle = Math.atan2(dy, dx);
            const perp_dx = -Math.sin(angle) * offset;
            const perp_dy = Math.cos(angle) * offset;

            const dim_start_x = dot1.x + perp_dx; const dim_start_y = dot1.y + perp_dy;
            const dim_end_x = dot2.x + perp_dx; const dim_end_y = dot2.y + perp_dy;

            // Draw lines and ticks
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y); ctx.lineTo(dim_start_x, dim_start_y);
            ctx.moveTo(dot2.x, dot2.y); ctx.lineTo(dim_end_x, dim_end_y);
            ctx.moveTo(dim_start_x, dim_start_y); ctx.lineTo(dim_end_x, dim_end_y);
            ctx.stroke();

            ctx.save();
            ctx.translate(dim_start_x, dim_start_y); ctx.rotate(angle + Math.PI / 4);
            ctx.beginPath(); ctx.moveTo(-tickLength, 0); ctx.lineTo(tickLength, 0); ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.translate(dim_end_x, dim_end_y); ctx.rotate(angle + Math.PI / 4);
            ctx.beginPath(); ctx.moveTo(-tickLength, 0); ctx.lineTo(tickLength, 0); ctx.stroke();
            ctx.restore();

            // --- Draw Text ---
            const pixelDist = Math.sqrt(dx*dx + dy*dy);
            const feetDist = pixelDist / PIXELS_PER_FOOT;
            const feet = Math.floor(feetDist);
            const inches = Math.round((feetDist - feet) * 12);
            const dimText = `${feet}' ${inches}"`;

            const midX = dim_start_x + dx / 2;
            const midY = dim_start_y + dy / 2;

            ctx.save();
            ctx.translate(midX, midY);
            ctx.rotate(angle);
            if (angle < -Math.PI / 2 || angle > Math.PI / 2) { ctx.rotate(Math.PI); }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(dimText, 0, -2);
            ctx.restore();
        });
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(); drawLines(); drawDimensions(); drawDots();
    }

    // --- Helper Functions ---
    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    function getDotAtPos(pos) {
        for (let i = dots.length - 1; i >= 0; i--) {
            const dot = dots[i]; const dx = pos.x - dot.x; const dy = pos.y - dot.y;
            if (dx * dx + dy * dy < dotRadius * dotRadius * 4) return dot;
        }
        return null;
    }

    // --- Mode Switching ---
    function setMode(newMode) {
        currentMode = (currentMode === newMode) ? 'edit' : newMode;
        modeButtons.forEach(btn => {
            btn.style.backgroundColor = (btn.dataset.mode === currentMode) ? '#28a745' : '';
            btn.style.color = (btn.dataset.mode === currentMode) ? 'white' : '';
        });
        firstDotForTool = null; redrawCanvas();
    }
    connectModeBtn.addEventListener('click', () => setMode('connect'));
    dimensionToolBtn.addEventListener('click', () => setMode('dimension'));

    // --- Event Handlers ---
    canvas.addEventListener('mousedown', (e) => {
        const startPos = getMousePos(e);
        dragStartX = startPos.x; dragStartY = startPos.y;
        if (currentMode === 'connect' || currentMode === 'dimension') { handleToolClick(startPos); return; }
        const dotToDrag = getDotAtPos(startPos);
        if (dotToDrag) {
            function handleDrag(moveEvent) { const movePos = getMousePos(moveEvent); dotToDrag.x = movePos.x; dotToDrag.y = movePos.y; redrawCanvas(); }
            function endDrag(upEvent) { window.removeEventListener('mousemove', handleDrag); window.removeEventListener('mouseup', endDrag); }
            window.addEventListener('mousemove', handleDrag); window.addEventListener('mouseup', endDrag);
        }
    });
    canvas.addEventListener('mouseup', (e) => {
        if (currentMode !== 'edit') return;
        const endPos = getMousePos(e);
        const moved = Math.abs(endPos.x - dragStartX) > 2 || Math.abs(endPos.y - dragStartY) > 2;
        const startedOnDot = getDotAtPos({ x: dragStartX, y: dragStartY });
        if (!moved && !startedOnDot) { dots.push(endPos); redrawCanvas(); }
    });
    function handleToolClick(pos) {
        const clickedDot = getDotAtPos(pos);
        if (!clickedDot) { firstDotForTool = null; redrawCanvas(); return; }
        if (!firstDotForTool) { firstDotForTool = clickedDot; }
        else {
            if (firstDotForTool !== clickedDot) {
                if (currentMode === 'connect') {
                    const lineExists = lines.some(l => (l.startDot === firstDotForTool && l.endDot === clickedDot) || (l.startDot === clickedDot && l.endDot === firstDotForTool));
                    if (!lineExists) lines.push({ startDot: firstDotForTool, endDot: clickedDot });
                } else if (currentMode === 'dimension') {
                    const dimExists = dimensions.some(d => (d.dot1 === firstDotForTool && d.dot2 === clickedDot) || (d.dot1 === clickedDot && d.dot2 === firstDotForTool));
                    if (!dimExists) dimensions.push({ dot1: firstDotForTool, dot2: clickedDot });
                }
            }
            firstDotForTool = null;
        }
        redrawCanvas();
    }

    // --- Prompt Drawing Logic ---
    function parsePrompt(text) {
        const regex = /draw\s+a(?:n)?\s+(\d+(?:\.\d+)?)\s*(?:by|x)\s*(\d+(?:\.\d+)?)\s*(\w+)/i;
        const match = text.match(regex);
        if (match) {
            const [, dim1, dim2, shape] = match;
            if (shape.toLowerCase() === 'rectangle') {
                return { shape: 'rectangle', dim1: parseFloat(dim1), dim2: parseFloat(dim2) };
            }
        }
        return null;
    }
    function drawFromPrompt(parsed) {
        if (parsed.shape === 'rectangle') {
            const width = parsed.dim1 * PIXELS_PER_FOOT;
            const height = parsed.dim2 * PIXELS_PER_FOOT;
            const startX = (canvas.width - width) / 2;
            const startY = (canvas.height - height) / 2;
            const dot1 = { x: startX, y: startY };
            const dot2 = { x: startX + width, y: startY };
            const dot3 = { x: startX + width, y: startY + height };
            const dot4 = { x: startX, y: startY + height };
            dots.push(dot1, dot2, dot3, dot4);
            lines.push(
                { startDot: dot1, endDot: dot2 },
                { startDot: dot2, endDot: dot3 },
                { startDot: dot3, endDot: dot4 },
                { startDot: dot4, endDot: dot1 }
            );
        }
    }
    promptDrawBtn.addEventListener('click', () => {
        const text = promptInput.value;
        if (!text) { alert("Please enter a prompt."); return; }
        const parsed = parsePrompt(text);
        if (parsed) { drawFromPrompt(parsed); redrawCanvas(); promptInput.value = ''; }
        else { alert("Sorry, I didn't understand that prompt. Please use the format: 'draw a [width] by [height] rectangle'"); }
    });

    // --- Initial Draw ---
    redrawCanvas();
};
