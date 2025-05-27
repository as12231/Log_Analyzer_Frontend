import React, { useState } from 'react';

const RandomQuote = () => {
  const quotes = [
    "Believe in yourself!",
    "You are stronger than you think.",
    "Every day is a second chance.",
    "Keep going, you're doing great!",
    "Dream big and dare to fail."
  ];

  const [quote, setQuote] = useState("");
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Random Motivational Quote</h2>
      <p>{quote}</p>
      <button onClick={getRandomQuote}>Get Quote</button>
    </div>
  );
};

export default RandomQuote;
