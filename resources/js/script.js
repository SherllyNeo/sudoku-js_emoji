let puzzle = new Puzzle();
puzzle.displayBoard(puzzle.solution);

function drawInitialBoard() {
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

      if (puzzle.board[i][j] !== '.') {
        tableCell.innerHTML = puzzle.board[i][j];
        tableCell.style.backgroundColor = "antiquewhite";
      }

      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
}

function revealSolution() {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      const id = "table-cell-" + i.toString() + "-" + j.toString();
      let cell = document.getElementById(id);
      cell.innerHTML = puzzle.solution[i][j];
    }
  }
}

drawInitialBoard();