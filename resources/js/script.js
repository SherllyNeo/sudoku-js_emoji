// -------------------------------------------------------------------------------------
// Initialization Section and Global Varaibles
// -------------------------------------------------------------------------------------
drawBoard();
drawNumberPad();
var puzzle = new Puzzle();
drawInitialPuzzle();
var selectedCell;

// -------------------------------------------------------------------------------------
// HTML Section
// -------------------------------------------------------------------------------------
function drawBoard() {
  let table = document.getElementById('sudoku-table');
  for (let i = 0; i < 9; ++i) {
    let tableRow = document.createElement('tr');
    if (i === 2 || i === 5) {
      tableRow.className = "sudoku-table-row-seperator";
    } else {
      tableRow.className = "sudoku-table-row";
    }

    for (let j = 0; j < 9; ++j) {
      let tableCell = document.createElement('td');
      if (j === 2 || j === 5) {
        tableCell.className = "sudoku-table-cell-seperator";
      } else {
        tableCell.className = "sudoku-table-cell";
      }

      tableCell.id = "table-cell-" + i.toString() + "-" + j.toString();
      tableCell.style.fontWeight = "bold";
      tableCell.setAttribute('onclick','selectCell(this)')
      tableCell.contentEditable = 'true';
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
}

function drawNumberPad() {
  let pad = document.getElementById('number-pad');
  for (let i = 0; i < 9; ++i) {
    let numberButton = document.createElement('button');
    numberButton.className = "btn number-pad-button";
    numberButton.setAttribute('onclick','numberPadSelect(' + (i+1).toString() + ')')
    numberButton.id = "number-pad-value-" + (i+1).toString();
    numberButton.innerHTML = i + 1;
    pad.appendChild(numberButton);
  }

  let deleteButton = document.createElement('button');
  deleteButton.className = "btn number-pad-button";
  deleteButton.setAttribute('onclick','numberPadSelect(0)')
  deleteButton.id = "number-pad-delete";
  deleteButton.innerHTML = 'X';
  deleteButton.style = "width: 100%; height: 48px; padding: 0px;";
  pad.appendChild(deleteButton);
}

// -------------------------------------------------------------------------------------
// Toolbar Section
// -------------------------------------------------------------------------------------
let difficultyButtons = [];
difficultyButtons.push(document.getElementById("easy-button"));
difficultyButtons.push(document.getElementById("medium-button"));
difficultyButtons.push(document.getElementById("hard-button"));

// 0 is Easy, 1 is Medium, 2 is Hard
var currentDifficulty = 0;

function switchtoEasy() {
  _switchDifficulty(0);
}

function switchtoMedium() {
  _switchDifficulty(1);
}

function switchtoHard() {
  _switchDifficulty(2);
}

function _switchDifficulty(difficulty) {
  if (currentDifficulty !== difficulty) {
    difficultyButtons[currentDifficulty].classList.remove('toolbar-button-selected');
    currentDifficulty = difficulty;
    difficultyButtons[difficulty].classList.add('toolbar-button-selected');
  }
}

function createNewGame() {
  puzzle.generate();
  drawInitialPuzzle();
}

function resetPuzzle() {
  drawInitialPuzzle();
}

function revealPuzzle() {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      if (puzzle.initialBoard[i][j] === '.') {
        const id = "table-cell-" + i.toString() + "-" + j.toString();
        let cell = document.getElementById(id);
        cell.style.color = "#3673CD";
        cell.innerHTML = puzzle.solution[i][j];
      }
    }
  }
}

function numberPadSelect(value) {
  if (selectedCell) {
    if (value == 0) {
      selectedCell.innerHTML = "";
    } else {
      selectedCell.innerHTML = value;
    }
  }
}

// -------------------------------------------------------------------------------------
// Puzzle Section
// -------------------------------------------------------------------------------------
function drawInitialPuzzle() {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      const id = "table-cell-" + i.toString() + "-" + j.toString();
      let cell = document.getElementById(id);
      let value = puzzle.initialBoard[i][j];
      cell.style.color = 'black';
      if (value !== '.') {
        cell.innerHTML = value;
        cell.style.backgroundColor = "#e6e6e6";
      } else {
        cell.innerHTML = "";
        cell.style.backgroundColor = "white";
      }
    }
  }

  // TODO: Reset a timer here instead later
  document.getElementById('difficulty').innerHTML = "Difficulty: " + puzzle.get_rating();
}

function selectCell(newCell) {
  if (selectedCell) {
    selectedCell.style.backgroundColor = "white";
  }
  newCell.style.backgroundColor = '#e3b81b';
  selectedCell = newCell;
}