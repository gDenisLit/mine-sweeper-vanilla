'use strict'

var gStopWatch

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function logMouseButton(event, i, j) {
  if (typeof event === 'object') {
    switch (event.button) {
      case 0:
        cellClicked(i, j)
        break
      case 2:
        cellMarked(i, j)
        break
    }
  }
}

function startTimer(secsPassed) {
  var elTimer = document.querySelector('.timer')

  gStopWatch = setInterval(() => {
    secsPassed++
    var timerDisplay = ''
    if (secsPassed <= 9) timerDisplay = '00' + secsPassed
    else if (secsPassed > 9 && secsPassed <= 99) timerDisplay = '0' + secsPassed
    else if (secsPassed > 99) timerDisplay = secsPassed

    elTimer.innerHTML = timerDisplay
  }, 1000)

}

function getElCell(rowIdx, colIdx) {
  return document.querySelector(`.cell-${rowIdx}-${colIdx}`)
}

function getHiddenNegs(board, rowIdx, colIdx) {

  var neighbors = []
  for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
    if (i < 0 || i > (board.length - 1)) continue

    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      if (j < 0 || j > (board[i].length - 1)) continue
      if (i === rowIdx && j === colIdx) continue
      if (board[i][j].isShown) continue
      neighbors.push({ i, j })
    }
  }
  neighbors.push({ i: rowIdx, j: colIdx })
  return neighbors
}

function getRandomSafeCell(board, boardSize) {
  var isSafe = false
  while (!isSafe) {
    var randomPosition = {
      i: getRandomIntInclusive(0, boardSize - 1),
      j: getRandomIntInclusive(0, boardSize - 1)
    }
    var cell = board[randomPosition.i][randomPosition.j]
    if (!cell.isMine && !cell.isShown && !cell.isMarked) {
      isSafe = true
      return cell
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

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j]
      cell.mineAroundCount = (!cell.isMine) ?
        countMinesAround(board, i, j) : ''
    }
  }
}

function restoreDefaults() {
  clearInterval(gStopWatch)

  gGame = {
    isOn: false,
    madeFirstMove: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesRemain: 3,
    hintMode: false,
    hintsLeft: 3,
    safeClicks: 3
  }

  gCellID = 0
  gCells = []
  gTotalShownCells = []

  gFoundSafeCells = []
  gFoundSafeCellsIDs = []

  gMinesPlanted = 0

  var elTimer = getSelector('.timer')
  elTimer.innerHTML = '000'

  var elFlags = getSelector('.flags')
  elFlags.innerHTML = '000'

  var elSmiley = getSelector('.smiley')
  changeBgcImg(elSmiley, 'normal')

  var elLife = getSelector('.life')
  elLife.innerHTML = 3

  var elHint = getSelector('.hint')
  elHint.innerHTML = 3

  var elSafe = getSelector('.safe')
  elSafe.innerHTML = 3

  var elLogo = getSelector('.logo')
  elLogo.classList.remove('display-score')

  var elBestScore = getSelector('.best-score')
  elBestScore.style.display = 'none'

  var elManualMode = getSelector('.manual-mode')
  elManualMode.classList.remove('manual-mode-on')

  var elBOOM7 = getSelector('.BOOM7')
  elBOOM7.classList.remove('BOOM7-on')
}

function displayBestScores(currScore) {
  var strHTML = `<p>Score: ${currScore}</p>\n
          <p>Best 4x4: ${localStorage.getItem(4)}</p>\n
          <p>Best 8x8: ${localStorage.getItem(8)}</p>\n
          <p>Best 12x12: ${localStorage.getItem(12)}</p>\n`

  var elBestScore = getSelector('.best-score')
  elBestScore.innerHTML = strHTML

  var elLogo = getSelector('.logo')
  elLogo.classList.add('display-score')

  var elBestScore = getSelector('.best-score')
  elBestScore.style.display = 'block'
}

function getSelector(selector) {
  return document.querySelector(selector)
}

function toggleFlag(elCell, elFlags, gGame) {
  elCell.classList.toggle('marked')
  var flagsDisplay = ''

  if (gGame.markedCount <= 9) flagsDisplay = '00' + gGame.markedCount
  else if (gGame.markedCount > 9 && gGame.markedCount <= 99) flagsDisplay = '0' + gGame.markedCount
  else if (gGame.markedCount > 99) flagsDisplay = gGame.markedCount

  elFlags.innerHTML = flagsDisplay
}

function revealCell(cell, elCell) {
  if (cell.isMine) {
    hitMine(cell, elCell)
    return
  }
  if (cell.mineAroundCount === 0) {
    elCell.classList.add('reveal')

  } else if (cell.mineAroundCount !== 0) {

    elCell.classList.add('reveal', `n${cell.mineAroundCount}`)
    elCell.innerText = cell.mineAroundCount
  }
  if (!cell.isShown) {
    cell.isShown = true
    gGame.showCount++
    gCurrShownCells.push(cell)
  }
}

function hitMine(cell, elCell) {
  cell.isShown = true
  gGame.showCount++
  gGame.livesRemain--
  gTotalShownCells.push([cell])

  elCell.classList.add('mine')

  var elLife = getSelector('.life')
  elLife.innerHTML = gGame.livesRemain
  checkGameOver()
}

function hideCell(cell, elCell) {
  if (cell.isMine) {
    unHitMine(cell, elCell)
    return
  }
  elCell.classList.remove('reveal', `n${cell.mineAroundCount}`)
  elCell.innerText = ''

  var idx = gFoundSafeCellsIDs.indexOf(cell.id)
  gFoundSafeCellsIDs.splice(idx, 1)

  cell.isShown = false
  gGame.showCount--
}

function unHitMine(cell, elCell) {
  cell.isShown = false

  gGame.showCount--
  gGame.livesRemain++

  elCell.classList.remove('mine')

  var elLife = getSelector('.life')
  elLife.innerHTML = gGame.livesRemain
}

function changeBgcImg(element, img) {
  element.style.backgroundImage = `url(https://gdenislit.github.io/Mine-sweeper/img/${img}.png)`
}

function peekIntoCell(cell, elCell) {
  if (cell.isMine) {
    elCell.classList.add('mine')
    return
  }
  if (cell.mineAroundCount === 0) elCell.classList.add('reveal')
  else {
    elCell.classList.add('reveal', `n${cell.mineAroundCount}`)
    elCell.innerText = cell.mineAroundCount
  }
}

function closeCell(cell, elCell) {
  if (cell.isMine) {
    elCell.classList.remove('mine')
    return
  }
  if (cell.mineAroundCount === 0) elCell.classList.remove('reveal')
  else {
    elCell.classList.remove('reveal', `n${cell.mineAroundCount}`)
    elCell.innerText = ''
  }
}















