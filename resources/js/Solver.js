class Solver {
  constructor(board) {
    this.board = board;
    this.empty_cells_count = 0;
    this.branch_dificulty_score = 0;
  }

  // TODO: Better grading methodology. Take a look at "set-oriented freedom analysis."
  get_rating() {
    /**
     * Simple grading method.
     * Keep track of the branch factor at each step on the path from the root of the search tree to the solution.
     * 
     * S = B * 100 + E
     * B is the branch-difficulty score. B = summation of (Bi - 1)^2 at each node, where Bi are the branch factors.
     * E is the number of empty cells. E is used to bias puzzles with less clues with same branch-difficulty.
     */

    return this.branch_dificulty_score * 100 + this.empty_cells_count;
  }

  solve(i, generateFlag = false, forbidden_indices = [], forbidden_value = '.') {
    /**
     * Solve the Sudoku puzzle.
     * 
     * Same as fillBoard() except grading variables are resetted.
     * Use this function when get_rating() will be used.
     */

    this.empty_cells_count = 0;
    this.branch_dificulty_score = 0;
    return this.fillBoard(i, generateFlag, forbidden_indices, forbidden_value)
  }

  fillBoard(i, generateFlag = false, forbidden_indices = [], forbidden_value = '.') {
    /**
     * Recursive function to fill the unassigned cells of the board through backtracking.
     * 
     * set generateFlag to true to randomize the iteration of the possible candidates
     * forbidden_indices and forbidden_value are used to identify a unique solution.
     */

    if (i == 81) {
      return true;
    }

    const row = Math.floor(i / 9);
    const col = i % 9;

    // Skip over cells already filled
    if (this.board[row][col] != '.') {
      return this.fillBoard(i + 1, generateFlag, forbidden_indices, forbidden_value);
    }

    let candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (generateFlag) {
      this._shuffle(candidates);
    }

    // TODO: Optimization
    // Start with the analysis of the previous step and modify it by removing values along the row, column and box 
    // of the last-modified cell. O(N) vs O(N^3).
    let validCandidates = [];
    for (let x = 0; x < 9; ++x) {
      const value = candidates[x];
      if (this._validRow(row, value) && this._validCol(col, value) && this._validBlock(row, col, value)) {
        validCandidates.push(value);
      }
    }

    for (const index in validCandidates) {
      const value = validCandidates[index];

      // TODO: Clean this section up, not easy to read
      // ------------------------------------------------------------------------------------------------
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
      // ------------------------------------------------------------------------------------------------

      this.board[row][col] = value;
      if (this.fillBoard(i + 1, generateFlag, forbidden_indices, forbidden_value)) {
        this.branch_dificulty_score += Math.pow(validCandidates.length - 1, 2);
        ++this.empty_cells_count;
        return true;
      } else {
        this.board[row][col] = '.';
      }
    }

    return false;
  }

  _shuffle(array) {
    /**
     * Durstenfeld shuffle algorithm - O(n) time
     */
    for (let i = array.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  _validRow(row, value) {
    for (let c = 0; c < 9; ++c) {
      if (this.board[row][c] === value) {
        return false;
      }
    }
    return true;
  }

  _validCol(col, value) {
    for (let r = 0; r < 9; ++r) {
      if (this.board[r][col] === value) {
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
        if (this.board[blockRowOffset + r][blockColOffset + c] === value) {
          return false;
        }
      }
    }
    return true;
  }
}