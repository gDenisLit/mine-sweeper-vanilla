'use strict'

var gGame = {
    isOn: false,
    madeFirstMove: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesRemain: 3,
    hintMode: false,
    manualMode: false,
    boom7Mode: false,
    hintsLeft: 3,
    safeClicks: 3
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
    freeCells: 14,
}


function init() {
    restoreDefaults()
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function startGame(i, j) {
    gGame.isOn = true
    gGame.madeFirstMove = true

    if (gMinesPlanted === 0) {
        plantMines(gBoard, gLevel.SIZE, gLevel.MINES, { i, j })
    }
    startTimer(gGame.secsPassed)
}

function cellClicked(i, j) {
    if (gGame.manualMode) {
        manualyPlantMine(gBoard, i, j)
        return
    }
    if (!gGame.madeFirstMove) startGame(i, j)
    if (!gGame.isOn) return

    if (gGame.hintMode) {
        giveHint(i, j)
        return
    }
    expandShown(gBoard, i, j)
    checkGameOver()
}

function cellMarked(i, j) {
    if (gGame.manualMode) return
    if (!gGame.madeFirstMove) startGame(i, j)
    if (!gGame.isOn) return

    var cell = gBoard[i][j]
    var elCell = getElCell(i, j)
    var elFlags = getSelector('.flags')

    if (!cell.isMarked) {
        if (!cell.isShown) {

            cell.isMarked = true
            gGame.markedCount++
            toggleFlag(elCell, elFlags, gGame)
        }
    } else {
        cell.isMarked = false
        gGame.markedCount--
        toggleFlag(elCell, elFlags, gGame)
    }
}

function checkGameOver() {
    if (gGame.livesRemain === 0) {
        revealAllMines()
        finishGame('lose')
    }
    if (gGame.showCount === gLevel.freeCells) {
        finishGame('win')
    }
}

function hintMode() {
    if (gGame.hintMode !== 0) {
        gGame.hintMode = true

        var elHint = getSelector('.hint')
        changeBgcImg(elHint, 'hint-mode')
    }
    else return
}

function safeClick() {
    if (gGame.safeClicks !== 0) {

        var safeCell = getRandomSafeCell(gBoard, gLevel.SIZE)
        var elSafeCell = getElCell(safeCell.rowIdx, safeCell.colIdx)

        elSafeCell.classList.toggle('safe-cell')
        gGame.safeClicks--

        var elSafe = getSelector('.safe')
        elSafe.innerHTML = gGame.safeClicks
        changeBgcImg(elSafe, 'safe-on')

        setTimeout(() => {
            elSafeCell.classList.toggle('safe-cell')
            changeBgcImg(elSafe, 'safe-off')
        }, 2000)
    }
}

function tableSize(elBtn) {
    var boardSize = elBtn.getAttribute('data-size')
    switch (boardSize) {
        case '4':
            gLevel = { SIZE: 4, MINES: 2, freeCells: 14 }
            break
        case '8':
            gLevel = { SIZE: 8, MINES: 12, freeCells: 52 }
            break
        case '12':
            gLevel = { SIZE: 12, MINES: 30, freeCells: 114 }
    }
    init()
}

function finishGame(winOrLose) {

    switch (winOrLose) {
        case 'win':
            var elButton = getSelector('.smiley')
            changeBgcImg(elButton, 'win')
            break
        case 'lose':
            var elButton = getSelector('.smiley')
            changeBgcImg(elButton, 'lose')
            break
    }
    clearInterval(gStopWatch)
    gGame.isOn = false
    saveScore(gLevel.SIZE)
}

function saveScore(diffuclty) {
    var currScore = gGame.showCount
    var bestScore = localStorage.getItem(diffuclty)

    if (currScore > bestScore) {
        localStorage.setItem(diffuclty, currScore)
    }
    displayBestScores(currScore)
}

function manualMode() {
    init()
    gGame.manualMode = true

    var elManualMode = getSelector('.manual-mode')
    elManualMode.classList.add('manual-mode-on')
}

function boom7Mode() {
    init()
    gGame.boom7Mode = true
    plantBoom7Mines(gBoard)

    var elBOOM7 = getSelector('.BOOM7')
    elBOOM7.classList.add('BOOM7-on')
}

function undo() {
    var lastShownCells = gTotalShownCells.pop()
    if (!lastShownCells) return

    for (var i = 0; i < lastShownCells.length; i++) {
        var currCell = lastShownCells[i]
        var elCurrCell = getElCell(currCell.rowIdx, currCell.colIdx)
        
        hideCell(currCell, elCurrCell)
    }
}