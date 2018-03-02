/* eslint-env browser */

// TODO
// открытую карту нельзя закрыть
// открытая пара исчезает

// IIFE for a local scope for a game
(function autorun() {
  const buttonNewGame = document.querySelector('.main__new-game');
  const pointsNumber = document.querySelector('.main__points');
  const board = document.querySelector('.main__board');
  let cardsFront;
  let cards;

  // ============
  // Total number of shown pairs of cards can be easily changed
  // Remember to change main.scss => .main__board => grid size
  // ============
  const numberOfPairs = 9;

  let activeCard = null;
  let canClick = true; // to prevent clicking on another cards while animation


  // Module to count total amount of points
  const pointsCounter = (function iife() {
    let points = 0;
    let openedPairs = 0;
    return {
      get finalPoints() {
        return points;
      },
      reset() {
        points = 0;
        openedPairs = 0;
      },
      counting(direction) {
        if (direction === 'plus') {
          openedPairs += 1;
          points += (numberOfPairs - openedPairs) * 42;
        } else if (direction === 'minus') {
          points -= openedPairs * 42;
        }
      },
    };
  }());

  // Function to print total points
  const printPoints = (number) => {
    pointsNumber.textContent = number;
  };


  // Function to make an array of 9 (depends on numberOfPairs variable) random indexes of cards.
  // These indexes will be taken from the cardDeck array to make a new set of cards every new game.
  const randomIndexesOfCards = (pairsNum) => {
    const outputArray = [];

    // Looping until needed number of random indexes is obtained
    while (outputArray.length < pairsNum) {
      const tempRandomNumber = Math.floor(Math.random() * 52); // 52 - is a number of cards + 1
      if (!outputArray.includes(tempRandomNumber)) outputArray.push(tempRandomNumber);
    }
    return outputArray;
  };


  // Function to make an array of randomly picked 9 pairs (numberOfPairs variable) on the desk
  // Every next two numbers numbers in the array is a pair
  const randomIndexesOfPairs = (pairsNum) => {
    const cardsNum = pairsNum * 2;
    const outputArray = [];

    // Looping until needed number of random indexes is obtained
    while (outputArray.length < cardsNum) {
      const tempRandomNumber = Math.floor(Math.random() * (cardsNum));
      if (!outputArray.includes(tempRandomNumber)) outputArray.push(tempRandomNumber);
    }
    return outputArray;
  };


  // Make the array of cards' filenames.
  // This's an unnecessary step. All these names could be added manually.
  const cardDeck = (function filenames() {
    const extension = '.svg';
    const array = [];
    const suites = ['clubs', 'diamonds', 'hearts', 'spades'];
    for (let i = 1; i < 14; i += 1) {
      suites.forEach((suite) => {
        switch (i) {
          case 1:
            array.push(`ace_of_${suite}${extension}`);
            break;
          case 11:
            array.push(`jack_of_${suite}${extension}`);
            break;
          case 12:
            array.push(`queen_of_${suite}${extension}`);
            break;
          case 13:
            array.push(`king_of_${suite}${extension}`);
            break;
          default:
            array.push(`${i}_of_${suite}${extension}`);
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
      const cardBackIcon = document.createElement('img');
      const cardFront = document.createElement('div');
      const cardFrontIcon = document.createElement('img');

      mainCardWrapper.classList.add('main__card-wrapper');
      mainCard.classList.add('main__card');
      cardBack.classList.add('card__back');
      cardBackIcon.src = 'images/card_back.png';
      cardFront.classList.add('card__front');
      cardFrontIcon.classList.add('card__icon');

      cardBack.appendChild(cardBackIcon);
      mainCard.appendChild(cardBack);
      cardFront.appendChild(cardFrontIcon);
      mainCard.appendChild(cardFront);
      mainCardWrapper.appendChild(mainCard);
      documentFragment.appendChild(mainCardWrapper);
    }

    board.appendChild(documentFragment);
  };


  // Function on card click
  const clicked = (e) => {
    if (activeCard && canClick) {
      // Every click after selecting any card will be counted as one move

      // Clicking on the same card will remove its selection and flip it
      if (e.target === activeCard) {
        e.target.classList.add('card__no-events'); // This class will mute any eventListener

      // Got a pair, it'll mark both cards and mute event listeners
      } else if (
        e.target.querySelector('.card__icon').src ===
          activeCard.querySelector('.card__icon').src
      ) {
        e.target.classList.add('card__flipped');
        canClick = false;
        pointsCounter.counting('plus');
        printPoints(pointsCounter.finalPoints);

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

        // Wrong pair, remove selection from the both cards
      } else {
        e.target.classList.add('card__flipped');
        canClick = false;
        pointsCounter.counting('minus');
        printPoints(pointsCounter.finalPoints);

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
              activeCard.classList.remove('card__flipped', 'card__no-events');
              e.target.classList.remove('card__flipped');
              activeCard = null;
              setTimeout(() => {
                canClick = true;
              }, 200);
            }, 100);
          }, 700);
        }, 700);
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
    const randomPairsArray = randomIndexesOfPairs(numberOfPairs);

    // Set randomly picked indexes of cards
    const randomCardsIndexesArray = randomIndexesOfCards(numberOfPairs);

    // Reset number of points, opened pairs and active card
    activeCard = null;
    pointsCounter.reset();

    cardsFront = document.querySelectorAll('.card__icon');
    // Remove all cards
    while (board.hasChildNodes()) {
      board.removeChild(board.lastChild);
    }

    // Add new set of cards
    pushCardsInDom(numberOfPairs);
    // Fill the NodeList of .card__icon elements
    cardsFront = document.querySelectorAll('.card__icon');

    // Add card images. It iterates through every index of pairs array,
    // then take a random card index from the randomCardsIndexes and add src to the every card.
    randomPairsArray.forEach((randomPair, index) => {
      if (index % 2 === 0) {
        const randomCardIndex = randomCardsIndexesArray[index / 2];
        cardsFront[randomPair].src = `images/${cardDeck[randomCardIndex]}`;
      } else {
        const randomCardIndex = randomCardsIndexesArray[(index - 1) / 2];
        cardsFront[randomPair].src = `images/${cardDeck[randomCardIndex]}`;
      }
    });

    // Cards variable can be assigned only after adding cards to DOM
    cards = document.querySelectorAll('.main__card');
    // Clicking on cards
    cards.forEach((card) => {
      card.addEventListener('click', clicked);
    });

    // Print number of points
    printPoints(pointsCounter.finalPoints);
  };

  // Clicking on New Game button
  buttonNewGame.addEventListener('click', newGame);
}());
