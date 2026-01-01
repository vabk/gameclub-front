import { useState, useEffect } from 'react'
import Wuziqi from '../components/games/Wuziqi'
import Weiqi from '../components/games/Weiqi'
import Xiangqi from '../components/games/Xiangqi'
import { createRoom, joinRoom, getWaitingRooms, leaveRoom } from '../api/gameApi'
import './OnlineGames.css'

function OnlineGames() {
  const [selectedGame, setSelectedGame] = useState('wuziqi')
  const [mode, setMode] = useState('lobby') // 'lobby' | 'room' | 'game'
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [waitingRooms, setWaitingRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    if (mode === 'lobby') {
      loadWaitingRooms()
      const interval = setInterval(loadWaitingRooms, 3000) // 每3秒刷新
      return () => clearInterval(interval)
    }
  }, [mode])

  const loadWaitingRooms = async () => {
    try {
      const rooms = await getWaitingRooms()
      setWaitingRooms(rooms.filter(r => r.gameType === selectedGame))
    } catch (error) {
      console.error('加载房间列表失败:', error)
    }
  }

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      alert('请输入玩家名称')
      return
    }

    try {
      const hostId = generateUserId()
      const room = await createRoom(selectedGame, hostId, playerName)
      setCurrentRoom(room)
      setRoomCode(room.roomCode)
      setIsHost(true)
      setMode('room')
    } catch (error) {
      console.error('创建房间失败:', error)
      alert('创建房间失败: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleJoinRoom = async (targetRoomCode) => {
    if (!playerName.trim()) {
      alert('请输入玩家名称')
      return
    }

    try {
      const guestId = generateUserId()
      const room = await joinRoom(targetRoomCode, guestId, playerName)
      setCurrentRoom(room)
      setRoomCode(room.roomCode)
      setIsHost(false)
      setMode('game') // 加入后直接开始游戏
    } catch (error) {
      console.error('加入房间失败:', error)
      alert('加入房间失败: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleLeaveRoom = async () => {
    if (!currentRoom) return

    try {
      const userId = isHost ? currentRoom.hostId : currentRoom.guestId
      await leaveRoom(currentRoom.roomCode, userId)
      setCurrentRoom(null)
      setRoomCode('')
      setIsHost(false)
      setMode('lobby')
      loadWaitingRooms()
    } catch (error) {
      console.error('离开房间失败:', error)
    }
  }

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  const getGameName = (gameType) => {
    const names = {
      'wuziqi': '五子棋',
      'weiqi': '围棋',
      'xiangqi': '象棋'
    }
    return names[gameType] || gameType
  }

  if (mode === 'room') {
    // 等待对手加入的房间界面
    return (
      <div className="online-games">
        <h2 className="page-title">房间等待中</h2>
        <div className="room-waiting">
          <div className="room-info-card">
            <h3>房间信息</h3>
            <div className="room-code-display">
              <span className="room-code-label">房间代码：</span>
              <span className="room-code-value">{roomCode}</span>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(roomCode)
                  alert('房间代码已复制到剪贴板')
                }}
              >
                复制
              </button>
            </div>
            <div className="room-details">
              <p>游戏类型：{getGameName(selectedGame)}</p>
              <p>房主：{currentRoom?.hostName}</p>
              <p>状态：等待对手加入...</p>
            </div>
            <button className="leave-btn" onClick={handleLeaveRoom}>
              离开房间
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'game') {
    // 游戏界面
    const GameComponent = selectedGame === 'wuziqi' ? Wuziqi : 
                         selectedGame === 'weiqi' ? Weiqi : Xiangqi
    
    return (
      <div className="online-games">
        <div className="game-header">
          <h2 className="page-title">在线{getGameName(selectedGame)}</h2>
          <div className="room-info-bar">
            <span>房间：{roomCode}</span>
            <span>|</span>
            <span>{currentRoom?.hostName} VS {currentRoom?.guestName}</span>
            <button className="leave-btn-small" onClick={handleLeaveRoom}>
              离开
            </button>
          </div>
        </div>
        <div className="game-container">
          <GameComponent />
        </div>
      </div>
    )
  }

  // 大厅界面
  return (
    <div className="online-games">
      <h2 className="page-title">在线小游戏</h2>
      <p className="page-description">选择游戏，创建或加入房间开始对战</p>

      <div className="player-name-input">
        <input
          type="text"
          placeholder="请输入玩家名称"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="name-input"
        />
      </div>

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

      <div className="lobby-container">
        <div className="create-room-section">
          <button className="create-room-btn" onClick={handleCreateRoom}>
            创建房间
          </button>
        </div>

        <div className="rooms-list-section">
          <h3>等待中的房间</h3>
          {waitingRooms.length === 0 ? (
            <p className="no-rooms">暂无等待中的房间</p>
          ) : (
            <div className="rooms-list">
              {waitingRooms.map((room) => (
                <div key={room.id} className="room-item">
                  <div className="room-item-info">
                    <span className="room-code">{room.roomCode}</span>
                    <span className="room-host">{room.hostName}</span>
                    <span className="room-game">{getGameName(room.gameType)}</span>
                  </div>
                  <button
                    className="join-room-btn"
                    onClick={() => handleJoinRoom(room.roomCode)}
                  >
                    加入
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnlineGames
