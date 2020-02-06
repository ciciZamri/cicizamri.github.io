let devicewidth = window.innerWidth;
let deviceheight = window.innerHeight;
let alpha2 = 0;
let pixelInputs = [];

let model = new Model(use_pretrained = true);

const drawingCanvas = document.querySelector("#drawing-canvas");
drawingCanvas.width = 28 * 10;
drawingCanvas.height = 28 * 10;
let isDrawing = false;

function start() {
    for (let i = 0; i < 28; i++) {
        let row = [];
        for (let j = 0; j < 28; j++) {
            row.push(0);
        }
        pixelInputs.push(row);
    }

    model.forward(pixelInputs);
    updateDrawingCanvas();
    drawneurons();
}

start();

drawingCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const x = parseInt(e.offsetX / 10);
    const y = parseInt(e.offsetY / 10);
    paint(x, y);
    updateDrawingCanvas();
});

drawingCanvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const x = parseInt(e.offsetX / 10);
        const y = parseInt(e.offsetY / 10);
        paint(x, y);
        updateDrawingCanvas();
    }
});

drawingCanvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        isDrawing = false;
    }
});

function paint(x, y) {
    pixelInputs[y][x] = 1;
    pixelInputs[y==27 ? y : y + 1][x] = 1;
    pixelInputs[y==0 ? y : y - 1][x] = 1;
    pixelInputs[y][x + 1] = 1;
    pixelInputs[y][x - 1] = 1;
    pixelInputs[y==27 ? y : y + 1][x + 1] = 1;
    pixelInputs[y==27 ? y : y + 1][x - 1] = 1;
    pixelInputs[y==0 ? y : y - 1][x + 1] = 1;
    pixelInputs[y==0 ? y : y - 1][x - 1] = 1;
}

function updateDrawingCanvas() {
    model.forward(pixelInputs);
    const ctx = drawingCanvas.getContext('2d');
    ctx.clearRect(1, 1, 280, 280);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillStyle = "black";
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            ctx.strokeRect(i * 10 + 1, j * 10 + 1, 10, 10);
            ctx.fillRect(i * 10 + 1, j * 10 + 1, pixelInputs[j][i] * 10, pixelInputs[j][i] * 10);
        }
    }
}

function drawneurons() {
    const neuronsCanvas = document.querySelector("#neurons-canvas");
    neuronsCanvas.width = devicewidth;
    neuronsCanvas.height = 350;
    const ctx = neuronsCanvas.getContext('2d');
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillRect(0, 0, neuronsCanvas.width, neuronsCanvas.height);

    const padding = 3;
    const radius = ((devicewidth - 20) / (50 * 2) - padding / 2);
    const alpha1 = M.sigmoid(model.l1_output);
    for (let j = 1; j <= 6; j++) {
        ctx.beginPath();
        for (let i = 1; i <= 50; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha1[(50*(j-1)) + i]})`;
            ctx.arc(i * (2 * radius + padding), j * (2 * radius + padding), radius, 0, Math.PI * 2, true);
        }
        ctx.fill();
    }

    alpha2 = M.sigmoid(model.l2_output);
    for (let j = 1; j <= 2; j++) {
        ctx.beginPath();
        for (let i = 1; i <= 50; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha2[(50*(j-1)) + i]})`;
            ctx.arc(i * (2 * radius + padding), 200 + j * (2 * radius + padding), radius, 0, Math.PI * 2, true);
        }
        ctx.fill();
    }

    const alpha3 = M.sigmoid(model.final_output);
    ctx.beginPath();
    for (let i = 20; i < 30; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha3[i]})`;
        ctx.arc(i * (2 * radius + padding), 300 + 1 * (2 * radius + padding), radius, 0, Math.PI * 2, true);
    }
    ctx.fill();
}

window.addEventListener('resize', (e) => {
    devicewidth = window.innerWidth;
    deviceheight = window.innerHeight;
    drawneurons();
})