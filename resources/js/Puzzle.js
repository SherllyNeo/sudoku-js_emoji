class Puzzle extends Solver{
  constructor() {
    let board = [];
    super(board);
    this.initialBoard;  // Keeping track of the initial board for resetting the puzzle.
    this.solution;

    this.generate();
  }

  generate() {
    this._newBoard();
    this._fillBoard();
    this.solution = this.board.map(inner => [...inner]);

    this._removeClues();
    this.initialBoard = this.board.map(inner => [...inner]);
  }

  _newBoard() {
    this.board = [['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
                  ['.', '.', '.', '.', '.', '.', '.', '.', '.']];
  }

  _fillBoard() {
    /**
     *  Produce a valid solution grid. 
     */
    this._fillDiagonalBlocks();

    // Can start at cell index 3 because first 3 cells will be filled by function above.
    this.fillBoard(3, true);
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
      this._shuffle(candidates);
      for (let idx = 0; idx < 9; ++idx) {
        const row = (block * 3) + Math.floor(idx / 3);
        const col = (block * 3) + (idx % 3);
        this.board[row][col] = candidates[idx]
      }
    }
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
    this._shuffle(randomIndices);

    let cluesRemoved = 0;
    let nextRandomIndex = 0;

    // cluesRemoved < 64 because it has been proven that no 16-clue Sudoku puzzle with a unique solution exists
    // TODO: this.branch_dificulty_score using to filter out puzzle that is taking too long to generate, but not working.
    while(cluesRemoved < 64 && nextRandomIndex < 81 && this.branch_dificulty_score < 80 || this.branch_dificulty_score > 100) {
      const row = Math.floor(randomIndices[nextRandomIndex] / 9);
      const col = randomIndices[nextRandomIndex] % 9;
      const cellValue = this.board[row][col];
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
          this.board[indices[0]][indices[1]] = '.';
        }

        // Clone the current board state
        var stateCopy = this.board.map(inner => [...inner]);

        // Check that the grid is uniquely solvable
        if (!this.solve(0, false, remove_indices, cellValue)) {
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
        // this.board = stateCopy.map(inner => [...inner])
        this.board = stateCopy;
      }

      ++nextRandomIndex;
    }
  }

  // TODO: Test this function
  _get_symmetrical_quads(row, col, value) {
    /**
     * Get the symmetrical quadruplet set for the cell in question if it exists.
     */
    if (row === 4 && col === 4)
      return [];
    else if (row === 4 && this.board[row][8-col] === value && this.board[col][row] === value && this.board[8-col][row])
      return [[row, col], [row, 8-col], [col, row], [8-col][row]];
    else if (col === 4 && this.board[8-row][col] === value && this.board[col][row] === value && this.board[col][8-row])
      return [[row, col], [8-row, col], [col, row], [col][8-row]];
    else if (this.board[row][8-col] == value && this.board[8-row][col] && this.board[8-row][8-col] === value)
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
    else if (row === 4 && this.board[row][8-col] === value)
      return [[row, col], [row, 8-col]];
    else if (col === 4 && this.board[8-row][col] === value)
      return [[row, col], [8-row, col]];
    else if (this.board[8-row][8-col] === value)
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