import { useState, useCallback } from 'react'
import './GameBoard.css'

const BOARD_SIZE = 19

function Weiqi() {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState('black')
  const [capturedBlack, setCapturedBlack] = useState(0)
  const [capturedWhite, setCapturedWhite] = useState(0)

  const getNeighbors = (row, col) => {
    const neighbors = []
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dx, dy] of directions) {
      const newRow = row + dx
      const newCol = col + dy
      if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        neighbors.push([newRow, newCol])
      }
    }
    return neighbors
  }

  const getGroup = (row, col, player) => {
    if (!player || board[row][col] !== player) return []
    
    const group = []
    const visited = new Set()
    const stack = [[row, col]]

    while (stack.length > 0) {
      const [r, c] = stack.pop()
      const key = `${r},${c}`
      if (visited.has(key)) continue
      visited.add(key)
      group.push([r, c])

      for (const [nr, nc] of getNeighbors(r, c)) {
        if (board[nr][nc] === player && !visited.has(`${nr},${nc}`)) {
          stack.push([nr, nc])
        }
      }
    }

    return group
  }

  const hasLiberty = (row, col, player) => {
    const group = getGroup(row, col, player)
    for (const [r, c] of group) {
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (board[nr][nc] === null) return true
      }
    }
    return false
  }

  const removeGroup = (group) => {
    const player = board[group[0][0]][group[0][1]]
    const newBoard = board.map(r => [...r])
    for (const [r, c] of group) {
      newBoard[r][c] = null
    }
    setBoard(newBoard)
    return player
  }

  const handleCellClick = useCallback((row, col) => {
    if (board[row][col]) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)

    // 检查并移除被吃的棋子
    let captured = 0
    for (const [nr, nc] of getNeighbors(row, col)) {
      const opponent = currentPlayer === 'black' ? 'white' : 'black'
      if (newBoard[nr][nc] === opponent) {
        if (!hasLiberty(nr, nc, opponent)) {
          const group = getGroup(nr, nc, opponent)
          const removedPlayer = removeGroup(group)
          captured += group.length
          if (removedPlayer === 'black') {
            setCapturedBlack(prev => prev + group.length)
          } else {
            setCapturedWhite(prev => prev + group.length)
          }
        }
      }
    }

    // 检查自己是否被吃
    if (!hasLiberty(row, col, currentPlayer)) {
      const group = getGroup(row, col, currentPlayer)
      removeGroup(group)
      if (currentPlayer === 'black') {
        setCapturedBlack(prev => prev + group.length)
      } else {
        setCapturedWhite(prev => prev + group.length)
      }
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black')
      return
    }

    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black')
  }, [board, currentPlayer])

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)))
    setCurrentPlayer('black')
    setCapturedBlack(0)
    setCapturedWhite(0)
  }

  return (
    <div className="game-board-container">
      <div className="game-info">
        <h3>围棋</h3>
        <div className="current-player">
          当前玩家: {currentPlayer === 'black' ? '黑棋' : '白棋'}
        </div>
        <div className="captured-info">
          <div>黑棋被吃: {capturedBlack}</div>
          <div>白棋被吃: {capturedWhite}</div>
        </div>
        <button className="reset-btn" onClick={resetGame}>重新开始</button>
      </div>
      <div className="board weiqi-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="board-cell weiqi-cell"
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

export default Weiqi







