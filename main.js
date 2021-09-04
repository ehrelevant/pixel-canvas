
let primaryColor = '#000000';
let secondaryColor = '#FFFFFF';


const body = document.body;

const mainCanvas = document.querySelector('#main_canvas');
const mainCtx = mainCanvas.getContext("2d");

const debugCanvas = document.querySelector('#debug_canvas');
const debugCtx = debugCanvas.getContext("2d")

if (mainCtx === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}

mainCtx.imageSmoothingEnabled = false;
console.log(mainCtx)


// Mouse Events/Functions
let isMouseHeld = false;

body.addEventListener('click', evt => {
    drawPixel(mainCtx, evt);
})

body.addEventListener('mousemove', evt => {
    if (isMouseHeld) {
        drawPixel(mainCtx, evt);
    }
});

body.addEventListener('mousedown', evt => {
    isMouseHeld = true;
});

body.addEventListener('mouseup', evt => {
    isMouseHeld = false;
});

function getMousePos(ctx, evt) {
    let canvasRect = ctx.canvas.getBoundingClientRect();

    const mouseX = evt.clientX - canvasRect.left;
    const mouseY = evt.clientY - canvasRect.top;
    return {
        x: mouseX, y: mouseY
    };
}


// Canvas Functions
function drawPixel(ctx, evt) {
    ctx.fillStyle = primaryColor;
    const mouse = getMousePos(ctx, evt);
    ctx.fillRect(mouse.x, mouse.y, 1, 1);
}
