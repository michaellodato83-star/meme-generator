// Script initialization

// Canvas and DOM elements - will be initialized after DOM loads
let canvas, ctx, imageInput, textInput, textSizeInput, sizeValue, textColorInput;
let downloadBtn, placeholder, templateGallery, selectedLineInfo;

// Template images from Assets folder
const templateImages = [
    'Assets/Kitty_1.jpg',
    'Assets/kitty_2.jpg',
    'Assets/kitty_3.jpg',
    'Assets/leaping kitty.jpg',
    'Assets/smiling kitty.jpg'
];

// State
let image = null;
let textObjects = []; // Array to store multiple text lines
let currentTextSize = 40;
let currentTextColor = '#ffffff';
let draggedTextIndex = -1; // Index of the text object being dragged
let selectedTextIndex = -1; // Index of the selected text object for color editing

// Initialize canvas
function initCanvas() {
    canvas.style.cursor = 'default';
}

// Load image from URL or File object
function loadImage(source) {
    const img = new Image();
    
    img.onload = function() {
        image = img;
        
        // Set canvas dimensions to match image
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        // Scale down if too large
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image and text
        drawCanvas();
        
        // Show canvas, hide placeholder
        canvas.classList.add('active');
        placeholder.classList.add('hidden');
        downloadBtn.disabled = false;
        
        // Initialize text position will be set when text is added
    };
    
    img.onerror = function() {
        console.error('Failed to load image:', source);
        alert('Failed to load image. Please try another one.');
    };
    
    // Handle both URL strings and File objects
    if (typeof source === 'string') {
        // For http/https URLs, set crossOrigin to allow canvas export
        // Note: file:// URLs may have CORS restrictions that prevent downloads
        if (window.location.protocol !== 'file:') {
            img.crossOrigin = 'anonymous';
        }
        img.src = source;
    } else if (source instanceof File) {
        // File objects are loaded as data URLs, no CORS needed
        const reader = new FileReader();
        reader.onload = function(event) {
            img.src = event.target.result;
        };
        reader.readAsDataURL(source);
    }
}

// Load template gallery
function loadTemplateGallery() {
    templateImages.forEach((imagePath, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Template ${index + 1}`;
        img.className = 'template-thumbnail';
        
        templateItem.appendChild(img);
        templateGallery.appendChild(templateItem);
        
        // Add click handler
        templateItem.addEventListener('click', function() {
            // Remove active class from all templates
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            // Add active class to clicked template
            templateItem.classList.add('active');
            // Load the template image
            loadImage(imagePath);
        });
    });
}

// Image upload handler - will be set up in initializeApp()

// Draw everything on canvas
function drawCanvas() {
    if (!image) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw each text object independently
    textObjects.forEach((textObj, index) => {
        if (textObj.text) {
            ctx.font = `${textObj.size}px Arial`;
            ctx.fillStyle = textObj.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            
            // Highlight selected text with a different stroke color
            if (index === selectedTextIndex) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = Math.max(3, textObj.size / 15);
            } else {
                // Regular stroke for non-selected text
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(2, textObj.size / 20);
            }
            
            // Draw text with stroke
            ctx.strokeText(textObj.text, textObj.x, textObj.y);
            ctx.fillText(textObj.text, textObj.x, textObj.y);
        }
    });
}

// Text input handler - will be set up in initializeApp()
function setupTextInputHandler() {
    textInput.addEventListener('input', function(e) {
    // Don't process text input changes while dragging
    if (draggedTextIndex !== -1) {
        return;
    }
    
    const inputText = e.target.value;
    const lines = inputText.split('\n');
    
    // Update or create text objects for each line
    lines.forEach((line, index) => {
        if (index < textObjects.length) {
            // Update existing text object - IMPORTANT: preserve x and y positions
            textObjects[index].text = line;
            textObjects[index].size = currentTextSize;
            // Only update color if this line is selected, otherwise keep existing color
            if (index === selectedTextIndex) {
                textObjects[index].color = currentTextColor;
            } else if (selectedTextIndex === -1) {
                // If no line is selected, update all colors
                textObjects[index].color = currentTextColor;
            }
            // DO NOT modify x or y positions for existing objects
        } else {
            // Create new text object
            // Position new line below the last line, or center if no lines exist
            let x, y;
            if (textObjects.length > 0) {
                const lastLine = textObjects[textObjects.length - 1];
                // Use the last line's x position, but ensure it's a number
                x = typeof lastLine.x === 'number' ? lastLine.x : (canvas.width > 0 ? canvas.width / 2 : 400);
                y = typeof lastLine.y === 'number' ? lastLine.y + (currentTextSize * 1.2) : (canvas.height > 0 ? canvas.height / 2 : 300);
            } else {
                x = canvas.width > 0 ? canvas.width / 2 : 400;
                y = canvas.height > 0 ? canvas.height / 2 : 300;
            }
            
            // Create a completely new independent object with its own position values
            // Use explicit Number() to ensure we're copying the value, not a reference
            const newX = Number(x);
            const newY = Number(y);
            textObjects.push({
                text: line,
                x: newX,  // Independent copy of the value
                y: newY,  // Independent copy of the value
                size: currentTextSize,
                color: currentTextColor,
                dragOffset: { x: 0, y: 0 }
            });
        }
    });
    
    // Remove extra text objects if lines were deleted
    if (lines.length < textObjects.length) {
        textObjects = textObjects.slice(0, lines.length);
        // Reset selection if selected line was removed
        if (selectedTextIndex >= textObjects.length) {
            selectedTextIndex = -1;
        }
    }
    
    updateSelectedLineInfo();
    drawCanvas();
    });
}

// Text size handler - will be set up in initializeApp()
function setupTextSizeHandler() {
    textSizeInput.addEventListener('input', function(e) {
    currentTextSize = parseInt(e.target.value);
    sizeValue.textContent = currentTextSize;
    
    // Update size for all existing text objects
    textObjects.forEach(textObj => {
        textObj.size = currentTextSize;
    });
    
    drawCanvas();
    });
}

// Text color handler - will be set up in initializeApp()
function setupTextColorHandler() {
    textColorInput.addEventListener('input', function(e) {
    const newColor = e.target.value;
    currentTextColor = newColor;
    
    // Update color only for selected text object, or all if none selected
    if (selectedTextIndex !== -1 && selectedTextIndex >= 0 && selectedTextIndex < textObjects.length) {
        // Get the selected object directly by index
        const selectedObj = textObjects[selectedTextIndex];
        
        console.log('Changing color of line:', selectedTextIndex, 'to:', newColor);
        console.log('All colors before:', textObjects.map((obj, idx) => ({
            idx: idx,
            color: obj.color
        })));
        
        // CRITICAL: Update ONLY this specific object's color property
        // Do NOT create a new object, just update the property directly
        if (selectedObj) {
            const oldColor = selectedObj.color;
            selectedObj.color = newColor;
            console.log(`Changed line ${selectedTextIndex} color from ${oldColor} to ${newColor}`);
        }
        
        console.log('All colors after:', textObjects.map((obj, idx) => ({
            idx: idx,
            color: obj.color
        })));
    } else {
        // If no line is selected, update all lines
        for (let i = 0; i < textObjects.length; i++) {
            if (textObjects[i]) {
                textObjects[i].color = newColor;
            }
        }
    }
    
    drawCanvas();
    });
}

// Function to update selected line info display
function updateSelectedLineInfo(updateColorPicker = true) {
    if (selectedTextIndex !== -1 && selectedTextIndex >= 0 && selectedTextIndex < textObjects.length) {
        const selectedObj = textObjects[selectedTextIndex];
        if (selectedObj) {
            const lineNumber = selectedTextIndex + 1;
            // Count all text objects, including those with empty strings
            // This ensures correct line count when users have empty lines (e.g., "Line1\n\nLine3")
            const totalLines = textObjects.length;
            selectedLineInfo.textContent = `(Line ${lineNumber} of ${totalLines})`;
            selectedLineInfo.style.color = '#667eea';
            // Update color picker to show selected line's color
            if (updateColorPicker && selectedObj.color) {
                textColorInput.value = selectedObj.color;
            }
        }
    } else {
        selectedLineInfo.textContent = '(All lines)';
        selectedLineInfo.style.color = '#888';
    }
}

// Check if point is inside a specific text object and return its index
function getTextObjectAtPoint(x, y) {
    console.log('Checking point:', x, y, 'against', textObjects.length, 'text objects');
    for (let i = textObjects.length - 1; i >= 0; i--) {
        const textObj = textObjects[i];
        if (!textObj.text) continue;
        
        ctx.font = `${textObj.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const metrics = ctx.measureText(textObj.text);
        const width = metrics.width;
        const height = textObj.size;
        
        const left = textObj.x - width / 2;
        const right = textObj.x + width / 2;
        const top = textObj.y - height / 2;
        const bottom = textObj.y + height / 2;
        
        console.log(`Line ${i}: text="${textObj.text}", pos=(${textObj.x}, ${textObj.y}), bounds=(${left}, ${top}) to (${right}, ${bottom})`);
        
        if (x >= left && x <= right && y >= top && y <= bottom) {
            console.log(`Point is inside line ${i}`);
            return i;
        }
    }
    console.log('Point not inside any text object');
    return -1;
}

// Get mouse/touch position relative to canvas
function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    } else {
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
}

// Mouse/Touch down handler
function handleDown(e) {
    if (!image || textObjects.length === 0) return;
    
    const pos = getEventPos(e);
    const textIndex = getTextObjectAtPoint(pos.x, pos.y);
    
    if (textIndex !== -1 && textIndex < textObjects.length) {
        // Select the text line for color editing
        selectedTextIndex = textIndex;
        console.log('Selected line:', textIndex, 'Total lines:', textObjects.length);
        
        // Update the color picker to show this line's color
        updateSelectedLineInfo(true);
        
        // Also prepare for dragging
        draggedTextIndex = textIndex;
        const textObj = textObjects[textIndex];
        
        console.log('Dragging line:', textIndex, 'at position:', textObj.x, textObj.y);
        console.log('All text objects:', textObjects.map((obj, idx) => ({
            idx: idx,
            text: obj.text,
            x: obj.x,
            y: obj.y
        })));
        
        // Make sure we have a valid dragOffset object
        if (!textObj.dragOffset) {
            textObj.dragOffset = { x: 0, y: 0 };
        }
        
        // Calculate offset from click position to text center
        // Store the offset in the dragged object
        textObj.dragOffset.x = pos.x - textObj.x;
        textObj.dragOffset.y = pos.y - textObj.y;
        canvas.style.cursor = 'grabbing';
        
        // Show selection highlight
        drawCanvas();
        
        e.preventDefault();
        e.stopPropagation();
        return false;
    } else {
        // Deselect if clicking on empty space
        selectedTextIndex = -1;
        updateSelectedLineInfo();
        drawCanvas(); // Only redraw when deselecting
    }
}

// Mouse/Touch move handler
function handleMove(e) {
    if (!image) return;
    
    // Only process if we have a valid canvas
    if (canvas.width === 0 || canvas.height === 0) return;
    
    const pos = getEventPos(e);
    
    // Check if we're actively dragging a specific text object
    if (draggedTextIndex !== -1 && draggedTextIndex >= 0 && draggedTextIndex < textObjects.length) {
        // Get the dragged object directly by index
        const draggedObj = textObjects[draggedTextIndex];
        
        // Verify this is a valid text object
        if (!draggedObj || !draggedObj.text) {
            draggedTextIndex = -1;
            return;
        }
        
        // Ensure dragOffset exists
        if (!draggedObj.dragOffset) {
            draggedObj.dragOffset = { x: 0, y: 0 };
        }
        
        // Calculate new position based on mouse position minus the offset
        const newX = pos.x - draggedObj.dragOffset.x;
        const newY = pos.y - draggedObj.dragOffset.y;
        
        // Keep text within canvas bounds
        const padding = 20;
        const clampedX = Math.max(padding, Math.min(canvas.width - padding, newX));
        const clampedY = Math.max(padding, Math.min(canvas.height - padding, newY));
        
        // CRITICAL: Update ONLY this specific object's x and y properties
        // Do NOT create a new object, just update the properties directly
        const oldX = draggedObj.x;
        const oldY = draggedObj.y;
        draggedObj.x = clampedX;
        draggedObj.y = clampedY;
        
        console.log(`Moving line ${draggedTextIndex} from (${oldX}, ${oldY}) to (${clampedX}, ${clampedY})`);
        console.log('All positions after move:', textObjects.map((obj, idx) => ({
            idx: idx,
            x: obj.x,
            y: obj.y
        })));
        
        // Redraw canvas to show new position
        drawCanvas();
        e.preventDefault();
        e.stopPropagation();
    } else {
        // Not dragging - update cursor only if over canvas
        if (e.target === canvas || e.target === null || canvas.contains(e.target)) {
            const textIndex = getTextObjectAtPoint(pos.x, pos.y);
            if (textIndex !== -1) {
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.cursor = 'default';
            }
        }
    }
}

// Mouse/Touch up handler
function handleUp(e) {
    if (draggedTextIndex !== -1) {
        const pos = getEventPos(e);
        const textIndex = getTextObjectAtPoint(pos.x, pos.y);
        canvas.style.cursor = textIndex !== -1 ? 'grab' : 'default';
        draggedTextIndex = -1;
        // Redraw to show selection highlight after drag completes
        drawCanvas();
    }
}

// Mouse and touch event handlers - will be set up in initializeApp()
function setupCanvasEventHandlers() {
    // Mouse events on canvas
    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', function(e) {
        // Only call handleUp if we're dragging, otherwise just reset cursor
        if (draggedTextIndex === -1) {
            canvas.style.cursor = 'default';
        } else {
            handleUp(e);
        }
    });

    // Document-level mouse events for dragging (so dragging works even if mouse leaves canvas)
    document.addEventListener('mousemove', function(e) {
        // Only handle move if we're actively dragging
        if (draggedTextIndex !== -1) {
            handleMove(e);
        }
    });
    document.addEventListener('mouseup', function(e) {
        // Only handle up if we're actively dragging
        if (draggedTextIndex !== -1) {
            handleUp(e);
        }
    });

    // Touch events
    canvas.addEventListener('touchstart', handleDown);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleUp);
    canvas.addEventListener('touchcancel', handleUp);
}

// Download functionality - will be set up in initializeApp()
function setupDownloadHandler() {
    downloadBtn.addEventListener('click', function() {
    if (!image) {
        alert('Please upload or select an image first.');
        return;
    }
    
    // Check if canvas has valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
        alert('Canvas is not ready. Please wait for the image to load.');
        return;
    }
    
    try {
        // Ensure canvas is drawn before downloading
        drawCanvas();
        
        // Small delay to ensure canvas is fully rendered
        setTimeout(function() {
            try {
                // Create download link
                const dataURL = canvas.toDataURL('image/png');
                
                if (!dataURL || dataURL === 'data:,') {
                    alert('Error: Could not generate image. This may be due to browser security restrictions. Try using a local web server or uploading your own image instead of using templates.');
                    return;
                }
                
                const link = document.createElement('a');
                link.download = 'meme.png';
                link.href = dataURL;
                
                // Append to body, click, then remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Download error:', error);
                alert('Error downloading image: ' + error.message + '\n\nIf using templates, try uploading your own image instead. Browser security may block downloads from local file paths.');
            }
        }, 100);
    } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading image. Please check the browser console for details.');
    }
    });
}

// Image upload handler - will be set up in initializeApp()
function setupImageUploadHandler() {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Remove active class from all templates when uploading
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            // Load the uploaded image
            loadImage(file);
        }
    });
}

// Initialize DOM elements and start the app
function initializeApp() {
    try {
        console.log('Initializing app...');
        
        // Get DOM elements
        canvas = document.getElementById('memeCanvas');
        ctx = canvas ? canvas.getContext('2d') : null;
        imageInput = document.getElementById('imageInput');
        textInput = document.getElementById('textInput');
        textSizeInput = document.getElementById('textSize');
        sizeValue = document.getElementById('sizeValue');
        textColorInput = document.getElementById('textColor');
        downloadBtn = document.getElementById('downloadBtn');
        placeholder = document.getElementById('placeholder');
        templateGallery = document.getElementById('templateGallery');
        selectedLineInfo = document.getElementById('selectedLineInfo');
        
        console.log('DOM elements loaded:', {
            canvas: !!canvas,
            ctx: !!ctx,
            textInput: !!textInput,
            textColorInput: !!textColorInput
        });
        
        if (!canvas || !ctx) {
            console.error('Canvas not found!');
            return;
        }
        
        initCanvas();
        loadTemplateGallery();
        updateSelectedLineInfo();
        
        // Set up all event listeners now that DOM elements are ready
        setupImageUploadHandler();
        setupTextInputHandler();
        setupTextSizeHandler();
        setupTextColorHandler();
        setupCanvasEventHandlers();
        setupDownloadHandler();
        
        console.log('Initialization complete. Ready to use!');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

