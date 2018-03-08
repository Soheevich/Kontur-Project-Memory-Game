/* eslint-env browser */

// My first attempt with MVC pattern
(function autorun() {
  /* =================
  MODEL
  ================== */
  const model = (function modelAutorun() {
    const deck = [];
    let cardNames;
    let randomCards = [];
    let score = 0;
    let openedPairs = 0;
    let numberOfPairs;

    return {
      init(totalPairs) {
        numberOfPairs = totalPairs;
        cardNames = this.createCardNamesArray();
        cardNames.forEach((cardName) => {
          const title = cardName.split('-').join(' of ');
          const src = this.createCardFilenames(cardName);
          const temporaryCard = this.createCard(cardName, title, src);

          deck.push(temporaryCard);
        });
      },

      reset() {
        randomCards = [];
        score = 0;
        openedPairs = 0;
      },

      getRandomCards() {
        return randomCards;
      },

      getScore() {
        return score;
      },

      createCard(dataId, alt, src) {
        return { dataId, alt, src };
      },

      createCardNamesArray() {
        return (function idArray() {
          const array = [];
          const suites = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
          suites.forEach((suite) => {
            for (let i = 1; i < 14; i += 1) {
              switch (i) {
                case 1:
                  array.push(`Ace-${suite}`);
                  break;
                case 11:
                  array.push(`Jack-${suite}`);
                  break;
                case 12:
                  array.push(`Queen-${suite}`);
                  break;
                case 13:
                  array.push(`King-${suite}`);
                  break;
                default:
                  array.push(`${i}-${suite}`);
                  break;
              }
            }
          });

          return array;
        }());
      },

      createCardFilenames(inputName) {
        const outputFilename = `images/${inputName}.svg`;
        return outputFilename;
      },

      makeRandomNumber(max) {
        return Math.floor(Math.random() * (max));
      },

      makeRandomPairs(number) {
        const totalPairs = number * 2;
        const tempArray = [];

        while (tempArray.length < totalPairs) {
          const tempRandomCardIndex = this.makeRandomNumber(52);

          if (!tempArray.includes(tempRandomCardIndex)) {
            tempArray.push(tempRandomCardIndex, tempRandomCardIndex);
          }
        }

        for (let i = tempArray.length - 1; i > 0; i -= 1) {
          const j = this.makeRandomNumber(i + 1);
          const temp = tempArray[i];
          tempArray[i] = tempArray[j];
          tempArray[j] = temp;
        }

        tempArray.forEach((cardIndex) => {
          randomCards.push(deck[cardIndex]);
        });
      },

      countingScore(action) {
        if (action === 'plus') {
          openedPairs += 1;
          score += (numberOfPairs - openedPairs) * 42;
        } else if (action === 'minus') {
          score -= openedPairs * 42;
        }
      },
    };
  }());


  /* =================
  VIEW
  ================== */
  const view = (function viewAutorun() {
    const mainBoard = document.querySelector('.main__board');
    let animationTime;
    let scoreSpan;

    return {
      init(time) {
        animationTime = time;
        const img = this.createElement('img', {
          className: 'main__start-image',
          src: 'images/StartGame.png',
        });
        const title = this.createElement(
          'h1',
          { className: 'main__title' },
          'memory game',
        );
        const button = this.createElement(
          'button',
          { className: 'main__new-game' },
          'Начать игру',
        );
        const article = this.createElement(
          'article',
          { className: 'main__start-screen' },
          img,
          title,
          button,
        );

        button.addEventListener('click', controller.newGame);

        mainBoard.appendChild(article);
      },

      reset() {
        const mainCards = document.querySelector('.main__cards');

        mainCards.remove();
      },

      createElement(tag, attrs, ...children) {
        const element = document.createElement(tag);

        Object.keys(attrs).forEach((key) => {
          if (key === 'dataId') {
            element.dataset.id = attrs[key];
          } else {
            element[key] = attrs[key];
          }
        });

        children.forEach((child) => {
          let tempChild = child;
          if (typeof tempChild === 'string') {
            tempChild = document.createTextNode(child);
          }
          element.appendChild(tempChild);
        });

        return element;
      },

      newGame(cardsArray, startTime) {
        const startScreen = document.querySelector('.main__start-screen');
        const fragment = document.createDocumentFragment();

        if (!document.querySelector('.main__controls')) {
          const resetGameButton = this.createElement(
            'span',
            { className: 'controls__new-game' },
            'Начать заново',
          );
          const scoreTitle = this.createElement(
            'span',
            { className: 'controls__title' },
            'Очки: ',
          );
          const score = this.createElement('span', { className: 'controls__score' });
          const scoreWrapper = this.createElement(
            'div',
            { className: 'controls__wrapper' },
            scoreTitle,
            score,
          );
          const controls = this.createElement(
            'section',
            { className: 'main__controls' },
            resetGameButton,
            scoreWrapper,
          );

          resetGameButton.addEventListener('click', controller.resetGame);
          fragment.appendChild(controls);
        }

        if (startScreen) startScreen.remove();

        const mainCardsGrid = this.createElement(
          'div',
          { className: 'main__cards-grid' },
        );
        cardsArray.forEach((card) => {
          const tempCard = this.addCard(card.dataId, card.alt, card.src);

          mainCardsGrid.appendChild(tempCard);
          tempCard.addEventListener('click', controller.onCardClick);
        });
        const mainCards = this.createElement(
          'section',
          { className: 'main__cards' },
          mainCardsGrid,
        );

        fragment.appendChild(mainCards);
        mainBoard.appendChild(fragment);
        scoreSpan = document.querySelector('.controls__score');

        // Show all cards at the start of every new game
        document.querySelectorAll('.main__card').forEach((card) => {
          setTimeout(() => {
            card.classList.add('card__flipped');
            setTimeout(() => {
              card.classList.remove('card__flipped');
            }, startTime);
          }, 100);
        });
      },

      addCard(dataId, alt, src) {
        const cardBackIcon = this.createElement(
          'img',
          {
            src: 'images/card_back.svg',
            alt: 'Back of the card',
          },
        );
        const cardBack = this.createElement(
          'div',
          { className: 'card__back' },
          cardBackIcon,
        );
        const cardFrontIcon = this.createElement(
          'img',
          {
            className: 'card__icon',
            dataId,
            src,
            alt,
          },
        );
        const cardFront = this.createElement(
          'div',
          { className: 'card__front' },
          cardFrontIcon,
        );
        const mainCard = this.createElement(
          'div',
          { className: 'main__card' },
          cardBack,
          cardFront,
        );
        const mainCardWrapper = this.createElement(
          'div',
          { className: 'main__card-wrapper' },
          mainCard,
        );

        return mainCardWrapper;
      },

      // Open clicked card
      openCard(event) {
        event.target.classList.toggle('card__flipped');
      },

      // Print total score
      printScore(number) {
        scoreSpan.textContent = number;
      },
    };
  }());


  /* =================
  CONTROLLER
  ================== */
  const controller = (function controllerAutorun() {
    // ============
    // Total number of shown pairs of cards can be changed
    // Remember to change main.scss => .main__board => grid size
    // ============
    const numberOfPairs = 9;
    const startTime = 2000; // time to show cards at the start of the game
    const animationTime = 500;
    let activeCard = null;
    let canClick = true; // to prevent clicking on another cards while animation

    return {
      init() {
        model.init(numberOfPairs);
        view.init(animationTime);
      },

      newGame() {
        canClick = false;
        model.makeRandomPairs(numberOfPairs);
        view.newGame(model.getRandomCards(), startTime);
        setTimeout(() => {
          canClick = true;
        }, startTime + animationTime);
        view.printScore(model.getScore());
      },

      resetGame() {
        model.reset();
        view.reset();
        model.makeRandomPairs(numberOfPairs);
        view.newGame(model.getRandomCards(), startTime);
      },

      onCardClick(event) {
        view.openCard(event);
      },
    };
  }());

  controller.init();
}());
