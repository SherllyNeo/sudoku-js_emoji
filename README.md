# Sudoku JS

During one weekend, I became heavily addicted to Sudoku. I quite literally sat for 3-4 hours at a time mentally competing with myself to solve puzzles labeled "Hard" as quickly as possible. I eventually did lose interest in solving them, but I began wondering how to generate them.

After discovering that they are generated computationally through backtracking, I decided to code it up for fun. I also took advantage of doing this project to improve my bare knowledge of Javascript, HTML, and CSS. 

## Reference
  https://dlbeer.co.nz/articles/sudoku.html
  
  This article was very helpful during my process of writing the logic for generating Sudoku puzzles.

## Overview of the Code
### Solver Algorithm
1. Recursively iterate through each cell in the 9x9 grid.
2. At each cell, find all the possible values by checking that a value isn't already in the row, the column, and/or the 3x3 subgrid. 
3. Set the value of the cell to a selected possible value.
4. Recursive call iterating to the next cell until all cells are filled.
5. If a cell has no candidate value, backtrack and select a new possible value.

### Difficulty Estimation Algorithm
While running the solver algorithm, keep track of the branching factor (B<sub>i</sub>) for each i cell. B is the sum of (B<sub>i</sub> - 1)<sup>2</sup>. In addition, keep track of the number of empty cells E.

Difficulty = B * 100 + E.

**Note:** In the article I referenced, there is better technique for estimating the difficulty of a Sudoku puzzle: set-oriented freedom analysis. 

### Generator Algorithm
1. Observe that all 3x3 subgrids along a diagonal are independent of each other. Randomly generate 1 to 9 and fill in each of those subgrids.
    * Ex:
    
    4 6 3 _ _ _ _ _ _
    
    7 8 1 _ _ _ _ _ _
    
    5 9 2 _ _ _ _ _ _
    
    _ _ _ 7 4 1 _ _ _
    
    _ _ _ 9 5 3 _ _ _
    
    _ _ _ 6 8 2 _ _ _
    
    _ _ _ _ _ _ 3 8 6 
    
    _ _ _ _ _ _ 1 5 9 
    
    _ _ _ _ _ _ 7 2 4 
2. Fill the grid by running the Solver with a slight modification to randomly shuffle the list of possible values for each cell. I used a flag variable to distinguish when the Solver should shuffle.
3. Randomly remove a cell.
    **Note:** If a cell has symmetrical quadruplets or a symmetrical pair, those can also be removed. This saves time, and is also more pleasing to the eye. The [section in this book](https://books.google.com/books?id=xb4ICAAAQBAJ&pg=PA185&lpg=PA185&dq=sudoku+generator+removing+pairs&source=bl&ots=5xNVm50hib&sig=ACfU3U0e8ZX-DZ3VSiYhnTdSESZAc6Lt4Q&hl=en&sa=X&ved=2ahUKEwiqqJuEsNzpAhUFKH0KHRkSBLUQ6AEwCXoECAoQAQ#v=onepage&q=sudoku%20generator%20removing%20pairs&f=false) explains the process of removing symmetrical quadruplets and pairs well.
4. Run the solver again, this time forbidding the original number in the removed cell(s).
5. If the solver successfully solves it, then the puzzle isn't uniquely solvable. Put back the original value.
6. If the solver can't solve it, then there is only one solution. Leave the cell(s) empty.
7. Repeat as many iterations as desired. 
    **Note:** Can stop when there is only 16 clues left as it has been proven that there doesn't exists a puzzle with 16 clues or less that is uniquely solvable. 
## To-Do
#### Puzzle Algorithm
* Right now, the puzzle is taking a while to generate on some iterations. An optimization to make in the Solver is when getting valid candidates, start with the analysis of the previous step and modify it by removing values along the row, column, and box of the last-modified cell. This will bring down the time complexity from O(N<sup>3</sup>) to O(N).
* Review my difficulty estimation algorithm. Something is wrong with the code. Difficulty 0 for some generations.
* Use the better difficulty estimation algorithm in the article I referenced.
* Use the difficulty score to generate Easy, Medium, Hard puzzles. Currently, I just continue removing clues until there are 16 left or all the list of shuffle cells to go through is exhausted.
#### Front-End
* Make the puzzle grid scalable with the window.
* Allow users to make notes inside of each cell, similar to how the New York Times Sudoku does.
* Timer
* Help section where  a user can get hints, check cells, reveals cells, check the puzzle, and reveal the solution.
* Functional Easy, Medium, Hard buttons.
