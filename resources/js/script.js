// Durstenfeld shuffle algorithm - O(n) time
function shuffle(array) {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


class Board {
  constructor() {
    this.state = [['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.']];
    this.solution;
    this._generateBoard();
  }

  _generateBoard() {
    this._fillBoard();
    this.solution = this.state.map(inner => [...inner]);

    this._removeClues();
  }

  // _solveBoard() {
  //   _fillRest(0);
  // }

  _fillBoard() {
    this._fillDiagonalBlocks();

    // Can start at cell index 3 because first 3 cells will be filled by function above.
    this._fillRest(3, true);
  }
  
  _fillDiagonalBlocks() {
    /**
     * Fills the three blocks along the top-left to bottom-right diagonal.
     * 
     * Explanation: The numbers within blocks (3x3 matrices) along a diagonal are independent of 
     *              each other. This is optimal because no validation is required.
     * 
     * Ex:
     *     4 6 3 . . . . . .
     *     7 8 1 . . . . . . 
     *     5 9 2 . . . . . . 
     *     . . . 7 4 1 . . . 
     *     . . . 9 5 3 . . . 
     *     . . . 6 8 2 . . . 
     *     . . . . . . 3 8 6 
     *     . . . . . . 1 5 9 
     *     . . . . . . 7 2 4 
     * 
     */

    for (let block = 0; block < 3; ++block) {
      let candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      shuffle(candidates);
      for (let idx = 0; idx < 9; ++idx) {
        const row = (block * 3) + Math.floor(idx / 3);
        const col = (block * 3) + (idx % 3);
        this.state[row][col] = candidates[idx]
      }
    }
  }

  _fillRest(i, generateFlag = false, forbidden_indices = [], forbidden_value = '.') {
    /**
     * Recursive function to fill the unassigned cells of the board through backtracking.
     * 
     * forbidden_indices and forbidden_value are used to identify a unique solution.
     */

    if (i == 81) {
      return true;
    }

    const row = Math.floor(i / 9);
    const col = i % 9;

    // Skip over cells already filled
    if (this.state[row][col] != '.') {
      return this._fillRest(i + 1, generateFlag, forbidden_indices, forbidden_value);
    }

    let candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (generateFlag) {
      shuffle(candidates);
    }

    for (let x = 0; x < 9; ++x) {
      const value = candidates[x];

      // TODO: Clean this up, not easy to read
      // Review: forbidden_indices.includes([row, col]) doesn't work. Something to do with === and arrays
      if (!generateFlag && value === forbidden_value) {
        for (let i = 0; i < forbidden_indices.length; ++i) {
          var continueOuter = false;
          if (forbidden_indices[i][0] === row && forbidden_indices[i][1] === col) {
            continueOuter = true;
            break;
          }
        }
        if (continueOuter)
          continue;
      }

      if (this._validRow(row, value) && this._validCol(col, value) && this._validBlock(row, col, value)) {
        this.state[row][col] = value;
        if (this._fillRest(i + 1, generateFlag, forbidden_indices, forbidden_value)) {
          return true;
        } else {
          this.state[row][col] = '.';
        }
      }
    }

    return false;
  }

  _validRow(row, value) {
    for (let c = 0; c < 9; ++c) {
      if (this.state[row][c] === value) {
        return false;
      }
    }
    return true;
  }

  _validCol(col, value) {
    for (let r = 0; r < 9; ++r) {
      if (this.state[r][col] === value) {
        return false;
      }
    }
    return true;
  }

  _validBlock(row, col, value) {
    const blockRowOffset = Math.floor(row / 3) * 3;
    const blockColOffset = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; ++r) {
      for (let c = 0; c < 3; ++c) {
        if (this.state[blockRowOffset + r][blockColOffset + c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  _removeClues() {
    /**
     * Randomly remove x pairs of clues from the puzzle.
     * 
     * A naive algorithm is to keep removing a clue at a time and checking that there is a unique solution.
     * 
     * However, sets of clues that are symmetrical can be removed together. Saves time, and also more pleasing to the eye.
     * https://books.google.com/books?id=xb4ICAAAQBAJ&pg=PA185&lpg=PA185&dq=sudoku+generator+removing+pairs&source=bl&ots=5xNVm50hib&sig=ACfU3U0e8ZX-DZ3VSiYhnTdSESZAc6Lt4Q&hl=en&sa=X&ved=2ahUKEwiqqJuEsNzpAhUFKH0KHRkSBLUQ6AEwCXoECAoQAQ#v=onepage&q=sudoku%20generator%20removing%20pairs&f=false
     * 
     * Algorithm description here too
     * https://dlbeer.co.nz/articles/sudoku.html
     * 
     * And also this one which I will sort of base off on for the time being
     * https://blog.ryanlevick.com/posts/sudoku-solver-generator/
     */

    let randomIndices = [...Array(81).keys()];
    shuffle(randomIndices);

    let cluesRemoved = 0;
    let nextRandomIndex = 0;

    while(cluesRemoved < 63 && nextRandomIndex < 81) {
      const row = Math.floor(randomIndices[nextRandomIndex] / 9);
      const col = randomIndices[nextRandomIndex] % 9;
      const cellValue = this.state[row][col];
      if (cellValue !== '.') {
        // Find symmetrical pairs/quads if there are any, else get the individual cell.
        let remove_indices = this._get_symmetrical_quads(row, col, cellValue);
        if (remove_indices.length === 0)
          remove_indices = this._get_symmetrical_pairs(row, col, cellValue);
        if (remove_indices.length === 0)
          remove_indices.push([row, col]);

        // Remove the picked cells.
        for (let i = 0; i < remove_indices.length; ++i) {
          const indices = remove_indices[i];
          this.state[indices[0]][indices[1]] = '.';
        }

        // Clone the current board state
        var stateCopy = this.state.map(inner => [...inner]);

        // Check that the grid is uniquely solvable
        if (!this._fillRest(0, false, remove_indices, cellValue)) {
          // A return of false means there is no solution therefore the board state is uniquely solvable
          cluesRemoved += remove_indices.length;
        } else {
          // If a solution is found, then restore the removed cells
          for (let i = 0; i < remove_indices.length; ++i) {
            const indices = remove_indices[i];
            stateCopy[indices[0]][indices[1]] = cellValue;
          }
        }
        // Copy needed because _fillRest will mess with the original
        // this.state = stateCopy.map(inner => [...inner])
        this.state = stateCopy;
      }
      // this.displayBoard(this.state);
      ++nextRandomIndex;
    }
    this.displayBoard(this.state);
    console.log('\n')
  }

  // TODO: Test this function
  _get_symmetrical_quads(row, col, value) {
    /**
     * Get the symmetrical quadruplet set for the cell in question if it exists.
     */
    if (row === 4 && col === 4)
      return [];
    else if (row === 4 && this.state[row][8-col] === value && this.state[col][row] === value && this.state[8-col][row])
      return [[row, col], [row, 8-col], [col, row], [8-col][row]];
    else if (col === 4 && this.state[8-row][col] === value && this.state[col][row] === value && this.state[col][8-row])
      return [[row, col], [8-row, col], [col, row], [col][8-row]];
    else if (this.state[row][8-col] == value && this.state[8-row][col] && this.state[8-row][8-col] === value)
      return [[row, col], [row, 8-col], [8-row, col], [8-row, 8-col]];
    else
      return [];
  }

  // TODO: Test this function
  _get_symmetrical_pairs(row, col, value) {
    /**
     * Get the symmetrical pair set for the cell in question if it exists.
     */
    if (row === 4 && col === 4)
      return [];
    else if (row === 4 && this.state[row][8-col] === value)
      return [[row, col], [row, 8-col]];
    else if (col === 4 && this.state[8-row][col] === value)
      return [[row, col], [8-row, col]];
    else if (this.state[8-row][8-col] === value)
      return [[row, col], [8-row, 8-col]];
    else
      return [];
  }

  displayBoard(board) {
    /**
     * Display given grid in the console for debugging
     */

    let s = "";
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        s += board[r][c] + " ";
      }
      console.log(s);
      s = "";
    }
  }
}

let board = new Board();
board.displayBoard(board.solution);

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

      if (board.state[i][j] !== '.') {
        tableCell.innerHTML = board.state[i][j];
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
      cell.innerHTML = board.solution[i][j];
    }
  }
}

drawInitialBoard();