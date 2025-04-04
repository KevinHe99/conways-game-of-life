const gridWidth = 30;
const gridHeight = 30;
let grid = [];
let nextGrid = [];
let intervalId = null;

const gridContainer = document.getElementById("grid-container");
const startStopSimBtn = document.getElementById("start-stop-btn");
const clearBtn = document.getElementById("clear-btn");
const nextBtn = document.getElementById("next-btn");

function createGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    nextGrid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(false));

    for (let y = 0; y < gridHeight; y++) {
        let row = [];
        for (let x = 0; x < gridWidth; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", () => toggleCell(x, y));
            gridContainer.appendChild(cell);
            row.push(cell);
        }
        grid.push(row);
    }
}

function toggleCell(x, y) {
    const cell = grid[y][x];
    const isAlive = cell.classList.contains("alive");
    if (isAlive) {
        cell.classList.remove("alive");
    } else {
        cell.classList.add("alive");
    }
    nextGrid[y][x] = !isAlive;
}

function getNeighbors(x, y) {
    const neighbors = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1],
    ];
    let count = 0;

    neighbors.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight && grid[ny][nx].classList.contains("alive")) {
            count++;
        }
    });

    return count;
}

function updateGrid() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = grid[y][x];
            const aliveNeighbors = getNeighbors(x, y);

            if (cell.classList.contains("alive")) {
                nextGrid[y][x] = aliveNeighbors === 2 || aliveNeighbors === 3;
            } else {
                nextGrid[y][x] = aliveNeighbors === 3;
            }
        }
    }

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = grid[y][x];
            if (nextGrid[y][x]) {
                cell.classList.add("alive");
            } else {
                cell.classList.remove("alive");
            }
        }
    }
}

function nextGeneration() {
    updateGrid();
}

function startStopSimulation() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        startStopSimBtn.classList.add("bg-green-500");
        startStopSimBtn.classList.add("hover:bg-green-700");
        startStopSimBtn.classList.remove("bg-red-500");
        startStopSimBtn.classList.remove("hover:bg-red-700");
        startStopSimBtn.innerText = "Start";
    }else {
        intervalId = setInterval(nextGeneration, 200);
        startStopSimBtn.classList.add("bg-red-500");
        startStopSimBtn.classList.add("hover:bg-red-700");
        startStopSimBtn.classList.remove("bg-green-500");
        startStopSimBtn.classList.remove("hover:bg-green-700");
        startStopSimBtn.innerText = "Stop";
    }
}

function clearGrid() {
    clearInterval(intervalId);
    intervalId = null;
    createGrid();
}

// Attach event listeners
startStopSimBtn.addEventListener("click", startStopSimulation);
clearBtn.addEventListener("click", clearGrid);
nextBtn.addEventListener("click", nextGeneration);

// Initialize grid on page load
createGrid();
