import React, { useState, useEffect } from 'react';
import './App.css';

const characterImages = [
  '/character1.png',
  '/character2.png',
  '/character3.png',
  '/character4.png',
  '/character5.png',
  '/character6.png',
  '/character7.png',
  '/character8.png',
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

  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.value === secondCard.value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          )
        );
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      setFirstCard(null);
      setSecondCard(null);
      setSteps((prevSteps) => prevSteps + 1);
    }
  }, [firstCard, secondCard]);

  const handleCardClick = (card) => {
    if (card.isFlipped || (firstCard && secondCard)) return;
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );
    firstCard ? setSecondCard(card) : setFirstCard(card);
  };

  return (
    <div className="App">
      <header className="App-header">
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
        {cards.every(card => card.isMatched) && (
          <p>你完成了遊戲！總共使用了 {steps} 步。</p>
        )}
      </header>
    </div>
  );
};

export default App;
