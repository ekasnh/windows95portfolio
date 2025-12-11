import React, { useState, useCallback, useEffect } from 'react';
import { Window } from '../win95/Window';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  value: CardValue;
  faceUp: boolean;
  id: string;
}

type Pile = Card[];

interface GameState {
  stock: Pile;
  waste: Pile;
  foundations: [Pile, Pile, Pile, Pile];
  tableau: [Pile, Pile, Pile, Pile, Pile, Pile, Pile];
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const getSuitSymbol = (suit: Suit) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

const isRed = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

const getValueIndex = (value: CardValue): number => VALUES.indexOf(value);

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, faceUp: false, id: `${value}-${suit}` });
    }
  }
  return deck;
};

const shuffle = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const dealCards = (): GameState => {
  const deck = shuffle(createDeck());
  const tableau: [Pile, Pile, Pile, Pile, Pile, Pile, Pile] = [[], [], [], [], [], [], []];
  
  let cardIndex = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      const card = { ...deck[cardIndex++] };
      card.faceUp = j === i;
      tableau[j].push(card);
    }
  }

  return {
    stock: deck.slice(cardIndex),
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  };
};

export const SolitaireGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(dealCards());
  const [selectedCard, setSelectedCard] = useState<{ pile: string; index: number } | null>(null);
  const [moves, setMoves] = useState(0);

  const drawFromStock = () => {
    setGameState(prev => {
      if (prev.stock.length === 0) {
        // Reset stock from waste
        return {
          ...prev,
          stock: prev.waste.map(c => ({ ...c, faceUp: false })).reverse(),
          waste: [],
        };
      }
      
      const card = { ...prev.stock[prev.stock.length - 1], faceUp: true };
      return {
        ...prev,
        stock: prev.stock.slice(0, -1),
        waste: [...prev.waste, card],
      };
    });
    setMoves(m => m + 1);
  };

  const canMoveToFoundation = (card: Card, foundationIndex: number): boolean => {
    const foundation = gameState.foundations[foundationIndex];
    if (foundation.length === 0) {
      return card.value === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && getValueIndex(card.value) === getValueIndex(topCard.value) + 1;
  };

  const canMoveToTableau = (card: Card, tableauIndex: number): boolean => {
    const pile = gameState.tableau[tableauIndex];
    if (pile.length === 0) {
      return card.value === 'K';
    }
    const topCard = pile[pile.length - 1];
    return isRed(card.suit) !== isRed(topCard.suit) && 
           getValueIndex(card.value) === getValueIndex(topCard.value) - 1;
  };

  const handleCardClick = (pile: string, cardIndex: number) => {
    if (selectedCard) {
      // Try to move card
      const sourcePile = selectedCard.pile;
      const sourceIndex = selectedCard.index;

      if (pile.startsWith('foundation-') && sourcePile !== pile) {
        const foundationIndex = parseInt(pile.split('-')[1]);
        let sourceCards: Card[] = [];
        
        if (sourcePile === 'waste') {
          sourceCards = [gameState.waste[gameState.waste.length - 1]];
        } else if (sourcePile.startsWith('tableau-')) {
          const tabIndex = parseInt(sourcePile.split('-')[1]);
          sourceCards = gameState.tableau[tabIndex].slice(sourceIndex);
        }

        if (sourceCards.length === 1 && canMoveToFoundation(sourceCards[0], foundationIndex)) {
          moveCard(sourcePile, sourceIndex, pile, foundationIndex);
          setSelectedCard(null);
          return;
        }
      }

      if (pile.startsWith('tableau-') && sourcePile !== pile) {
        const tableauIndex = parseInt(pile.split('-')[1]);
        let sourceCards: Card[] = [];
        
        if (sourcePile === 'waste') {
          sourceCards = [gameState.waste[gameState.waste.length - 1]];
        } else if (sourcePile.startsWith('tableau-')) {
          const tabIndex = parseInt(sourcePile.split('-')[1]);
          sourceCards = gameState.tableau[tabIndex].slice(sourceIndex);
        }

        if (sourceCards.length > 0 && canMoveToTableau(sourceCards[0], tableauIndex)) {
          moveCard(sourcePile, sourceIndex, pile, tableauIndex);
          setSelectedCard(null);
          return;
        }
      }

      setSelectedCard(null);
    } else {
      setSelectedCard({ pile, index: cardIndex });
    }
  };

  const moveCard = (sourcePile: string, sourceIndex: number, destPile: string, destIndex: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      let cards: Card[] = [];

      if (sourcePile === 'waste') {
        cards = [newState.waste.pop()!];
      } else if (sourcePile.startsWith('tableau-')) {
        const tabIndex = parseInt(sourcePile.split('-')[1]);
        cards = newState.tableau[tabIndex].splice(sourceIndex);
        // Flip the new top card
        if (newState.tableau[tabIndex].length > 0) {
          newState.tableau[tabIndex][newState.tableau[tabIndex].length - 1].faceUp = true;
        }
      }

      if (destPile.startsWith('foundation-')) {
        newState.foundations[destIndex].push(...cards);
      } else if (destPile.startsWith('tableau-')) {
        newState.tableau[destIndex].push(...cards);
      }

      return { ...newState };
    });
    setMoves(m => m + 1);
  };

  const autoMoveToFoundation = () => {
    // Try to auto-move cards to foundation
    let moved = false;
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      
      // Check waste
      if (newState.waste.length > 0) {
        const card = newState.waste[newState.waste.length - 1];
        for (let i = 0; i < 4; i++) {
          if (canMoveToFoundation(card, i)) {
            newState.waste.pop();
            newState.foundations[i].push({ ...card });
            moved = true;
            break;
          }
        }
      }

      // Check tableau
      if (!moved) {
        for (let t = 0; t < 7; t++) {
          if (newState.tableau[t].length > 0) {
            const card = newState.tableau[t][newState.tableau[t].length - 1];
            if (card.faceUp) {
              for (let i = 0; i < 4; i++) {
                if (canMoveToFoundation(card, i)) {
                  newState.tableau[t].pop();
                  newState.foundations[i].push({ ...card });
                  if (newState.tableau[t].length > 0) {
                    newState.tableau[t][newState.tableau[t].length - 1].faceUp = true;
                  }
                  moved = true;
                  break;
                }
              }
            }
          }
          if (moved) break;
        }
      }

      return moved ? newState : prev;
    });
    if (moved) setMoves(m => m + 1);
  };

  const renderCard = (card: Card | null, pile: string, index: number, offset = 0) => {
    if (!card) {
      return (
        <div 
          className="playing-card border-dashed opacity-30 cursor-pointer"
          onClick={() => handleCardClick(pile, index)}
        />
      );
    }

    const isSelected = selectedCard?.pile === pile && selectedCard?.index === index;

    if (!card.faceUp) {
      return (
        <div 
          className="playing-card card-back"
          style={{ marginTop: offset > 0 ? -76 : 0 }}
        />
      );
    }

    return (
      <div 
        className={`playing-card ${isRed(card.suit) ? 'card-red' : 'card-black'} ${isSelected ? 'ring-2 ring-primary' : ''} cursor-pointer`}
        style={{ marginTop: offset > 0 ? -76 : 0 }}
        onClick={() => handleCardClick(pile, index)}
      >
        <div className="text-xs font-bold">{card.value}{getSuitSymbol(card.suit)}</div>
        <div className="flex-1 flex items-center justify-center text-2xl">
          {getSuitSymbol(card.suit)}
        </div>
        <div className="text-xs font-bold self-end rotate-180">{card.value}{getSuitSymbol(card.suit)}</div>
      </div>
    );
  };

  const isWon = gameState.foundations.every(f => f.length === 13);

  return (
    <Window id="solitaire" icon="🃏">
      <div className="p-2 font-win95 text-foreground">
        {/* Status bar */}
        <div className="flex justify-between items-center mb-2">
          <span>Moves: {moves}</span>
          <div className="flex gap-2">
            <button className="win95-button" onClick={autoMoveToFoundation}>Auto</button>
            <button className="win95-button" onClick={() => { setGameState(dealCards()); setMoves(0); setSelectedCard(null); }}>
              New Game
            </button>
          </div>
        </div>

        {isWon && (
          <div className="win95-border-inset bg-win95-white p-4 mb-2 text-center font-bold text-lg">
            🎉 You Win! 🎉
          </div>
        )}

        {/* Top row: Stock, Waste, Foundations */}
        <div className="flex gap-2 mb-4">
          {/* Stock */}
          <div 
            className="playing-card card-back cursor-pointer"
            onClick={drawFromStock}
          >
            {gameState.stock.length === 0 && <div className="playing-card border-dashed opacity-30" />}
          </div>

          {/* Waste */}
          <div>
            {gameState.waste.length > 0 ? (
              renderCard(gameState.waste[gameState.waste.length - 1], 'waste', gameState.waste.length - 1)
            ) : (
              <div className="playing-card border-dashed opacity-30" />
            )}
          </div>

          <div className="w-8" />

          {/* Foundations */}
          {gameState.foundations.map((foundation, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(`foundation-${i}`, foundation.length)}
            >
              {foundation.length > 0 ? (
                renderCard(foundation[foundation.length - 1], `foundation-${i}`, foundation.length - 1)
              ) : (
                <div className="playing-card border-dashed opacity-30 flex items-center justify-center text-xl">
                  {getSuitSymbol(SUITS[i])}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-2">
          {gameState.tableau.map((pile, pileIndex) => (
            <div key={pileIndex} className="relative" style={{ minHeight: 200 }}>
              {pile.length === 0 ? (
                <div 
                  className="playing-card border-dashed opacity-30 cursor-pointer"
                  onClick={() => handleCardClick(`tableau-${pileIndex}`, 0)}
                />
              ) : (
                pile.map((card, cardIndex) => (
                  <div 
                    key={card.id} 
                    style={{ 
                      position: cardIndex === 0 ? 'relative' : 'absolute',
                      top: cardIndex * 20,
                      zIndex: cardIndex,
                    }}
                  >
                    {renderCard(card, `tableau-${pileIndex}`, cardIndex)}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
