
const body = document.body;

const canvas = document.querySelector('#main_canvas');
const ctx = canvas.getContext("2d", {
    alpha: true
});

if (ctx === null) {
    alert("Unable to initialize Canvas. Your browser or machine may not support it.");
}

ctx.imageSmoothingEnabled = false;