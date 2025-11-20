// Canvas and DOM elements
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const textInput = document.getElementById('textInput');
const textSizeInput = document.getElementById('textSize');
const sizeValue = document.getElementById('sizeValue');
const textColorInput = document.getElementById('textColor');
const downloadBtn = document.getElementById('downloadBtn');
const placeholder = document.getElementById('placeholder');
const templateGallery = document.getElementById('templateGallery');

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
let textObject = {
    text: '',
    x: 0,
    y: 0,
    size: 40,
    color: '#ffffff',
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
};

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
        
        // Initialize text position to center
        textObject.x = width / 2;
        textObject.y = height / 2;
    };
    
    img.onerror = function() {
        console.error('Failed to load image:', source);
        alert('Failed to load image. Please try another one.');
    };
    
    // Handle both URL strings and File objects
    if (typeof source === 'string') {
        img.src = source;
    } else if (source instanceof File) {
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

// Image upload handler
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

// Draw everything on canvas
function drawCanvas() {
    if (!image) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw text if it exists
    if (textObject.text) {
        ctx.font = `${textObject.size}px Arial`;
        ctx.fillStyle = textObject.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add stroke for better visibility
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(2, textObject.size / 20);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        
        // Split text into lines and draw each line
        const lines = textObject.text.split('\n');
        const lineHeight = textObject.size * 1.2; // Line spacing
        const totalHeight = lines.length * lineHeight;
        const startY = textObject.y - (totalHeight / 2) + (lineHeight / 2);
        
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            // Draw text with stroke
            ctx.strokeText(line, textObject.x, y);
            ctx.fillText(line, textObject.x, y);
        });
    }
}

// Text input handler
textInput.addEventListener('input', function(e) {
    textObject.text = e.target.value;
    drawCanvas();
});

// Text size handler
textSizeInput.addEventListener('input', function(e) {
    textObject.size = parseInt(e.target.value);
    sizeValue.textContent = textObject.size;
    drawCanvas();
});

// Text color handler
textColorInput.addEventListener('input', function(e) {
    textObject.color = e.target.value;
    drawCanvas();
});

// Check if point is inside text bounds
function isPointInText(x, y) {
    if (!textObject.text) return false;
    
    ctx.font = `${textObject.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into lines
    const lines = textObject.text.split('\n');
    const lineHeight = textObject.size * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = textObject.y - (totalHeight / 2) + (lineHeight / 2);
    
    // Find the widest line
    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    const left = textObject.x - maxWidth / 2;
    const right = textObject.x + maxWidth / 2;
    const top = textObject.y - totalHeight / 2;
    const bottom = textObject.y + totalHeight / 2;
    
    return x >= left && x <= right && y >= top && y <= bottom;
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
    if (!image || !textObject.text) return;
    
    const pos = getEventPos(e);
    
    if (isPointInText(pos.x, pos.y)) {
        textObject.isDragging = true;
        textObject.dragOffset.x = pos.x - textObject.x;
        textObject.dragOffset.y = pos.y - textObject.y;
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
    }
}

// Mouse/Touch move handler
function handleMove(e) {
    if (!image) return;
    
    const pos = getEventPos(e);
    
    if (textObject.isDragging) {
        textObject.x = pos.x - textObject.dragOffset.x;
        textObject.y = pos.y - textObject.dragOffset.y;
        
        // Keep text within canvas bounds
        const padding = 20;
        textObject.x = Math.max(padding, Math.min(canvas.width - padding, textObject.x));
        textObject.y = Math.max(padding, Math.min(canvas.height - padding, textObject.y));
        
        drawCanvas();
        e.preventDefault();
    } else if (textObject.text && isPointInText(pos.x, pos.y)) {
        canvas.style.cursor = 'grab';
    } else {
        canvas.style.cursor = 'default';
    }
}

// Mouse/Touch up handler
function handleUp(e) {
    if (textObject.isDragging) {
        textObject.isDragging = false;
        canvas.style.cursor = textObject.text && isPointInText(getEventPos(e).x, getEventPos(e).y) ? 'grab' : 'default';
    }
}

// Mouse events
canvas.addEventListener('mousedown', handleDown);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('mouseup', handleUp);
canvas.addEventListener('mouseleave', handleUp);

// Touch events
canvas.addEventListener('touchstart', handleDown);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('touchend', handleUp);
canvas.addEventListener('touchcancel', handleUp);

// Download functionality
downloadBtn.addEventListener('click', function() {
    if (!image) return;
    
    // Create download link
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = dataURL;
    link.click();
});

// Initialize
initCanvas();
loadTemplateGallery();

