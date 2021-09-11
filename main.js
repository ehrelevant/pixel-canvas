
// Misc Setup
const body = document.body;

// Tool Settings
const pencil = {
    primary: '#000000',
    secondary: '#FFFFFF',
    size: 1,
};

const eraser = {
    size: 1,
}


// Canvas Setup
const cv = {
    group: document.querySelector('#canvas_group'),

    bg: document.querySelector('#bg_canvas'),
    main: [
        document.querySelector('#main_canvas').querySelector('[data-layer="0"]'),
    ],
    fg: document.querySelector('#fg_canvas'),
    debug: document.querySelector('#debug_canvas'),

    info: {
        zoom: 8,
        maxZoom: 32,
        minZoom: 4,

        layer: 0,

        rect: undefined,
    },
    container: {
        area: document.querySelector('#draw_area'),
        rect: undefined,
    },

    generateNewRect() {
        this.info.rect = cv.group.getBoundingClientRect();
        if (this.container.rect === undefined) {
            this.container.rect = cv.container.area.getBoundingClientRect()
        }
    },
};


const ctx = {
    bg: cv.bg.getContext("2d"),
    main: [
        cv.main[0].getContext("2d"),
    ],
    fg: cv.fg.getContext("2d"),
    debug: cv.debug.getContext("2d"),

    disableInitialSmoothing() {
        this.main[0].imageSmoothingEnabled = false;
        this.debug.imageSmoothingEnabled = false;
    }
};


// Mouse Events
const mouse = {
    x: undefined,
    y: undefined,
    canvas: {
        x: undefined,
        y: undefined,
    },
    savedOffset: {
        x: undefined,
        y: undefined,
    },

    btnHeld: {
        left: false,
        middle: false,
        right: false,
    },

    updatePos(evt, zoom) {
        this.x = evt.pageX;
        this.y = evt.pageY;
        this.canvas.x = (evt.pageX - cv.info.rect.left - (zoom / 2) - 1) / zoom;
        this.canvas.y = (evt.pageY - cv.info.rect.top - (zoom / 2) - 1) / zoom;
    },
    savePanOffset(cvRect) {
        this.savedOffset.x = cvRect.left - this.x;
        this.savedOffset.y = cvRect.top - this.y;
    }
};


cv.group.addEventListener('click', evt => {
    if (evt.button === 0 || evt.button === 2) {
        mouse.updatePos(evt, cv.info.zoom);
        canvasCtrl.drawPixel(ctx.main[cv.info.layer], [mouse.canvas.x, mouse.canvas.y], cv.info.zoom);
    }
});

body.addEventListener('mousemove', evt => {
    mouse.updatePos(evt, cv.info.zoom);

    if (mouse.btnHeld.left) {
        canvasCtrl.drawPixel(ctx.main[cv.info.layer], [mouse.canvas.x, mouse.canvas.y], 0);
    } else if (mouse.btnHeld.right) {
        canvasCtrl.drawPixel(ctx.main[cv.info.layer], [mouse.canvas.x, mouse.canvas.y], 1);
    } else if (mouse.btnHeld.middle) {
        canvasCtrl.panCanvas(cv, mouse, mouse.savedOffset)
    }
});

body.addEventListener('mousedown', evt => {
    if (evt.button === 0) {
        mouse.btnHeld.left = true;
    } else if (evt.button === 2) {
        mouse.btnHeld.right = true;
    } else if (evt.button === 1) {
        mouse.savePanOffset(cv.info.rect);
        cv.container.area.classList.add('panning');

        mouse.btnHeld.middle = true;
    }
});

body.addEventListener('mouseup', evt => {
    if (evt.button === 0) {
        mouse.btnHeld.left = false;
    } else if (evt.button === 2) {
        mouse.btnHeld.right = false;
    } else if (evt.button === 1) {
        mouse.savedOffset.x = undefined;
        mouse.savedOffset.y = undefined;
        cv.container.area.classList.remove('panning');

        mouse.btnHeld.middle = false;
    }
});

body.addEventListener('mouseleave', evt => {
    if (mouse.btnHeld.left) {
        mouse.btnHeld.left = false;
    }
    if (mouse.btnHeld.right) {
        mouse.btnHeld.right = false;
    }
    if (mouse.btnHeld.middle) {
        mouse.savedOffset.x = undefined;
        mouse.savedOffset.y = undefined;
        cv.container.area.classList.remove('panning');

        mouse.btnHeld.middle = false;
    }
});

cv.container.area.addEventListener('wheel', evt => {
    const direction = (evt.wheelDelta > 0) ? 1 : -1;
    canvasCtrl.changeZoom(cv, direction, [cv.main[0].width, cv.main[0].height]);
});


// Stops context menu from opening when using secondary brush (will be added later)
cv.group.addEventListener('contextmenu', (e) => ( e.preventDefault() ), false)


// Settings Events
const primaryPicker = document.querySelector('#primary');
primaryPicker.addEventListener('input', evt => {
    pencil.primary = evt.target.value;
});

const secondaryPicker = document.querySelector('#secondary')
secondaryPicker.addEventListener('input', evt => {
    pencil.secondary = evt.target.value;
});


// Canvas Controller
const canvasCtrl = (() => {
    // Review (floored) "Bresenham Line algorithm" to avoid point skipping
    function drawPixel(ctx, pos, colorType) {
        ctx.fillStyle = (colorType === 1) ? pencil.secondary : pencil.primary;
        ctx.fillRect(pos[0], pos[1], pencil.size, pencil.size);
    }

    function changeZoom(cvs, direction, baseSize) {
        if ((cvs.info.zoom < cvs.info.maxZoom && direction > 0) || (cvs.info.zoom > cvs.info.minZoom && direction < 0)) {
            if (direction > 0) {
                cvs.info.zoom += 2;
            } else {
                cvs.info.zoom -= 2;
            }
            const newWidth = baseSize[0] * cvs.info.zoom;
            const newHeight = baseSize[1] * cvs.info.zoom;
            document.documentElement.style.setProperty('--canvas-width', `${newWidth}px`);
            document.documentElement.style.setProperty('--canvas-height', `${newHeight}px`);

            cvs.generateNewRect();
        }
    }

    function panCanvas(cvs, mPos, offset) {
        const newX = (mPos.x - cvs.container.rect.left) + offset.x;
        const newY = (mPos.y - cvs.container.rect.top) + offset.y;
        cvs.group.style.left = `${newX}px`;
        cvs.group.style.top = `${newY}px`;

        cvs.generateNewRect();
    }

    return {
        drawPixel, changeZoom, panCanvas
    };
})();



window.addEventListener('load', setup, false);

function setup() {
    cv.generateNewRect();

    ctx.disableInitialSmoothing();

    if (ctx.main[0] === null) {
        alert("Unable to initialize Canvas. Your browser or machine may not support it.");
    }
}