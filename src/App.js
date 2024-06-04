import React, { useState, useEffect } from 'react';
import './App.css'; // 確保你有相應的CSS文件

const characterImages = [
  'build/character1.png',
  'build/character2.png',
  'build/character3.png',
  'build/character4.png',
  'build/character5.png',
  'build/character6.png',
  'build/character7.png',
  'build/character8.png',
];

const shuffleArray = (array) => {
  let newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateCards = () => {
  const cards = shuffleArray([...characterImages, ...characterImages]);
  return cards.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

const App = () => {
  const [cards, setCards] = useState(generateCards());
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [steps, setSteps] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [nameError, setNameError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (firstCard && secondCard) {
      setIsProcessing(true);
      if (firstCard.value === secondCard.value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setIsProcessing(false);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setIsProcessing(false);
        }, 1000);
      }
      setFirstCard(null);
      setSecondCard(null);
      setSteps((prevSteps) => prevSteps + 1);
    }
  }, [firstCard, secondCard]);

  const handleCardClick = (card) => {
    if (card.isFlipped || isProcessing) return;
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );
    firstCard ? setSecondCard(card) : setFirstCard(card);
  };

  const handleRestart = () => {
    setCards(generateCards());
    setFirstCard(null);
    setSecondCard(null);
    setSteps(0);
    setIsGameStarted(false);
    setPlayerName('');
    setNameError('');
  };

  const handleStartGame = () => {
    if (playerName.trim()) {
      if (leaderboard.some(entry => entry.name === playerName.trim())) {
        setNameError('該名字已存在，請使用其他名字。');
      } else {
        setIsGameStarted(true);
        setNameError('');
      }
    } else {
      setNameError('請輸入玩家名字');
    }
  };

  const handleFinishGame = () => {
    setLeaderboard((prevLeaderboard) => [
      ...prevLeaderboard,
      { name: playerName, steps },
    ].sort((a, b) => a.steps - b.steps));
  };

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      handleFinishGame();
    }
  }, [cards]);

  return (
    <div className="App">
      <div className="App-header">
        {!isGameStarted ? (
          <div>
            <h1>配對遊戲</h1>
            <input
              type="text"
              placeholder="輸入你的名字"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleStartGame}>開始遊戲</button>
            {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
          </div>
        ) : (
          <>
            <h1>配對遊戲</h1>
            <div className="grid">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card ${card.isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="card-inner">
                    <div className="card-front">?</div>
                    <div className="card-back">
                      <img src={card.value} alt="character" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p>步數: {steps}</p>
            {cards.every(card => card.isMatched) && (
              <>
                <p>你完成了遊戲！總共使用了 {steps} 步。</p>
                <button onClick={handleRestart}>再玩一次</button>
              </>
            )}
          </>
        )}
      </div>
      <div className="leaderboard">
        <h2>排行榜</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              {entry.name}: {entry.steps} 步
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
