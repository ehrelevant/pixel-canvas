
let primaryColor = '#000000';
let secondaryColor = '#FFFFFF';
let pixelWidth = 1;
let zoom = 8;


const body = document.body;

const cv = {
    bg: document.querySelector('#bg_canvas'),
    main: document.querySelector('#main_canvas'),
    fg: document.querySelector('#fg_canvas'),
    debug: document.querySelector('#debug_canvas'),
};

const canvasRect = cv.main.getBoundingClientRect();


const ctx = {
    bg: cv.bg.getContext("2d"),
    main: cv.main.getContext("2d"),
    fg: cv.fg.getContext("2d"),
    debug: cv.debug.getContext("2d"),

    disableAllSmoothing() {
        this.main.imageSmoothingEnabled = false;
        this.debug.imageSmoothingEnabled = false;
    }
};

ctx.disableAllSmoothing();


if (ctx.main === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}


// Mouse Events/Functions
const mouse = {
    x: undefined,
    y: undefined,
    canvas: {
        x: undefined,
        y: undefined,
    },

    isHeld: false,

    updatePos(evt, zoom) {
        this.x = evt.clientX;
        this.y = evt.clientY;
        this.canvas.x = (evt.clientX - canvasRect.left - zoom) / zoom;
        this.canvas.y = (evt.clientY - canvasRect.top - zoom) / zoom;
    },
}


body.addEventListener('click', evt => {
    mouse.updatePos(evt, zoom);
    canvasCtrl.drawPixel(ctx.main, [mouse.canvas.x, mouse.canvas.y], zoom)
});

body.addEventListener('mousemove', evt => {
    if (mouse.isHeld) {
        mouse.updatePos(evt, zoom);
        canvasCtrl.drawPixel(ctx.main, [mouse.canvas.x, mouse.canvas.y], zoom)
    }
});

body.addEventListener('mousedown', evt => {
    mouse.isHeld = true;
});

body.addEventListener('mouseup', evt => {
    mouse.isHeld = false;
});


// Canvas Functions
const canvasCtrl = (() => {
    // Review (floored) "Bresenham Line algorithm" to avoid point skipping
    function drawPixel(ctx, pos, zoom) {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(pos[0], pos[1], pixelWidth, pixelWidth)
    }

    return {
        drawPixel
    };
})();