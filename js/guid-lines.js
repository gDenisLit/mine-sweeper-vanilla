'use strict'

// TODO: 

// Guideline functions: 

// init()
// buildBoard()
// setMinesNegsCount(board)
// renderBoard(board)
// cellClicked(board)
// cellMarked(elCell)
// checkGameOver()
// expandShown(board, elCell, i, j)

//###########################################################

// Guidline variables: 

// gBoard = [{
    // mineAroundCount: 4,
    // isShown: true,
    // isMine: flase,
    // isMarked: true  
// }]

// gLevel = {
    // SIZE: 4,
    // MINES: 2
// }

// gGame = {
    // isOn: false,
    // showCount: 0, 
    // markedCount: 0, 
    // secsPassed: 0
// }

//###########################################################

// Guidline Step: 

// Step1 - the seed app:

// V 1: Create a 4x4 gBoard Matrix containing Objects. 
//      place 2 mines manually when each cell's isShow set to true.
// V 2: Present the mines using renderBoard().

// Step2 - coung neighbors: 

// V 1: Create setMinesNegsCount() and store the numbers
//      (isShown is still true)
// V 2: Present the board with the neighbor count and the 
//      mines using rendeBoard() function.
// V 3: Have a console.log presenting the board content - 
//      to help you with debuggin

// Step3 - click to reveal: 

// V 1: Make sure your renderBoard() function adds the cell ID 
//      to each cell and onclick on each cell calls cellClicked().
// V 2: Make the deafault "isShown" to be "false". 
// V 3: Implement that clicking a cell with "number" reveals the 
//      number of this cell.

// Step4 - randomize mines location: 

// V 1: Randomly locate the 2 mines on the board.
// V 2: Present the mines using renderBoard(). 

//###########################################################

// UI guidline: 

// V 1: Board is square and cells are squares. 
// V 2: Cells keep their size when hovered and when revealed.
// V 3: Board keeps its position (shouldnt move) along all game pahses
//      (do not add UI element dynamically above it)
// V 4: Mines look like mines. 
// V 5: Add a footer at the bottom of the page with your full name. 

//###########################################################

// Further Tasks 

// V Fist click in never a mine :
//      (HINT: place the mines and count the neighbors only on first click)

// V Lives:
//      Add support for "LIVES" - the user has 3 lives:
//      when a mine is clicked, there is an indication to the user
//      that he clicked a mine. The LIVES counter decrease. 
//      The user can coutinue playing. 

// V The smiley:  
// V 1. Normal
// V 2. Sad & Dead (steeped on a mine)
// V 3. Sunglasses - WIN 
// V 4. Clicking the smiley should reset the game 

//###########################################################

// Bonus Tasks  

// V Add support for HINTS:
//      When a hint is clicked, it changes its look, example: 
//          Now, when a cell (unreavealed) is clicked, the cell
//          its neighbors are revealed for a second, and the 
//          hint disappears. 

// V Best Score: 
//      Keep the best score in "local storage" (per level)
//      and show it on the page 

// V Full Expand: 
//      When and empy cell is clicked, open all empty cells that 
//      are connected and their numbered neighbors (as done in the game)
//      this feature is normally implemented using recursion. 

// V Safe click: 
//      The user has 3 safe-click
//      Clicking the safe-click button will mark a random 
//      covered cell (for a few seconds) that is safe to click - 
//      (does not contain a mine). 
//      Present the remaining safe-clicks count. 

// V Manually positioned mines:
//      Create a "manually create" mode in which the 
//      user first position the mines (by clicking cells) 
//      and then plays. 

// V Undo: 
//      Add an "UNDO" button, each click on that button takes the 
//      game back by one step (can go all the way back to the start)

// V 7 BOOM!: 
//      Add a "7 BOOM!" button, clicking the button restart the game,
//      and locate the MINESS according to the "7 BOOM" principle.
//      (each cell-index that containes "7" or a multiplication 
//      of "7"). Note that the cell-index shall be countinuous number
//      (i.e in a 8*8 Matrix is shall be between o to 63). 

// GOOD LUCK! 

