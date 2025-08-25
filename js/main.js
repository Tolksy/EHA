window.onload = function() {
    // --- Elements ---
    const canvas = document.getElementById('drafting-canvas');
    const connectModeBtn = document.getElementById('connect-mode-btn');

    if (!canvas || !connectModeBtn) {
        console.error("Required elements not found!");
        return;
    }

    // --- Context ---
    const ctx = canvas.getContext('2d');

    // --- State ---
    const dots = [];
    const lines = [];
    const dotRadius = 5;
    let currentMode = 'edit'; // 'edit' or 'connect'
    let firstDotForLine = null;
    let dragStartX, dragStartY;

    // --- Canvas and Grid Setup ---
    canvas.width = 800;
    canvas.height = 600;
    const gridSpacing = 20;

    // --- Drawing Functions (no changes) ---
    function drawGrid() {
        ctx.beginPath();
        ctx.strokeStyle = '#e0e0e0';
        for (let x = 0; x <= canvas.width; x += gridSpacing) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
        for (let y = 0; y <= canvas.height; y += gridSpacing) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
        ctx.stroke();
    }
    function drawDots() {
        dots.forEach(dot => {
            ctx.fillStyle = (dot === firstDotForLine) ? '#007bff' : '#000000';
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    function drawLines() {
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.startDot.x, line.startDot.y);
            ctx.lineTo(line.endDot.x, line.endDot.y);
            ctx.stroke();
        });
    }
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawLines();
        drawDots();
    }

    // --- Helper Functions (no changes) ---
    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    function getDotAtPos(pos) {
        for (let i = dots.length - 1; i >= 0; i--) {
            const dot = dots[i];
            const dx = pos.x - dot.x;
            const dy = pos.y - dot.y;
            if (dx * dx + dy * dy < dotRadius * dotRadius * 4) return dot;
        }
        return null;
    }

    // --- Mode Switching (no changes) ---
    connectModeBtn.addEventListener('click', () => {
        currentMode = (currentMode === 'edit') ? 'connect' : 'edit';
        connectModeBtn.textContent = (currentMode === 'connect') ? 'Add/Move Dots' : 'Connect Dots';
        connectModeBtn.style.backgroundColor = (currentMode === 'connect') ? '#28a745' : '';
        connectModeBtn.style.color = (currentMode === 'connect') ? 'white' : '';
        firstDotForLine = null;
        redrawCanvas();
    });

    // --- Refactored Event Handlers ---
    canvas.addEventListener('mousedown', (e) => {
        const startPos = getMousePos(e);
        dragStartX = startPos.x;
        dragStartY = startPos.y;

        if (currentMode === 'connect') {
            handleConnectClick(startPos);
            return;
        }

        // --- Edit Mode Mousedown ---
        const dotToDrag = getDotAtPos(startPos);
        if (dotToDrag) {
            // A dot was clicked. Start a drag operation.
            function handleDrag(moveEvent) {
                const movePos = getMousePos(moveEvent);
                dotToDrag.x = movePos.x;
                dotToDrag.y = movePos.y;
                redrawCanvas();
            }
            function endDrag(upEvent) {
                window.removeEventListener('mousemove', handleDrag);
                window.removeEventListener('mouseup', endDrag);
            }
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', endDrag);
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (currentMode !== 'edit') return;
        const endPos = getMousePos(e);
        const moved = Math.abs(endPos.x - dragStartX) > 2 || Math.abs(endPos.y - dragStartY) > 2;
        const startedOnDot = getDotAtPos({ x: dragStartX, y: dragStartY });

        if (!moved && !startedOnDot) {
            dots.push(endPos);
            redrawCanvas();
        }
    });

    function handleConnectClick(pos) {
        const clickedDot = getDotAtPos(pos);
        if (clickedDot) {
            if (!firstDotForLine) {
                firstDotForLine = clickedDot;
            } else {
                if (firstDotForLine !== clickedDot) {
                    const lineExists = lines.some(line =>
                        (line.startDot === firstDotForLine && line.endDot === clickedDot) ||
                        (line.startDot === clickedDot && line.endDot === firstDotForLine)
                    );
                    if (!lineExists) lines.push({ startDot: firstDotForLine, endDot: clickedDot });
                }
                firstDotForLine = null;
            }
        } else {
            firstDotForLine = null;
        }
        redrawCanvas();
    }

    // --- Initial Draw ---
    redrawCanvas();
};
