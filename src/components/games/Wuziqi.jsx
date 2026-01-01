import { useState, useCallback } from 'react'
import './GameBoard.css'

const BOARD_SIZE = 15

function Wuziqi() {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState('black')
  const [winner, setWinner] = useState(null)

  const checkWinner = (row, col, player) => {
    if (!player) return false

    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线 \
      [1, -1],  // 对角线 /
    ]

    for (const [dx, dy] of directions) {
      let count = 1

      // 正向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (
          newRow >= 0 && newRow < BOARD_SIZE &&
          newCol >= 0 && newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++
        } else {
          break
        }
      }

      // 反向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (
          newRow >= 0 && newRow < BOARD_SIZE &&
          newCol >= 0 && newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++
        } else {
          break
        }
      }

      if (count >= 5) return true
    }

    return false
  }

  const handleCellClick = useCallback((row, col) => {
    if (board[row][col] || winner) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)

    if (checkWinner(row, col, currentPlayer)) {
      setWinner(currentPlayer)
    } else {
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black')
    }
  }, [board, currentPlayer, winner])

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)))
    setCurrentPlayer('black')
    setWinner(null)
  }

  return (
    <div className="game-board-container">
      <div className="game-info">
        <h3>五子棋</h3>
        {winner ? (
          <div className="winner-message">
            {winner === 'black' ? '黑棋' : '白棋'} 获胜！
          </div>
        ) : (
          <div className="current-player">
            当前玩家: {currentPlayer === 'black' ? '黑棋' : '白棋'}
          </div>
        )}
        <button className="reset-btn" onClick={resetGame}>重新开始</button>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="board-cell"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell && (
                  <div className={`piece piece-${cell}`} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wuziqi







