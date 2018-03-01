/* eslint-env browser */

const cards = document.querySelectorAll('.main__card');
const buttonNewGame = document.querySelector('.main__new-game');
const numberOfTurns = document.querySelector('.main__turns');
const board = document.querySelector('.main__board');
let cardsFront;


// IIFE for a local scope for a game
(function autorun() {
  // ============
  // Total number of shown pairs of cards can be easily changed
  // Remember to change main.scss => .main__board => grid size
  // ============
  const numberOfPairs = 9;

  let activeCard = null;
  let movesNumber = 0;
  let canClick = true; // to prevent clicking on another cards while animation

  // Make an array of 9 (depends on pairs of cards on the desk) random indexes of cards.
  // These indexes will be grabbed from the cardDeck array to make a new set every new game.
  const randomIndexesOfCards = (pairsNum) => {
    const outputArray = [];

    // Looping until needed number of random indexes is obtained
    while (outputArray.length < pairsNum) {
      const tempRandomNumber = Math.floor(Math.random() * 52); // 52 - is a number of cards + 1
      if (!outputArray.includes(tempRandomNumber)) outputArray.push(tempRandomNumber);
    }
    return outputArray;
  };


  // Function to make an array of randomly picked pairs on the desk
  // Every next two numbers numbers in the array is a pair
  const randomIndexesOfPairs = (pairsNum) => {
    const cardsNum = pairsNum * 2;
    const outputArray = [];

    // Looping until needed number of random indexes is obtained
    while (outputArray.length < cardsNum) {
      const tempRandomNumber = Math.floor(Math.random() * (cardsNum + 1));
      if (!outputArray.includes(tempRandomNumber)) outputArray.push(tempRandomNumber);
    }
    return outputArray;
  };


  // Make the array of cards' filenames.
  // This's an unnecessary step. All these names could be added manually.
  const cardDeck = (function filenames() {
    const extension = '.png';
    const array = [];
    const suites = ['C', 'D', 'H', 'S'];
    for (let i = 1; i < 14; i += 1) {
      suites.forEach((suite) => {
        switch (i) {
          case 1:
            array.push(`A${suite}${extension}`);
            break;
          case 11:
            array.push(`J${suite}${extension}`);
            break;
          case 12:
            array.push(`Q${suite}${extension}`);
            break;
          case 13:
            array.push(`K${suite}${extension}`);
            break;
          default:
            array.push(`${i}${suite}${extension}`);
            break;
        }
      });
    }
    return array;
  }());

  // Function to create needed number of cards in the DOM
  const pushCardsInDom = (num) => {
    const documentFragment = document.createDocumentFragment();
    const totalCards = num * 2;

    for (let i = 0; i < totalCards; i += 1) {
      const mainCardWrapper = document.createElement('div');
      const mainCard = document.createElement('div');
      const cardBack = document.createElement('div');
      const cardIcon = document.createElement('img');
      const s = document.createElement('div');

      mainCardWrapper.classList.add('main__card-wrapper');
      mainCard.classList.add('main__card');
      cardBack.classList.add('card__back');
      cardIcon.classList.add('card__icon');
      s.classList.add('card__front');

      cardBack.appendChild(cardIcon);
      mainCard.appendChild(cardBack);
      mainCard.appendChild(s);
      mainCardWrapper.appendChild(mainCard);
      documentFragment.appendChild(mainCardWrapper);
    }

    board.appendChild(documentFragment);
  };


  // Print number of moves
  const printMoves = (num) => {
    numberOfTurns.textContent = num + (num === 1 ? ' Move' : ' Moves');
  };


  // Function on card click
  const clicked = (e) => {
    if (activeCard && canClick) {
      // Every click after selecting any card will be counted as one move

      // Clicking on the same card will remove its selection and flip it
      if (e.target === activeCard) {
        activeCard.classList.remove('card__flipped');
        canClick = false;
        activeCard = null;
        movesNumber += 1;
        printMoves(movesNumber);
        setTimeout(() => {
          canClick = true;
        }, 300);

        // Got a pair, it'll mark them and mute event listeners
      } else if (
        e.target.querySelector('.card__icon').className ===
          activeCard.querySelector('.card__icon').className
      ) {
        e.target.classList.add('card__flipped');
        canClick = false;
        setTimeout(() => {
          e.target.classList.add('shake');
          activeCard.classList.add('shake');
          activeCard = null;
          setTimeout(() => {
            canClick = true;
          }, 300);
        }, 700);
        e.target.classList.add('card__no-events'); // This class will mute any eventListener
        activeCard.classList.add('card__no-events');
        movesNumber += 1;
        printMoves(movesNumber);

        // Wrong pair, remove selection from the both cards
      } else {
        e.target.classList.add('card__flipped');
        canClick = false;

        /* Somehow 'shake' and 'card__flipped' transforms are interacting.
          So I made an extra setTimeout with 100ms to prevent bugs.
          Other timeouts are needed to change classes, each transformation lasts 700ms */
        setTimeout(() => {
          e.target.classList.add('shake');
          activeCard.classList.add('shake');

          // Do after shake animation
          setTimeout(() => {
            activeCard.classList.remove('shake');
            e.target.classList.remove('shake');
            setTimeout(() => {
              activeCard.classList.remove('card__flipped');
              e.target.classList.remove('card__flipped');
              activeCard = null;
              setTimeout(() => {
                canClick = true;
              }, 200);
            }, 100);
          }, 700);
        }, 700);

        movesNumber += 1;
        printMoves(movesNumber);
      }

      // Mark a card as selected one
    } else if (canClick) {
      activeCard = e.target;
      canClick = false;
      activeCard.classList.add('card__flipped');
      setTimeout(() => {
        canClick = true;
      }, 300);
    }
  };

  // Function to start a New game
  const newGame = () => {
    // Set randomly picked pairs of cards
    const randomCardsArray = randomIndexesOfPairs(numberOfPairs);

    // Set randomly picked indexes of cards
    const randomCardsIndexesArray = randomIndexesOfCards(numberOfPairs);

    // Reset number of moves and active card
    activeCard = null;
    movesNumber = 0;

    // Check if there are no needed number of cards on the board
    cardsFront = document.querySelectorAll('.card__front');
    if (cardsFront.length !== numberOfPairs * 2) {
      // Remove all cards
      while (board.hasChildNodes()) {
        board.removeChild(board.lastChild);
      }

      // Add new set of cards
      pushCardsInDom(numberOfPairs);
      cardsFront = document.querySelectorAll('.card__front');
    }

    // Set number of moves to 0
    printMoves(movesNumber);

    // Remove all temporary classes and showing cards for 3 seconds
    canClick = false;
    cards.forEach((card) => {
      card.classList.remove('shake', 'card__flipped', 'card__no-events');

      // Timeout is needed to do properly opening animation to previously opened cards
      setTimeout(() => {
        card.classList.add('card__flipped');

        // Timer to show cards at the start of the game
        setTimeout(() => {
          card.classList.remove('card__flipped');
          setTimeout(() => {
            canClick = true;
          }, 300);
        }, 2000); // number of milliseconds to show the cards at the start of the game
      }, 0);
    });
  };

  // Clicking on New Game button
  buttonNewGame.addEventListener('click', newGame);

  // Clicking on cards
  cards.forEach((card) => {
    card.addEventListener('click', clicked);
  });

  // Starting a new game
  // newGame();
}());
