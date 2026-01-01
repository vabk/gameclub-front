import { Routes, Route, Link } from 'react-router-dom'
import GamePlay from './pages/GamePlay'
import OnlineGames from './pages/OnlineGames'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">🎮 GameClub</h1>
          <div className="nav-links">
            <Link to="/">游戏玩法</Link>
            <Link to="/online-games">在线游戏</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<GamePlay />} />
          <Route path="/online-games" element={<OnlineGames />} />
        </Routes>
      </main>
    </div>
  )
}

export default App







