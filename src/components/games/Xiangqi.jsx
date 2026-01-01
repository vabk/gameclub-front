import { useState, useCallback } from 'react'
import './GameBoard.css'

const INITIAL_BOARD = [
  [{ type: 'r', color: 'black' }, null, null, { type: 'p', color: 'black' }, null, null, { type: 'p', color: 'black' }, null, null, { type: 'r', color: 'black' }],
  [null, { type: 'n', color: 'black' }, null, null, null, null, null, null, { type: 'n', color: 'black' }, null],
  [null, null, { type: 'b', color: 'black' }, null, null, null, null, { type: 'b', color: 'black' }, null, null],
  [{ type: 'a', color: 'black' }, null, null, null, null, null, null, null, null, { type: 'a', color: 'black' }],
  [null, null, null, null, { type: 'k', color: 'black' }, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, { type: 'k', color: 'red' }, null, null, null, null, null],
  [{ type: 'a', color: 'red' }, null, null, null, null, null, null, null, null, { type: 'a', color: 'red' }],
  [null, null, { type: 'b', color: 'red' }, null, null, null, null, { type: 'b', color: 'red' }, null, null],
  [null, { type: 'n', color: 'red' }, null, null, null, null, null, null, { type: 'n', color: 'red' }, null],
  [{ type: 'r', color: 'red' }, null, null, { type: 'p', color: 'red' }, null, null, { type: 'p', color: 'red' }, null, null, { type: 'r', color: 'red' }],
]

const PIECE_NAMES = {
  'r': '车',
  'n': '马',
  'b': '象',
  'a': '士',
  'k': '将',
  'c': '炮',
  'p': '兵',
  null: '',
}

function Xiangqi() {
  const [board, setBoard] = useState(
    INITIAL_BOARD.map(row => row.map(cell => cell ? { ...cell } : null))
  )
  const [currentPlayer, setCurrentPlayer] = useState('red')
  const [selectedCell, setSelectedCell] = useState(null)
  const [winner, setWinner] = useState(null)

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol]
    if (!piece || piece.color !== currentPlayer) return false

    const target = board[toRow][toCol]
    if (target && target.color === currentPlayer) return false

    // 简化的移动规则（完整实现需要更复杂的逻辑）
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    switch (piece.type) {
      case 'r': // 车
        return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol)
      case 'n': // 马
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      case 'b': // 象
        return rowDiff === 2 && colDiff === 2 && (currentPlayer === 'red' ? toRow >= 5 : toRow <= 4)
      case 'a': // 士
        return rowDiff === 1 && colDiff === 1 && 
               (currentPlayer === 'red' ? (toRow >= 7 && toCol >= 3 && toCol <= 5) : (toRow <= 2 && toCol >= 3 && toCol <= 5))
      case 'k': // 将
        return ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) &&
               (currentPlayer === 'red' ? (toRow >= 7 && toCol >= 3 && toCol <= 5) : (toRow <= 2 && toCol >= 3 && toCol <= 5))
      case 'c': // 炮
        if (target) {
          return (rowDiff === 0 || colDiff === 0) && countPiecesBetween(fromRow, fromCol, toRow, toCol) === 1
        } else {
          return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol)
        }
      case 'p': // 兵
        if (currentPlayer === 'red') {
          return (rowDiff === 1 && colDiff === 0 && toRow < fromRow) || 
                 (rowDiff === 0 && colDiff === 1 && fromRow <= 4)
        } else {
          return (rowDiff === 1 && colDiff === 0 && toRow > fromRow) || 
                 (rowDiff === 0 && colDiff === 1 && fromRow >= 5)
        }
      default:
        return false
    }
  }

  const isPathClear = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = toRow === fromRow ? 0 : (toRow > fromRow ? 1 : -1)
    const colStep = toCol === fromCol ? 0 : (toCol > fromCol ? 1 : -1)
    let r = fromRow + rowStep
    let c = fromCol + colStep
    while (r !== toRow || c !== toCol) {
      if (board[r]?.[c]) return false
      r += rowStep
      c += colStep
    }
    return true
  }

  const countPiecesBetween = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = toRow === fromRow ? 0 : (toRow > fromRow ? 1 : -1)
    const colStep = toCol === fromCol ? 0 : (toCol > fromCol ? 1 : -1)
    let count = 0
    let r = fromRow + rowStep
    let c = fromCol + colStep
    while (r !== toRow || c !== toCol) {
      if (board[r]?.[c]) count++
      r += rowStep
      c += colStep
    }
    return count
  }

  const checkWinner = () => {
    let redKing = false
    let blackKing = false
    for (const row of board) {
      for (const cell of row) {
        if (cell?.type === 'k') {
          if (cell.color === 'red') redKing = true
          if (cell.color === 'black') blackKing = true
        }
      }
    }
    if (!redKing) return 'black'
    if (!blackKing) return 'red'
    return null
  }

  const handleCellClick = useCallback((row, col) => {
    if (winner) return

    if (selectedCell) {
      const [fromRow, fromCol] = selectedCell
      if (fromRow === row && fromCol === col) {
        setSelectedCell(null)
        return
      }

      if (isValidMove(fromRow, fromCol, row, col)) {
        const newBoard = board.map(r => r.map(c => c ? { ...c } : null))
        newBoard[row][col] = newBoard[fromRow][fromCol]
        newBoard[fromRow][fromCol] = null
        setBoard(newBoard)
        setSelectedCell(null)
        
        const win = checkWinner()
        if (win) {
          setWinner(win)
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red')
        }
      } else {
        setSelectedCell(null)
      }
    } else {
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        setSelectedCell([row, col])
      }
    }
  }, [board, currentPlayer, selectedCell, winner])

  const resetGame = () => {
    setBoard(INITIAL_BOARD.map(row => row.map(cell => cell ? { ...cell } : null)))
    setCurrentPlayer('red')
    setSelectedCell(null)
    setWinner(null)
  }

  return (
    <div className="game-board-container">
      <div className="game-info">
        <h3>象棋</h3>
        {winner ? (
          <div className="winner-message">
            {winner === 'red' ? '红方' : '黑方'} 获胜！
          </div>
        ) : (
          <div className="current-player">
            当前玩家: {currentPlayer === 'red' ? '红方' : '黑方'}
          </div>
        )}
        <button className="reset-btn" onClick={resetGame}>重新开始</button>
      </div>
      <div className="board xiangqi-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
              return (
                <div
                  key={colIndex}
                  className={`board-cell xiangqi-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && (
                    <div className={`piece piece-${cell.color} xiangqi-piece`}>
                      {PIECE_NAMES[cell.type] || ''}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Xiangqi







