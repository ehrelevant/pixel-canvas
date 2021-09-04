
let primaryColor = '#000000';
let secondaryColor = '#FFFFFF';
let pixelWidth = 1;
let zoom = 8;


const body = document.body;

const mainCanvas = document.querySelector('#main_canvas');
const mainCtx = mainCanvas.getContext("2d");

const debugCanvas = document.querySelector('#debug_canvas');
const debugCtx = debugCanvas.getContext("2d");


let canvasRect = mainCtx.canvas.getBoundingClientRect();


if (mainCtx === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}

mainCtx.imageSmoothingEnabled = false;
console.log(mainCtx)


// Mouse Events/Functions
let isMouseHeld = false;

body.addEventListener('click', evt => {
    drawPixel(mainCtx, evt, zoom);
})

body.addEventListener('mousemove', evt => {
    if (isMouseHeld) {
        drawPixel(mainCtx, evt, zoom);
    }
});

body.addEventListener('mousedown', evt => {
    isMouseHeld = true;
});

body.addEventListener('mouseup', evt => {
    isMouseHeld = false;
});

function getMousePos(ctx, evt, zoom) {
    const mouseX = evt.clientX - canvasRect.left - zoom;
    const mouseY = evt.clientY - canvasRect.top - zoom;
    return {
        x: mouseX, y: mouseY
    };
}


// Canvas Functions

// Review (floored) "Bresenham Line algorithm" to avoid point skipping
function drawPixel(ctx, evt, zoom) {
    ctx.fillStyle = primaryColor;

    const mouse = getMousePos(ctx, evt, zoom);
    ctx.fillRect(mouse.x / zoom, mouse.y / zoom, pixelWidth, pixelWidth)
}