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
      console.log('收到后端数据:', data)
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
          {process.env.NODE_ENV === 'development' && (
            <details style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
              <summary>调试信息</summary>
              <pre style={{ overflow: 'auto', maxHeight: '200px' }}>{JSON.stringify(result, null, 2)}</pre>
            </details>
          )}
          <div className="result-content">
            {result.character && (
              <div className="result-item">
                <div className="result-image-container">
                  {result.characterImage ? (
                    <img 
                      src={result.characterImage} 
                      alt={result.character}
                      className="result-image"
                      onError={(e) => {
                        console.error('干员图片加载失败:', result.characterImage);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('干员图片加载成功:', result.characterImage);
                      }}
                    />
                  ) : (
                    <div style={{ color: '#999', fontSize: '0.9rem' }}>暂无图片</div>
                  )}
                </div>
                <div className="result-text">
                  <span className="label">干员（兵种）：</span>
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
            {result.map && (
              <div className="result-item">
                <div className="result-image-container">
                  {result.mapImage && (
                    <img 
                      src={result.mapImage} 
                      alt={result.map}
                      className="result-image"
                      onError={(e) => {
                        console.error('地图图片加载失败:', result.mapImage);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('地图图片加载成功:', result.mapImage);
                      }}
                    />
                  )}
                </div>
                <div className="result-text">
                  <span className="label">地图：</span>
                  <span className="value">{result.map}</span>
                </div>
              </div>
            )}
            {result.weapon && (
              <div className="result-item">
                <div className="result-image-container">
                  {result.weaponImage ? (
                    <img 
                      src={result.weaponImage} 
                      alt={result.weapon}
                      className="result-image"
                      onError={(e) => {
                        console.error('武器图片加载失败:', result.weaponImage);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('武器图片加载成功:', result.weaponImage);
                      }}
                    />
                  ) : (
                    <div style={{ color: '#999', fontSize: '0.9rem' }}>暂无图片</div>
                  )}
                </div>
                <div className="result-text">
                  <span className="label">武器：</span>
                  <span className="value">{result.weapon}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePlay







