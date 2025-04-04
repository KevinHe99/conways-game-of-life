const gridWidth = 50;
const gridHeight = 50;
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
            cell.addEventListener("mouseover", () => {
                if (mouseDown === true) {
                    toggleCell(x, y);
                }
            });
            cell.addEventListener("mouseout", () => cell.classList.remove("hover"));
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
        // Stop the simulation
        clearInterval(intervalId);
        intervalId = null;

        // Change the button to Start
        startStopSimBtn.classList.add("bg-green-500");
        startStopSimBtn.classList.add("hover:bg-green-700");
        startStopSimBtn.classList.remove("bg-red-500");
        startStopSimBtn.classList.remove("hover:bg-red-700");
        startStopSimBtn.innerText = "Start";

        // Enable the Next Generation Button
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1.0"; // Reduce opacity
        nextBtn.style.cursor = "pointer"; // Hand cursor
        nextBtn.classList.add("hover:bg-blue-700")
    }else {
        // Start the simulation
        intervalId = setInterval(nextGeneration, 200);

        // Change the button to Stop
        startStopSimBtn.classList.add("bg-red-500");
        startStopSimBtn.classList.add("hover:bg-red-700");
        startStopSimBtn.classList.remove("bg-green-500");
        startStopSimBtn.classList.remove("hover:bg-green-700");
        startStopSimBtn.innerText = "Stop";

        // Disable the Next Generation Button
        nextBtn.disabled = true;
        nextBtn.style.opacity = "0.6"; // Reduce opacity
        nextBtn.style.cursor = "not-allowed"; // Change cursor
        nextBtn.classList.remove("hover:bg-blue-700")
    }
}

function clearGrid() {
    if (confirm("Are you sure you want to clear the grid?")) {
        clearInterval(intervalId);
        intervalId = null;
        startStopSimBtn.classList.add("bg-green-500");
        startStopSimBtn.classList.add("hover:bg-green-700");
        startStopSimBtn.classList.remove("bg-red-500");
        startStopSimBtn.classList.remove("hover:bg-red-700");
        startStopSimBtn.innerText = "Start";
        createGrid();
    }
}

// Attach event listeners
startStopSimBtn.addEventListener("click", startStopSimulation);
clearBtn.addEventListener("click", clearGrid);
nextBtn.addEventListener("click", nextGeneration);

// Initialize grid on page load
createGrid();

var mouseDown = false;
document.body.onmousedown = function() {
    mouseDown = true;
}
document.body.onmouseup = function() {
    mouseDown = false;
}