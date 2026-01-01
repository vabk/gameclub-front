import { useState } from 'react'
import Wuziqi from '../components/games/Wuziqi'
import Weiqi from '../components/games/Weiqi'
import Xiangqi from '../components/games/Xiangqi'
import './OnlineGames.css'

function OnlineGames() {
  const [selectedGame, setSelectedGame] = useState('wuziqi')

  return (
    <div className="online-games">
      <h2 className="page-title">在线小游戏</h2>
      <p className="page-description">选择游戏开始对战</p>

      <div className="game-tabs">
        <button
          className={`tab-btn ${selectedGame === 'wuziqi' ? 'active' : ''}`}
          onClick={() => setSelectedGame('wuziqi')}
        >
          五子棋
        </button>
        <button
          className={`tab-btn ${selectedGame === 'weiqi' ? 'active' : ''}`}
          onClick={() => setSelectedGame('weiqi')}
        >
          围棋
        </button>
        <button
          className={`tab-btn ${selectedGame === 'xiangqi' ? 'active' : ''}`}
          onClick={() => setSelectedGame('xiangqi')}
        >
          象棋
        </button>
      </div>

      <div className="game-container">
        {selectedGame === 'wuziqi' && <Wuziqi />}
        {selectedGame === 'weiqi' && <Weiqi />}
        {selectedGame === 'xiangqi' && <Xiangqi />}
      </div>
    </div>
  )
}

export default OnlineGames







