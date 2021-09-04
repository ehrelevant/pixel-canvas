
const mainCanvas = document.querySelector('#main_canvas');
const ctx = canvas.getContext("2d");

const debugCanvas = document.querySelector('#debug_canvas');
const debugCtx = canvas.getContext("2d")

if (ctx === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}

ctx.imageSmoothingEnabled = false;