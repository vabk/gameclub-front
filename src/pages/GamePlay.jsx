import { useState } from 'react'
import { generateGamePlay } from '../api/gameApi'
import './GamePlay.css'

function GamePlay() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedGame, setSelectedGame] = useState('')

  const handleGenerate = async (game) => {
    setLoading(true)
    setSelectedGame(game)
    try {
      const data = await generateGamePlay(game)
      setResult(data)
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="game-play">
      <h2 className="page-title">游戏玩法推荐</h2>
      <p className="page-description">点击按钮，随机生成游戏配置</p>

      <div className="game-cards">
        <div className="game-card">
          <div className="game-icon">🔫</div>
          <h3>三角洲</h3>
          <p>随机生成干员、地图、武器</p>
          <button
            className="generate-btn"
            onClick={() => handleGenerate('delta')}
            disabled={loading}
          >
            {loading && selectedGame === 'delta' ? '生成中...' : '随机生成'}
          </button>
        </div>

        <div className="game-card">
          <div className="game-icon">⚔️</div>
          <h3>永劫无间</h3>
          <p>随机生成英雄、地图、武器</p>
          <button
            className="generate-btn"
            onClick={() => handleGenerate('yjwujian')}
            disabled={loading}
          >
            {loading && selectedGame === 'yjwujian' ? '生成中...' : '随机生成'}
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card">
          <h3>生成结果</h3>
          <div className="result-content">
            {result.character && (
              <div className="result-item">
                <div className="result-image-container">
                  {result.characterImage && (
                    <img 
                      src={result.characterImage} 
                      alt={result.character}
                      className="result-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="result-text">
                  <span className="label">干员：</span>
                  <span className="value">{result.character}</span>
                </div>
              </div>
            )}
            {result.hero && (
              <div className="result-item">
                <div className="result-image-container">
                  {result.heroImage && (
                    <img 
                      src={result.heroImage} 
                      alt={result.hero}
                      className="result-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="result-text">
                  <span className="label">英雄：</span>
                  <span className="value">{result.hero}</span>
                </div>
              </div>
            )}
            <div className="result-item">
              <div className="result-image-container">
                {result.mapImage && (
                  <img 
                    src={result.mapImage} 
                    alt={result.map}
                    className="result-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <div className="result-text">
                <span className="label">地图：</span>
                <span className="value">{result.map}</span>
              </div>
            </div>
            <div className="result-item">
              <div className="result-image-container">
                {result.weaponImage && (
                  <img 
                    src={result.weaponImage} 
                    alt={result.weapon}
                    className="result-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <div className="result-text">
                <span className="label">武器：</span>
                <span className="value">{result.weapon}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePlay







