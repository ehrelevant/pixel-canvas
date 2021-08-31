
const body = document.body;

const canvas = document.querySelector('#main_canvas');
const ctx = canvas.getContext("2d", {
    alpha: true
});

if (ctx === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}

ctx.imageSmoothingEnabled = false;

let width = canvas.width;
let height = canvas.height;

let primaryColor = '#000000FF';
let secondaryColor = '#FFFFFF00';

const borderTopWidth = parseInt(window.getComputedStyle(canvas, null)
        .getPropertyValue('border-top-width'), 10)
const borderLeftWidth = parseInt(window.getComputedStyle(canvas, null)
        .getPropertyValue('border-left-width'), 10)

let scaleLevel = 16;

let isMouseHeld = false;


body.addEventListener('mouseup', evt => {
    isMouseHeld = false;
});

canvas.addEventListener('mousedown', evt => {
    isMouseHeld = true;
    drawPixel(evt)
});

canvas.addEventListener('mousemove', evt => {
    if (isMouseHeld) {
        drawPixel(evt);
    }
});

canvas.addEventListener('contextmenu', (evt) => {
    return false;
});

function drawPixel(evt) {
    ctx.fillStyle = primaryColor;

    const mousePos = getMousePos(ctx, evt);
    const pixelPos = getPixelPos(mousePos, scaleLevel);

    ctx.fillRect(pixelPos.x, pixelPos.y, scaleLevel, scaleLevel);
}

function getMousePos(ctx, evt) {
    let rect = canvas.getBoundingClientRect();

    const mouseX = evt.clientX - borderLeftWidth - rect.left;
    const mouseY = evt.clientY - borderTopWidth - rect.top;
    return {
        x: mouseX, y: mouseY
    };
}

function getPixelPos(mousePos, scaleLevel) {
    const pixelX = Math.floor(mousePos.x / scaleLevel) * scaleLevel;
    const pixelY = Math.floor(mousePos.y / scaleLevel) * scaleLevel;
    return {
        x: pixelX, y: pixelY
    };
}