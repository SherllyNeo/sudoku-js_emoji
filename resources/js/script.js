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
    this.solution = this.state;
    // this.displayBoard();


  }

  _fillBoard() {
    this._fillDiagonalBlocks();

    // Can start at cell index 3 because first 3 cells will be filled by function above.
    this._fillRest(3);
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

  _fillRest(i) {
    /**
     * Recursive helper function to fill the rest of the board through backtracking.
     */

    // There are 81 cells total, but can stop at index 78 because last 3 cells will be filled already.
    if (i == 78) {
      return true;
    }

    const row = Math.floor(i / 9);
    const col = i % 9;

    // Skip over cells already filled by function _fillDiagonalBlocks
    if (this.state[row][col] != '.') {
      return this._fillRest(i + 1);
    }

    let candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    shuffle(candidates);

    for (let x = 0; x < 9; ++x) {
      const value = candidates[x];
      if (this._validRow(row, value) && this._validCol(col, value) && this._validBlock(row, col, value)) {
        this.state[row][col] = value;
        if (this._fillRest(i + 1)) {
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

  displayBoard() {
    let s = "";
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        s += this.solution[r][c] + " ";
      }
      console.log(s);
      s = "";
    }
  }
}

let board = new Board();