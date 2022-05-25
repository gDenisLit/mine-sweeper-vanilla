'use strict'

var gBoard

var gLevel = {
    SIZE: 10,
    MINES: 25
}

var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesRemain: 3,
    firstMove: false
}

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        var row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<table border="1"><tbody>\n'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {

            var cellID = `class="cell-${i}-${j}"`
            strHTML += `<td ${cellID} onclick="cellClicked(this, ${i}, ${j})"></td>\n`
        }
    } strHTML += '</tr>\n'
    strHTML += '</tbody></table>'

    var elTableContainer = document.querySelector('.table-container')
    elTableContainer.innerHTML = strHTML
}

function plantMines() {
    var minesDroped = 0

    while (minesDroped < gLevel.MINES) {
        var randomPosition = {
            i: getRandomIntInclusive(0, gLevel.SIZE - 1),
            j: getRandomIntInclusive(0, gLevel.SIZE - 1)
        }
        var cell = gBoard[randomPosition.i][randomPosition.j]
        if (!cell.isMine) {
            cell.isMine = true
            minesDroped++
        }
        else continue
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.mineAroundCount = countMinesAround(board, i, j)
        }
    }
}

function countMinesAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
        if (i < 0 || i > (board.length - 1)) continue

        for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
            if (j < 0 || j > (board[i].length - 1)) continue

            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell, i, j) {
    if (!gGame.firstMove) startGame(i, j)
    if (!gGame.isOn) return
    
    var cell = gBoard[i][j]
    revealCell(elCell, cell)

    if (cell.isMine) {
        gGame.livesRemain--
        checkGameOver()
        console.log(gGame.livesRemain)
        return
    } 
    gGame.showCount++
    checkGameOver()
}

function cellMarked(elCell) {

}

function checkGameOver() {
    var totalSafeCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if (gGame.showCount === totalSafeCells) {
        console.log('You Win')
    }
    if (gGame.livesRemain === 0) gameOver()
}

function expandShown(board, elCell, i, j) {

}

function plantMines(startLocation) {
    var minesDroped = 0

    while (minesDroped < gLevel.MINES) {
        var randomPosition = {
            i: getRandomIntInclusive(0, gLevel.SIZE - 1),
            j: getRandomIntInclusive(0, gLevel.SIZE - 1)
        }
        if (randomPosition.i === startLocation.i &&
            randomPosition.j === startLocation.j) continue

        var cell = gBoard[randomPosition.i][randomPosition.j]
        if (!cell.isMine) {
            cell.isMine = true
            minesDroped++
        }
        else continue
    }
    setMinesNegsCount(gBoard)
}

function gameOver() {
    console.log('Game Over')
    revealAllMines()
    gGame.isOn = false
}

function revealCell(elCell, cell) {
    if (cell.isMine) elCell.classList.add('mine')
    
    elCell.classList.add('reveal', `n${cell.mineAroundCount}`)
    elCell.innerText = (!cell.isMine && cell.mineAroundCount !== 0)
        ? cell.mineAroundCount : ''
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) continue
            renderCell({i, j}, '')
        }
    }
}

function startGame(i, j) {
    gGame.isOn = true
    gGame.firstMove = true
    plantMines({ i: i, j: j })
}




