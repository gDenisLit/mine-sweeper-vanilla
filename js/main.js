'use strick'

var gBoard
var gCellID = 0

var gCells = []

var gCurrShownCells = []
var gTotalShownCells = []

var gFoundSafeCells = []
var gFoundSafeCellsIDs = []

var gMinesPlanted = 0

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        var row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                id: ++gCellID,
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                rowIdx: i,
                colIdx: j
            }
            row.push(cell)
            gCells.push(cell)
        }
        board.push(row)
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>\n'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var className = `class="cell-${i}-${j}"`
            strHTML += `<td ${className} onmousedown="logMouseButton(event, ${i}, ${j})" 
                        oncontextmenu="event.preventDefault()"></td>\n`
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'

    var elTableContainer = getSelector('.table-container')
    elTableContainer.innerHTML = strHTML
}

function plantMines(board, boardSize, minesCount, firstClickPos) {

    while (gMinesPlanted < minesCount) {
        var randomPosition = {
            i: getRandomIntInclusive(0, boardSize - 1),
            j: getRandomIntInclusive(0, boardSize - 1)
        }
        if (randomPosition.i === firstClickPos.i &&
            randomPosition.j === firstClickPos.j) continue

        var cell = board[randomPosition.i][randomPosition.j]
        if (!cell.isMine) {
            cell.isMine = true
            gMinesPlanted++
        }
        else continue
    }
    setMinesNegsCount(board)
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) continue
            var elCell = getElCell(i, j)
            elCell.classList.add('mine')
        }
    }
}

function expandShown(board, rowIdx, colIdx) {

    var currCell = board[rowIdx][colIdx]
    var elCurrCell = getElCell(rowIdx, colIdx)

    if (currCell.isMine) {
        revealCell(currCell, elCurrCell)
        return
    }
    if (currCell.mineAroundCount !== 0) {
        revealCell(currCell, elCurrCell)
    }
    if (currCell.mineAroundCount === 0) {
        revealCell(currCell, elCurrCell)
        getSafeNegsCells(board, currCell.rowIdx, currCell.colIdx)
    }
    if (gFoundSafeCells.length > 0) {
        var nextCell = gFoundSafeCells.shift()
        expandShown(board, nextCell.rowIdx, nextCell.colIdx)
    } else {
        gTotalShownCells.push(gCurrShownCells)
        gCurrShownCells = []
    }
}

function getSafeNegsCells(board, rowIdx, colIdx) {

    for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
        if (i < 0 || i > (board.length - 1)) continue

        for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (j < 0 || j > (board[i].length - 1)) continue

            var currCell = board[i][j]
            if (!currCell.isMine) {

                var idx = gFoundSafeCellsIDs.indexOf(currCell.id)
                if (idx < 0) {
                    if (i === rowIdx && j === colIdx) {
                        gFoundSafeCellsIDs.unshift(currCell.id)
                    } else {
                        gFoundSafeCellsIDs.push(currCell.id)
                        gFoundSafeCells.push(currCell)
                    }
                }
            }
        }
    }
}

function giveHint(rowIdx, colIdx) {
    gGame.hintsLeft--

    var elHint = getSelector('.hint')
    elHint.innerHTML = gGame.hintsLeft

    var cellNegs = getHiddenNegs(gBoard, rowIdx, colIdx)
    for (var i = 0; i < cellNegs.length; i++) {

        var currCell = gBoard[cellNegs[i].i][cellNegs[i].j]
        var elCurrCell = getElCell(cellNegs[i].i, cellNegs[i].j)
        peekIntoCell(currCell, elCurrCell)
    }
    setTimeout(() => {
        for (var i = 0; i < cellNegs.length; i++) {

            var currCell = gBoard[cellNegs[i].i][cellNegs[i].j]
            var elCurrCell = getElCell(cellNegs[i].i, cellNegs[i].j)

            closeCell(currCell, elCurrCell)

            var elHint = getSelector('.hint')
            changeBgcImg(elHint, 'hint')
        }
    }, 1000)
    gGame.hintMode = false
}

function manualyPlantMine(board, i, j) {

    if (gMinesPlanted !== gLevel.MINES) {

        var currCell = board[i][j]
        var elCurrCell = getElCell(i, j)

        if (!currCell.isMine) {
            currCell.isMine = true
            elCurrCell.classList.add('plant')
            gMinesPlanted++
        }
        if (gMinesPlanted === gLevel.MINES) {
            var elManualMode = getSelector('.manual-mode')
            elManualMode.classList.remove('manual-mode-on')

            gGame.manualMode = false
            setMinesNegsCount(board)
        }
        setTimeout(() => {
            elCurrCell.classList.remove('plant')
        }, 2000);
    }
}

function plantBoom7Mines(board) {
    for (var i = 0; i < gCells.length; i++) {
        if (gCells[i].id % 7 === 0) {
            if (gMinesPlanted <= gLevel.MINES) {
                gCells[i].isMine = true
                gMinesPlanted++
            }
        } 
    }
    setMinesNegsCount(board)
}




