'use client';

import React, { useEffect, useState } from 'react';

type Card = `${string} of ${string}`;

const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const deck: Card[] = [];
for (const suit of suits) {
  for (const rank of ranks) {
    deck.push(`${rank} of ${suit}` as Card);
  }
}

function getRank(card: Card): string {
  // Extract the rank from the card string
  return card.split(' ')[0];
}

// Shuffle deck
function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function dealCards(deck: Card[]): { player1Hand: Card[]; player2Hand: Card[] } {
  const player1Hand: Card[] = [];
  const player2Hand: Card[] = [];

  for (let i = 0; i < deck.length; i++) {
    if (i % 2 === 0) {
      player1Hand.push(deck[i]);
    } else {
      player2Hand.push(deck[i]);
    }
  }

  return { player1Hand, player2Hand };
}

function playRound(
  player1Hand: Card[],
  player2Hand: Card[]
): { player1Hand: Card[]; player2Hand: Card[]; roundResult: string } {
  const player1Card = player1Hand.shift();
  const player2Card = player2Hand.shift();

  console.log('Player 1 draws:', player1Card);
  console.log('Player 2 draws:', player2Card);

  if (!player1Card || !player2Card) {
    return { player1Hand, player2Hand, roundResult: 'Game Over' };
  }

  const player1Rank = getRank(player1Card);
  const player2Rank = getRank(player2Card);

  if (player1Rank === player2Rank) {
    // War situation, both cards are of equal rank
    // console.log('Player 1 card count:', player1Hand.length);
    // console.log('Player 2 card count:', player2Hand.length);
    console.log('%c Tie! Going to War!', 'background: #222; color: #990000');
    const warPile1: Card[] = [];
    const warPile2: Card[] = [];

    // Deal three face-down cards
    for (let i = 0; i < 3; i++) {
      const card1 = player1Hand.shift();
      const card2 = player2Hand.shift();
      // console.log('Player 1 face down:', card1);
      // console.log('Player 2 face down:', card2);
      if (card1 && card2) {
        warPile1.push(card1);
        warPile2.push(card2);
      }
    }

    // Deal one face-up card
    const warCard1 = player1Hand.shift();
    const warCard2 = player2Hand.shift();
    console.log('Player 1 war card:', warCard1);
    console.log('Player 2 war card:', warCard2);

    if (!warCard1 || !warCard2) {
      return { player1Hand, player2Hand, roundResult: 'Game Over' };
    }

    const warRank1 = getRank(warCard1);
    const warRank2 = getRank(warCard2);

    if (warRank1 === warRank2) {
      // Another war
      console.log(
        '%c War tie! Going to war again!',
        'background: #222; color: #990000'
      );
      // Deal three face-down cards
      for (let i = 0; i < 3; i++) {
        const card1 = player1Hand.shift();
        const card2 = player2Hand.shift();
        // console.log('Player 1 face down:', card1);
        // console.log('Player 2 face down:', card2);
        if (card1 && card2) {
          warPile1.push(card1);
          warPile2.push(card2);
        }
      }

      // Deal one face-up card
      const warCard1 = player1Hand.shift();
      const warCard2 = player2Hand.shift();
      console.log('Player 1 war card:', warCard1);
      console.log('Player 2 war card:', warCard2);
      if (!warCard1 || !warCard2) {
        return { player1Hand, player2Hand, roundResult: 'Game Over' };
      }
      const result = playRound(
        [...player1Hand, ...warPile1],
        [...player2Hand, ...warPile2]
      );
      console.log('War result:', result.roundResult);
      return result;
    } else if (ranks.indexOf(warRank1) > ranks.indexOf(warRank2)) {
      // Player 1 takes all cards
      player1Hand.push(
        player1Card,
        player2Card,
        warCard1,
        warCard2,
        ...warPile1,
        ...warPile2
      );
      console.log(
        '%c Player 1 wins the round!',
        'background: #222; color: #6600ff'
      );
      // console.log('Player 1 card count:', player1Hand.length);
      // console.log('Player 2 card count:', player2Hand.length);
      return { player1Hand, player2Hand, roundResult: 'Player 1' };
    } else {
      // Player 2 takes all cards
      player2Hand.push(
        player1Card,
        player2Card,
        warCard1,
        warCard2,
        ...warPile1,
        ...warPile2
      );
      console.log(
        '%c Player 2 wins the war!',
        'background: #222; color: #bada55'
      );
      // console.log('Player 1 card count:', player1Hand.length);
      // console.log('Player 2 card count:', player2Hand.length);
      return { player1Hand, player2Hand, roundResult: 'Player 2' };
    }
  } else if (ranks.indexOf(player1Rank) > ranks.indexOf(player2Rank)) {
    // Player 1 wins the round
    player1Hand.push(player1Card, player2Card);
    console.log(
      '%c Player 1 wins the round!',
      'background: #222; color: #6600ff'
    );
    return { player1Hand, player2Hand, roundResult: 'Player 1' };
  } else {
    // Player 2 wins the round
    player2Hand.push(player1Card, player2Card);
    console.log(
      '%c Player 2 wins the round!',
      'background: #222; color: #bada55'
    );
    return { player1Hand, player2Hand, roundResult: 'Player 2' };
  }
}

function Home() {
  const [shuffledDeck, setShuffledDeck] = useState<Card[]>([]);
  const [player1Hand, setPlayer1Hand] = useState<Card[]>([]);
  const [player2Hand, setPlayer2Hand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const shuffledDeck = shuffleDeck([...deck]);
    const { player1Hand, player2Hand } = dealCards([...shuffledDeck]);
    setShuffledDeck(shuffledDeck);
    setPlayer1Hand(player1Hand);
    setPlayer2Hand(player2Hand);
  }, []);

  const playGameRound = () => {
    if (gameOver) {
      return; // Do not allow game continuation once over
    }

    const result = playRound([...player1Hand], [...player2Hand]);
    setPlayer1Hand(result.player1Hand);
    setPlayer2Hand(result.player2Hand);
    setGameStatus(result.roundResult);

    if (result.roundResult === 'Game Over') {
      setGameOver(true); // Set game over when the game ends
    } else {
      // Set the drawn cards for each player in the state (Removed for now)
    }
  };

  const restartGame = () => {
    // Reset game state & shuffle new deck
    const newShuffledDeck = shuffleDeck([...deck]);
    const { player1Hand, player2Hand } = dealCards([...newShuffledDeck]);
    setShuffledDeck(newShuffledDeck);
    setPlayer1Hand(player1Hand);
    setPlayer2Hand(player2Hand);
    setGameStatus('');
    setGameOver(false);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='mb-32 text-center'>
        <h1 className='text-2xl font-semibold mb-4'>War Card Game</h1>

        {/* Display cards & counts per player */}
        <div className='flex justify-between'>
          <div className='text-center m-8'>
            <h2 className='text-xl font-semibold mb-2'>Player 1</h2>
            <p className='text-lg'>Count: {player1Hand.length}</p>
            <div>
              <p className='text-lg'>Card: {player1Hand[0]}</p>
            </div>
          </div>
          <div className='text-center m-8'>
            <h2 className='text-xl font-semibold mb-2'>Player 2</h2>
            <p className='text-lg'>Count: {player2Hand.length}</p>
            <div>
              <p className='text-lg'>Card: {player2Hand[0]}</p>
            </div>
          </div>
        </div>

        {/* Display the winner of the round */}
        {gameStatus && (
          <div className='mt-4'>
            <p className='text-lg'>Round Result: {gameStatus}</p>
          </div>
        )}

        {!gameOver ? (
          <button
            onClick={playGameRound}
            className='m-4 mt-8 text-xl font-semibold rounded-lg px-4 py-2 border border-transparent bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Play Round
          </button>
        ) : (
          <h2 className='m-4 mt-8 text-xl font-semibold rounded-lg px-4 py-2 border border-transparent bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
            Press Restart Game Please.
          </h2>
        )}
        <button
          onClick={restartGame}
          className='m-4 mt-8 text-xl font-semibold rounded-lg px-4 py-2 border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Restart Game
        </button>
      </div>
    </main>
  );
}

export default Home;
